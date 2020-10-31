const jwt = require('jsonwebtoken');
const Models = require(`${SERVER_MODELS_DIR}`);
const { User, Role, UserRole, Privilege, Link, Company } = Models;
const ObjectId = require('mongoose').Types.ObjectId;
const { data, checkServicePermission } = require('./servicesPermission');
const multer = require('multer');
const fs = require('fs');
const CryptoJS = require("crypto-js");
const { initModels, connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * ****************************************
 * Middleware xác thực truy cập người dùng
 * 1.Kiểm tra người dùng đã xác thực
 * 2.Kiểm tra xem JWT của người dùng có hợp lệ hay không? (đang được sử dụng, cùng fingerprint?...)
 * 3.Kiểm tra xem người dùng có role hợp lệ hay không?
 * 4.Kiểm tra người dùng có được phép truy cập vào link hay không?
 * ****************************************
 */

exports.authFunc = (checkPage = true) => {
    return async (req, res, next) => {
        try {
            const token = req.header('auth-token'); //JWT nhận từ người dùng
            /**
             * Nếu không có JWT được gửi lên -> người dùng chưa đăng nhập
             */
            if (!token) throw ['access_denied'];

            /**
             * Giải mã token gửi lên để check dữ liệu trong token
             */
            let verified;
            try { verified = await jwt.verify(token, process.env.TOKEN_SECRET); } 
            catch (error) { throw ['access_denied']; }

            req.user = verified;
            req.token = token;

            /**
             * Xác định db truy vấn cho request
             */
            req.portal = !req.user.company ? process.env.DB_NAME : req.user.company.shortName;
            initModels(connect(DB_CONNECTION, req.portal), Models);

            if (req.header('current-page') !== '/') {

                const fingerprint = req.header('fingerprint'); //chữ ký của trình duyệt người dùng - fingerprint
                const currentRole = req.header('current-role');
                if (!ObjectId.isValid(currentRole)) {
                    throw ["role_invalid"]; //trả về lỗi nếu current role là một giá trị không xác định
                }

                const role = await Role(connect(DB_CONNECTION, req.portal)).findById(currentRole); //current role của người dùng
                if (role === null) throw ["role_invalid"];
                /**
                 * So sánh  fingerprint trong token với fingerprint được gửi lên từ máy của người dùng
                 * Nếu hai fingerprint này giống nhau -> token được tạo ra và gửi đi từ cùng một trình duyệt trên cùng 1 thiết bị
                 * Nếu hai fingerprint này khác nhau -> token đã bị lấy cắp và gửi từ một trình duyệt trên thiết bị khác
                 */
                if (verified.fingerprint !== fingerprint) throw ['fingerprint_invalid']; // phát hiện lỗi client copy jwt và paste vào localstorage của trình duyệt để không phải đăng nhập

                const userToken = await User(connect(DB_CONNECTION, req.portal)).findById(req.user._id);
                if (userToken.numberDevice === 0) throw ['acc_log_out'];

                /**
                 * Kiểm tra xem current role có đúng với người dùng hay không?
                 */
                const userId = req.user._id;
                const userrole = await UserRole(connect(DB_CONNECTION, req.portal)).findOne({
                    userId,
                    roleId: role._id
                });
                if (userrole === null) throw ['user_role_invalid'];
                /**
                 * Riêng đối với system admin của hệ thống thì bỏ qua bước này
                 */
                if (role.name !== 'System Admin') {
                    /**
                     * Kiểm tra công ty của người dùng có đang được kích hoạt hay không?
                     */
                    const company = await Company(connect(DB_CONNECTION, process.env.DB_NAME)).findById(req.user.company._id);
                    if (!company.active) { //dịch vụ của công ty người dùng đã tạm dừng
                        const resetUser = await User(connect(DB_CONNECTION, req.portal)).findById(req.user._id);
                        resetUser.tokens = []; //đăng xuất tất cả các phiên đăng nhập của người dùng khỏi hệ thống
                        await resetUser.save();
                        throw ['service_off'];
                    };
                }

                /**
                 * Kiểm tra xem current-role của người dùng có được phép truy cập vào trang này hay không?
                 * Lấy đường link mà người dùng đã truy cập 
                 * Sau đó check trong bảng privilege xem có tồn tại cặp value tương ứng giữa current-role của user với đường link của trang 
                 * Nếu tìm thấy dữ liệu -> Cho phép truy cập tiếp
                 * Ngược lại thì trả về thông báo lỗi không có quyền truy cập vào trang này
                 */

                //const url = req.headers.referer.substr(req.headers.origin.length, req.headers.referer.length - req.headers.origin.length);
                const url = req.header('current-page');
                const link = role.name !== 'System Admin' ?
                    await Link(connect(DB_CONNECTION, req.portal)).findOne({
                        url,
                        deleteSoft: false
                    }) :
                    await Link(connect(DB_CONNECTION, req.portal)).findOne({
                        url
                    });
                if (link === null) throw ['url_invalid'];

                if (checkPage) {
                    const roleArr = [role._id].concat(role.parents);
                    const privilege = await Privilege(connect(DB_CONNECTION, req.portal)).findOne({
                        resourceId: link._id,
                        resourceType: 'Link',
                        roleId: {
                            $in: roleArr
                        }
                    });
                    if (privilege === null) throw ('page_access_denied');
                }

                /**
                 * Kiểm tra xem user này có được gọi tới service này hay không?
                 */
                const path = req.route.path !== '/' ? req.baseUrl + req.route.path : req.baseUrl;
                // const checkSP = await checkServicePermission(req.portal, data, path, req.method, currentRole);
                // if (!checkSP) throw ['service_permission_invalid'];

            }

            next();

        } catch (error) {
            res.status(400).json({
                success: false,
                messages: error
            });
        }
    }
}
exports.auth = this.authFunc();


/**
 * Middleware check và lấy dữ liệu về file mà client người đến
 * @arrData : mảng các đối tượng chứa name - tên của thuộc tính lưu dữ liệu file
 * trong data mà client gửi lên, path - đường dẫn đến thư mục muốn lưu file
 * @type: kiểu upload file (single, array, fields)
 */
exports.uploadFile = (arrData, type) => {
    const staticPath = [
        "/avatars"
    ];
    var name, arrFile;
    // Tạo folder chứa file khi chưa có folder
    const checkExistUploads = async(portal) => {
        if(portal !== undefined)
            return await arrData.forEach(x => {
                if(staticPath.indexOf(x.path) !== -1){
                    let dir2 = `./upload/${x.path}/${portal}`;
                    if (!fs.existsSync(dir2)) {
                        fs.mkdirSync(dir2, {
                            recursive: true
                        });
                        fs.appendFile(dir2+'/README.txt', '', err => { 
                            if(err) throw err;
                        });
                    }
                }
                else {
                    let dir = `./upload/private/${portal}${x.path}`;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, {
                            recursive: true
                        });
                        fs.appendFile(dir+'/README.txt', '', err => { 
                            if(err) throw err;
                        });
                    }
                }
            })
    }

    const getFile = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                checkExistUploads(req.portal);

                if (type === 'single' || type === 'array') {
                    if (staticPath.indexOf(arrData[0].path) !== -1) {
                        cb(null, `./upload${arrData[0].path}/${req.portal}`);
                    } else {
                        cb(null, `./upload/private/${req.portal}${arrData[0].path}`);
                    }
                } else if (type === 'fields') {
                    for (let n in arrData) {
                        if (file.fieldname === arrData[n].name) {
                            if (staticPath.indexOf(arrData[n].path) !== -1) {
                                cb(null, `./upload${arrData[n].path}/${req.portal}`);
                            } else {
                                cb(null, `./upload/private/${req.portal}${arrData[n].path}`);
                            }
                            break;
                        }
                    }
                }
            },
            filename: function (req, file, cb) {
                let extend = file.originalname.split('.');
                let oldNameFile = extend.splice(0, extend.length - 1);
                oldNameFile = oldNameFile.join('.');
                let hash = `${req.user._id}_${Date.now()}_` + CryptoJS.MD5(oldNameFile).toString();
                cb(null, `${hash}.${extend[extend.length - 1]}`);
            }
        }),
    });

    switch (type) {
        case 'single':
            name = arrData[0].name;
            return getFile.single(name);
        case 'array':
            name = arrData[0].name;
            return getFile.array(name, 20);
        case 'fields':
            arrFile = arrData.map(x => {
                return {
                    name: x.name,
                    maxCount: 20
                }
            })
            return getFile.fields(arrFile);
        default:
            break;
    }
}
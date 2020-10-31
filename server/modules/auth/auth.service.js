const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const generator = require("generate-password");
const nodemailer = require("nodemailer");
const Models = require(`${SERVER_MODELS_DIR}`);
const { Privilege, Role, User, UserRole, Company } = Models;
const fs = require('fs');
const {connect, initModels} =  require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Phương thức đăng nhập
 */
exports.login = async (fingerprint, data) => { // data bao gom email va password
    if(!data.portal) throw ["portal_invalid"];

    let company;
    if(data.portal !== process.env.DB_NAME){
        company = await Company(connect(DB_CONNECTION, process.env.DB_NAME))
            .findOne({ shortName: data.portal });
        if(!company) throw ["portal_invalid"];
    }

    await initModels(connect(DB_CONNECTION, data.portal), Models); 

    const user = await User(connect(DB_CONNECTION, data.portal))
        .findOne({email : data.email})
        .populate([
            { path: 'roles', populate: { path: 'roleId'} },
        ]);

    if(!user) throw ["email_password_invalid"];
    const validPass = await bcrypt.compare(data.password, user.password);
    if(!validPass) {
        throw ['email_password_invalid'];
    }
    if(user.roles.length < 1) throw ['acc_have_not_role'];

    if(user.roles[0].roleId.name !== 'System Admin'){  
        if(!user.active) throw ['acc_blocked'];
        if(!company.active) throw ['service_off']
    }
    const token = await jwt.sign(
        {
            _id: user._id, 
            email: user.email, 
            name: user.name,
            company: user.roles[0].roleId.name !== 'System Admin' ? company : undefined,
            portal: user.roles[0].roleId.name !== 'System Admin' ? company.shortName : process.env.DB_NAME, 
            fingerprint: fingerprint
        }, 
        process.env.TOKEN_SECRET
    );
    
    user.status = 0;
    user.numberDevice += 1;
    user.save();

    return { 
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            company: user.roles[0].roleId.name !== 'System Admin' ? company : undefined, 
            portal: user.roles[0].roleId.name !== 'System Admin' ? company.shortName : process.env.DB_NAME, 
        }
    };
}

/**
 * Đăng xuất tài khoản người dùng
 * @param {*} id : id người dùng
 * @param {*} token 
 */
exports.logout = async (portal, id) => {
    var user = await User(connect(DB_CONNECTION, portal))
        .findById(id);

    if(user.numberDevice >= 1) user.numberDevice -= 1;
    user.save();

    return user;
}

/**
 * Đăng xuất tất cả tài khoản người dùng
 * @param {*} id : id người dùng
 */
exports.logoutAllAccount = async (portal, id) => {
    var user = await User(connect(DB_CONNECTION, portal))
        .findById(id);
    user.numberDevice = 0;
    await user.save();
    
    return user;
}

/**
 * Quên mật khẩu tài khoản người dùng
 * @email: email người dùng
 */
exports.forgetPassword = async (portal, email) => {
    var user = await User(connect(DB_CONNECTION, portal))
        .findOne({ email });
    if(user === null) throw["email_invalid"];
    var code = await generator.generate({ length: 6, numbers: true });
    user.resetPasswordToken = code;
    await user.save();
    var transporter = await nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });
    var mainOptions = {
        from: 'vnist.qlcv@gmail.com',
        to: email,
        subject: `${process.env.WEB_NAME} : Thay đổi mật khẩu - Change password`,
        html: `
        <div style="
            background-color:azure;
            padding: 100px;
            text-align: center;
        ">
            <h3>
                Yêu cầu xác thực thay đổi mật khẩu
            </h3>
            <p>Mã xác thực: <b style="color: red">${code}</b></p>
            <button style="
                padding: 8px 8px 8px 8px; 
                border: 1px solid rgb(4, 197, 30); 
                border-radius: 5px;
                background-color: #4CAF50"
            >
                <a 
                    style="
                        text-decoration: none;
                        color: white;
                        " 
                    href="${process.env.WEBSITE}/reset-password?portal=${portal}&otp=${code}&email=${email}"
                >
                    Xác thực
                </a>
            </button>
        </div>
        `
    }
    await transporter.sendMail(mainOptions);

    return true;
}

/**
 * Thiết lập lại mật khẩu người dùng
 * @param {*} otp 
 * @param {*} email 
 * @param {*} password 
 */
exports.resetPassword = async (portal, otp, email, password) => {
    var user = await User(connect(DB_CONNECTION, portal))
        .findOne({ email, resetPasswordToken: otp });
    if(user === null) throw ['otp_invalid'];
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    user.password = hash;
    user.resetPasswordToken=undefined;
    await user.save();

    return user;
}

/**
 * Thay đổi thông tin người dùng
 * @param {*} id 
 * @param {*} name 
 * @param {*} email 
 * @param {*} avatar 
 */
exports.changeInformation = async (portal, id, name, email, avatar=undefined) => {
    let user = await User(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'roles', populate: { path: 'roleId' } }
        ]);
    let deleteAvatar = '.'+user.avatar;
    user.email = email;
    user.name = name;
    if(avatar){
        if(deleteAvatar !== './upload/avatars/user.png' && fs.existsSync(deleteAvatar)) fs.unlinkSync(deleteAvatar);
        user.avatar = avatar;
    };
    await user.save();

    return user;
}

/**
 * Thay đổi mật khẩu
 * @param {*} id : id người dùng
 * @param {*} password : mật khẩu cũ
 * @param {*} new_password : mật khẩu mới
 */
exports.changePassword = async (portal, id, password, new_password) => {
    const user = await User(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'roles', populate: { path: 'roleId' } }
        ]);
    const validPass = await bcrypt.compare(password, user.password);
    // Kiểm tra mật khẩu cũ nhập vào có đúng hay không
    if(!validPass) throw ['password_invalid'];

    // Lưu mật khẩu mới
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(new_password, salt);
    user.password = hash;
    await user.save();

    return user;
}

/**
 * Lấy ra các trang mà người dùng có quyền truy cập
 * @param {*} idRole : id role người dùng
 */
exports.getLinksThatRoleCanAccess = async (portal, idRole) => {
    const role = await Role(connect(DB_CONNECTION, portal))
        .findById(idRole); //lay duoc role hien tai
    let roles = [role._id, ...role.parents];
    const privilege = await Privilege(connect(DB_CONNECTION, portal))
        .find({ 
            roleId: { $in: roles },
            resourceType: 'Link'
        })
        .populate({ path: 'resourceId' }); 
    const links = await privilege.filter(pri => pri.resourceId.deleteSoft === false).map( pri => pri.resourceId );

    return links;
}

/**
 * Lấy ra thông tn người dùng
 * @param {*} id : id người dùng
 */
exports.getProfile = async (portal, id) => {
    let user = await User(connect(DB_CONNECTION, portal))
        .findById(id)
        .select('-password -status -deleteSoft -tokens')
        .populate([
            { path: 'roles',  populate: { path: 'roleId' } }
        ]);
    if(user === null) throw['user_not_found'];
    
    return user;
}
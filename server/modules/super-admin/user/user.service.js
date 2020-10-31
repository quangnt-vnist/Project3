const { OrganizationalUnit, User, UserRole, Role, Company } = require(`${SERVER_MODELS_DIR}`);
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const generator = require("generate-password");
const OrganizationalUnitService = require(`${SERVER_MODULES_DIR}/super-admin/organizational-unit/organizationalUnit.service`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);
/**
 * Lấy danh sách tất cả user trong 1 công ty
 * @company id của công ty
 */
exports.getUsers = async (portal, company, query) => {
    var page = query.page;
    var limit = query.limit;
    var name = query.name;
    var userRole = query.userRole;
    var departmentIds = query.departmentIds;
    var departmentIds = query.departmentIds;
    var unitId = query.unitId;

    var keySearch = {company};
    if (!page && !limit && !userRole && !departmentIds && !unitId) {
        if (name) {
            keySearch = {
                ...keySearch,
                name: {
                    $regex: name,
                    $options: "i"
                }
            };

            let searchUses = await User(connect(DB_CONNECTION, portal))
                .find(keySearch)
                .select('-password -status -deleteSoft -tokens')
                .populate([{
                    path: 'roles',
                    populate: {
                        path: 'roleId'
                    }
                },
                {
                    path: 'company', model: Company(connect(DB_CONNECTION, process.env.DB_NAME))
                }
                ]);

            return {
                searchUses
            }
        } else {
            return await User(connect(DB_CONNECTION, portal))
                .find({
                    company
                })
                .select('-password -status -deleteSoft -tokens')
                .populate([{
                    path: 'roles',
                    populate: {
                        path: 'roleId'
                    }
                },
                {
                    path: 'company', model: Company(connect(DB_CONNECTION, process.env.DB_NAME))
                }
                ]);
        }
    } else if (page && limit && !userRole && !departmentIds && !unitId) {
        const option = (query.key && query.value) ?
            Object.assign({ company }, {
                [`${query.key}`]: new RegExp(query.value, "i")
            }) : {
                company
            };

        return await User(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page,
                limit,
                select: '-tokens -status -password -deleteSoft',
                populate: [{
                    path: 'roles',
                    populate: {
                        path: 'roleId'
                    }
                },
                {
                    path: 'company', model: Company(connect(DB_CONNECTION, process.env.DB_NAME))
                }
                ]
            });
    } else if (!page && !limit && (userRole || departmentIds) && !unitId) {
        if (userRole) {
            let department = await OrganizationalUnit(connect(DB_CONNECTION, portal))
                .findOne({
                    $or: [{
                        'deans': userRole
                    },
                    {
                        'viceDeans': userRole
                    },
                    {
                        'employees': userRole
                    }
                    ]
                });
            if (department) {
                return _getAllUsersInOrganizationalUnit(portal, department);
            }
        } else {
            let departments = await OrganizationalUnit(connect(DB_CONNECTION, portal))
                .find({
                    _id: {
                        $in: departmentIds
                    }
                });

            let users = await _getAllUsersInOrganizationalUnits(portal, departments);

            return users;
        }
    } else if (unitId) {
        return getAllUserInUnitAndItsSubUnits(portal, company, unitId);
    }
}

exports.getAllEmployeeOfUnitByRole = async (portal, role) => {
    let organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal))
        .findOne({
            $or: [{
                'deans': {
                    $in: role
                }
            },
            {
                'viceDeans': {
                    $in: role
                }
            },
            {
                'employees': {
                    $in: role
                }
            }
            ]
        });

    let employees;
    if (organizationalUnit) {
        employees = await UserRole(connect(DB_CONNECTION, portal))
            .find({
                roleId: {
                    $in: organizationalUnit.employees
                }
            }).populate('userId roleId');
    }

    return employees;
}

/**
 * Lấy tất cả nhân viên theo mảng id đơn vị
 * @id Mảng id các đơn vị
 */
exports.getAllEmployeeOfUnitByIds = async (portal, id) => {
    let data = [];
    for (let i = 0; i < id.length; i++) {
        let organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal))
            .findById(id[i]);
        let allRoles = [...organizationalUnit.employees, ...organizationalUnit.deans, ...organizationalUnit.viceDeans];
        let employees = await UserRole(connect(DB_CONNECTION, portal))
            .find({
                roleId: {
                    $in: allRoles
                }
            }).populate('userId roleId');

        for (let j in employees) {

            let check = 0;
            for (let k in data) {
                if (String(employees[j].userId._id) == String(data[k].userId._id)) {
                    check = 1;
                    break;
                }

            }
            if (check == 0) {
                data.push(employees[j]);
            }
        }
    };
    return data;
}

/**
 * Lấy tất cả các người dùng trong  đơn vị và trong các đơn vị con của nó
 * @getAllUserInCompany = true khi muốn lấy tất cả người dùng trong tất cả đơn vị của 1 công ty
 * @id Id công ty
 * @unitID Id của của đơn vị cần lấy đơn vị con
 */
getAllUserInUnitAndItsSubUnits = async (portal, id, unitId) => {
    //Lấy tất cả các đơn vị con của 1 đơn vị
    var data;

    if (unitId !== '-1') {
        var organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findById(unitId);
        // TODO: tối ưu hóa OrganizationalUnitService.getChildrenOfOrganizationalUnitsAsTree

        data = await OrganizationalUnitService.getChildrenOfOrganizationalUnitsAsTree(portal, id, organizationalUnit.deans[0]);

        var queue = [];
        var departments = [];
        //BFS tìm tât cả đơn vị con-hàm của Đức
        departments.push(data);
        queue.push(data);

        while (queue.length > 0) {
            var v = queue.shift();
            if (v.children) {
                for (var i = 0; i < v.children.length; i++) {
                    var u = v.children[i];
                    queue.push(u);
                    departments.push(u);

                }
            }
        }
        //Lấy tất cả user của từng đơn vị
        var userArray = [];
        userArray = await _getAllUsersInOrganizationalUnits(portal, departments);
        return userArray;

    } else { //Lấy tất nhan vien trong moi đơn vị trong công ty
        const allUnits = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find(); // { company: id }
        const newData = allUnits.map(department => {
            return {
                id: department._id.toString(),
                name: department.name,
                description: department.description,
                deans: department.deans.map(item => item.toString()),
                viceDeans: department.viceDeans.map(item => item.toString()),
                employees: department.employees.map(item => item.toString()),
                parent_id: department.parent !== null ? department.parent.toString() : null
            }
        });

        let tmp = await _getAllUsersInOrganizationalUnits(portal, newData);
        return tmp;
    }
}

/**
 * Lấy thông tin user theo id
 * @id id của user
 */
exports.getUser = async (portal, id) => {
    var user = await User(connect(DB_CONNECTION, portal))
        .findById(id)
        .select('-password -status -deleteSoft -tokens')
        .populate([{
            path: 'roles',
            populate: {
                path: 'roleId'
            }
        },
        {
            path: 'company'
        }
        ]);

    if (!user) {
        throw ['user_not_found'];
    }

    return user;
}

/**
 * Lấy tất cả các đơn vị tổ chức một user thuộc về
 * @userId id của user
 */
exports.getOrganizationalUnitsOfUser = async (portal, userId) => {
    const roles = await UserRole(connect(DB_CONNECTION, portal)).find({
        userId
    });
    const newRoles = roles.map(role => role.roleId.toString());
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({
        $or: [{
            'deans': {
                $in: newRoles
            }
        },
        {
            'viceDeans': {
                $in: newRoles
            }
        },
        {
            'employees': {
                $in: newRoles
            }
        }
        ]
    });

    return departments;
}

/**
 * Tạo tài khoản cho user
 * @data dữ liệu về user
 * @portal portal của db
 */
exports.createUser = async (portal, data, company) => {
    console.log("User", portal, data, company);
    var salt = bcrypt.genSaltSync(10);
    var password = generator.generate({
        length: 10,
        numbers: true
    });
    var hash = bcrypt.hashSync(password, salt);

    var checkUser = await User(connect(DB_CONNECTION, portal)).findOne({
        email: data.email
    });

    if (checkUser) {
        throw ['email_exist'];
    }

    var user = await User(connect(DB_CONNECTION, portal))
        .create({
            name: data.name,
            email: data.email,
            password: hash,
            company: company
        });

    await this.sendMailAboutCreatedAccount(data.email, password, portal)

    return user;
}

/**
 * Gửi email thông báo đã tạo tài khoản thành công
 * @email người nhận
 * @password của tài khoản đó
 */
exports.sendMailAboutCreatedAccount = async (email, password, portal) => {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'vnist.qlcv@gmail.com',
            pass: 'qlcv123@'
        }
    });

    var mainOptions = {
        from: 'vnist.qlcv@gmail.com',
        to: email,
        subject: 'Xác thực tạo tài khoản trên hệ thống quản lý công việc',
        text: 'Yêu cầu xác thực tài khoản đã đăng kí trên hệ thống với email là : ' + email,
        html:
            `<html>
                <head>
                    <style>
                        .wrapper {
                            width: 100%;
                            min-width: 580px;
                            background-color: #FAFAFA;
                            padding: 10px 0;
                        }
                
                        .info {
                            list-style-type: none;
                        }
                
                        @media screen and (max-width: 600px) {
                            .form {
                                border: solid 1px #dddddd;
                                padding: 50px 30px;
                                border-radius: 3px;
                                margin: 0px 5%;
                                background-color: #FFFFFF;
                            }
                        }
                
                        .form {
                            border: solid 1px #dddddd;
                            padding: 50px 30px;
                            border-radius: 3px;
                            margin: 0px 25%;
                            background-color: #FFFFFF;
                        }
                
                        .title {
                            text-align: center;
                        }
                
                        .footer {
                            margin: 0px 25%;
                            text-align: center;
                
                        }
                    </style>
                </head>
                
                <body>
                    <div class="wrapper">
                        <div class="title">
                            <h1>${process.env.WEB_NAME}</h1>
                        </div>
                        <div class="form">
                            <p><b>Thông tin tài khoản đăng nhập của bạn: </b></p>
                            <div class="info">
                                <li>Portal: ${portal}</li>
                                <li>Tài khoản: ${email}</li>
                                <li>Mật khẩu: <b>${password}</b></li>
                            </div>
                            <p>Đăng nhập ngay tại: <a href="${process.env.WEBSITE}/login">${process.env.WEBSITE}/login</a></p><br />
                
                            <p><b>Your account information: </b></p>
                            <div class="info">
                                <li>Portal: ${portal}</li>
                                <li>Account: ${email}</li>
                                <li>Password: <b>${password}</b></li>
                            </div>
                            <p>Login in: <a href="${process.env.WEBSITE}/login">${process.env.WEBSITE}/login</a></p>
                        </div>
                        <div class="footer">
                            <p>Copyright by
                                <i>Công ty Cổ phần Công nghệ
                                    <br />
                                    An toàn thông tin và Truyền thông Việt Nam</i>
                            </p>
                        </div>
                    </div>
                </body>
        </html>`
    }

    return await transporter.sendMail(mainOptions);
}

/**
 * Gửi email thông báo thay đổi email tài khoản hiện tại
 * @oldEmail email cũ
 * @newEmail email mới
 */
exports.sendMailAboutChangeEmailOfUserAccount = async (oldEmail, newEmail) => {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'vnist.qlcv@gmail.com',
            pass: 'qlcv123@'
        }
    });

    var mainOptions = {
        from: 'vnist.qlcv@gmail.com',
        to: newEmail,
        subject: 'Xác thực thay đổi email',
        text: `Chuyển đổi email từ [${oldEmail}] => [${newEmail}] `,
        html: '<p>Tài khoản dùng để đăng nhập của bạn là : </p>' +
            '<ul>' +
            '<li>Email cũ :' + oldEmail + '</li>' +
            '<li>Email mới :' + newEmail + '</li>' +
            '</ul>' +
            '<p>Your account use to login in system : </p>' +
            '<ul>' +
            '<li>Old email :' + oldEmail + '</li>' +
            '<li>New email :' + newEmail + '</li>' +
            '</ul>'
    }

    return await transporter.sendMail(mainOptions);
}

/**
 * Kiểm tra sự tồn tại của tài khoản
 * @email : email người dung
 */
exports.checkUserExited = async (portal, email) => {
    var user = await User(connect(DB_CONNECTION, portal)).findOne({
        email: email
    }, {
        field1: 1
    });
    var checkUser = false;
    if (user) {
        checkUser = true
    }
    return checkUser;
}

/**
 * Chỉnh sửa thông tin tài khoản người dùng
 * @id id tài khoản
 * @data dữ liệu chỉnh sửa
 */
exports.editUser = async (portal, id, data) => {
    var user = await User(connect(DB_CONNECTION, portal))
        .findById(id)
        .select('-password -status -deleteSoft')
        .populate([{
            path: 'roles',
            populate: {
                path: 'roleId'
            }
        },
        {
            path: 'company'
        }
        ]);

    if (!user) {
        throw ['user_not_found']
    };

    if (user.email !== data.email) {
        const checkEmail = await User(connect(DB_CONNECTION, portal))
            .findOne({
                email: data.email
            });
        if (checkEmail !== null) throw ['email_exist'];
        await this.sendMailAboutChangeEmailOfUserAccount(user.email, data.email);
    }
    user.name = data.name;

    if (data.password) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(data.password, salt);
        user.password = hash;
    }

    if (data.active) {
        user.active = data.active;
    }

    if (user.active === false) {
        user.tokens = [];
    }

    user.email = data.email;
    await user.save();

    return user;
}

/**
 * Chỉnh sửa các role - phân quyền cho 1 user
 * @userId id user
 * @roleIdArr mảng id các role
 */
exports.editRolesForUser = async (portal, userId, roleIdArr) => {
    await UserRole(connect(DB_CONNECTION, portal))
        .deleteMany({
            userId
        });
    var data = await roleIdArr.map(roleId => {
        return {
            userId,
            roleId
        }
    });
    var relationship = await UserRole(connect(DB_CONNECTION, portal))
        .insertMany(data);

    return relationship;
}

/**
 * Xóa tài khoản người dùng
 * @id id tài khoản người dùng
 */
exports.deleteUser = async (portal, id) => {
    var deleteUser = await User(connect(DB_CONNECTION, portal))
        .deleteOne({
            _id: id
        });
    await UserRole(connect(DB_CONNECTION, portal))
        .deleteOne({
            userId: id
        });

    return deleteUser;
}

/**
 * Thêm 1 hoặc nhiều role - phân quyền cho user
 * @userId id của user
 * @roleIdArr mảng id các role
 */
exports.addRolesForUser = async (portal, userId, roleIdArr) => {
    if (roleIdArr && roleIdArr.length > 0) {
        var data = await roleIdArr.map(roleId => {
            return {
                userId,
                roleId
            }
        });
        var relationship = await UserRole(connect(DB_CONNECTION, portal))
            .insertMany(data);
    }

    return relationship;
}

/**
 * Hàm tiện ích dùng trong 2 service ở trên
 */
_getAllUsersInOrganizationalUnit = async (portal, department) => {
    var userRoles = await UserRole(connect(DB_CONNECTION, portal))
        .find({
            roleId: {
                $in: [...department.deans, ...department.viceDeans, ...department.employees]
            }
        })
        .populate({
            path: 'userId',
            select: 'name'
        })

    var tmp = await Role(connect(DB_CONNECTION, portal))
        .find({
            _id: {
                $in: [...department.deans, ...department.viceDeans, ...department.employees]
            }
        }, {
            name: 1
        });
    var users = {
        deans: {},
        viceDeans: {},
        employees: {},
        department: department.name
    };

    tmp.forEach(item => {
        let obj = {};
        obj._id = item.id;
        obj.name = item.name;
        obj.members = [];

        if (department.deans.includes(item._id.toString())) {
            users.deans[item._id.toString()] = obj;
        } else if (department.viceDeans.includes(item._id.toString())) {
            users.viceDeans[item._id.toString()] = obj;
        } else if (department.employees.includes(item._id.toString())) {
            users.employees[item._id.toString()] = obj;
        }
    })

    userRoles.forEach((item) => {
        if (users.deans[item.roleId.toString()] && item.userId) {
            users.deans[item.roleId.toString()].members.push(item.userId);
        } else if (users.viceDeans[item.roleId.toString()] && item.userId) {
            users.viceDeans[item.roleId.toString()].members.push(item.userId);
        } else if (users.employees[item.roleId.toString()] && item.userId) {
            users.employees[item.roleId.toString()].members.push(item.userId);
        }
    });

    return users;
}

/**
 * Hàm tiện ích dùng trong service ở trên 
 * Khác với hàm bên module User: nhận vào 1 mảng các department và trả về 1 mảng với mỗi ptu là tất cả các nhân viên trong từng 1 phòng ban
 */
_getAllUsersInOrganizationalUnits = async (portal, data) => {
    var userArray = [];
    for (let i = 0; i < data.length; i++) {
        var department = data[i];
        var userRoles = await UserRole(connect(DB_CONNECTION, portal))
            .find({
                roleId: {
                    $in: [...department.deans, ...department.viceDeans, ...department.employees]
                }
            })
            .populate({
                path: 'userId',
                select: 'name'
            })

        var tmp = await Role(connect(DB_CONNECTION, portal))
            .find({
                _id: {
                    $in: [...department.deans, ...department.viceDeans, ...department.employees]
                }
            }, {
                name: 1
            });
        var users = {
            deans: {},
            viceDeans: {},
            employees: {},
            department: department.name,
            id: department.id,
        };
        tmp.forEach(item => {
            let obj = {};
            obj._id = item.id;
            obj.name = item.name;
            obj.members = [];

            if (department.deans.includes(item._id.toString())) {
                users.deans[item._id.toString()] = obj;
            } else if (department.viceDeans.includes(item._id.toString())) {
                users.viceDeans[item._id.toString()] = obj;
            } else if (department.employees.includes(item._id.toString())) {
                users.employees[item._id.toString()] = obj;
            }
        })

        userRoles.forEach((item) => {
            if (users.deans[item.roleId.toString()] && item.userId) {
                users.deans[item.roleId.toString()].members.push(item.userId);
            } else if (users.viceDeans[item.roleId.toString()] && item.userId) {
                users.viceDeans[item.roleId.toString()].members.push(item.userId);
            } else if (users.employees[item.roleId.toString()] && item.userId) {
                users.employees[item.roleId.toString()].members.push(item.userId);
            }
        });

        userArray.push(users);
    }
    return userArray;
}

exports.getAllUsersWithRole = async (portal) => {
    let users = await UserRole(connect(DB_CONNECTION, portal))
        .find()
        .populate({
            path: "userId",
            select: 'name email avatar'
        })

    return users
}

/**
 * Lấy thông tin user theo email
 * @portal portal của db
 * @param {*} email : email user
 */
exports.getUserInformByEmail = async (portal, email, company) => {
    let user = await User(connect(DB_CONNECTION, portal))
        .findOne({
            email: email,
            company: company,
        }, {
            email: 1,
            _id: 1
        });
    return user
}

/**
 * Lấy danh sách người dùng là trưởng phòng của đơn vị theo id đơn vị
 * @id : Id đơn vị
 */
exports.getUserIsDeanOfOrganizationalUnit = async (portal, id) => {
    let organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal))
        .findById(id);
    let deans = organizationalUnit.deans;
    let userIsDean = await UserRole(connect(DB_CONNECTION, portal))
        .find({
            roleId: {
                $in: deans
            }
        })
        .populate({
            path: 'userId',
            select: 'email _id'
        });
    userIsDean = userIsDean.map(x => x.userId);
    return userIsDean;
}
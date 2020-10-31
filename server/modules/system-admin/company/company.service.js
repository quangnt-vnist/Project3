const {
    Company, Link, SystemLink, Component,
    SystemComponent, Privilege, Role, RootRole,
    RoleType, User, UserRole, ImportConfiguraion, Configuration
} = require(`${SERVER_MODELS_DIR}`);

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const generator = require("generate-password");
const Terms = require(`${SERVER_SEED_DIR}/terms`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy danh sách tất cả các công ty
 */
exports.getAllCompanies = async (query) => {

    let page = query.page;
    let limit = query.limit;

    if (!page && !limit) {
        let companies = await Company(connect(DB_CONNECTION, process.env.DB_NAME)).find();
        for (let i = 0; i < companies.length; i++) {
            let superAdmin = await User(connect(DB_CONNECTION, companies[i].shortName)).findById(companies[i].superAdmin);
            companies[i] = { 
                _id: companies[i]._id,
                log: companies[i].log,
                description: companies[i].description,
                active: companies[i].active,
                name: companies[i].name,
                shortName: companies[i].shortName,
                superAdmin: superAdmin,
                createdAt: companies[i].createdAt,
                updatedAt: companies[i].updatedAt
            }
        }
        return companies;
    } else {
        let option = (query.key && query.value) ? { [`${query.key}`] : new RegExp(query.value, "i") } : {};
        let companies = await Company(connect(DB_CONNECTION, process.env.DB_NAME)).paginate(option, { page, limit });
        for (let i = 0; i < companies.docs.length; i++) {
            let superAdmin = await User(connect(DB_CONNECTION, companies.docs[i].shortName)).findById(companies.docs[i].superAdmin);
            companies.docs[i].superAdmin = superAdmin;
        }
        
        return companies;
    }
}

/**
 * Lấy thông tin về 1 công ty theo id
 * @id id của công ty
 */
exports.getCompany = async (id) => {
    let company = await Company(connect(DB_CONNECTION, process.env.DB_NAME)).findById(id);
    if (!company) throw ['company_not_found'];
    let superAdmin = await User(connect(DB_CONNECTION, company.shortName)).findById(company.superAdmin);
    company.superAdmin = superAdmin;

    return company;
}

/**
 * Tạo dữ liệu mới về 1 công ty
 * @data dữ liệu để tạo thông tin về công ty (tên, mô tả, tên ngắn)
 */
exports.createCompany = async (data) => {

    return await Company(connect(DB_CONNECTION, process.env.DB_NAME))
        .create({
            name: data.name,
            description: data.description,
            shortName: data.shortName
        });
}

exports.initConfigBackup = async(companyShortName) => {
    return await Configuration(connect(DB_CONNECTION, process.env.DB_NAME))
        .create({
            name: companyShortName,
            backup: {
                time: {
                    second: '0',
                    minute: '0',
                    hour: '2',
                    date: '1',
                    month: '*',
                    day: '*'
                },
                limit: 10
            }
        });
}

/**
 * Chỉnh sửa thông tin 1 công ty
 * @id id của công ty trong database
 * @data dữ liệu muốn chỉnh sửa (tên, mô tả, tên ngắn, log, active)
 */
exports.editCompany = async (id, data) => {

    let company = await Company(connect(DB_CONNECTION, process.env.DB_NAME)).findById(id);
    if (!company) throw ['company_not_found'];

    company.name = data.name;
    company.description = data.description;
    company.shortName = data.shortName;
    company.log = data.log;

    if (data.active) company.active = data.active;

    await company.save();

    return company;
}

/**
 * Tạo 5 root roles khi tạo mới 1 company
 * @SuperAdmin super admin của công ty đó
 * @Admin admin của công ty
 * @Dean trưởng đơn vị
 * @ViceDean phó đơn vị
 * @Employee nhân viên đơn vị
 */
exports.createCompanyRootRoles = async (portal, companyId) => {
    //Tạo các role root theo mẫu từ systemadmin và roleType
    let dataRoleType = await RoleType(connect(DB_CONNECTION, process.env.DB_NAME)).find();
    await RoleType(connect(DB_CONNECTION, portal)).insertMany(dataRoleType.map(role => {
        return { name: role.name, company: companyId }
    }));

    let rootType = await RoleType(connect(DB_CONNECTION, portal)).findOne({ name: Terms.ROLE_TYPES.ROOT, company: companyId });

    let admin = await Role(connect(DB_CONNECTION, portal)).create({ type: rootType._id, name: Terms.ROOT_ROLES.ADMIN.name, company: companyId });
    let superAdmin = await Role(connect(DB_CONNECTION, portal)).create({ type: rootType._id, name: Terms.ROOT_ROLES.SUPER_ADMIN.name, parents: [admin._id], company: companyId });
    let dean = await Role(connect(DB_CONNECTION, portal)).create({ type: rootType._id, name: Terms.ROOT_ROLES.DEAN.name, company: companyId });
    let viceDean = await Role(connect(DB_CONNECTION, portal)).create({ type: rootType._id, name: Terms.ROOT_ROLES.VICE_DEAN.name, company: companyId });
    let employee = await Role(connect(DB_CONNECTION, portal)).create({ type: rootType._id, name: Terms.ROOT_ROLES.EMPLOYEE.name, company: companyId });

    return [admin, superAdmin, dean, viceDean, employee];
}

/**
 * Tạo tài khoản Superadmin của công ty
 * @companyId id của công ty
 * @companyName tên của công ty
 * @userEmail email của tài khoản được chọn làm super admin của công ty
 * @roleSuperAdminId Id của role SuperAdmin của công ty dùng để phân quyền cho tài khoản có email ở trên
 */
exports.createCompanySuperAdminAccount = async (companyShortName, userEmail, companyId) => {
    let checkEmail = await User(connect(DB_CONNECTION, companyShortName))
        .findOne({ email: userEmail });
    if (checkEmail) throw ['email_exist'];
    let roleSuperAdmin = await Role(connect(DB_CONNECTION, companyShortName))
        .findOne({ name: Terms.ROOT_ROLES.SUPER_ADMIN.name });
    let salt = await bcrypt.genSaltSync(10);
    let password = await generator.generate({ length: 10, numbers: true });
    let hash = await bcrypt.hashSync(password, salt);

    let transporter = await nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });

    let mainOptions = {
        from: 'vnist.qlcv@gmail.com',
        to: userEmail,
        subject: `Tạo tài khoản SUPER ADMIN cho doanh nghiệp/công ty ${companyShortName}`,
        text: `Email thông báo đăng kí thành công sử dụng dịch vụ Quản lý công việc và thông tin về tài khoản SUPER ADMIN của doanh nghiệp/công ty ${companyShortName}.`,
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
                        <li>Portal: ${companyShortName}</li>
                        <li>Tài khoản: ${userEmail}</li>
                        <li>Mật khẩu: <b>${password}</b></li>
                    </div>
                    <p>Đăng nhập ngay tại: <a href="${process.env.WEBSITE}/login">${process.env.WEBSITE}/login</a></p><br />
        
                    <p><b>Your account information: </b></p>
                    <div class="info">
                        <li>Portal: ${companyShortName}</li>
                        <li>Tài khoản: ${userEmail}</li>
                        <li>Mật khẩu: <b>${password}</b></li>
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

    let user = await User(connect(DB_CONNECTION, companyShortName))
        .create({
            name: `Super Admin`,
            email: userEmail,
            password: hash,
            company: companyId
        });
    let companyUpdate = await Company(connect(DB_CONNECTION, process.env.DB_NAME))
        .findOne({ shortName: companyShortName });
    companyUpdate.superAdmin = user._id;
    await companyUpdate.save();

    await UserRole(connect(DB_CONNECTION, companyShortName))
        .create({
            userId: user._id,
            roleId: roleSuperAdmin._id
        })

    await transporter.sendMail(mainOptions);

    return user;
}

/**
 * Tạo link cho các trang web mà công ty có thể truy cập
 * @companyId id của công ty
 * @linkArr mảng các SystemLink làm chuẩn để tạo link cho công ty
 * @roleArr mảng các RootRole của công ty đó
 */
exports.createCompanyLinks = async (company, linkArr, roleArr, companyId) => {
    let checkIndex = (link, arr) => {
        let resIndex = -1;
        arr.forEach((node, i) => {
            if (node.url === link.url) {
                resIndex = i;
            }
        });

        return resIndex;
    }

    let allLinks = await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME))
        .find()
        .populate({ path: 'roles' });
    let activeLinks = await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME))
        .find({ _id: { $in: linkArr }})
        .populate({ path: 'roles' });

    let dataLinks = allLinks.map( link => {
        if(checkIndex(link, activeLinks) === -1)
            return {
                url: link.url,
                category: link.category,
                description: link.description,
                company: companyId
            }
        else return {
            url: link.url,
            category: link.category,
            description: link.description,
            deleteSoft: false,
            company: companyId
        }
    })

    let links = await Link(connect(DB_CONNECTION, company)).insertMany(dataLinks);

    //Thêm phân quyền cho link
    let dataPrivilege = [];
    for (let i = 0; i < links.length; i++) {
        let link = links[i];

        for (let j = 0; j < allLinks.length; j++) {
            let systemLink = allLinks[j];

            if (link.url === systemLink.url) {
                for (let x = 0; x < systemLink.roles.length; x++) {
                    let rootRole = systemLink.roles[x];

                    for (let y = 0; y < roleArr.length; y++) {
                        let role = roleArr[y];

                        if (role.name === rootRole.name) {
                            dataPrivilege.push({
                                resourceId: link._id,
                                resourceType: 'Link',
                                roleId: role._id
                            });
                        }
                    }
                }
            }
        }
    }
    
    await Privilege(connect(DB_CONNECTION, company))
        .insertMany(dataPrivilege);
    
    return await Link(connect(DB_CONNECTION, company))
        .find()
        .populate({ path: 'roles', populate: { path: 'roleId' } });
}

/**
 * Tạo các component cho công ty
 * @companyId id của công ty
 * @linkArr mảng các system link được kích hoạt để làm chuẩn cho các link của công ty
 */
exports.createCompanyComponents = async (company, linkArr, companyId) => {
    let systemLinks = await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME))
        .find({ _id: { $in: linkArr } });

    let dataSystemComponents = systemLinks.map(link => link.components);
    dataSystemComponents = dataSystemComponents.reduce((arr1, arr2) => [...arr1, ...arr2]);
    dataSystemComponents = dataSystemComponents.map(com => com.toString());
    dataSystemComponents = dataSystemComponents.filter((component, index) => dataSystemComponents.indexOf(component) === index);

    const systemComponents = await SystemComponent(connect(DB_CONNECTION, process.env.DB_NAME))
        .find({_id: {$in: dataSystemComponents}})
        .populate({ path: 'roles' });

    for (let i = 0; i < systemComponents.length; i++) {
        let sysLinks = await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME)).find({_id: {$in: systemComponents[i].links}});
        let links = await Link(connect(DB_CONNECTION, company)).find({url: sysLinks.map(link=>link.url)});
        // Tạo component
        let component = await Component(connect(DB_CONNECTION, company)).create({
            name: systemComponents[i].name,
            description: systemComponents[i].description,
            links: links.map(link=>link._id),
            deleteSoft: false,
            company: companyId
        })
        for (let j = 0; j < links.length; j++) {
            let updateLink = await Link(connect(DB_CONNECTION, company)).findById(links[j]._id);
            updateLink.components.push(component._id);
            await updateLink.save();
        }
        // Tạo phân quyền cho components
        let roles = await Role(connect(DB_CONNECTION, company)).find({
            name: { $in: systemComponents[i].roles.map(role => role.name)}
        });
        let dataPrivileges = roles.map(role => {
            return {
                resourceId: component._id,
                resourceType: 'Component',
                roleId: role._id
            }
        });
        await Privilege(connect(DB_CONNECTION, company)).insertMany(dataPrivileges);
    }

    return await Component(connect(DB_CONNECTION, company)).find();
}

/**
 * Chỉnh sửa email của tài khoản super admin của công ty
 * @companyId id của công ty
 * @superAdminEmail email dùng để thay thế làm email mới của super admin
 */
exports.editCompanySuperAdmin = async (company, superAdminEmail) => {

    let com = await Company(connect(DB_CONNECTION, process.env.DB_NAME)).findOne({shortName: company})
        .populate({ path: 'superAdmin', model: User(connect(DB_CONNECTION, company)) });
    let roleSuperAdmin = await Role(connect(DB_CONNECTION, company)).findOne({ name: Terms.ROOT_ROLES.SUPER_ADMIN.name });

    let oldSuperAdmin = await User(connect(DB_CONNECTION, company)).findById(com.superAdmin._id);
    if (oldSuperAdmin.email === superAdminEmail) {
        return oldSuperAdmin;
    } else {
        await UserRole(connect(DB_CONNECTION, company)).deleteOne({ userId: oldSuperAdmin._id, roleId: roleSuperAdmin._id });

        let user = await User(connect(DB_CONNECTION, company)).findOne({ email: superAdminEmail });
        if (user === null) {
            let newUser = await this.createCompanySuperAdminAccount(com.shortName, com.name, superAdminEmail);

            return newUser;
        } else {
            com.superAdmin = user._id;
            await com.save();
            await UserRole(connect(DB_CONNECTION, company)).create({ userId: user._id, roleId: roleSuperAdmin._id })

            return user;
        }
    }
}

/**
 * Lấy thông tin cấu hình file import
 * @type Thể loại file cấu hình(salary, taskTemplate);
 * @company id công ty
 */
exports.getImportConfiguraion = async (type, company) => {

    return await ImportConfiguraion.findOne({
        type: type,
        company: company
    });
};

/**
 * Tạo thông tin cấu hình file import
 * @data Thông tin cấu hình file import
 * @company id công ty
 */
exports.createImportConfiguraion = async (data, company) => {

    return await ImportConfiguraion.create({
        company: company,
        configuration: data.configuration,
        type: data.type
    })
};

/**
 * Chỉnh sửa thông tin cấu hình file import
 * @id id thông tin cấu hình file import cần sửa
 * @data Dữ liệu chinhe sửa file cấu hình
 */
exports.editImportConfiguraion = async (id, data) => {

    let oldImportConfiguraion = await ImportConfiguraion.findById(id);

    oldImportConfiguraion.configuration = {
        ...data.configuration
    };

    await oldImportConfiguraion.save();

    return await ImportConfiguraion.findById(id);
};
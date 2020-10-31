const CompanyServices = require('./company.service');
const ConfigurationServices = require(`${SERVER_MODULES_DIR}/super-admin/module-configuration/moduleConfiguration.service`);
const Logger = require(`${SERVER_LOGS_DIR}`);

/**
 * Lấy danh sách tất cả các công ty
 */
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await CompanyServices.getAllCompanies(req.query);
        
        Logger.info(req.user.email, 'get_companies_success');
        res.status(200).json({
            success: true,
            messages: ['get_companies_success'],
            content: companies
        });
    } catch (error) {
        
        Logger.error(req.user.email, 'get_companies_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_companies_faile'],
            content: error
        });
    }
};

/**
 * Lấy thông tin về 1 công ty theo id
 * @companyId id của công ty
 */
exports.getCompany = async (req, res) => {
    try {
        const company = await CompanyServices.getCompany(req.params.companyId);
        
        Logger.info(req.user.email, 'show_company_success');
        res.status(200).json({
            success: true,
            messages: ['show_company_success'],
            content: company
        });
    } catch (error) {

        Logger.error(req.user.email, 'show_company_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_company_faile'],
            content: error
        });
    }
};

/**
 * Tạo dữ liệu mới về 1 công ty
 * @data dữ liệu để tạo thông tin về công ty (tên, mô tả, tên ngắn)
 */
exports.createCompany = async (req, res) => {
    try {
        const company = await CompanyServices.createCompany(req.body);
        await CompanyServices.initConfigBackup(company.shortName);
        const abstractRoles = await CompanyServices.createCompanyRootRoles(company.shortName, company._id);

        await CompanyServices.createCompanySuperAdminAccount(company.shortName, req.body.email, company._id);
        await CompanyServices.createCompanyLinks(company.shortName, req.body.links, abstractRoles, company._id);
        await CompanyServices.createCompanyComponents(company.shortName, req.body.links, company._id);
        
        const resCompany = await CompanyServices.getCompany(company._id);
        await ConfigurationServices.createHumanResourceConfiguration(company.shortName);
        
        Logger.info(req.user.email, 'create_company_success');
        res.status(200).json({
            success: true,
            messages: ['create_company_success'],
            content: resCompany
        });
    } catch (error) {

        Logger.error(req.user.email, 'create_company_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_company_faile'],
            content: error
        });
    }
};

/**
 * Chỉnh sửa thông tin 1 công ty
 * @id id của công ty trong database
 * @data dữ liệu muốn chỉnh sửa (tên, mô tả, tên ngắn, log, active)
 */
exports.editCompany = async (req, res) => {
    try {
        const company = await CompanyServices.editCompany(req.params.companyId, req.body);
        await CompanyServices.editCompanySuperAdmin(company.shortName, req.body.email);
        const resCompany = await CompanyServices.getCompany(company._id);

        Logger.info(req.user.email, 'edit_company_success');
        res.status(200).json({
            success: true,
            messages: ['edit_company_success'],
            content: resCompany
        });
    } catch (error) {
        
        Logger.error(req.user.email, 'edit_company_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_company_faile'],
            content: error
        });
    }
};

/**
 * Lấy thông tin cấu hình file import
 * @type Thể loại file cấu hình(salary, taskTemplate);
 * @company id công ty
 */
exports.getImportConfiguraion =  async (req, res) => {
    try {
        const data = await CompanyServices.getImportConfiguraion(req.query.type, req.user.company._id);

        Logger.info(req.user.email, 'get_import_configuration_success', req.user.company);
        res.status(200).json({ 
            success: true, 
            messages: ['get_import_configuration_success'], 
            content: data
        });
    } catch (error) {

        Logger.error(req.user.email, 'get_import_configuration_faile', req.user.company);
        res.status(400).json({
            success: false, 
            messages: ['get_import_configuration_faile'], 
            content: error
        });
    }
};

/**
 * Tạo thông tin cấu hình file import
 * @body Thông tin cấu hình file import
 * @company id công ty
 */
exports.createImportConfiguraion = async (req, res) => {
    try {
        const data = await CompanyServices.createImportConfiguraion(req.body, req.user.company._id);

        Logger.info(req.user.email, 'create_import_configuration_success', req.user.company);
        res.status(200).json({ 
            success: true, 
            messages: ['create_import_configuration_success'], 
            content: data
        });
    } catch (error) {

        Logger.error(req.user.email, 'create_import_configuration_faile', req.user.company);
        res.status(400).json({
            success: false, 
            messages: ['create_import_configuration_faile'], 
            content: error
        });
    }
};

/**
 * Chỉnh sửa thông tin cấu hình file import
 * @id id thông tin cấu hình file import cần sửa
 * @body Dữ liệu chinhe sửa file cấu hình
 */
exports.editImportConfiguraion =  async (req, res) => {
    try {
        const data = await CompanyServices.editImportConfiguraion(req.params.id, req.body);

        Logger.info(req.user.email, 'edit_import_configuration_success', req.user.company);
        res.status(200).json({ 
            success: true, 
            messages: ['edit_import_configuration_success'], 
            content: data
        });
    } catch (error) {
        
        Logger.error(req.user.email, 'edit_import_configuration_faile', req.user.company);
        res.status(400).json({
            success: false, 
            messages: ['edit_import_configuration_faile'], 
            content: error
        });
    }
};
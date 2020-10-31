import { sendRequest } from '../../../../helpers/requestHelper';

export const CompanyServices = {
    getAllCompanies,
    createCompany,
    editCompany,

    getCompanyLinks,
    updateCompanyLinks,

    getCompanyComponents,
    updateCompanyComponents,

    getImportConfiguration,
    createImportConfiguration,
    editImportConfiguration,
};

/**
 * Lấy danh sách tất cả các công ty
 */
function getAllCompanies(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/system-admin/company/companies`,
        method: 'GET',
        params
    }, false, true, 'system_admin.company');
}

/**
 * Tạo dữ liệu mới về 1 công ty
 * @company dữ liệu để tạo thông tin về công ty (tên, mô tả, tên ngắn)
 */
function createCompany(company) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/system-admin/company/companies`,
        method: 'POST',
        data: company,
    }, true, true, 'system_admin.company');
}

/**
 * Chỉnh sửa thông tin 1 công ty
 * @companyId id của công ty trong database
 * @data dữ liệu muốn chỉnh sửa (tên, mô tả, tên ngắn, log, active)
 */
function editCompany(companyId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/system-admin/company/companies/${companyId}`,
        method: 'PATCH',
        data,
    }, true, true, 'system_admin.company');
}

/**
 * Thêm link mới cho công ty
 * @companyId id của công ty
 * @data
    * @linkUrl đường dẫn cho link muốn tạo
    * @linkDescription mô tả về link
 */
function updateCompanyLinks(data, params={}) {

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/link/links/company/update`,
        method: 'PATCH',
        params,
        data
    }, true, true, 'system_admin.company');
}

function updateCompanyComponents(data, params={}) {

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/component/components/company/update`,
        method: 'PATCH',
        params,
        data
    }, true, true, 'system_admin.company');
}

/**
 * Lấy danh sách tất cả các link của công ty
 * @companyId id của công ty muốn lấy danh sách các link
 */
function getCompanyLinks(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/link/links`,
        method: 'GET',
        params
    }, false, true, 'system_admin.company');
}

/**
 * Lấy danh sách các component của công ty
 * @companyId id của công ty
 */
function getCompanyComponents(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/component/components`,
        method: 'GET',
        params
    }, false, true, 'system_admin.company');
}

/**
 * Lấy thông tin cấu hình file import
 * @data
    * @type Thể loại file cấu hình(salary, taskTemplate);
 */
function getImportConfiguration(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/system-admin/company/data-import-configurations`,
        method: 'GET',
        params: { type: data.type }
    }, false, false, 'system_admin.company');
}

/**
 * Tạo thông tin cấu hình file import
 * @data Thông tin cấu hình file import
 */
function createImportConfiguration(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/system-admin/company/data-import-configurations`,
        method: 'POST',
        data,
    }, true, true, 'system_admin.company');
}

/**
 * Chỉnh sửa thông tin cấu hình file import
 * @data Dữ liệu chinhe sửa file cấu hình
 */
function editImportConfiguration(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/system-admin/company/data-import-configurations/${data.id}`,
        method: 'PATCH',
        data,
    }, true, true, 'system_admin.company');
}
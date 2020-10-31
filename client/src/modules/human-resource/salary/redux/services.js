import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const SalaryService = {
    searchSalary,
    createSalary,
    deleteSalary,
    updateSalary,
    importSalary
}

/**
 * Lấy danh sách bảng lương
 * @data dữ liệu key tìm kiếm
 */
function searchSalary(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/salary/salaries`,
        method: 'GET',
        params: {
            organizationalUnits: data.organizationalUnits,
            employeeNumber: data.employeeNumber,
            month: data.month,
            page: data.page,
            limit: data.limit
        }
    }, false, true, 'human_resource.salary');
}

/**
 * Tạo mới một bảng lương
 * @data dữ liệu bảng lương mới
 */
function createSalary(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/salary/salaries`,
        method: 'POST',
        data: data,
    }, true, true, 'human_resource.salary');
}

/**
 * Xoá bảng lương  theo id
 * @id Id bảng lương cần xoá
 */
function deleteSalary(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/salary/salaries/${id}`,
        method: 'DELETE',
    }, true, true, 'human_resource.salary');
}

/**
 * Cập nhật thông tin bảng lương
 * @id : Id bảng lương cần cập nhật
 * @data : Dữ liệu cập nhật bảng lương 
 */
function updateSalary(id, data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/salary/salaries/${id}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'human_resource.salary');
}

/**
 * Import dữ liệu bảng lương
 * @param {*} data : array thông tin bảng lương
 */
function importSalary(data) {
    console.log(data);
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/salary/salaries/import`,
        method: 'POST',
        data: data,
    }, true, false, 'human_resource.salary');
}
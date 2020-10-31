import {
    sendRequest
} from '../../../../helpers/requestHelper';
export const AnnualLeaveService = {
    searchAnnualLeaves,
    createAnnualLeave,
    deleteAnnualLeave,
    updateAnnualLeave,
}

/**
 * Lấy danh sách nghỉ phép
 * @data : Dữ liệu key tìm kiếm
 */
function searchAnnualLeaves(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/annualLeave/annualLeaves`,
        method: 'GET',
        params: {
            numberAnnulLeave: data.numberAnnulLeave,
            startDate: data.startDate,
            endDate: data.endDate,
            organizationalUnits: data.organizationalUnits,
            year: data.year,
            employeeNumber: data.employeeNumber,
            month: data.month,
            page: data.page,
            status: data.status,
            limit: data.limit
        }
    }, false, true, 'human_resource.annual_leave');
}

/**
 * Tạo mới thông tin nghỉ phép
 * @data : Dữ liệu tạo mới thông tin nghỉ phép
 */
function createAnnualLeave(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/annualLeave/annualLeaves`,
        method: 'POST',
        data: data
    }, true, true, 'human_resource.annual_leave');
}

/**
 * Xoá thông tin nghỉ phép
 * @id : Id nghỉ phép cần xoá
 */
function deleteAnnualLeave(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/annualLeave/annualLeaves/${id}`,
        method: 'DELETE',
    }, true, true, 'human_resource.annual_leave');
}
/**
 * Cập nhật thông tin nghỉ phép
 * @id : Id nghỉ phép cần cập nhật 
 * @data  : Dữ liệu cập nhật nghỉ phép
 */
function updateAnnualLeave(id, data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/annualLeave/annualLeaves/${id}`,
        method: 'PATCH',
        data: data
    }, true, true, 'human_resource.annual_leave');
}
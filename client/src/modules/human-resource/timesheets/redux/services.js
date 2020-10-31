import {
    sendRequest
} from '../../../../helpers/requestHelper';
export const TimesheetsService = {
    searchTimesheets,
    createTimesheets,
    deleteTimesheets,
    updateTimesheets,
    importTimesheets,
}

/**
 * Lấy danh sách chấm công
 * @data : Dữ liệu key tìm kiếm
 */
function searchTimesheets(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/timesheet/timesheets`,
        method: 'GET',
        params: {
            employeeId: data.employeeId,
            organizationalUnits: data.organizationalUnits,
            employeeNumber: data.employeeNumber,
            startDate: data.startDate,
            endDate: data.endDate,
            month: data.month,
            page: data.page,
            limit: data.limit
        }
    }, false, true, 'human_resource.timesheets');
}

/**
 * Tạo mới thông tin chấm công
 * @data : Dữ liệu chấm công mới
 */
function createTimesheets(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/timesheet/timesheets`,
        method: 'POST',
        data: data,
    }, true, true, 'human_resource.timesheets');
}

/**
 * Xoá thông tin chấm công
 * @id : Id thông tin chấm công cần xoá
 */
function deleteTimesheets(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/timesheet/timesheets/${id}`,
        method: 'DELETE',
    }, true, true, 'human_resource.timesheets');
}

/**
 * Cập nhật thông tin chấm công
 * @id : Id chấm công cần cập nhật
 * @data : Dữ liệu cập nhật chấm công
 */
function updateTimesheets(id, data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/timesheet/timesheets/${id}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'human_resource.timesheets');
}

/**
 * Import dữ liệu chấm công
 * @param {*} data : Array thông tin chấm công
 */
function importTimesheets(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/timesheet/timesheets/import`,
        method: 'POST',
        data: data,
    }, true, false, 'human_resource.timesheets');
}
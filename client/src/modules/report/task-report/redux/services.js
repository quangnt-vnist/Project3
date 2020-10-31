import { sendRequest } from '../../../../helpers/requestHelper';

export const TaskReportServices = {
    getTaskReports,
    getTaskReportById,
    createTaskReport,
    editTaskReport,
    deleteTaskReport,
};

/**
 * Lấy tất cả báo cáo
 * @param {*} data 
 */
function getTaskReports(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/taskreports`,
        method: 'GET',
        params: {
            name: data.name,
            month: data.month,
            organizationalUnit: data.organizationalUnit,
            creator: data.creator,
            page: data.page,
            limit: data.limit,
        },
    }, false, true, 'report_manager');
}


/**
 * lấy báo cáo theo id
 * @param {*} id id báo cáo
 */
function getTaskReportById(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/taskreports/${id}`,
        method: 'GET'
    }, false, true, 'report_manager');
}


/**
 * Tạo mới một báo cáo
 * @param {*} Dữ liệu cần tạo 
 */
function createTaskReport(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/taskreports`,
        method: 'POST',
        data, //data: data ===> data,
    }, true, true, 'report_manager');
}


/**
 * Chỉnh sửa báo cáo
 * @param {*} id báo cáo
 * @param {*} data dữ liệu cần sửa
 */
function editTaskReport(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/taskreports/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'report_manager');
}


/**
 * Xóa một báo cáo
 * @param {*} id báo cáo
 */
function deleteTaskReport(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/taskreports/${id}`,
        method: 'DELETE',
    }, true, true, 'report_manager');
}
import {
    getStorage
} from '../../../../../config';
import { sendRequest } from '../../../../../helpers/requestHelper';

export const createKpiSetService = {
    getEmployeeKpiSet,
    getAllEmployeeKpiSetByMonth,
    editEmployeeKpiSet,
    updateEmployeeKpiSetStatus,
    deleteEmployeeKpiSet,
    getAllEmployeeKpiSetInOrganizationalUnitsByMonth,
    
    deleteEmployeeKpi,
    createEmployeeKpi,
    editEmployeeKpi,
    createEmployeeKpiSet,
    approveEmployeeKpiSet,

    createComment,
    editComment,
    deleteComment,
    createChildComment,
    editChildComment,
    deleteChildComment,
    deleteFileComment,
    deleteFileChildComment
};

/** Lấy tập KPI cá nhân hiện tại */
function getEmployeeKpiSet(month) {
    var id = getStorage("userId");
    const role = getStorage("currentRole");

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpi-sets`,
        method: 'GET',
        params: {
            userId: id,
            role: role,
            month: month,
        }
    }, false, true);
}

/** Lấy tất cả các tập KPI của 1 nhân viên theo thời gian cho trước */
function getAllEmployeeKpiSetByMonth(organizationalUnitIds, userId, startDate, endDate) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpi-sets`,
        method: 'GET',
        params: {
            organizationalUnitIds: organizationalUnitIds,
            userId: userId,
            startDate: startDate,
            endDate: endDate
        }
    }, false, false)
}

/** Lấy tát cả tập KPI của tất cả nhân viên trong 1 mảng đơn vị */
function getAllEmployeeKpiSetInOrganizationalUnitsByMonth(organizationalUnitIds, startDate, endDate) {    
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpi-sets`,
        method: 'GET',
        params: {
            organizationalUnitIds: organizationalUnitIds,
            startDate: startDate,
            endDate: endDate
        }
    }, false, false)
}

/** Khởi tạo KPI cá nhân */  
function createEmployeeKpiSet(newKPI) {
    var id = getStorage("userId");
    newKPI = { ...newKPI, creator: id };

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpi-sets`,
        method: 'POST',
        data: JSON.stringify(newKPI)
    }, true, true, 'kpi.employee.employee_kpi_set.messages_from_server');
}

/** Tạo 1 mục tiêu KPI cá nhân mới */
function createEmployeeKpi(newTarget) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpis`,
        method: 'POST',
        data: JSON.stringify(newTarget)
    }, true, true, 'kpi.employee.employee_kpi_set.messages_from_server');
}

/** Chỉnh sửa thông tin chung của KPI cá nhân*/
function editEmployeeKpiSet(id, newTarget) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpi-sets/${id}/edit`,
        method: 'POST',
        data: newTarget
    }, true, true, 'kpi.employee.employee_kpi_set.messages_from_server');
}

/** Chỉnh sửa trạng thái của KPI cá nhân */
function updateEmployeeKpiSetStatus(id, status) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpi-sets/${id}/edit`,
        method: 'POST',
        params: {
            status: status
        }
    }, true, true, 'kpi.employee.employee_kpi_set.messages_from_server');
}

/** Xóa KPI cá nhân */
function deleteEmployeeKpiSet(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpi-sets/${id}`,
        method: 'DELETE'
    }, true, true, 'kpi.employee.employee_kpi_set.messages_from_server');
}

/** Xóa 1 mục tiêu KPI cá nhân */
function deleteEmployeeKpi(id, kpipersonal) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpis/${id}`,
        params: {
            employeeKpiSetId: kpipersonal
        },
        method: 'DELETE'
    }, true, true, 'kpi.employee.employee_kpi_set.messages_from_server');
}

/** Chỉnh sửa mục tiêu KPI cá nhân */

function editEmployeeKpi(id, newTarget) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/evaluation/employee-evaluation/employee-kpi-sets/${id}`,
        method: 'PATCH',
        data: newTarget
    }, true, true, 'kpi.evaluation')
}

/** Phê duyệt kpi cá nhân */
function approveEmployeeKpiSet(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpipersonals/approve/${id}`,
        method: 'PUT'
    }, true, true);
}
/**
 * Tạo comment cho kpi set
 */
function createComment(setKpiId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpi-sets/${setKpiId}/comments`,
        method: 'POST',
        data: data
    }, false, true)
}
/**
 * Tạo comment cho kpi set
 */
function createChildComment(setKpiId, commentId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpi-sets/${setKpiId}/comments/${commentId}/child-comments`,
        method: 'POST',
        data: data
    }, false, true)
}

/**
 * Edit comment cho kpi set
 */
function editComment(setKpiId, commentId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpi-sets/${setKpiId}/comments/${commentId}`,
        method: 'PATCH',
        data: data
    }, false, true)
}
/**
 * Delete comment
 */
function deleteComment(setKpiId, commentId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpi-sets/${setKpiId}/comments/${commentId}`,
        method: 'DELETE',
    }, false, true)
}
/**
 * Edit comment of comment
 */
function editChildComment(setKpiId, commentId, childCommentId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpi-sets/${setKpiId}/comments/${commentId}/child-comments/${childCommentId}`,
        method: 'PATCH',
        data: data
    }, false, true)
}
/**
 * Delete comment of comment
 */
function deleteChildComment(setKpiId, commentId, childCommentId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpi-sets/${setKpiId}/comments/${commentId}/child-comments/${childCommentId}`,
        method: 'DELETE',
    }, false, true)
}

/**
 * Delete file of comment
 */
function deleteFileComment(fileId,commentId, setKpiId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpi-sets/${setKpiId}/comments/${commentId}/files/${fileId}`,
        method: 'DELETE',
    }, false, true)
}
/**
 * Delete file child comment
 */
function deleteFileChildComment(fileId, childCommentId, commentId, setKpiId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpi-sets/${setKpiId}/comments/${commentId}/child-comments/${childCommentId}/files/${fileId}`,
        method: 'DELETE',
    }, false, true)
}
import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const WorkPlanService = {
    getListWorkPlan,
    createNewWorkPlan,
    deleteWorkPlan,
    updateWorkPlan,
    importWorkPlan,
}

/**
 * Lấy danh sách thông tin lịch làm việc
 */
function getListWorkPlan(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/workPlan/workPlans`,
        method: 'GET',
        params: {
            year: data ? data.year : undefined,
        }
    }, false, true, 'human_resource.work_plan');
}

/**
 * Thêm mới thông tin lịch làm việc
 * @param {*} data : dữ liệu thông tin lịch làm việc
 */
function createNewWorkPlan(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/workPlan/workPlans`,
        method: 'POST',
        data: data
    }, true, true, 'human_resource.work_plan');
}

/**
 * Xoá thông tin lịch làm việc
 * @param {*} id :id thông tin lịch làm việc
 */
function deleteWorkPlan(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/workPlan/workPlans/${id}`,
        method: 'DELETE',
    }, true, true, 'human_resource.work_plan');
}

/**
 * Chỉnh sửa thông tin lịch làm việc
 * @param {*} id : id thông tin lịch làm việc
 * @param {*} data : dữ liệu chỉnh sửa thông tin lịch làm việc
 */
function updateWorkPlan(id, data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/workPlan/workPlans/${id}`,
        method: 'PUT',
        data: data
    }, true, true, 'human_resource.work_plan');
}

/**
 * Import dữ liệu lịch làm việc
 * @param {*} data : Array thông tin lịch làm việc
 */
function importWorkPlan(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/workPlan/workPlans/import`,
        method: 'POST',
        data: data,
    }, true, false, 'human_resource.work_plan');
}
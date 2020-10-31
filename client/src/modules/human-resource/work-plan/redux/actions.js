import {
    WorkPlanConstants
} from "./constants";

import {
    WorkPlanService
} from "./services";

export const WorkPlanActions = {
    getListWorkPlan,
    createNewWorkPlan,
    deleteWorkPlan,
    updateWorkPlan,
    importWorkPlan,
};

/**
 * Lấy danh sách lịch làm việc
 */
function getListWorkPlan(data) {
    return dispatch => {
        dispatch({
            type: WorkPlanConstants.GET_WORK_PLAN_REQUEST
        });
        WorkPlanService.getListWorkPlan(data)
            .then(res => {
                dispatch({
                    type: WorkPlanConstants.GET_WORK_PLAN_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: WorkPlanConstants.GET_WORK_PLAN_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Thêm mới thông tin lịch làm việc
 * @param {*} data : Dữ liệu thông tin lịch làm việc
 */
function createNewWorkPlan(data) {
    return dispatch => {
        dispatch({
            type: WorkPlanConstants.CREATE_WORK_PLAN_REQUEST
        });
        WorkPlanService.createNewWorkPlan(data)
            .then(res => {
                dispatch({
                    type: WorkPlanConstants.CREATE_WORK_PLAN_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: WorkPlanConstants.CREATE_WORK_PLAN_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Xoá thông tin lịch làm việc
 * @param {*} id : Id thông tin lịch làm việc cần xoá
 */
function deleteWorkPlan(id) {
    return dispatch => {
        dispatch({
            type: WorkPlanConstants.DELETE_WORK_PLAN_REQUEST,
        });

        WorkPlanService.deleteWorkPlan(id)
            .then(res => {
                dispatch({
                    type: WorkPlanConstants.DELETE_WORK_PLAN_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: WorkPlanConstants.DELETE_WORK_PLAN_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Chỉnh sửa thông tin lịch làm việc
 * @param {*} id : id thông tin lịch làm việc cần chỉnh sửa
 * @param {*} data : dữ liệu chỉnh sửa thông tin lịch làm việc
 */
function updateWorkPlan(id, infoWorkPlan) {
    return dispatch => {
        dispatch({
            type: WorkPlanConstants.UPDATE_WORK_PLAN_REQUEST,
        });

        WorkPlanService.updateWorkPlan(id, infoWorkPlan)
            .then(res => {
                dispatch({
                    type: WorkPlanConstants.UPDATE_WORK_PLAN_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: WorkPlanConstants.UPDATE_WORK_PLAN_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Import dữ liệu lịch làm việc
 * @param {*} data : Array thông tin lịch làm việc
 */
function importWorkPlan(data) {
    return dispatch => {
        dispatch({
            type: WorkPlanConstants.IMPORT_WORK_PLAN_REQUEST
        });
        WorkPlanService.importWorkPlan(data)
            .then(res => {
                dispatch({
                    type: WorkPlanConstants.IMPORT_WORK_PLAN_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                dispatch({
                    type: WorkPlanConstants.IMPORT_WORK_PLAN_FAILURE,
                    error: err.response.data.content
                });
            })
    };
}
import { TaskReportConstants } from './constants';
import { TaskReportServices } from './services';

export const TaskReportActions = {
    getTaskReports,
    getTaskReportById,
    deleteTaskReport,
    createTaskReport,
    editTaskReport,
};

function getTaskReports(data) {
    return dispatch => {
        dispatch({
            type: TaskReportConstants.GET_TASK_REPORT_REQUEST
        });
        TaskReportServices.getTaskReports(data)
            .then(res => {
                dispatch({
                    type: TaskReportConstants.GET_TASK_REPORT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: TaskReportConstants.GET_TASK_REPORT_FAILURE,
                });
            })
    }
}


function getTaskReportById(id) {
    return dispatch => {
        dispatch({
            type: TaskReportConstants.GET_TASK_REPORT_BY_ID_REQUEST
        });
        TaskReportServices.getTaskReportById(id)
            .then(res => {
                dispatch({
                    type: TaskReportConstants.GET_TASK_REPORT_BY_ID_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: TaskReportConstants.GET_TASK_REPORT_BY_ID_FAILURE,
                });
            })
    }
}


function deleteTaskReport(id) {
    return dispatch => {
        dispatch({
            type: TaskReportConstants.DELETE_TASK_REPORT_REQUEST
        });
        TaskReportServices.deleteTaskReport(id)
            .then(res => {
                dispatch({
                    type: TaskReportConstants.DELETE_TASK_REPORT_SUCCESS,
                    payload: res.data.content,
                })
            })
            .catch(err => {
                dispatch({
                    type: TaskReportConstants.DELETE_TASK_REPORT_FAILURE,
                })
            })
    }
}


function createTaskReport(data) {
    return dispatch => {
        dispatch({
            type: TaskReportConstants.CREATE_TASK_REPORT_REQUEST
        });
        TaskReportServices.createTaskReport(data)
            .then(res => {
                dispatch({
                    type: TaskReportConstants.CREATE_TASK_REPORT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: TaskReportConstants.CREATE_TASK_REPORT_FAILURE,
                    error: err
                });
            })
    }
}


function editTaskReport(id, data) {
    return dispatch => {
        dispatch({
            type: TaskReportConstants.EDIT_TASK_REPORT_REQUEST
        });
        TaskReportServices.editTaskReport(id, data)
            .then(res => {
                dispatch({
                    type: TaskReportConstants.EDIT_TASK_REPORT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: TaskReportConstants.EDIT_TASK_REPORT_FAILURE,
                    error: err
                });
            })
    }
}
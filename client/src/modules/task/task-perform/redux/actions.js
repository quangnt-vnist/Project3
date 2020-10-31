import { performTaskConstants } from "./constants";
import { taskManagementConstants } from "../../task-management/redux/constants";
import { TaskProcessConstants } from "../../task-process/redux/constants";
import { TaskProcessService } from "../../task-process/redux/services";
import { performTaskService } from "./services";
export const performTaskAction = {
    getTimesheetLogs,
    getTimerStatusTask,
    startTimerTask,
    stopTimerTask,

    createActionComment,
    editActionComment,
    deleteActionComment,

    createResultTask,
    editResultTask,

    createTaskAction,
    editTaskAction,
    deleteTaskAction,
    confirmAction,

    createTaskComment,
    editTaskComment,
    deleteTaskComment,
    createCommentOfTaskComment,
    editCommentOfTaskComment,
    deleteCommentOfTaskComment,

    addTaskLog,
    getTaskLog,

    deleteFileAction,
    deleteFileCommentOfAction,
    deleteFileTaskComment,
    deleteFileChildTaskComment,

    uploadFile,
    deleteFileTask,
    editTaskByAccountableEmployees,
    editTaskByResponsibleEmployees,
    editActivateOfTask,
    editArchivedOfTask,
    editDocument,
    deleteDocument,

    evaluationAction,
    evaluateTaskByAccountableEmployees,
    evaluateTaskByConsultedEmployees,
    evaluateTaskByResponsibleEmployees,
    editHoursSpentInEvaluate,

    deleteEvaluation,

    editInformationTask,
    getTaskById,
    confirmTask,
    editEmployeeCollaboratedWithOrganizationalUnits,

    createComment,
    editComment,
    deleteComment,
    createChildComment,
    editChildComment,
    deleteChildComment,
    deleteFileComment,
    deleteFileChildComment,
    getAllPreceedingTasks,
};


/**
 * lấy công việc theo id
 * @param {*} id id công việc
 */

function getTaskById(id) {
    return dispatch => {
        dispatch({
            type: performTaskConstants.GETTASK_BYID_REQUEST,
            id
        });

        performTaskService.getById(id)
            .then(res => {
                dispatch({
                    type: performTaskConstants.GETTASK_BYID_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: performTaskConstants.GETTASK_BYID_FAILURE,
                    error
                })
            })
    }
}

// Create result task
function createResultTask(result) {
    return dispatch => {
        dispatch({ type: performTaskConstants.CREATE_RESULT_TASK_REQUEST, result });
        performTaskService.createResultTask(result)
            .then(res => {
                dispatch({
                    type: performTaskConstants.CREATE_RESULT_TASK_SUCCESS,
                    task: res
                });
            })
            .catch(err => {
                dispatch({ type: performTaskConstants.CREATE_RESULT_TASK_FAILURE, err });
            });
    };
}
// edit result task
function editResultTask(result, taskid) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_RESULT_TASK_REQUEST, result });
        performTaskService.editResultTask(result, taskid)
            .then(res => {
                dispatch({
                    type: performTaskConstants.EDIT_RESULT_TASK_SUCCESS,
                    resultTask: res
                });
            })
            .catch(err => {
                dispatch({ type: performTaskConstants.EDIT_RESULT_TASK_FAILURE, err });
            });
    };
}

// Get log timer task
function getTimesheetLogs(taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.GET_TIMESHEET_LOGS_REQUEST });

        performTaskService.getTimesheetLogs(taskId)
            .then(
                payload => dispatch({ type: performTaskConstants.GET_TIMESHEET_LOGS_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.GET_TIMESHEET_LOGS_FAILURE, error })
            );
    };
}

// Get timer status task
function getTimerStatusTask() { //param -- , user
    return dispatch => {
        dispatch({ type: performTaskConstants.GET_TIMERSTATUS_REQUEST });
        //performTaskService.getTimerStatusTask(task,user)
        performTaskService.getTimerStatusTask()
            .then(
                payload => dispatch({ type: performTaskConstants.GET_TIMERSTATUS_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.GET_TIMERSTATUS_FAILURE, error })
            );
    };
}

// start timer task
function startTimerTask(taskId, timer) {
    return dispatch => {
        dispatch({ type: performTaskConstants.START_TIMER_REQUEST });
        performTaskService.startTimerTask(taskId, timer)
            .then(
                payload => {
                    dispatch({ type: performTaskConstants.START_TIMER_SUCCESS, payload });
                },
                error => {
                    dispatch({ type: performTaskConstants.STOP_TIMER_FAILURE, error });
                }
            );
    };
}


// stop timer task
function stopTimerTask(taskId, newTimer) {
    return dispatch => {
        dispatch({ type: performTaskConstants.STOP_TIMER_REQUEST });
        performTaskService.stopTimerTask(taskId, newTimer)
            .then(
                payload => {
                    dispatch({
                        type: performTaskConstants.STOP_TIMER_SUCCESS,
                        payload: payload.data.content
                    })
                    dispatch({
                        type: taskManagementConstants.EDIT_TASK_SUCCESS,
                        payload: payload.data.content
                    })
                },
                error => {
                    dispatch({ type: performTaskConstants.STOP_TIMER_FAILURE, error });
                }
            );
    };
}

// add comment task
function createActionComment(taskId, actionId, newComment) {
    return dispatch => {
        dispatch({ type: performTaskConstants.CREATE_ACTION_COMMENT_REQUEST });

        performTaskService.createActionComment(taskId, actionId, newComment)
            .then(
                payload => {
                    dispatch({ type: performTaskConstants.CREATE_ACTION_COMMENT_SUCCESS, payload });
                },
                error => {
                    dispatch({ type: performTaskConstants.CREATE_ACTION_COMMENT_FAILURE, error });
                }
            );
    };
}
//add action task
function createTaskAction(taskId, newAction) {
    return dispatch => {
        dispatch({ type: performTaskConstants.CREATE_TASK_ACTION_REQUEST });

        performTaskService.createTaskAction(taskId, newAction)
            .then(
                payload => dispatch({ type: performTaskConstants.CREATE_TASK_ACTION_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.CREATE_TASK_ACTION_FAILURE, error })
            );
    };
}

// edit comment task
function editActionComment(taskId, actionId, commentId, newComment) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_ACTION_COMMENT_REQUEST });

        performTaskService.editActionComment(taskId, actionId, commentId, newComment)
            .then(
                payload => {
                    dispatch({ type: performTaskConstants.EDIT_ACTION_COMMENT_SUCCESS, payload });
                },
                error => {
                    dispatch({ type: performTaskConstants.EDIT_ACTION_COMMENT_FAILURE, error });
                }
            );
    };
}
function editTaskAction(id, newAction, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_TASK_ACTION_REQUEST });
        performTaskService.editTaskAction(id, newAction, taskId)
            .then(
                payload => {
                    dispatch({ type: performTaskConstants.EDIT_TASK_ACTION_SUCCESS, payload });
                },
                error => {
                    dispatch({ type: performTaskConstants.EDIT_TASK_ACTION_FAILURE, error });
                }
            )
    }
}
// delete comment task: prefixed function name with underscore because delete is a reserved word in javascript
function deleteActionComment(taskId, actionId, commentId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_ACTION_COMMENT_REQUEST });

        performTaskService.deleteActionComment(taskId, actionId, commentId)
            .then(
                payload => dispatch({ type: performTaskConstants.DELETE_ACTION_COMMENT_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.DELETE_ACTION_COMMENT_FAILURE, error })
            );
    };
}
function deleteTaskAction(id, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_TASK_ACTION_REQUEST });

        performTaskService.deleteTaskAction(id, taskId)
            .then(
                payload => dispatch({ type: performTaskConstants.DELETE_TASK_ACTION_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.DELETE_TASK_ACTION_FAILURE, id, error })
            );
    };
}

function createTaskComment(taskId, newComment) {
    return dispatch => {
        dispatch({ type: performTaskConstants.CREATE_TASK_COMMENT_REQUEST });

        performTaskService.createTaskComment(taskId, newComment)
            .then(
                payload => dispatch({ type: performTaskConstants.CREATE_TASK_COMMENT_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.CREATE_TASK_COMMENT_FAILURE, error })
            );
    }
}
function editTaskComment(taskId, commentId, newComment) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_TASK_COMMENT_REQUEST });
        performTaskService.editTaskComment(taskId, commentId, newComment)
            .then(
                payload => {
                    dispatch({ type: performTaskConstants.EDIT_TASK_COMMENT_SUCCESS, payload });
                },
                error => {
                    dispatch({ type: performTaskConstants.EDIT_TASK_COMMENT_FAILURE, error });
                }
            )
    }
}
function deleteTaskComment(commentId, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_TASK_COMMENT_REQUEST });
        performTaskService.deleteTaskComment(commentId, taskId)
            .then(
                payload => dispatch({ type: performTaskConstants.DELETE_TASK_COMMENT_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.DELETE_TASK_COMMENT_FAILURE, error })
            );
    }
}
function createCommentOfTaskComment(commentId, taskId, newComment) {
    return dispatch => {
        dispatch({ type: performTaskConstants.CREATE_COMMENT_OF_TASK_COMMENT_REQUEST });
        performTaskService.createCommentOfTaskComment(commentId, taskId, newComment)
            .then(
                payload => dispatch({ type: performTaskConstants.CREATE_COMMENT_OF_TASK_COMMENT_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.CREATE_COMMENT_OF_TASK_COMMENT_FAILURE, error })
            );
    }
}
function editCommentOfTaskComment(commentId, taskId, newComment) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_COMMENT_OF_TASK_COMMENT_REQUEST });
        performTaskService.editCommentOfTaskComment(commentId, taskId, newComment)
            .then(
                payload => dispatch({ type: performTaskConstants.EDIT_COMMENT_OF_TASK_COMMENT_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.EDIT_COMMENT_OF_TASK_COMMENT_FAILURE, error })
            );
    }
}
function deleteCommentOfTaskComment(task, id) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_COMMENT_OF_TASK_COMMENT_REQUEST });
        performTaskService.deleteCommentOfTaskComment(task, id)
            .then(
                payload => dispatch({ type: performTaskConstants.DELETE_COMMENT_OF_TASK_COMMENT_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.DELETE_COMMENT_OF_TASK_COMMENT_FAILURE, error })
            );
    }
}
function evaluationAction(actionId, taskId, evaluation) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EVALUATION_ACTION_REQUEST });
        performTaskService.evaluationAction(actionId, taskId, evaluation)
            .then(
                payload => dispatch({ type: performTaskConstants.EVALUATION_ACTION_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.EVALUATION_ACTION_FAILURE, error })
            );
    }
}
function confirmAction(userId, actionId, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.CONFIRM_ACTION_REQUEST });
        performTaskService.confirmAction(userId, actionId, taskId)
            .then(
                payload => dispatch({ type: performTaskConstants.CONFIRM_ACTION_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.CONFIRM_ACTION_FAILURE, error })
            );
    }
}

function uploadFile(taskId, data) {
    return dispatch => {
        dispatch({ type: performTaskConstants.UPLOAD_FILE_REQUEST });
        performTaskService.uploadFile(taskId, data)
            .then(
                payload => dispatch({ type: performTaskConstants.UPLOAD_FILE_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.UPLOAD_FILE_FAILURE, error })
            );
    }
}
function deleteFileAction(fileId, actionId, taskId, type) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_FILE_ACTION_REQUEST });
        performTaskService.deleteFileAction(fileId, actionId, taskId, type)
            .then(
                payload => dispatch({ type: performTaskConstants.DELETE_FILE_ACTION_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.DELETE_FILE_ACTION_FAILURE, error })
            );
    }
}
function deleteFileCommentOfAction(fileId, actionId, taskId, type) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_FILE_COMMENT_OF_ACTION_REQUEST });
        performTaskService.deleteFileCommentOfAction(fileId, actionId, taskId, type)
            .then(
                payload => dispatch({ type: performTaskConstants.DELETE_FILE_COMMENT_OF_ACTION_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.DELETE_FILE_COMMENT_OF_ACTION_FAILURE, error })
            );
    }
}
function deleteFileTaskComment(fileId, actionId, taskId, type) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_FILE_TASK_COMMENT_REQUEST });
        performTaskService.deleteFileTaskComment(fileId, actionId, taskId, type)
            .then(
                payload => dispatch({ type: performTaskConstants.DELETE_FILE_TASK_COMMENT_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.DELETE_FILE_TASK_COMMENT_FAILURE, error })
            );
    }
}
function deleteFileChildTaskComment(fileId, actionId, taskId, type) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_FILE_CHILD_TASK_COMMENT_REQUEST });
        performTaskService.deleteFileChildTaskComment(fileId, actionId, taskId, type)
            .then(
                payload => dispatch({ type: performTaskConstants.DELETE_FILE_CHILD_TASK_COMMENT_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.DELETE_FILE_CHILD_TASK_COMMENT_FAILURE, error })
            );
    }
}
// Hàm thêm nhật ký cho một công việc
function addTaskLog(log, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.ADD_TASK_LOG_REQUEST });
        performTaskService.addTaskLog(log, taskId)
            .then(
                res => dispatch({
                    type: performTaskConstants.ADD_TASK_LOG_SUCCESS,
                    payload: res.data.content
                }),
                error => dispatch({ type: performTaskConstants.ADD_TASK_LOG_FAILURE, error })
            );
    }
}

// Hàm lấy tất cả nhật ký của một công việc
function getTaskLog(taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.GET_TASK_LOG_REQUEST });
        performTaskService.getTaskLog(taskId)
            .then(
                res => dispatch({
                    type: performTaskConstants.GET_TASK_LOG_SUCCESS,
                    payload: res.data.content
                }),
                error => dispatch({ type: performTaskConstants.GET_TASK_LOG_FAILURE, error })
            );
    }
}

/**
 * edit Task By Accountable Employees
 * @param {*} data du lieu gui di
 * @param {*} taskId id task
 */
function editTaskByAccountableEmployees(data, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_TASK_BY_ACCOUNTABLE_REQUEST, taskId });
        performTaskService.editTaskByAccountableEmployees(data, taskId)
            .then(res => {
                dispatch({
                    type: performTaskConstants.EDIT_TASK_BY_ACCOUNTABLE_SUCCESS,
                    // payload: res.data.content.task
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: performTaskConstants.EDIT_TASK_BY_ACCOUNTABLE_FAILURE, error });
            });
    };
}

/**
 * edit Task By Responsible Employees
 * @param {*} data du lieu gui di
 * @param {*} taskId id task
 */
function editTaskByResponsibleEmployees(data, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_TASK_BY_RESPONSIBLE_REQUEST, taskId });
        performTaskService.editTaskByResponsibleEmployees(data, taskId)
            .then(res => {
                dispatch({
                    type: performTaskConstants.EDIT_TASK_BY_RESPONSIBLE_SUCCESS,
                    // payload: res.data.content.task
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: performTaskConstants.EDIT_TASK_BY_RESPONSIBLE_FAILURE, error });
            });
    };
}

/**
 * evaluate Task By Accountable Employees
 * @param {*} data du lieu gui di
 * @param {*} taskId id task
 */
function evaluateTaskByAccountableEmployees(data, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EVALUATE_TASK_BY_ACCOUNTABLE_REQUEST, taskId });
        performTaskService.evaluateTaskByAccountableEmployees(data, taskId)
            .then(res => {
                dispatch({
                    type: performTaskConstants.EVALUATE_TASK_BY_ACCOUNTABLE_SUCCESS,
                    // payload: res.data.content.task
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: performTaskConstants.EVALUATE_TASK_BY_ACCOUNTABLE_FAILURE, error });
            });
    };
}

/**
 * evaluate Task By Consulted Employees
 * @param {*} data du lieu gui di
 * @param {*} taskId id task
 */
function evaluateTaskByConsultedEmployees(data, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EVALUATE_TASK_BY_CONSULTED_REQUEST, taskId });
        performTaskService.evaluateTaskByConsultedEmployees(data, taskId)
            .then(res => {
                dispatch({
                    type: performTaskConstants.EVALUATE_TASK_BY_CONSULTED_SUCCESS,
                    // payload: res.data.content.task
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: performTaskConstants.EVALUATE_TASK_BY_CONSULTED_FAILURE, error });
            });
    };
}

/**
 * evaluate Task By Responsible Employees
 * @param {*} data du lieu gui di
 * @param {*} taskId id task
 */
function evaluateTaskByResponsibleEmployees(data, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EVALUATE_TASK_BY_RESPONSIBLE_REQUEST, taskId });
        performTaskService.evaluateTaskByResponsibleEmployees(data, taskId)
            .then(res => {
                dispatch({
                    type: performTaskConstants.EVALUATE_TASK_BY_RESPONSIBLE_SUCCESS,
                    // payload: res.data.content.task
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: performTaskConstants.EVALUATE_TASK_BY_RESPONSIBLE_FAILURE, error });
            });
    };
}

/**
 * evaluate Task By Responsible Employees
 * @param {*} data du lieu gui di
 * @param {*} taskId id task
 */
function editHoursSpentInEvaluate(data, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_HOURS_SPENT_IN_EVALUATION_REQUEST, taskId });
        performTaskService.editHoursSpentInEvaluate(data, taskId)
            .then(res => {
                dispatch({
                    type: performTaskConstants.EDIT_HOURS_SPENT_IN_EVALUATION_SUCCESS,
                    // payload: res.data.content.task
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: performTaskConstants.EDIT_HOURS_SPENT_IN_EVALUATION_FAILURE, error });
            });
    };
}

/**
 * Delete document of task
 * @param {*} taskId task id
 * @param {*} evaluateId evaluate id
 */
function deleteEvaluation(taskId, evaluateId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_EVALUATION_REQUEST });
        performTaskService.deleteEvaluation(taskId, evaluateId)
            .then(res => {
                dispatch({
                    type: performTaskConstants.DELETE_EVALUATION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: performTaskConstants.DELETE_EVALUATION_FAILURE, error });
            });
    };
}

/**
 * edit Status Of Task
 * @param {*} id id task
 * @param {*} status trang thai muon cap nhat
 */
function editActivateOfTask(id, typeOfTask, listSelected = []) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_ACTIVATE_OF_TASK_REQUEST, id });
        performTaskService.editActivateOfTask(id, typeOfTask, listSelected)
            .then(res => {
                dispatch({
                    type: performTaskConstants.EDIT_ACTIVATE_OF_TASK_SUCCESS,
                    // payload: res.data.content.task
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: performTaskConstants.EDIT_ACTIVATE_OF_TASK_FAILURE, error });
            });
    };
}

/**
 * edit archived of task
 * @param {*} id id of task
 */
function editArchivedOfTask(id) {
    return dispatch => {
        dispatch({ type: taskManagementConstants.EDIT_ARCHIVED_STATUS_OF_TASK_REQUEST, id });
        performTaskService.editArchivedOfTask(id)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.EDIT_ARCHIVED_STATUS_OF_TASK_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: taskManagementConstants.EDIT_ARCHIVED_STATUS_OF_TASK_FAILURE, error });
            });
    };
}
/**
 * edit file of task
 */
function editDocument(documentId, taskId, data) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_DOCUMENT_TASK_REQUEST });
        performTaskService.editDocument(documentId, taskId, data)
            .then(res => {
                dispatch({
                    type: performTaskConstants.EDIT_DOCUMENT_TASK_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: performTaskConstants.EDIT_DOCUMENT_TASK_FAILURE, error });
            });
    };
}

/**
 * Delete file of task
 */
function deleteFileTask(fileId, documentId, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_FILE_TASK_REQUEST });
        performTaskService.deleteFileTask(fileId, documentId, taskId)
            .then(res => {
                dispatch({
                    type: performTaskConstants.DELETE_FILE_TASK_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: performTaskConstants.DELETE_FILE_TASK_FAILURE, error });
            });
    };
}

/**
 * Delete document of task
 */
function deleteDocument(fileId, documentId, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_DOCUMENT_TASK_REQUEST });
        performTaskService.deleteDocument(fileId, documentId, taskId)
            .then(res => {
                dispatch({
                    type: performTaskConstants.DELETE_DOCUMENT_TASK_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: performTaskConstants.DELETE_DOCUMENT_TASK_FAILURE, error });
            });
    };
}

// Chỉnh sửa task information
function editInformationTask(taskId, informations) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_TASK_INFORMATION_REQUEST });

        performTaskService.editInformationTask(taskId, informations)
            .then(res => {
                dispatch({
                    type: performTaskConstants.EDIT_TASK_INFORMATION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({
                    type: performTaskConstants.EDIT_TASK_INFORMATION_FAILURE,
                    payload: error
                });
            });
    }
}

// Xác nhận công việc 
function confirmTask(taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.CONFIRM_TASK_REQUEST });

        performTaskService.confirmTask(taskId)
            .then(res => {
                dispatch({
                    type: performTaskConstants.CONFIRM_TASK_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({
                    type: performTaskConstants.CONFIRM_TASK_FAILURE,
                    payload: error
                });
            });
    }
}

function editEmployeeCollaboratedWithOrganizationalUnits(taskId, employeeCollaboratedWithUnit) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_EMPLOYEE_COLLABORATED_WITH_ORGANIZATIONAL_UNIT_REQUEST });

        performTaskService.editEmployeeCollaboratedWithOrganizationalUnits(taskId, employeeCollaboratedWithUnit)
            .then(res => {
                dispatch({
                    type: performTaskConstants.EDIT_EMPLOYEE_COLLABORATED_WITH_ORGANIZATIONAL_UNIT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({
                    type: performTaskConstants.EDIT_EMPLOYEE_COLLABORATED_WITH_ORGANIZATIONAL_UNIT_FAILURE,
                    payload: error
                });
            });
    }
}

function createComment(taskId, data, type) {
    if (type === "incoming") {
        return dispatch => {
            dispatch({ type: performTaskConstants.CREATE_COMMENT_PROCESS_INCOMING_REQUEST });
            performTaskService.createComment(taskId, data)
                .then(res => {
                    dispatch({
                        type: performTaskConstants.CREATE_COMMENT_PROCESS_INCOMING_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({
                        type: performTaskConstants.CREATE_COMMENT_PROCESS_INCOMING_FAILURE,
                        payload: error
                    })
                })
        }
    } else {
        return dispatch => {
            dispatch({ type: performTaskConstants.CREATE_COMMENT_PROCESS_REQUEST });
            performTaskService.createComment(taskId, data)
                .then(res => {
                    dispatch({
                        type: performTaskConstants.CREATE_COMMENT_PROCESS_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({
                        type: performTaskConstants.CREATE_COMMENT_PROCESS_FAILURE,
                        payload: error
                    })
                })
        }
    }
}

function editComment(taskId, commentId, data, type) {
    if (type === "incoming") {
        return dispatch => {
            dispatch({ type: performTaskConstants.EDIT_COMMENT_PROCESS_INCOMING_REQUEST });
            performTaskService.editComment(taskId, commentId, data)
                .then(res => {
                    dispatch({
                        type: performTaskConstants.EDIT_COMMENT_PROCESS_INCOMING_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({
                        type: performTaskConstants.EDIT_COMMENT_PROCESS_INCOMING_FAILURE,
                        payload: error
                    })
                })
        }
    } else {
        return dispatch => {
            dispatch({ type: performTaskConstants.EDIT_COMMENT_PROCESS_REQUEST });
            performTaskService.editComment(taskId, commentId, data)
                .then(res => {
                    dispatch({
                        type: performTaskConstants.EDIT_COMMENT_PROCESS_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({
                        type: performTaskConstants.EDIT_COMMENT_PROCESS_FAILURE,
                        payload: error
                    })
                })
        }
    }
}
function deleteComment(taskId, commentId, type) {
    if (type === "incoming") {
        return dispatch => {
            dispatch({ type: performTaskConstants.DELETE_COMMENT_PROCESS_INCOMING_REQUEST });
            performTaskService.deleteComment(taskId, commentId)
                .then(res => {
                    dispatch({
                        type: performTaskConstants.DELETE_COMMENT_PROCESS_INCOMING_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({
                        type: performTaskConstants.DELETE_COMMENT_PROCESS_INCOMING_FAILURE,
                        payload: error
                    })
                })
        }
    } else {
        return dispatch => {
            dispatch({ type: performTaskConstants.DELETE_COMMENT_PROCESS_REQUEST });
            performTaskService.deleteComment(taskId, commentId)
                .then(res => {
                    dispatch({
                        type: performTaskConstants.DELETE_COMMENT_PROCESS_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({
                        type: performTaskConstants.DELETE_COMMENT_PROCESS_FAILURE,
                        payload: error
                    })
                })
        }
    }
}


function createChildComment(taskId, commentId, data, type) {
    if (type === "incoming") {
        return dispatch => {
            dispatch({ type: performTaskConstants.CREATE_CHILD_COMMENT_INCOMING_REQUEST });
            performTaskService.createChildComment(taskId, commentId, data)
                .then(res => {
                    dispatch({
                        type: performTaskConstants.CREATE_CHILD_COMMENT_INCOMING_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({
                        type: performTaskConstants.CREATE_CHILD_COMMENT_INCOMING_FAILURE,
                        payload: error
                    })
                })
        }
    } else {
        return dispatch => {
            dispatch({ type: performTaskConstants.CREATE_CHILD_COMMENT_REQUEST });
            performTaskService.createChildComment(taskId, commentId, data)
                .then(res => {
                    dispatch({
                        type: performTaskConstants.CREATE_CHILD_COMMENT_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({
                        type: performTaskConstants.CREATE_CHILD_COMMENT_FAILURE,
                        payload: error
                    })
                })
        }
    }
}

function editChildComment(taskId, commentId, childCommentId, data, type) {
    if (type === "incoming") {
        return dispatch => {
            dispatch({ type: performTaskConstants.EDIT_CHILD_COMMENT_INCOMING_REQUEST });
            performTaskService.editChildComment(taskId, commentId, childCommentId, data)
                .then(res => {
                    dispatch({
                        type: performTaskConstants.EDIT_CHILD_COMMENT_INCOMING_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({
                        type: performTaskConstants.EDIT_CHILD_COMMENT_INCOMING_FAILURE,
                        payload: error
                    })
                })
        }
    } else {
        return dispatch => {
            dispatch({ type: performTaskConstants.EDIT_CHILD_COMMENT_REQUEST });
            performTaskService.editChildComment(taskId, commentId, childCommentId, data)
                .then(res => {
                    dispatch({
                        type: performTaskConstants.EDIT_CHILD_COMMENT_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({
                        type: performTaskConstants.EDIT_CHILD_COMMENT_FAILURE,
                        payload: error
                    })
                })
        }
    }
}

function deleteChildComment(taskId, commentId, childCommentId, type) {
    if (type === "incoming") {
        return dispatch => {
            dispatch({ type: performTaskConstants.DELETE_CHILD_COMMENT_INCOMING_REQUEST });
            performTaskService.deleteChildComment(taskId, commentId, childCommentId)
                .then(res => {
                    dispatch({
                        type: performTaskConstants.DELETE_CHILD_COMMENT_INCOMING_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({
                        type: performTaskConstants.DELETE_CHILD_COMMENT_INCOMING_FAILURE,
                        payload: error
                    })
                })
        }
    } else {
        return dispatch => {
            dispatch({ type: performTaskConstants.DELETE_CHILD_COMMENT_REQUEST });
            performTaskService.deleteChildComment(taskId, commentId, childCommentId)
                .then(res => {
                    dispatch({
                        type: performTaskConstants.DELETE_CHILD_COMMENT_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({
                        type: performTaskConstants.DELETE_CHILD_COMMENT_FAILURE,
                        payload: error
                    })
                })
        }
    }
}

function deleteFileComment(fileId, commentId, taskId, type) {
    if (type === "incoming") {
        return dispatch => {
            dispatch({ type: performTaskConstants.DELETE_FILE_COMMENT_INCOMING_REQUEST });
            performTaskService.deleteFileComment(fileId, commentId, taskId)
                .then(res => {
                    dispatch({
                        type: performTaskConstants.DELETE_FILE_COMMENT_INCOMING_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({
                        type: performTaskConstants.DELETE_FILE_COMMENT_INCOMING_FAILURE,
                        payload: error
                    })
                })
        }
    } else {
        return dispatch => {
            dispatch({ type: performTaskConstants.DELETE_FILE_COMMENT_REQUEST });
            performTaskService.deleteFileComment(fileId, commentId, taskId)
                .then(res => {
                    dispatch({
                        type: performTaskConstants.DELETE_FILE_COMMENT_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({
                        type: performTaskConstants.DELETE_FILE_COMMENT_FAILURE,
                        payload: error
                    })
                })
        }
    }
}

function deleteFileChildComment(fileId, childCommentId, commentId, taskId, type) {
    if (type === "incoming") {
        return dispatch => {
            dispatch({ type: performTaskConstants.DELETE_FILE_CHILD_COMMENT_INCOMING_REQUEST });
            performTaskService.deleteFileChildComment(fileId, childCommentId, commentId, taskId)
                .then(res => {
                    dispatch({
                        type: performTaskConstants.DELETE_FILE_CHILD_COMMENT_INCOMING_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({
                        type: performTaskConstants.DELETE_FILE_CHILD_COMMENT_INCOMING_FAILURE,
                        payload: error
                    })
                })
        }
    } else {
        return dispatch => {
            dispatch({ type: performTaskConstants.DELETE_FILE_CHILD_COMMENT_REQUEST });
            performTaskService.deleteFileChildComment(fileId, childCommentId, commentId, taskId)
                .then(res => {
                    dispatch({
                        type: performTaskConstants.DELETE_FILE_CHILD_COMMENT_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({
                        type: performTaskConstants.DELETE_FILE_CHILD_COMMENT_FAILURE,
                        payload: error
                    })
                })
        }
    }
}

function getAllPreceedingTasks(taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.GET_ALL_PRECEEDING_TASKS_REQUEST });
        performTaskService.getAllPreceedingTasks(taskId)
            .then(res => {
                dispatch({
                    type: performTaskConstants.GET_ALL_PRECEEDING_TASKS__SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: performTaskConstants.GET_ALL_PRECEEDING_TASKS_FAILURE,
                    payload: error
                })
            })
    }
}
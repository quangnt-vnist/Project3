import { taskManagementConstants } from "./constants";
import { taskManagementService } from "./services";
export const taskManagementActions = {
    getAll,
    getAllTaskByRole,
    getResponsibleTaskByUser,
    getAccountableTaskByUser,
    getConsultedTaskByUser,
    getInformedTaskByUser,
    getCreatorTaskByUser,
    getPaginateTasksByUser,
    getPaginatedTasksByOrganizationalUnit,

    addTask,
    editTask,
    _delete,
    getSubTask,

    editTaskByAccountableEmployees,
    editTaskByResponsibleEmployees,

    evaluateTaskByAccountableEmployees,
    evaluateTaskByConsultedEmployees,
    evaluateTaskByResponsibleEmployees,

    getTasksByUser,
    getTaskInOrganizationUnitByMonth,
    getTaskEvaluations,
};

/**
 * lấy tất cả công việc
 */

function getAll() {
    return dispatch => {
        dispatch({
            type: taskManagementConstants.GETALL_TASK_REQUEST
        });

        taskManagementService.getAll()
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GETALL_TASK_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.GETALL_TASK_FAILURE,
                    error
                })
            });
    };
}

/**
 * lấy tất cả công việc theo vai trò
 * @param {*} id id nhân viên
 * @param {*} role vai trò nhân viên
 */

function getAllTaskByRole(id, role) {
    return dispatch => {
        dispatch({
            type: taskManagementConstants.GETTASK_BYROLE_REQUEST,
            id
        });

        taskManagementService.getAllTaskByRole(id, role)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GETTASK_BYROLE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.GETTASK_BYROLE_FAILURE,
                    error
                })
            });
    }
}


/**
 * lấy công việc theo người thực hiện
 * @param {*} unit đơn vị
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */

function getResponsibleTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime = false) { //user, -- param
    return dispatch => {
        dispatch({
            type: taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_REQUEST
        });

        taskManagementService.getResponsibleTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_FAILURE,
                    error
                })
            })
    }
}


/**
 * lấy công việc theo người phê duyệt
 * @param {*} unit đơn vị
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */

function getAccountableTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime = false) {
    return dispatch => {
        dispatch({
            type: taskManagementConstants.GETTASK_ACCOUNTABLE_BYUSER_REQUEST
        });
        taskManagementService.getAccountableTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GETTASK_ACCOUNTABLE_BYUSER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.GETTASK_ACCOUNTABLE_BYUSER_FAILURE,
                    error
                })
            })
    }
}


/**
 * lấy công việc theo người quan sát
 * @param {*} unit đơn vị
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */


function getConsultedTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime = false) {
    return dispatch => {
        dispatch({
            type: taskManagementConstants.GETTASK_CONSULTED_BYUSER_REQUEST
        });

        taskManagementService.getConsultedTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GETTASK_CONSULTED_BYUSER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.GETTASK_CONSULTED_BYUSER_FAILURE,
                    error
                })
            })
    }
}


/**
 * lấy công việc theo người quan sát
 * @param {*} unit đơn vị
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */


function getInformedTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime = false) {
    return dispatch => {
        dispatch({
            type: taskManagementConstants.GETTASK_INFORMED_BYUSER_REQUEST
        });

        taskManagementService.getInformedTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GETTASK_INFORMED_BYUSER_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.GETTASK_INFORMED_BYUSER_FAILURE,
                    error
                });
            })
    }
}

/**
 * lấy công việc theo người tạo
 * @param {*} unit đơn vị
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */

function getCreatorTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime = false) {
    return dispatch => {
        dispatch({
            type: taskManagementConstants.GETTASK_CREATOR_BYUSER_REQUEST
        });

        taskManagementService.getCreatorTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GETTASK_CREATOR_BYUSER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.GETTASK_CREATOR_BYUSER_FAILURE,
                    error
                })
            })
    }
}

/**
 * lấy công việc theo người tạo
 * @param {*} unit đơn vị
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */

function getPaginateTasksByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime = false, calledId = null) {
    return dispatch => {
        dispatch({
            type: taskManagementConstants.GET_PAGINATE_TASK_BYUSER_REQUEST, 
            calledId: calledId,
        });

        taskManagementService.getPaginateTasksByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GET_PAGINATE_TASK_BYUSER_SUCCESS,
                    payload: res.data.content,
                    calledId: calledId,
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.GET_PAGINATE_TASK_BYUSER_FAILURE,
                    error
                })
            })
    }
}

/**
 * Tìm kiếm công việc đơn vị theo 1 roleId
 * @param {*} roleId 
 * @param {*} number 
 * @param {*} perPage 
 * @param {*} status 
 * @param {*} priority 
 * @param {*} special 
 * @param {*} name 
 * @param {*} startDate 
 * @param {*} endDate 
 * @param {*} startDateAfter 
 * @param {*} endDateBefore 
 * @param {*} aPeriodOfTime 
 * @param {*} calledId 
 */
function getPaginatedTasksByOrganizationalUnit(roleId, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime = false, calledId = null) {
    return dispatch => {
        dispatch({
            type: taskManagementConstants.GET_PAGINATE_TASK_BY_ORGANIZATIONALUNIT_REQUEST, 
            calledId: calledId,
        });

        taskManagementService.getPaginatedTasksByOrganizationalUnit(roleId, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GET_PAGINATE_TASK_BY_ORGANIZATIONALUNIT_SUCCESS,
                    payload: res.data.content,
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.GET_PAGINATE_TASK_BY_ORGANIZATIONALUNIT_FAILURE,
                    error
                })
            })
    }
}

/**
 * thêm mới công việc
 * @param {*} task dữ liệu task mới thêm
 */

function addTask(task) {
    return dispatch => {
        dispatch({ type: taskManagementConstants.ADDNEW_TASK_REQUEST, task });

        taskManagementService.addNewTask(task)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.ADDNEW_TASK_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.ADDNEW_TASK_FAILURE, error
                })
            })
    }
}

/**
 * edit task
 * @param {*} id 
 * @param {*} task 
 */

function editTask(id, task) {
    return dispatch => {
        dispatch({ type: taskManagementConstants.EDIT_TASK_REQUEST, id });

        taskManagementService.editTaskTemplate(id, task)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.EDIT_TASK_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.EDIT_TASK_FAILURE,
                    error
                })
            })
    }
}

/**
 * delete task
 * prefixed function name with underscore because delete is a reserved word in javascript
 */
function _delete(id) {
    return dispatch => {
        dispatch({ type: taskManagementConstants.DELETE_TASK_REQUEST, id });

        taskManagementService.deleteTaskById(id)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.DELETE_TASK_SUCCESS,
                    id
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.DELETE_TASK_FAILURE,
                    id,
                    error
                })
            })
    }
}

/**
 * get sub task
 * @param {*} taskId id của task
 */
function getSubTask(taskId) {
    return dispatch => {
        dispatch({ type: taskManagementConstants.GET_SUBTASK_REQUEST, taskId });
        taskManagementService.getSubTask(taskId)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GET_SUBTASK_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: taskManagementConstants.GET_SUBTASK_FAILURE, error });
            })
    };
}
/**
 * edit Task By Accountable Employees
 * @param {*} data du lieu gui di
 * @param {*} taskId id task
 */
function editTaskByAccountableEmployees(data, taskId) {
    return dispatch => {
        dispatch({ type: taskManagementConstants.EDIT_TASK_BY_ACCOUNTABLE_REQUEST, taskId });
        taskManagementService.editTaskByAccountableEmployees(data, taskId)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.EDIT_TASK_BY_ACCOUNTABLE_SUCCESS,
                    // payload: res.data.content.task
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: taskManagementConstants.EDIT_TASK_BY_ACCOUNTABLE_FAILURE, error });
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
        dispatch({ type: taskManagementConstants.EDIT_TASK_BY_RESPONSIBLE_REQUEST, taskId });
        taskManagementService.editTaskByResponsibleEmployees(data, taskId)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.EDIT_TASK_BY_RESPONSIBLE_SUCCESS,
                    // payload: res.data.content.task
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: taskManagementConstants.EDIT_TASK_BY_RESPONSIBLE_FAILURE, error });
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
        dispatch({ type: taskManagementConstants.EVALUATE_TASK_BY_ACCOUNTABLE_REQUEST, taskId });
        taskManagementService.evaluateTaskByAccountableEmployees(data, taskId)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.EVALUATE_TASK_BY_ACCOUNTABLE_SUCCESS,
                    // payload: res.data.content.task
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: taskManagementConstants.EVALUATE_TASK_BY_ACCOUNTABLE_FAILURE, error });
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
        dispatch({ type: taskManagementConstants.EVALUATE_TASK_BY_CONSULTED_REQUEST, taskId });
        taskManagementService.evaluateTaskByConsultedEmployees(data, taskId)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.EVALUATE_TASK_BY_CONSULTED_SUCCESS,
                    // payload: res.data.content.task
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: taskManagementConstants.EVALUATE_TASK_BY_CONSULTED_FAILURE, error });
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
        dispatch({ type: taskManagementConstants.EVALUATE_TASK_BY_RESPONSIBLE_REQUEST, taskId });
        taskManagementService.evaluateTaskByResponsibleEmployees(data, taskId)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.EVALUATE_TASK_BY_RESPONSIBLE_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: taskManagementConstants.EVALUATE_TASK_BY_RESPONSIBLE_FAILURE, error });
            });
    };
}

/**
 * get task by user
 */
function getTasksByUser(data) {
    return dispatch => {
        dispatch({ type: taskManagementConstants.GET_TASK_BY_USER_REQUEST });
        taskManagementService.getTasksByUser(data)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GET_TASK_BY_USER_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: taskManagementConstants.GET_TASK_BY_USER_FAILURE, error });
            });
    };
}

function getTaskEvaluations(data) {
    return dispatch => {
        dispatch({ type: taskManagementConstants.GET_TASK_EVALUATION_REQUEST });
        taskManagementService.getTaskEvaluations(data)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GET_TASK_EVALUATION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: taskManagementConstants.GET_TASK_EVALUATION_FAILURE, error });
            });
    };
}

function getTaskInOrganizationUnitByMonth(organizationUnitId, startDateAfter, endDateBefore) {
    return dispatch => {
        dispatch({ type: taskManagementConstants.GET_TASK_IN_ORGANIZATION_UNIT_REQUEST });
        taskManagementService.getTaskInOrganizationUnitByMonth(organizationUnitId, startDateAfter, endDateBefore)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GET_TASK_IN_ORGANIZATION_UNIT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: taskManagementConstants.GET_TASK_IN_ORGANIZATION_UNIT_FAILURE, error });
            });
    };
}
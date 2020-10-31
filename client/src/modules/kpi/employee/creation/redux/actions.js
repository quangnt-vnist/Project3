import { createKpiSetConstants } from "./constants";
import { createKpiSetService } from "./services";
export const createKpiSetActions = {
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


// Lấy tập KPI cá nhân hiện tại
function getEmployeeKpiSet(month = undefined) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.GET_EMPLOYEE_KPI_SET_REQUEST });

        createKpiSetService.getEmployeeKpiSet(month)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.GET_EMPLOYEE_KPI_SET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.GET_EMPLOYEE_KPI_SET_FAILURE,
                    payload: error
                })
            })
    }
}

// Lấy tất cả các tập KPI của 1 nhân viên theo thời gian cho trước
function getAllEmployeeKpiSetByMonth(organizationalUnitIds, userId, startDate, endDate) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.GET_ALL_EMPLOYEE_KPI_SET_BY_MONTH_REQUEST });

        createKpiSetService.getAllEmployeeKpiSetByMonth(organizationalUnitIds, userId, startDate, endDate)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.GET_ALL_EMPLOYEE_KPI_SET_BY_MONTH_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.GET_ALL_EMPLOYEE_KPI_SET_BY_MONTH_FAILURE,
                    payload: error
                })
            })
    }
}

/** Lấy tát cả tập KPI của tất cả nhân viên trong 1 mảng đơn vị */
function getAllEmployeeKpiSetInOrganizationalUnitsByMonth(organizationalUnitIds, startDate, endDate) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.GET_ALL_EMPLOYEE_KPI_SET_IN_ORGANIZATIONALUNITS_BY_MONTH_REQUEST });

        createKpiSetService.getAllEmployeeKpiSetInOrganizationalUnitsByMonth(organizationalUnitIds, startDate, endDate)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.GET_ALL_EMPLOYEE_KPI_SET_IN_ORGANIZATIONALUNITS_BY_MONTH_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.GET_ALL_EMPLOYEE_KPI_SET_IN_ORGANIZATIONALUNITS_BY_MONTH_FAILURE,
                    payload: error
                })
            })
    }
}


// Chỉnh sửa thông tin chung của KPI cá nhân
function editEmployeeKpiSet(id, kpipersonal) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.EDIT_EMPLOYEE_KPI_SET_REQUEST });

        createKpiSetService.editEmployeeKpiSet(id, kpipersonal)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.EDIT_EMPLOYEE_KPI_SET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.EDIT_EMPLOYEE_KPI_SET_FAILURE,
                    payload: error
                })
            })
    };
}

// Chỉnh sửa trạng thái của KPI cá nhân
function updateEmployeeKpiSetStatus(id, status) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.UPDATE_EMPLOYEE_KPI_SET_STATUS_REQUEST });

        createKpiSetService.updateEmployeeKpiSetStatus(id, status)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.UPDATE_EMPLOYEE_KPI_SET_STATUS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.UPDATE_EMPLOYEE_KPI_SET_STATUS_FAILURE,
                    payload: error
                })
            })
    };
}


// Xóa KPI cá nhân
function deleteEmployeeKpiSet(id) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.DELETE_EMPLOYEE_KPI_SET_REQUEST });

        createKpiSetService.deleteEmployeeKpiSet(id)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.DELETE_EMPLOYEE_KPI_SET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.DELETE_EMPLOYEE_KPI_SET_FAILURE,
                    payload: error
                })
            })
    };
}


// Xóa mục tiêu KPI cá nhân
function deleteEmployeeKpi(id, kpipersonal) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.DELETE_EMPLOYEE_KPI_REQUEST });

        createKpiSetService.deleteEmployeeKpi(id, kpipersonal)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.DELETE_EMPLOYEE_KPI_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.DELETE_EMPLOYEE_KPI_FAILURE,
                    payload: error
                })
            })
    };
}

// Tạo 1 mục tiêu KPI cá nhân mới
function createEmployeeKpi(newTarget) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.CREATE_EMPLOYEE_KPI_REQUEST });

        createKpiSetService.createEmployeeKpi(newTarget)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.CREATE_EMPLOYEE_KPI_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.CREATE_EMPLOYEE_KPI_FAILURE,
                    payload: error
                })
            })
    };
}

// Chỉnh sửa mục tiêu KPI cá nhân
function editEmployeeKpi(id, newTarget) {
    return dispatch => {
        dispatch({
            type: createKpiSetConstants.EDIT_EMPLOYEE_KPI_REQUEST,
            payload: id
        });

        createKpiSetService.editEmployeeKpi(id, newTarget)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.EDIT_EMPLOYEE_KPI_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.EDIT_EMPLOYEE_KPI_FAILURE,
                    payload: error
                })
            })
    };
}

// Khởi tạo KPI cá nhân
function createEmployeeKpiSet(newKPI) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.CREATE_EMPLOYEE_KPI_SET_REQUEST });

        createKpiSetService.createEmployeeKpiSet(newKPI)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.CREATE_EMPLOYEE_KPI_SET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.CREATE_EMPLOYEE_KPI_SET_FAILURE,
                    payload: error
                })
            })
    };
}

// Phê duyệt toàn bộ KPI cá nhân
function approveEmployeeKpiSet(id) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.APPROVE_EMPLOYEE_KPI_SET_REQUEST });

        createKpiSetService.approveEmployeeKpiSet(id)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.APPROVE_EMPLOYEE_KPI_SET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.APPROVE_KPIPERSONAL_FAILURE,
                    payload: error
                })
            })
    };
}

function createComment(setKpiId, data) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.CREATE_COMMENT_REQUEST });
        createKpiSetService.createComment(setKpiId, data)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.CREATE_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.CREATE_COMMENT_FAILURE,
                    payload: error
                })
            })
    }
}

function editComment(setKpiId, commentId, data) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.EDIT_COMMENT_REQUEST });
        createKpiSetService.editComment(setKpiId, commentId, data)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.EDIT_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.EDIT_COMMENT_FAILURE,
                    payload: error
                })
            })
    }
}
function deleteComment(setKpiId, commentId) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.DELETE_COMMENT_REQUEST });
        createKpiSetService.deleteComment(setKpiId, commentId)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.DELETE_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.DELETE_COMMENT_FAILURE,
                    payload: error
                })
            })
    }
}


function createChildComment(setKpiId, commentId, data) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.CREATE_COMMENT_OF_COMMENT_REQUEST });
        createKpiSetService.createChildComment(setKpiId, commentId, data)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.CREATE_COMMENT_OF_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.CREATE_COMMENT_OF_COMMENT_FAILURE,
                    payload: error
                })
            })
    }
}

function editChildComment(setKpiId, commentId, childCommentId, data) {
    console.log(data)
    return dispatch => {
        dispatch({ type: createKpiSetConstants.EDIT_COMMENT_OF_COMMENT_REQUEST });
        createKpiSetService.editChildComment(setKpiId, commentId, childCommentId, data)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.EDIT_COMMENT_OF_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.EDIT_COMMENT_OF_COMMENT_FAILURE,
                    payload: error
                })
            })
    }
}

function deleteChildComment(setKpiId, commentId, childCommentId) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.DELETE_COMMENT_OF_COMMENT_REQUEST });
        createKpiSetService.deleteChildComment(setKpiId, commentId, childCommentId)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.DELETE_COMMENT_OF_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.DELETE_COMMENT_OF_COMMENT_FAILURE,
                    payload: error
                })
            })
    }
}

function deleteFileComment(fileId, commentId, setKpiId) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.DELETE_FILE_COMMENT_REQUEST });
        createKpiSetService.deleteFileComment(fileId, commentId, setKpiId)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.DELETE_FILE_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.DELETE_FILE_COMMENT_FAILURE,
                    payload: error
                })
            })
    }
}

function deleteFileChildComment(fileId, childCommentId, commentId, setKpiId) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.DELETE_FILE_CHILD_COMMENT_REQUEST });
        createKpiSetService.deleteFileChildComment(fileId, childCommentId, commentId, setKpiId)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.DELETE_FILE_CHILD_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.DELETE_FILE_CHILD_COMMENT_FAILURE,
                    payload: error
                })
            })
    }
}
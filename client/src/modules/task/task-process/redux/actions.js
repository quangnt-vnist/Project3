import { TaskProcessService } from './services';
import { TaskProcessConstants } from './constants';
export const TaskProcessActions = {
    createXmlDiagram,
    getAllXmlDiagram,
    getXmlDiagramById,
    editXmlDiagram,
    deleteXmlDiagram,
    createTaskByProcess,
    getAllTaskProcess,
    updateDiagram,

    editProcessInfo,
    importProcessTemplate,

    createComment,
    editComment,
    deleteComment,
    createChildComment,
    editChildComment,
    deleteChildComment,
    deleteFileComment,
    deleteFileChildComment,
};

/**
 * lấy tất cả các mẫu quy trình
 * @param {*} pageNumber trang hiện tại
 * @param {*} noResultsPerPage số dòng trên trang
 * @param {*} name tên mẫu quy trình cần tìm kiếm
 */
function getAllXmlDiagram(pageNumber, noResultsPerPage, name = '') {
    return dispatch => {
        dispatch({ type: TaskProcessConstants.GET_ALL_XML_DIAGRAM_REQUEST });
        TaskProcessService.getAllXmlDiagram(pageNumber, noResultsPerPage, name)
            .then(
                res => dispatch({ type: TaskProcessConstants.GET_ALL_XML_DIAGRAM_SUCCESS, payload: res.data }),
                error => dispatch({ type: TaskProcessConstants.GET_ALL_XML_DIAGRAM_FAIL })
            );
    };
}

/**
 * lấy tất cả các quy trình công việc
 * @param {*} pageNumber trang hiện tại
 * @param {*} noResultsPerPage số bản ghi trả về
 * @param {*} name tên quy trình công việc cần tìm kiếm
 */
function getAllTaskProcess(pageNumber, noResultsPerPage, name = '') {
    return dispatch => {
        dispatch({ type: TaskProcessConstants.GET_ALL_TASK_PROCESS_REQUEST });
        TaskProcessService.getAllTaskProcess(pageNumber, noResultsPerPage, name)
            .then(
                res => dispatch({ type: TaskProcessConstants.GET_ALL_TASK_PROCESS_SUCCESS, payload: res.data }),
                error => dispatch({ type: TaskProcessConstants.GET_ALL_TASK_PROCESS_FAIL })
            );
    };
}

/**
 * Lấy mẫu quy trình theo id
 * @param {*} diagramId id mẫu quy trình
 */
function getXmlDiagramById(diagramId) {
    return dispatch => {
        dispatch({ type: TaskProcessConstants.GET_XML_DIAGRAM_BY_ID_REQUEST });
        TaskProcessService.getXmlDiagramById(diagramId)
            .then(
                res => dispatch({ type: TaskProcessConstants.GET_XML_DIAGRAM_BY_ID_SUCCESS, payload: res.data }),
                error => dispatch({ type: TaskProcessConstants.GET_XML_DIAGRAM_BY_ID_FAIL })
            );
    };
}

/**
 * tạo mẫu quy trình mới
 * @param {*} data dữ liệu quy trình
 */
function createXmlDiagram(data) {
    return dispatch => {
        dispatch({ type: TaskProcessConstants.CREATE_XML_DIAGRAM_REQUEST });
        TaskProcessService.createXmlDiagram(data)
            .then(
                res => dispatch({ type: TaskProcessConstants.CREATE_XML_DIAGRAM_SUCCESS, payload: res.data }),
                error => dispatch({ type: TaskProcessConstants.CREATE_XML_DIAGRAM_FAIL })
            );
    };
}

/**
 * import mẫu quy trình
 * @param {*} data dữ liệu quy trình
 */
function importProcessTemplate(data) {
    return dispatch => {
        dispatch({ type: TaskProcessConstants.IMPORT_PROCESS_TEMPLATE_REQUEST });
        TaskProcessService.importProcessTemplate(data)
            .then(
                res => dispatch({ type: TaskProcessConstants.IMPORT_PROCESS_TEMPLATE_SUCCESS, payload: res.data }),
                error => dispatch({ type: TaskProcessConstants.IMPORT_PROCESS_TEMPLATE_FAIL })
            );
    };
}

/**
 * Chỉnh sửa mẫu quy trình
 * @param {*} diagramId id mẫu quy trình
 * @param {*} data dữ liệu cần chỉnh sửa
 */
function editXmlDiagram(diagramId, data) {
    return dispatch => {
        dispatch({ type: TaskProcessConstants.EDIT_XML_DIAGRAM_REQUEST });
        TaskProcessService.editXmlDiagram(diagramId, data)
            .then(
                res => dispatch({ type: TaskProcessConstants.EDIT_XML_DIAGRAM_SUCCESS, payload: res.data }),
                error => dispatch({ type: TaskProcessConstants.EDIT_XML_DIAGRAM_FAIL })
            );
    };
}

/**
 * xóa mẫu quy trình
 * @param {*} diagramId id của mẫu quy trình 
 * @param {*} pageNumber trang hiện tại
 * @param {*} noResultsPerPage số dòng trên trang
 * @param {*} name tên tìm kiếm
 */
function deleteXmlDiagram(diagramId, pageNumber, noResultsPerPage, name = "") {
    return dispatch => {
        dispatch({ type: TaskProcessConstants.DELETE_XML_DIAGRAM_REQUEST });
        TaskProcessService.deleteXmlDiagram(diagramId, pageNumber, noResultsPerPage, name)
            .then(
                res => dispatch({ type: TaskProcessConstants.DELETE_XML_DIAGRAM_SUCCESS, payload: res.data }),
                error => dispatch({ type: TaskProcessConstants.DELETE_XML_DIAGRAM_FAIL })
            );
    };
}

/**
 * Tạo chuỗi công việc theo quy trình
 * @param {*} data dữ liệu để tạo mới
 * @param {*} diagramId id của quy trình
 */
function createTaskByProcess(data, diagramId) {
    return dispatch => {
        dispatch({ type: TaskProcessConstants.CREATE_TASK_BY_PROCESS_REQUEST });
        TaskProcessService.createTaskByProcess(data, diagramId)
            .then(
                res => dispatch({ type: TaskProcessConstants.CREATE_TASK_BY_PROCESS_SUCCESS, payload: res.data }),
                error => dispatch({ type: TaskProcessConstants.CREATE_TASK_BY_PROCESS_FAIL })
            );
    };
}

/**
 * Update diagram cho quy trình
 * @param {String} processId id của process
 * @param {String} diagram dữ liệu cần sửa
 */
function updateDiagram(processId, diagram) {
    return dispatch => {
        dispatch({ type: TaskProcessConstants.UPDATE_DIAGRAM_REQUEST });
        TaskProcessService.updateDiagram(processId, diagram)
            .then(
                res => dispatch({ type: TaskProcessConstants.UPDATE_DIAGRAM_SUCCESS, payload: res.data }),
                error => dispatch({ type: TaskProcessConstants.UPDATE_DIAGRAM_FAIL })
            );
    };
}

/**
 * Chỉnh sửa thông tin chung của quy trình
 * @param {*} processId id của quy trình
 * @param {*} data dữ liệu cần chỉnh sửa
 */
function editProcessInfo(processId, data) {
    return dispatch => {
        dispatch({ type: TaskProcessConstants.EDIT_PROCESS_INFO_REQUEST });
        TaskProcessService.editProcessInfo(processId, data)
            .then(
                res => dispatch({ type: TaskProcessConstants.EDIT_PROCESS_INFO_SUCCESS, payload: res.data, processId: processId }),
                error => dispatch({ type: TaskProcessConstants.UPDATE_DIAGRAM_FAIL })
            );
    };
}

function createComment(taskId, data) {
    return dispatch => {
        dispatch({ type: TaskProcessConstants.CREATE_COMMENT_REQUEST });
        TaskProcessService.createComment(taskId, data)
            .then(res => {
                dispatch({
                    type: TaskProcessConstants.CREATE_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: TaskProcessConstants.CREATE_COMMENT_FAILURE,
                    payload: error
                })
            })
    }
}

function editComment(taskId, commentId, data) {
    return dispatch => {
        dispatch({ type: TaskProcessConstants.EDIT_COMMENT_REQUEST });
        TaskProcessService.editComment(taskId, commentId, data)
            .then(res => {
                dispatch({
                    type: TaskProcessConstants.EDIT_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: TaskProcessConstants.EDIT_COMMENT_FAILURE,
                    payload: error
                })
            })
    }
}
function deleteComment(taskId, commentId) {
    return dispatch => {
        dispatch({ type: TaskProcessConstants.DELETE_COMMENT_REQUEST });
        TaskProcessService.deleteComment(taskId, commentId)
            .then(res => {
                dispatch({
                    type: TaskProcessConstants.DELETE_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: TaskProcessConstants.DELETE_COMMENT_FAILURE,
                    payload: error
                })
            })
    }
}


function createChildComment(taskId, commentId, data) {
    return dispatch => {
        dispatch({ type: TaskProcessConstants.CREATE_COMMENT_OF_COMMENT_REQUEST });
        TaskProcessService.createChildComment(taskId, commentId, data)
            .then(res => {
                dispatch({
                    type: TaskProcessConstants.CREATE_COMMENT_OF_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: TaskProcessConstants.CREATE_COMMENT_OF_COMMENT_FAILURE,
                    payload: error
                })
            })
    }
}

function editChildComment(taskId, commentId, childCommentId, data) {
    return dispatch => {
        dispatch({ type: TaskProcessConstants.EDIT_COMMENT_OF_COMMENT_REQUEST });
        TaskProcessService.editChildComment(taskId, commentId, childCommentId, data)
            .then(res => {
                dispatch({
                    type: TaskProcessConstants.EDIT_COMMENT_OF_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: TaskProcessConstants.EDIT_COMMENT_OF_COMMENT_FAILURE,
                    payload: error
                })
            })
    }
}

function deleteChildComment(taskId, commentId, childCommentId) {
    return dispatch => {
        dispatch({ type: TaskProcessConstants.DELETE_COMMENT_OF_COMMENT_REQUEST });
        TaskProcessService.deleteChildComment(taskId, commentId, childCommentId)
            .then(res => {
                dispatch({
                    type: TaskProcessConstants.DELETE_COMMENT_OF_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: TaskProcessConstants.DELETE_COMMENT_OF_COMMENT_FAILURE,
                    payload: error
                })
            })
    }
}

function deleteFileComment(fileId, commentId, taskId) {
    return dispatch => {
        dispatch({ type: TaskProcessConstants.DELETE_FILE_COMMENT_REQUEST });
        TaskProcessService.deleteFileComment(fileId, commentId, taskId)
            .then(res => {
                dispatch({
                    type: TaskProcessConstants.DELETE_FILE_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: TaskProcessConstants.DELETE_FILE_COMMENT_FAILURE,
                    payload: error
                })
            })
    }
}

function deleteFileChildComment(fileId, childCommentId, commentId, taskId) {
    return dispatch => {
        dispatch({ type: TaskProcessConstants.DELETE_FILE_CHILD_COMMENT_REQUEST });
        TaskProcessService.deleteFileChildComment(fileId, childCommentId, commentId, taskId)
            .then(res => {
                dispatch({
                    type: TaskProcessConstants.DELETE_FILE_CHILD_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: TaskProcessConstants.DELETE_FILE_CHILD_COMMENT_FAILURE,
                    payload: error
                })
            })
    }
}

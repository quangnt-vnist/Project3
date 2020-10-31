import {
    getStorage
} from '../../../../config';
import { sendRequest } from '../../../../helpers/requestHelper';

export const performTaskService = {
    getTimesheetLogs,
    getTimerStatusTask,
    startTimerTask,
    stopTimerTask,

    createActionComment,
    deleteActionComment,
    editActionComment,
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

    uploadFile,
    deleteFileAction,
    deleteFileCommentOfAction,
    deleteFileTaskComment,
    deleteFileChildTaskComment,
    deleteFileTask,

    addTaskLog,
    getTaskLog,

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
    getById,
    confirmTask,
    editEmployeeCollaboratedWithOrganizationalUnits,

    //Comment in process
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
 * @param {*} taskId id công việc
 */
function getById(taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}`,
        method: 'GET',
    }, false, true, 'task.task_management');
}

/**
 * lấy lịch sử bấm giờ
 * @param {*} taskId  id của task
 */
function getTimesheetLogs(taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/timesheet-logs`,
        method: 'GET',
    }, false, false, 'task.task_perform');
};

/**
 * Lấy lịch sử bấm giờ ?????
 */
function getTimerStatusTask() {
    var userId = getStorage("userId");
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/task-timesheet-logs`,
        method: 'GET',
        params: { userId: userId }
    }, false, false, 'task.task_perform');
};

/**
 * Bắt đầu bấm giờ
 * @param {*} newTimer dữ liệu gửi lên
 */
function startTimerTask(taskId, newTimer) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/timesheet-logs/start-timer`,
        method: 'POST',
        data: newTimer,
    }, false, true, 'task.task_perform');
}

/**
 * Dừng bấm giờ
 * @param {*} newTimer dữ liệu gửi lên
 */
function stopTimerTask(taskId, newTimer) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/timesheet-logs/stop-timer`,
        method: 'POST',
        data: newTimer
    }, false, true, 'task.task_perform');
}


/**
 * Tạo mới bình luận của hoạt động
 * @param {*} taskId id của task
 * @param {*} actionId id của hoạt động cha
 * @param {*} newComment nội dung bình luận
 */
function createActionComment(taskId, actionId, newComment) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}/comments`,
        method: 'POST',
        data: newComment
    }, true, true, 'task.task_perform');
}

/**
 * Thêm mới hoạt động
 * @param {*} taskId id của task
 * @param {*} newAction nội dung hành động
 */
function createTaskAction(taskId, newAction) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions`,
        method: 'POST',
        data: newAction
    }, true, true, 'task.task_perform');
}

/**
 * Sửa bình luận cho hoạt động
 * @param {*} taskId id của task
 * @param {*} actionId id của hoạt động cha
 * @param {*} commentId id của bình luận cần sửa
 * @param {*} newComment nội dung chỉnh sửa
 */
function editActionComment(taskId, actionId, commentId, newComment) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}/comments/${commentId}`,
        method: 'PATCH',
        data: newComment
    }, false, true, 'task.task_perform');
}

/**
 * Chỉnh sửa hoạt động
 * @param {*} actionId id của hoạt động
 * @param {*} newAction dữ liệu
 * @param {*} taskId id của task
 */
function editTaskAction(actionId, newAction, taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}`,
        method: 'PATCH',
        data: newAction,
    }, false, true, 'task.task_perform')
}
/**
 * Xóa bình luận của hoạt động
 * @param {*} taskId id của task
 * @param {*} actionId id của hoạt động cha
 * @param {*} commentId id của bình luận cần xóa
 */
function deleteActionComment(taskId, actionId, commentId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}/comments/${commentId}`,
        method: 'DELETE'
    }, false, true, 'task.task_perform')
}

/**
 * Xóa hoạt động
 * @param {*} actionId id của hoat động cần xóa
 * @param {*} taskId id của task
 */
function deleteTaskAction(actionId, taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}`,
        method: 'DELETE'
    }, false, true, 'task.task_perform');
}

/** Chỉnh sửa task information */
function editInformationTask(taskId, taskInformations) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-informations`,
        method: 'PATCH',
        data: taskInformations
    }, true, true, 'task.task_perform');
}

/** Xác nhận công việc */
function confirmTask(taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}`,
        method: 'POST',
        params: { type: 'confirm_task' }
    }, true, true, 'task.task_management');
}

/** Chỉnh sửa đơn vị phối hợp */
function editEmployeeCollaboratedWithOrganizationalUnits(taskId, employeeCollaboratedWithUnit) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}`,
        method: 'POST',
        params: { type: 'edit_employee_collaborated_with_unit' },
        data: employeeCollaboratedWithUnit
    }, true, true, 'task.task_management');
}
/**
 * Tạo bình luận công việc
 * @param {*} taskId id của task cần tạo
 * @param {*} newComment nội dung bình luận
 */
function createTaskComment(taskId, newComment) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-comments`,
        method: 'POST',
        data: newComment
    }, false, true, 'task.task_perform')
}

/**
 * Sửa bình luận công việc
 * @param {*} taskId id của task
 * @param {*} commentId id của bình luận cần sửa
 * @param {*} newComment nội dung sửa
 */
function editTaskComment(taskId, commentId, newComment) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-comments/${commentId}`,
        method: 'PATCH',
        data: newComment
    }, false, true, 'task.task_perform')
}

/**
 * Xóa bình luận công việc
 * @param {*} commentId id của bình luận cần xóa
 * @param {*} taskId id của task chứa bình luận
 */
function deleteTaskComment(commentId, taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-comments/${commentId}`,
        method: 'DELETE'
    }, false, true, 'task.task_perform')
}

/**
 * Tạo bình luận cho bình luận
 * @param {*} commentId id của bình luận cha
 * @param {*} taskId id của task
 * @param {*} newComment nội dung bình luận
 */
function createCommentOfTaskComment(commentId, taskId, newComment) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-comments/${commentId}/comments`,
        method: 'POST',
        data: newComment
    }, false, true, 'task.task_perform')
}

/**
 * Sửa bình luận của bình luận
 * @param {*} commentId id của bình luận cần xóa        
 * @param {*} taskId id của task
 * @param {*} newComment bình luận mới
 */
function editCommentOfTaskComment(commentId, taskId, newComment) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-comments/comments/${commentId}`,
        method: 'PATCH',
        data: newComment
    }, false, true, 'task.task_perform')
}

/**
 * Xóa bình luận của bình luận
 * @param {*} commentId 
 * @param {*} taskId 
 */
function deleteCommentOfTaskComment(commentId, taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-comments/comments/${commentId}`,
        method: 'DELETE',
    }, false, true, 'task.task_perform')
}

/**
 * Đánh giá hoạt động
 * @param {*} actionId id của action
 * @param {*} evaluation điểm rating người khác chấm
 */
function evaluationAction(actionId, taskId, evaluation) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}`,
        method: 'PATCH',
        data: evaluation,
    }, false, true, 'task.task_perform')
}

/**
 * Xác nhận hành động
 * @param {*} actionId id của action cần xác nhận
 * @param {*} idUser id của người xác nhận
 * @param {*} taskId id của task
 */
function confirmAction(userId, actionId, taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}`,
        method: 'POST',
        data: {
            userId: userId,
        }
    }, false, true, 'task.task_perform');
};


/**
 * Upload file
 * @param {*} taskId: id của task chứa file cần xóa 
 * @param {*} data: dữ liệu cần upload 
 */
function uploadFile(taskId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/files`,
        method: 'POST',
        data: data
    }, false, true, 'task.task_perform');
};

/**
 * Xóa tài liệu của hoạt động
 * @param {*} fileId: id của file cần xóa
 * @param {*} actionId: id của hoạt động chứa file cần xóa
 * @param {*} taskId: id của task chứa file cần xóa
 * @param {*} type 
 */
function deleteFileAction(fileId, actionId, taskId, type) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}/files/${fileId}`,
        method: 'PATCH',
    }, false, true, 'task.task_perform');
};

/**
 * Xóa tài liệu của bình luận hoạt động
 * @param {*} fileId: id của file cần xóa
 * @param {*} actionId: id của hoạt động chứa file cần xóa
 * @param {*} taskId: id của task chứa file cần xóa
 * @param {*} type 
 */
function deleteFileCommentOfAction(fileId, actionId, taskId, type) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}/comments/files/${fileId}`,
        method: 'PATCH',
    }, false, true, 'task.task_perform');
};

/**
 * Xóa tài liệu của trao đổi
 * @param {*} fileId: id của file cần xóa
 * @param {*} commentId: id của bình luận chứa file cần xóa
 * @param {*} taskId: id của task chứa file cần xóa
 * @param {*} type 
 */
function deleteFileTaskComment(fileId, commentId, taskId, type) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-comments/${commentId}/files/${fileId}`,
        method: 'PATCH'
    }, false, true, 'task.task_perform');
};

/**
 * Xóa tài liệu của bình luận
 * @param {*} fileId: id của file cần xóa
 * @param {*} commentId: id của bình luận chứa file cần xóa
 * @param {*} taskId: id của task chứa file cần xóa
 * @param {*} type: 
 */
function deleteFileChildTaskComment(fileId, commentId, taskId, type) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-comments/${commentId}/comments/files/${fileId}`,
        method: 'PATCH',
    }, false, true, 'task.task_perform');
}

/**
 *  Thêm nhật kí cho cộng việc
 */
function addTaskLog(log, taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/logs`,
        method: 'POST',
        data: log
    }, false, false, 'task.task_perform');
};

// Hàm thêm nhật ký cho một công việc
function getTaskLog(taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/logs`,
        method: 'GET',
    }, false, false, 'task.task_perform');
};

/**
 * chỉnh sửa trạng thái lưu kho
 * @param {*} taskId id công việc
 */

function editArchivedOfTask(taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}`,
        method: 'POST',
        data: {
            type: 'edit_archived'
        }
    }, false, true, 'task.task_management');
}

/**
* edit status of task
* @param {*} taskId id cua task
* @param {*} status trang thai muon cap nhat
*/
function editActivateOfTask(taskId, typeOfTask, listSelected) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}`,
        method: 'POST',
        data: {
            typeOfTask: typeOfTask,
            listSelected: listSelected,
            type: 'edit_activate',
        }
    }, true, true, 'task.task_management');
}

/**
 * edit Task By Responsible Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function editTaskByResponsibleEmployees(data, taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}`,
        method: 'POST',
        data: {
            data: data,
            type: 'all',
            role: 'responsible',
        }
    }, true, true, 'task.task_management');
}

/**
 * edit Task By Accountable Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function editTaskByAccountableEmployees(data, taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}`,
        method: 'POST',
        data: {
            data: data,
            type: 'all',
            role: 'accountable',
        }
    }, true, true, 'task.task_management');
}

/**
 * evaluate Task By Responsible Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function evaluateTaskByResponsibleEmployees(data, taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/evaluate`,
        method: 'POST',
        data: {
            data: data,
            role: 'responsible',
        }
    }, true, true, 'task.task_management');
}

/**
 * evaluate Task By Consulted Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function evaluateTaskByConsultedEmployees(data, taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/evaluate`,
        method: 'POST',
        data: {
            data: data,
            role: 'consulted',
        }
    }, true, true, 'task.task_management');
}

/**
 * evaluate Task By Accountable Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function evaluateTaskByAccountableEmployees(data, taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/evaluate`,
        method: 'POST',
        data: {
            data: data,
            role: 'accountable',
        }
    }, true, true, 'task.task_management');
}

/**
 * evaluate Task By Accountable Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function editHoursSpentInEvaluate(data, taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/evaluate`,
        method: 'POST',
        data: {
            data: data,
            type: 'hoursSpent',
        }
    }, true, true, 'task.task_management');
}

/**
 * Delete file of task
 * @param {*} taskId id task
 * @param {*} evaluationId id evaluation
 */
function deleteEvaluation(taskId, evaluationId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/evaluations/${evaluationId}`,
        method: 'DELETE',
    }, true, true, 'task.task_management');
}

/**
 * Delete file of task
 */
function deleteFileTask(fileId, documentId, taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/documents/${documentId}/files/${fileId}`,
        method: 'PATCH',
    }, true, true, 'task.task_perform');
}
/**
 * Delete document of task
 */
function deleteDocument(documentId, taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/documents/${documentId}`,
        method: 'DELETE',
    }, true, true, 'task.task_perform');
}
/**
 * Edit document of task
 */
function editDocument(documentId, taskId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/documents`,
        params: { documentId: documentId },
        data: data,
        method: 'PATCH',
    }, true, true, 'task.task_perform');
}


/**
 * Tạo comment cho kpi set
 */
function createComment(taskId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/process/tasks/${taskId}/comments`,
        method: 'POST',
        data: data
    }, false, true)
}
/**
 * Tạo comment cho kpi set
 */
function createChildComment(taskId, commentId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/process/tasks/${taskId}/comments/${commentId}/child-comments`,
        method: 'POST',
        data: data
    }, false, true)
}

/**
 * Edit comment cho kpi set
 */
function editComment(taskId, commentId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/process/tasks/${taskId}/comments/${commentId}`,
        method: 'PATCH',
        data: data
    }, false, true)
}
/**
 * Delete comment
 */
function deleteComment(taskId, commentId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/process/tasks/${taskId}/comments/${commentId}`,
        method: 'DELETE',
    }, false, true)
}
/**
 * Edit comment of comment
 */
function editChildComment(taskId, commentId, childCommentId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/process/tasks/${taskId}/comments/${commentId}/child-comments/${childCommentId}`,
        method: 'PATCH',
        data: data
    }, false, true)
}
/**
 * Delete comment of comment
 */
function deleteChildComment(taskId, commentId, childCommentId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/process/tasks/${taskId}/comments/${commentId}/child-comments/${childCommentId}`,
        method: 'DELETE',
    }, false, true)
}

/**
 * Delete file of comment
 */
function deleteFileComment(fileId, commentId, taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/process/tasks/${taskId}/comments/${commentId}/files/${fileId}`,
        method: 'PATCH',
    }, false, true)
}
/**
 * Delete file child comment
 */
function deleteFileChildComment(fileId, childCommentId, commentId, taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/process/tasks/${taskId}/comments/${commentId}/child-comments/${childCommentId}/files/${fileId}`,
        method: 'PATCH',
    }, false, true)
}

function getAllPreceedingTasks(taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/performtask/process/tasks/${taskId}`,
        method: 'GET',
        params: { preceedingTasks: true }
    }, false, false)
}
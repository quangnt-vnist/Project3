const PerformTaskService = require('./taskPerform.service');
const Logger = require(`${SERVER_LOGS_DIR}`);
const NotificationServices = require(`${SERVER_MODULES_DIR}/notification/notification.service`);
const { sendEmail } = require(`${SERVER_HELPERS_DIR}/emailHelper`);

// Điều hướng đến dịch vụ cơ sở dữ liệu của module thực hiện công việc

/**
 *  Lấy công việc theo id
 */
exports.getTaskById = async (req, res) => {
    try {
        var task = await PerformTaskService.getTaskById(req.portal, req.params.taskId, req.user._id);
        await Logger.info(req.user.email, ` get task by id `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_task_by_id_success'],
            content: task
        });
    } catch (error) {
        await Logger.error(req.user.email, ` get task by id `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_task_by_id_fail'],
            content: error
        });
    };
};

/**
 * Lấy lịch sử bấm giờ 
 */
exports.getTaskTimesheetLogs = async (req, res) => {
    try {
        let logTimer = await PerformTaskService.getTaskTimesheetLogs(req.portal, req.params);
        await Logger.info(req.user.email, ` get log timer  `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_log_timer_success'],
            content: logTimer
        })
    } catch (error) {
        await Logger.error(req.user.email, ` get log timer  `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_log_timer_fail'],
            content: error
        })
    }
}
/**
 * Lấy trạng thái bấm giờ hiện tại
 */
exports.getActiveTimesheetLog = async (req, res) => {
    try {
        let timerStatus = await PerformTaskService.getActiveTimesheetLog(req.portal, req.query);
        await Logger.info(req.user.email, `get timer status`, req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_timer_status_success'],
            content: timerStatus
        })
    } catch (error) {
        await Logger.error(req.user.email, `get timer status`, req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_timer_status_fail'],
            content: error
        })
    }
}
/**
 * Bắt đầu bấm giờ
 */
exports.startTimesheetLog = async (req, res) => {
    try {
        let timerStatus = await PerformTaskService.startTimesheetLog(req.portal, req.params, req.body);
        await Logger.info(req.user.email, ` start timer `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['start_timer_success'],
            content: timerStatus
        })
    } catch (error) {
        await Logger.error(req.user.email, ` start timer `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['start_timer_fail'],
            content: error
        })
    }
}

/**
 * Kết thúc bấm giờ
 */
exports.stopTimesheetLog = async (req, res) => {
    try {
        let timer = await PerformTaskService.stopTimesheetLog(req.portal, req.params, req.body);
        await Logger.info(req.user.email, ` stop timer `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['stop_timer_success'],
            content: timer
        })
    } catch (error) {
        await Logger.error(req.user.email, ` stop timer `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['stop_timer_fail'],
            content: error
        })
    }
}
/**
 *  Tạo hoạt động
 */
exports.createTaskAction = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }

        var task = await PerformTaskService.createTaskAction(req.portal, req.params, req.body, files);
        var taskAction = task.taskActions;
        var tasks = task.tasks;
        var user = task.user;
        var data = { "organizationalUnits": tasks.organizationalUnit, "title": "Phê duyệt hoạt động", "level": "general", "content": `<p><strong>${user.name}</strong> đã thêm mới hoạt động cho công việc <strong>${tasks.name}</strong>, bạn có thể vào để phê duyệt hoạt động này <a href="${process.env.WEBSITE}/task?taskId=${tasks._id}" target="_blank">${process.env.WEBSITE}/task?taskId=${tasks._id}</a></p>`, "sender": user.name, "users": [tasks.accountableEmployees] };
        NotificationServices.createNotification(req.portal, tasks.organizationalUnit, data,);
        sendEmail(task.email, "Phê duyệt hoạt động", '', `<p><strong>${user.name}</strong> đã thêm mới hoạt động, bạn có thể vào để phê duyệt hoạt động này <a href="${process.env.WEBSITE}/task?taskId=${tasks._id}" target="_blank">${process.env.WEBSITE}/task?taskId=${tasks._id}</a></p>`);
        await Logger.info(req.user.email, ` create task action  `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_task_action_success'],
            content: taskAction
        })
    } catch (error) {
        await Logger.error(req.user.email, ` create task action  `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['create_task_action_fail'],
            content: error
        })
    }
}
/**
 * Sửa hoạt động
 */
exports.editTaskAction = async (req, res) => {

    if (req.body.type === "evaluation") {

        evaluationAction(req, res);

    } else
        try {
            let files = [];
            if (req.files !== undefined) {
                req.files.forEach((elem, index) => {
                    let path = elem.destination + '/' + elem.filename;
                    files.push({ name: elem.originalname, url: path })

                })
            }
            let taskAction = await PerformTaskService.editTaskAction(req.portal, req.params, req.body, files);
            await Logger.info(req.user.email, ` edit task action  `, req.portal)
            res.status(200).json({
                success: true,
                messages: ['edit_task_action_success'],
                content: taskAction
            })
        } catch (error) {
            await Logger.error(req.user.email, ` edit task action  `, req.portal)
            res.status(400).json({
                success: false,
                messages: ['edit_task_action_fail'],
                content: error
            })
        }
}
/**
 *  Xóa hoạt động
 */
exports.deleteTaskAction = async (req, res) => {
    try {
        let taskAction = await PerformTaskService.deleteTaskAction(req.portal, req.params);
        await Logger.info(req.user.email, ` delete task action  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_task_action_success'],
            content: taskAction
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete task action  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_task_action_fail'],
            content: error
        })
    }
}
/**
 *  Tạo bình luận cho hoạt động
 */
exports.createCommentOfTaskAction = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let actionComment = await PerformTaskService.createCommentOfTaskAction(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` create  action comment  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_action_comment_success'],
            content: actionComment
        })
    } catch (error) {
        await Logger.error(req.user.email, ` create  action comment  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_action_comment_fail'],
            content: error
        })
    }
}
/**
 *  Sửa bình luận cho hoạt động
 */
exports.editCommentOfTaskAction = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let actionComment = await PerformTaskService.editCommentOfTaskAction(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` edit action comment  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_action_comment_success'],
            content: actionComment
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit action comment  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_action_comment_fail'],
            content: error
        })
    }
}

/**
 *  Xóa bình luận cho hoạt động
 */
exports.deleteCommentOfTaskAction = async (req, res) => {
    try {
        let task = await PerformTaskService.deleteCommentOfTaskAction(req.portal, req.params);
        await Logger.info(req.user.email, ` delete action comment  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_action_comment_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete action comment  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_action_comment_fail'],
            content: error
        })
    }


}
/**
 * Tạo bình luận của công việc
 */
exports.createTaskComment = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let taskComment = await PerformTaskService.createTaskComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` create task comment  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_task_comment_success'],
            content: taskComment
        })
    } catch (error) {
        await Logger.error(req.user.email, ` create task comment  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_task_comment_fail"],
            content: error
        })
    }
}
/**
 * Sửa bình luận của hoạt động
 */
exports.editTaskComment = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let taskComment = await PerformTaskService.editTaskComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` edit task comments  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_task_comment_success'],
            content: taskComment
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit task comments  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_task_comment_fail'],
            content: error
        })
    }
}
/**
 * Xóa bình luận công việc
 */
exports.deleteTaskComment = async (req, res) => {
    try {
        let taskComment = await PerformTaskService.deleteTaskComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete task comments  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_task_comment_success'],
            content: taskComment
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete task comments  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_task_comment_fail'],
            content: error
        })
    }
}
/**
 * Xóa bình luận của bình luận
 */
exports.deleteFileChildTaskComment = async (req, res) => {
    try {
        let taskComment = await PerformTaskService.deleteFileChildTaskComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete task comments  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_file_child_task_comment_success'],
            content: taskComment
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete task comments  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_file_child_task_comment_fail'],
            content: error
        })
    }
}
/**
 * Tạo bình luận của bình luận công việc
 */
exports.createCommentOfTaskComment = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let comment = await PerformTaskService.createCommentOfTaskComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` create comment of task comment  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_comment_of_task_comment_success'],
            content: comment
        })
    } catch (error) {
        await Logger.error(req.user.email, ` create comment of task comment  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_comment_of_task_comment_fail'],
            content: error
        })
    }
}
/**
 * Suửa bình luận của bình luận công việc
 */
exports.editCommentOfTaskComment = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let comment = await PerformTaskService.editCommentOfTaskComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` edit comment of task comment  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_comment_of_task_comment_success'],
            content: comment
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit comment of task comment  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_comment_of_task_comment_fail'],
            content: error
        })
    }
}
/**
 * Xoa binh luan cua binh luan cong viec
 */
exports.deleteCommentOfTaskComment = async (req, res) => {
    try {
        let comment = await PerformTaskService.deleteCommentOfTaskComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete comment of task comment  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_comment_of_task_comment_success'],
            content: comment
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete comment of task comment  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_comment_of_task_comment_fail'],
            content: error
        })
    }
}
/**
 * Đánh giá hoạt động
 */
evaluationAction = async (req, res) => {
    try {
        let taskAction = await PerformTaskService.evaluationAction(req.portal, req.params, req.body);
        await Logger.info(req.user.email, ` evaluation action  `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['evaluation_action_success'],
            content: taskAction
        })
    } catch (error) {
        await Logger.error(req.user.email, ` evaluation action  `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['evaluation_action_fail'],
            content: error
        })
    }
}
/**
 * Xác nhận hành động
 */
exports.confirmAction = async (req, res) => {
    try {
        let abc = await PerformTaskService.confirmAction(req.portal, req.params, req.body);
        await Logger.info(req.user.email, ` confirm action  `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['confirm_action_success'],
            content: abc
        })
    } catch (error) {
        await Logger.error(req.user.email, ` confirm action  `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['confirm_action_fail'],
            content: error
        })
    }
}
/**
 * Upload tài liệu công việc
 */
exports.uploadFile = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path, description: req.body.description, creator: req.body.creator })

            })
        }
        let comment = await PerformTaskService.uploadFile(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` upload file of task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['upload_file_success'],
            content: comment
        })
    } catch (error) {
        await Logger.error(req.user.email, `upload file of task  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['upload_file_fail'],
            content: error
        })
    }
}
/**
 * Xóa file của task
 */
exports.deleteFileTask = async (req, res) => {
    try {
        let task = await PerformTaskService.deleteFileTask(req.portal, req.params);
        await Logger.info(req.user.email, ` delete file of task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_file_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, `delete file of task  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_file_fail'],
            content: error
        })
    }
}
/**
 * Xóa file của hoạt động
 */
exports.deleteFileOfAction = async (req, res) => {
    try {
        let comment = await PerformTaskService.deleteFileOfAction(req.portal, req.params);
        await Logger.info(req.user.email, ` delete file of task action  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_file_success'],
            content: comment
        })
    } catch (error) {
        await Logger.error(req.user.email, `delete file of task action  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_file_fail'],
            content: error
        })
    }
}
/**
 * Xóa file của bình luận hoạt động
 */
exports.deleteFileCommentOfAction = async (req, res) => {
    try {
        let file = await PerformTaskService.deleteFileCommentOfAction(req.portal, req.params);
        await Logger.info(req.user.email, ` delete file of task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_file_comment_of_action_success'],
            content: file
        })
    } catch (error) {
        await Logger.error(req.user.email, `delete file of task  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_file_comment_of_action_fail'],
            content: error
        })
    }
}
/**
 * Xóa file của trao đổi
 */
exports.deleteFileTaskComment = async (req, res) => {
    try {
        let file = await PerformTaskService.deleteFileTaskComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete file of task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_file_task_comment_success'],
            content: file
        })
    } catch (error) {
        await Logger.error(req.user.email, `delete file of task  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_file_task_comment_fail'],
            content: error
        })
    }
}
/**
 * Thêm nhật ký cho một công việc
 */
exports.addTaskLog = async (req, res) => {
    try {
        let task = await PerformTaskService.addTaskLog(req.portal, req.params, req.body);
        await Logger.info(req.user.email, ` CREATE_TASK_LOG  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_task_log_success"],
            content: task
        });
    } catch (error) {
        await Logger.error(req.user.email, ` CREATE_TASK_LOG  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_task_log_fail'],
            content: error
        });
    }
}

/**
 * Lấy tất cả nhật ký của một công việc
 */
exports.getTaskLog = async (req, res) => {
    try {
        let taskLog = await PerformTaskService.getTaskLog(req.portal, req.params);
        await Logger.info(req.user.email, ` GET_TASK_LOG  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_task_log_success"],
            content: taskLog
        });
    } catch (error) {
        await Logger.error(req.user.email, ` GET_TASK_LOG  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_task_log_fail'],
            content: error
        });
    }
}

/**
 * chỉnh sửa công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.editTask = async (req, res) => {
    if (req.body.type === 'all') {
        if (req.body.role === 'responsible') {
            editTaskByResponsibleEmployees(req, res);
        }
        else if (req.body.role === 'accountable') {
            editTaskByAccountableEmployees(req, res);
        }
    }
    else if (req.body.type === 'edit_archived') {
        editArchivedOfTask(req, res);
    }
    else if (req.body.type === 'edit_activate') {
        editActivateOfTask(req, res);
    }
    else if (req.query.type === 'confirm_task') {
        confirmTask(req, res);
    } 
    else if (req.query.type === 'edit_employee_collaborated_with_unit') {
        editEmployeeCollaboratedWithOrganizationalUnits(req, res);
    }
}

/**
 * đánh giá công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.evaluateTask = async (req, res) => {
    if (req.body.role === 'responsible') {
        evaluateTaskByResponsibleEmployees(req, res);
    }
    else if (req.body.role === 'consulted') {
        evaluateTaskByConsultedEmployees(req, res);
    }
    else if (req.body.role === 'accountable') {
        evaluateTaskByAccountableEmployees(req, res);
    }
    else if (req.body.type === 'hoursSpent') {
        editHoursSpentInEvaluate(req, res);
    }
}
/**
 * edit task by responsible employee
 */
editTaskByResponsibleEmployees = async (req, res) => {
    try {
        var task = await PerformTaskService.editTaskByResponsibleEmployees(req.portal, req.body.data, req.params.taskId);
        var user = task.user;
        var tasks = task.tasks;
        var data = { "organizationalUnits": tasks.organizationalUnit, "title": "Cập nhật thông tin công việc", "level": "general", "content": `<p><strong>${user.name}</strong> đã cập nhật thông tin công việc <strong>${tasks.name}</strong> với vai trò người phê duyệt <a href="${process.env.WEBSITE}/task?taskId=${req.params.taskId}" target="_blank">${process.env.WEBSITE}/task?taskId=${req.params.taskId}</a></p>`, "sender": user.name, "users": tasks.accountableEmployees };
        NotificationServices.createNotification(req.portal, tasks.organizationalUnit, data,);
        
        // sendEmail(task.email, "Cập nhật thông tin công việc", '', `<p><strong>${user.name}</strong> đã cập nhật thông tin công việc với vai trò người phê duyệt <a href="${process.env.WEBSITE}/task?taskId=${req.params.taskId}" target="_blank">${process.env.WEBSITE}/task?taskId=${req.params.taskId}</a></p>`);
        let title = "Cập nhật thông tin công việc: " + task.tasks.name;
        sendEmail(task.email, title, '', `<p><strong>${user.name}</strong> đã cập nhật thông tin công việc với vai trò người thực hiện <a href="${process.env.WEBSITE}/task?taskId=${req.params.id}">${process.env.WEBSITE}/task?taskId=${req.params.id}</a></p>`);
        
        await Logger.info(req.user.email, ` edit task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_task_success'],
            content: task.newTask
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit task `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_task_fail'],
            content: error
        });
    }
}
/**
 * edit task by responsible employee
 */
editTaskByAccountableEmployees = async (req, res) => {
    try {
        var task = await PerformTaskService.editTaskByAccountableEmployees(req.portal, req.body.data, req.params.taskId);
        var user = task.user;
        var tasks = task.tasks;
        var data = { "organizationalUnits": tasks.organizationalUnit, "title": "Cập nhật thông tin công việc", "level": "general", "content": `<p><strong>${user.name}</strong> đã cập nhật thông tin công việc <strong>${tasks.name}</strong> với vai trò người phê duyệt <a href="${process.env.WEBSITE}/task?taskId=${req.params.taskId}">${process.env.WEBSITE}/task?taskId=${req.params.taskId}</a></p>`, "sender": user.name, "users": tasks.responsibleEmployees };
        NotificationServices.createNotification(req.portal, tasks.organizationalUnit, data,);
        // sendEmail(task.email, "Cập nhật thông tin công việc", '', `<p><strong>${user.name}</strong> đã cập nhật thông tin công việc với vai trò người phê duyệt <a href="${process.env.WEBSITE}/task?taskId=${req.params.taskId}">${process.env.WEBSITE}/task?taskId=${req.params.taskId}</a></p>`);
        let title = "Cập nhật thông tin công việc: " + task.tasks.name;
        sendEmail(task.email, title, '', `<p><strong>${user.name}</strong> đã cập nhật thông tin công việc với vai trò người phê duyệt <a href="${process.env.WEBSITE}/task?taskId=${req.params.id}">${process.env.WEBSITE}/task?taskId=${req.params.id}</a></p>`);
        await Logger.info(req.user.email, ` edit task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_task_success'],
            content: task.newTask
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit task `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_task_fail'],
            content: error
        });
    }
}

/** Chỉnh sửa đơn vị phối hợp */
editEmployeeCollaboratedWithOrganizationalUnits = async (req, res) => {
    try {
        let data = await PerformTaskService.editEmployeeCollaboratedWithOrganizationalUnits(req.portal, req.params.taskId, req.body);
        
        let notification = {
            organizationalUnits: data.task && data.task.organizationalUnit._id,
            title: "Phân công công việc",
            level: "general",
            content: data.html,
            sender: data.task && data.task.organizationalUnit.name,
            users: data.newEmployees
        };
        await NotificationServices.createNotification(req.portal, data.task.organizationalUnit.company, notification);
        data.email && data.email.length !== 0
            && await sendEmail(data.email, "Phân công công việc", '', data.html);
        
        await Logger.info(req.user.email, ` edit collaborate with organizational unit `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_employee_collaborated_success'],
            content: data.task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit collaborate with organizational unit `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_employee_collaborated_failure'],
            content: error
        });
    }
}

/** Chỉnh sửa taskInformation của task */
exports.editTaskInformation = async (req, res) => {
    try {
        let task = await PerformTaskService.editTaskInformation(req.portal, req.params.taskId, req.user._id, req.body);

        await Logger.info(req.user.email, ` edit task information `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_task_information_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit task information `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_task_information_failure'],
            content: error
        });
    }
}


/**
 * evaluate task by consulted employee
 */
evaluateTaskByConsultedEmployees = async (req, res) => {
    try {
        let task = await PerformTaskService.evaluateTaskByConsultedEmployees(req.portal, req.body.data, req.params.taskId);
        await Logger.info(req.user.email, ` edit task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['evaluate_task_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit task `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['evaluate_task_fail'],
            content: error
        });
    }
}
/**
 * evaluate task by responsible employee
 */
evaluateTaskByResponsibleEmployees = async (req, res) => {
    // try {
    let task = await PerformTaskService.evaluateTaskByResponsibleEmployees(req.portal, req.body.data, req.params.taskId);
    await Logger.info(req.user.email, ` edit task  `, req.portal);
    res.status(200).json({
        success: true,
        messages: ['evaluate_task_success'],
        content: task
    })
    // } catch (error) {
    //     await Logger.error(req.user.email, ` edit task `, req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: ['evaluate_task_fail'],
    //         content: error
    //     });
    // }
}

/**
 * evaluate task by accountable employee
 */
evaluateTaskByAccountableEmployees = async (req, res) => {
    try {
        let task = await PerformTaskService.evaluateTaskByAccountableEmployees(req.portal, req.body.data, req.params.taskId);
        await Logger.info(req.user.email, ` edit task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['evaluate_task_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit task `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['evaluate_task_fail'],
            content: error
        });
    }
}

/**
 * evaluate task by accountable employee
 */
editHoursSpentInEvaluate = async (req, res) => {
    try {
        let task = await PerformTaskService.editHoursSpentInEvaluate(req.portal, req.body.data, req.params.taskId);

        await Logger.info(req.user.email, ` edit task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_hours_spent_in_evaluate_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit task `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_hours_spent_in_evaluate_fail'],
            content: error
        });
    }
}


/**
 * delete evaluation by id
 */
exports.deleteEvaluation = async (req, res) => {
    try {
        let task = await PerformTaskService.deleteEvaluation(req.portal, req.params);
        await Logger.info(req.user.email, ` delete evaluation  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_evaluation_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete evaluation `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_evaluation_fail'],
            content: error
        });
    }
}


/**
 * Chinh sua trang thai luu kho cua cong viec
 */
editArchivedOfTask = async (req, res) => {
    try {
        let task = await PerformTaskService.editArchivedOfTask(req.portal, req.params.taskId);
        await Logger.info(req.user.email, ` edit status archived of task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_status_archived_of_task_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit status of task `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_status_archived_of_task_fail'],
            content: error
        });
    }
}

/**
 * Chinh sua trang thai cua cong viec
 */
editActivateOfTask = async (req, res) => {
    try {
        let data = await PerformTaskService.editActivateOfTask(req.portal, req.params.taskId, req.body);
        let task = data.task;
        let mails = data.mailInfo;
        for (let i in mails) {
            let task = mails[i].task;
            let user = mails[i].user;
            let email = mails[i].email;
            let html = mails[i].html;

            let mailData = { "organizationalUnits": task.organizationalUnit._id, "title": "Kích hoạt công việc", "level": "general", "content": html, "sender": task.organizationalUnit.name, "users": user };
            NotificationServices.createNotification(req.portal, task.organizationalUnit.company, mailData,);
            sendEmail(email, "Kích hoạt công việc hành công", '', html);
        }
        await Logger.info(req.user.email, ` edit activate of task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_status_of_task_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit activate of task `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_status_of_task_fail'],
            content: error
        });
    }
}

/** Xác nhận công việc */
confirmTask = async (req, res) => {
    try {
        let task = await PerformTaskService.confirmTask(req.portal, req.params.taskId, req.user._id);

        await Logger.info(req.user.email, ` confirm task `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['confirm_task_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` confirm task `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['confirm_task_failure'],
            content: error
        })
    }
}

/**
 * Xóa tai lieu
 */
exports.deleteDocument = async (req, res) => {
    try {
        let file = await PerformTaskService.deleteDocument(req.portal, req.params);
        await Logger.info(req.user.email, ` delete document of task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_document_task_comment_success'],
            content: file
        })
    } catch (error) {
        await Logger.error(req.user.email, `delete document of task  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_document_task_comment_fail'],
            content: error
        })
    }
}

/**
 * Sua tai lieu
 */
exports.editDocument = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path, description: req.body.description, creator: req.body.creator })

            })
        }
        let file = await PerformTaskService.editDocument(req.portal, req.params.taskId, req.query.documentId, req.body, files);
        await Logger.info(req.user.email, ` delete document of task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_document_task_comment_success'],
            content: file
        })
    } catch (error) {
        await Logger.error(req.user.email, `delete document of task  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_document_task_comment_failure'],
            content: error
        })
    }
}


/**
 * Tạo comment trong trang create KPI employee
 */
exports.createComment = async (req, res) => {
    try {
        var files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                var path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        var comments = await PerformTaskService.createComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` create comment `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_comment_success'],
            content: { task: comments, taskId: req.params.taskId }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` create comment kpi `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['create_comment_fail'],
            content: error
        });
    }
}


/**
 * 
 *Sửa comment trong trang create KPI employee
 */
exports.editComment = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let comments = await PerformTaskService.editComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` edit comment kpi `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['edit_comment_success'],
            content: { task: comments, taskId: req.params.taskId }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit comment kpi `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['edit_comment_fail'],
            content: error
        });
    }
}

/**
 * Xóa comment trong trang create KPI employee
 */
exports.deleteComment = async (req, res) => {
    try {
        var comments = await PerformTaskService.deleteComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete comment kpi`, req.portal)
        res.status(200).json({
            success: false,
            messages: ['delete_comment_success'],
            content: { task: comments, taskId: req.params.taskId }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete comment kpi `, req.portal)
        res.status(200).json({
            success: false,
            messages: ['delete_comment_fail'],
            content: error
        })
    }
}
/**
 * 
 * Tạo comment trong comment trong trang create KPI employee (tạo replied comment)
 */
exports.createChildComment = async (req, res) => {
    try {
        var files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                var path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        var comments = await PerformTaskService.createChildComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` create comment `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_child_comment_success'],
            content: { task: comments, taskId: req.params.taskId }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` create child comment kpi `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['create_child_comment_fail'],
            content: error
        });
    }
}


/**
 * Sửa 1 comment trong trang create KPI employee (xóa comment replied)
 */
exports.editChildComment = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        var comments = await PerformTaskService.editChildComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` edit comment of comment kpi `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['edit_comment_of_comment_success'],
            content: { task: comments, taskId: req.params.taskId }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit comment of comment kpi `, req.portal)
        res.status(400).json({
            success: true,
            messages: ['edit_comment_of_comment_fail'],
            content: error
        })
    }
}

/**
 * Xóa comment của commnent trong trang create KPI employee (xóa comment replied)
 */
exports.deleteChildComment = async (req, res) => {
    try {
        var comments = await PerformTaskService.deleteChildComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete child comment kpi `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_child_comment_success'],
            content: { task: comments, taskId: req.params.taskId }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete child comment kpi `, req.portal)
        res.status(400).json({
            success: true,
            messages: ['delete_child_comment_fail'],
            content: error
        })
    }
}
/**
 * Xóa file của comment
 */
exports.deleteFileComment = async (req, res) => {
    try {
        var comments = await PerformTaskService.deleteFileComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete file comment `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_file_comment_success'],
            content: { task: comments, taskId: req.params.taskId }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete file comment `, req.portal)
        res.status(400).json({
            success: true,
            messages: ['delete_file_comment_fail'],
            content: error
        })
    }
}
/**
 * Xóa file child comment
 */
exports.deleteFileChildComment = async (req, res) => {
    try {
        var comments = await PerformTaskService.deleteFileChildComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete file child comment `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_file_comment_success'],
            content: { task: comments, taskId: req.params.taskId }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete file child comment `, req.portal)
        res.status(400).json({
            success: true,
            messages: ['delete_file_comment_fail'],
            content: error
        })
    }
}

/**
 * Lấy tất cả preceeding task
 */
exports.getAllPreceedingTasks = async (req, res) => {
    try {
        let tasks = await PerformTaskService.getAllPreceedingTasks(req.portal, req.params);
        await Logger.info(req.user.email, ` get all preceeding tasks  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_preceeding_tasks_success'],
            content: tasks
        })
    } catch (error) {
        await Logger.error(req.user.email, `get all preceeding tasks  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_all_preceeding_tasks_fail'],
            content: error
        })
    }
}
const TaskManagementService = require('./task.service');
const NotificationServices = require(`${SERVER_MODULES_DIR}/notification/notification.service`);
const { sendEmail } = require(`${SERVER_HELPERS_DIR}/emailHelper`);
const Logger = require(`${SERVER_LOGS_DIR}`);
// Điều hướng đến dịch vụ cơ sở dữ liệu của module quản lý công việc


/**
 * Lấy công việc theo tùy chọn
 * @param {*} req 
 * @param {*} res 
 */
exports.getTasks = async (req, res) => {
    if (req.query.type === "all") {
        getAllTasks(req, res);
    }
    else if (req.query.type === "responsible") {
        getPaginatedTasksThatUserHasResponsibleRole(req, res);
    }
    else if (req.query.type === "consulted") {
        getPaginatedTasksThatUserHasConsultedRole(req, res);
    }
    else if (req.query.type === "informed") {
        getPaginatedTasksThatUserHasInformedRole(req, res);
    }
    else if (req.query.type === "creator") {
        getPaginatedTasksCreatedByUser(req, res);
    }
    else if (req.query.type === "accountable") {
        getPaginatedTasksThatUserHasAccountableRole(req, res);
    }
    else if (req.query.type === "all_role") {
        getPaginatedTasksByUser(req, res);
    }
    else if (req.query.type === "paginated_task_by_unit") {
        getPaginatedTasksByOrganizationalUnit(req, res);
    }
    else if (req.query.type === "get_all_task_created_by_user") {
        getAllTasksCreatedByUser(req, res);
    }
    else if (req.query.type === "get_all_task_of_organizational_unit") {
        getAllTaskOfOrganizationalUnit(req, res);
    }
    else if (req.query.type === "task_in_unit") {
        getAllTaskOfOrganizationalUnitByMonth(req, res);
    }
    else if (req.query.type === "get_all_task_of_children_organizational_unit") {
        getAllTaskOfChildrenOrganizationalUnit(req, res)
    }
}

/**
 * Lấy tất cả các công việc
 */
getAllTasks = async (req, res) => {
    if (req.query.userId !== undefined) {
        getTasksByUser(req, res);
    }
    else {
        try {
            var task = await TaskManagementService.getAllTasks(req.portal);

            await Logger.info(req.user.email, 'get_all_tasks', req.portal);
            res.status(200).json({
                success: true,
                messages: ['get_all_task_success'],
                content: task
            });
        } catch (error) {

            await Logger.error(req.user.email, 'get_all_tasks', req.portal);
            res.status(400).json({
                success: false,
                messages: ['get_all_task_fail'],
                content: error
            });
        }
    }
}

/**
 * Lấy task evaluation
 * @param {*} req 
 * @param {*} res 
 */
exports.getTaskEvaluations = async (req, res) => {
    try {
        let taskEvaluation = await TaskManagementService.getTaskEvaluations(req.portal, req.query);

        await Logger.info(req.user.email, 'get_task_evaluattions', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_task_evaluation_success'],
            content: taskEvaluation,
        });
    } catch (error) {

        await Logger.error(req.user.email, 'get_task_evaluattions', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_task_evaluation_fail'],
            content: error,
        });
    }

}

/**
 * Lấy công việc tạo bởi một người dùng
 */
getAllTasksCreatedByUser = async (req, res) => {
    try {
        var tasks = await TaskManagementService.getTasksCreatedByUser(req.portal, req.query.userId);

        await Logger.info(req.user.email, 'get_all_tasks_created_by_user', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_tasks_by_role_success'],
            content: tasks
        });
    } catch (error) {

        await Logger.error(req.user.email, 'get_all_tasks_created_by_user', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_tasks_by_role_fail'],
            content: error
        })
    }

}

/**
 * Lấy công việc theo vai trò người thực hiện chính
 */
getPaginatedTasksThatUserHasResponsibleRole = async (req, res) => {
    try {
        let task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            startDateAfter: req.query.startDateAfter,
            endDateBefore: req.query.endDateBefore,
            aPeriodOfTime: req.query.aPeriodOfTime
        };
        let responsibleTasks = await TaskManagementService.getPaginatedTasksThatUserHasResponsibleRole(req.portal, task);

        await Logger.info(req.user.email, 'paginated_task_that_user_has_responsible_role', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_responsible_employee_success'],
            content: responsibleTasks
        })
    } catch (error) {

        await await Logger.error(req.user.email, 'paginated_task_that_user_has_responsible_role', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_responsible_employee_faile'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người phê duyệt
 */
getPaginatedTasksThatUserHasAccountableRole = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            aPeriodOfTime: req.query.aPeriodOfTime
        };
        var accountableTasks = await TaskManagementService.getPaginatedTasksThatUserHasAccountableRole(req.portal, task);

        await Logger.info(req.user.email, 'paginated_tasks_that_user_has_account_table_role', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_accountable_employee_success'],
            content: accountableTasks
        });
    } catch (error) {

        await Logger.error(req.user.email, 'paginated_tasks_that_user_has_account_table_role', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_accountable_employee_fail'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người tư vấn
 */
getPaginatedTasksThatUserHasConsultedRole = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            aPeriodOfTime: req.query.aPeriodOfTime
        };
        var consultedTasks = await TaskManagementService.getPaginatedTasksThatUserHasConsultedRole(req.portal, task);

        await Logger.info(req.user.email, 'paginated_task_that_user_has_consulted_role', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_consulted_employee_success'],
            content: consultedTasks
        })
    } catch (error) {

        await Logger.error(req.user.email, 'paginated_task_that_user_has_consulted_role', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_consulted_employee_fail'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người tạo
 */
getPaginatedTasksCreatedByUser = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            aPeriodOfTime: req.query.aPeriodOfTime
        };
        var creatorTasks = await TaskManagementService.getPaginatedTasksCreatedByUser(req.portal, task);

        await Logger.info(req.user.email, 'paginated_tasks_created_by_user', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_creator_success'],
            content: creatorTasks
        })
    } catch (error) {

        await Logger.error(req.user.email, 'paginated_tasks_created_by_user', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_creator_fail'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người quan sát
 */
getPaginatedTasksThatUserHasInformedRole = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            aPeriodOfTime: req.query.aPeriodOfTime
        };

        var informedTasks = await TaskManagementService.getPaginatedTasksThatUserHasInformedRole(req.portal, task);
        await Logger.info(req.user.email, 'paginated_task_that_user_has_informed_role', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_informed_employee_success'],
            content: informedTasks
        })
    } catch (error) {
        await Logger.error(req.user.email, 'paginated_task_that_user_has_informed_role', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_informed_employee_fail'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người quan sát
 */
getPaginatedTasksByUser = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            aPeriodOfTime: req.query.aPeriodOfTime
        };

        var tasks = await TaskManagementService.getPaginatedTasksByUser(req.portal, task);
        await Logger.info(req.user.email, ` get task informed by user `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_user_success'],
            content: tasks
        })
    } catch (error) {
        await Logger.error(req.user.email, ` get task informed by user  `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_user_fail'],
            content: error
        })
    }
}

/**
 * Tìm kiếm đơn vị theo 1 roleId
 */
getPaginatedTasksByOrganizationalUnit = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            number: req.query.number,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            aPeriodOfTime: req.query.aPeriodOfTime,
            roleId: req.query.roleId
        };

        var tasks = await TaskManagementService.getPaginatedTasksByOrganizationalUnit(req.portal, task, req.query.type);
        await Logger.info(req.user.email, ` get paginated tasks by organizational unit `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_paginated_tasks_by_organizational_unit_success'],
            content: tasks
        })
    } catch (error) {
        await Logger.error(req.user.email, ` get paginated tasks by organizational unit  `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_paginated_tasks_by_organizational_unit_failure'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người thực hiện chính với điều kiện thời gian
 */
getTasksThatUserHasResponsibleRoleByDate = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            aPeriodOfTime: req.query.aPeriodOfTime
        };
        var responsibleTasks = await TaskManagementService.getTasksThatUserHasResponsibleRoleByDate(req.portal, task);

        await await Logger.info(req.user.email, 'get_task_that_user_has_responsible_role_by_date', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_responsible_employee_success'],
            content: responsibleTasks
        })
    } catch (error) {

        await await Logger.error(req.user.email, 'get_task_that_user_has_responsible_role_by_date', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_responsible_employee_fail'],
            content: error
        })
    }
}

/**
 * Tạo một công việc mới
 */
exports.createTask = async (req, res) => {
    try {
        console.log("Tao moi cong viec")
        var tasks = await TaskManagementService.createTask(req.portal, req.body);
        var task = tasks.task;
        var user = tasks.user.filter(user => user !== req.user._id); //lọc thông tin người tạo ra khỏi danh sách sẽ gửi thông báo

        // Gửi mail cho nhân viện tham gia công việc
        var email = tasks.email;
        var html = tasks.html;
        var data = {
            organizationalUnits: task.organizationalUnit._id,
            title: "Tạo mới công việc",
            level: "general",
            content: html,
            sender: task.organizationalUnit.name,
            users: user
        };

        // Gửi mail cho trưởng đơn vị phối hợp thực hiện công việc
        let collaboratedEmail = tasks.collaboratedEmail;
        let collaboratedHtml = tasks.collaboratedHtml;
        let collaboratedData = {
            organizationalUnits: task.organizationalUnit._id,
            title: "Tạo mới công việc được phối hợp với đơn vị bạn",
            level: "general",
            content: collaboratedHtml,
            sender: task.organizationalUnit.name,
            users: tasks.deansOfOrganizationalUnitThatHasCollaborated
        };

        await NotificationServices.createNotification(req.portal, task.organizationalUnit.company, data);
        await NotificationServices.createNotification(req.portal, task.organizationalUnit.company, collaboratedData);
        await sendEmail(email, "Bạn có công việc mới", '', html);
        collaboratedEmail && collaboratedEmail.length !== 0
            && await sendEmail(collaboratedEmail, "Đơn vị bạn được phối hợp thực hiện công việc mới", '', collaboratedHtml);

        await Logger.info(req.user.email, 'create_task', req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_task_success'],
            content: task
        });
    } catch (error) {
        await Logger.error(req.user.email, 'create_task', req.portal)
        res.status(400).json({
            success: false,
            messages: ['create_task_fail'],
            content: error
        })
    }
}

/**
 *  Xóa một công việc đã thiết lập
 */
exports.deleteTask = async (req, res) => {
    try {
        TaskManagementService.deleteTask(req.portal, req.params.taskId);

        await Logger.info(req.user.email, 'delete_task', req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_success']
        });
    } catch (error) {

        await Logger.error(req.user.email, 'delete_task', req.portal)
        res.status(400).json({
            success: false,
            messages: ['delete_fail']
        })
    }
}

/**
 * Lay ra cong viec con
 */
exports.getSubTask = async (req, res) => {
    try {
        var task = await TaskManagementService.getSubTask(req.portal, req.params.taskId);

        await Logger.info(req.user.email, 'get_sub_task', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_subtask_success'],
            content: task
        })
    } catch (error) {

        await Logger.error(req.user.email, 'get_sub_task', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_subtask_fail'],
            content: error
        })
    }
}

/**
 * edit task by responsible employee
 */
exports.editTaskByResponsibleEmployees = async (req, res) => {
    try {
        var task = await TaskManagementService.editTaskByResponsibleEmployees(req.portal, req.body, req.params.id);
        var user = task.user;
        var tasks = task.tasks;
        var data = { "organizationalUnits": tasks.organizationalUnit, "title": "Cập nhật thông tin công việc", "level": "general", "content": `${user.name} đã cập nhật thông tin công việc với vai trò người phê duyệt`, "sender": tasks.name, "users": tasks.accountableEmployees };
        NotificationServices.createNotification(req.portal, tasks.organizationalUnit, data,);
        let title = "Cập nhật thông tin công việc:" + task.name;
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
/**
 * edit task by responsible employee
 */
exports.editTaskByAccountableEmployees = async (req, res) => {
    try {
        var task = await TaskManagementService.editTaskByAccountableEmployees(req.portal, req.body, req.params.id);
        var user = task.user;
        var tasks = task.tasks;
        var data = { "organizationalUnits": tasks.organizationalUnit, "title": "Cập nhật thông tin công việc", "level": "general", "content": `${user.name} đã cập nhật thông tin công việc với vai trò người phê duyệt`, "sender": tasks.name, "users": tasks.responsibleEmployees };
        NotificationServices.createNotification(req.portal, tasks.organizationalUnit, data,);
        let title = "Cập nhật thông tin công việc:" + task.name;
        sendEmail(task.email, title, '', `<p><strong>${user.name}</strong> đã cập nhật thông tin công việc với vai trò người phê duyệt <a href="${process.env.WEBSITE}/task?taskId=${req.params.id}">${process.env.WEBSITE}/task?taskId=${req.params.id}</a></p>`);
        await Logger.info(req.user.email, 'edit_task_by_account_table_employees', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_task_success'],
            content: task.newTask
        })
    } catch (error) {
        await Logger.error(req.user.email, 'edit_task_by_account_table_employees', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_task_fail'],
            content: error
        });
    }
}
/**
 * evaluate task by consulted employee
 */
exports.evaluateTaskByConsultedEmployees = async (req, res) => {
    try {
        var task = await TaskManagementService.evaluateTaskByConsultedEmployees(req.portal, req.body, req.params.id);
        await Logger.info(req.user.email, 'evaluate_task_by_consulted_employees', req.portal);
        res.status(200).json({
            success: true,
            messages: ['evaluate_task_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, 'evaluate_task_by_consulted_employees', req.portal);
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
exports.evaluateTaskByResponsibleEmployees = async (req, res) => {
    try {
        var task = await TaskManagementService.evaluateTaskByResponsibleEmployees(req.portal, req.body, req.params.id);
        await Logger.info(req.user.email, 'evaluate_task_by_responsible_employees', req.portal);
        res.status(200).json({
            success: true,
            messages: ['evaluate_task_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, 'evaluate_task_by_responsible_employees', req.portal);
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
exports.evaluateTaskByAccountableEmployees = async (req, res) => {
    try {
        var task = await TaskManagementService.evaluateTaskByAccountableEmployees(req.portal, req.body, req.params.id);
        await Logger.info(req.user.email, 'evaluate_task_by_account_table_employees', req.portal);
        res.status(200).json({
            success: true,
            messages: ['evaluate_task_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, 'evaluate_task_by_account_table_employees', req.portal);
        res.status(400).json({
            success: false,
            messages: ['evaluate_task_fail'],
            content: error
        });
    }
}

/**
 * lấy các công việc sắp hết hạn và quá hạn của nhân viên 
 */
getTasksByUser = async (req, res) => {
    try {
        const tasks = await TaskManagementService.getTasksByUser(req.portal, req.query);

        await Logger.info(req.user.email, 'get_task_by_user', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_task_by_user_success'],
            content: tasks
        });
    }
    catch (error) {
        await Logger.error(req.user.email, 'get_task_by_user', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_task_by_user_fail'],
            content: error
        });
    }
}

/** Lấy tất cả task của organizationalUnit theo tháng hiện tại */
getAllTaskOfOrganizationalUnit = async (req, res) => {
    try {
        let tasksOfOrganizationalUnit = await TaskManagementService.getAllTaskOfOrganizationalUnit(req.portal, req.query.roleId, req.query.organizationalUnitId, req.query.month);

        Logger.info(req.user.email, 'get_all_task_of_organizational_unit', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_task_of_organizational_unit_success'],
            content: tasksOfOrganizationalUnit
        })
    } catch (error) {
        Logger.error(req.user.email, 'get_all_task_of_organizational_unit', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_all_task_of_organizational_unit_failure'],
            content: error
        })
    }
}

/** Lấy tất cả task của các đơn vị con của đơn vị hiện tại */
getAllTaskOfChildrenOrganizationalUnit = async (req, res) => {
    try {
        let tasksOfChildrenOrganizationalUnit = await TaskManagementService.getAllTaskOfChildrenOrganizationalUnit(req.portal, req.user.company._id, req.query.roleId, req.query.month, req.query.organizationalUnitId); // req.portal === req.user.company._id

        Logger.info(req.user.email, 'get_all_task_of_children_organizational_unit', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_task_of_children_organizational_unit_success'],
            content: tasksOfChildrenOrganizationalUnit
        })
    } catch (error) {
        Logger.error(req.user.email, 'get_all_task_of_children_organizational_unit', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_all_task_of_children_organizational_unit_failure'],
            content: error
        })
    }
}
/** Lấy tất cả task của organizationalUnit trong một khoảng thời gian */
getAllTaskOfOrganizationalUnitByMonth = async (req, res) => {
    try {
        var task = {
            organizationalUnitId: req.query.organizationUnitId,
            startDateAfter: req.query.startDateAfter,
            endDateBefore: req.query.endDateBefore,
        };
        var responsibleTasks = await TaskManagementService.getAllTaskOfOrganizationalUnitByMonth(req.portal, task);

        await Logger.info(req.user.email, 'get_all_task_of_organizational_unit_by_month', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_all_task_of_organizational_unit_success'],
            content: responsibleTasks
        })
    } catch (error) {
        await Logger.error(req.user.email, 'get_all_task_of_organizational_unit_by_month', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_all_task_of_organizational_unit_failure'],
            content: error
        })
    }
}

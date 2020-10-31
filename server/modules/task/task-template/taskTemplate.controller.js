const TaskTemplateService = require('./taskTemplate.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

// Điều hướng đến dịch vụ cơ sở dữ liệu của module quản lý mẫu công việc

/**
 * Lấy tất cả mẫu công việc
 *  */
exports.getAllTaskTemplates = async (req, res) => {
    try {
        let data = await TaskTemplateService.getAllTaskTemplates(req.portal, req.query, req.params);

        Logger.info(req.user.email, 'get_all_task_templates', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_task_templates_success'],
            content: data
        });
    } catch (error) {

        Logger.error(req.user.email, 'get_all_task_templates', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_all_task_templates_faile'],
            content: error
        });
    }
}

/**
 * Lấy mẫu công việc theo id
 * @param {*} req 
 * @param {*} res 
 */
exports.getTaskTemplate = async (req, res) => {
    try {
        let taskTemplate = await TaskTemplateService.getTaskTemplate(req.portal, req.params.id);

        await Logger.info(req.user.email, 'get_task_template', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_task_template_success'],
            content: taskTemplate
        });
    } catch (error) {

        await Logger.error(req.user.email, 'get_task_template', req.portal);
        res.status(200).json({
            success: false,
            messages: ['get_task_template_faile'],
            content: error
        });
    }
}


/**
 * Tạo một mẫu công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.createTaskTemplate = async (req, res) => {
    try {
        var data = await TaskTemplateService.createTaskTemplate(req.portal, req.body);

        await Logger.info(req.user.email, 'create_task_template', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_task_template_success'],
            content: data
        });
    } catch (error) {

        await Logger.error(req.user.email, 'create_task_template', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_task_template_faile'],
            content: error
        });
    }
}

/**
 * Xóa một mẫu công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteTaskTemplate = async (req, res) => {
    try {
        var data = await TaskTemplateService.deleteTaskTemplate(req.portal, req.params.id);

        await Logger.info(req.user.email, 'delete_task_template', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_task_template_success'],
            content: data
        });
    } catch (error) {

        await Logger.error(req.user.email, 'delete_task_template', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_task_template_faile'],
            content: error
        });
    }
}

/**
 * Sửa 1 mẫu công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.editTaskTemplate = async (req, res) => {
    try {
        var data = await TaskTemplateService.editTaskTemplate(req.portal, req.body, req.params.id);

        await Logger.info(req.user.email, 'edit_task_template', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_task_template_success'],
            content: data
        });
    } catch (error) {

        await Logger.error(req.user.email, 'edit_task_template', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_task_template_faile'],
            content: error
        });
    }
}
/**
 * Import file Exel
 * @param {*} req 
 * @param {*} res 
 */
exports.importTaskTemplate = async (req, res) => {
    try {
        var data = await TaskTemplateService.importTaskTemplate(req.portal, req.body, req.user._id);
        
        await Logger.info(req.user.email, 'import_task_template', req.portal);
        res.status(200).json({
            success: true,
            messages: ["import_task_template_success"],
            content: data
        });
    } catch (error) {

        await Logger.error(req.user.email, 'import_task_template', req.portal);
        res.status(400).json({
            success: false,
            messages: ["import_task_template_faile"],
            content: error
        });
    }
}


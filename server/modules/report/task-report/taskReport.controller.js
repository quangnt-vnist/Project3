const TaskReportService = require('./taskReport.service');
const Logger = require(`${SERVER_LOGS_DIR}`);


/**
 * Hàm lấy danh sách báo cáo công việc
 * @param {*} req request
 * @param {*} res response 
 */
exports.getTaskReports = async (req, res) => {
    try {
        let taskReports = await TaskReportService.getTaskReports(req.portal, req.query);
        await Logger.info(req.user.email, ' get_report_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_report_success'],
            content: taskReports,
        });
    } catch (error) {
        await Logger.error(req.user.email, ' get_report_fail ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['get_report_fail'],
            content: error,
        });
    }
}


/**
 * Hàm lấy danh sách báo cáo công việc theo Id
 * @param {*} req 
 * @param {*} res 
 */
exports.getTaskReportById = async (req, res) => {
    try {
        let report = await TaskReportService.getTaskReportById(req.portal, req.params.id);
        await Logger.info(req.user.email, ' get_task_report_by_id ', req.portal);

        res.status(200).json({
            success: true,
            messages: ['get_task_report_by_id_success'],
            content: report,
        });
    } catch (error) {
        await Logger.error(req.user.email, ' get_task_report_by_id_fail ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['get_task_report_by_id_fail'],
            content: error,
        });
    }
}


/**
 * Hàm tạo mới một báo cáo công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.createTaskReport = async (req, res) => {
    try {
        let data = await TaskReportService.createTaskReport(req.portal, req.body, req.user._id);
        await Logger.info(req.user.email, ' create_report_manager_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_report_manager_success'],
            content: data,
        });
    } catch (error) {
        await Logger.error(req.user.email, ' create_report_manager_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_report_manager_faile'],
            content: error,
        });
    }
}


/**
 * Hàm xóa 1 báo cáo công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteTaskReport = async (req, res) => {
    try {
        let deleteTaskReport = await TaskReportService.deleteTaskReport(req.portal, req.params.id);
        await Logger.info(req.user.email, ' delete_report_manager_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_report_manager_success'],
            content: deleteTaskReport,
        });
    } catch (error) {
        await Logger.error(req.user.email, ' delete_report_manager_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_report_manager_faile'],
            content: error,
        });
    }
}


/**
 * Hàm chỉnh sửa một báo cáo công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.editTaskReport = async (req, res) => {
    try {
        let editTaskReport = await TaskReportService.editTaskReport(req.portal, req.params.id, req.body, req.user._id);
        await Logger.info(req.user.email, ' edit_report_manager_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_report_manager_success'],
            content: editTaskReport,
        });
    } catch (error) {
        await Logger.error(req.user.email, ' edit_report_manager_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_report_manager_faile'],
            content: error,
        });
    }
}
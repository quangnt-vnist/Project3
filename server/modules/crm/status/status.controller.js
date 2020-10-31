const StatusService = require('./status.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

/**
 * Lấy thông tin tất cả trạng thái khách hàng
 * @param {*} req 
 * @param {*} res 
 */
exports.getStatus = async (req, res) => {
    try {
        const status = await StatusService.getStatus(req.portal, req.user.company._id, req.query);
        await Logger.info(req.user.email, ' get_status_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_status_success'],
            content: status
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_status_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_status_faile'],
            content: error
        })
    }
}

/**
 * Lấy thông tin trạng thái khách hàng theo id
 * @param {*} req 
 * @param {*} res 
 */
exports.getStatusById = async (req, res) => {
    try {
        const getStatusById = await StatusService.getStatusById(req.portal, req.user.company._id, req.params.id);
        await Logger.info(req.user.email, ' get_status_by_id_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_status_by_id_success'],
            content: getStatusById
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_status_by_id_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_status_by_id_faile'],
            content: error
        })
    }
}

/**
 * Tạo mới một nhóm khách hàng
 * @param {*} req 
 * @param {*} res 
 */
exports.createStatus = async (req, res) => {
    try {
        const newStatus = await StatusService.createStatus(req.portal, req.user.company._id, req.user._id, req.body);
        await Logger.info(req.user.email, ' create_status_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_status_success'],
            content: newStatus
        })
    } catch (error) {
        await Logger.error(req.user.email, ' create_status_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_status_faile'],
            content: error
        })
    }
}

/**
 * Chỉnh sửa trạng thái khách hàng
 * @param {*} req 
 * @param {*} res 
 */
exports.editStatus = async (req, res) => {
    try {
        const statusUpdate = await StatusService.editStatus(req.portal, req.user.company._id, req.params.id, req.body, req.user._id);
        await Logger.info(req.user.email, ' edit_status_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_status_success'],
            content: statusUpdate
        })
    } catch (error) {
        await Logger.error(req.user.email, ' edit_status_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_status_faile'],
            content: error
        })
    }
}

/**
 * Xóa một trạng thái khách hàng
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteStatus = async (req, res) => {
    try {
        const deleteStatus = await StatusService.deleteStatus(req.portal, req.user.company._id, req.params.id);
        await Logger.info(req.user.email, ' delete_status_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_status_success'],
            content: deleteStatus
        })
    } catch (error) {
        await Logger.error(req.user.email, ' delete_status_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_status_faile'],
            content: error
        })
    }
}
const GroupService = require('./group.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

/**
 * Lấy thông tin của tất cả nhóm khách hàng
 * @param {*} req 
 * @param {*} res 
 */
exports.getGroups = async (req, res) => {
    try {
        const groups = await GroupService.getGroups(req.portal, req.user.company._id, req.query);
        await Logger.info(req.user.email, ' get_groups_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_groups_success'],
            content: groups
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_groups_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_groups_faile'],
            content: error
        })
    }
}

/**
 * Lấy thông tin của 1 nhóm khách hàng theo id
 * @param {*} req 
 * @param {*} res 
 */
exports.getGroupById = async (req, res) => {
    try {
        const group = await GroupService.getGroupById(req.portal, req.user.company._id, req.params.id);
        await Logger.info(req.user.email, ' get_group_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_group_success'],
            content: group
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_group_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_group_faile'],
            content: error
        })
    }
}

/**
 * Tạo mới một nhóm khách hàng
 * @param {*} req 
 * @param {*} res 
 */
exports.createGroup = async (req, res) => {
    try {
        const newGroup = await GroupService.createGroup(req.portal, req.user.company._id, req.user._id, req.body);
        await Logger.info(req.user.email, ' create_group_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_group_success'],
            content: newGroup
        })
    } catch (error) {
        await Logger.error(req.user.email, ' create_group_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_group_faile'],
            content: error
        })
    }
}

/**
 * Chỉnh sửa một nhóm khách hàng
 * @param {*} req 
 * @param {*} res 
 */
exports.editGroup = async (req, res) => {
    try {
        const groupUpdate = await GroupService.editGroup(req.portal, req.user.company._id, req.params.id, req.body, req.user._id);
        await Logger.info(req.user.email, ' edit_group_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_group_success'],
            content: groupUpdate
        })
    } catch (error) {
        await Logger.error(req.user.email, ' edit_group_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_group_faile'],
            content: error
        })
    }
}

/**
 * Xóa một khách hàng
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteGroup = async (req, res) => {
    try {
        const deleteGroup = await GroupService.deleteGroup(req.portal, req.user.company._id, req.params.id);
        await Logger.info(req.user.email, ' delete_group_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_group_success'],
            content: deleteGroup
        })
    } catch (error) {
        await Logger.error(req.user.email, ' delete_group_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_group_faile'],
            content: error
        })
    }
}
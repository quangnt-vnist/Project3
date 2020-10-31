const RoleService = require('./role.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

exports.getRoles = async (req, res) => {
    try {
        var roles = await RoleService.getRoles(req.portal, req.query); //truyen vao id cua cong ty
        
        Logger.info(req.user.email, 'get_roles_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_roles_success'],
            content: roles
        });
    } catch (error) {
 
        Logger.error(req.user.email, 'get_roles_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_roles_faile'],
            content: error
        });
    }
};

exports.getRole = async (req, res) => {
    try {
        var role = await RoleService.getRole(req.portal, req.params.id);
        
        Logger.info(req.user.email, 'show_role_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['show_role_success'],
            content: role
        });
    } catch (error) {
        
        Logger.error(req.user.email, 'show_role_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_role_faile'],
            content: error
        });
    }
};

exports.createRole = async (req, res) => {
    try {
        var role = await RoleService.createRole(req.portal, req.body);
        await RoleService.editRelationshipUserRole(req.portal, role._id, req.body.users);
        var data = await RoleService.getRole(req.portal, role._id);
        
        Logger.info(req.user.email, 'create_role_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_role_success'],
            content: data
        });
    } catch (error) {

        Logger.error(req.user.email, 'create_role_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_role_faile'],
            content: error
        });
    }
};

exports.editRole = async (req, res) => {
    try {
        let {editRoleInfo = true} = req.query;
        await RoleService.editRelationshipUserRole(req.portal, req.params.id, req.body.users);
        if(!editRoleInfo) await RoleService.editRole(req.portal, req.params.id, req.body); //truyền vào id role và dữ liệu chỉnh sửa
        let data = await RoleService.getRole(req.portal, req.params.id);
        
        Logger.info(req.user.email, 'edit_role_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_role_success'],
            content: data
        });
    } catch (error) {
        
        Logger.error(req.user.email, 'edit_role_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_role_faile'],
            content: error
        });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        var role = await RoleService.deleteRole(req.portal, req.params.id);
        
        Logger.info(req.user.email, 'delete_role_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_role_success'],
            content: role
        });
    } catch (error) {

        Logger.error(req.user.email, 'delete_role_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_role_faile'],
            content: error
        });
    }
};
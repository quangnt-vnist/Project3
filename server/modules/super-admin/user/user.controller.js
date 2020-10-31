const UserService = require('./user.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

exports.getUsers = async (req, res) => {
    if (req.query.role) {
        if (!req.query.ids) {
            getAllEmployeeOfUnitByRole(req, res);
        }
        else {
            getAllEmployeeOfUnitByIds(req, res);
        }
    }
    else {
        try {
            var users = await UserService.getUsers(req.portal, req.user.company._id, req.query);
            Logger.info(req.user.email, 'get_users_success', req.portal);

            res.status(200).json({
                success: true,
                messages: ['get_users_success'],
                content: users
            });
        } catch (error) {

            Logger.error(req.user.email, 'get_users_faile', req.portal);
            res.status(400).json({
                success: false,
                messages: Array.isArray(error) ? error : ['get_users_faile'],
                content: error
            })
        }
    }
};

getAllEmployeeOfUnitByRole = async (req, res) => {
    try {
        const employees = await UserService.getAllEmployeeOfUnitByRole(req.portal, req.query.role);

        await Logger.info(req.user.email, `get_all_employee_success`, req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_employee_success'],
            content: employees
        });
    } catch (error) {
        
        await Logger.error(req.user.email, `get_all_employee_fail`, req.portal);
        res.status(400).json({
            messages: ['get_all_employee_fail'],
            content: error
        });
    }

};
getAllEmployeeOfUnitByIds = async (req, res) => {
    try {
        const employees = await UserService.getAllEmployeeOfUnitByIds(req.portal, req.query.ids);

        await Logger.info(req.user.email, `get_all_employee_success`, req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_employee_success'],
            content: employees
        });
    } catch (error) {

        await Logger.error(req.user.email, `GET_ALL_EMPLOYEE`, req.portal);
        res.status(400).json({
            messages: ['get_all_employee_fail'],
            content: error
        });
    }
};

exports.getUser = async (req, res) => {

    try {
        var user = await UserService.getUser(req.portal, req.params.id);

        Logger.info(req.user.email, 'SHOW_USER', req.portal);
        res.status(200).json({
            success: true,
            messages: ['show_user_success'],
            content: user
        });
    } catch (error) {

        Logger.error(req.user.email, 'SHOW_USER', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_user_faile'],
            content: error
        })
    }
};

exports.getOrganizationalUnitsOfUser = async (req, res) => {
    try {
        const department = await UserService.getOrganizationalUnitsOfUser(req.portal, req.params.id);

        await Logger.info(req.user.email, 'GET_DEPARTMENT_OF_USER', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_department_of_user_success'],
            content: department
        });
    } catch (error) {

        await Logger.error(req.user.email, 'GET_DEPARTMENT_OF_USER', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_department_of_user_faile'],
            content: error
        });
    }
}


exports.createUser = async (req, res) => {
    try {
        var user = await UserService.createUser(req.portal, req.body, req.user.company._id);
        await UserService.addRolesForUser(req.portal, user._id, req.body.roles);
        var result = await UserService.getUser(req.portal, user._id);

        Logger.info(req.user.email, 'create_user_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_user_success'],
            content: result
        });
    } catch (error) {

        Logger.error(req.user.email, 'create_user_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_user_faile'],
            content: error
        })
    }
};

exports.editUser = async (req, res) => {
    try {
        var user = await UserService.editUser(req.portal, req.params.id, req.body);
        await UserService.editRolesForUser(req.portal, user._id, req.body.roles);
        var result = await UserService.getUser(req.portal, user._id);

        Logger.info(req.user.email, 'edit_user_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_user_success'],
            content: result
        });
    } catch (error) {
       
        Logger.error(req.user.email, 'edit_user_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_user_faile'],
            content: error
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        var deleteUser = await UserService.deleteUser(req.portal, req.params.id);

        Logger.info(req.user.email, 'delete_user_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_user_success'],
            content: deleteUser
        });
    } catch (error) {

        Logger.error(req.user.email, 'delete_user_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_user_faile'],
            content: error
        });
    }
};

exports.getAllUsersWithRole = async (req, res) => {
    try {
        let users = await UserService.getAllUsersWithRole(req.portal);

        Logger.info(req.user.email, 'get_all_user_with_role_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_user_with_role_success'],
            content: users
        });
    } catch (error) {

        Logger.error(req.user.email, 'get_all_user_with_role_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_all_user_with_role_faile'],
            content: error
        });
    }
}

const AuthService = require('./auth.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

exports.login = async (req, res) => {
    try {
        const loginUser = await AuthService.login(req.header('fingerprint'), req.body);
        await Logger.info(req.body.email, 'login_success', req.body.portal);
        res.status(200).json({
            success: true,
            messages: ['login_success'],
            content: loginUser
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.body.email, 'login_faile', req.body.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['login_faile'],
            content: error
        });
    }
};

exports.logout = async (req, res) => {
    try {
        const logout = await AuthService.logout(req.portal, req.user._id);

        await Logger.info(req.user.email, 'logout_suscess', req.portal);
        res.status(200).json({
            success: true,
            messages: ['logout_success'],
            content: logout
        });
    } catch (error) {
        await Logger.error(req.user.email, 'logout_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['logout_faile'],
            content: error
        });
    }
};

exports.logoutAllAccount = async (req, res) => {
    try {
        const logout = await AuthService.logoutAllAccount(req.portal, req.user._id);
        
        await Logger.info(req.user.email, 'logout_all_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['logout_all_success'],
            content: logout
        });
    } catch (error) {

        await Logger.error(req.user.email, 'logout_all_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['logout_all_faile'],
            content: error
        });
    }
};

exports.forgetPassword = async (req, res) => {
    try {
        const { portal, email } = req.body;
        const forgetPassword = await AuthService.forgetPassword(portal, email);

        await Logger.info(req.body.email, 'request_forgot_password_success');
        res.status(200).json({
            success: true,
            messages: ['request_forgot_password_success'],
            content: forgetPassword
        });
    } catch (error) {

        await Logger.error(req.body.email, 'request_forgot_password_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['request_forgot_password_faile'],
            content: error
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const resetPassword = await AuthService.resetPassword(req.body.portal, req.body.otp, req.body.email, req.body.password);

        await Logger.info(req.body.email, 'reset_password_success');
        res.status(200).json({
            success: true,
            messages: ['reset_password_success'],
            content: resetPassword
        });
    } catch (error) {

        await Logger.error(req.body.email, 'reset_password_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['reset_password_faile'],
            content: error
        });
    }
};

exports.changeInformation = async (req, res) => {

    try {
        let avatar;
        if(req.file){
            let path = req.file.destination +'/'+ req.file.filename;
            avatar = path.substr(1, path.length)
        }
        const profile = await AuthService.changeInformation(req.portal, req.params.id, req.body.name, req.body.email, avatar);

        await Logger.info(req.user.email, 'change_user_information_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['change_user_information_success'],
            content: profile
        });
    } catch (error) {

        await Logger.error(req.user.email, 'change_user_information_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['change_user_information_faile'],
            content: error
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const user = await AuthService.changePassword(req.portal, req.params.id, req.body.password, req.body.new_password);

        await Logger.info(req.user.email, 'change_user_password_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['change_user_password_success'],
            content: user
        });
    } catch (error) {

        await Logger.error(req.user.email, 'change_user_password_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['change_user_password_faile'],
            content: error
        });
    }
};

exports.getLinksThatRoleCanAccess = async (req, res) => {
    try {
        const data = await AuthService.getLinksThatRoleCanAccess(req.portal, req.params.id);

        await Logger.info(req.user.email, 'get_links_of_role_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_links_of_role_success'],
            content: data
        });
    } catch (error) {

        await Logger.error(req.user.email, 'get_links_of_role_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_links_of_role_faile'],
            content: error
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const profile = await AuthService.getProfile(req.portal, req.params.id);

        await Logger.info(req.user.email, 'show_profile_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['show_profile_success'],
            content: profile
        });
    } catch (error) {

        await Logger.info(req.user.email, 'show_profile_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_profile_faile'],
            content: error
        });
    }
};
 /**
 * Người dùng download 1 file từ server
 * @path: đường dẫn tương đối về file - được lấy qua trường 'path' của req.query
 * Tham số về đường dẫn tương đối của file đường truyền từ bên client đến server như sau:
 * localhost:8000/auth/download-file?path=duong_dan_tuong_doi_cua_file_can_tai
 */
exports.downloadFile = async (req, res) => {
    try {
        const { path } = req.query;
        res.download(path);
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['download_file_faile'],
            content: error
        });
    }
}
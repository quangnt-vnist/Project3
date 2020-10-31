const ModuleConfigurationService = require('./moduleConfiguration.service');
const Log = require(`${SERVER_LOGS_DIR}`);


// Lấy thông tin cấu hình module quản lý nhân sự
exports.getConfiguration = async (req, res) => {
    try {
        let config = await ModuleConfigurationService.getHumanResourceConfiguration(req.portal);

        await Log.info(req.user.email, 'GET_CONFIGURATION', req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_configuration_success"],
            content: config
        });
    } catch (error) {
        await Log.info(req.user.email, 'GET_CONFIGURATION', req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_configuration_faile"],
            content: {
                error: error
            }
        });
    }
};

// Chỉnh sửa thông tin cấu hình module quản lý nhân sự
exports.editConfiguration = async (req, res) => {
    try {
        let config = await ModuleConfigurationService.editHumanResourceConfiguration(req.portal, req.body);

        await Log.info(req.user.email, 'EDIT_CONFIGURATION', req.portal);

        res.status(200).json({
            success: true,
            messages: ["edit_configuration_success"],
            content: config
        });
    } catch (error) {
        await Log.info(req.user.email, 'EDIT_CONFIGURATION', req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_configuration_faile"],
            content: {
                error: error
            }
        });
    }
};
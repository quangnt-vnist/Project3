const SystemSettingServices = require('./systemSetting.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

exports.getBackups = async(req, res) => {
    try {
        const content = await SystemSettingServices.getBackups();
        
        Logger.info(req.user.email, 'get_backups_success');
        res.status(200).json({
            success: true,
            messages: ['get_backups_success'],
            content
        });
    } catch (error) {

        Logger.error(req.user.email, 'get_backups_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_backups_faile'],
            content: error
        });
    }
}

exports.getConfigBackup = async(req, res) => {
    try {
        const content = await SystemSettingServices.getConfigBackup();

        Logger.info(req.user.email, 'get_config_backup_success');
        res.status(200).json({
            success: true,
            messages: ['get_config_backup_success'],
            content
        });
    } catch (error) {console.log(error)

        Logger.error(req.user.email, 'get_config_backup_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_config_backup_faile'],
            content: error
        });
    }
}

exports.configBackup = async(req, res) => {
    try {
        await SystemSettingServices.configBackup(req.query, req.body);
        
        Logger.info(req.user.email, 'config_backup_success');
        res.status(200).json({
            success: true,
            messages: ['config_backup_success']
        });
    } catch (error) {

        Logger.eror(req.user.email, 'config_backup_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['config_backup_faile'],
            content: error
        });
    }
};

exports.createBackup = async(req, res) => {
    try {
        const content = await SystemSettingServices.createBackup(req.body, req.query);
        
        Logger.info(req.user.email, 'backup_success');
        res.status(200).json({
            success: true,
            messages: ['backup_success'],
            content
        });
    } catch (error) {console.log("Co", error)

        Logger.error(req.user.email, 'backup_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['backup_faile'],
            content: error
        });
    }
};

exports.deleteBackup = async(req, res) => {
    try {
        const content = await SystemSettingServices.deleteBackup(req.params.version);
        
        Logger.info(req.user.email, 'delete_backup_success');
        res.status(200).json({
            success: true,
            messages: ['delete_backup_success'],
            content
        });
    } catch (error) {

        Logger.error(req.user.email, 'delete_backup_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_backup_faile'],
            content: error
        });
    }
};

exports.restore = async(req, res) => {
    try {
        await SystemSettingServices.restore(req.query.backupVersion);
        
        Logger.info(req.user.email, 'restore_success');
        res.status(200).json({
            success: true,
            messages: ['restore_success']
        });
    } catch (error) {

        Logger.eror(req.user.email, 'restore_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['restore_faile'],
            content: error
        });
    }
};

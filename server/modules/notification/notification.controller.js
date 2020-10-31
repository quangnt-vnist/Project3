const NotificationServices = require('./notification.service');
const Log = require(`${SERVER_LOGS_DIR}`);

exports.getAllManualNotifications = async (req, res) => {
    try {
        const manualNotifications = await NotificationServices.getAllManualNotifications(req.portal, req.user._id);

        await Log.info(req.user.email, 'GET_MANUAL_NOTIFICATIONS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_manual_notifications_success'],
            content: manualNotifications
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_MANUAL_NOTIFICATIONS', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_all_manual_notifications__faile'],
            content: error
        })
    }
};

exports.paginateManualNotifications = async (req, res) => {
    try {
        const notifications = await NotificationServices.paginateManualNotifications(req.portal, req.user._id, req.body);
        await Log.info(req.user.email, 'PAGINATE_MANUAL_NOTIFICATIONS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['paginate_manual_notifications_success'],
            content: notifications
        });
    } catch (error) {

        await Log.error(req.user.email, 'PAGINATE_MANUAL_NOTIFICATIONS', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['paginate_manual_notifications_faile'],
            content: error
        });
    }
};

exports.createNotification = async (req, res) => {
    try {
        const notification = await NotificationServices.createManualNotification(req.portal, req.body);
        await NotificationServices.createNotification(req.portal, req.user.company._id, req.body, notification._id);

        await Log.info(req.user.email, 'CREATE_NOTIFICATION', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_notification_success'],
            content: notification
        });
    } catch (error) {

        await Log.error(req.user.email, 'CREATE_NOTIFICATION', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_notification_faile'],
            content: error
        });
    }
};

// Lấy tất cả các thông báo mà người dùng nhận được
exports.getAllNotifications = async (req, res) => {
    try {
        const notification = await NotificationServices.getAllNotifications(req.portal, req.user._id);

        await Log.info(req.user.email, 'GET_ALL_NOTIFICATIONS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_notification_success'],
            content: notification
        })
    } catch (error) {

        await Log.error(req.user.email, 'GET_ALL_NOTIFICATIONS', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_all_notification_faile'],
            content: error
        })
    }
};

exports.paginateNotifications = async (req, res) => {
    try {
        const notifications = await NotificationServices.paginateNotifications(req.portal, req.user._id, req.body);
        await Log.info(req.user.email, 'PAGINATE_NOTIFICATIONS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['paginate_notifications_success'],
            content: notifications
        });
    } catch (error) {

        await Log.error(req.user.email, 'PAGINATE_NOTIFICATIONS', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['paginate_notifications_faile'],
            content: error
        });
    }
};

exports.changeNotificationStateToReaded = async (req, res) => {
    try {
        const notification = await NotificationServices.changeNotificationStateToReaded(req.portal, req.user._id, req.body.id, req.body.readAll);

        await Log.info(req.user.email, 'CHANGE_NOTIFICATION_STATE_TO_READED', req.portal);
        res.status(200).json({
            success: true,
            messages: ['change_notification_state_to_readed_success'],
            content: {notification : notification, readAll: req.body.readAll}
        });
    } catch (error) {

        await Log.error(req.user.email, 'CHANGE_NOTIFICATION_STATE_TO_READED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['change_notification_state_to_readed_faile'],
            content: error
        });
    }
};

exports.deleteManualNotification = async (req, res) => {
    try {
        const notification = await NotificationServices.deleteManualNotification(req.portal, req.params.id);

        await Log.info(req.user.email, 'DELETE_MANUAL_NOTIFICATION', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_manual_notification_success'],
            content: notification
        });
    } catch (error) {

        await Log.error(req.user.email, 'DELETE_MANUAL_NOTIFICATION', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_manual_notification_faile'],
            content: error
        });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const notification = await NotificationServices.deleteNotification(req.portal, req.params.id);

        await Log.info(req.user.email, 'DELETE_NOTIFICATION', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_notification_success'],
            content: notification
        });
    } catch (error) {

        await Log.error(req.user.email, 'DELETE_NOTIFICATION', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_notification_faile'],
            content: error
        });
    }
};
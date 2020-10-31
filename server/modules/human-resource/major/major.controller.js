const MajorService = require('./major.service');
const UserService = require(`${SERVER_MODULES_DIR}/super-admin/user/user.service`);
const NotificationServices = require(`${SERVER_MODULES_DIR}/notification/notification.service`);
const EmployeeService = require('../profile/profile.service');

const {
    sendEmail
} = require(`${SERVER_HELPERS_DIR}/emailHelper`);

const Log = require(`${SERVER_LOGS_DIR}`);

/** Lấy danh sách nghỉ phép */
exports.searchMajor = async (req, res) => {
    try {
        let data = {};

        let params = {
            majorName: req.query.name,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
        }
        data = await MajorService.searchMajor(req.portal, params);

        // await Log.info(req.user.email, 'GET_MAJOR', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_major_success"],
            content: data
        });
    } catch (error) {
        // await Log.error(req.user.email, 'GET_MAJOR', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_major_faile"],
            content: {
                error: error
            }
        });
    }
}

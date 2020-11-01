const careerPositionService = require('./careerPosition.service');
const UserService = require(`${SERVER_MODULES_DIR}/super-admin/user/user.service`);
const NotificationServices = require(`${SERVER_MODULES_DIR}/notification/notification.service`);
const EmployeeService = require('../profile/profile.service');

const {
    sendEmail
} = require(`${SERVER_HELPERS_DIR}/emailHelper`);

const Log = require(`${SERVER_LOGS_DIR}`);

/** Lấy danh sách nghỉ phép */
exports.searchCareerPosition = async (req, res) => {
    // try {
        let data = {};

        let params = {
            name: req.query.name,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
        }
        data = await careerPositionService.searchCareerPosition(req.portal, params);

        // await Log.info(req.user.email, 'GET_CAREER_POSITION', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_position_success"],
            content: data
        });
    // } catch (error) {
    //     // await Log.error(req.user.email, 'GET_CAREER_POSITION', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: ["get_position_faile"],
    //         content: {
    //             error: error
    //         }
    //     });
    // }
}

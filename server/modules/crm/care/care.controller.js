const CareService = require('./care.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

exports.getCares = async (req, res) => {
    try {
        const cares = await CareService.getCares(req.portal, req.user.company._id, req.query);
        await Logger.info(req.user.email, ' get_cares_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_cares_success'],
            content: cares
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_cares_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_cares_faile'],
            content: error
        })
    }
}


exports.getCareById = async (req, res) => {
    try {
        const care = await CareService.getCareById(req.portal, req.user.company._id, req.params.id);
        await Logger.info(req.user.email, ' get_care_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_care_success'],
            content: care
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_care_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_care_faile'],
            content: error
        })
    }
}


exports.createCare = async (req, res) => {
    try {
        const newCare = await CareService.createCare(req.portal, req.user.company._id, req.body, req.user._id);
        await Logger.info(req.user.email, ' create_care_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_care_success'],
            content: newCare
        })
    } catch (error) {
        await Logger.error(req.user.email, ' create_care_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_care_faile'],
            content: error
        })
    }
}


exports.editCare = async (req, res) => {
    try {
        const careUpdate = await CareService.editCare(req.portal, req.user.company._id, req.params.id, req.body, req.user._id);
        await Logger.info(req.user.email, ' edit_care_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_care_success'],
            content: careUpdate
        })
    } catch (error) {
        await Logger.error(req.user.email, ' edit_care_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_care_faile'],
            content: error
        })
    }
}


exports.deleteCare = async (req, res) => {
    try {
        const deleteCare = CareService.deleteCare(req.portal, req.user.company._id, req.params.id);
        await Logger.info(req.user.email, ' delete_care_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_care_success'],
            content: deleteCare
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ['delete_care_faile'],
            content: error
        })
    }
}

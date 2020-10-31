const CareTypeService = require('./careType.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

exports.getCareTypes = async (req, res) => {
    try {
        const careTypes = await CareTypeService.getCareTypes(req.portal, req.user.company._id, req.query);
        await Logger.info(req.user.email, ' get_careTypes_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_careTypes_success'],
            content: careTypes
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_careTypes_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_careTypes_faile'],
            content: error
        })
    }
}


exports.getCareTypeById = async (req, res) => {
    try {
        const careType = await CareTypeService.getCareTypeById(req.portal, req.user.company._id, req.params.id);
        await Logger.info(req.user.email, ' get_careType_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_careType_success'],
            content: careType
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_careType_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_careType_faile'],
            content: error
        })
    }
}


exports.createCareType = async (req, res) => {
    try {
        const newCareType = await CareTypeService.createCareType(req.portal, req.user.company._id, req.body, req.user._id);
        await Logger.info(req.user.email, ' create_careType_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_careType_success'],
            content: newCareType
        })
    } catch (error) {
        await Logger.error(req.user.email, ' create_careType_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_careType_faile'],
            content: error
        })
    }
}


exports.editCareType = async (req, res) => {
    try {
        const careUpdate = await CareTypeService.editCareType(req.portal, req.user.company._id, req.params.id, req.body, req.user._id);
        await Logger.info(req.user.email, ' edit_careType_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_careType_success'],
            content: careUpdate
        })
    } catch (error) {
        await Logger.error(req.user.email, ' edit_careType_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_careType_faile'],
            content: error
        })
    }
}


exports.deleteCareType = async (req, res) => {
    try {
        const deleteCare = CareTypeService.deleteCare(req.portal, req.user.company._id, req.params.id);
        await Logger.info(req.user.email, ' delete_careType_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_careType_success'],
            content: deleteCare
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ['delete_careType_faile'],
            content: error
        })
    }
}

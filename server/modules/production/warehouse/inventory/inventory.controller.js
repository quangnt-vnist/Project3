const LotService = require('./inventory.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

exports.getAllLots = async (req, res) => {
    try {
        const lots = await LotService.getAllLots(req.query, req.portal);
        await Logger.info(req.user.email, 'GET_LOT_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_lot_success'],
            content: lots
        })
    }
    catch(error) {
        await Logger.error(req.user.email, 'GET_LOT_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_lot_failed'],
            content: error
        })
    }
}

exports.getDetailLot = async (req, res) => {
    try {
        const lot = await LotService.getDetailLot(req.params.id, req.portal);

        await Logger.info(req.user.email, 'GET_DETAIL_LOT_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            message: ['get_lot_success'],
            content: lot
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'GET_DETAIL_LOT_FAILED', req.portal);
        res.status(400).json({
            success: false,
            message: ['get_lot_failed'],
            content: error
        })
    }
}

exports.editLot = async (req, res) => {
    try {
        let lot = await LotService.editLot(req.params.id, req.body, req.portal);

        await Logger.info(req.user.email, 'EDIT_LOT_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            message: ['edit_lot_success'],
            content: lot
        })
    }
    catch (err) {
        await Logger.error(req.user.email, 'EDIT_LOT_FAILURE', req.portal);
        res.status(400).json({
            success: false,
            message: ['edit_lot_failed'],
            content: error
        })
    }
}
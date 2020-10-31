const Log = require(`${SERVER_LOGS_DIR}`);
const PurchasingRequestService = require('./purchasingRequest.service');

exports.createPurchasingRequest = async (req, res) => {
    try {
        let data = req.body;
        let purchasingRequest = await PurchasingRequestService.createPurchasingRequest(req.user._id, data, req.portal);

        await Log.info(req.user.email, "CREATE_PURCHASING_REQUEST", req.portal);

        res.status(210).json({
            success: true,
            messages: ["create_successfully"],
            content: purchasingRequest
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATE_PURCHASING_REQUESST", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        })
    }
}

exports.getAllPurchasingRequest = async (req, res) => {
    try {

        let query = req.query;
        let purchasingRequests = await PurchasingRequestService.getAllPurchasingRequest(query, req.portal);

        await Log.info(req.user.email, "GET_ALL_PURCHASING_REQUEST", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: purchasingRequests
        })

    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_PURCHASING_REQUEST", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        })
    }
}
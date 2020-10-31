const RecommendProcureService = require('./purchase-request.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

/**
 * Lấy danh sách phiếu đề nghị mua sắm thiết bị
 */
exports.searchPurchaseRequests = async (req, res) => {
    try {
        var listRecommendProcures = await RecommendProcureService.searchPurchaseRequests(req.portal, req.user.company._id, req.query);
        await Logger.info(req.user.email, 'GET_PURCHASE_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_purchase_request_success"],
            content: listRecommendProcures
        });
    } catch (error) {
        console.log(error);
        await Logger.error(req.user.email, 'GET_PURCHASE_REQUEST', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_purchase_request_faile"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Tạo mới thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.createPurchaseRequest = async (req, res) => {
    try {
        var newRecommendProcure = await RecommendProcureService.createPurchaseRequest(req.portal, req.user.company._id, req.body);
        await Logger.info(req.user.email, 'CREATE_PURCHASE_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_purchase_request_success"],
            content: newRecommendProcure
        });

    } catch (error) {
        console.log(error);
        await Logger.error(req.user.email, 'CREATE_PURCHASE_REQUEST', req.portal);
        res.status(400).json({
            success: false,
            messages: "create_purchase_request_faile",
            content: {
                inputData: req.body
            }
        });
    }
}

/**
 * Xoá thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.deletePurchaseRequest = async (req, res) => {
    try {
        var recommendprocureDelete = await RecommendProcureService.deletePurchaseRequest(req.portal, req.params.id);
        await Logger.info(req.user.email, 'DELETE_PURCHASE_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_purchase_request_success"],
            content: recommendprocureDelete
        });
    } catch (error) {
        await Logger.error(req.user.email, 'DELETE_PURCHASE_REQUEST', req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_purchase_request_success"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.updatePurchaseRequest = async (req, res) => {
    try {
        var recommendprocureUpdate = await RecommendProcureService.updatePurchaseRequest(req.portal, req.params.id, req.body);
        await Logger.info(req.user.email, 'EDIT_PURCHASE_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_purchase_request_success"],
            content: recommendprocureUpdate
        });

    } catch (error) {
        await Logger.error(req.user.email, 'EDIT_PURCHASE_REQUEST', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_purchase_request_faile'],
            content: {
                error: error
            }
        });
    }
}
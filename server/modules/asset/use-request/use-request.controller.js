const RecommendDistributeService = require('./use-request.service');
const Logger = require(`${SERVER_LOGS_DIR}`);
const { read } = require('fs');

/**
 * Lấy danh sách phiếu đề nghị mua sắm thiết bị
 */
exports.searchUseRequests = async (req, res) => {
    if (req.query.getUseRequestByAssetId) {
        getUseRequestByAsset(req, res);
    } else {
        try {
            var listRecommendDistributes = await RecommendDistributeService.searchUseRequests(req.portal, req.user.company._id, req.query);
            await Logger.info(req.user.email, 'GET_USE_REQUEST', req.portal);
            res.status(200).json({
                success: true,
                messages: ["get_use_request_success"],
                content: listRecommendDistributes
            });
        } catch (error) {
            await Logger.error(req.user.email, 'GET_USE_REQUEST', req.portal);
            res.status(400).json({
                success: false,
                messages: ["get_use_request_faile"],
                content: {
                    error: error
                }
            });
        }
    }
}

getUseRequestByAsset = async (req, res) => {
    try {
        var listRecommendDistributes = await RecommendDistributeService.getUseRequestByAsset(req.portal, req.query);
        await Logger.info(req.user.email, 'GET_USE_REQUEST_BY_ASSET', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_use_request_by_asset_success"],
            content: listRecommendDistributes
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_USE_REQUEST_BY_ASSET', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_use_request_by_asset_faile"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Tạo mới thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.createUseRequest = async (req, res) => {
    try {
        var newRecommendDistribute = await RecommendDistributeService.createUseRequest(req.portal, req.user.company._id, req.body);
        await Logger.info(req.user.email, 'CREATE_USE_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_use_request_success"],
            content: newRecommendDistribute
        });

    } catch (error) {
        await Logger.error(req.user.email, 'CREATE_USE_REQUEST', req.portal);
        res.status(400).json({
            success: false,
            messages: "create_use_request_faile",
            content: {
                inputData: req.body
            }
        });
    }
}

/**
 * Xoá thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.deleteUseRequest = async (req, res) => {
    try {
        var recommenddistributeDelete = await RecommendDistributeService.deleteUseRequest(req.params.id);
        await Logger.info(req.user.email, 'DELETE_USE_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_use_request_success"],
            content: recommenddistributeDelete
        });
    } catch (error) {
        await Logger.error(req.user.email, 'DELETE_USE_REQUEST', req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_use_request_success"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
 */
exports.updateUseRequest = async (req, res) => {
    try {
        var recommenddistributeUpdate = await RecommendDistributeService.updateUseRequest(req.portal, req.params.id, req.body);
        await Logger.info(req.user.email, 'EDIT_USE_REQUEST', req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_use_request_success"],
            content: recommenddistributeUpdate
        });

    } catch (error) {
        await Logger.error(req.user.email, 'EDIT_USE_REQUEST', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_use_request_faile'],
            content: {
                error: error
            }
        });
    }
}
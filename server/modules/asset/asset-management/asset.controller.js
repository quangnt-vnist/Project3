const AssetService = require('./asset.service');
const Logger = require(`${SERVER_LOGS_DIR}`);


/**
 * Lấy danh sách tài sản
 */
exports.searchAssetProfiles = async (req, res) => {
    try {
        let data;
        if (req.query.type === "get-building-as-tree") {
            data = await AssetService.getListBuildingAsTree(req.portal, req.user.company._id);
        } else if (!req.query.page && !req.query.limit) {
            data = await AssetService.getAssets(req.portal, req.user.company._id, false);
        } else {
            let params = {
                code: req.query.code,
                assetName: req.query.assetName,
                status: req.query.status,
                group: req.query.group,
                typeRegisterForUse: req.query.typeRegisterForUse,
                assetType: req.query.assetType,
                purchaseDate: req.query.purchaseDate,
                disposalDate: req.query.disposalDate,
                handoverUnit: req.query.handoverUnit,
                handoverUser: req.query.handoverUser,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
                managedBy: req.query.managedBy,
                currentRole: req.query.currentRole,

                startDepreciation: req.query.startDepreciation,
                depreciationType: req.query.depreciationType,

                maintainanceCode: req.query.maintainanceCode,
                maintainCreateDate: req.query.maintainCreateDate,
                maintainStatus: req.query.maintainStatus,
                maintainType: req.query.maintainType,

                incidentCode: req.query.incidentCode,
                incidentStatus: req.query.incidentStatus,
                incidentType: req.query.incidentType,
            }
            data = await AssetService.searchAssetProfiles(req.portal, req.user.company._id, params);

        }

        // data = await AssetService.searchAssetProfiles(params, req.portal);

        await Logger.info(req.user.email, 'GET_ASSETS', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_list_asset_success"],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_ASSETS', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_list_asset_false"],
            content: {
                error: error
            }
        });
    }
}


/**
 * Thêm mới thông tin tài sản
 */
exports.createAsset = async (req, res) => {
    try {
        let avatar = "";
        if (req.files && req.files.fileAvatar) {
            avatar = `/${req.files.fileAvatar[0].path}`;
        }
        let file = req.files && req.files.file;
        let fileInfo = { file, avatar };

        let data = await AssetService.createAsset(req.portal, req.user.company._id, req.body, fileInfo);
        await Logger.info(req.user.email, 'CREATE_ASSET', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_asset_success"],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, 'CREATE_ASSET', req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_asset_faile"],
            content: { error: error }
        });
    }
}


/**
 * Cập nhật thông tin tài sản
 */
exports.updateAssetInformation = async (req, res) => {
    try {
        let avatar = "";
        if (req.files.fileAvatar) {
            avatar = `/${req.files.fileAvatar[0].path}`;
        }
        let file = req.files.file;
        let fileInfo = { file, avatar };

        let data = await AssetService.updateAssetInformation(req.portal, req.user.company._id, req.params.id, req.body, fileInfo);

        await Logger.info(req.user.email, 'EDIT_ASSET', req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_asset_success"],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, 'EDIT_ASSET', req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_asset_false"],
            content: { error: error }
        });
    }
}


/**
 * Xoá thông tin tài sản
 */
exports.deleteAsset = async (req, res) => {
    try {
        let data = await AssetService.deleteAsset(req.portal, req.params.id);
        res.status(200).json({
            success: true,
            messages: ["delete_asset_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["delete_asset_false"],
            content: { error: error }
        });
    }
}


/**
 * Chỉnh sửa thông tin khấu hao tài sản
 */
exports.updateDepreciation = async (req, res) => {
    try {
        let data = await AssetService.updateDepreciation(req.portal, req.params.id, req.body);
        res.status(200).json({
            success: true,
            messages: ["edit_depreciation_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["edit_depreciation_false"],
            content: { error: error }
        });
    }
}

/**
 * Thêm mới thông tin bảo trì cho sự cố
 */
exports.createMaintainanceForIncident = async (req, res) => {
    try {
        let data = await AssetService.createMaintainanceForIncident(req.portal, req.params.id, req.body);
        res.status(200).json({
            success: true,
            messages: ["create_maintainance_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["create_maintainance_false"],
            content: { error: error }
        });
    }
}


//*****************Thông tin sử dụng******************/
/**
 * Thêm mới thông tin sử dụng tài sản
 */
exports.createUsage = async (req, res) => {
    try {
        let data = await AssetService.createUsage(req.portal, req.params.id, req.body);
        res.status(200).json({
            success: true,
            messages: ["create_usage_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["create_usage_false"],
            content: { error: error }
        });
    }
}


/**
 * Chỉnh sửa thông tin sử dụng tài sản
 */
exports.updateUsage = async (req, res) => {
    if (req.query.recallAsset) {
        recallAsset(req, res)
    } else {
        try {
            let data = await AssetService.updateUsage(req.portal, req.params.id, req.body);
            res.status(200).json({
                success: true,
                messages: ["edit_usage_success"],
                content: data
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                messages: ["edit_usage_false"],
                content: { error: error }
            });
        }
    }
}

recallAsset = async (req, res) => {
    try {
        let data = await AssetService.recallAsset(req.portal, req.params.id, req.body);
        res.status(200).json({
            success: true,
            messages: ["recall_asset_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["recall_asset_false"],
            content: { error: error }
        });
    }
}
/**
 * Xóa thông tin sử dụng tài sản
 */
exports.deleteUsage = async (req, res) => {
    try {
        let data = await AssetService.deleteUsage(req.portal, req.params.id, req.body.usageId);
        res.status(200).json({
            success: true,
            messages: ["delete_usage_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["delete_usage_false"],
            content: { error: error }
        });
    }
}



//*****************Thông tin bảo trì**************/

/**
 * Lấy danh sách thông tin bảo trì tài sản
 */
exports.getMaintainances = async (req, res) => {
    try {
        let data = await AssetService.getMaintainances(req.portal, req.query);
        res.status(200).json({
            success: true,
            messages: ["get_maintainance_success"],
            content: data
        });
    } catch (error) {
        console.log("get_maintainance_false", error);
        res.status(400).json({
            success: false,
            messages: ["get_maintainance_false"],
            content: { error: error }
        });
    }
}

/**
 * Thêm mới thông tin bảo trì tài sản
 */
exports.createMaintainance = async (req, res) => {
    try {
        let data = await AssetService.createMaintainance(req.portal, req.params.id, req.body, req.query.incident_id);
        res.status(200).json({
            success: true,
            messages: ["create_maintainance_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["create_maintainance_false"],
            content: { error: error }
        });
    }
}

/**
 * Chỉnh sửa thông tin bảo trì tài sản
 */
exports.updateMaintainance = async (req, res) => {
    try {
        let data = await AssetService.updateMaintainance(req.portal, req.params.id, req.body);
        res.status(200).json({
            success: true,
            messages: ["edit_maintainance_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["edit_maintainance_false"],
            content: { error: error }
        });
    }
};

/**
 * Xóa thông tin bảo trì tài sản
 */
exports.deleteMaintainance = async (req, res) => {
    try {
        let data = await AssetService.deleteMaintainance(req.portal, req.params.id, req.body.maintainanceId);
        res.status(200).json({
            success: true,
            messages: ["delete_maintainance_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["delete_maintainance_false"],
            content: { error: error }
        });
    }
};


//*****************Thông tin sự cố**************/

exports.getIncidents = async (req, res) => {
    try {
        let data = await AssetService.getIncidents(req.portal, req.query);
        res.status(200).json({
            success: true,
            messages: ["get_incidents_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["get_incidents_false"],
            content: { error: error }
        });
    }
}

/**
 * Thêm mới thông tin sự cố tài sản
 */
exports.createIncident = async (req, res) => {
    try {
        let data = await AssetService.createIncident(req.portal, req.params.id, req.body);
        res.status(200).json({
            success: true,
            messages: ["create_incident_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({ success: false, messages: ["create_incident_false"], content: { error: error } });
    }
}

/**
 * Chỉnh sửa thông tin sự cố tài sản
 */
exports.updateIncident = async (req, res) => {
    try {
        let data = await AssetService.updateIncident(req.portal, req.params.id, req.body);
        res.status(200).json({
            success: true,
            messages: ["edit_incident_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["edit_incident_false"],
            content: { error: error }
        });
    }
}

/**
 * Xóa thông tin sự cố tài sản
 */
exports.deleteIncident = async (req, res) => {
    console.log('req.params.id, req.body.incidentId', req.params.id, req.body);
    try {
        let data = await AssetService.deleteIncident(req.portal, req.params.id, req.body.incidentId);
        res.status(200).json({
            success: true,
            messages: ["delete_incident_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["delete_incident_false"],
            content: { error: error }
        });
    }
}
const BinLocationServices = require('./binLocation.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

exports.getBinLocations = async (req, res) => {
    try {
        const binLocations = await BinLocationServices.getBinLocations(req.query, req.portal);

        await Logger.info(req.user.email, 'GET_BIN_LOCATIONS_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_bin_locations_success'],
            content: binLocations
        });
    }
    catch(error) {
        await Logger.error(req.user.email, 'GET_BIN_LOCATIONS_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_bin_locations_failed'],
            content: error
        });
    }
}

exports.getChildBinLocations = async (req, res) => {
    try {
        const binLocations = await BinLocationServices.getChildBinLocations(req.query, req.portal);

        await Logger.info(req.user.email, 'GET_BIN_LOCATIONS_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_bin_locations_success'],
            content: binLocations
        });
    }
    catch(error) {
        await Logger.error(req.user.email, 'GET_BIN_LOCATIONS_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_bin_locations_failed'],
            content: error
        });
    }
}

exports.getDetailBinLocation = async (req, res) => {
    try {
        const binLocation = await BinLocationServices.getDetailBinLocation(req.params.id, req.portal);

        await Logger.info(req.user.email, 'GET_DETAIL_BIN_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_bin_location_success'],
            content: binLocation
        })
    }
    catch(error) {
        await Logger.error(req.user.email, 'GET_DEATIL_BIN_FAILED', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_bin_location_failed'],
            content: error
        })
    }
}

exports.createBinLocation = async (req, res) => {
    try {
        let binLocation = await BinLocationServices.createBinLocation(req.body, req.portal);

        await Logger.info(req.user.email, 'CREATE_BIN_LOCATION_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_bin_location_success'],
            content: binLocation
        });
    }
    catch(error) {
        await Logger.error(req.user.email, 'CREATE_BIN_LOCATION_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_bin_location_failed'],
            content: error
        });
    }
}

exports.editBinLocation = async (req, res) => {
    try {
        let binLocation = await BinLocationServices.editBinLocation(req.params.id, req.body, req.portal);

        await Logger.info(req.user.email, 'EDIT_BIN_LOCATION_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_bin_location_success'],
            content: binLocation
        });
    }
    catch(error) {
        await Logger.error(req.user.email, 'EDIT_BIN_LOCATION_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_bin_location_failed'],
            content: error
        });
    }
}

exports.deleteBinLocation = async (req, res) => {
    try {
        let binLocation = await BinLocationServices.deleteBinLocation(req.params.id, req.portal);

        await Logger.info(req.user.email, 'DELETE_BIN_LOCATION_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_bin_location_success'],
            content: binLocation
        });
    }
    catch(error) {
        await Logger.error(req.user.email, 'DELETE_BIN_LOCATION_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_bin_location_failed'],
            content: error
        });
    }
}

exports.deleteManyBinLocations = async (req, res) => {
    try {
        let binLocations = await BinLocationServices.deleteManyBinLocations(req.body.array, req.portal);

        await Logger.info(req.user.email, 'DELETE_BIN_LOCATION_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_bin_location_success'],
            content: binLocations
        });
    }
    catch(error) {
        await Logger.error(req.user.email, 'DELETE_BIN_LOCATION_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_bin_location_failed'],
            content: error
        });
    }
}
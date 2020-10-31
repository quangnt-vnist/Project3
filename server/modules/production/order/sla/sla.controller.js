const SLAService = require('./sla.service');
const Log = require(`${SERVER_LOGS_DIR}`);

exports.createNewSLA = async (req, res) => {
    try {
        let data = req.body;
        let sla = await SLAService.createNewSLA(data, req.portal)

        await Log.info(req.user.email, "CREATED_NEW_SLA", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: sla
        });
    }  catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_SLA", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}

exports.editSLAByCode = async (req, res) => {
    try {
        let id = req.params.id;
        data = req.body;
        let sla = await SLAService.editSLAByCode(id, data, req.portal);

        await Log.info(req.user.email, "EDIT_SLA", req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_successfully"],
            content: sla
        });
    } catch (error) {
        await Log.error(req.user.email, "EDIT_SLA", req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_failed"],
            content: error.message
        });
    }
}

exports.getAllSLAs = async ( req, res ) => {
    try {
        let query = req.query;
        let allSLAs = await SLAService.getAllSLAs( query , req.portal)

        await Log.info(req.user.email, "GET_ALL_SLAS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: allSLAs
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_SLAS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        });
    }
}

exports.getSLAById = async ( req, res ) => {
    try {
        let id = req.params.id;
        let sla = await SLAService.getSLAById( id, req.portal)

        await Log.info(req.user.email, "GET_SLA_BY_ID", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_successfully"],
            content: sla
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_SLA_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_failed"],
            content: error.message
        });
    }
}

exports.disableSLAById = async ( req, res ) => {
    try {
        let id = req.params.id;
        let sla = await SLAService.disableSLAById( id, req.portal)
        
        await Log.info(req.user.email, "DISABLE_SLA_BY_ID", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_successfully"],
            content: sla
        });
    } catch (error) {
        await Log.error(req.user.email, "DISABLE_SLA_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_failed"],
            content: error.message
        });
    }
}

exports.checkAvailabledCode = async ( req, res ) => {
    console.log(req.query);
    let query = req.query;
    try {
        let checked = await SLAService.checkAvailabledCode( query, req.portal );

        await Log.info(req.user.email, "CHECK_AVAILABLED_TAX_CODE", req.portal);
        res.status(200).json({
            success: true,
            messages: ["check_successfully"],
            content: { checked }
        });
    } catch (error) {
        await Log.error(req.user.email, "CHECK_AVAILABLED_TAX_CODE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["check_failed"],
            content: error.message
        });
    } 
        
}


exports.getSLAByCode = async ( req, res ) => {
    let query = req.query;
    try {
        let slas = await SLAService.getSLAByCode( query, req.portal );

        await Log.info(req.user.email, "GET_SLA_BY_CODE", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_successfully"],
            content: slas
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_SLA_BY_CODE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_failed"],
            content: error.message
        });
    } 
        
}
const TaxService = require('./tax.service');
const Log = require(`${SERVER_LOGS_DIR}`);

exports.createNewTax = async (req, res) => {
    try {
        let data = req.body;
        let Tax = await TaxService.createNewTax(data, req.portal)

        await Log.info(req.user.email, "CREATED_NEW_TAX", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: Tax
        });
    }  catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_TAX", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}

exports.editTaxByCode = async (req, res) => {
    try {
        let id = req.params.id;
        data = req.body;
        let Tax = await TaxService.editTaxByCode(id, data, req.portal);

        await Log.info(req.user.email, "EDIT_TAX", req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_successfully"],
            content: Tax
        });
    } catch (error) {
        await Log.error(req.user.email, "EDIT_TAX", req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_failed"],
            content: error.message
        });
    }
}

exports.getAllTaxs = async ( req, res ) => {
    try {
        let query = req.query;
        let allTaxs = await TaxService.getAllTaxs( query , req.portal)

        await Log.info(req.user.email, "GET_ALL_TAXS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: allTaxs
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_TAXS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        });
    }
}

exports.getTaxById = async ( req, res ) => {
    try {
        let id = req.params.id;
        let Tax = await TaxService.getTaxById( id, req.portal)

        await Log.info(req.user.email, "GET_TAX_BY_ID", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_successfully"],
            content: Tax
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_TAX_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_failed"],
            content: error.message
        });
    }
}

exports.disableTaxById = async ( req, res ) => {
    try {
        let id = req.params.id;
        let Tax = await TaxService.disableTaxById( id, req.portal)
        
        await Log.info(req.user.email, "DISABLE_TAX_BY_ID", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_successfully"],
            content: Tax
        });
    } catch (error) {
        await Log.error(req.user.email, "DISABLE_TAX_BY_ID", req.portal);

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
        let checked = await TaxService.checkAvailabledCode( query, req.portal );

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


exports.getTaxByCode = async ( req, res ) => {
    let query = req.query;
    try {
        let taxs = await TaxService.getTaxByCode( query, req.portal );

        await Log.info(req.user.email, "GET_TAX_BY_CODE", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_successfully"],
            content: taxs
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_TAX_BY_CODE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_failed"],
            content: error.message
        });
    } 
        
}
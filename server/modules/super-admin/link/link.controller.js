const LinkService = require('./link.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

/**
 * Chú ý: tất cả các phương thức đều xét trong ngữ cảnh một công ty
 */

exports.getLinks = async (req, res) => {
    try {
        let portal = !req.query.portal ? req.portal : req.query.portal;
        let links = await LinkService.getLinks(portal, req.query);

        await Logger.info(req.user.email, 'get_links_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_links_success'],
            content: links
        });
    } catch (error) {
        
        await Logger.error(req.user.email, 'get_links_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_links_faile'],
            content: error
        });
    }
};

exports.getLink = async (req, res) => {
    try {
        let link = await LinkService.getLink(req.params.id);
        
        await Logger.info(req.user.email, 'show_link_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['show_link_success'],
            content: link
        });
    } catch (error) {
        
        await Logger.error(req.user.email, 'show_link_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_link_faile'],
            content: error
        });
    }
};

exports.createLink = async (req, res) => {
    try {
        let {company} = req.query;
        let createLink = await LinkService.createLink(req.body, company);
        await LinkService.relationshipLinkRole(createLink._id, req.body.roles);
        let link = await LinkService.getLink(createLink._id);

        await Logger.info(req.user.email, 'create_link_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_link_success'],
            content: link
        });
    } catch (error) {
        
        await Logger.error(req.user.email, 'create_link_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_link_faile'],
            content: error
        });
    }
};

exports.editLink = async (req, res) => {
    try {
        await LinkService.relationshipLinkRole(req.portal, req.params.id, req.body.roles);
        let link = await LinkService.editLink(req.portal, req.params.id, req.body);
        let data = await LinkService.getLink(req.portal, link._id);
        
        await Logger.info(req.user.email, 'edit_link_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_link_success'],
            content: data
        });
    } catch (error) {
        
        await Logger.error(req.user.email, 'edit_link_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_link_faile'],
            content: error
        });
    }
};

exports.deleteLink = async (req, res) => {
    try {
        let {id} = req.params;
        let {type} = req.query; 
        let link = await LinkService.deleteLink(id, type);
        
        await Logger.info(req.user.email, 'delete_link_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_link_success'],
            content: link
        });
    } catch (error) {
        
        await Logger.error(req.user.email, 'delete_link_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_link_faile'],
            content: error
        });
    }
};

exports.getLinkCategories = async (req, res) => {
    try {
        let content = await LinkService.getLinkCategories();

        await Logger.info(req.user.email, 'get_all_link_categories_success');
        res.status(200).json({
            success: true,
            messages: ['get_all_link_categories_success'],
            content
        });
    } catch (error) {
        await Logger.info(req.user.email, 'get_all_link_categories_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_all_link_categories_faile'],
            content: error
        });
    }
};

exports.updateCompanyLinks = async (req, res) => {
    try {
        let data = req.body; 
        let portal = req.query.portal !== undefined ? req.query.portal : req.portal;
        let content = await LinkService.updateCompanyLinks(portal, data);

        await Logger.info(req.user.email, 'update_company_links_success');
        res.status(200).json({
            success: true,
            messages: ['update_company_links_success'],
            content
        });
    } catch (error) {

        await Logger.info(req.user.email, 'update_company_links_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['update_company_links_faile'],
            content: error
        });
    }
};
const Logger = require(`${SERVER_LOGS_DIR}`);
const DashboardOrganizationalUnitService = require('./dashboard.service');

exports.getChildrenOfOrganizationalUnitsAsTree = async (req, res) => {
    try {
        let tree = await DashboardOrganizationalUnitService.getChildrenOfOrganizationalUnitsAsTree(req.portal, req.user.company._id, req.query.role);
        
        await Logger.info(req.user.email, 'GET_CHILDREN_DEPARTMENTS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_children_departments_success'],
            content: tree
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_CHILDREN_DEPARTMENTS', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_children_departments_faile'],
            content: error
        });
    }
    
};
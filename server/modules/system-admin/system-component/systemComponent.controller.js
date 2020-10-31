const SystemComponentServices = require('./systemComponent.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

exports.getAllSystemComponents = async (req, res) => {
    try {
        const components = await SystemComponentServices.getAllSystemComponents(req.query);
        
        Logger.info(req.user.email, 'GET_COMPONENT_DEFAULT');
        res.status(200).json({
            success: true,
            messages: ['get_components_default_success'],
            content: components
        });
    } catch (error) {

        Logger.error(req.user.email, 'get_components_default_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_components_default_faile'],
            content: error
        });
    }
};

exports.createSystemComponent = async (req, res) => {
    try {
        
        const { name, description, links, roles } = req.body;
        const component = await SystemComponentServices.createSystemComponent(name, description, links, roles);
        const data = await SystemComponentServices.getSystemComponent(component._id);

        Logger.info(req.user.email, 'create_system_component_success');
        res.status(200).json({
            success: true,
            messages: ['create_system_component_success'],
            content: data
        });
    } catch (error) {
        console.log(error)
        Logger.error(req.user.email, 'create_system_component_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_system_component_faile'],
            content: error
        });
    }
};

exports.getSystemComponent = async (req, res) => {
    try {
        const component = await SystemComponentServices.getSystemComponent(req.params.systemComponentId);
        
        Logger.info(req.user.email, 'GET_COMPONENT_DEFAULT');
        res.status(200).json({
            success: true,
            messages: ['get_system_component_success'],
            content: component
        });
    } catch (error) {

        Logger.error(req.user.email, 'get_system_component_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_system_component_faile'],
            content: error
        });
    }
};

exports.editSystemComponent = async (req, res) => {
    try {
        const { name, description, links, roles } = req.body;
        const component = await SystemComponentServices.editSystemComponent(req.params.systemComponentId, name, description, links, roles);
        const resComponent = await SystemComponentServices.getSystemComponent(component._id);
        
        Logger.info(req.user.email, 'edit_system_component_success');
        res.status(200).json({
            success: true,
            messages: ['edit_system_component_success'],
            content: resComponent
        });
    } catch (error) {

        Logger.error(req.user.email, 'edit_system_component_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_system_component_faile'],
            content: error
        });
    }
};

exports.deleteSystemComponent = async (req, res) => {
    try {
        const component = await SystemComponentServices.deleteSystemComponent(req.params.systemComponentId);
        
        Logger.info(req.user.email, 'delete_system_component_success');
        res.status(200).json({
            success: true,
            messages: ['delete_system_component_success'],
            content: component
        });
    } catch (error) {
        
        Logger.error(req.user.email, 'delete_system_component_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_system_component_faile'],
            content: error
        });
    }
};


const CategoryService = require('./category.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

exports.getCategories = async (req, res) => {
    try {
        const categories = await CategoryService.getCategories(req.query, req.portal);
        await Logger.info(req.user.email, 'GET_CATEGORIES', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_category_success'],
            content: categories
        });
    }
    catch(error) {
        await Logger.error(req.user.email, 'GET_CATEGORIES', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_category_faile'],
            content: error
        });
    }
}

exports.getCategoryToTree = async (req, res) => {
    try {
        const categories = await CategoryService.getCategoryToTree(req.portal);

        await Logger.info(req.user.email, 'GET_CATEGORIES', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_category_success'],
            content: categories
        })
    }
    catch(error) {
        await Logger.error(req.user.email, 'GET_CATEGORIES', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_category_failed'],
            content: error
        });
    }
}

exports.getCategoriesByType = async (req, res) => {
    try {
        const categories = await CategoryService.getCategoriesByType(req.query, req.portal);
        await Logger.info(req.user.email, 'GET_CATEGORIES', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_category_success'],
            content: categories
        });
    }
    catch(error) {
        await Logger.error(req.user.email, 'GET_CATEGORIES', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_category_faile'],
            content: error
        });
    }
}
exports.createCategory = async (req, res) => {
    try{
        let category = await CategoryService.createCategory(req.body, req.portal);

        await Logger.info(req.user.email, 'CREATE_CATEGORY', req.portal);
        res.status(200).json({
            success: true,
            messages: ['add_success'],
            content: category
        });
    } catch(error) {
        await Logger.error(req.user.email, 'CREATE_CATEGORY', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['add_faile'],
            content: error
        });
    }
}
exports.getCategory = async (req, res) => {
    try {
        let category = await CategoryService.getCategory(req.params.id, req.portal);

        await Logger.info(req.user.email, 'GET_CATEGORY', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_category_success'],
            content: category
        });
    } catch(error) {
        await Logger.error(req.user.email, 'GET_CATEGORY', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_category_faile'],
            content: error
        })
    }
}
exports.editCategory = async (req, res) => {
    try {
        let category = await CategoryService.editCategory(req.params.id, req.body, req.portal);
        await Logger.info(req.user.email, 'EDIT_CATEGORY', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_success'],
            content: category
        });
    } catch(error) {
        await Logger.error(req.user.email, 'EDIT_CATEGORY', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_faile'],
            content: error
        });
    }
}
exports.deleteCategory = async (req, res) => {
    try {
        const category = await CategoryService.deleteCategory(req.params.id, req.portal);

        await Logger.info(req.user.email, 'DELETE_CATEGORY', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_success'],
            content: category
        });
    } catch(error) {
        console.log(error);
        await Logger.error(req.user.email, 'DELETE_CATEGORY', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_faile'],
            content: error
        })
    }
}

exports.deleteManyCategories = async (req, res) => {
    try {
        const categories = await CategoryService.deleteManyCategories(req.body.array, req.portal);

        await Logger.info(req.user.email, 'DELETE_MANY_CATEGORIES', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_success'],
            content: categories
        });
    }
    catch(error) {
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_faile'],
            content: error
        })
    }
}

const GoodService = require('./good.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

exports.getGoodsByType = async (req, res) => {
    try {
        const goodsByType = await GoodService.getGoodsByType(req.user.company._id, req.query, req.portal);
        await Logger.info(req.user.email, 'GET_GOOS_BY_TYPE_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_good_success'],
            content: goodsByType
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_GOODS_BY_TYPE_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_good_failed'],
            content: error
        });
    }
}

exports.getAllGoodsByType = async (req, res) => {
    try {
        const goodsByType = await GoodService.getAllGoodsByType(req.query, req.portal);
        await Logger.info(req.user.email, 'GET_GOOS_BY_TYPE_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_good_success'],
            content: goodsByType
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_GOODS_BY_TYPE_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_good_failed'],
            content: error
        });
    }
}

exports.getAllGoodsByCategory = async (req, res) => {
    try {
        const goodsByCategory = await GoodService.getAllGoodsByCategory(req.user.company._id, req.params.id, req.portal);
        await Logger.info(req.user.email, 'GET_GOOS_BY_TYPE_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_good_success'],
            content: goodsByCategory
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_GOODS_BY_TYPE_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_good_failed'],
            content: error
        });
    }
}

exports.createGoodByType = async (req, res) => {
    try {
        let good = await GoodService.createGoodByType(req.user.company._id, req.body, req.portal);

        await Logger.info(req.user.email, 'CREATE_GOOD', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_good_success'],
            content: good
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'CREATE_GOOD', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_good_failed'],
            content: error
        })
    }
}

exports.editGood = async (req, res) => {
    try {
        let good = await GoodService.editGood(req.params.id, req.body, req.portal);
        await Logger.info(req.user.email, 'EDIT_GOOD', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_good_success'],
            content: good
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'EDIT_GOOD', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_good_failed'],
            content: error
        })
    }
}

exports.deleteGood = async (req, res) => {
    try {
        const good = await GoodService.deleteGood(req.params.id, req.portal);

        await Logger.info(req.user.email, 'DELETE_GOOD', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_good_success'],
            content: good
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'DELETE_GOOD', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_good_failed'],
            content: error
        })
    }
}

exports.getGoodDetail = async (req, res) => {
    try {
        const good = await GoodService.getGoodDetail(req.params.id, req.portal);

        await Logger.info(req.user.email, 'GET_GOOD_DETAIL', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_good_success'],
            content: good
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'GET_GOOD_DETAIL', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_good_failed'],
            content: error
        })
    }
}

exports.getAllGoods = async (req, res) => {
    try {
        const good = await GoodService.getAllGoods(req.user.company._id, req.portal);

        await Logger.info(req.user.email, 'GET_ALL_GOOD_', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_good_success'],
            content: good
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'GET_ALL_GOOD', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_good_failed'],
            content: error
        })
    }
}
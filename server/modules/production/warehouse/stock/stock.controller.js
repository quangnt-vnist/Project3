const StockService = require('./stock.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

exports.getAllStocks = async (req, res) => {
    try {
        const stocks = await StockService.getAllStocks(req.user.company._id, req.query, req.portal);

        await Logger.info(req.user.email, 'GET_STOCKS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_stock_success'],
            content: stocks
        })
    }
    catch(error){
        await Logger.error(req.user.email, 'GET_STOCKS', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_stock_failed'],
            content: error
        })
    }
}

exports.getStock = async (req, res) => {
    try {
        const stock = await StockService.getStock(req.params.id, req.portal);

        await Logger.info(req.user.email, 'GET_STOCK', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_stock_success'],
            content: stock
        })
    } catch(error){
        await Logger.error(req.user.email, 'GET_STOCK', req.portal);
        res.status(400).json({
            success: false,
            messages:['get_stock_failed'],
            content: error
        })
    }
}

exports.createStock = async (req, res) => {
    try {
        const stock = await StockService.createStock(req.user.company._id, req.body, req.portal);

        await Logger.info(req.user.email, 'CREATE_STOCK', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_stock_success'],
            content: stock
        })
    }
    catch(error){
        await Logger.error(req.user.email, 'CREATE_STOCK', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_stock_failed'],
            content: error
        })
    }
}

exports.editStock = async (req, res) => {
    try {
        const stock = await StockService.editStock(req.params.id, req.body, req.portal);

        await Logger.info(req.user.email, 'EDIT_STOCK', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_stock_success'],
            content: stock
        })
    } 
    catch(error){
        await Logger.error(req.user.email, 'EDIT_STOCK', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_stock_failed'],
            content: error
        })
    }
}

exports.deleteStock = async (req, res) => {
    try {
        const stock = await StockService.deleteStock(req.params.id, req.portal);

        await Logger.info(req.user.email, 'DELETE_STOCK', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_stock_success'],
            content: stock
        })
    }
    catch(error){
        await Logger.error(req.user.email, 'DELETE_STOCK', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_stock_failed'],
            content: error
        })
    }
}
const QuoteService = require('./quote.service');
const Log = require(`${SERVER_LOGS_DIR}`);

exports.createNewQuote = async (req, res) => {
    try {
        let data = req.body;
        // console.log("DATA:", data);
        let quote = await QuoteService.createNewQuote(data, req.portal)

        await Log.info(req.user.email, "CREATED_NEW_QUOTE", req.portal);


        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: quote
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_QUOTE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}

exports.getAllQuotes = async (req, res) => {
    try {
        console.log("query:",req.query)
        let query = req.query;
        let allQuotes = await QuoteService.getAllQuotes(query, req.portal);

        await Log.info(req.user.email, "GET_ALL_QUOTES", req.portal);

        res.status(200).json({
            success: true,
            message: ["get_successfully"],
            content: allQuotes
        })
        
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_QUOTES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_failed"],
            content: error.message
        });
    }
}
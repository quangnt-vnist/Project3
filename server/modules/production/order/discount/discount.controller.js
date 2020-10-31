const DiscountService = require('./discount.service');
const Log = require(`${SERVER_LOGS_DIR}`);

exports.createNewDiscount = async (req, res) => {
    try {
        let data = req.body;
        let discount = await DiscountService.createNewDiscount(data, req.portal)

        await Log.info(req.user.email, "CREATED_NEW_DISCOUNT", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: discount
        });
    }  catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_DISCOUNT", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}
const CoinRuleService = require('./coinRule.service');
const Log = require(`${SERVER_LOGS_DIR}`);

exports.createNewCoinRule = async (req, res) => {
    try {
        let data = req.body;
        console.log(data);
        let coinRule = await CoinRuleService.createNewCoinRule(data, req.portal)

        await Log.info(req.user.email, "CREATED_NEW_COIN_RULE", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: coinRule
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_COIN_RULE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}
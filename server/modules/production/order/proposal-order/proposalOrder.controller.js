const ProposalOrderService = require('./proposalOrder.service');
const Log = require(`${SERVER_LOGS_DIR}`);

exports.create = async (req, res) => {
    try {

    }  catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_COIN_RULE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}
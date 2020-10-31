const express = require('express');
const router = express.Router();
const CoinRuleController = require('./coinRule.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

router.post('/', auth, CoinRuleController.createNewCoinRule)

module.exports = router;
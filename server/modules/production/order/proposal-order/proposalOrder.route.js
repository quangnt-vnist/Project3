const express = require('express');
const router = express.Router();
const ProposalOrderController = require('./proposalOrder.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

module.exports = router;
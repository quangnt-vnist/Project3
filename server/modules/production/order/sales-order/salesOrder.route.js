const express = require('express');
const router = express.Router();
const salesOrderController = require('./salesOrder.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

module.exports = router;
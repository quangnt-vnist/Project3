const express = require('express');
const router = express.Router();
const purchaseOrderController = require('./purchaseOrder.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

module.exports = router;
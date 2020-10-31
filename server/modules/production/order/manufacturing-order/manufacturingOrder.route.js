const express = require('express');
const router = express.Router();
const manufacturingOrderController = require('./manufacturingOrder.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


module.exports = router;
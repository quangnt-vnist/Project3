const express = require('express');
const router = express.Router();
const DiscountController = require('./discount.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

router.post('/', auth, DiscountController.createNewDiscount);

module.exports = router;
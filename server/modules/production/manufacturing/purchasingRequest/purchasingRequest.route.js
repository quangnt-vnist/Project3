const express = require('express');
const router = express.Router();
const PurchasingRequestController = require('./purchasingRequest.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

router.post('/', auth, PurchasingRequestController.createPurchasingRequest);
router.get('/', auth, PurchasingRequestController.getAllPurchasingRequest);

module.exports = router;
const express = require('express');
const router = express.Router();
const TaxController = require('./tax.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

router.post('/', auth, TaxController.createNewTax);
router.patch('/:id', auth, TaxController.editTaxByCode);
router.get('/', auth, TaxController.getAllTaxs);
router.get('/check-code', auth, TaxController.checkAvailabledCode);
router.get('/get-by-code', auth, TaxController.getTaxByCode);
router.get('/:id', auth, TaxController.getTaxById);
router.patch('/disable/:id', auth, TaxController.disableTaxById);

module.exports = router;
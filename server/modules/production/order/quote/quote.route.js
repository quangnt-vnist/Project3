const express = require('express');
const router = express.Router();
const QuoteController = require('./quote.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

router.post('/', auth, QuoteController.createNewQuote);
router.get('/', auth, QuoteController.getAllQuotes);

module.exports = router;
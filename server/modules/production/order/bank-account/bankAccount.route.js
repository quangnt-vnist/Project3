const express = require('express');
const router = express.Router();
const bankAccountController = require('./bankAccount.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


module.exports = router;
const express = require("express");
const router = express.Router();
const ModuleConfigurationController = require('./moduleConfiguration.controller');

const {
    auth
} = require(`${SERVER_MIDDLEWARE_DIR}`);

router.get("/configurations", auth, ModuleConfigurationController.getConfiguration);

router.patch("/configurations", auth, ModuleConfigurationController.editConfiguration);


module.exports = router;
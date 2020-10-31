const express = require("express");
const router = express.Router();
const SystemSettingController = require('./systemSetting.controller');
const {auth} = require(`${SERVER_MIDDLEWARE_DIR}`);

router.get("/backup", auth, SystemSettingController.getBackups);

router.get("/backup/config", auth, SystemSettingController.getConfigBackup);

router.post("/backup", auth, SystemSettingController.createBackup);

router.patch("/backup/config", auth, SystemSettingController.configBackup);

router.delete("/backup/:version", auth, SystemSettingController.deleteBackup);

router.patch("/restore/:version", auth, SystemSettingController.restore);

module.exports = router;

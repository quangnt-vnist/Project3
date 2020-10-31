const express = require("express");
const router = express.Router();
const SystemComponentControllers = require('./systemComponent.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

router.get("/system-components", auth, SystemComponentControllers.getAllSystemComponents);
router.post("/system-components", auth, SystemComponentControllers.createSystemComponent);
router.get("/system-components/:systemComponentId", auth, SystemComponentControllers.getSystemComponent);
router.patch("/system-components/:systemComponentId", auth, SystemComponentControllers.editSystemComponent);
router.delete("/system-components/:systemComponentId", auth, SystemComponentControllers.deleteSystemComponent);

module.exports = router;

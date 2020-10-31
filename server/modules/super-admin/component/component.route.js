const express = require("express");
const router = express.Router();
const ComponentController = require('./component.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


router.get("/components", auth, ComponentController.getComponents);


router.post("/components", auth, ComponentController.createComponent);
router.get("/components/:id", auth, ComponentController.getComponent);
router.patch("/components/:id", auth, ComponentController.editComponent);
router.delete("/components/:id", auth, ComponentController.deleteComponent);

router.patch("/components/company/update", auth, ComponentController.updateCompanyComponents);

module.exports = router;

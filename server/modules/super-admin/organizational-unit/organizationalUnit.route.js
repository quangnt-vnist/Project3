const express = require("express");
const router = express.Router();
const OrganizationalUnitController = require('./organizationalUnit.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


router.get("/organizational-units", auth, OrganizationalUnitController.getOrganizationalUnits);

router.post("/organizational-units", auth, OrganizationalUnitController.createOrganizationalUnit);
router.get("/organizational-units/:id", auth, OrganizationalUnitController.getOrganizationalUnit);
router.patch("/organizational-units/:id", auth, OrganizationalUnitController.editOrganizationalUnit);
router.delete("/organizational-units/:id", auth, OrganizationalUnitController.deleteOrganizationalUnit);

router.post("/organizational-units/import", auth, OrganizationalUnitController.importOrganizationalUnits);


module.exports = router;

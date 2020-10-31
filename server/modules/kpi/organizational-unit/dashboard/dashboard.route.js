const express = require("express");
const router = express.Router();
const DashboardOrganizationalUnitController = require("./dashboard.controller");
const {auth} = require(`${SERVER_MIDDLEWARE_DIR}`);

// Lấy các đơn vị con của một đơn vị và đơn vị đó
router.get('/organizational-units/get-children-of-organizational-unit-as-tree', auth, DashboardOrganizationalUnitController.getChildrenOfOrganizationalUnitsAsTree);

module.exports = router;
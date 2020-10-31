const express = require("express");
const router = express.Router();
const KPIPersonalController = require("./management.controller");
const {auth} = require(`${SERVER_MIDDLEWARE_DIR}`);

router.post('/employee-kpi-sets/:id/copy', auth, KPIPersonalController.copyKPI);

module.exports = router;
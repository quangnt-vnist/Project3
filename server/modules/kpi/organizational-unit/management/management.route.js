const express = require("express");
const router = express.Router();
const managerController = require("./management.controller");
const {auth} = require(`${SERVER_MIDDLEWARE_DIR}`);

// Copy mục tiêu của KPI tháng được chọn sang tháng mới
router.post('/organizational-unit-kpi-sets/:id/copy', auth, managerController.copyKPI);
router.post('/organizational-unit-kpi-sets/calculate', auth, managerController.calculateKpiUnit);

module.exports = router;
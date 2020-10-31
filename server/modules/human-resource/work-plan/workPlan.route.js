const express = require("express");
const router = express.Router();

const WorkPlanController = require("./workPlan.controller");
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


router.get('/workPlans', auth, WorkPlanController.getAllWorkPlans);

router.post('/workPlans', auth, WorkPlanController.createWorkPlan);

router.put('/workPlans/:id', auth, WorkPlanController.updateWorkPlan);
router.delete('/workPlans/:id', auth, WorkPlanController.deleteWorkPlan);

// Import thông tin lịch làm việc
router.post('/workPlans/import', auth, WorkPlanController.importWorkPlans);

module.exports = router;
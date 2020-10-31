const express = require("express");
const router = express.Router();

const AnnualLeaveController = require("./annualLeave.controller");
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


router.get('/annualLeaves', auth, AnnualLeaveController.searchAnnualLeaves);


router.post('/annualLeaves', auth, AnnualLeaveController.createAnnualLeave);

router.patch('/annualLeaves/:id', auth, AnnualLeaveController.updateAnnualLeave);
router.delete('/annualLeaves/:id', auth, AnnualLeaveController.deleteAnnualLeave);

module.exports = router;
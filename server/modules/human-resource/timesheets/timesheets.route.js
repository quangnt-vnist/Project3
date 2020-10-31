const express = require("express");
const router = express.Router();

const TimsheetsController = require("./timesheets.controller");
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


router.get('/timesheets', auth, TimsheetsController.searchTimesheets);


router.post('/timesheets', auth, TimsheetsController.createTimesheets);

router.patch('/timesheets/:id', auth, TimsheetsController.updateTimesheets);
router.delete('/timesheets/:id', auth, TimsheetsController.deleteTimesheets);

// Import chấm công
router.post('/timesheets/import', auth, TimsheetsController.importTimesheets);

module.exports = router;
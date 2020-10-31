const express = require('express');
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);
const ManufacturingMillController = require('./manufacturingMill.controller');

router.post('/', auth, ManufacturingMillController.createManufacturingMill);
router.get('/', auth, ManufacturingMillController.getAllManufacturingMills);
router.get('/:id', auth, ManufacturingMillController.getManufacturingMillById);
router.patch('/:id', auth, ManufacturingMillController.editManufacturingMill);
router.delete('/:id', auth, ManufacturingMillController.deleteManufacturingMill);
router.post('/add-work-schedule/:id', auth, ManufacturingMillController.createWorkSchedule);
router.post('/add-manufacturing-command-to-schedule/:id', auth, ManufacturingMillController.addCommandToSchedule);

module.exports = router;
const express = require("express");
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

const CareTypeController = require('./careType.controller');

router.get('/', auth, CareTypeController.getCareTypes);
router.get('/:id', auth, CareTypeController.getCareTypeById);
router.post('/', auth, CareTypeController.createCareType);
router.patch('/:id', auth, CareTypeController.editCareType);
router.delete('/:id', auth, CareTypeController.deleteCareType);

module.exports = router;

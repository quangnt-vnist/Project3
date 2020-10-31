const express = require("express");
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

const StatusController = require('./status.controller');

router.get('/', auth, StatusController.getStatus);
router.get('/:id', auth, StatusController.getStatusById);
router.post('/', auth, StatusController.createStatus);
router.patch('/:id', auth, StatusController.editStatus);
router.delete('/:id', auth, StatusController.deleteStatus);

module.exports = router;
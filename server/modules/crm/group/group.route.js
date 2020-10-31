const express = require("express");
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

const GroupController = require('./group.controller');

router.get('/', auth, GroupController.getGroups);
router.get('/:id', auth, GroupController.getGroupById);
router.post('/', auth, GroupController.createGroup);
router.patch('/:id', auth, GroupController.editGroup);
router.delete('/:id', auth, GroupController.deleteGroup);

module.exports = router;
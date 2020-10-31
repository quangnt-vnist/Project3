const express = require("express");
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

const TaskTemplateController = require("./taskTemplate.controller");

router.get('/', auth, TaskTemplateController.getAllTaskTemplates);
router.get('/:id', auth, TaskTemplateController.getTaskTemplate);
router.post('/', auth, TaskTemplateController.createTaskTemplate);
router.delete('/:id', auth, TaskTemplateController.deleteTaskTemplate);
router.patch('/:id', auth, TaskTemplateController.editTaskTemplate);
router.post('/import', auth, TaskTemplateController.importTaskTemplate);



module.exports = router;

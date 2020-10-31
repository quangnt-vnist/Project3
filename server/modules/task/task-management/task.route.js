const express = require("express");
const router = express.Router();
const TaskManagementController = require("./task.controller");
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

router.get('/tasks', auth, TaskManagementController.getTasks);
router.get('/tasks/:taskId/sub-tasks', auth, TaskManagementController.getSubTask);

router.get('/task-evaluations', auth, TaskManagementController.getTaskEvaluations);

router.post('/tasks', auth, TaskManagementController.createTask);

router.delete('/tasks/:taskId', auth, TaskManagementController.deleteTask);

module.exports = router;
const express = require("express");
const router = express.Router();
const { auth, uploadFile } = require(`${SERVER_MIDDLEWARE_DIR}`);

const TaskProcessController = require("./taskProcess.controller");


router.get("/", auth, TaskProcessController.get);
router.get("/diagrams/:diagramId", auth, TaskProcessController.getXmlDiagramById);

router.post("/diagrams", auth, TaskProcessController.createXmlDiagram);
router.post("/diagrams/import", auth, TaskProcessController.importProcessTemplate);

router.patch("/diagrams/:diagramId", auth, TaskProcessController.editXmlDiagram)
router.patch('/processes/:processId/diagram', auth, TaskProcessController.updateDiagram);
router.patch('/processes/:processId', auth, TaskProcessController.editProcessInfo);

router.delete("/diagrams/:diagramId", auth, TaskProcessController.deleteXmlDiagram);

router.post("/processes/:processId/tasks/create", auth, TaskProcessController.createTaskByProcess);




module.exports = router;
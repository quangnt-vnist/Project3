const express = require("express");
const router = express.Router();

const EducationProgramController = require("./educationProgram.controller");
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


router.get('/educationPrograms', auth, EducationProgramController.searchEducationPrograms);

router.post('/educationPrograms', auth, EducationProgramController.createEducationProgram);

router.patch('/educationPrograms/:id', auth, EducationProgramController.updateEducationProgram);
router.delete('/educationPrograms/:id', auth, EducationProgramController.deleteEducationProgram);



module.exports = router;
const express = require("express");
const router = express.Router();

const CourseController = require("./course.controller");
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


/** Lấy danh sách khoá đào tạo */
router.get('/courses', auth, CourseController.searchCourses);


router.post('/courses', auth, CourseController.createCourse);

router.patch('/courses/:id', auth, CourseController.updateCourse);
router.delete('/courses/:id', auth, CourseController.deleteCourse);

module.exports = router;
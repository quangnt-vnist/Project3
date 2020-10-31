const CourseService = require('./course.service');
const Log = require(`${SERVER_LOGS_DIR}`);

/**
 * Lấy danh sách khoá đào tạo
 */
exports.searchCourses = async (req, res) => {
    try {
        let data = {};
        if (req.query.page === undefined && req.query.limit === undefined) {
            data = await CourseService.getAllCourses(req.portal, req.user.company._id, req.query.organizationalUnits, req.query.positions)
        } else {
            let params = {
                courseId: req.query.courseId,
                educationProgram: req.query.educationProgram,
                type: req.query.type,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            }
            data = await CourseService.searchCourses(req.portal, params, req.user.company._id);
        }
        await Log.info(req.user.email, 'GET_LIST_COURSE', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_list_course_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_LIST_COURSE', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_list_course_faile"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Thêm mới kháo đào tạo
 */
exports.createCourse = async (req, res) => {
    try {
        // Kiểm tra dữ liệu truyền vào
        if (req.body.courseId.trim() === "") {
            await Log.error(req.user.email, 'CREATE_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["course_id_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.name.trim() === "") {
            await Log.error(req.user.email, 'CREATE_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["name_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.startDate.trim() === "") {
            await Log.error(req.user.email, 'CREATE_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["start_date_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.endDate.trim() === "") {
            await Log.error(req.user.email, 'CREATE_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["end_date_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.coursePlace.trim() === "") {
            await Log.error(req.user.email, 'CREATE_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["course_place_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.offeredBy.trim() === "") {
            await Log.error(req.user.email, 'CREATE_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["offered_by_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.type.trim() === "") {
            await Log.error(req.user.email, 'CREATE_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["type_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.educationProgram.length === 0) {
            await Log.error(req.user.email, 'CREATE_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["education_program_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.cost.trim() === "") {
            await Log.error(req.user.email, 'CREATE_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["cost_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.employeeCommitmentTime.trim() === "") {
            await Log.error(req.user.email, 'CREATE_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["employee_commitment_time_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            // Kiểm tra sự trùng lặp mã khoá học
            let data = await CourseService.createCourse(req.portal, req.body, req.user.company._id);
            if (data === 'have_exist') {
                await Log.error(req.user.email, 'CREATE_COURSE', req.portal);
                res.status(400).json({
                    success: false,
                    messages: ["course_id_have_exist"],
                    content: {
                        inputData: req.body
                    }
                });
            }
            await Log.info(req.user.email, 'CREATE_COURSE', req.portal);
            res.status(200).json({
                success: true,
                messages: ["create_course_success"],
                content: data
            });
        }

    } catch (error) {
        await Log.error(req.user.email, 'CREATE_COURSE', req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_course_faile"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Xoá kháo đào tạo
 */
exports.deleteCourse = async (req, res) => {
    try {
        let data = await CourseService.deleteCourse(req.portal, req.params.id);
        await Log.info(req.user.email, 'DELETE_COURSE', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_course_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'DELETE_COURSE', req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_course_faile"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Cập nhật thông tin khoá học
 */
exports.updateCourse = async (req, res) => {
    try {
        // Kiểm tra dữ liệu truyền vào
        if (req.body.name.trim() === "") {
            await Log.error(req.user.email, 'EDIT_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["name_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.startDate.trim() === "") {
            await Log.error(req.user.email, 'EDIT_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["start_date_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.endDate.trim() === "") {
            await Log.error(req.user.email, 'EDIT_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["end_date_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.coursePlace.trim() === "") {
            await Log.error(req.user.email, 'EDIT_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["course_place_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.offeredBy.trim() === "") {
            await Log.error(req.user.email, 'EDIT_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["offered_by_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.type.trim() === "") {
            await Log.error(req.user.email, 'EDIT_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["type_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.educationProgram.length === 0) {
            await Log.error(req.user.email, 'EDIT_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["education_program_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.cost.trim() === "") {
            await Log.error(req.user.email, 'EDIT_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["cost_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.employeeCommitmentTime.trim() === "") {
            await Log.error(req.user.email, 'EDIT_COURSE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["employee_commitment_time_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            // Cập nhật thông tin khoá học
            let data = await CourseService.updateCourse(req.portal, req.params.id, req.body);
            await Log.info(req.user.email, 'EDIT_COURSE', req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_course_success"],
                content: data
            });
        }
    } catch (error) {
        await Log.error(req.user.email, 'EDIT_COURSE', req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_course_faile"],
            content: {
                error: req.body
            }
        });
    }
}
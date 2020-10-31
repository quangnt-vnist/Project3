const EducationProgramService = require('./educationProgram.service');
const Log = require(`${SERVER_LOGS_DIR}`);

/**
 * Lấy danh sách chương trình đào tạo
 */
exports.searchEducationPrograms = async (req, res) => {
    try {
        let data;
        if (req.query.limit !== undefined && req.query.page !== undefined) {
            let params = {
                organizationalUnit: req.query.organizationalUnit,
                position: req.query.position,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            }
            data = await EducationProgramService.searchEducationPrograms(req.portal, params, req.user.company._id);
        } else {
            data = await EducationProgramService.getAllEducationPrograms(req.portal, req.user.company._id);
        }
        await Log.info(req.user.email, 'GET_EDUCATION_PROGRAM', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_education_program_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_EDUCATION_PROGRAM', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_education_program_faile"],
            content: {
                error: error
            }
        });
    }
}
/**
 * Thêm mới chương trình đào tạo
 */
exports.createEducationProgram = async (req, res) => {
    try {
        // Kiểm tra dữ liệ truyền vào
        if (req.body.applyForOrganizationalUnits === null) {
            await Log.error(req.user.email, 'CREATE_EDUCATIONPROGRAM', req.portal);
            res.status(400).json({
                success: false,
                messages: ["apply_for_organizational_units_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.position === null) {
            await Log.error(req.user.email, 'CREATE_EDUCATIONPROGRAM', req.portal);
            res.status(400).json({
                success: false,
                messages: ["apply_for_positions_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.programId.trim() === "") {
            await Log.error(req.user.email, 'CREATE_EDUCATIONPROGRAM', req.portal);
            res.status(400).json({
                success: false,
                messages: ["program_id_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.name.trim() === "") {
            await Log.error(req.user.email, 'CREATE_EDUCATIONPROGRAM', req.portal);
            res.status(400).json({
                success: false,
                messages: ["name_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            let education = await EducationProgramService.createEducationProgram(req.portal, req.body, req.user.company._id);
            // Kiểm tra trùng lặp mã chương trình đào tạo
            if (education === 'have_exist') {
                await Log.error(req.user.email, 'CREATE_EDUCATIONPROGRAM', req.portal);
                res.status(400).json({
                    success: false,
                    messages: ["program_id_have_exist"],
                    content: {
                        inputData: req.body
                    }
                });
            } else {
                await Log.info(req.user.email, 'CREATE_EDUCATIONPROGRAM', req.portal);
                res.status(200).json({
                    success: true,
                    messages: ["create_education_program_success"],
                    content: education
                });
            }
        }

    } catch (error) {
        await Log.error(req.user.email, 'CREATE_EDUCATIONPROGRAM', req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_education_program_faile"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Xoá chương trình đào tạo
 */
exports.deleteEducationProgram = async (req, res) => {
    try {
        let deleteEducation = await EducationProgramService.deleteEducationProgram(req.portal, req.params.id);
        await Log.info(req.user.email, 'DELETE_EDUCATIONPROGRAM', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_education_program_success"],
            content: deleteEducation
        });
    } catch (error) {
        await Log.error(req.user.email, 'DELETE_EDUCATIONPROGRAM', req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_education_program_faile"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Cập nhật chương trình đào tạo
 */
exports.updateEducationProgram = async (req, res) => {
    try {
        // Kiểm tra dữ liệ truyền vào
        if (req.body.applyForOrganizationalUnits === null) {
            await Log.error(req.user.email, 'EDIT_EDUCATIONPROGRAM', req.portal);
            res.status(400).json({
                success: false,
                messages: ["apply_for_organizational_units_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.position === null) {
            await Log.error(req.user.email, 'EDIT_EDUCATIONPROGRAM', req.portal);
            res.status(400).json({
                success: false,
                messages: ["apply_for_positions_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.name.trim() === "") {
            await Log.error(req.user.email, 'EDIT_EDUCATIONPROGRAM', req.portal);
            res.status(400).json({
                success: false,
                messages: ["name_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            // Cập nhật thông tin chương trình đào tạo
            let education = await EducationProgramService.updateEducationProgram(req.portal, req.params.id, req.body);
            await Log.info(req.user.email, 'EDIT_EDUCATIONPROGRAM', req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_education_program_success"],
                content: education
            });
        }
    } catch (error) {
        await Log.error(req.user.email, 'EDIT_EDUCATIONPROGRAM', req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_education_program_faile"],
            content: {
                error: error
            }
        });
    }
}
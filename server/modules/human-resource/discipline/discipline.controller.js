const DisciplineService = require('./discipline.service');
const Log = require(`${SERVER_LOGS_DIR}`);

/** Lấy danh sách kỷ luật */
exports.searchDisciplines = async (req, res) => {
    try {
        let data = {};
        if (req.query.page === undefined && req.query.limit === undefined) {
            data = await DisciplineService.getTotalDiscipline(req.portal, req.user.company._id, req.query.organizationalUnits, req.query.month)
        } else {
            let params = {
                organizationalUnits: req.query.organizationalUnits,
                type: req.query.type,
                employeeNumber: req.query.employeeNumber,
                decisionNumber: req.query.decisionNumber,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            }
            data = await DisciplineService.searchDisciplines(req.portal, params, req.user.company._id);
        }

        await Log.info(req.user.email, 'GET_DISCIPLINE', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_discipline_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_DISCIPLINE', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_discipline_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Tạo mới kỷ luật của nhân viên */
exports.createDiscipline = async (req, res) => {
    try {
        // Kiểm tra dữ liệu truyền vào
        if (req.body.decisionNumber.trim() === "") {
            await Log.error(req.user.email, 'CREATE_DISCIPLINE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["number_decisions_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.organizationalUnit.trim() === "") {
            await Log.error(req.user.email, 'CREATE_DISCIPLINE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["unit_decisions_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.startDate.trim() === "") {
            await Log.error(req.user.email, 'CREATE_DISCIPLINE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["start_date_discipline_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.type.trim() === "") {
            await Log.error(req.user.email, 'CREATE_DISCIPLINE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["type_discipline_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.reason.trim() === "") {
            await Log.error(req.user.email, 'CREATE_DISCIPLINE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["reason_discipline_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            let createDiscipline = await DisciplineService.createDiscipline(req.portal, req.body, req.user.company._id, req.user.company._id);
            if (createDiscipline === "have_exist") { // Kiểm tra trùng lặp
                await Log.error(req.user.email, 'CREATE_DISCIPLINE', req.portal);
                res.status(400).json({
                    success: false,
                    messages: ["number_decisions_have_exist"],
                    content: {
                        inputData: req.body
                    }
                });
            } else {
                await Log.info(req.user.email, 'CREATE_DISCIPLINE', req.portal);
                res.status(200).json({
                    success: true,
                    messages: ["create_discipline_success"],
                    content: createDiscipline
                });
            }
        }
    } catch (error) {
        await Log.error(req.user.email, 'CREATE_DISCIPLINE', req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_discipline_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Xoá thông tin kỷ luật */
exports.deleteDiscipline = async (req, res) => {
    try {
        let disciplineDelete = await DisciplineService.deleteDiscipline(req.portal, req.params.id);
        await Log.info(req.user.email, 'DELETE_DISCIPLINE', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_discipline_success"],
            content: disciplineDelete
        });
    } catch (error) {
        await Log.error(req.user.email, 'DELETE_DISCIPLINE', req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_discipline_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Chỉnh sửa thông tin kỷ luật */
exports.updateDiscipline = async (req, res) => {
    try {
        // Kiểm tra dữ liệu truyền vào
        if (req.body.organizationalUnit.trim() === "") {
            await Log.error(req.user.email, 'EDIT_DISCIPLINE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["unit_decisions_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.startDate.trim() === "") {
            await Log.error(req.user.email, 'EDIT_DISCIPLINE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["start_date_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.type.trim() === "") {
            await Log.error(req.user.email, 'EDIT_DISCIPLINE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["type_discipline_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.reason.trim() === "") {
            await Log.error(req.user.email, 'EDIT_DISCIPLINE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["reason_discipline_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            let disciplineUpdate = await DisciplineService.updateDiscipline(req.portal, req.params.id, req.body);
            await Log.info(req.user.email, 'EDIT_DISCIPLINE', req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_discipline_success"],
                content: disciplineUpdate
            });
        }
    } catch (error) {
        await Log.error(req.user.email, 'EDIT_DISCIPLINE', req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_discipline_faile"],
            content: {
                error: error
            }
        });
    }
}
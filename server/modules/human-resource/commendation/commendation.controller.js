const CommendationService = require('./commendation.service');
const Log = require(`${SERVER_LOGS_DIR}`);

/** Lấy danh sách khen thưởng */
exports.searchCommendations = async (req, res) => {
    try {
        let data = {};
        if (req.query.page === undefined && req.query.limit === undefined) {
            data = await CommendationService.getTotalCommendation(req.portal,req.user.company._id, req.query.organizationalUnits, req.query.month)
        } else {
            let params = {
                organizationalUnits: req.query.organizationalUnits,
                type: req.query.type,
                employeeNumber: req.query.employeeNumber,
                decisionNumber: req.query.decisionNumber,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            }
            data = await CommendationService.searchCommendations(req.portal,params, req.user.company._id);
        }

        await Log.info(req.user.email, 'GET_COMMENDATIONS', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_commendations_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_COMMENDATIONS', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_commendations_faile"],
            content: {
                error: error
            }
        });
    }
}
/** Tạo mới khen thưởng của nhân viên */
exports.createCommendation = async (req, res) => {
    try {
        // Kiểm tra dữ liệu truyền vào
        if (req.body.decisionNumber.trim() === "") {
            await Log.error(req.user.email, 'CREATE_COMMENDATIONS', req.portal);
            res.status(400).json({
                success: false,
                messages: ["number_decisions_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.organizationalUnit.trim() === "") {
            await Log.error(req.user.email, 'CREATE_COMMENDATIONS', req.portal);
            res.status(400).json({
                success: false,
                messages: ["unit_decisions_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.startDate.trim() === "") {
            await Log.error(req.user.email, 'CREATE_COMMENDATIONS', req.portal);
            res.status(400).json({
                success: false,
                messages: ["decisions_date_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.type.trim() === "") {
            await Log.error(req.user.email, 'CREATE_COMMENDATIONS', req.portal);
            res.status(400).json({
                success: false,
                messages: ["type_commendations_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.reason.trim() === "") {
            await Log.error(req.user.email, 'CREATE_COMMENDATIONS', req.portal);
            res.status(400).json({
                success: false,
                messages: ["reason_commendations_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            let createCommendation = await CommendationService.createCommendation(req.portal,req.body, req.user.company._id);
            // Kiểm tra trùng lặp
            if (createCommendation === "have_exist") {
                await Log.error(req.user.email, 'CREATE_COMMENDATIONS', req.portal);
                res.status(400).json({
                    success: false,
                    messages: ["number_decisions_have_exist"],
                    content: {
                        inputData: req.body
                    }
                });
            } else {
                await Log.info(req.user.email, 'CREATE_COMMENDATIONS', req.portal);
                res.status(200).json({
                    success: true,
                    messages: ["create_commendations_success"],
                    content: createCommendation
                });
            }
        }
    } catch (error) {
        await Log.error(req.user.email, 'CREATE_COMMENDATIONS', req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_commendations_faile"],
            content: {
                error: error
            }
        });
    }
}
/** Xoá thông tin khen thưởng */
exports.deleteCommendation = async (req, res) => {
    try {
        let commendationDelete = await CommendationService.deleteCommendation(req.portal,req.params.id);
        await Log.info(req.user.email, 'DELETE_COMMENDATIONS', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_commendations_success"],
            content: commendationDelete
        });
    } catch (error) {
        await Log.error(req.user.email, 'DELETE_COMMENDATIONS', req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_commendations_faile"],
            content: {
                error: error
            }
        });
    }
}
/** Chỉnh sửa thông tin khen thưởng */
exports.updateCommendation = async (req, res) => {
    try {
        // Kiểm tra dữ liệu truyền vào
        if (req.body.organizationalUnit.trim() === "") {
            await Log.error(req.user.email, 'EDIT_COMMENDATIONS', req.portal);
            res.status(400).json({
                success: false,
                messages: ["unit_decisions_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.startDate.trim() === "") {
            await Log.error(req.user.email, 'EDIT_COMMENDATIONS', req.portal);
            res.status(400).json({
                success: false,
                messages: ["start_date_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.type.trim() === "") {
            await Log.error(req.user.email, 'EDIT_COMMENDATIONS', req.portal);
            res.status(400).json({
                success: false,
                messages: ["type_commendations_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.reason.trim() === "") {
            await Log.error(req.user.email, 'EDIT_COMMENDATIONS', req.portal);
            res.status(400).json({
                success: false,
                messages: ["reason_commendations_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            let commendationUpdate = await CommendationService.updateCommendation(req.portal,req.params.id, req.body);
            await Log.info(req.user.email, 'EDIT_COMMENDATIONS', req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_commendations_success"],
                content: commendationUpdate
            });
        }
    } catch (error) {
        await Log.error(req.user.email, 'EDIT_COMMENDATIONS', req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_commendations_faile"],
            content: {
                error: error
            }
        });
    }
}
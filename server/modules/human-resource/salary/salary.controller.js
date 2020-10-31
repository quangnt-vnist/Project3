const SalaryService = require('./salary.service');
const Log = require(`${SERVER_LOGS_DIR}`);

/** Lấy danh sách các bảng lương */
exports.searchSalaries = async (req, res) => {
    try {
        let data = {};
        if (req.query.page !== undefined && req.query.limit !== undefined) {
            let params = {
                organizationalUnits: req.query.organizationalUnits,
                employeeNumber: req.query.employeeNumber,
                month: req.query.month,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            }
            data = await SalaryService.searchSalaries(req.portal, params, req.user.company._id);
        } else {
            data = await SalaryService.getAllSalaryByMonthAndOrganizationalUnits(req.portal, req.query.organizationalUnits, req.query.month);
        }
        await Log.info(req.user.email, 'GET_SARALY', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_salary_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_SARALY', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_salary_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Tạo mới một bảng lương */
exports.createSalary = async (req, res) => {
    try {
        // Kiểm tra thông tin dữ liệu truyền vào
        if (req.body.month.trim() === "") {
            await Log.error(req.user.email, 'CREATE_SARALY', req.portal);
            res.status(400).json({
                success: false,
                messages: ["month_salary_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.mainSalary.trim() === "") {
            await Log.error(req.user.email, 'CREATE_SARALY', req.portal);
            res.status(400).json({
                success: false,
                messages: ["money_salary_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            let createSalary = await SalaryService.createSalary(req.portal, req.body, req.user.company._id);
            if (createSalary === "have_exist") { // Kiểm tra trùng lặp
                await Log.error(req.user.email, 'CREATE_SARALY', req.portal);
                res.status(400).json({
                    success: false,
                    messages: ["month_salary_have_exist"],
                    content: {
                        inputData: req.body
                    }
                });
            } else {
                await Log.info(req.user.email, 'CREATE_SARALY', req.portal);
                res.status(200).json({
                    success: true,
                    messages: ["create_salary_success"],
                    content: createSalary
                });
            }
        }
    } catch (error) {
        await Log.error(req.user.email, 'CREATE_SARALY', req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_salary_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Xoá thông tin bảng lương */
exports.deleteSalary = async (req, res) => {
    try {
        let salaryDelete = await SalaryService.deleteSalary(req.portal, req.params.id);
        await Log.info(req.user.email, 'DELETE_SARALY', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_salary_success"],
            content: salaryDelete
        });
    } catch (error) {
        await Log.error(req.user.email, 'DELETE_SARALY', req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_salary_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Chỉnh sửa thông tin bảng lương */
exports.updateSalary = async (req, res) => {
    try {
        if (req.body.mainSalary.trim() === "") {
            await Log.error(req.user.email, 'EDIT_SARALY', req.portal);
            res.status(400).json({
                success: false,
                messages: ["money_salary_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            let salaryUpdate = await SalaryService.updateSalary(req.portal, req.params.id, req.body);
            await Log.info(req.user.email, 'EDIT_SARALY', req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_salary_success"],
                content: salaryUpdate
            });
        }
    } catch (error) {
        await Log.error(req.user.email, 'EDIT_SARALY', req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_salary_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Import dữ liệu bảng lương */
exports.importSalaries = async (req, res) => {
    try {
        let data = await SalaryService.importSalaries(req.portal, req.body, req.user.company._id);
        if (data.rowError !== undefined) {
            await Log.error(req.user.email, 'IMPORT_SARALY', req.portal);
            res.status(400).json({
                success: false,
                messages: ["import_salary_faile"],
                content: data
            });
        } else {
            await Log.info(req.user.email, 'IMPORT_SARALY', req.portal);
            res.status(200).json({
                success: true,
                messages: ["import_salary_success"],
                content: data
            });
        }
    } catch (error) {
        await Log.error(req.user.email, 'IMPORT_SARALY', req.portal);
        res.status(400).json({
            success: false,
            messages: ["import_salary_faile"],
            content: {
                error: error
            }
        });
    }
}
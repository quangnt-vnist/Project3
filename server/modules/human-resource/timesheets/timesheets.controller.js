const TimesheetService = require('./timesheets.service');

const Log = require(`${SERVER_LOGS_DIR}`);

/** Lấy danh sách thông tin chấm công */
exports.searchTimesheets = async (req, res) => {
    try {
        let data = {};
        if(req.query.employeeId && req.query.startDate && req.query.endDate){
            data = await TimesheetService.getTimesheetsByEmployeeIdOrEmailInCompanyAndTime(req.portal, req.query.employeeId, req.query.startDate, req.query.endDate, req.user.company._id)
        } else if (req.query.startDate && req.query.endDate) {
            data = await TimesheetService.getOvertimeOfUnitsByStartDateAndEndDate(req.portal, req.query.organizationalUnits, req.query.startDate, req.query.endDate, req.user.company._id)
        } else if (req.query.page && req.query.limit) {
            let params = {
                organizationalUnits: req.query.organizationalUnits,
                employeeNumber: req.query.employeeNumber,
                month: req.query.month,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            }
            data = await TimesheetService.searchTimesheets(req.portal, params, req.user.company._id);
        }
        await Log.info(req.user.email, 'GET_TIMESHEETS', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_timesheets_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_TIMESHEETS', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_timesheets_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Tạo mới thông tin chấm công */
exports.createTimesheets = async (req, res) => {
    try {
        if (req.body.month.trim() === "") {
            await Log.error(req.user.email, 'CREATE_TIMESHEETS', req.portal);
            res.status(400).json({
                success: false,
                messages: ["month_timesheets_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            let createTimesheets = await TimesheetService.createTimesheets(req.portal, req.body, req.user.company._id);
            if (createTimesheets === "have_exist") { // Kiểm tra trùng lặp
                await Log.error(req.user.email, 'CREATE_TIMESHEETS', req.portal);
                res.status(400).json({
                    success: false,
                    messages: ["month_timesheets_have_exist"],
                    content: {
                        inputData: req.body
                    }
                });
            } else {
                await Log.info(req.user.email, 'CREATE_TIMESHEETS', req.portal);
                res.status(200).json({
                    success: true,
                    messages: ["create_timesheets_success"],
                    content: createTimesheets
                });
            }
        }
    } catch (error) {
        await Log.error(req.user.email, 'CREATE_TIMESHEETS', req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_timesheets_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Xoá thông tin chấm công */
exports.deleteTimesheets = async (req, res) => {
    try {
        let timesheetsDelete = await TimesheetService.deleteTimesheets(req.portal, req.params.id);
        await Log.info(req.user.email, 'DELETE_TIMESHEETS', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_timesheets_success"],
            content: timesheetsDelete
        });
    } catch (error) {
        await Log.error(req.user.email, 'DELETE_TIMESHEETS', req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_timesheets_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Chỉnh sửa thông tin chấm công */
exports.updateTimesheets = async (req, res) => {
    try {
        // Kiểm tra dữ liệu truyền vào
        if (req.body.employeeNumber.trim() === "") {
            await Log.error(req.user.email, 'EDIT_TIMESHEETS', req.portal);
            res.status(400).json({
                success: false,
                messages: ["employee_number_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.month.trim() === "") {
            await Log.error(req.user.email, 'EDIT_TIMESHEETS', req.portal);
            res.status(400).json({
                success: false,
                messages: ["month_timesheets_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            var timesheetsUpdate = await TimesheetService.updateTimesheets(req.portal, req.params.id, req.body, req.user.company._id);
            // Kiểm tra sự tồn tại của mã nhân viên
            if (timesheetsUpdate === null) {
                await Log.error(req.user.email, 'EDIT_TIMESHEETS', req.portal);
                res.status(404).json({
                    success: false,
                    messages: ["staff_code_not_find"],
                    content: {
                        inputData: req.body
                    }
                });
            } else {
                await Log.info(req.user.email, 'EDIT_TIMESHEETS', req.portal);
                res.status(200).json({
                    success: true,
                    messages: ["edit_timesheets_success"],
                    content: timesheetsUpdate
                });
            }
        }
    } catch (error) {
        await Log.error(req.user.email, 'EDIT_TIMESHEETS', req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_timesheets_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Import dữ liệu chấm công */
exports.importTimesheets = async (req, res) => {
    try {
        var data = await TimesheetService.importTimesheets(req.portal, req.body, req.user.company._id);
        if (data.rowError !== undefined) {
            await Log.error(req.user.email, 'IMPORT_TIMESHEETS', req.portal);
            res.status(400).json({
                success: false,
                messages: ["import_timesheets_faile"],
                content: data
            });
        } else {
            await Log.info(req.user.email, 'IMPORT_TIMESHEETS', req.portal);
            res.status(200).json({
                success: true,
                messages: ["import_timesheets_success"],
                content: data
            });
        }
    } catch (error) {
        await Log.error(req.user.email, 'IMPORT_TIMESHEETS', req.portal);
        res.status(400).json({
            success: false,
            messages: ["import_timesheets_faile"],
            content: {
                error: error
            }
        });
    }
}
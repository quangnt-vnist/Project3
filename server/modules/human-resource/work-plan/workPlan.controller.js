const WorkPlanService = require('./workPlan.service');
const Log = require(`${SERVER_LOGS_DIR}`);


/**
 * Hàm tiện ích kiểm tra trùng lặp thời gian lịch làm việc
 * @param {*} data : Thông tin lịch làm việc
 * @param {*} array : Danh sách lịch làm việc
 */
exports.checkForFuplicate = (data, array) => {
    let startDate = new Date(data.startDate);
    let endDate = new Date(data.endDate);
    let checkData = true;
    for (let n in array) {
        let date1 = new Date(array[n].startDate);
        let date2 = new Date(array[n].endDate);
        if (date1.getTime() === startDate.getTime() || (startDate.getTime() < date1.getTime() && endDate.getTime() > date1.getTime()) ||
            (startDate.getTime() < date2.getTime() && endDate.getTime() > date1.getTime())) {
            checkData = false;
            break;
        }
    }
    return checkData
}

/** Lấy danh sách lịch làm việc */
exports.getAllWorkPlans = async (req, res) => {
    try {
        let data;
        if (req.query.year) {
            data = await WorkPlanService.getWorkPlansOfYear(req.portal, req.user.company._id, req.query.year);
        } else {
            data = await WorkPlanService.getAllWorkPlans(req.portal, req.user.company._id);
        }
        await Log.info(req.user.email, 'GET_WORK_PLAN', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_work_plan_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_WORK_PLAN', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_work_plan_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Tạo mới thông tin lịch làm việc */
exports.createWorkPlan = async (req, res) => {
    try {
        let maximumNumberOfLeaveDays = false;
        if (req.body.maximumNumberOfLeaveDays) {
            maximumNumberOfLeaveDays = true
        };
        // Kiểm tra dữ liệu đầu vào
        if (req.body.startDate.trim() === "") {
            await Log.error(req.user.email, 'CREATE_WORK_PLAN', req.portal);
            res.status(400).json({
                success: false,
                messages: ["start_date_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.endDate.trim() === "") {
            await Log.error(req.user.email, 'CREATE_WORK_PLAN', req.portal);
            res.status(400).json({
                success: false,
                messages: ["end_date_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.description.trim() === "") {
            await Log.error(req.user.email, 'CREATE_WORK_PLAN', req.portal);
            res.status(400).json({
                success: false,
                messages: ["reason_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            // Tạo mới thông tin lịch làm việc
            let result = await WorkPlanService.getAllWorkPlans(req.portal, req.user.company._id);
            let checkData = this.checkForFuplicate(req.body, result.workPlans);
            if (checkData) {
                let data = await WorkPlanService.createWorkPlan(req.portal, req.body, req.user.company._id);
                await Log.info(req.user.email, 'CREATE_WORK_PLAN', req.portal);
                res.status(200).json({
                    success: true,
                    messages: ["create_work_plan_success"],
                    content: data
                });
            } else {
                await Log.error(req.user.email, 'CREATE_WORK_PLAN', req.portal);
                res.status(400).json({
                    success: false,
                    messages: ["work_plan_duplicate_required"],
                    content: {
                        inputData: req.body
                    }
                });
            }
        }
    } catch (error) {
        await Log.error(req.user.email, 'CREATE_WORK_PLAN', req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_work_plan_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Xoá thông tin lịch làm việc */
exports.deleteWorkPlan = async (req, res) => {
    try {
        let data = await WorkPlanService.deleteWorkPlan(req.portal, req.params.id, req.user.company._id);
        await Log.info(req.user.email, 'DELETE_WORK_PLAN', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_work_plan_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'DELETE_WORK_PLAN', req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_work_plan_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Chỉnh sửa thông tin lịch làm việc */
exports.updateWorkPlan = async (req, res) => {
    try {
        if (req.body.maximumNumberOfLeaveDays) {
            let data = await WorkPlanService.updateNumberDateLeaveOfYear(req.portal, req.body.maximumNumberOfLeaveDays, req.user.company._id);
            await Log.info(req.user.email, 'EDIT_WORK_PLAN', req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_number_date_leave_of_year_success"],
                content: data
            });
        } else {
            // Kiểm tra thông tin truyền vào
            if (req.body.startDate.trim() === "") {
                await Log.error(req.user.email, 'CREATE_WORK_PLAN', req.portal);
                res.status(400).json({
                    success: false,
                    messages: ["start_date_required"],
                    content: {
                        inputData: req.body
                    }
                });
            } else if (req.body.endDate.trim() === "") {
                await Log.error(req.user.email, 'CREATE_WORK_PLAN', req.portal);
                res.status(400).json({
                    success: false,
                    messages: ["end_date_required"],
                    content: {
                        inputData: req.body
                    }
                });
            } else if (req.body.description.trim() === "") {
                await Log.error(req.user.email, 'CREATE_WORK_PLAN', req.portal);
                res.status(400).json({
                    success: false,
                    messages: ["reason_required"],
                    content: {
                        inputData: req.body
                    }
                });
            } else {
                // Chỉnh sửa thông tin lịch làm việc
                let result = await WorkPlanService.getAllWorkPlans(req.portal, req.user.company._id);
                result.workPlans = result.workPlans.filter(x => x._id.toString() !== req.params.id);
                let checkData = this.checkForFuplicate(req.body, result.workPlans);
                if (checkData) {
                    let data = await WorkPlanService.updateWorkPlan(req.portal, req.params.id, req.body, req.user.company._id);
                    await Log.info(req.user.email, 'EDIT_WORK_PLAN', req.portal);
                    res.status(200).json({
                        success: true,
                        messages: ["edit_work_plan_success"],
                        content: data
                    });
                } else {
                    await Log.error(req.user.email, 'EDIT_WORK_PLAN', req.portal);
                    res.status(400).json({
                        success: false,
                        messages: ["work_plan_duplicate_required"],
                        content: {
                            inputData: req.body
                        }
                    });
                }
            }
        }

    } catch (error) {
        await Log.error(req.user.email, 'EDIT_WORK_PLAN', req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_work_plan_faile"],
            content: {
                error: error
            }
        });
    }
};

/** Import dữ liệu lịch làm việc */
exports.importWorkPlans = async (req, res) => {
    try {
        let data = await WorkPlanService.importWorkPlans(req.portal, req.body, req.user.company._id);
        if (data.rowError !== undefined) {
            await Log.error(req.user.email, 'IMPORT_WORK_PLAN', req.portal);
            res.status(400).json({
                success: false,
                messages: ["import_work_plan_faile"],
                content: data
            });
        } else {
            await Log.info(req.user.email, 'IMPORT_WORK_PLAN', req.portal);
            res.status(200).json({
                success: true,
                messages: ["import_work_plan_success"],
                content: data
            });
        }
    } catch (error) {
        await Log.error(req.user.email, 'IMPORT_WORK_PLAN', req.portal);
        res.status(400).json({
            success: false,
            messages: ["import_work_plan_faile"],
            content: {
                error: error
            }
        });
    }
};
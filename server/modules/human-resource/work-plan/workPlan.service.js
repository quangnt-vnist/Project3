const {
    WorkPlan
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy danh sách lịch làm việc
 * @company : Id công ty
 */
exports.getAllWorkPlans = async (portal,company) => {
    let data = await WorkPlan(connect(DB_CONNECTION, portal)).findOne({
        company: company
    });
    if(data&&data.workPlans.length>1){
        data.workPlans = data.workPlans.sort((a,b)=> {return a.startDate-b.startDate});
    }
    return {
        maximumNumberOfLeaveDays: data ? data.maximumNumberOfLeaveDays : 0,
        workPlans: data ? data.workPlans : []
    };
}

/**
 * Lấy danh sách kế hoạch làm việc theo năm
 * @param {*} year : Năm
 * @param {*} company : Id công ty
 */
exports.getWorkPlansOfYear = async (portal,company, year) => {
    let firstDay = new Date(year, 0, 1);
    let lastDay = new Date(Number(year) + 1, 0, 1);
    let data = await WorkPlan(connect(DB_CONNECTION, portal)).findOne({
        company: company,
        'workPlans.startDate': {
            "$gt": firstDay,
            "$lte": lastDay
        }
    });
    if(data&&data.workPlans.length>1){
        data.workPlans = data.workPlans.sort((a,b)=> {return a.startDate-b.startDate});
    }
    return {
        maximumNumberOfLeaveDays: data ? data.maximumNumberOfLeaveDays : 0,
        workPlans: data ? data.workPlans : []
    };
}

/**
 * Thêm mới lịch làm việc
 * @data : dữ liệu lịch làm việc cần thêm
 * @company : id công ty cần thêm
 */
exports.createWorkPlan = async (portal,data, company) => {
    let newWorkPlan = {
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
    }
    let workPlan = await WorkPlan(connect(DB_CONNECTION, portal)).findOne({
        company: company,
    });
    if (workPlan === null) {
        workPlan = await WorkPlan(connect(DB_CONNECTION, portal)).create({
            company: company,
            maximumNumberOfLeaveDays: 0,
            workPlans: [],
        });
    };
    workPlan.workPlans.push(newWorkPlan);
    workPlan.save();
    return workPlan.workPlans[workPlan.workPlans.length - 1];
}

/**
 * Xoá thông tin lịch làm việc
 * @id : id thông tin lịch làm việc cần xoá
 */
exports.deleteWorkPlan = async (portal,id, company) => {
    let workPlan = await WorkPlan(connect(DB_CONNECTION, portal)).findOne({
        company: company,
    });
    let deleteWorkPlan = workPlan.workPlans.find(x => x._id.toString() === id);
    workPlan.workPlans = workPlan.workPlans.filter(x => x._id.toString() !== id);
    workPlan.save();
    return deleteWorkPlan;
}

/**
 * Cập nhật thông tin lịch làm việc
 * @id : id thông tin lịch làm việc cần chỉnh sửa
 * @data : dữ liệu chỉnh sửa thông tin lịch làm việc
 */
exports.updateWorkPlan = async (portal,id, data, company) => {
    let workPlan = await WorkPlan(connect(DB_CONNECTION, portal)).findOne({
        company: company
    });
    workPlan.workPlans = workPlan.workPlans.map(x => {
        if (x._id.toString() === id) {
            x.type = data.type;
            x.startDate = data.startDate;
            x.endDate = data.endDate;
            x.description = data.description;
        }
        return x;
    })
    workPlan.save();
    return {
        workPlan: workPlan.workPlans.find(x => x._id.toString() === id)
    };
}

/**
 * Cập nhật tổng số ngày nghỉ phép trong năm
 * @param {*} maximumNumberOfLeaveDays : Tổng số ngày nghỉ phép trong năm 
 */
exports.updateNumberDateLeaveOfYear = async (portal,maximumNumberOfLeaveDays, company) => {
    let workPlan = await WorkPlan(connect(DB_CONNECTION, portal)).findOne({
        company: company
    });
    if (workPlan === null) {
        workPlan = await WorkPlan(connect(DB_CONNECTION, portal)).create({
            company: company,
            maximumNumberOfLeaveDays: 0,
            workPlans: [],
        });
    };
    workPlan.maximumNumberOfLeaveDays = maximumNumberOfLeaveDays;
    workPlan.save();
    return {
        maximumNumberOfLeaveDays: workPlan.maximumNumberOfLeaveDays
    };
}

/**
 * Hàm tiện ích convertdate thành yyyy-mm-dd
 * @param {Hàm} date : ngày cần convert
 */
exports.formatDate = (date) => {
    let d = date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-');
}

/**
 * import dữ liệu bảng lương 
 * @param {*} data : Dữ liệu import
 * @param {*} company : Id công ty
 */
exports.importWorkPlans = async (portal,data, company) => {
    let workPlan = await WorkPlan(connect(DB_CONNECTION, portal)).findOne({
        company: company,
    });
    if (workPlan === null) {
        workPlan = await WorkPlan(connect(DB_CONNECTION, portal)).create({
            company: company,
            maximumNumberOfLeaveDays: 0,
            workPlans: [],
        });
    };
    let workPlanExisted = workPlan.workPlans;
    let rowError = [];
    data = data.map((x, index) => {
        if (workPlanExisted.length !== 0) {
            let workPlan = workPlanExisted.filter(y => x.startDate === this.formatDate(y.startDate) && x.endDate === this.formatDate(y.endDate));
            if (workPlan.length !== 0) {
                x = {
                    ...x,
                    errorAlert: [...x.errorAlert, "work_plan_have_exist"],
                    error: true
                };
                rowError = [...rowError, index + 1];
            }
        }
        return {
            ...x,
            company: company
        };
    })
    if (rowError.length !== 0) {
        for (let n in data) {
            let partStart = data[n].startDate.split('-');
            let startDate = [partStart[2], partStart[1], partStart[0]].join('-');
            let partEnd = data[n].endDate.split('-');
            let endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
            data[n] = {
                ...data[n],
                startDate: startDate,
                endDate: endDate
            };
        };
        return {
            data,
            rowError
        }
    } else {
        workPlan.workPlans = workPlan.workPlans.concat(data);
        workPlan.save();
        return workPlan.workPlans;
    }
}
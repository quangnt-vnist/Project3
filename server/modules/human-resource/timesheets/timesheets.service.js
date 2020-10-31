const EmployeeService = require('../profile/profile.service');
const {
    Employee,
    Timesheet,
    ModuleConfiguration
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);
const ObjectId = require('mongoose').Types.ObjectId;


/**
 * Lấy thông tin chấm công nhân viên
 * @params : Dữ liệu các key tìm kiếm
 * @company : Id công ty người tìm kiếm
 */
exports.searchTimesheets = async (portal, params, company) => {
    let keySearchEmployee, keySearch = {
        company: company
    };

    // Bắt sựu kiện đơn vị tìm kiếm khác undefined 
    if (params.organizationalUnits) {
        let emailInCompany = await EmployeeService.getEmployeeEmailsByOrganizationalUnitsAndPositions(portal, params.organizationalUnits, undefined);
        keySearchEmployee = {
            ...keySearchEmployee,
            emailInCompany: {
                $in: emailInCompany
            }
        }
    }

    // Bắt sựu kiện MSNV tìm kiếm khác undefined
    if (params.employeeNumber) {
        keySearchEmployee = {
            ...keySearchEmployee,
            employeeNumber: {
                $regex: params.employeeNumber,
                $options: "i"
            }
        }
    }
    if (keySearchEmployee) {
        let employeeInfo = await Employee(connect(DB_CONNECTION, portal)).find(keySearchEmployee);
        let employee = employeeInfo.map(x => x._id);
        keySearch = {
            ...keySearch,
            employee: {
                $in: employee
            }
        }
    }

    // Bắt sựu kiện tháng tìm kiếm khác null
    if (params.month) {
        keySearch = {
            ...keySearch,
            month: new Date(params.month)
        }
    };

    // Lấy danh sách chấm công
    let totalList = await Timesheet(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let listTimesheets = await Timesheet(connect(DB_CONNECTION, portal)).find(keySearch).populate({
            path: 'employee',
            select: 'employeeNumber fullName'
        })
        .sort({
            'createAt': 'desc'
        }).skip(params.page).limit(params.limit);

    return {
        totalList,
        listTimesheets
    }
}

/**
 * Function lấy thông tin chấm công theo id nhân viên trong 1 khoảng thời gian
 * @param {*} portal : Tên ngắn của công ty
 * @param {*} employeeId : Id nhân viên 
 * @param {*} startDate : Thời gian bắt đầu
 * @param {*} endDate : Thời gian kết thúc
 * @param {*} company : Id công ty
 */
exports.getTimesheetsByEmployeeIdOrEmailInCompanyAndTime = async (portal, employeeId, startDate, endDate, company) => {
    if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
        return {
            arrMonth: [],
            listTimesheetsByEmployeeIdAndTime: [],
        }
    } else {
        let endMonth = new Date(endDate).getMonth();
        let endYear = new Date(endDate).getFullYear();
        endMonth = endMonth + 1;
        let arrMonth = [];
        for (let i = 0;; i++) {
            let month = endMonth - i;
            if (month > 0) {
                if (month.toString().length === 1) {
                    month = `${endYear}-0${month}-01`;
                    arrMonth = [...arrMonth, month];
                } else {
                    month = `${endYear}-${month}-01`;
                    arrMonth = [...arrMonth, month];
                }
                if (`${startDate}-01` === month) {
                    break;
                }
            } else {
                let j = 1;
                for (j;; j++) {
                    month = month + 12;
                    if (month > 0) {
                        break;
                    }
                }
                if (month.toString().length === 1) {
                    month = `${endYear-j}-0${month}-01`;
                    arrMonth = [...arrMonth, month];
                } else {
                    month = `${endYear-j}-${month}-01`;
                    arrMonth = [...arrMonth, month];
                }
                if (`${startDate}-01` === month) {
                    break;
                }
            }
        };
        let arr = arrMonth.map(x => new Date(x));

        let employee;
        if(ObjectId.isValid(employeeId)){
            employee = await Employee(connect(DB_CONNECTION, portal)).findOne({_id: employeeId},{_id: 1});
        }else{
            employee = await Employee(connect(DB_CONNECTION, portal)).findOne({emailInCompany: employeeId }, {_id: 1});
        }

        let listTimesheetsByEmployeeIdAndTime = await Timesheet(connect(DB_CONNECTION, portal)).find({
            employee: employee._id,
            month: {
                $in: arr
            }
        }, {
            totalHoursOff: 1,
            totalHours:1,
            month: 1
        });
        return {
            listTimesheetsByEmployeeIdAndTime,
            arrMonth
        }

    }
}

/**
 * Function lấy thời gian tăng ca theo đơn vị và khoảng thời gian
 * @param {*} portal : Tên ngắn công ty
 * @param {*} organizationalUnits : Array id đơn vị
 * @param {*} startDate : Thời gian bắt đầu
 * @param {*} endDate : Thời gian kết thúc
 * @param {*} company : Id công ty
 */
exports.getOvertimeOfUnitsByStartDateAndEndDate = async (portal, organizationalUnits, startDate, endDate, company) => {
    if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
        return {
            arrMonth: [],
            listOvertimeOfUnitsByStartDateAndEndDate: [],
            
        }
    } else {
        let endMonth = new Date(endDate).getMonth();
        let endYear = new Date(endDate).getFullYear();
        endMonth = endMonth + 1;
        let arrMonth = [];
        for (let i = 0;; i++) {
            let month = endMonth - i;
            if (month > 0) {
                if (month.toString().length === 1) {
                    month = `${endYear}-0${month}-01`;
                    arrMonth = [...arrMonth, month];
                } else {
                    month = `${endYear}-${month}-01`;
                    arrMonth = [...arrMonth, month];
                }
                if (`${startDate}-01` === month) {
                    break;
                }
            } else {
                let j = 1;
                for (j;; j++) {
                    month = month + 12;
                    if (month > 0) {
                        break;
                    }
                }
                if (month.toString().length === 1) {
                    month = `${endYear-j}-0${month}-01`;
                    arrMonth = [...arrMonth, month];
                } else {
                    month = `${endYear-j}-${month}-01`;
                    arrMonth = [...arrMonth, month];
                }
                if (`${startDate}-01` === month) {
                    break;
                }
            }
        };
        let arr = arrMonth.map(x => new Date(x));
        if (organizationalUnits) {
            let keySearchEmployee, keySearch = {
                company: company,
                month: {
                    $in: arr
                }
            };
            let emailInCompany = await EmployeeService.getEmployeeEmailsByOrganizationalUnitsAndPositions(portal, organizationalUnits, undefined);
            keySearchEmployee = {
                ...keySearchEmployee,
                emailInCompany: {
                    $in: emailInCompany
                }
            };
            if (keySearchEmployee) {
                let employeeInfo = await Employee(connect(DB_CONNECTION, portal)).find(keySearchEmployee, {
                    _id: 1
                });
                let employee = employeeInfo.map(x => x._id);
                if (employee.length !== 0) {
                    keySearch = {
                        ...keySearch,
                        employee: {
                            $in: employee
                        }
                    }
                }
            }
            let listOvertimeOfUnitsByStartDateAndEndDate = await Timesheet(connect(DB_CONNECTION, portal)).find(keySearch, {
                totalHoursOff: 1,
                month: 1
            }).populate({path:'employee', select:'employeeNumber fullName emailInCompany _id'});
            return {
                listOvertimeOfUnitsByStartDateAndEndDate,
                arrMonth
            }
        } else {
            let listOvertimeOfUnitsByStartDateAndEndDate = await Timesheet(connect(DB_CONNECTION, portal)).find({
                month: {
                    $in: arr
                }
            }, {
                totalHoursOff: 1,
                month: 1
            }).populate({path:'employee', select:'employeeNumber fullName emailInCompany _id'});
            return {
                listOvertimeOfUnitsByStartDateAndEndDate,
                arrMonth
            }
        }
    }
}

/**
 * Tạo mới thông tin chấm công
 * @param {*} data : Dữ liệu chấm công
 * @param {*} company : Id công ty
 */
exports.createTimesheets = async (portal, data, company) => {
    let config = await ModuleConfiguration(connect(DB_CONNECTION, portal)).find();
    let humanResourceConfig = config.length > 0 ? config[0] : undefined;
    let timekeepingType = "shift",
        timeShift1 = 4,
        timeShift2 = 4,
        timeShift3 = 4;

    if (humanResourceConfig && humanResourceConfig.humanResource && humanResourceConfig.humanResource.timekeepingType) {
        timekeepingType = humanResourceConfig.humanResource.timekeepingType;
    };
    if (timekeepingType === "shift" && humanResourceConfig.humanResource.timekeepingByShift) {
        let timekeepingByShift = humanResourceConfig.humanResource.timekeepingByShift;
        timeShift1 = timekeepingByShift.shift1Time;
        timeShift2 = timekeepingByShift.shift2Time;
        timeShift3 = timekeepingByShift.shift3Time;
    }

    let month = new Date(data.month);
    let isSalary = await Timesheet(connect(DB_CONNECTION, portal)).findOne({
        employee: data.employee,
        company: company,
        month: month
    }, {
        field1: 1
    });

    if (isSalary !== null) {
        return "have_exist"
    } else {
        let createTimesheets;
        if (timekeepingType === 'shift') {
            let timekeepingByShift = data.timekeepingByShift;
            let shift1s = timekeepingByShift.shift1s.map(x => x ? timeShift1 : 0);
            let shift2s = timekeepingByShift.shift2s.map(x => x ? timeShift2 : 0);
            let shift3s = timekeepingByShift.shift3s.map(x => x ? timeShift3 : 0);
            let timekeepingByHours = shift1s.map((x, index) => x + shift2s[index] + shift3s[index]);
            let totalHours = 0,
                totalOverTimeHours = 0;
            timekeepingByShift.shift3s.forEach(x => {
                if (x) {
                    totalOverTimeHours = totalOverTimeHours + timeShift3;
                }
            });
            timekeepingByHours.forEach(x => {
                totalHours = totalHours + x;
            })
            // Thêm thông tin chấm công
            createTimesheets = await Timesheet(connect(DB_CONNECTION, portal)).create({
                employee: data.employee,
                company: company,
                month: month,
                totalHours: totalHours,
                totalHoursOff: 0 - totalOverTimeHours,
                timekeepingByHours: timekeepingByHours,
                timekeepingByShift: data.timekeepingByShift,

            });
        } else if (timekeepingType === "hours") {
            let totalHours = 0;
            data.timekeepingByHours.forEach(x => {
                totalHours = totalHours + parseInt(x);
            });

            // Thêm thông tin chấm công
            createTimesheets = await Timesheet(connect(DB_CONNECTION, portal)).create({
                employee: data.employee,
                company: company,
                month: month,
                totalHours: totalHours,
                totalHoursOff: data.totalHoursOff,
                timekeepingByHours: data.timekeepingByHours,
            });
        }

        // Lấy thông tin chấm công vừa cập nhật
        let newTimesheets = await Timesheet(connect(DB_CONNECTION, portal)).findOne({
            _id: createTimesheets._id
        }).populate([{
            path: 'employee',
            select: 'employeeNumber fullName'
        }])

        return newTimesheets
    }
}

/**
 * Xoá thông tin chấm công
 * @id : Id thông tin chấm công
 */
exports.deleteTimesheets = async (portal, id) => {
    return await Timesheet(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: id
    });
}

/**
 * Chỉnh sửa thông tin chấm công
 * @id : id thông tin chấm công muốn chỉnh sửa
 * @data : Dữ liệu thay đổi thông tin chấm công
 */
exports.updateTimesheets = async (portal, id, data) => {
    let config = await ModuleConfiguration(connect(DB_CONNECTION, portal)).find();
    let humanResourceConfig = config.length > 0 ? config[0] : undefined;
    let timekeepingType = "shift",
        timeShift1 = 4,
        timeShift2 = 4,
        timeShift3 = 4;

    if (humanResourceConfig && humanResourceConfig.humanResource && humanResourceConfig.humanResource.timekeepingType) {
        timekeepingType = humanResourceConfig.humanResource.timekeepingType;
    };
    if (timekeepingType === "shift" && humanResourceConfig.humanResource.timekeepingByShift) {
        let timekeepingByShift = humanResourceConfig.humanResource.timekeepingByShift;
        timeShift1 = timekeepingByShift.shift1Time;
        timeShift2 = timekeepingByShift.shift2Time;
        timeShift3 = timekeepingByShift.shift3Time;
    }

    if (timekeepingType === "shift") {
        let timekeepingByShift = data.timekeepingByShift;
        let shift1s = timekeepingByShift.shift1s.map(x => x ? timeShift1 : 0);
        let shift2s = timekeepingByShift.shift2s.map(x => x ? timeShift2 : 0);
        let shift3s = timekeepingByShift.shift3s.map(x => x ? timeShift3 : 0);
        let timekeepingByHours = shift1s.map((x, index) => x + shift2s[index] + shift3s[index]);
        let totalHours = 0,
            totalOverTimeHours = 0;
        timekeepingByHours.forEach(x => {
            totalHours = totalHours + x;
        });
        timekeepingByShift.shift3s.forEach(x => {
            if (x) {
                totalOverTimeHours = totalOverTimeHours + timeShift3;
            }
        });

        // Cập nhật thông tin chấm công
        let infoTimesheets = await Timesheet(connect(DB_CONNECTION, portal)).findById(id);
        infoTimesheets.totalHours = totalHours;
        infoTimesheets.totalHoursOff = 0 - totalOverTimeHours;
        infoTimesheets.timekeepingByShift = data.timekeepingByShift;
        infoTimesheets.timekeepingByHours = timekeepingByHours;
        await infoTimesheets.save();

    } else if (timekeepingType === "hours") {
        let totalHours = 0;
        data.timekeepingByHours.forEach(x => {
            totalHours = totalHours + parseInt(x);
        })
        // Cập nhật thông tin chấm công
        let infoTimesheets = await Timesheet(connect(DB_CONNECTION, portal)).findById(id);
        infoTimesheets.totalHours = totalHours;
        infoTimesheets.totalHoursOff = data.totalHoursOff;
        infoTimesheets.timekeepingByHours = data.timekeepingByHours;
        await infoTimesheets.save();
    }

    // Lấy thông tin chấm công vừa cập nhật
    let updateTimesheets = await Timesheet(connect(DB_CONNECTION, portal)).findOne({
        _id: id
    }).populate([{
        path: 'employee',
        select: 'employeeNumber fullName'
    }])

    return updateTimesheets
}

/**
 * import thông tin chấm công
 */
exports.importTimesheets = async (portal, data, company) => {
    let timesheetsExisted = await Timesheet(connect(DB_CONNECTION, portal)).find({
        month: data[0].month,
        company: company
    })
    let employeeInfo = await Employee(connect(DB_CONNECTION, portal)).find({
        company: company
    }, {
        employeeNumber: 1,
        _id: 1
    });
    let rowError = [];
    data = data.map((x, index) => {
        let employee = employeeInfo.filter(y => y.employeeNumber === x.employeeNumber);
        if (employee.length === 0) {
            x = {
                ...x,
                errorAlert: [...x.errorAlert, "staff_code_not_find"],
                error: true
            };
            rowError = [...rowError, index + 1];
        } else {
            x = {
                ...x,
                employee: employee[0]._id,
                company: company
            };
            if (timesheetsExisted.length !== 0) {
                let timesheetsMonth = new Date(x.month);
                let timesheets = timesheetsExisted.filter(y => y.employee.toString() === employee[0]._id.toString() && timesheetsMonth.toString() === y.month.toString());
                if (timesheets.length !== 0) {
                    x = {
                        ...x,
                        errorAlert: [...x.errorAlert, "month_timesheets_have_exist"],
                        error: true
                    };
                    rowError = [...rowError, index + 1];
                }
            }
        }
        return x;
    })
    if (rowError.length !== 0) {
        return {
            data,
            rowError
        }
    } else {
        let config = await ModuleConfiguration(connect(DB_CONNECTION, portal)).find();
        let humanResourceConfig = config.length > 0 ? config[0] : undefined;
        let timekeepingType = "shift",
            timeShift1 = 4,
            timeShift2 = 4,
            timeShift3 = 4;

        if (humanResourceConfig && humanResourceConfig.humanResource && humanResourceConfig.humanResource.timekeepingType) {
            timekeepingType = humanResourceConfig.humanResource.timekeepingType;
        };
        if (timekeepingType === "shift" && humanResourceConfig.humanResource.timekeepingByShift) {
            let timekeepingByShift = humanResourceConfig.humanResource.timekeepingByShift;
            timeShift1 = timekeepingByShift.shift1Time;
            timeShift2 = timekeepingByShift.shift2Time;
            timeShift3 = timekeepingByShift.shift3Time;
        }

        if (timekeepingType === "shift") {
            data = data.map(y => {
                let timekeepingByShift = y.timekeepingByShift;
                let shift1s = timekeepingByShift.shift1s.map(x => x ? timeShift1 : 0);
                let shift2s = timekeepingByShift.shift2s.map(x => x ? timeShift2 : 0);
                let shift3s = timekeepingByShift.shift3s.map(x => x ? timeShift3 : 0);
                let timekeepingByHours = shift1s.map((x, index) => x + shift2s[index] + shift3s[index]);
                let totalHours = 0,
                    totalOverTimeHours = 0;
                timekeepingByHours.forEach(x => {
                    totalHours = totalHours + x;
                });
                timekeepingByShift.shift3s.forEach(x => {
                    if (x) {
                        totalOverTimeHours = totalOverTimeHours + timeShift3;
                    }
                });

                return {
                    ...y,
                    totalHours: totalHours,
                    totalHoursOff: 0 - totalOverTimeHours,
                    timekeepingByHours: timekeepingByHours
                }
            })
        }

        return await Timesheet(connect(DB_CONNECTION, portal)).insertMany(data);
    }
}
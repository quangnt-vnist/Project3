const Models = require(`${SERVER_MODELS_DIR}`);
const { EmployeeKpiSet, OrganizationalUnit, Task, EmployeeKpi, User } = Models;
const mongoose = require("mongoose");
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);


/**
 * Lấy tất cả tập KPI hiện tại
 * @param {*} data 
 */

exports.getEmployeeKPISets = async (portal, data) => {
    let department = await OrganizationalUnit(connect(DB_CONNECTION, portal))
        .findOne({
            $or: [
                { 'deans': data.roleId },
                { 'viceDeans': data.roleId },
                { 'employees': data.roleId }
            ]
        });

    let keySearch;
    let employeeKpiSets;
    let startdate = null;
    let enddate = null;
    let status = null;
    let user = data.user ? data.user : [0];

    if (data.startDate) {
        startdate = new Date(data.startDate);
    }
    if (data.endDate) {
        enddate = new Date(data.endDate);
    }
    if (data.status) status = parseInt(data.status);

    if (department) {
        keySearch = {
            organizationalUnit: {
                $in: department._id
            }
        }
    }

    if (user[0] != '0') {
        keySearch = {
            ...keySearch,
            creator: {
                $in: user
            }
        }
    }
    if (status !== -1 && status && status !== 5 || status === 0) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status
            }
        }
    }
    if (startdate !== null && enddate !== null) {
        keySearch = {
            ...keySearch,
            date: { "$gte": startdate, "$lt": enddate }
        }
    }
    if (startdate !== null && enddate === null) {
        keySearch = {
            ...keySearch,
            date: {
                $gte: startdate,
            }
        }
    }
    if (enddate !== null && startdate === null) {
        keySearch = {
            ...keySearch,
            date: {
                $lt: enddate,
            }
        }
    }

    employeeKpiSets = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .find(keySearch)
        .skip(0).limit(12)
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ]);

    return employeeKpiSets;
}

/**
 * Lấy tất cả kpi theo tháng
 * @param {*} data.userId : id nhân viên
 * @param {*} data.date : tháng
 */

exports.getKpisByMonth = async (portal, data) => {
    let date = data.date.split("-");
    let month = new Date(date[1], date[0], 0);
    let employeeKpiSets = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ creator: data.userId, date: month })
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ]);
    return employeeKpiSets;
}

/**
 * Phê duyệt tất cả các kpi
 * @param {*} id id của kpi set
 */

exports.approveAllKpis = async (portal, id) => {
    let employee_kpi_set = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(id, { $set: { status: 2 } }, { new: true });
    let targets;
    if (employee_kpi_set.kpis) targets = employee_kpi_set.kpis;
    if (targets !== []) {
        targets = await Promise.all(targets.map(async (item) => {
            let defaultT = await EmployeeKpi(connect(DB_CONNECTION, portal))
                .findByIdAndUpdate(item._id, { $set: { status: 1 } }, { new: true })
            return defaultT;
        }))
    }
    employee_kpi_set = employee_kpi_set && await employee_kpi_set
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .execPopulate();
    return employee_kpi_set;
}

/**
 * Chỉnh sửa trạng thái cho mỗi kpi
 * @param {*} data.id: id của kpi con
 * @param {*} status: trạng thái
 */

exports.editStatusKpi = async (portal, data, query) => {

    let target = await EmployeeKpi(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(data.id, { $set: { status: query.status } }, { new: true });
    let employee_kpi_set = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ kpis: { $in: data.id } })
        .populate("kpis");
    let kpis = employee_kpi_set.kpis;
    let checkFullApprove = 2;

    await kpis.map(item => {
        if (!item.status) {

            if (parseInt(query.status) === 1) {
                checkFullApprove = 1;
            } else {
                checkFullApprove = 0;
            }
        }
        return true;
    })
    employee_kpi_set = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(employee_kpi_set._id, { $set: { status: checkFullApprove } }, { new: true })

    employee_kpi_set = employee_kpi_set && await employee_kpi_set
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .execPopulate();

    return employee_kpi_set;
}

/**
 * Chỉnh sửa thông tin kpi
 * @param {*} id id kpi con
 * @param {*} data thông tin chỉnh sửa
 */

exports.editKpi = async (portal, id, data) => {
    let objUpdate = {
        name: data.name,
        parent: data.parent,
        weight: data.weight,
        criteria: data.criteria
    }
    let target = await EmployeeKpi(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(id, { $set: objUpdate }, { new: true })

    target = target && await target.populate("parent").execPopulate();
    return target;
}

/**
 * Lấy kpi theo id của kpi set
 * @param {*} id id của kpi con
 */

exports.getKpisByKpiSetId = async (portal, id) => {
    let employee_kpi_set = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])

    return employee_kpi_set;
}

/**
 * Lấy tất cả công việc theo Id của kpi
 * @param {*} data 
 */
exports.getTasksByKpiId = async (portal, data) => {
    let task = await getResultTaskByMonth(portal, data);

    for (let i = 0; i < task.length; i++) {
        let date1 = await task[i].preEvaDate;
        let date2 = await task[i].date;
        let difference_In_Time = await date2.getTime() - date1.getTime();
        let daykpi = await Math.ceil(difference_In_Time / (1000 * 3600 * 24));

        if (daykpi > 30)
            daykpi = 30;
        task[i].taskImportanceLevelCal = await Math.round(3 * (task[i].priority / 3) + 3 * (task[i].results.contribution / 100) + 4 * (daykpi / 30));

        if (task[i].results.taskImportanceLevel === -1 || task[i].results.taskImportanceLevel === null)
            task[i].results.taskImportanceLevel = await task[i].taskImportanceLevelCal;
        task[i].daykpi = await daykpi;
    }
    return task;
}

/**
 * Chấm điểm độ quan trọng của công việc
 * @param {*} id id kpi con
 * @param {*} kpiType 
 * @param {*} data 
 */

exports.setTaskImportanceLevel = async (portal, id, kpiType, data) => {
    for (const element of data) {
        let setPoint = await updateTaskImportanceLevel(portal, element.taskId, element.employeeId, parseInt(element.point), element.date, element.role);
    };
    let key = {
        id: id,
        date: data[0].date,
        employeeId: data[0].employeeId,
        kpiType: kpiType
    }

    let task = await getResultTaskByMonth(portal, key);
    let autoPoint = 0;
    let approvePoint = 0;
    let employPoint = 0;
    let sumTaskImportance = 0;

    for (element of task) {
        autoPoint += element.results.automaticPoint * element.results.taskImportanceLevel;
        approvePoint += element.results.approvedPoint * element.results.taskImportanceLevel;
        employPoint += element.results.employeePoint * element.results.taskImportanceLevel;
        sumTaskImportance += element.results.taskImportanceLevel;

        let date1 = element.preEvaDate;
        let date2 = element.date;
        let difference_In_Time = date2.getTime() - date1.getTime();
        let daykpi = Math.ceil(difference_In_Time / (1000 * 3600 * 24));
        if (daykpi > 30) daykpi = 30;
        element.taskImportanceLevelCal = Math.round(3 * (element.priority / 3) + 3 * (element.results.contribution / 100) + 4 * (daykpi / 30));
        if (element.results.taskImportanceLevel === -1 || element.results.taskImportanceLevel === null)
            element.results.taskImportanceLevel = element.taskImportanceLevelCal;
        element.daykpi = daykpi;

    }
    let n = task.length;
    let result = await EmployeeKpi(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(
            id,
            {
                $set: {
                    "automaticPoint": Math.round(autoPoint / sumTaskImportance),
                    "employeePoint": Math.round(employPoint / sumTaskImportance),
                    "approvedPoint": Math.round(approvePoint / sumTaskImportance),
                },
            },
            { new: true }
        );

    let autoPointSet = 0;
    let employeePointSet = 0;
    let approvedPointSet = 0;
    let kpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal)).findOne({ kpis: result._id });
    for (let i = 0; i < kpiSet.kpis.length; i++) {
        let kpi = await EmployeeKpi(connect(DB_CONNECTION, portal)).findById(kpiSet.kpis[i]);
        if (kpi.automaticPoint !== 0 && kpi.automaticPoint !== null) {

            let weight = kpi.weight / 100;
            autoPointSet += kpi.automaticPoint * weight;
            employeePointSet += kpi.employeePoint * weight;
            approvedPointSet += kpi.approvedPoint * weight;
            console.log('hihihiii', kpi.automaticPoint, kpi.employeePoint, kpi.approvedPoint, weight);
        } else {
            autoPointSet = -1;
        }
    };
    console.log('hahahaaa', autoPointSet, employeePointSet, approvedPointSet);
    if (autoPointSet !== -1) {

        let updateKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
            .findByIdAndUpdate(kpiSet._id,
                {
                    $set: {
                        "automaticPoint": Math.round(autoPointSet),
                        "employeePoint": Math.round(employeePointSet),
                        "approvedPoint": Math.round(approvedPointSet),
                    },
                },
                { new: true }
            );

    }


    return { task, result };

}

async function updateTaskImportanceLevel(portal, taskId, employeeId, point, date, role) {
    var date = new Date(date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var task = await Task(connect(DB_CONNECTION, portal))
        .aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(taskId) }
            },
            {
                $unwind: "$evaluations"
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ name: "$name" }, { taskId: "$_id" }, { startDate: "$startDate" }, { endDate: "$endDate" }, { status: "$status" }, "$evaluations"] } }
            },
            { $addFields: { "month": { $month: '$date' }, "year": { $year: '$date' } } },
            { $match: { month: month } },
            { $match: { year: year } }
        ])
    if (task.length !== 0) {
        var setPoint = await Task(connect(DB_CONNECTION, portal))
            .findOneAndUpdate(
                {
                    "_id": taskId, "evaluations._id": task[0]._id
                },
                {
                    $set: { "evaluations.$.results.$[elem].taskImportanceLevel": point }
                },
                {
                    arrayFilters: [
                        {
                            "elem.employee": employeeId,
                            "elem.role": role
                        }
                    ]
                }
            );
    }
    return setPoint;
}

exports.getTasksByListKpis = async (portal, data) => {
    let listkpis = [], infosearch = [];
    for (let i = 0; i < data.length; i++) {

        let employee_kpi_set = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
            .findById(data[i])
            .populate("creator")
            .populate({ path: "kpis" })
        listkpis.push(employee_kpi_set);
    }

    for (let i = 0; i < listkpis.length; i++) {
        infosearch.push([]);
        let kpis = listkpis[i].kpis;
        for (let j = 0; j < kpis.length; j++) {
            infosearch[infosearch.length - 1].push({ id: kpis[j]._id, employeeId: listkpis[i].creator._id, date: listkpis[i].date, kpiType: kpis[j].type })
        }
    }

    let listTask = [], tasks;
    for (let i = 0; i < infosearch.length; i++) {
        listTask.push([]);
        for (let j = 0; j < infosearch[i].length; j++) {
            listTask[listTask.length - 1].push([]);
            tasks = await getResultTaskByMonth(portal, infosearch[i][j]);
            let lastIndex = listTask[listTask.length - 1].length - 1;
            listTask[listTask.length - 1][lastIndex] = tasks;
        }

    }
    return listTask;
}

async function getResultTaskByMonth(portal, data) {
    let date = new Date(data.date);
    let monthkpi = parseInt(date.getMonth() + 1);
    let yearkpi = parseInt(date.getFullYear());
    let kpiType;
    if (data.kpiType === "1") {
        kpiType = "accountable";
    } else if (data.kpiType === "2") {
        kpiType = "consulted";
    } else {
        kpiType = "responsible";
    }

    let conditions = [
        {
            $match: { "evaluations.results.kpis": mongoose.Types.ObjectId(data.id) }
        },
        {
            $unwind: "$evaluations"
        },
        {
            $lookup: {
                from: "organizationalunits",
                localField: "organizationalUnit",
                foreignField: "_id",
                as: "organizationalUnitDetail"
            }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ name: "$name" }, { startDate: "$startDate" }, { taskId: "$_id" }, { priority: "$priority" }, { endDate: "$endDate" }, { taskId: "$_id" }, { status: "$status" }, { unit: "$organizationalUnitDetail" }, "$evaluations"] } }
        },
        { $addFields: { "month": { $month: '$date' }, "year": { $year: '$date' } } },
        { $unwind: "$results" },
        { $match: { "results.role": kpiType } },
        { $match: { 'results.employee': mongoose.Types.ObjectId(data.employeeId) } },
        { $match: { "month": monthkpi } },
        { $match: { "year": yearkpi } },
    ]



    let task = await Task(connect(DB_CONNECTION, portal)).aggregate(conditions);
    for (let i = 0; i < task.length; i++) {
        let x = task[i];
        let date = await new Date(x.date);
        let startDate = await new Date(x.startDate);

        let month = await date.getMonth() + 1;
        let year = await date.getFullYear();
        let startMonth = await startDate.getMonth() + 1;

        if (month === startMonth) {
            task[i].preEvaDate = startDate;
        } else {
            let preEval = await Task(connect(DB_CONNECTION, portal))
                .aggregate([
                    {
                        $match: { "_id": mongoose.Types.ObjectId(x.taskId) },
                    },
                    {
                        $unwind: "$evaluations"
                    },
                    {
                        $replaceRoot: { newRoot: "$evaluations" }
                    },
                    { $addFields: { "month": { $month: '$date' }, "year": { $year: '$date' } } },
                    { $match: { "month": month - 1 } },
                    { $match: { "year": year } },
                ]);
            task[i].preEvaDate = await preEval[0].date;
        }
    }
    return task;
}

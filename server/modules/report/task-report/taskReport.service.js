const mongoose = require("mongoose");
const { TaskReport } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);


/**
 * Lấy ra danh sách các báo cáo công việc
 * @param  params 
 */
exports.getTaskReports = async (portal, params) => {
    const { name, creator, month, organizationalUnit } = params;
    let dateSearch, getMonth, year, startDate, endDate, keySearch = [];

    // search theo đơn vị
    if (organizationalUnit && organizationalUnit.length > 0) {
        keySearch = [
            ...keySearch,
            { $match: { organizationalUnit: { $in: [...organizationalUnit.map(o => mongoose.Types.ObjectId(o.toString()))] } } },
        ]
    }

    // search theo tháng
    if (month) {
        dateSearch = params.month.split('-');
        getMonth = dateSearch[1], year = dateSearch[0];
        startDate = new Date(year, getMonth - 1, 2);
        endDate = new Date(year, getMonth - 1, 32);
    }

    // Tìm kiếm theo tên báo cáo
    if (name && name.length !== 0) {
        keySearch = [
            ...keySearch,
            { $match: { name: { $regex: name, $options: "i" } } },
        ]
    }

    // Tìm kiếm theo người tạo
    if (creator && creator.length !== 0) {
        keySearch = [
            ...keySearch,
            {
                $lookup: {
                    from: "users",
                    localField: "creator",
                    foreignField: "_id",
                    as: "Users"
                }
            },
            {
                $match: { Users: { $elemMatch: { name: { $regex: creator, $options: "i" } } } },
            }
        ]
    }

    // Tìm kiếm theo tháng
    if (month && month.length !== 0) {
        keySearch = [
            ...keySearch,
            {
                $match: { createdAt: { $gte: startDate, $lte: endDate } }
            }
        ]
    };

    let countRecord = [
        ...keySearch,
        {
            $count: "totalReport"
        }
    ]
    // get tổng số bản ghi sau khi truy vấn tìm kiếm
    let totalList = await TaskReport(connect(DB_CONNECTION, portal)).aggregate(countRecord);

    keySearch = [
        ...keySearch,
        { $sort: { createdAt: -1 } },
        { $skip: parseInt(params.page) },
        { $limit: parseInt(params.limit) },
        {
            $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as: "creator"
            }
        },
        {
            $lookup: {
                from: "organizationalunits",
                localField: "organizationalUnit",
                foreignField: "_id",
                as: "organizationalUnit"
            }
        },
    ]

    totalList = parseInt(totalList.map(o => o.totalReport));

    let listTaskReport = await TaskReport(connect(DB_CONNECTION, portal)).aggregate(keySearch);
    return { totalList, listTaskReport };
}


/**
 * Lây 1 báo cáo 
 * @param {*} id id báo cáo
 */
exports.getTaskReportById = async (portal, id) => {
    let taskReportById = await TaskReport(connect(DB_CONNECTION, portal)).findById(id)
        .populate({ path: 'taskTemplate' })
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'responsibleEmployees', select: '_id name company' })
        .populate({ path: 'accountableEmployees', select: '_id name company' })
        .populate({ path: 'readByEmployees', select: '_id name company' })
        .populate({ path: 'organizationalUnit', select: 'deans viceDeans employees _id name company parent' })
        .populate({ path: 'readByEmployees' })
    return taskReportById;
}


/**
 * Tạo mới một báo cáo
 * @param {*} data dữ liệu caần tạo
 * @param {*} user id người tạo
 */
exports.createTaskReport = async (portal, data, user) => {
    let {
        organizationalUnit,
        taskTemplate,
        nameTaskReport,
        descriptionTaskReport,
        readByEmployees,
        responsibleEmployees,
        accountableEmployees,
        startDate,
        endDate,
        status,
        frequency,
        itemListBoxLeft,
        itemListBoxRight,
        taskInformations
    } = data;
    let startTime, start = null, endTime, end = null, configurations = [];

    if (status) {
        status = Number(status);
    }

    // convert startDate từ string qua Date
    if (data.startDate) {
        startTime = startDate.split("-");
        start = new Date(startTime[2], startTime[1] - 1, startTime[0]);
    }

    // convert endDate từ string sang Date
    if (endDate) {
        endTime = endDate.split("-");
        end = new Date(endTime[2], endTime[1] - 1, endTime[0]);
    }

    for (let [index, value] of taskInformations.entries()) {
        configurations[index] = {
            code: value.code,
            name: value.name,
            type: value.type,
            filter: value.filter,
            newName: value.newName,
            chartType: value.chartType,
            showInReport: value.showInReport,
            aggregationType: value.aggregationType,
            coefficient: value.coefficient,
        }
    }

    let newTaskReport = await TaskReport(connect(DB_CONNECTION, portal)).create({
        organizationalUnit: organizationalUnit,
        taskTemplate: taskTemplate,
        name: nameTaskReport,
        description: descriptionTaskReport,
        readByEmployees: readByEmployees,
        responsibleEmployees: responsibleEmployees,
        accountableEmployees: accountableEmployees,
        status: status,
        creator: user,
        startDate: start,
        endDate: end,
        frequency: frequency,
        configurations: configurations,
        listDataChart: itemListBoxLeft,
        dataForAxisXInChart: itemListBoxRight,

    })

    let getNewTaskReport = await TaskReport(connect(DB_CONNECTION, portal)).findById(newTaskReport._id).populate({ path: 'creator', select: "_id name" });
    return getNewTaskReport;
}


/**
 * Sửa 1 báo cáo
 * @param {*} id id của báo cáo cần sửa
 * @param {*} data dữ liệu cần sửa 
 * @param {*} người sửa 
 */
exports.editTaskReport = async (portal, id, data, user) => {
    let {
        organizationalUnit,
        taskTemplate,
        name,
        description,
        readByEmployees,
        responsibleEmployees,
        accountableEmployees,
        status,
        startDate,
        endDate,
        dataForAxisXInChart,
        frequency,
        listDataChart,
        taskInformations
    } = data;
    let startTime, start = null, endTime, end = null, configurations = [];

    if (status && status.length > 0) {
        status = parseInt(status.toString());
    }

    if (startDate) {
        // convert startDate từ string sang Date
        startTime = startDate.split("-");
        start = new Date(startTime[2], startTime[1] - 1, startTime[0]);
    }

    if (endDate) {
        // convert endDate từ string sang Date
        endTime = endDate.split("-");
        end = new Date(endTime[2], endTime[1] - 1, endTime[0]);
    }

    for (let [index, value] of taskInformations.entries()) {
        configurations[index] = {
            code: value.code,
            name: value.name,
            type: value.type,
            filter: value.filter,
            newName: value.newName,
            chartType: value.chartType,
            showInReport: value.showInReport,
            aggregationType: value.aggregationType,
            coefficient: value.coefficient,
        }
    }

    await TaskReport(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: {
            organizationalUnit: organizationalUnit,
            taskTemplate: taskTemplate,
            name: name,
            description: description,
            readByEmployees: readByEmployees,
            responsibleEmployees: responsibleEmployees,
            accountableEmployees: accountableEmployees,
            status: status,
            creator: user,
            startDate: start,
            endDate: end,
            frequency: frequency,
            configurations: configurations,
            listDataChart: listDataChart,
            dataForAxisXInChart: dataForAxisXInChart,
        }
    }, { new: true });
    return await TaskReport(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'taskTemplate' })
        .populate({ path: 'responsibleEmployees', select: '_id name company' })
        .populate({ path: 'accountableEmployees', select: '_id name company' })
        .populate({ path: 'readByEmployees', select: '_id name company' })
        .populate({ path: 'organizationalUnit', select: 'deans viceDeans employees _id name company parent' })
        .populate({ path: 'readByEmployees' });
}


/**
 * Xóa một báo cáo
 * @param {*} id báo cáo cần xóa
 */
exports.deleteTaskReport = async (portal, id) => {
    let deleteReport = await TaskReport(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return deleteReport;
}

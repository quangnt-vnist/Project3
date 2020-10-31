const mongoose = require("mongoose");
const moment = require("moment");
const nodemailer = require("nodemailer");

const { Task, TaskTemplate, OrganizationalUnit, User, Company, UserRole } = require(`${SERVER_MODELS_DIR}`);

const OrganizationalUnitService = require(`${SERVER_MODULES_DIR}/super-admin/organizational-unit/organizationalUnit.service`);
const overviewService = require(`${SERVER_MODULES_DIR}/kpi/employee/management/management.service`);

const { sendEmail } = require(`${SERVER_HELPERS_DIR}/emailHelper`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy tất cả các công việc
 */
exports.getAllTasks = async (portal) => {
    var tasks = await Task(connect(DB_CONNECTION, portal)).find();
    return tasks;
}

/**
 * Lấy tất cả công việc theo id mẫu công việc thỏa mãn điều kiện
 * @param {*} data 
 */
exports.getTaskEvaluations = async (portal, data) => {
    // Lấy data tu client gui trong body
    let {
        organizationalUnit,
        taskTemplate,
        status, startDate,
        endDate, frequency,
        responsibleEmployees,
        accountableEmployees
    } = data;

    let startTime, start, endTime, end, filterDate = {};
    status = Number(data.status);

    // Convert startDate từ string sang date
    startTime = startDate.split("-");
    start = new Date(startTime[2], startTime[1] - 1, startTime[0]);

    // Convert endDate từ string sang date
    endTime = endDate.split("-");
    end = new Date(endTime[2], endTime[1] - 1, endTime[0]);

    if (responsibleEmployees) {
        responsibleEmployees = data.responsibleEmployees;
    }

    if (accountableEmployees) {
        accountableEmployees = data.accountableEmployees;
    }

    if (status === 0) {
        status = '';
    } else if (status === 1) {
        status = "finished";
    } else if (status === 2) {
        status = "inprocess";
    }

    // Lọc nếu ngày bắt đầu và kết thức có giá trị
    if (startDate && endDate) {
        filterDate = {
            $match: {
                date: { $gte: start, $lte: end }
            }
        }
    }

    // Lọc nếu có ngày bắt đầu, không có ngày kết thúc 
    if (startDate && !endDate) {
        filterDate = {
            $match: {
                date: { $gte: start }
            }
        }
    }

    // Mặc định điều kiện lọc là : Đơn vị, mẫu công việc, thống kê đánh giá từ ngày
    let condition = [
        { $match: { organizationalUnit: mongoose.Types.ObjectId(organizationalUnit) } },
        { $match: { taskTemplate: mongoose.Types.ObjectId(taskTemplate) } },
        { $unwind: "$evaluations" },
        {
            $lookup: {
                from: "users",
                localField: "responsibleEmployees",
                foreignField: "_id",
                as: "responsibleEmployeesInfo"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "accountableEmployees",
                foreignField: "_id",
                as: "accountableEmployeesInfo"
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [{ name: "$name" }, { taskId: "$_id" }, { status: "$status" }, { responsibleEmployees: "$responsibleEmployeesInfo" },
                    { accountableEmployees: "$accountableEmployeesInfo" },
                    { startDate: "$startDate" }, { endDate: "$endDate" }, { priority: "$priority" }, "$evaluations"]
                }
            }
        },
        filterDate,

    ];

    // Lọc theo trạng thái công việc 'Tất cả', không có người phê duyệt và người thực hiện
    if (status === '' && !responsibleEmployees && !accountableEmployees) { // Lọc tất cả các coong việc không theo đặc thù
        condition = [
            ...condition,
        ]
    }

    // Lọc theo trạng thái công việc 'Tất cả', có người phê duyệt và người thực hiện
    else if (status === '' && responsibleEmployees && accountableEmployees) {
        condition = [
            ...condition,
            { $match: { responsibleEmployees: { $elemMatch: { _id: { $in: [...responsibleEmployees.map(x => mongoose.Types.ObjectId(x.toString()))] } } } } },
            { $match: { accountableEmployees: { $elemMatch: { _id: { $in: [...accountableEmployees.map(y => mongoose.Types.ObjectId(y.toString()))] } } } } },
        ]

    }

    // Lọc theo trạng thái công việc 'Tất cả', có người thực hiện
    else if (status === '' && responsibleEmployees) {
        condition = [
            ...condition,
            { $match: { responsibleEmployees: { $elemMatch: { _id: { $in: [...responsibleEmployees.map(x => mongoose.Types.ObjectId(x.toString()))] } } } } },
        ]
    }

    // Lọc theo trạng thái công việc 'Tất cả', có người phê duyệt
    else if (status === '' && accountableEmployees) {
        condition = [
            ...condition,
            { $match: { accountableEmployees: { $elemMatch: { _id: { $in: [...accountableEmployees.map(y => mongoose.Types.ObjectId(y.toString()))] } } } } },
        ]
    }

    // Lọc theo trạng thái công việc 'Hoàn thành hoặc đang thực hiện', không có người phê duyệt và người thực hiện
    else if (status !== '' && !responsibleEmployees && !accountableEmployees) {
        condition = [
            ...condition,
            { $match: { status: status } },
        ]
    }

    // Lọc theo trạng thái công việc 'Hoàn thành hoặc đang thực hiện', có người phê duyệt và người thực hiện
    else if (status !== '' && responsibleEmployees && accountableEmployees) {
        condition = [
            ...condition,
            { $match: { status: status } },
            { $match: { responsibleEmployees: { $elemMatch: { _id: { $in: [...responsibleEmployees.map(x => mongoose.Types.ObjectId(x.toString()))] } } } } },
            { $match: { accountableEmployees: { $elemMatch: { _id: { $in: [...accountableEmployees.map(y => mongoose.Types.ObjectId(y.toString()))] } } } } },
        ]
    }

    // Lọc theo trạng thái công việc 'Hoàn thành hoặc đang thực hiện', có người thực hiện.
    else if (status !== '' && responsibleEmployees) {
        condition = [
            ...condition,
            { $match: { status: status } },
            { $match: { responsibleEmployees: { $elemMatch: { _id: { $in: [...responsibleEmployees.map(x => mongoose.Types.ObjectId(x.toString()))] } } } } },
        ]
    }

    // Lọc theo trạng thái công việc 'Hoàn thành hoặc đang thực hiện', có người phê duyệt.
    else if (status !== '' && accountableEmployees) {
        condition = [
            ...condition,
            { $match: { status: status } },
            { $match: { accountableEmployees: { $elemMatch: { _id: { $in: [...accountableEmployees.map(y => mongoose.Types.ObjectId(y.toString()))] } } } } },
        ]
    }


    let result = await Task(connect(DB_CONNECTION, portal)).aggregate(condition); // kết quả sau khi truy vấn mongodb

    // lấy danh sachs điều kiện lọc của trường thông tin của công việc, vì dữ liệu gửi trong query là dạng string nên phải parse sang đối tượng
    let taskInformations = data.taskInformations, listDataChart = [], configurations = [];
    if (data.itemListBoxRight) {
        listDataChart = data.itemListBoxRight;
        listDataChart = listDataChart.map(item => JSON.parse(item));
    }

    taskInformations = taskInformations.map(item => JSON.parse(item));

    // Lấy các điều kiện lọc của các trường thông tin từ client gửi về.
    for (let [index, value] of taskInformations.entries()) { // tương tự for in. (for of sử dụng Array entries function get index)
        configurations[index] = {
            filter: value.filter,
            newName: value.newName,
            chartType: value.chartType,
            coefficient: value.coefficient,
            showInReport: value.showInReport,
            aggregationType: value.aggregationType,
        }
    }

    // Add thêm các trường điều kiện lọc vào result
    let newResult = result.map((item) => {
        let taskInformations = item.taskInformations;

        /**
         * Gộp trường taskInfomation của task vào array configurations
         * Mục đích để đính kèm các điều kiện lọc của các trường thông tin vào taskInfomation để tính toán
         */
        let taskMerge = taskInformations.map((item, index) => Object.assign({}, item, configurations[index]))
        taskMerge.map(item => {
            if (item.filter) {
                let replacer = new RegExp(item.code, 'g')
                item.filter = eval(item.filter.replace(replacer, item.value));
            } else {
                item.filter = true;
            }
            return item;
        })
        return { // Lấy các trường cần thiết
            _id: item._id,
            name: item.name,
            accountableEmployees: item.accountableEmployees,
            responsibleEmployees: item.responsibleEmployees,
            status: item.status,
            date: item.date,
            startDate: item.startDate,
            endDate: item.endDate,
            priority: item.priority,
            frequency: frequency,
            taskInformations: taskMerge,
            results: item.results,
            dataForAxisXInChart: listDataChart,
        };
    });


    newResult.map(o => {
        if (o.taskInformations.some(item => (item.filter === true))) {
            return o;
        } else {
            newResult = [];
        }
    })
    return newResult;
}


/**
 * Lấy mẫu công việc theo chức danh và người dùng
 * @id : id người dùng
 */
exports.getTasksCreatedByUser = async (portal, id) => {
    var tasks = await Task(connect(DB_CONNECTION, portal)).find({
        creator: id
    }).populate({ path: 'taskTemplate' }); // , model: TaskTemplate 
    return tasks;
}

/**
 * Lấy công việc thực hiện chính theo id người dùng
 * @task dữ liệu trong params
 */
exports.getPaginatedTasksThatUserHasResponsibleRole = async (portal, task) => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime } = task;

    var responsibleTasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        responsibleEmployees: {
            $in: [user]
        },
        isArchived: false
    };

    if (organizationalUnit) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit,
            }
        };
    }

    if (status) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    if (priority) {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    if (special) {
        for (var i = 0; i < special.length; i++) {
            if (special[i] === "Lưu trong kho") {
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else {
                keySearch = {
                    ...keySearch,
                    endDate: { $gte: new Date() }
                };
            }
        }
    }

    if (name) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    if (JSON.parse(aPeriodOfTime)) {
        keySearch = {
            ...keySearch,
            $or: [
                { 'endDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { 'startDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lt: new Date(startDate) } }] }
            ]
        }
    } else {
        if (startDate) {
            let startTime = startDate.split("-");
            let start = new Date(startTime[1], startTime[0] - 1, 1);
            let end = new Date(startTime[1], startTime[0], 1);

            keySearch = {
                ...keySearch,
                startDate: {
                    $gt: start,
                    $lte: end
                }
            }
        }
        if (endDate) {
            let endTime = endDate.split("-");
            let start = new Date(endTime[1], endTime[0] - 1, 1);
            let end = new Date(endTime[1], endTime[0], 1);

            keySearch = {
                ...keySearch,
                endDate: {
                    $gt: start,
                    $lte: end
                }
            }
        }
    }

    if (startDateAfter) {
        let startTimeAfter = startDateAfter.split("-");
        let start;


        if (startTimeAfter[0] > 12) start = new Date(startTimeAfter[0], startTimeAfter[1] - 1, 1);
        else start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);

        keySearch = {
            ...keySearch,
            endDate: {
                $gte: start
            }
        }
    }

    if (endDateBefore) {
        let endTimeBefore = endDateBefore.split("-");
        let end;
        if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
        else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $lt: end
            }
        }
    }

    responsibleTasks = await Task(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent responsibleEmployees" });

    var totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);

    return {
        "tasks": responsibleTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc phê duyệt theo id người dùng
 * @task dữ liệu từ params
 */
exports.getPaginatedTasksThatUserHasAccountableRole = async (portal, task) => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime } = task;

    var accountableTasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        accountableEmployees: {
            $in: [user]
        },
        isArchived: false
    };

    if (organizationalUnit) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit,
            }
        };
    }

    if (status) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    if (priority) {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    if (special) {
        for (var i = 0; i < special.length; i++) {
            if (special[i] === "Lưu trong kho") {
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else {
                keySearch = {
                    ...keySearch,
                    endDate: { $gte: new Date() }
                };
            }
        }
    }

    if (name) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    if (JSON.parse(aPeriodOfTime)) {

        keySearch = {
            ...keySearch,
            $or: [
                { 'endDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { 'startDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lte: new Date(startDate) } }] }
            ]
        }
    } else {
        if (startDate) {
            let startTime = startDate.split("-");
            let start = new Date(startTime[1], startTime[0] - 1, 1);
            let end = new Date(startTime[1], startTime[0], 1);

            keySearch = {
                ...keySearch,
                startDate: {
                    $gt: start,
                    $lte: end
                }
            }
        }

        if (endDate) {
            let endTime = endDate.split("-");
            let start = new Date(endTime[1], endTime[0] - 1, 1);
            let end = new Date(endTime[1], endTime[0], 1);

            keySearch = {
                ...keySearch,
                endDate: {
                    $gt: start,
                    $lte: end
                }
            }
        }
    }
    if (startDateAfter) {
        let startTimeAfter = startDateAfter.split("-");
        let start;


        if (startTimeAfter[0] > 12) start = new Date(startTimeAfter[0], startTimeAfter[1] - 1, 1);
        else start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);

        keySearch = {
            ...keySearch,
            endDate: {
                $gte: start
            }
        }
    }

    if (endDateBefore) {
        let endTimeBefore = endDateBefore.split("-");
        let end;
        if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
        else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $lt: end
            }
        }
    }
    accountableTasks = await Task(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": accountableTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc tư vấn theo id người dùng
 */
exports.getPaginatedTasksThatUserHasConsultedRole = async (portal, task) => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime } = task;

    var consultedTasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        consultedEmployees: {
            $in: [user]
        },
        isArchived: false
    };

    if (organizationalUnit) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit,
            }
        };
    }

    if (status) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    if (priority) {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    if (special) {
        for (var i = 0; i < special.length; i++) {
            if (special[i] === "Lưu trong kho") {
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else {
                keySearch = {
                    ...keySearch,
                    endDate: { $gte: new Date() }
                };
            }
        }
    }

    if (name) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    if (JSON.parse(aPeriodOfTime)) {

        keySearch = {
            ...keySearch,
            $or: [
                { 'endDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { 'startDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lte: new Date(startDate) } }] }
            ]
        }
    } else {
        if (startDate) {
            let startTime = startDate.split("-");
            let start = new Date(startTime[1], startTime[0] - 1, 1);
            let end = new Date(startTime[1], startTime[0], 1);

            keySearch = {
                ...keySearch,
                startDate: {
                    $gt: start,
                    $lte: end
                }
            }
        }

        if (endDate) {
            let endTime = endDate.split("-");
            let start = new Date(endTime[1], endTime[0] - 1, 1);
            let end = new Date(endTime[1], endTime[0], 1);

            keySearch = {
                ...keySearch,
                endDate: {
                    $gt: start,
                    $lte: end
                }
            }
        }
    }
    if (startDateAfter) {
        let startTimeAfter = startDateAfter.split("-");
        let start;


        if (startTimeAfter[0] > 12) start = new Date(startTimeAfter[0], startTimeAfter[1] - 1, 1);
        else start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);

        keySearch = {
            ...keySearch,
            endDate: {
                $gte: start
            }
        }
    }

    if (endDateBefore) {
        let endTimeBefore = endDateBefore.split("-");
        let end;
        if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
        else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $lt: end
            }
        }
    }
    consultedTasks = await Task(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": consultedTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc thiết lập theo id người dùng
 */
exports.getPaginatedTasksCreatedByUser = async (portal, task) => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, aPeriodOfTime } = task;

    var creatorTasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        creator: {
            $in: [user]
        },
        isArchived: false
    };

    if (organizationalUnit) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit,
            }
        };
    }

    if (status) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    if (priority) {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    if (special) {
        for (var i = 0; i < special.length; i++) {
            if (special[i] === "Lưu trong kho") {
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else {
                keySearch = {
                    ...keySearch,
                    endDate: { $gte: new Date() }
                };
            }
        }
    }

    if (name) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    if (JSON.parse(aPeriodOfTime)) {

        keySearch = {
            ...keySearch,
            $or: [
                { 'endDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { 'startDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lte: new Date(startDate) } }] }
            ]
        }
    } else {
        if (startDate) {
            let startTime = startDate.split("-");
            let start = new Date(startTime[1], startTime[0] - 1, 1);
            let end = new Date(startTime[1], startTime[0], 1);

            keySearch = {
                ...keySearch,
                startDate: {
                    $gt: start,
                    $lte: end
                }
            }
        }

        if (endDate) {
            let endTime = endDate.split("-");
            let start = new Date(endTime[1], endTime[0] - 1, 1);
            let end = new Date(endTime[1], endTime[0], 1);

            keySearch = {
                ...keySearch,
                endDate: {
                    $gt: start,
                    $lte: end
                }
            }
        }
    }

    creatorTasks = await Task(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": creatorTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc quan sát theo id người dùng
 */
exports.getPaginatedTasksThatUserHasInformedRole = async (portal, task) => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime } = task;

    var informedTasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        informedEmployees: {
            $in: [user]
        },
        isArchived: false
    };

    if (organizationalUnit) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit,
            }
        };
    }

    if (status) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    if (priority) {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    if (special) {
        for (var i = 0; i < special.length; i++) {
            if (special[i] === "Lưu trong kho") {
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else {
                keySearch = {
                    ...keySearch,
                    endDate: { $gte: new Date() }
                };
            }
        }
    }

    if (name) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    if (JSON.parse(aPeriodOfTime)) {

        keySearch = {
            ...keySearch,
            $or: [
                { 'endDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { 'startDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lte: new Date(startDate) } }] }
            ]
        }
    } else {
        if (startDate) {
            let startTime = startDate.split("-");
            let start = new Date(startTime[1], startTime[0] - 1, 1);
            let end = new Date(startTime[1], startTime[0], 1);

            keySearch = {
                ...keySearch,
                startDate: {
                    $gt: start,
                    $lte: end
                }
            }
        }

        if (endDate) {
            let endTime = endDate.split("-");
            let start = new Date(endTime[1], endTime[0] - 1, 1);
            let end = new Date(endTime[1], endTime[0], 1);

            keySearch = {
                ...keySearch,
                endDate: {
                    $gt: start,
                    $lte: end
                }
            }
        }
    }
    if (startDateAfter) {
        let startTimeAfter = startDateAfter.split("-");
        let start;


        if (startTimeAfter[0] > 12) start = new Date(startTimeAfter[0], startTimeAfter[1] - 1, 1);
        else start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);

        keySearch = {
            ...keySearch,
            endDate: {
                $gte: start
            }
        }
    }

    if (endDateBefore) {
        let endTimeBefore = endDateBefore.split("-");
        let end;
        if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
        else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $lt: end
            }
        }
    }
    informedTasks = await Task(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage)
        .populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": informedTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc quan sát theo id người dùng
 */
exports.getPaginatedTasksByUser = async (portal, task, type = "paginated_task_by_user") => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime } = task;

    var tasks;
    var perPage = Number(perPage);
    var page = Number(number);
    var keySearch;
    if (type === "paginated_task_by_user") {
        keySearch = {
            $or: [
                { informedEmployees: { $in: [user] } },
                { creator: { $in: [user] } },
                { responsibleEmployees: { $in: [user] } },
                { consultedEmployees: { $in: [user] } },
                { accountableEmployees: { $in: [user] } },
            ],
            isArchived: false
        };
    }
    else if (type === "paginated_task_by_unit") {
        keySearch = {
            isArchived: false
        };
    }

    if (organizationalUnit) {
        if (type === "paginated_task_by_unit") {
            keySearch = {
                ...keySearch,
                $or: [
                    { organizationalUnit: { $in: [organizationalUnit] } },
                    { collaboratedWithOrganizationalUnits: { $in: [organizationalUnit] } },
                ],
            };
        } else {
            keySearch = {
                ...keySearch,
                organizationalUnit: {
                    $in: organizationalUnit,
                }
            };
        }
    }

    if (status) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    if (priority) {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    if (special) {
        for (var i = 0; i < special.length; i++) {
            if (special[i] === "Lưu trong kho") {
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else {
                keySearch = {
                    ...keySearch,
                    endDate: { $gte: new Date() }
                };
            }
        }
    }

    if (name) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    if (JSON.parse(aPeriodOfTime)) {

        keySearch = {
            ...keySearch,
            $or: [
                { 'endDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { 'startDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lte: new Date(startDate) } }] }
            ]
        }
    } else {
        if (startDate) {
            let startTime = startDate.split("-");
            let start = new Date(startTime[1], startTime[0] - 1, 1);
            let end = new Date(startTime[1], startTime[0], 1);

            keySearch = {
                ...keySearch,
                startDate: {
                    $gt: start,
                    $lte: end
                }
            }
        }

        if (endDate) {
            let endTime = endDate.split("-");
            let start = new Date(endTime[1], endTime[0] - 1, 1);
            let end = new Date(endTime[1], endTime[0], 1);

            keySearch = {
                ...keySearch,
                endDate: {
                    $gt: start,
                    $lte: end
                }
            }
        }
    }
    if (startDateAfter) {
        let startTimeAfter = startDateAfter.split("-");
        let start;


        if (startTimeAfter[0] > 12) start = new Date(startTimeAfter[0], startTimeAfter[1] - 1, 1);
        else start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);

        keySearch = {
            ...keySearch,
            endDate: {
                $gte: start
            }
        }
    }

    if (endDateBefore) {
        let endTimeBefore = endDateBefore.split("-");
        let end;
        if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
        else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $lt: end
            }
        }
    }
    tasks = await Task(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage)
        .populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": tasks,
        "totalPage": totalPages
    };
}

/** Tìm kiếm đơn vị theo 1 roleId */
exports.getPaginatedTasksByOrganizationalUnit = async (portal, task, type) => {
    let organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({
        $or: [
            { 'deans': task.roleId },
            { 'viceDeans': task.roleId },
            { 'employees': task.roleId }
        ]
    });

    task.organizationalUnit = organizationalUnit._id;
    return await this.getPaginatedTasksByUser(portal, task, type);
}

/**
 * Lấy công việc theo id đơn vị
 * @task dữ liệu từ params
 */
exports.getAllTaskOfOrganizationalUnitByMonth = async (portal, task) => {
    var { organizationalUnitId, startDateAfter, endDateBefore } = task;
    var organizationUnitTasks;
    var keySearch = {};

    if (organizationalUnitId) {
        // if (organizationalUnitId !== '[]') {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnitId,
            }
        };
    }

    if (startDateAfter) {
        let startTimeAfter = startDateAfter.split("-");
        let start;


        if (startTimeAfter[0] > 12) start = new Date(startTimeAfter[0], startTimeAfter[1] - 1, 1);
        else start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);

        keySearch = {
            ...keySearch,
            endDate: {
                $gte: start
            }
        }
    }

    if (endDateBefore) {
        let endTimeBefore = endDateBefore.split("-");
        let end;
        if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
        else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $lt: end
            }
        }
    }
    organizationUnitTasks = await Task(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'asc' })
        .populate({ path: "organizationalUnit creator parent responsibleEmployees" });

    return {
        "tasks": organizationUnitTasks
    };
}

/**
 * Gửi email khi tạo mới công việc
 * @param {*} portal id công ty
 * @param {*} task công việc vừa tạo
 */
exports.sendEmailForCreateTask = async (portal, task) => {
    task = await task.populate("organizationalUnit creator parent").execPopulate();

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });

    var email, userId, user, users, userIds
    var deansOfOrganizationalUnitThatHasCollaboratedId = [], deansOfOrganizationalUnitThatHasCollaborated, collaboratedHtml, collaboratedEmail;

    var resId = task.responsibleEmployees;  // lấy id người thực hiện
    var res = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: resId } });
    // res = res.map(item => item.name);
    userIds = resId;
    var accId = task.accountableEmployees;  // lấy id người phê duyệt
    var acc = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: accId } });
    userIds.push(...accId);

    var conId = task.consultedEmployees;  // lấy id người tư vấn
    var con = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: conId } })
    userIds.push(...conId);

    var infId = task.informedEmployees;  // lấy id người quan sát
    var inf = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: infId } })
    userIds.push(...infId);  // lấy ra id của tất cả người dùng có nhiệm vụ

    // loại bỏ các id trùng nhau
    userIds = userIds.map(u => u.toString());
    for (let i = 0, max = userIds.length; i < max; i++) {
        if (userIds.indexOf(userIds[i]) != userIds.lastIndexOf(userIds[i])) {
            userIds.splice(userIds.indexOf(userIds[i]), 1);
            i--;
        }
    }

    // Lấy id trưởng phòng các đơn vị phối hợp
    for (let i = 0; i < task.collaboratedWithOrganizationalUnits.length; i++) {
        let unit = await OrganizationalUnit(connect(DB_CONNECTION, portal))
            .findById(task.collaboratedWithOrganizationalUnits[i])

        unit && unit.deans.map(item => {
            deansOfOrganizationalUnitThatHasCollaboratedId.push(item);
        })
    }

    deansOfOrganizationalUnitThatHasCollaborated = await UserRole(connect(DB_CONNECTION, portal))
        .find({
            roleId: { $in: deansOfOrganizationalUnitThatHasCollaboratedId }
        })
        .populate("userId")
    user = await User(connect(DB_CONNECTION, portal)).find({
        _id: { $in: userIds }
    })

    email = user.map(item => item.email); // Lấy ra tất cả email của người dùng
    collaboratedEmail = deansOfOrganizationalUnitThatHasCollaborated.map(item => item.userId && item.userId.email) // Lấy email trưởng đơn vị phối hợp 
    email.push("trinhhong102@gmail.com");

    var body = `<a href="${process.env.WEBSITE}/task?taskId=${task._id}" target="_blank"><strong>${task.name}</strong></a></p> ` +
        `<h3>Nội dung công việc</h3>` +
        // `<p>Tên công việc : <strong>${task.name}</strong></p>` +
        `<p>Mô tả : ${task.description}</p>` +
        `<p>Người thực hiện</p> ` +
        `<ul>${res.map((item) => {
            return `<li>${item.name} - ${item.email}</li>`
        })}
                    </ul>`+
        `<p>Người phê duyệt</p> ` +
        `<ul>${acc.map((item) => {
            return `<li>${item.name} - ${item.email}</li>`
        })}
                    </ul>` +
        `${con.length > 0 ? `<p>Người tư vấn</p> ` +
            `<ul>${con.map((item) => {
                return `<li>${item.name} - ${item.email}</li>`
            })}
                    </ul>` : ""}` +
        `${inf.length > 0 ? `<p>Người quan sát</p> ` +
            `<ul>${inf.map((item) => {
                return `<li>${item.name} - ${item.email}</li>`
            })}
                    </ul>` : ""}`
        ;
    var html = `<p>Bạn có công việc mới: ` + body;
    collaboratedHtml = `<p>Đơn vị bạn được phối hợp thực hiện công việc mới: ` + body;

    return {
        task: task,
        user: userIds, email: email, html: html,
        deansOfOrganizationalUnitThatHasCollaborated: deansOfOrganizationalUnitThatHasCollaborated.map(item => item.userId && item.userId._id),
        collaboratedEmail: collaboratedEmail, collaboratedHtml: collaboratedHtml
    };
}

/**
 * Tạo công việc mới
 */
exports.createTask = async (portal, task) => {
    // Lấy thông tin công việc cha
    var level = 1;
    if (mongoose.Types.ObjectId.isValid(task.parent)) {
        var parent = await Task(connect(DB_CONNECTION, portal)).findById(task.parent);
        if (parent) level = parent.level + 1;
    }

    // convert thời gian từ string sang date
    var splitter = task.startDate.split("-");
    var startDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    splitter = task.endDate.split("-");
    var endDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);

    let taskTemplate, cloneActions = [];
    if (task.taskTemplate !== "") {
        taskTemplate = await TaskTemplate(connect(DB_CONNECTION, portal)).findById(task.taskTemplate);
        var taskActions = taskTemplate.taskActions;

        for (let i in taskActions) {
            cloneActions[i] = {
                mandatory: taskActions[i].mandatory,
                name: taskActions[i].name,
                description: taskActions[i].description,
            }
        }
    }

    let formula;
    if (taskTemplate) {
        formula = taskTemplate.formula;
    } else if (task.formula) {
        // formula = "progress / (dayUsed / totalDay)"; // default
        formula = "progress / (dayUsed / totalDay) - 0.5 * (10 - (averageActionRating)) * 10"
    }

    var task = await Task(connect(DB_CONNECTION, portal)).create({ //Tạo dữ liệu mẫu công việc
        organizationalUnit: task.organizationalUnit,
        collaboratedWithOrganizationalUnits: task.collaboratedWithOrganizationalUnits,
        creator: task.creator, //id của người tạo
        name: task.name,
        description: task.description,
        startDate: startDate,
        endDate: endDate,
        priority: task.priority,
        formula: formula,
        taskTemplate: taskTemplate ? taskTemplate : null,
        taskInformations: taskTemplate ? taskTemplate.taskInformations : [],
        taskActions: taskTemplate ? cloneActions : [],
        parent: (task.parent === "") ? null : task.parent,
        level: level,
        responsibleEmployees: task.responsibleEmployees,
        accountableEmployees: task.accountableEmployees,
        consultedEmployees: task.consultedEmployees,
        informedEmployees: task.informedEmployees,
        confirmedByEmployees: task.responsibleEmployees.concat(task.accountableEmployees).concat(task.consultedEmployees).includes(task.creator) ? task.creator : []
    });

    if (task.taskTemplate !== null) {
        await TaskTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
            task.taskTemplate, { $inc: { 'numberOfUse': 1 } }, { new: true }
        );
    }

    let mail = await this.sendEmailForCreateTask(portal, task);

    return {
        task: task,
        user: mail.user, email: mail.email, html: mail.html,
        deansOfOrganizationalUnitThatHasCollaborated: mail.deansOfOrganizationalUnitThatHasCollaborated,
        collaboratedEmail: mail.collaboratedEmail, collaboratedHtml: mail.collaboratedHtml
    };
}

/**
 * Xóa công việc
 */
exports.deleteTask = async (portal, id) => {
    //req.params.id
    let tasks = await Task(connect(DB_CONNECTION, portal)).findById(id);
    if (tasks.taskTemplate !== null) {
        await TaskTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
            tasks.taskTemplate, { $inc: { 'numberOfUse': -1 } }, { new: true }
        );
    }

    var task = await Task(connect(DB_CONNECTION, portal)).findByIdAndDelete(id); // xóa mẫu công việc theo id
    return task;
}

/**
 * get subtask
 */
exports.getSubTask = async (portal, taskId) => {
    var task = await Task(connect(DB_CONNECTION, portal)).find({
        parent: taskId
    }).sort("createdAt")

    return task;
}

/**
 * get task by user
 * @param {*} data 
 */

exports.getTasksByUser = async (portal, data) => {
    var tasks = [];
    if (data.data == "user") {
        tasks = await Task(connect(DB_CONNECTION, portal)).find({
            $or: [
                { responsibleEmployees: data.userId },
                { accountableEmployees: data.userId },
                { consultedEmployees: data.userId },
                { informedEmployees: data.userId }
            ],
            status: "inprocess"
        })
    }

    if (data.data == "organizationUnit") {
        for (let i in data.organizationUnitId) {
            var organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({ _id: data.organizationUnitId[i] })
            var test = await Task(connect(DB_CONNECTION, portal)).find(
                { organizationalUnit: organizationalUnit._id, status: "inprocess" },
            )

            for (let j in test) {
                tasks.push(test[j]);
            }
        }
    }



    var nowdate = new Date();
    var tasksexpire = [], deadlineincoming = [], test;
    for (let i in tasks) {
        var olddate = new Date(tasks[i].endDate);
        test = nowdate - olddate;
        if (test < 0) {
            test = olddate - nowdate;
            var totalDays = Math.round(test / 1000 / 60 / 60 / 24);
            if (totalDays <= 7) {
                var tasktest = {
                    task: tasks[i],
                    totalDays: totalDays
                }
                deadlineincoming.push(tasktest);
            }
        } else {
            var totalDays = Math.round(test / 1000 / 60 / 60 / 24);
            var tasktest = {
                task: tasks[i],
                totalDays: totalDays
            }
            tasksexpire.push(tasktest)
        }
    }
    let tasksbyuser = {
        expire: tasksexpire,
        deadlineincoming: deadlineincoming,
    }
    return tasksbyuser;
}

/**
 * Lấy tất cả task của organizationalUnit theo tháng 
 * @param {*} organizationalUnitId 
 * @param {*} month 
 */
exports.getAllTaskOfOrganizationalUnit = async (portal, roleId, organizationalUnitId, month) => {
    let organizationalUnit, tasksOfOrganizationalUnit;
    let now, currentYear, currentMonth, endOfCurrentMonth, endOfLastMonth;

    if (month) {
        now = new Date(month);
        currentYear = now.getFullYear();
        currentMonth = now.getMonth();
        endOfCurrentMonth = new Date(currentYear, currentMonth + 1);
        endOfLastMonth = new Date(currentYear, currentMonth);
    } else {
        now = new Date();
        currentYear = now.getFullYear();
        currentMonth = now.getMonth();
        endOfCurrentMonth = new Date(currentYear, currentMonth + 1);
        endOfLastMonth = new Date(currentYear, currentMonth);
    }

    if (!organizationalUnitId) {
        organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({
            $or: [
                { 'deans': roleId },
                { 'viceDeans': roleId },
                { 'employees': roleId }
            ]
        });
    } else {
        organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({ '_id': organizationalUnitId });
    }

    if (organizationalUnit) {
        tasksOfOrganizationalUnit = await Task(connect(DB_CONNECTION, portal)).aggregate([
            { $match: { 'organizationalUnit': organizationalUnit._id } },
            {
                $match: {
                    $or: [
                        { 'endDate': { $lte: endOfCurrentMonth, $gt: endOfLastMonth } },
                        { 'startDate': { $lte: endOfCurrentMonth, $gt: endOfLastMonth } },
                        { $and: [{ 'endDate': { $gte: endOfCurrentMonth } }, { 'startDate': { $lte: endOfLastMonth } }] }
                    ]
                }
            },

            { $unwind: "$evaluations" },
            {
                $match: {
                    $or: [
                        { 'evaluations.date': undefined },
                        { 'evaluations.date': { $lte: endOfCurrentMonth, $gt: endOfLastMonth } }
                    ]
                }
            },

            {
                $lookup: {
                    from: "organizationalunits",
                    localField: "organizationalUnit",
                    foreignField: "_id",
                    as: "detailOrganizationalUnit"
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "responsibleEmployees",
                    foreignField: "_id",
                    as: "responsibleEmployeesInfo"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "accountableEmployees",
                    foreignField: "_id",
                    as: "accountableEmployeesInfo"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "consultedEmployees",
                    foreignField: "_id",
                    as: "consultedEmployeesInfo"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "informedEmployees",
                    foreignField: "_id",
                    as: "informedEmployeesInfo"
                }
            },

            {
                $project: {
                    'name': 1,
                    'detailOrganizationalUnit.name': 1,
                    'description': 1,
                    'startDate': 1,
                    'endDate': 1,
                    'priority': 1,
                    'evaluations': 1,

                    'responsibleEmployees': 1,
                    'accountableEmployees': 1,
                    'consultedEmployees': 1,
                    'informedEmployees': 1,

                    'responsibleEmployeesInfo._id': 1,
                    'responsibleEmployeesInfo.name': 1,
                    'responsibleEmployeesInfo.email': 1,

                    'accountableEmployeesInfo._id': 1,
                    'accountableEmployeesInfo.name': 1,
                    'accountableEmployeesInfo.email': 1,

                    'consultedEmployeesInfo._id': 1,
                    'consultedEmployeesInfo.name': 1,
                    'consultedEmployeesInfo.email': 1,

                    'informedEmployeesInfo._id': 1,
                    'informedEmployeesInfo.name': 1,
                    'informedEmployeesInfo.email': 1,
                    'status': 1
                }
            }
        ])
    }

    return tasksOfOrganizationalUnit;
}

/**
 * Lấy tất cả task của các đơn vị con của đơn vị hiện tại 
 * @param {*} organizationalUnitId 
 * @param {*} month 
 */
exports.getAllTaskOfChildrenOrganizationalUnit = async (portal, companyId, roleId, month, organizationalUnitId) => {

    let tasksOfChildrenOrganizationalUnit = [], childrenOrganizationalUnits;

    childrenOrganizationalUnits = await overviewService.getAllChildrenOrganizational(portal, companyId, roleId, organizationalUnitId);

    if (childrenOrganizationalUnits) {
        for (let i = 0; i < childrenOrganizationalUnits.length; i++) {
            tasksOfChildrenOrganizationalUnit.push(await this.getAllTaskOfOrganizationalUnit(portal, roleId, childrenOrganizationalUnits[i].id, month));
            tasksOfChildrenOrganizationalUnit[i].unshift({ 'name': childrenOrganizationalUnits[i].name, 'deg': childrenOrganizationalUnits[i].deg })
        }
    }

    return tasksOfChildrenOrganizationalUnit;
}

exports.sendEmailCheckTaskLastMonth = async () => {
    let company = await Company(connect(DB_CONNECTION, process.env.DB_NAME)).find({});
    company = company.map(x => x._id);
    let consultedTasks = [], informedTasks = [], responsibleTasks = [], accountedTasks = [];
    let taskExpire = [], taskDeadlinecoming = [];
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();
    for (let i in company) {
        let portal = company.shortName;
        let user = await User(connect(DB_CONNECTION, portal)).find({ company: company[i] });  // lay ra tat ca nguoi dung trong tung cong ty
        let userId = user.map(x => x._id);
        let email = user.map(x => x.email);

        for (let j in userId) {
            let flag = false;
            let tasks = {
                data: "user",
                userId: userId[j]
            };
            let tasksByUser = await this.getTasksByUser(portal, tasks); // laay ra tat ca cong viec cua nguoi dung
            tasks = {
                organizationalUnit: [],
                number: 1,
                perPage: 1000,
                status: [],
                priority: [],
                special: [],
                name: null,
                startDate: null,
                endDate: null,
                startDateAfter: null,
                endDateBefore: null,
                aPeriodOfTime: false,
                user: userId[j]
            }

            informedTasks = await this.getPaginatedTasksThatUserHasInformedRole(portal, tasks);
            // informedTasks = await Task(connect(DB_CONNECTION, portal)).find({informedEmployees: userId[j] , isArchived: false}).populate({ path: "organizationalUnit creator parent" });
            consultedTasks = await this.getPaginatedTasksThatUserHasConsultedRole(portal, tasks);
            responsibleTasks = await this.getPaginatedTasksThatUserHasResponsibleRole(portal, tasks);
            accountedTasks = await this.getPaginatedTasksThatUserHasAccountableRole(portal, tasks);

            // xu ly voi moi nguoi dung
            let infTasks = informedTasks && informedTasks.tasks;
            let accTasks = accountedTasks && accountedTasks.tasks;
            let resTasks = responsibleTasks && responsibleTasks.tasks;
            let conTasks = consultedTasks && consultedTasks.tasks;
            let allTasks = [], notLinkedTasks = [], taskList;

            // xu ly task not link
            if (accTasks && resTasks && infTasks && conTasks) {
                taskList = allTasks.concat(accTasks, resTasks, conTasks, infTasks);
            }
            if (taskList) {
                let inprocessTask = taskList.filter(task => task.status === "inprocess");

                let distinctTasks = [];
                for (let k in inprocessTask) {     // lọc task trùng nhau
                    let check = false;
                    for (let z in distinctTasks) {

                        if (JSON.stringify(inprocessTask[k]._id) === JSON.stringify(distinctTasks[z]._id)) {
                            check = true
                            break;
                        }
                    }
                    if (!check) distinctTasks.push(inprocessTask[k])
                }

                distinctTasks.length && distinctTasks.map(x => {
                    let evaluations;
                    let currentEvaluate = [];

                    evaluations = x.evaluations.length && x.evaluations;
                    if (evaluations) {
                        for (let i in evaluations) {
                            let month = evaluations[i].date.slice(5, 7);
                            let year = evaluations[i].date.slice(0, 4);

                            if (month == currentMonth && year == currentYear) {
                                currentEvaluate.push(evaluations[i]);
                            }
                        }
                    }

                    if (currentEvaluate.length === 0) {
                        notLinkedTasks.push(x);
                        flag = true;
                    } else {
                        let break1 = false;
                        let add = true;
                        if (currentEvaluate.length !== 0) {
                            for (let i in currentEvaluate) {
                                if (currentEvaluate[i].results.length !== 0) {
                                    for (let j in currentEvaluate[i].results) {
                                        let res = currentEvaluate[i].results[j];
                                        if (res.employee === userId[j]) {
                                            add = false;
                                            if (res.kpis.length === 0) {
                                                notLinkedTasks.push(x);
                                                break1 = true
                                            }
                                        };
                                        if (break1) break;
                                    }
                                    if (break1) break;
                                    if (add) {
                                        notLinkedTasks.push(x);
                                        flag = true;
                                    }
                                }
                            }
                        }
                    }
                })
            }


            // xu ly Action not evaluated
            var TaskHasActionsAccountable = [];
            var TaskHasActionsResponsible = [];

            if (accTasks) {
                let inprocessAccountableTask = accTasks.filter(task => task.status === "inprocess")
                inprocessAccountableTask.length && inprocessAccountableTask.map(x => {
                    let taskActions;

                    taskActions = x.taskActions.length && x.taskActions;
                    if (taskActions.length !== 0) {
                        for (let i in taskActions) {
                            let month = taskActions[i].createdAt;
                            let year = taskActions[i].createdAt;
                            month = JSON.stringify(month);
                            year = JSON.stringify(year);
                            month = Number(month.slice(6, 8));
                            year = Number(year.slice(1, 5));
                            if (month === currentMonth && year === currentYear) {
                                if (taskActions[i].rating == -1) {
                                    TaskHasActionsAccountable.push(x);
                                    flag = true;
                                    break;
                                }
                            }
                        }
                    }

                })
            }
            if (resTasks) {
                let inprocessResponsibleTasks = resTasks.filter(task => task.status === "inprocess")
                inprocessResponsibleTasks.length && inprocessResponsibleTasks.map(x => {
                    let taskActions;

                    taskActions = x.taskActions.length && x.taskActions;
                    if (taskActions.length !== 0) {
                        for (let i in taskActions) {
                            let month = taskActions[i].createdAt;
                            let year = taskActions[i].createdAt;
                            month = JSON.stringify(month);
                            year = JSON.stringify(year);
                            month = Number(month.slice(6, 8));
                            year = Number(year.slice(1, 5));
                            if (month == currentMonth && year == currentYear) {
                                if (taskActions[i].rating == -1) {
                                    TaskHasActionsResponsible.push(x);
                                    flag = true;
                                    break;
                                }
                            }
                        }
                    }

                })
            }
            let taskHasActions = [];
            taskHasActions = taskHasActions.concat(TaskHasActionsAccountable, TaskHasActionsResponsible);
            if (tasksByUser.expire.length !== 0) {
                flag = true;
            }
            if (tasksByUser.deadlineincoming.length !== 0) {
                flag = true;
            }
            if (flag) {  // gui email
                let userEmail = [email[j]];
                userEmail.push("trinhhong102@gmail.com");
                let html = `<h1>Thông báo danh sách công việc tháng ${new Date().getMonth() + 1} </h1> ` +
                    `<h3>Thông tin công việc</h3>` +
                    `${tasksByUser.expire.length > 0 ? `<p>Công việc quá hạn</p> ` +
                        `<ul>${tasksByUser.expire.map((item) => {
                            return `<li><a href="${process.env.WEBSITE}/task?taskId=${item.task._id}" target="_blank">${item.task.name}</a></li>`
                        })}
                                </ul>` : ''}` +
                    `${tasksByUser.deadlineincoming.length > 0 ? `<p>Công việc sắp hết hạn</p> ` +
                        `<ul>${tasksByUser.deadlineincoming.map((item) => {
                            return `<li><a href="${process.env.WEBSITE}/task?taskId=${item.task._id}" target="_blank">${item.task.name}</a></li>`
                        })}
                                </ul>` : ""}` +
                    `${notLinkedTasks.length > 0 ? `<p>Công việc chưa được liên kết KPI tháng</p> ` +
                        `<ul>${notLinkedTasks.map((item) => {
                            return `<li><a href="${process.env.WEBSITE}/task?taskId=${item._id}" target="_blank">${item.name}</a></li>`
                        })}
                                </ul>` : ""}` +
                    `${taskHasActions.length > 0 ? `<p>Công việc có hoạt động chưa đánh giá</p> ` +
                        `<ul>${taskHasActions.map((item) => {
                            return `<li><a href="${process.env.WEBSITE}/task?taskId=${item._id}" target="_blank">${item.name}</a></li>`
                        })}
                                </ul>` : ""}`
                    ;
                sendEmail(userEmail, "Thông báo danh sách công việc", '', html);
            }
        }
    }
    // }
}
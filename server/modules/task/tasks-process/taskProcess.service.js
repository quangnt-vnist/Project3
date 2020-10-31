const { TaskProcess, ProcessTemplate, Privilege, Role, Task, UserRole, User, OrganizationalUnit } = require(`${SERVER_MODELS_DIR}`);

const TaskService = require(`${SERVER_MODULES_DIR}/task/task-management/task.service`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');

/**
 * Lấy tất cả xml diagram
 * @param {Object} query tham số query gửi đến
 */
exports.getAllXmlDiagram = async (portal, query) => {
    let userId = query.userId;
    let name = query.name;
    let pageNumber = query.pageNumber;
    let noResultsPerPage = query.noResultsPerPage;
    let roles = await UserRole(connect(DB_CONNECTION, portal)).find({ userId: userId }).populate({ path: "roleId" });
    let newRoles = roles.map(role => role.roleId);

    // lấy tất cả các role con của role người dùng có
    let allRole = [];
    newRoles.map(item => {
        allRole = allRole.concat(item._id); //thêm id role hiện tại vào 1 mảng
        allRole = allRole.concat(item.parents); //thêm các role children vào mảng
    })
    let taskProcesses = [];
    let roleId = allRole.map(function (el) { return mongoose.Types.ObjectId(el) });

    var taskProcess = await ProcessTemplate(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { processName: { "$regex": name, "$options": "i" } } },
        {
            $lookup:
            {
                from: "privileges",
                let: { id: "$_id" },
                pipeline: [
                    {
                        $match:
                        {
                            $and: [
                                {
                                    $expr: {
                                        $eq: ["$resourceId", "$$id"]
                                    }
                                },
                                {
                                    roleId: { $in: roleId }
                                }
                            ]
                        }
                    }
                ],
                as: "privileges"
            }
        },
        // { $unwind: "$privileges" },
        {
            $facet: {
                processes: [{ $sort: { 'createdAt': 1 } },
                ...noResultsPerPage === 0 ? [] : [{ $limit: noResultsPerPage * pageNumber }],
                ...noResultsPerPage === 0 ? [] : [{ $skip: noResultsPerPage * (pageNumber - 1) }]
                ],
                totalCount: [
                    {
                        $count: 'count'
                    }
                ]
            }
        }
    ])

    taskProcesses = taskProcess[0].processes;

    await ProcessTemplate(connect(DB_CONNECTION, portal)).populate(taskProcesses, { path: 'creator', select: 'name' });
    await ProcessTemplate(connect(DB_CONNECTION, portal)).populate(taskProcesses, { path: 'manager', select: 'name' });
    await ProcessTemplate(connect(DB_CONNECTION, portal)).populate(taskProcesses, { path: 'viewer', select: 'name' });
    await ProcessTemplate(connect(DB_CONNECTION, portal)).populate(taskProcesses, { path: "tasks.organizationalUnit" });
    await ProcessTemplate(connect(DB_CONNECTION, portal)).populate(taskProcesses, { path: "tasks.responsibleEmployees tasks.accountableEmployees tasks.consultedEmployees tasks.informedEmployees tasks.confirmedByEmployees tasks.creator", select: "name email _id" });

    let totalCount = 0;
    if (JSON.stringify(taskProcesses) !== JSON.stringify([])) {
        totalCount = taskProcess[0].totalCount[0].count;
    }

    let totalPages = Math.ceil(totalCount / noResultsPerPage);

    return { data: taskProcesses, pageTotal: totalPages };
}

/**
 * Lấy diagram theo id
 * @param {*} params 
 */
exports.getXmlDiagramById = (portal, params) => {
    let data = ProcessTemplate(connect(DB_CONNECTION, portal)).findById(params.diagramId);
    return data
}

/**
 * Tạo mới 1 xml diagram
 * @param {*} body dữ liệu diagram cần tạo
 */
exports.createXmlDiagram = async (portal, body) => {
    let info = [];
    for (const x in body.info) {
        // if (Object.keys(body.info[x]).length > 4) {
        body.info[x].taskActions = (body.info[x].taskActions) ? body.info[x].taskActions.map(item => {
            return {
                name: item.name,
                description: item.description,
                mandatory: item.mandatory,
            }
        }) : [];
        body.info[x].taskInformations = (body.info[x].taskInformations) ? body.info[x].taskInformations.map((item, key) => {
            return {
                code: "p" + parseInt(key + 1),
                name: item.name,
                description: item.description,
                filledByAccountableEmployeesOnly: item.filledByAccountableEmployeesOnly,
                type: item.type,
                extra: item.extra,
            }
        }) : [];
        if (body.info[x].formula === '') {
            body.info[x].formula = "progress / (dayUsed / totalDay) - 0.5 * (10 - (averageActionRating)) * 10"
        }
        info.push(body.info[x])
        // }
    }
    console.log(info)
    let data = await ProcessTemplate(connect(DB_CONNECTION, portal)).create({
        xmlDiagram: body.xmlDiagram,
        processName: body.processName,
        processDescription: body.processDescription,
        manager: body.manager,
        viewer: body.viewer,
        tasks: info,
        creator: body.creator,
    })


    let read = body.viewer;
    let roleId = [];
    let role, roleParent;

    role = await Role(connect(DB_CONNECTION, portal)).find({ _id: { $in: read } });
    roleParent = role.map(item => item.parents);   // lấy ra các parent của các role

    let flag;
    let reads = role.map(item => item._id);     // lấy ra danh sách role có quyền xem ( thứ tự cùng với roleParent)

    for (let n in reads) {
        flag = 0;
        let parent = [];
        parent = parent.concat(roleParent[n]);
        for (let i in parent) {
            for (let j in reads) {
                if (JSON.stringify(reads[j]) === JSON.stringify(parent[i])) {  // nếu 1 role là kế thừa của role có sẵn quyền xem thì loại role đấy đi 
                    reads[n] = "";                                              // loại role
                    flag = 1;
                    roleId.push(reads[j]);                                    // thêm vào danh sách role có quyền xem
                }
            }
        }
        if (flag === 0) roleId.push(reads[n]);    // role này không là role cha của role khác => thêm vào danh sách role có quyền xem
    }

    // xử lý các role trùng lặp
    roleId = roleId.map(u => u.toString());
    for (let i = 0, max = roleId.length; i < max; i++) {
        if (roleId.indexOf(roleId[i]) != roleId.lastIndexOf(roleId[i])) {
            roleId.splice(roleId.indexOf(roleId[i]), 1);
            i--;
        }
    }
    for (let i in roleId) {
        await Privilege(connect(DB_CONNECTION, portal)).create({
            roleId: roleId[i], //id của người cấp quyền xem
            resourceId: data._id,
            resourceType: "ProcessTemplate",
            // action: [] //quyền READ
        });
    }

    data = await ProcessTemplate(connect(DB_CONNECTION, portal)).findById(data._id).populate([
        { path: 'creator', select: 'name email' },
        { path: 'manager', select: 'name email' },
        { path: 'viewer', select: 'name email' },
        { path: "tasks.organizationalUnit", },
        { path: "tasks.responsibleEmployees tasks.accountableEmployees tasks.consultedEmployees tasks.informedEmployees tasks.confirmedByEmployees tasks.creator", select: "name email _id" },
    ]);
    return data;
}


/**
 * Chỉnh sửa quy trình công việc
 * @param {*} params 
 * @param {*} body dữ liệu gửi vào body từ client
 */
exports.editXmlDiagram = async (portal, params, body) => {
    let info = [];
    for (let x in body.info) {
        if (Object.keys(body.info[x]).length > 4) {
            body.info[x].taskActions = (body.info[x].taskActions) ? body.info[x].taskActions.map(item => {
                return {
                    name: item.name,
                    description: item.description,
                    mandatory: item.mandatory,
                }
            }) : [];
            body.info[x].taskInformations = (body.info[x].taskInformations) ? body.info[x].taskInformations.map((item, key) => {
                return {
                    code: "p" + parseInt(key + 1),
                    name: item.name,
                    description: item.description,
                    filledByAccountableEmployeesOnly: item.filledByAccountableEmployeesOnly,
                    type: item.type,
                    extra: item.extra,
                }
            }) : [];

            info.push(body.info[x])
        }
    }
    let data = await ProcessTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(params.diagramId,
        {
            $set: {
                xmlDiagram: body.xmlDiagram,
                tasks: info,
                processDescription: body.processDescription,
                processName: body.processName,
                creator: body.creator,
                viewer: body.viewer,
                manager: body.manager,
            }
        }
    )

    let queryData = {
        userId: body.userId,
        name: body.name,
        pageNumber: body.pageNumber,
        noResultsPerPage: body.noResultsPerPage,
    }
    let data1 = await this.getAllXmlDiagram(portal, queryData);
    // let data1 = await ProcessTemplate(connect(DB_CONNECTION, portal)).find().populate({ path: 'creator', select: 'name' });
    return data1;
}

/**
 * Xóa diagram theo id { data: taskProcesses, pageTotal: totalPages };
 * @param {ObjectId} diagramId 
 */
exports.deleteXmlDiagram = async (portal, diagramId, query) => {
    await ProcessTemplate(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: diagramId,
    });
    await Privilege(connect(DB_CONNECTION, portal)).findOneAndDelete({ resourceId: diagramId, resourceType: "ProcessTemplate" })

    let queryData = {
        userId: query.userId,
        name: query.name,
        // pageNumber : query.pageNumber,
        pageNumber: 1,
        noResultsPerPage: query.noResultsPerPage,
    }

    let data = await this.getAllXmlDiagram(portal, queryData);
    return data;
}


isStartTask = (task) => {
    let preTask = task.preceedingTasks;
    for (let i in preTask) {
        let type = preTask[i].task.split("_");
        if (type[0] === "Event") {
            return true;
        }
    }
    return false;
}

/**
 * tạo công việc theo quy trình
 * @param {String} processId Id của quy trình
 * @param {Object} body dữ liệu từ body
 */
exports.createTaskByProcess = async (portal, processId, body) => {
    let data = body.taskList;
    let level;

    let splitter = body.startDate.split("-");
    let startDateProcess = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    splitter = body.endDate.split("-");
    let endDateProcess = new Date(splitter[2], splitter[1] - 1, splitter[0]);

    let newTaskProcess = await TaskProcess(connect(DB_CONNECTION, portal)).create({
        processTemplate: processId,
        xmlDiagram: body.xmlDiagram,
        processName: body.processName,
        processDescription: body.processDescription,
        startDate: startDateProcess,
        endDate: endDateProcess,
        creator: body.creator,
        viewer: body.viewer,
        manager: body.manager,
    })

    let listTask = [];
    let mailInfoArr = [];
    let taskProcessId = newTaskProcess._id;

    for (let i in data) {
        let taskInformations, taskActions, cloneActions = [];

        let splitter = data[i].startDate.split("-");
        let startDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        splitter = data[i].endDate.split("-");
        let endDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);

        // if (data[i].taskTemplate !== "") {
        taskInformations = data[i].taskInformations;
        taskActions = data[i].taskActions;

        for (let i in taskActions) {
            cloneActions[i] = {
                mandatory: taskActions[i].mandatory,
                name: taskActions[i].name,
                description: taskActions[i].description,
            }
        }
        // }

        let status = "wait_for_approval";
        if (isStartTask(data[i])) {
            status = "inprocess";
        }

        let formula = data[i].formula;
        if (data[i].formula === '') {
            formula = "progress / (dayUsed / totalDay) - 0.5 * (10 - (averageActionRating)) * 10";
        }

        let process = taskProcessId;
        let newTaskItem = await Task(connect(DB_CONNECTION, portal)).create({
            process: process,
            codeInProcess: data[i].code,
            numberOfDaysTaken: data[i].numberOfDaysTaken,
            organizationalUnit: data[i].organizationalUnit,
            // creator: data[i].creator, //id của người tạo
            creator: body.creator, //id của người tạo
            name: data[i].name,
            description: data[i].description,
            startDate: startDate,
            endDate: endDate,
            formula: formula,
            priority: data[i].priority,
            taskTemplate: null,
            taskInformations: taskInformations,
            taskActions: cloneActions,
            parent: null,
            level: 1,
            status: status,
            responsibleEmployees: data[i].responsibleEmployees,
            accountableEmployees: data[i].accountableEmployees,
            consultedEmployees: data[i].consultedEmployees,
            informedEmployees: data[i].informedEmployees,
            confirmedByEmployees: data[i].responsibleEmployees.concat(data[i].accountableEmployees).concat(data[i].consultedEmployees).includes(data[i].creator) ? data[i].creator : []
        });

        let x = await TaskService.sendEmailForCreateTask(portal, newTaskItem);

        mailInfoArr.push(x);
        listTask.push(newTaskItem._id);
    }

    for (let x in data) {
        let listFollowingTask = [];
        let listPreceedingTask = [];
        for (let i in data[x].followingTasks) {
            let item = await Task(connect(DB_CONNECTION, portal)).findOne({ process: taskProcessId, codeInProcess: data[x].followingTasks[i].task });

            if (item) {
                if (item.status === "inprocess") {
                    listFollowingTask.push({
                        task: item._id,
                        link: data[x].followingTasks[i].link,
                        activated: true,
                    })
                }
                else {
                    listFollowingTask.push({
                        task: item._id,
                        link: data[x].followingTasks[i].link,
                    })
                }

            }
        }
        for (let i in data[x].preceedingTasks) {
            let item = await Task(connect(DB_CONNECTION, portal)).findOne({ process: taskProcessId, codeInProcess: data[x].preceedingTasks[i].task });

            if (item) {
                listPreceedingTask.push({
                    task: item._id,
                    link: data[x].preceedingTasks[i].link,
                })
            }

        }

        await Task(connect(DB_CONNECTION, portal)).findOneAndUpdate(
            { process: taskProcessId, codeInProcess: data[x].code },
            {
                $set: {
                    followingTasks: listFollowingTask,
                    preceedingTasks: listPreceedingTask,
                }
            },
            { new: true }
        )
    }
    await ProcessTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(processId, { $inc: { 'numberOfUse': 1 } }, { new: true });

    await TaskProcess(connect(DB_CONNECTION, portal)).findByIdAndUpdate(taskProcessId, { $set: { tasks: listTask } }, { new: true });

    let myProcess = await ProcessTemplate(connect(DB_CONNECTION, portal)).find().populate([
        { path: 'creator', select: 'name' },
        { path: 'viewer', select: 'name' },
        { path: 'manager', select: 'name' },
    ]);;

    return { process: myProcess, mailInfo: mailInfoArr }
}

/**
 * lấy tất cả các quy trình công việc được tạo
 * @param {Object} query Dữ liệu query
 */
exports.getAllTaskProcess = async (portal, query) => {
    // let { name, noResultsPerPage, pageNumber } = query;
    let name = query.name;
    let noResultsPerPage = parseInt(query.noResultsPerPage);
    let pageNumber = parseInt(query.pageNumber);
    let userId = query.userId;

    let data = await TaskProcess(connect(DB_CONNECTION, portal)).find({
        processName: { $regex: name, $options: 'i' },
        $or: [
            { viewer: { $in: [userId] } },
            { manager: { $in: [userId] } },
        ]
    }).skip(noResultsPerPage * (pageNumber - 1)).limit(noResultsPerPage)
        .populate([
            { path: 'creator', select: 'name' },
            // { path: 'viewer', select: 'name' },
            { path: 'manager', select: 'name' },
            {
                path: 'tasks', populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id" },
                    { path: "evaluations.results.employee", select: "name email _id" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", select: 'name email avatar' },
                    { path: "taskActions.comments.creator", select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                    { path: "taskComments.creator", select: 'name email avatar' },
                    { path: "taskComments.comments.creator", select: 'name email avatar' },
                    { path: "documents.creator", select: 'name email avatar' },
                    { path: "process" },
                ]
            },
            { path: 'processTemplate', select: 'processName' },
        ]);


    let totalCount = await TaskProcess(connect(DB_CONNECTION, portal)).countDocuments({
        processName: { $regex: name, $options: 'i' },
        $or: [
            { viewer: { $in: [userId] } },
            { manager: { $in: [userId] } },
        ]
    });
    let totalPages = Math.ceil(totalCount / noResultsPerPage);
    return {
        data: data,
        pageTotal: totalPages
    }
}


/**
 * Cập nhật diagram
 * @param {String} params tham số 
 * @param {Object} body dữ liệu body
 */
exports.updateDiagram = async (portal, params, body) => {
    let diagram = await TaskProcess(connect(DB_CONNECTION, portal)).findByIdAndUpdate(params.processId,
        { $set: { xmlDiagram: body.diagram } },
        { new: true }
    )
    let data = await TaskProcess(connect(DB_CONNECTION, portal)).find({
        processName: { $regex: name, $options: 'i' },
        $or: [
            { viewer: { $in: [userId] } },
            { manager: { $in: [userId] } },
        ]
    }).skip(0).limit(5)
        .populate([
            { path: 'creator', select: 'name' },
            // { path: 'viewer', select: 'name' },
            { path: 'manager', select: 'name' },
            {
                path: 'tasks', populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id" },
                    { path: "evaluations.results.employee", select: "name email _id" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", select: 'name email avatar' },
                    { path: "taskActions.comments.creator", select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                    { path: "taskComments.creator", select: 'name email avatar' },
                    { path: "taskComments.comments.creator", select: 'name email avatar' },
                    { path: "documents.creator", select: 'name email avatar' },
                    { path: "process" },
                ]
            },
            { path: 'processTemplate', select: 'processName' },
        ]);


    let totalCount = await TaskProcess(connect(DB_CONNECTION, portal)).countDocuments({
        processName: { $regex: name, $options: 'i' },
        $or: [
            { viewer: { $in: [userId] } },
            { manager: { $in: [userId] } },
        ]
    });
    let totalPages = Math.ceil(totalCount / 5);
    return {
        data: data,
        pageTotal: totalPages
    }
}
/**
 * Cập nhật thông tin quy trình công việc
 * @param {String} params tham số 
 * @param {Object} body dữ liệu body
 */
exports.editProcessInfo = async (portal, params, body) => {
    let { processName, processDescription, status, startDate, endDate, viewer } = body;

    let splitterStartDate = startDate.split('-');
    let start = new Date(splitterStartDate[2], splitterStartDate[1] - 1, splitterStartDate[0]);
    let splitterEndDate = endDate.split('-');
    let end = new Date(splitterEndDate[2], splitterEndDate[1] - 1, splitterEndDate[0]);

    let diagram = await TaskProcess(connect(DB_CONNECTION, portal)).findByIdAndUpdate(params.processId,
        {
            $set: {
                processName: processName,
                processDescription: processDescription,
                status: status,
                startDate: start,
                endDate: end,
                viewer: viewer,
            }
        },
        { new: true }
    )
    let newProcess = await TaskProcess(connect(DB_CONNECTION, portal)).findById(params.processId)
        .populate([
            { path: 'creator', select: 'name' },
            // { path: 'viewer', select: 'name' },
            { path: 'manager', select: 'name' },
            {
                path: 'tasks', populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id" },
                    { path: "evaluations.results.employee", select: "name email _id" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", select: 'name email avatar' },
                    { path: "taskActions.comments.creator", select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                    { path: "taskComments.creator", select: 'name email avatar' },
                    { path: "taskComments.comments.creator", select: 'name email avatar' },
                    { path: "documents.creator", select: 'name email avatar' },
                    { path: "process" },
                ]
            },
            { path: 'processTemplate', select: 'processName' },
        ]);
    return newProcess
}

/**
 * import file excel mẫu quy trình
 * @param {String} portal tên công ty
 * @param {Object} data dữ liệu import
 * @param {String} idUser id của người import
 */
exports.importProcessTemplate = async (portal, data, idUser) => {
    let results = [];

    for (let i in data) {

        // xử lý dữ liệu người quản lý
        let listManager = [];
        for (let x in data[i].manager) {
            let managerItem = await Role(connect(DB_CONNECTION, portal)).findOne({ name: data[i].manager[x] });
            if (managerItem) {
                listManager = [...listManager, managerItem._id];
            }
        }
        data[i].manager = listManager;

        // xử lý dữ liệu người được xem
        let listViewer = [];
        for (let x in data[i].viewer) {
            let viewerItem = await Role(connect(DB_CONNECTION, portal)).findOne({ name: data[i].viewer[x] });
            if (viewerItem) {
                listViewer = [...listViewer, viewerItem._id];
            }
        }
        data[i].viewer = listViewer;
        data[i]["creator"] = idUser;

        // xử lý dữ liệu công việc
        for (let k in data[i].tasks) {
            data[i].tasks[k]["creator"] = idUser;
            // chuyen dia chi email sang id
            for (let j = 0; j < data[i].tasks[k].accountableEmployees.length; j++) {
                let accountableEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ name: data[i].tasks[k].accountableEmployees[j] });
                if (accountableEmployees) {
                    data[i].tasks[k].accountableEmployees[j] = accountableEmployees._id;
                } else {
                    accountableEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ email: data[i].tasks[k].accountableEmployees[j] });
                    if (accountableEmployees) {
                        data[i].tasks[k].accountableEmployees[j] = accountableEmployees._id;
                    } else {
                        data[i].tasks[k].accountableEmployees[j] = null;
                    }

                }
            };
            for (let j = 0; j < data[i].tasks[k].consultedEmployees.length; j++) {
                let consultedEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ name: data[i].tasks[k].consultedEmployees[j] });
                if (consultedEmployees) {
                    data[i].tasks[k].consultedEmployees[j] = consultedEmployees._id;
                } else {
                    consultedEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ email: data[i].tasks[k].consultedEmployees[j] });
                    if (consultedEmployees) {
                        data[i].tasks[k].consultedEmployees[j] = consultedEmployees._id;
                    } else {
                        data[i].tasks[k].consultedEmployees[j] = null;
                    }

                }
            };
            for (let j = 0; j < data[i].tasks[k].informedEmployees.length; j++) {
                let informedEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ name: data[i].tasks[k].informedEmployees[j] });
                if (informedEmployees) {
                    data[i].tasks[k].informedEmployees[j] = informedEmployees._id;
                } else {
                    informedEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ email: data[i].tasks[k].informedEmployees[j] });
                    if (informedEmployees) {
                        data[i].tasks[k].informedEmployees[j] = informedEmployees._id;
                    } else {
                        data[i].tasks[k].informedEmployees[j] = null;
                    }

                }
            };
            for (let j = 0; j < data[i].tasks[k].responsibleEmployees.length; j++) {
                let responsibleEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ name: data[i].tasks[k].responsibleEmployees[j] });
                if (responsibleEmployees) {
                    data[i].tasks[k].responsibleEmployees[j] = responsibleEmployees._id;
                } else {
                    responsibleEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ email: data[i].tasks[k].responsibleEmployees[j] });
                    if (responsibleEmployees) {
                        data[i].tasks[k].responsibleEmployees[j] = responsibleEmployees._id;
                    } else {
                        data[i].tasks[k].responsibleEmployees[j] = null;
                    }
                }
            };

            // xu ly thong tin filledByAccountableEmployeesOnly 
            for (let j = 0; j < data[i].tasks[k].taskInformations.length; j++) {
                if (data[i].tasks[k].taskInformations[j][0][0]) {
                    let elm = {};
                    // format thong tin "chi qua ly duoc dien"
                    elm["filledByAccountableEmployeesOnly"] = String(data[i].tasks[k].taskInformations[j][0][3]);
                    // formart thong tin kieu du lieu
                    elm["type"] = data[i].tasks[k].taskInformations[j][0][2].toLowerCase();
                    elm["name"] = data[i].tasks[k].taskInformations[j][0][0];
                    elm["description"] = data[i].tasks[k].taskInformations[j][0][1];
                    elm["extra"] = "";

                    data[i].tasks[k].taskInformations[j] = elm;
                } else {
                    // if (!data[i].tasks[k].taskInformations[j][0][0]) {
                    //     data[i].tasks[k].taskInformations = [];
                    //     break;
                    // }
                    data[i].tasks[k].taskInformations.splice(j, 1);
                    j--;
                }
            }

            console.log('data[i].tasks[k].taskActions', data[i].tasks[k].taskActions);
            for (let j = 0; j < data[i].tasks[k].taskActions.length; j++) {
                if (data[i].tasks[k].taskActions[j][0][0]) {
                    let elm = {};
                    if (data[i].tasks[k].taskActions[j][0][2] === "Bắt buộc" || data[i].tasks[k].taskActions[j][0][2] === "true") {
                        elm["mandatory"] = true;
                    } else {
                        elm["mandatory"] = false;
                    }
                    elm["name"] = data[i].tasks[k].taskActions[j][0][0];
                    elm["description"] = data[i].tasks[k].taskActions[j][0][1];

                    data[i].tasks[k].taskActions[j] = elm;
                } else {
                    // if (!data[i].tasks[k].taskActions[j][0][0]) {
                    //     data[i].tasks[k].taskActions = [];
                    //     break;
                    // }
                    data[i].tasks[k].taskActions.splice(j, 1);
                    j--;
                }
            }

            // xử lý đơn vị công việc
            let unit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({ name: data[i].tasks[k].organizationalUnit });
            data[i].tasks[k].organizationalUnit = String(unit._id);
        }


        // gán cho biến tên là body để tái sử dụng hàm createXmlDiagram
        let body = {};
        body.xmlDiagram = data[i].xmlDiagram;
        body.processName = data[i].processName;
        body.processDescription = data[i].processDescription
        body.manager = data[i].manager;
        body.viewer = data[i].viewer;
        body.info = data[i].tasks;
        body.creator = data[i].creator;

        // thêm mới process
        let processItem = await this.createXmlDiagram(portal, body);
        results = [...results, processItem];
    }
    return results;
}
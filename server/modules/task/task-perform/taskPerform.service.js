const mongoose = require("mongoose");
const fs = require('fs');
const moment = require("moment");
const nodemailer = require("nodemailer");

const { Task, User, UserRole, Role } = require(`${SERVER_MODELS_DIR}`);

const OrganizationalUnitService = require(`${SERVER_MODULES_DIR}/super-admin/organizational-unit/organizationalUnit.service`);

const { sendEmail } = require(`${SERVER_HELPERS_DIR}/emailHelper`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);
/**
 * Lấy mẫu công việc theo Id
 */
exports.getTaskById = async (portal, id, userId) => {
    //req.params.id
    var superTask = await Task(connect(DB_CONNECTION, portal)).findById(id)
        .populate({ path: "organizationalUnit responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator parent" })
        .populate("evaluations.results.employee")
        .populate("evaluations.results.organizationalUnit")
        .populate("evaluations.results.kpis.kpis")

    var task = await Task(connect(DB_CONNECTION, portal)).findById(id).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit" },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
        { path: "evaluations.results.employee", select: "name email _id active" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", select: 'name email avatar' },
        { path: "taskActions.comments.creator", select: 'name email avatar' },
        { path: "commentsInProcess.creator", select: 'name email avatar' },
        { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
        { path: "taskComments.creator", select: 'name email avatar' },
        { path: "taskComments.comments.creator", select: 'name email avatar' },
        { path: "documents.creator", select: 'name email avatar' },
        { path: "followingTasks.task" },
        {
            path: "preceedingTasks.task", populate: [
                { path: "commentsInProcess.creator", select: 'name email avatar' },
                { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
            ]
        },
        { path: "hoursSpentOnTask.contributions.employee", select: 'name' },
        {
            path: "process", populate: {
                path: "tasks", populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit" },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
                    { path: "evaluations.results.employee", select: "name email _id active" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", select: 'name email avatar' },
                    { path: "taskActions.comments.creator", select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                    { path: "taskComments.creator", select: 'name email avatar' },
                    { path: "taskComments.comments.creator", select: 'name email avatar' },
                    { path: "documents.creator", select: 'name email avatar' },
                    { path: "process" },
                    { path: "commentsInProcess.creator", select: 'name email avatar' },
                    { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                ]
            }
        },
    ])
    if (!task) {
        return {
            "info": true
        }
    }
    var responsibleEmployees, accountableEmployees, consultedEmployees, informedEmployees;
    responsibleEmployees = task.responsibleEmployees;
    accountableEmployees = task.accountableEmployees;
    consultedEmployees = task.consultedEmployees;
    informedEmployees = task.informedEmployees;
    let flag = 0;
    for (let n in responsibleEmployees) {
        if (responsibleEmployees[n]._id.equals(userId)) {
            flag = 1;
            break;
        }
    }
    if (!flag) {
        for (let n in accountableEmployees) {
            if (accountableEmployees[n]._id.equals(userId)) {
                flag = 1;
                break;
            }
        }
    }
    if (!flag) {
        for (let n in consultedEmployees) {
            if (consultedEmployees[n]._id.equals(userId)) {
                flag = 1;
                break;
            }
        }
    }
    if (!flag) {
        for (let n in informedEmployees) {
            if (informedEmployees[n]._id.equals(userId)) {
                flag = 1;
                break;
            }
        }
    }
    if (task.creator._id.equals(userId)) {
        flag = 1;
    }

    if (!flag) {// Trưởng đơn vị quản lý công việc và trưởng đơn vị phối hợp được phép xem thông tin công việc

        // Tìm danh sách các role mà user kế thừa phân quyền
        let role = await UserRole(connect(DB_CONNECTION, portal)).find({ userId: userId });
        let listRole = role.map(item => item.roleId);

        let company = [];

        // Tìm ra các đơn vị có role là dean
        for (let i in listRole) {
            let roles = await Role(connect(DB_CONNECTION, portal)).findById(listRole[i]);
            company[i] = roles.company;
        }
        
        // Tìm cây đơn vị mà đơn vị gốc có userId có role deans
        let tree = [];
        let k = 0;
        for (let i = 0; i < listRole.length; i++) {
            let com = company[i];
            let r = listRole[i];
            let tr = await OrganizationalUnitService.getChildrenOfOrganizationalUnitsAsTree(portal, com, r);
            if (tr) {
                tree[k] = tr;
                k++;
            }
        }

        // Duyệt cây đơn vị, kiểm tra xem mỗi đơn vị có id trùng với id của phòng ban công việc
        for (let i = 0; i < listRole.length; i++) {
            let rol = listRole[i];
            if (!flag) {
                for (let j = 0; j < tree.length; j++) {
                    if (tree[j].deans.indexOf(rol) !== -1) {
                        let v = tree[j];
                        let f = await _checkDeans(v, task.organizationalUnit._id);
                        if (f === 1) {
                            flag = 1;
                        }
                    }
                }
            }
        }

        // Kiểm tra có là trưởng đơn vị phối hơp 
        if (tree && tree.length !== 0) {
            if (tree[0] && task.collaboratedWithOrganizationalUnits.includes(tree[0].id)) {
                flag = 1;
            }
        }
    }

    if (flag === 0) {
        return {
            "info": true
        }
    }
    task.evaluations.reverse();
    return task;
}

/**
 * Hàm duyệt cây đơn vị - kiểm tra trong cây có đơn vị của công việc được lấy ra hay không (đệ quy)
 */
_checkDeans = async (v, id) => {
    if (v) {
        if (JSON.stringify(v.id) === JSON.stringify(id)) {
            return 1;
        }
        if (v.children) {
            for (let k = 0; k < v.children.length; k++) {
                return _checkDeans(v.children[k], id);
            }
        }
    }
}


/**
 * Bấm giờ công việc
 * Lấy tất cả lịch sử bấm giờ theo công việc
 */
exports.getTaskTimesheetLogs = async (portal, params) => {
    let timesheetLogs = await Task(connect(DB_CONNECTION, portal)).findById(params.taskId).populate("timesheetLogs.creator")
    return timesheetLogs.timesheetLogs;
}

/**
 * Lấy trạng thái bấm giờ hiện tại. Bảng TimesheetLog tìm hàng có endTime là rỗng 
 * Nếu có trả về startTimer: true, và time, startTime. Không có trả ver startTimer: false
 */
exports.getActiveTimesheetLog = async (portal, query) => {
    let timerStatus = await Task(connect(DB_CONNECTION, portal)).findOne(
        { "timesheetLogs": { $elemMatch: { "creator": mongoose.Types.ObjectId(query.userId), "stoppedAt": null } } },
        { "timesheetLogs": 1, '_id': 1, 'name': 1 }
    );
    if (timerStatus !== null) {
        timerStatus.timesheetLogs = timerStatus.timesheetLogs.find(element => !(element.stoppedAt));
        return timerStatus;
    } else {
        return null;
    }
}

/**
 * Bắt đầu bấm giờ: Lưu thời gian bắt đầu
 */
exports.startTimesheetLog = async (portal, params, body) => {
    const now = new Date()
    let timerUpdate = {
        startedAt: now,
        creator: body.creator,
    }
    let timer = await Task(connect(DB_CONNECTION, portal)).findByIdAndUpdate(params.taskId,
        { $push: { timesheetLogs: timerUpdate } },
        { new: true, "fields": { "timesheetLogs": 1, '_id': 1, 'name': 1 } }
    );
    timer.timesheetLogs = timer.timesheetLogs.find(element => !(element.stoppedAt));
    return timer;
}

/**
 * Dừng bấm giờ: Lưu thời gian kết thúc và số giờ chạy (endTime và time)
 */
exports.stopTimesheetLog = async (portal, params, body) => {
    const now = new Date().getTime()
    let stoppedAt

    if (body.stoppedAt) {
        stoppedAt = body.stoppedAt
    } else {
        stoppedAt = now
    }


    // Lưu vào timeSheetLog
    let duration = stoppedAt - body.startedAt
    let timer = await Task(connect(DB_CONNECTION, portal)).findOneAndUpdate(
        { "_id": params.taskId, "timesheetLogs._id": body.timesheetLog },
        {
            $set:
            {
                "timesheetLogs.$.stoppedAt": stoppedAt,
                "timesheetLogs.$.duration": duration,
                "timesheetLogs.$.description": body.description,
            }
        },
        { new: true }
    ).populate({ path: "timesheetLogs.creator", select: "name" });


    // Lưu vào hoursSpentOnTask
    let newTotalHoursSpent = timer.hoursSpentOnTask.totalHoursSpent + duration;
    let contributions = timer.hoursSpentOnTask.contributions;
    let check = true;
    let newContributions = contributions.map(item => {
        if (item.employee.toString() === body.employee) {
            check = false;
            return {
                employee: body.employee,
                hoursSpent: item.hoursSpent + duration,
            }
        } else {
            return item;
        }
    })
    if (check) {
        let contributionEmployee = {
            employee: body.employee,
            hoursSpent: duration,
        }
        if (!newContributions) {
            newContributions = []
        }
        newContributions.push(contributionEmployee)
    }

    let newTask = await Task(connect(DB_CONNECTION, portal)).findOneAndUpdate(
        { "_id": params.taskId },
        {
            $set:
            {
                "hoursSpentOnTask.totalHoursSpent": newTotalHoursSpent,
                "hoursSpentOnTask.contributions": newContributions
            }
        },
    )
    newTask = await Task(connect(DB_CONNECTION, portal)).findById(params.taskId)
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
            { path: "evaluations.results.employee", select: "name email _id active" },
            { path: "evaluations.results.organizationalUnit", select: "name _id" },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: 'name email avatar' },
            { path: "taskActions.comments.creator", select: 'name email avatar' },
            { path: "commentsInProcess.creator", select: 'name email avatar' },
            { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
            { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
            { path: "taskComments.creator", select: 'name email avatar' },
            { path: "taskComments.comments.creator", select: 'name email avatar' },
            { path: "documents.creator", select: 'name email avatar' },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task", populate: [
                    { path: "commentsInProcess.creator", select: 'name email avatar' },
                    { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                ]
            },
            { path: "hoursSpentOnTask.contributions.employee", select: 'name' },
            {
                path: "process", populate: {
                    path: "tasks", populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
                        { path: "evaluations.results.employee", select: "name email _id active" },
                        { path: "evaluations.results.organizationalUnit", select: "name _id" },
                        { path: "evaluations.results.kpis" },
                        { path: "taskActions.creator", select: 'name email avatar' },
                        { path: "taskActions.comments.creator", select: 'name email avatar' },
                        { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                        { path: "taskComments.creator", select: 'name email avatar' },
                        { path: "taskComments.comments.creator", select: 'name email avatar' },
                        { path: "documents.creator", select: 'name email avatar' },
                        { path: "process" },
                        { path: "commentsInProcess.creator", select: 'name email avatar' },
                        { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                    ]
                }
            },
        ]);
    newTask.evaluations.reverse();

    return newTask;
}

/**
 * Thêm bình luận của hoạt động
 */
exports.createCommentOfTaskAction = async (portal, params, body, files) => {

    let commenttasks = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { "_id": params.taskId, "taskActions._id": params.actionId },
        {
            "$push":
            {
                "taskActions.$.comments":
                {
                    creator: body.creator,
                    description: body.description,
                    files: files
                }
            }
        }
    )
    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId, "taskActions._id": params.actionId }).populate([
        { path: "taskActions.creator", select: 'name email avatar' },
        { path: "taskActions.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar' }
    ]).select("taskActions");
    return task.taskActions;
}
/**
 * Sửa nội dung bình luận hoạt động
 */
exports.editCommentOfTaskAction = async (portal, params, body, files) => {
    const now = new Date()
    let action = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { "_id": params.taskId, "taskActions._id": params.actionId, "taskActions.comments._id": params.commentId },
        {
            $set:
            {
                "taskActions.$.comments.$[elem].description": body.description,
                "taskActions.$.comments.$[elem].updatedAt": now
            }
        },
        {
            arrayFilters:
                [
                    {
                        "elem._id": params.commentId
                    }
                ]
        }
    )
    let action1 = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { "_id": params.taskId, "taskActions._id": params.actionId, "taskActions.comments._id": params.commentId },
        {
            $push:
            {
                "taskActions.$.comments.$[elem].files": files
            }
        },
        {
            arrayFilters:
                [
                    {
                        "elem._id": params.commentId
                    }
                ]
        }
    )
    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId, "taskActions._id": params.actionId, "taskActions.comments._id": params.commentId }).populate([
        { path: "taskActions.creator", select: 'name email avatar ' },
        { path: "taskActions.comments.creator", select: 'name email avatar ' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' }
    ]).select("taskActions")
    return task.taskActions;
}

/**
 * Xóa bình luận hoạt động
 */
exports.deleteCommentOfTaskAction = async (portal, params) => {
    let files = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.actionId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } }
    ])

    let action = await Task(connect(DB_CONNECTION, portal)).update(
        { "_id": params.taskId, "taskActions._id": params.actionId, "taskActions.comments._id": params.commentId },
        { $pull: { "taskActions.$.comments": { _id: params.commentId } } },
        { safe: true })
    let i = 0
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }
    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ _id: params.taskId }).populate([
        { path: "taskActions.creator", select: 'name email avatar ' },
        { path: "taskActions.comments.creator", select: 'name email avatar ' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar' }
    ]).select("taskActions");
    return task.taskActions;
}
/**
 * Thêm hoạt động cho công việc
 */

exports.createTaskAction = async (portal, params, body, files) => {
    let actionInformation = {
        creator: body.creator,
        description: body.description,
        files: files
    }
    let taskAction1 = await Task(connect(DB_CONNECTION, portal)).findByIdAndUpdate(params.taskId,
        {
            $push:
            {
                taskActions: actionInformation
            }
        },
        { new: true }
    ).populate([{ path: "taskActions.creator", select: 'name email avatar' },])

    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ _id: params.taskId }).populate([
        { path: "taskActions.creator", select: 'name email avatar' },
        { path: "taskActions.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' }])

    let user = await User(connect(DB_CONNECTION, portal)).findOne({ _id: body.creator });
    let tasks = await Task(connect(DB_CONNECTION, portal)).findOne({ _id: params.taskId });
    let userEmail = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: tasks.accountableEmployees } });
    let email = userEmail.map(item => item.email);

    return { taskActions: task.taskActions, tasks: tasks, user: user, email: email };
}
/**
 * Sửa hoạt động của cộng việc
 */
exports.editTaskAction = async (portal, params, body, files) => {
    let action = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { "_id": params.taskId, "taskActions._id": params.actionId },
        {
            $set:
            {
                "taskActions.$.description": body.description
            }
        }
    )
    let action1 = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { "_id": params.taskId, "taskActions._id": params.actionId },
        {
            $push:
            {
                "taskActions.$.files": files
            }
        }
    )
    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId, "taskActions._id": params.actionId }).populate([
        { path: "taskActions.creator", select: 'name email avatar' },
        { path: "taskActions.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' }])
    return task.taskActions;
}


/**
 * Xóa hoạt động của công việc
 */
exports.deleteTaskAction = async (portal, params) => {
    let files = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.actionId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
    ])


    let action = await Task(connect(DB_CONNECTION, portal)).update(
        { "_id": params.taskId, "taskActions._id": params.actionId },
        {
            $pull:
            {
                taskActions: { _id: params.actionId }
            }
        },
        { safe: true }
    )
    //xoa file sau khi xoa hoat dong
    let i
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }
    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId }).populate([
        { path: "taskActions.creator", select: 'name email avatar' },
        { path: "taskActions.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar' }])

    return task.taskActions;
}

/**
 * Tạo bình luận công việc
 */
exports.createTaskComment = async (portal, params, body, files) => {
    let commentInformation = {
        creator: body.creator,
        description: body.description,
        files: files
    }
    let taskComment1 = await Task(connect(DB_CONNECTION, portal)).findByIdAndUpdate(params.taskId,
        {
            $push:
            {
                taskComments: commentInformation
            }
        },
        { new: true }
    );
    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ _id: params.taskId }).populate([
        { path: "taskComments.creator", select: 'name email avatar' },
        { path: "taskComments.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar' }])

    return task.taskComments;
}
/**
 * Sửa bình luận công việc
 */
exports.editTaskComment = async (portal, params, body, files) => {
    let now = new Date()
    let taskComment = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { "_id": params.taskId, "taskComments._id": params.commentId },
        {
            $set:
            {
                "taskComments.$.description": body.description,
                "taskComments.$.updatedAt": now,
            }
        }
    )
    let taskcomment2 = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { "_id": params.taskId, "taskComments._id": params.commentId },
        {
            $push:
            {
                "taskComments.$.files": files
            }
        }
    )

    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId, "taskComments._id": params.commentId }).populate([
        { path: "taskComments.creator", select: 'name email avatar ' },
        { path: "taskComments.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' }])
    return task.taskComments;
}
/**
 * Xóa bình luận công việc
 */
exports.deleteTaskComment = async (portal, params) => {
    let files = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskComments" },
        { $replaceRoot: { newRoot: "$taskComments" } },
        { $match: { _id: mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
    ])

    //xoa files
    let i
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }
    let comment = await Task(connect(DB_CONNECTION, portal)).update(
        { "_id": params.taskId, "taskComments._id": params.commentId },
        { $pull: { taskComments: { _id: params.commentId } } },
        { safe: true })
    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId }).populate([
        { path: "taskComments.creator", select: 'name email avatar ' },
        { path: "taskComments.comments.creator", select: 'name email avatar ' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' }])
    return task.taskComments;
}
/**
 * Thêm bình luận của bình luận công việc
 */
exports.createCommentOfTaskComment = async (portal, params, body, files) => {
    let taskcomment = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { "_id": params.taskId, "taskComments._id": params.commentId },
        {
            "$push":
            {
                "taskComments.$.comments":
                {
                    creator: body.creator,
                    description: body.description,
                    files: files
                }
            }
        }
    )


    let taskComment = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId, "taskComments._id": params.commentId }).populate([
        { path: "taskComments.creator", select: 'name email avatar' },
        { path: "taskComments.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' }])
        .select("taskComments");

    return taskComment.taskComments;
}
/**
 * Sửa bình luận của bình luận công việc
 */
exports.editCommentOfTaskComment = async (portal, params, body, files) => {
    const now = new Date();
    let comment = await Task(connect(DB_CONNECTION, portal)).updateOne(
        //thieu 1 tham so child comment
        { "_id": params.taskId, "taskComments.comments._id": params.commentId },
        {
            $set:
            {
                "taskComments.$.comments.$[elem].description": body.description,
                "taskComments.$.comments.$[elem].updatedAt": now
            }
        },
        {
            arrayFilters:
                [
                    {
                        "elem._id": params.commentId
                    }
                ]
        }
    )
    let action1 = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { "_id": params.taskId, "taskComments.comments._id": params.commentId },
        {
            $push:
            {
                "taskComments.$.comments.$[elem].files": files
            }
        },
        {
            arrayFilters:
                [
                    {
                        "elem._id": params.commentId
                    }
                ]
        }
    )

    let taskComment = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId, "taskComments.comments._id": params.commentId }).populate([
        { path: "taskComments.creator", select: 'name email avatar' },
        { path: "taskComments.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' }])
        .select("taskComments");
    return taskComment.taskComments;
}
/**
 * Xóa bình luận của bình luận coogn việc
 */
exports.deleteCommentOfTaskComment = async (portal, params) => {
    let files = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskComments" },
        { $replaceRoot: { newRoot: "$taskComments" } },
        { $match: { "comments._id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } }
    ])
    let comment = await Task(connect(DB_CONNECTION, portal)).update(
        { "_id": params.taskId, "taskComments.comments._id": params.commentId },
        {
            $pull:
            {
                "taskComments.$.comments": { _id: params.commentId }
            }
        },
        { safe: true })

    //xoa file sau khi xoa binh luan    
    let i = 0
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }
    let taskComment = await Task(connect(DB_CONNECTION, portal)).findOne({ _id: params.taskId }).populate([
        { path: "taskComments.creator", select: 'name email avatar' },
        { path: "taskComments.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' }])
        .select("taskComments");

    return taskComment.taskComments;
}
/**
 * Đánh giá hoạt động
 */
exports.evaluationAction = async (portal, params, body) => {
    // đánh giá lần đầu
    if (body.firstTime === 1) {
        //cập nhật điểm người đánh giá
        let evaluationAction = await Task(connect(DB_CONNECTION, portal)).updateOne(
            { "_id": params.taskId, "taskActions._id": params.actionId },
            {
                $push:
                {
                    "taskActions.$.evaluations":
                    {
                        creator: body.creator,
                        rating: body.rating,
                    }
                },
            },
            { $new: true }
        )



        //danh sách người phê duyệt
        let task1 = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId, "taskActions._id": params.actionId })
        let accountableEmployees = task1.accountableEmployees



        //danh sách các đánh giá
        let evaluations = await Task(connect(DB_CONNECTION, portal)).aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
            { $unwind: "$taskActions" },
            { $replaceRoot: { newRoot: "$taskActions" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.actionId) } },
            { $unwind: "$evaluations" },
            { $replaceRoot: { newRoot: "$evaluations" } }
        ])


        //tim xem trong danh sách đánh giá ai là người phê duyệt
        let rating = [];
        evaluations.forEach(x => {
            if (accountableEmployees.some(elem => x.creator.toString() === elem.toString())) {
                rating.push(x.rating)
            }
        })


        //tính điểm trung bình
        let accountableRating
        if (rating.length > 0) {
            accountableRating = rating.reduce((accumulator, currentValue) => { return accumulator + currentValue }, 0) / rating.length
        }



        //check xem th đấnh giá có là người phê duyệt không
        let idAccountableEmployee = task1.accountableEmployees.some(elem => body.creator === elem.toString())
        if (idAccountableEmployee) {
            let evaluationActionRating = await Task(connect(DB_CONNECTION, portal)).updateOne(
                { "_id": params.taskId, "taskActions._id": params.actionId },
                {
                    $set:
                    {
                        "taskActions.$.rating": accountableRating
                    }
                },
                { $new: true }
            )
        }


        // đánh giá lại
    } else if (body.firstTime === 0) {
        let taskAction = await Task(connect(DB_CONNECTION, portal)).update(
            { $and: [{ "_id": params.taskId, "taskActions._id": params.actionId }, { "taskActions.evaluations.creator": body.creator }] },
            {
                $set:
                {
                    "taskActions.$[item].evaluations.$[elem].rating": body.rating
                }
            },
            {
                arrayFilters:
                    [
                        {
                            "elem.creator": body.creator
                        },
                        {
                            "item._id": params.actionId
                        }
                    ]
            }
        )
    }

    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId, "taskActions._id": params.actionId }).populate([
        { path: "taskActions.creator", select: 'name email avatar avatar ' },
        { path: "taskActions.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' }
    ]);

    return task.taskActions;
}
/**
 * Xác nhận hành động
 */
exports.confirmAction = async (portal, params, body) => {

    let evaluationActionRating = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { "_id": params.taskId, "taskActions._id": params.actionId },
        {
            $set: {
                "taskActions.$.creator": body.userId,
                "taskActions.$.createdAt": Date.now()
            }
        }
    )

    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId, "taskActions._id": params.actionId }).populate([
        { path: "taskActions.creator", select: 'name email avatar ' },
        { path: "taskActions.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' }])
    return task.taskActions;
}
/**
 * Upload tài liệu cho cộng việc
 */
exports.uploadFile = async (portal, params, body, files) => {
    let files1 = {
        files: files,
        creator: body.creator,
        description: body.description
    }
    let task1 = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: params.taskId },
        {
            $push: {
                documents: files1
            }
        }
    )

    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ _id: params.taskId }).populate([
        { path: "documents.creator", select: 'name email avatar' },
    ]);

    return task.documents
}

/**
 * Thêm nhật ký cho một công việc
 */
exports.addTaskLog = async (portal, params, body) => {
    let { creator, title, description, createdAt } = body;

    let log = {
        createdAt: createdAt,
        creator: creator,
        title: title,
        description: description,
    }
    let task = await Task(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
        params.taskId, { $push: { logs: log } }, { new: true }
    ).populate("logs.creator");
    let taskLog = task.logs.reverse();

    return taskLog;
}

/**
 * Lấy tất cả nhật ký của một công việc
 */
exports.getTaskLog = async (portal, params) => {
    let task = await Task(connect(DB_CONNECTION, portal)).findById(params.taskId).populate("logs.creator")

    return task.logs.reverse();
}

/**
 * hàm convert dateISO sang string
 */
formatDate = (date) => {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;


    return [day, month, year].join('-');
}

/**
 * hàm check điều kiện evaluate tồn tại
 */
async function checkEvaluations(portal, date, taskId, storeDate) {
    let evaluateId;
    let splitterStoreDate = storeDate.split("-");
    let storeDateISO = new Date(splitterStoreDate[2], splitterStoreDate[1] - 1, splitterStoreDate[0]);

    let splitterDate = date.split("-");
    let dateISO = new Date(splitterDate[2], splitterDate[1] - 1, splitterDate[0]);
    let monthOfParams = dateISO.getMonth();
    let yearOfParams = dateISO.getFullYear();
    let testCase;

    // kiểm tra evaluations
    let initTask = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    let cloneTaskInfo = [];
    for (let i in initTask.taskInformations) {
        cloneTaskInfo[i] = {
            _id: initTask.taskInformations[i]._id,
            name: initTask.taskInformations[i].name,
            code: initTask.taskInformations[i].code,
            type: initTask.taskInformations[i].type,
            extra: initTask.taskInformations[i].extra,
            filledByAccountableEmployeesOnly: initTask.taskInformations[i].filledByAccountableEmployeesOnly
        }
    }

    // kiểm tra điều kiện của evaluations
    if (initTask.evaluations.length === 0) {
        testCase = "TH1";
    }
    else {
        let chk = initTask.evaluations.find(e => (monthOfParams === e.date.getMonth() && yearOfParams === e.date.getFullYear()));
        if (!chk) { // có evaluate nhưng k có tháng này
            testCase = "TH2";
        } else { // có evaluate đúng tháng này
            testCase = "TH3";
        }
    }

    // TH1: chưa có evaluations => tạo mới
    if (testCase === "TH1") {

        let evaluationsVer1 = {
            date: storeDateISO,
            kpi: [],
            result: [],
            taskInformations: cloneTaskInfo
        }
        let taskV1 = await Task(connect(DB_CONNECTION, portal)).updateOne({ _id: taskId },
            {
                $push: {
                    evaluations: evaluationsVer1
                }
            },
            {
                $new: true
            }
        );
        let taskV2 = await Task(connect(DB_CONNECTION, portal)).findById(taskId);
        evaluateId = taskV2.evaluations[0]._id;

    }

    // TH2: Có evaluation nhưng chưa có tháng giống với date => tạo mới
    else if (testCase === "TH2") {

        let evaluationsVer2 = {
            date: storeDateISO,
            kpi: [],
            result: [],
            taskInformations: cloneTaskInfo
        }
        await Task(connect(DB_CONNECTION, portal)).updateOne({ _id: taskId },
            {
                $push: {
                    evaluations: evaluationsVer2
                }
            },
            {
                $new: true
            }
        );

        let taskV2 = await Task(connect(DB_CONNECTION, portal)).findById(taskId);
        evaluateId = taskV2.evaluations.find(e => (monthOfParams === e.date.getMonth() && yearOfParams === e.date.getFullYear()))._id;
    }

    // TH3: Có evaluations của tháng giống date => cập nhật evaluations
    else if (testCase === "TH3") {

        let taskV3 = initTask;
        evaluateId = taskV3.evaluations.find(e => (monthOfParams === e.date.getMonth() && yearOfParams === e.date.getFullYear()))._id;

    }

    return evaluateId;
}

/**
 * edit task by responsible employee
 */
exports.editTaskByResponsibleEmployees = async (portal, data, taskId) => {
    let { name, description, kpi, user, progress, info, date } = data;
    let evaluateId;

    const endOfMonth = moment().endOf("month").format('DD-MM-YYYY')

    let task = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    // chuẩn hóa dữ liệu info
    for (let i in info) {
        if (info[i].value) { // !== undefined
            if (info[i].type === "number") info[i].value = parseInt(info[i].value);
            else if (info[i].type === "set_of_values") info[i].value = info[i].value[0];
            else if (info[i].type === "date") {
                let splitter = info[i].value.split("-");
                let infoDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                info[i].value = infoDate;
            }
        }
    }

    await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: taskId },
        {
            $set: {
                name: name,
                description: description,
                progress: progress
            }
        },
        { $new: true }
    );

    // let task = await Task(connect(DB_CONNECTION, portal)).findById(taskId);
    for (let item in info) {
        for (let i in task.taskInformations) {
            if (info[item].code === task.taskInformations[i].code) {
                task.taskInformations[i] = {
                    filledByAccountableEmployeesOnly: task.taskInformations[i].filledByAccountableEmployeesOnly,
                    _id: task.taskInformations[i]._id,
                    code: task.taskInformations[i].code,
                    name: task.taskInformations[i].name,
                    description: task.taskInformations[i].description,
                    type: task.taskInformations[i].type,
                    extra: task.taskInformations[i].extra,
                    value: info[item].value
                }

                await Task(connect(DB_CONNECTION, portal)).updateOne(
                    {
                        _id: taskId,
                        "taskInformations._id": task.taskInformations[i]._id
                    },
                    {
                        $set: {
                            "taskInformations.$.value": task.taskInformations[i].value
                        }
                    },
                    {
                        $new: true
                    }
                )
            }
        }
    }

    // let newTask = await this.getTask(taskId).info;
    let newTask = await Task(connect(DB_CONNECTION, portal)).findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit" },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
        { path: "evaluations.results.employee", select: "name email _id active" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", select: 'name email avatar' },
        { path: "taskActions.comments.creator", select: 'name email avatar' },
        { path: "commentsInProcess.creator", select: 'name email avatar' },
        { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
        { path: "taskComments.creator", select: 'name email avatar' },
        { path: "taskComments.comments.creator", select: 'name email avatar' },
        { path: "documents.creator", select: 'name email avatar' },
        { path: "followingTasks.task" },
        {
            path: "preceedingTasks.task", populate: [
                { path: "commentsInProcess.creator", select: 'name email avatar' },
                { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
            ]
        },
        { path: "hoursSpentOnTask.contributions.employee", select: 'name' },
        {
            path: "process", populate: {
                path: "tasks", populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit" },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
                    { path: "evaluations.results.employee", select: "name email _id active" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", select: 'name email avatar' },
                    { path: "taskActions.comments.creator", select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                    { path: "taskComments.creator", select: 'name email avatar' },
                    { path: "taskComments.comments.creator", select: 'name email avatar' },
                    { path: "documents.creator", select: 'name email avatar' },
                    { path: "process" },
                    { path: "commentsInProcess.creator", select: 'name email avatar' },
                    { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                ]
            }
        },
    ]);

    //xu ly gui email
    let tasks = await Task(connect(DB_CONNECTION, portal)).findById(taskId);
    let userId = tasks.accountableEmployees;
    let user1 = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: userId } });
    let email = user1.map(item => item.email);
    email.push('trinhhong102@gmail.com');
    user = await User(connect(DB_CONNECTION, portal)).findById(data.user);
    newTask.evaluations.reverse();

    return { newTask: newTask, email: email, user: user, tasks: tasks };
}

/**
 * edit task by responsible employee
 * @param {Object} data dữ liệu cần chỉnh sửa
 * @param {String} taskID id của công việc cần edit
 */
exports.editTaskByAccountableEmployees = async (portal, data, taskId) => {
    let { description, name, priority, status, formula, parent, startDate, endDate, progress, info, date,
        accountableEmployees, consultedEmployees, responsibleEmployees, informedEmployees, inactiveEmployees } = data;

    // Chuẩn hóa parent 
    if (parent === '') {
        parent = null;
    }

    // Chuẩn hóa ngày bắt đầu và ngày kết thúc
    let splitStartDate = startDate.split("-");
    let startOfTask = new Date(splitStartDate[2], splitStartDate[1] - 1, splitStartDate[0]);

    let splitEndDate = endDate.split("-");
    let endOfTask = new Date(splitEndDate[2], splitEndDate[1] - 1, splitEndDate[0]);

    // chuẩn hóa dữ liệu info
    for (let i in info) {
        if (info[i].value) { // !== undefined
            if (info[i].type === "number") info[i].value = parseInt(info[i].value);
            else if (info[i].type === "set_of_values") info[i].value = info[i].value[0];
            else if (info[i].type === "date") {
                let splitter = info[i].value.split("-");
                let infoDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                info[i].value = infoDate;
            }
        }
    }

    // cập nhật thông tin cơ bản
    await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: taskId },
        {
            $set: {
                name: name,
                description: description,
                progress: progress,
                priority: parseInt(priority[0]),
                status: status[0],
                formula: formula,
                parent: parent,

                startDate: startOfTask,
                endDate: endOfTask,

                responsibleEmployees: responsibleEmployees,
                consultedEmployees: consultedEmployees,
                accountableEmployees: accountableEmployees,
                informedEmployees: informedEmployees,

                inactiveEmployees: inactiveEmployees

            }
        },
        { $new: true }
    );
    let task = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    for (let item in info) {
        for (let i in task.taskInformations) {
            if (info[item].code === task.taskInformations[i].code) {
                task.taskInformations[i] = {
                    filledByAccountableEmployeesOnly: task.taskInformations[i].filledByAccountableEmployeesOnly,
                    _id: task.taskInformations[i]._id,
                    code: task.taskInformations[i].code,
                    name: task.taskInformations[i].name,
                    description: task.taskInformations[i].description,
                    type: task.taskInformations[i].type,
                    extra: task.taskInformations[i].extra,
                    value: info[item].value
                }
                await Task(connect(DB_CONNECTION, portal)).updateOne(
                    {
                        _id: taskId,
                        "taskInformations._id": task.taskInformations[i]._id
                    },
                    {
                        $set: {
                            "taskInformations.$.value": task.taskInformations[i].value
                        }
                    },
                    {
                        $new: true
                    }
                )
            }
        }
    }



    // let newTask = await Task(connect(DB_CONNECTION, portal)).findById(taskId);
    let newTask = await Task(connect(DB_CONNECTION, portal)).findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit" },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
        { path: "evaluations.results.employee", select: "name email _id active" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", select: 'name email avatar' },
        { path: "taskActions.comments.creator", select: 'name email avatar' },
        { path: "commentsInProcess.creator", select: 'name email avatar' },
        { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
        { path: "taskComments.creator", select: 'name email avatar' },
        { path: "taskComments.comments.creator", select: 'name email avatar' },
        { path: "documents.creator", select: 'name email avatar' },
        { path: "followingTasks.task" },
        {
            path: "preceedingTasks.task", populate: [
                { path: "commentsInProcess.creator", select: 'name email avatar' },
                { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
            ]
        },
        { path: "hoursSpentOnTask.contributions.employee", select: 'name' },
        {
            path: "process", populate: {
                path: "tasks", populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit" },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
                    { path: "evaluations.results.employee", select: "name email _id active" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", select: 'name email avatar' },
                    { path: "taskActions.comments.creator", select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                    { path: "taskComments.creator", select: 'name email avatar' },
                    { path: "taskComments.comments.creator", select: 'name email avatar' },
                    { path: "documents.creator", select: 'name email avatar' },
                    { path: "process" },
                    { path: "commentsInProcess.creator", select: 'name email avatar' },
                    { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                ]
            }
        },
    ]);

    //xu ly gui email
    let tasks = await Task(connect(DB_CONNECTION, portal)).findById(taskId);
    let userId = tasks.responsibleEmployees;
    let user = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: userId } });
    let email = user.map(item => item.email);
    email.push('trinhhong102@gmail.com');
    user = await User(connect(DB_CONNECTION, portal)).findById(data.user);
    newTask.evaluations.reverse();

    return { newTask: newTask, email: email, user: user, tasks: tasks };

}

/** Chỉnh sửa nhân viên tham gia công việc mà đơn vị được phối hợp */
exports.editEmployeeCollaboratedWithOrganizationalUnits = async (portal, taskId, data) => {
    let task, responsibleEmployees, consultedEmployees, newEmployees = [];
    task = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    // Lấy nhân viên mới để gửi mail
    if (data.responsibleEmployees && data.responsibleEmployees.length !== 0) {
        data.responsibleEmployees.map(item => {
            if (!task.responsibleEmployees.includes(item)) {
                newEmployees.push(item);
            }
        })
    }
    if (data.consultedEmployees && data.consultedEmployees.length !== 0) {
        data.consultedEmployees.map(item => {
            if (!task.consultedEmployees.includes(item)) {
                newEmployees.push(item);
            }
        })
    }
    newEmployees = Array.from(new Set(newEmployees));

    // Xóa người thực hiện cũ của đơn vị hiện tại 
    if (data.oldResponsibleEmployees && data.oldResponsibleEmployees.length !== 0 && task.responsibleEmployees) {
        for (let i = task.responsibleEmployees.length - 1; i >= 0; i--) {
            if (data.oldResponsibleEmployees.includes(task.responsibleEmployees[i].toString())) {
                task.responsibleEmployees.splice(i, 1);
            }
        }
    }
    // Xóa người hỗ trợ của đơn vị hiện tại
    if (data.oldConsultedEmployees && data.oldConsultedEmployees.length !== 0 && task.consultedEmployees) {
        for (let i = task.consultedEmployees.length - 1; i >= 0; i--) {
            if (data.oldConsultedEmployees.includes(task.consultedEmployees[i].toString())) {
                task.consultedEmployees.splice(i, 1);
            }
        }
    }

    // Thêm mới người thực hiẹn và người hỗ trợ
    responsibleEmployees = task.responsibleEmployees.concat(data.responsibleEmployees);
    consultedEmployees = task.consultedEmployees.concat(data.consultedEmployees);
    
    task = await Task(connect(DB_CONNECTION, portal)).findOneAndUpdate(
        { "_id": taskId },
        {
            $set: {
                responsibleEmployees: responsibleEmployees,
                consultedEmployees: consultedEmployees
            }
        },
        { $new: true }
    );

    let newTask = await Task(connect(DB_CONNECTION, portal)).findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit" },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
        { path: "evaluations.results.employee", select: "name email _id active" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", select: 'name email avatar' },
        { path: "taskActions.comments.creator", select: 'name email avatar' },
        { path: "commentsInProcess.creator", select: 'name email avatar' },
        { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
        { path: "taskComments.creator", select: 'name email avatar' },
        { path: "taskComments.comments.creator", select: 'name email avatar' },
        { path: "documents.creator", select: 'name email avatar' },
        { path: "followingTasks.task" },
        {
            path: "preceedingTasks.task", populate: [
                { path: "commentsInProcess.creator", select: 'name email avatar' },
                { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
            ]
        },
        { path: "hoursSpentOnTask.contributions.employee", select: 'name' },
        {
            path: "process", populate: {
                path: "tasks", populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit" },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
                    { path: "evaluations.results.employee", select: "name email _id active" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", select: 'name email avatar' },
                    { path: "taskActions.comments.creator", select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                    { path: "taskComments.creator", select: 'name email avatar' },
                    { path: "taskComments.comments.creator", select: 'name email avatar' },
                    { path: "documents.creator", select: 'name email avatar' },
                    { path: "process" },
                    { path: "commentsInProcess.creator", select: 'name email avatar' },
                    { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                ]
            }
        },
    ]);
    newTask.evaluations.reverse();

    let html, email;
    html = `<p>Bạn được phân công công việc: <a href="${process.env.WEBSITE}/task?taskId=${newTask._id}" target="_blank"><strong>${newTask.name}</strong></a></p> ` +
        `<h3>Nội dung công việc</h3>` +
        // `<p>Tên công việc : <strong>${task.name}</strong></p>` +
        `<p>Mô tả : ${newTask.description}</p>` +
        `<p>Người thực hiện</p> ` +
        `<ul>${newTask.responsibleEmployees.map((item) => {
            return `<li>${item.name} - ${item.email}</li>`
        })}
                    </ul>`+
        `<p>Người phê duyệt</p> ` +
        `<ul>${newTask.accountableEmployees.map((item) => {
            return `<li>${item.name} - ${item.email}</li>`
        })}
                    </ul>` +
        `${newTask.consultedEmployees.length > 0 ? `<p>Người tư vấn</p> ` +
            `<ul>${newTask.consultedEmployees.map((item) => {
                return `<li>${item.name} - ${item.email}</li>`
            })}
                    </ul>` : ""}` +
        `${newTask.informedEmployees.length > 0 ? `<p>Người quan sát</p> ` +
            `<ul>${newTask.informedEmployees.map((item) => {
                return `<li>${item.name} - ${item.email}</li>`
            })}
                    </ul>` : ""}`
        ;
    
    newEmployees = await User(connect(DB_CONNECTION, portal)).find({
        _id: { $in: newEmployees }
    })    
    email = newEmployees.map(item => item.email);

    return {
        task: newTask,
        html: html,
        email: email,
        newEmployees: newEmployees.map(item => item._id)
    }
}

/**
 * evaluate task by consulted
 */
exports.evaluateTaskByConsultedEmployees = async (portal, data, taskId) => {
    let user = data.user;
    let { automaticPoint, employeePoint, kpi, unit, role, date } = data;
    let evaluateId = await checkEvaluations(portal, date, taskId, date);

    let resultItem = {
        employee: user,
        employeePoint: employeePoint,
        organizationalUnit: unit,
        kpis: kpi,
        automaticPoint: automaticPoint,
        role: role
    }
    let task = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    // cập nhật thông tin result

    let listResult = task.evaluations.find(e => String(e._id) === String(evaluateId)).results

    let check_results = listResult.find(r => (String(r.employee) === user && String(r.role) === "consulted"));
    if (check_results === undefined) {
        await Task(connect(DB_CONNECTION, portal)).updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId
            },
            {
                $push: {
                    "evaluations.$.results": resultItem
                }
            },
            { $new: true }
        );
    } else {
        await Task(connect(DB_CONNECTION, portal)).updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId,

            },
            {
                $set: {
                    "evaluations.$.results.$[elem].employeePoint": employeePoint,
                    "evaluations.$.results.$[elem].automaticPoint": automaticPoint,
                    "evaluations.$.results.$[elem].organizationalUnit": unit,
                    "evaluations.$.results.$[elem].kpis": kpi,
                }
            },
            {
                arrayFilters: [
                    {
                        "elem.employee": user,
                        "elem.role": role
                    }
                ]
            }
        );
    }
    // let newTask = await Task(connect(DB_CONNECTION, portal)).findById(taskId);
    let newTask = await Task(connect(DB_CONNECTION, portal)).findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit" },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
        { path: "evaluations.results.employee", select: "name email _id active" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", select: 'name email avatar' },
        { path: "taskActions.comments.creator", select: 'name email avatar' },
        { path: "commentsInProcess.creator", select: 'name email avatar' },
        { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
        { path: "taskComments.creator", select: 'name email avatar' },
        { path: "taskComments.comments.creator", select: 'name email avatar' },
        { path: "documents.creator", select: 'name email avatar' },
        { path: "followingTasks.task" },
        {
            path: "preceedingTasks.task", populate: [
                { path: "commentsInProcess.creator", select: 'name email avatar' },
                { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
            ]
        },
        { path: "hoursSpentOnTask.contributions.employee", select: 'name' },
        {
            path: "process", populate: {
                path: "tasks", populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit" },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
                    { path: "evaluations.results.employee", select: "name email _id active" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", select: 'name email avatar' },
                    { path: "taskActions.comments.creator", select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                    { path: "taskComments.creator", select: 'name email avatar' },
                    { path: "taskComments.comments.creator", select: 'name email avatar' },
                    { path: "documents.creator", select: 'name email avatar' },
                    { path: "process" },
                    { path: "commentsInProcess.creator", select: 'name email avatar' },
                    { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                ]
            }
        },
    ]);
    newTask.evaluations.reverse();

    return newTask;
}

/**
 * evaluate task by Responsible
 */
exports.evaluateTaskByResponsibleEmployees = async (portal, data, taskId) => {
    let { user, unit, checkSave, progress, automaticPoint, employeePoint, role, date, kpi, info } = data

    let splitter = date.split("-");
    let evaluateDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    let dateFormat = evaluateDate;

    let resultItem = {
        employee: user,
        organizationalUnit: unit,
        kpis: kpi,
        employeePoint: employeePoint,
        automaticPoint: automaticPoint,
        role: role
    }

    let evaluateId = await checkEvaluations(portal, date, taskId, date);

    // chuẩn hóa dữ liệu info
    for (let i in info) {
        if (info[i].value) { // !== undefined || info[i].value !== null
            if (info[i].type === "number") info[i].value = parseInt(info[i].value);
            else if (info[i].type === "set_of_values") info[i].value = info[i].value[0];
            else if (info[i].type === "date") {
                let splitter = info[i].value.split("-");
                let infoDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                info[i].value = infoDate;
            }
        }
    }

    checkSave && await Task(connect(DB_CONNECTION, portal)).updateOne({ _id: taskId }, { $set: { progress: progress } }, { $new: true });

    await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId,
        },
        {
            $set: {
                "evaluations.$.progress": progress,
            }
        },
        {
            $new: true,
        }
    );

    let task = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    let listResult = task.evaluations.find(e => String(e._id) === String(evaluateId)).results;

    let check_results = listResult.find(r => (String(r.employee) === user && String(r.role) === "responsible"));
    if (check_results === undefined) {
        await Task(connect(DB_CONNECTION, portal)).updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId
            },
            {
                $push: {
                    "evaluations.$.results": resultItem
                }
            },
            { $new: true }
        );
    } else {
        await Task(connect(DB_CONNECTION, portal)).updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId,

            },
            {
                $set: {
                    "evaluations.$.results.$[elem].employeePoint": employeePoint,
                    "evaluations.$.results.$[elem].automaticPoint": automaticPoint,
                    "evaluations.$.results.$[elem].organizationalUnit": unit,
                    "evaluations.$.results.$[elem].kpis": kpi,
                }
            },
            {
                arrayFilters: [
                    {
                        "elem.employee": user,
                        "elem.role": role
                    }
                ]
            }
        );
    }

    //cập nhật lại tất cả điểm tự động
    await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId,

        },
        {
            $set: {
                "evaluations.$.results.$[].automaticPoint": automaticPoint
            }
        }
    )

    // update Info task
    let splitterDate = date.split("-");
    let dateISO = new Date(splitterDate[2], splitterDate[1] - 1, splitterDate[0]);
    let monthOfParams = dateISO.getMonth();
    let yearOfParams = dateISO.getFullYear();
    let now = new Date();

    let cloneInfo = task.taskInformations;
    for (let item in info) {
        for (let i in cloneInfo) {
            if (info[item].code === cloneInfo[i].code) {
                cloneInfo[i] = {
                    filledByAccountableEmployeesOnly: cloneInfo[i].filledByAccountableEmployeesOnly,
                    _id: cloneInfo[i]._id,
                    code: cloneInfo[i].code,
                    name: cloneInfo[i].name,
                    description: cloneInfo[i].description,
                    type: cloneInfo[i].type,
                    extra: cloneInfo[i].extra,
                    value: info[item].value
                }
                // quangdz
                if (yearOfParams > now.getFullYear() || (yearOfParams <= now.getFullYear() && monthOfParams >= now.getMonth())) {
                    checkSave && await Task(connect(DB_CONNECTION, portal)).updateOne(
                        {
                            _id: taskId,
                            "taskInformations._id": cloneInfo[i]._id
                        },
                        {
                            $set: {
                                "taskInformations.$.value": cloneInfo[i].value
                            }
                        },
                        {
                            $new: true
                        }
                    )
                }

                await Task(connect(DB_CONNECTION, portal)).updateOne(
                    {
                        _id: taskId,
                        "evaluations._id": evaluateId
                    },
                    {
                        $set: {
                            "evaluations.$.taskInformations.$[elem].value": cloneInfo[i].value
                        }
                    },
                    {
                        arrayFilters: [
                            {
                                "elem._id": cloneInfo[i]._id
                            }
                        ]
                    }

                )
            }
        }
    }

    // update date of evaluation

    await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId
        },
        {
            $set: {
                "evaluations.$.date": dateFormat
            }
        },
        {
            $new: true
        }
    )

    let newTask = await Task(connect(DB_CONNECTION, portal)).findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit" },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
        { path: "evaluations.results.employee", select: "name email _id active" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", select: 'name email avatar' },
        { path: "taskActions.comments.creator", select: 'name email avatar' },
        { path: "commentsInProcess.creator", select: 'name email avatar' },
        { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
        { path: "taskComments.creator", select: 'name email avatar' },
        { path: "taskComments.comments.creator", select: 'name email avatar' },
        { path: "documents.creator", select: 'name email avatar' },
        { path: "followingTasks.task" },
        {
            path: "preceedingTasks.task", populate: [
                { path: "commentsInProcess.creator", select: 'name email avatar' },
                { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
            ]
        },
        { path: "hoursSpentOnTask.contributions.employee", select: 'name' },
        {
            path: "process", populate: {
                path: "tasks", populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit" },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
                    { path: "evaluations.results.employee", select: "name email _id active" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", select: 'name email avatar' },
                    { path: "taskActions.comments.creator", select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                    { path: "taskComments.creator", select: 'name email avatar' },
                    { path: "taskComments.comments.creator", select: 'name email avatar' },
                    { path: "documents.creator", select: 'name email avatar' },
                    { path: "process" },
                    { path: "commentsInProcess.creator", select: 'name email avatar' },
                    { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                ]
            }
        },
    ]);
    newTask.evaluations.reverse();

    return newTask;
}

/**
 * evaluate task by Accountable
 */
exports.evaluateTaskByAccountableEmployees = async (portal, data, taskId) => {
    let { unit, user, hasAccountable, checkSave, progress, role, date, status, info, results, kpi } = data;

    let automaticPoint = data.automaticPoint === undefined ? 0 : data.automaticPoint;

    let splitter = date.split("-");
    let evaluateDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    let dateFormat = evaluateDate;

    let evaluateId = await checkEvaluations(portal, date, taskId, date);

    // lấy info có value khác undefined
    let filterInfo = [];
    for (let i in info) {
        if (info[i].value !== undefined) {
            filterInfo.push(info[i]);
        }
    }

    // chuẩn hóa dữ liệu info
    for (let i in info) {
        if (info[i].value) { // !== undefined
            if (info[i].type === "number") info[i].value = parseInt(info[i].value);
            else if (info[i].type === "set_of_values") info[i].value = info[i].value[0];
            else if (info[i].type === "date") {
                let splitter = info[i].value.split("-");
                let infoDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                info[i].value = infoDate;
            }
        }
    }
    // Chuan hoa du lieu approved results

    let cloneResult = [];
    for (let i in results) {
        for (let j in results) {
            if (i < j) {
                // client bắt buộc phải điền contribution khi chấm điểm phê duyệt để chuẩn hóa được dữ liệu ==> fixed
                if (results[i].employee === results[j].employee && results[i].role === results[j].role) {
                    let point, contribute;

                    // do i hoặc j có thể là point hoặc contribute nên phải kiểm tra cả 2 để tính đc point và contribute
                    if (String(results[i].target) === "Point") point = results[i].value;
                    else if (String(results[i].target) === "Contribution") contribute = results[i].value;

                    if (String(results[j].target) === "Point") point = results[j].value;
                    else if (String(results[j].target) === "Contribution") contribute = results[j].value;

                    let cloneItem = {
                        employee: results[i].employee,
                        role: results[i].role,
                        point: point,
                        contribute: contribute
                    }
                    if (point !== undefined || contribute !== undefined) {
                        cloneResult.push(cloneItem);
                    }
                }
            }
        }

    }

    await Task(connect(DB_CONNECTION, portal)).updateOne({ _id: taskId }, { $set: { status: status[0] } });
    let task = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    checkSave && await Task(connect(DB_CONNECTION, portal)).updateOne({ _id: taskId }, { $set: { progress: progress } });
    task = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    // cập nhật thông tin result (==============BEGIN============)

    let listResult = task.evaluations.find(e => String(e._id) === String(evaluateId)).results;

    // TH có điền thông tin result
    for (let item in cloneResult) {

        let check_data = listResult.find(r => (String(r.employee) === cloneResult[item].employee && r.role === cloneResult[item].role))
        // TH nguoi nay da danh gia ket qua --> thi chi can cap nhat lai ket qua thoi
        if (check_data !== undefined) {
            // cap nhat diem
            await Task(connect(DB_CONNECTION, portal)).updateOne(
                {
                    _id: taskId,
                    "evaluations._id": evaluateId,

                },
                {
                    $set: {
                        "evaluations.$.results.$[elem].approvedPoint": cloneResult[item].point,
                        "evaluations.$.results.$[elem].contribution": cloneResult[item].contribute,
                    }
                },
                {
                    arrayFilters: [
                        {
                            "elem.employee": cloneResult[item].employee,
                            "elem.role": cloneResult[item].role
                        }
                    ]
                }
            )

        } else {
            await Task(connect(DB_CONNECTION, portal)).updateOne(
                {
                    _id: taskId,
                    "evaluations._id": evaluateId,

                },
                {
                    $push: {
                        "evaluations.$.results": {
                            approvedPoint: cloneResult[item].point,
                            contribution: cloneResult[item].contribute,
                            role: cloneResult[item].role,
                            employee: cloneResult[item].employee,
                            employeePoint: 0
                        }
                    }
                },
                {
                    $new: true
                }
            )

        }

    }

    let task2 = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    // cập nhật thông tin result cho cá nhân người phê duyệt

    let listResult2 = task2.evaluations.find(e => String(e._id) === String(evaluateId)).results;

    let curentRole = "accountable"
    if (!hasAccountable) {
        curentRole = "responsible"
    }

    // cập nhật điểm cá nhân cho ng phe duyet
    let check_approve = listResult2.find(r => (String(r.employee) === user && String(r.role) === curentRole));
    if (cloneResult.length > 0) {
        for (let i in cloneResult) {
            if (String(cloneResult[i].role) === curentRole && String(cloneResult[i].employee) === String(user)) {
                await Task(connect(DB_CONNECTION, portal)).updateOne(
                    {
                        _id: taskId,
                        "evaluations._id": evaluateId,
                    },
                    {
                        $set: {
                            "evaluations.$.results.$[elem].employeePoint": cloneResult[i].point,
                            "evaluations.$.results.$[elem].organizationalUnit": unit,
                            "evaluations.$.results.$[elem].kpis": kpi,
                        }
                    },
                    {
                        arrayFilters: [
                            {
                                "elem.employee": cloneResult[i].employee,
                                "elem.role": cloneResult[i].role
                            }
                        ]
                    }
                )
            }
        }
    }
    else if (check_approve === undefined) {
        await Task(connect(DB_CONNECTION, portal)).updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId
            },
            {
                $push: {
                    "evaluations.$.results": {
                        organizationalUnit: unit,
                        kpis: kpi,
                        employee: user,
                        role: curentRole,
                    }
                }
            },
            { $new: true }
        );
    }
    else if (check_approve !== undefined) {
        await Task(connect(DB_CONNECTION, portal)).updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId
            },
            {
                $set: {
                    "evaluations.$.results.$[elem].organizationalUnit": unit,
                    "evaluations.$.results.$[elem].kpis": kpi,
                }
            },
            {
                arrayFilters: [
                    {
                        "elem.employee": user,
                        "elem.role": curentRole,
                    }
                ]
            })
    }


    //cập nhật lại tất cả điểm tự động
    await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId,

        },
        {
            $set: {
                "evaluations.$.results.$[].automaticPoint": automaticPoint
            }
        }
    )

    // update Info task
    let splitterDate = date.split("-");
    let dateISO = new Date(splitterDate[2], splitterDate[1] - 1, splitterDate[0]);
    let monthOfParams = dateISO.getMonth();
    let yearOfParams = dateISO.getFullYear();
    let now = new Date();

    let cloneInfo = task.taskInformations;
    for (let item in info) {
        for (let i in cloneInfo) {
            if (info[item].code === cloneInfo[i].code) {
                cloneInfo[i] = {
                    filledByAccountableEmployeesOnly: cloneInfo[i].filledByAccountableEmployeesOnly,
                    _id: cloneInfo[i]._id,
                    code: cloneInfo[i].code,
                    name: cloneInfo[i].name,
                    description: cloneInfo[i].description,
                    type: cloneInfo[i].type,
                    extra: cloneInfo[i].extra,
                    value: info[item].value
                }
                //quangdz
                if (yearOfParams > now.getFullYear() || (yearOfParams <= now.getFullYear() && monthOfParams >= now.getMonth())) {

                    checkSave && await Task(connect(DB_CONNECTION, portal)).updateOne(
                        {
                            _id: taskId,
                            "taskInformations._id": cloneInfo[i]._id
                        },
                        {
                            $set: {
                                "taskInformations.$.value": cloneInfo[i].value
                            }
                        },
                        {
                            $new: true
                        }
                    )
                }

                await Task(connect(DB_CONNECTION, portal)).updateOne(
                    {
                        _id: taskId,
                        "evaluations._id": evaluateId
                    },
                    {
                        $set: {
                            "evaluations.$.taskInformations.$[elem].value": cloneInfo[i].value
                        }
                    },
                    {
                        arrayFilters: [
                            {
                                "elem._id": cloneInfo[i]._id
                            }
                        ]
                    }

                )
            }
        }
    }

    // cập nhật thông tin result (================END==================)


    // update date of evaluation

    await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId
        },
        {
            $set: {
                "evaluations.$.date": dateFormat
            }
        },
        {
            $new: true
        }
    )

    // update progress of evaluation
    await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId,
        },
        {
            $set: {
                "evaluations.$.progress": progress,
            }
        },
        {
            $new: true,
        }
    );

    // let newTask = await Task(connect(DB_CONNECTION, portal)).findById(taskId);
    let newTask = await Task(connect(DB_CONNECTION, portal)).findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit" },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
        { path: "evaluations.results.employee", select: "name email _id active" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", select: 'name email avatar' },
        { path: "taskActions.comments.creator", select: 'name email avatar' },
        { path: "commentsInProcess.creator", select: 'name email avatar' },
        { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
        { path: "taskComments.creator", select: 'name email avatar' },
        { path: "taskComments.comments.creator", select: 'name email avatar' },
        { path: "documents.creator", select: 'name email avatar' },
        { path: "followingTasks.task" },
        {
            path: "preceedingTasks.task", populate: [
                { path: "commentsInProcess.creator", select: 'name email avatar' },
                { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
            ]
        },
        { path: "hoursSpentOnTask.contributions.employee", select: 'name' },
        {
            path: "process", populate: {
                path: "tasks", populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit" },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
                    { path: "evaluations.results.employee", select: "name email _id active" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", select: 'name email avatar' },
                    { path: "taskActions.comments.creator", select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                    { path: "taskComments.creator", select: 'name email avatar' },
                    { path: "taskComments.comments.creator", select: 'name email avatar' },
                    { path: "documents.creator", select: 'name email avatar' },
                    { path: "process" },
                    { path: "commentsInProcess.creator", select: 'name email avatar' },
                    { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                ]
            }
        },
    ]);
    newTask.evaluations.reverse();

    return newTask;
}

exports.editHoursSpentInEvaluate = async (portal, data, taskId) => {

    let { evaluateId, timesheetLogs } = data;
    let task = await Task(connect(DB_CONNECTION, portal)).findById(taskId);
    let evaluations = task && task.evaluations && task.evaluations.filter(item => {
        if (item._id) {
            return item._id.toString() === evaluateId;
        } else return false
    })
    let results = evaluations && evaluations[0] && evaluations[0].results;

    for (let i in timesheetLogs) {

        let timesheetLog = timesheetLogs[i];
        let { employee, hoursSpent } = timesheetLog;
        let check = true;

        if (results) {
            for (let j = 0; j < results.length; j++) {
                if (results[j].employee && results[j].employee.toString() === employee) {
                    check = false;
                    results[j]["hoursSpent"] = hoursSpent;
                }
            }
        }

        if (check) {
            let employeeHoursSpent = {
                employee: employee,
                hoursSpent: hoursSpent,
            };
            if (!results) {
                results = [];
            }
            results.push(employeeHoursSpent);
        }
    }

    let newTask = await Task(connect(DB_CONNECTION, portal)).findOneAndUpdate(
        { "_id": taskId, "evaluations._id": evaluateId },
        {
            $set:
            {
                "evaluations.$.results": results
            }
        }
    )

    newTask = await Task(connect(DB_CONNECTION, portal)).findById(taskId)
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
            { path: "evaluations.results.employee", select: "name email _id active" },
            { path: "evaluations.results.organizationalUnit", select: "name _id" },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: 'name email avatar' },
            { path: "taskActions.comments.creator", select: 'name email avatar' },
            { path: "commentsInProcess.creator", select: 'name email avatar' },
            { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
            { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
            { path: "taskComments.creator", select: 'name email avatar' },
            { path: "taskComments.comments.creator", select: 'name email avatar' },
            { path: "documents.creator", select: 'name email avatar' },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task", populate: [
                    { path: "commentsInProcess.creator", select: 'name email avatar' },
                    { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                ]
            },
            { path: "hoursSpentOnTask.contributions.employee", select: 'name' },
            {
                path: "process", populate: {
                    path: "tasks", populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
                        { path: "evaluations.results.employee", select: "name email _id active" },
                        { path: "evaluations.results.organizationalUnit", select: "name _id" },
                        { path: "evaluations.results.kpis" },
                        { path: "taskActions.creator", select: 'name email avatar' },
                        { path: "taskActions.comments.creator", select: 'name email avatar' },
                        { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                        { path: "taskComments.creator", select: 'name email avatar' },
                        { path: "taskComments.comments.creator", select: 'name email avatar' },
                        { path: "documents.creator", select: 'name email avatar' },
                        { path: "process" },
                        { path: "commentsInProcess.creator", select: 'name email avatar' },
                        { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                    ]
                }
            },
        ]);
    newTask.evaluations.reverse();

    return newTask;
}

/**
 * Delete evaluations by month
 * @param {*} params 
 */
exports.deleteEvaluation = async (portal, params) => {
    let { taskId, evaluationId } = params;
    await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: taskId },
        { $pull: { evaluations: { _id: evaluationId } } },
        { $new: true }
    )
    // let newTask = await Task(connect(DB_CONNECTION, portal)).findById(taskId);
    let newTask = await Task(connect(DB_CONNECTION, portal)).findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit" },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
        { path: "evaluations.results.employee", select: "name email _id active" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", select: 'name email avatar' },
        { path: "taskActions.comments.creator", select: 'name email avatar' },
        { path: "commentsInProcess.creator", select: 'name email avatar' },
        { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
        { path: "taskComments.creator", select: 'name email avatar' },
        { path: "taskComments.comments.creator", select: 'name email avatar' },
        { path: "documents.creator", select: 'name email avatar' },
        { path: "followingTasks.task" },
        {
            path: "preceedingTasks.task", populate: [
                { path: "commentsInProcess.creator", select: 'name email avatar' },
                { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
            ]
        },
        { path: "hoursSpentOnTask.contributions.employee", select: 'name' },
        {
            path: "process", populate: {
                path: "tasks", populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit" },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
                    { path: "evaluations.results.employee", select: "name email _id active" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", select: 'name email avatar' },
                    { path: "taskActions.comments.creator", select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                    { path: "taskComments.creator", select: 'name email avatar' },
                    { path: "taskComments.comments.creator", select: 'name email avatar' },
                    { path: "documents.creator", select: 'name email avatar' },
                    { path: "process" },
                    { path: "commentsInProcess.creator", select: 'name email avatar' },
                    { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                ]
            }
        },
    ]);
    newTask.evaluations.reverse();

    return newTask;
}


/**
 * Xóa file của hoạt động
 */
exports.deleteFileOfAction = async (portal, params) => {
    let file = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.actionId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
    ])

    fs.unlinkSync(file[0].url)

    let action = await Task(connect(DB_CONNECTION, portal)).update(
        { "_id": params.taskId, "taskActions._id": params.actionId },
        { $pull: { "taskActions.$.files": { _id: params.fileId } } },
        { safe: true }
    )
    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId, "taskActions._id": params.actionId }).populate([
        { path: "taskActions.creator", select: 'name email avatar' },
        { path: "taskActions.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar' }])
    return task.taskActions;
}
/**
 * Xóa file bình luận của hoạt động
 */
exports.deleteFileCommentOfAction = async (portal, params) => {
    let file = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.actionId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { "files._id": mongoose.Types.ObjectId(params.fileId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
    ])
    fs.unlinkSync(file[0].url)

    let action = await Task(connect(DB_CONNECTION, portal)).update(
        { "_id": params.taskId, "taskActions._id": params.actionId },
        { $pull: { "taskActions.$.comments.$[].files": { _id: params.fileId } } },
        { safe: true }
    )

    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId, "taskActions._id": params.actionId }).populate([
        { path: "taskActions.creator", select: 'name email avatar' },
        { path: "taskActions.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar' }])
    return task.taskActions;
}
/**
 * Xóa file trao đổi
 */
exports.deleteFileTaskComment = async (portal, params) => {

    let file = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskComments" },
        { $replaceRoot: { newRoot: "$taskComments" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
    ])

    fs.unlinkSync(file[0].url)

    let action = await Task(connect(DB_CONNECTION, portal)).update(
        { "_id": params.taskId, "taskComments._id": params.commentId },
        { $pull: { "taskComments.$.files": { _id: params.fileId } } },
        { safe: true }
    )
    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId, "taskComments._id": params.commentId }).populate([
        { path: "taskComments.creator", select: 'name email avatar' },
        { path: "taskComments.comments.creator", select: 'name email avatar' },
        { path: "taskComments.evaluations.creator", select: 'name email avatar' }])
    return task.taskComments;
}
/**
 * Xóa file bình luận của bình luận
 */
exports.deleteFileChildTaskComment = async (portal, params) => {
    let file = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskComments" },
        { $replaceRoot: { newRoot: "$taskComments" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { "files._id": mongoose.Types.ObjectId(params.fileId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
    ])

    fs.unlinkSync(file[0].url)

    let action = await Task(connect(DB_CONNECTION, portal)).update(
        { "_id": params.taskId, "taskComments._id": params.commentId },
        { $pull: { "taskComments.$.comments.$[].files": { _id: params.fileId } } },
        { safe: true }
    )

    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId, "taskComments._id": params.commentId }).populate([
        { path: "taskComments.creator", select: 'name email avatar' },
        { path: "taskComments.comments.creator", select: 'name email avatar' },
        { path: "taskComments.evaluations.creator", select: 'name email avatar' }])
    return task.taskComments;
}



/**
 * Gửi email khi kích hoạt công việc
 * @param {*} portal id công ty
 * @param {*} task công việc kích hoạt
 */
exports.sendEmailForActivateTask = async (portal, task) => {
    task = await task.populate("organizationalUnit creator parent").execPopulate();

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });

    var email, userId, user, users, userIds;

    var resId = task.responsibleEmployees;  // lấy id người thực hiện
    var res = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: resId } });
    res = res.map(item => item.name);
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
    user = await User(connect(DB_CONNECTION, portal)).find({
        _id: { $in: userIds }
    })

    email = user.map(item => item.email); // Lấy ra tất cả email của người dùng
    // email.push("trinhhong102@gmail.com");
    var html = `<p>Công việc mà bạn tham gia đã được kích hoạt từ trạng thái đang chờ thành đang thực hiện:  <a href="${process.env.WEBSITE}/task?taskId=${task._id}" target="_blank">${process.env.WEBSITE}/task?taskId=${task._id} </a></p> ` +
        `<h3>Thông tin công việc</h3>` +
        `<p>Tên công việc : <strong>${task.name}</strong></p>` +
        `<p>Mô tả : ${task.description}</p>` +
        `<p>Người thực hiện</p> ` +
        `<ul>${res.map((item) => {
            return `<li>${item}</li>`
        })}
                    </ul>`+
        `<p>Người phê duyệt</p> ` +
        `<ul>${acc.map((item) => {
            return `<li>${item.name}</li>`
        })}
                    </ul>` +
        `${con.length > 0 ? `<p>Người tư vấn</p> ` +
            `<ul>${con.map((item) => {
                return `<li>${item.name}</li>`
            })}
                    </ul>` : ""}` +
        `${inf.length > 0 ? `<p>Người quan sát</p> ` +
            `<ul>${inf.map((item) => {
                return `<li>${item.name}</li>`
            })}
                    </ul>` : ""}`
        ;

    return { task: task, user: userIds, email: email, html: html };
}

/**
 * edit status of task 
 * @param taskID id công việc
 * @param body trang thai công việc
 */
exports.editActivateOfTask = async (portal, taskID, body) => {
    let today = new Date();
    let mailArr = [];

    // Cập nhật trạng thái hoạt động của các task sau
    for (let i = 0; i < body.listSelected.length; i++) {
        let listTask = await Task(connect(DB_CONNECTION, portal)).find({ "followingTasks.task": body.listSelected[i] });

        for (let x in listTask) {
            await Task(connect(DB_CONNECTION, portal)).update(
                {
                    _id: listTask[x]._id,
                    "followingTasks.task": body.listSelected[i],
                },
                {
                    $set: {
                        "followingTasks.$.activated": true,
                    }
                },
            )
        }

        let followStartDate = today;

        let followItem = await Task(connect(DB_CONNECTION, portal)).findById(body.listSelected[i]);
        let startDateItem = followItem.startDate;
        let endDateItem = followItem.endDate;
        let dayTaken = endDateItem.getTime() - startDateItem.getTime();

        let timer = followStartDate.getTime() + dayTaken;
        let followEndDate = new Date(timer).toISOString();

        await Task(connect(DB_CONNECTION, portal)).findByIdAndUpdate(body.listSelected[i],
            {
                $set: {
                    status: "inprocess",
                    startDate: followStartDate,
                    endDate: followEndDate,
                }
            }
        )

        let x = await this.sendEmailForActivateTask(portal, followItem);

        mailArr.push(x);
    }

    let task = await Task(connect(DB_CONNECTION, portal)).findById(taskID).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit" },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
        { path: "evaluations.results.employee", select: "name email _id active" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", select: 'name email avatar' },
        { path: "taskActions.comments.creator", select: 'name email avatar' },
        { path: "commentsInProcess.creator", select: 'name email avatar' },
        { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
        { path: "taskComments.creator", select: 'name email avatar' },
        { path: "taskComments.comments.creator", select: 'name email avatar' },
        { path: "documents.creator", select: 'name email avatar' },
        { path: "followingTasks.task" },
        {
            path: "preceedingTasks.task", populate: [
                { path: "commentsInProcess.creator", select: 'name email avatar' },
                { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
            ]
        },
        { path: "hoursSpentOnTask.contributions.employee", select: 'name' },
        {
            path: "process", populate: {
                path: "tasks", populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit" },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
                    { path: "evaluations.results.employee", select: "name email _id active" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", select: 'name email avatar' },
                    { path: "taskActions.comments.creator", select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                    { path: "taskComments.creator", select: 'name email avatar' },
                    { path: "taskComments.comments.creator", select: 'name email avatar' },
                    { path: "documents.creator", select: 'name email avatar' },
                    { path: "process" },
                    { path: "commentsInProcess.creator", select: 'name email avatar' },
                    { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                ]
            }
        },
    ]);
    task.evaluations.reverse();

    return { task: task, mailInfo: mailArr }
}

/** Xác nhận công việc */
exports.confirmTask = async (portal, taskId, userId) => {

    let confirmedByEmployee = await Task(connect(DB_CONNECTION, portal)).findByIdAndUpdate(taskId,
        { $push: { confirmedByEmployees: userId } }
    )

    let task = await this.getTaskById(portal, taskId, userId);
    return task;
}

/** Chỉnh sửa taskInformation của task */
exports.editTaskInformation = async (portal, taskId, userId, taskInformations) => {
    let information;

    if (taskInformations && taskInformations.length !== 0) {
        for (let i = 0; i < taskInformations.length; i++) {
            information = await Task(connect(DB_CONNECTION, portal)).updateOne(
                { "_id": taskId, "taskInformations._id": taskInformations[i]._id },
                {
                    $set:
                    {
                        "taskInformations.$.description": taskInformations[i].description,
                        "taskInformations.$.name": taskInformations[i].name,
                        "taskInformations.$.type": taskInformations[i].type,
                        "taskInformations.$.isOutput": taskInformations[i].isOutput
                    }
                }
            )
        }
    }

    let task = await this.getTaskById(portal, taskId, userId);
    return task;
}

/**
 * Chinh sua trang thai luu kho cua cong viec
 * @param taskID id công việc
 */
exports.editArchivedOfTask = async (portal, taskID) => {
    let t = await Task(connect(DB_CONNECTION, portal)).findByIdAndUpdate(taskID);
    let isArchived = t.isArchived;

    let task = await Task(connect(DB_CONNECTION, portal)).findByIdAndUpdate(taskID,
        { $set: { isArchived: !isArchived } },
        { new: true }
    );

    return task;
}

/**
 * Xoa file cua task
 */
exports.deleteFileTask = async (portal, params) => {
    let file = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$documents" },
        { $replaceRoot: { newRoot: "$documents" } },
        { $match: { _id: mongoose.Types.ObjectId(params.documentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { _id: mongoose.Types.ObjectId(params.fileId) } }
    ])
    fs.unlinkSync(file[0].url)

    let task = await Task(connect(DB_CONNECTION, portal)).update(
        { "_id": params.taskId, "documents._id": params.documentId, "documents.files._id": params.fileId },
        { $pull: { "documents.$.files": { "_id": params.fileId } } },
        { safe: true }
    )
    let task1 = await Task(connect(DB_CONNECTION, portal)).findById({ _id: params.taskId }).populate([
        { path: "documents.creator", select: 'name email avatar' },
    ]);

    return task1.documents;
}

/**
 * Xoa document cua task
 */
exports.deleteDocument = async (portal, params) => {
    let files = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$documents" },
        { $replaceRoot: { newRoot: "$documents" } },
        { $match: { _id: mongoose.Types.ObjectId(params.documentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
    ])
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }

    let task = await Task(connect(DB_CONNECTION, portal)).update(
        { "_id": params.taskId, "documents._id": params.documentId },
        { $pull: { "documents": { "_id": params.documentId } } },
        { safe: true }
    )
    let task1 = await Task(connect(DB_CONNECTION, portal)).findById({ _id: params.taskId }).populate([
        { path: "documents.creator", select: 'name email avatar' },
    ]);

    return task1.documents;
}
/**
 * Sua document
 */
exports.editDocument = async (portal, taskId, documentId, body, files) => {
    let document;

    if (documentId) {
        document = await Task(connect(DB_CONNECTION, portal)).updateOne(
            { "_id": taskId, "documents._id": documentId },
            {
                $set:
                {
                    "documents.$.description": body.description,
                    "documents.$.isOutput": body.isOutput
                },

                $push:
                {
                    "documents.$.files": files
                }
            }
        )
    } else {
        if (body && body.length !== 0) {
            for (let i = 0; i < body.length; i++) {
                document = await Task(connect(DB_CONNECTION, portal)).updateOne(
                    { "_id": taskId, "documents._id": body[i]._id },
                    {
                        $set:
                        {
                            "documents.$.description": body[i].description,
                            "documents.$.isOutput": body[i].isOutput
                        },

                        $push:
                        {
                            "documents.$.files": files
                        }
                    }
                )
            }
        }
    }

    let task = await Task(connect(DB_CONNECTION, portal)).findById({ _id: taskId }).populate([
        { path: "documents.creator", select: 'name email avatar' },
    ]);

    return task.documents
}

// exports.activateFollowingTask = async (taskId, activateTasks) => {
//     for(let i in activateTasks) {
//         await Task(connect(DB_CONNECTION, portal)).findOneAndUpdate(
//             {
//                 _id: taskId,
//                 "followingTasks.task": activateTasks[i],
//             },
//             {
//                 $set: {
//                     "followingTasks.$.activated": true,
//                 }
//             },
//         )
//     }
// }




/**
 *  thêm bình luận
 */
exports.createComment = async (portal, params, body, files) => {
    const commentss = {
        description: body.description,
        creator: body.creator,
        files: files
    }
    let comment1 = await Task(connect(DB_CONNECTION, portal)).update(
        { _id: params.taskId },
        { $push: { commentsInProcess: commentss } }, { new: true }
    )
    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ _id: params.taskId })
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
            { path: "evaluations.results.employee", select: "name email _id active" },
            { path: "evaluations.results.organizationalUnit", select: "name _id" },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: 'name email avatar' },
            { path: "taskActions.comments.creator", select: 'name email avatar' },
            { path: "commentsInProcess.creator", select: 'name email avatar' },
            { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
            { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
            { path: "taskComments.creator", select: 'name email avatar' },
            { path: "taskComments.comments.creator", select: 'name email avatar' },
            { path: "documents.creator", select: 'name email avatar' },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task", populate: [
                    { path: "commentsInProcess.creator", select: 'name email avatar' },
                    { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                ]
            },
            { path: "hoursSpentOnTask.contributions.employee", select: 'name' },
            {
                path: "process", populate: {
                    path: "tasks", populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
                        { path: "evaluations.results.employee", select: "name email _id active" },
                        { path: "evaluations.results.organizationalUnit", select: "name _id" },
                        { path: "evaluations.results.kpis" },
                        { path: "taskActions.creator", select: 'name email avatar' },
                        { path: "taskActions.comments.creator", select: 'name email avatar' },
                        { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                        { path: "taskComments.creator", select: 'name email avatar' },
                        { path: "taskComments.comments.creator", select: 'name email avatar' },
                        { path: "documents.creator", select: 'name email avatar' },
                        { path: "process" },
                        { path: "commentsInProcess.creator", select: 'name email avatar' },
                        { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                    ]
                }
            },
        ])
    return task;
}


/**
 * Sửa bình luận
 */
exports.editComment = async (portal, params, body, files) => {
    let commentss = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { "_id": params.taskId, "commentsInProcess._id": params.commentId },
        {
            $set: { "commentsInProcess.$.description": body.description }
        }
    )

    let comment1 = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { "_id": params.taskId, "commentsInProcess._id": params.commentId },
        {
            $push:
            {
                "commentsInProcess.$.files": files
            }
        }
    )
    let comment = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId })
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
            { path: "evaluations.results.employee", select: "name email _id active" },
            { path: "evaluations.results.organizationalUnit", select: "name _id" },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: 'name email avatar' },
            { path: "taskActions.comments.creator", select: 'name email avatar' },
            { path: "commentsInProcess.creator", select: 'name email avatar' },
            { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
            { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
            { path: "taskComments.creator", select: 'name email avatar' },
            { path: "taskComments.comments.creator", select: 'name email avatar' },
            { path: "documents.creator", select: 'name email avatar' },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task", populate: [
                    { path: "commentsInProcess.creator", select: 'name email avatar' },
                    { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                ]
            },
            { path: "hoursSpentOnTask.contributions.employee", select: 'name' },
            {
                path: "process", populate: {
                    path: "tasks", populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
                        { path: "evaluations.results.employee", select: "name email _id active" },
                        { path: "evaluations.results.organizationalUnit", select: "name _id" },
                        { path: "evaluations.results.kpis" },
                        { path: "taskActions.creator", select: 'name email avatar' },
                        { path: "taskActions.comments.creator", select: 'name email avatar' },
                        { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                        { path: "taskComments.creator", select: 'name email avatar' },
                        { path: "taskComments.comments.creator", select: 'name email avatar' },
                        { path: "documents.creator", select: 'name email avatar' },
                        { path: "process" },
                        { path: "commentsInProcess.creator", select: 'name email avatar' },
                        { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                    ]
                }
            },
        ])
    return comment;
}

/**
 * Delete comment
 */
exports.deleteComment = async (portal, params) => {
    let files1 = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$commentsInProcess" },
        { $replaceRoot: { newRoot: "$commentsInProcess" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
    ])

    let files2 = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$commentsInProcess" },
        { $replaceRoot: { newRoot: "$commentsInProcess" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } }
    ])
    let files = [...files1, ...files2]
    let i
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }
    let comments = await Task(connect(DB_CONNECTION, portal)).update(
        { "_id": params.taskId, "commentsInProcess._id": params.commentId },
        { $pull: { commentsInProcess: { _id: params.commentId } } },
        { safe: true })
    let comment = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId })
        .populate([
            { path: 'commentsInProcess.creator', select: 'name email avatar ' },
            { path: 'commentsInProcess.comments.creator', select: 'name email avatar' }
        ])
    return comment
}

/**
 *  thêm bình luận cua binh luan
 */
exports.createChildComment = async (portal, params, body, files) => {
    let commentss = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { "_id": params.taskId, "commentsInProcess._id": params.commentId },
        {
            "$push": {
                "commentsInProcess.$.comments":
                {
                    creator: body.creator,
                    description: body.description,
                    files: files
                }
            }
        }
    )
    let comment = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId })
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
            { path: "evaluations.results.employee", select: "name email _id active" },
            { path: "evaluations.results.organizationalUnit", select: "name _id" },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: 'name email avatar' },
            { path: "taskActions.comments.creator", select: 'name email avatar' },
            { path: "commentsInProcess.creator", select: 'name email avatar' },
            { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
            { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
            { path: "taskComments.creator", select: 'name email avatar' },
            { path: "taskComments.comments.creator", select: 'name email avatar' },
            { path: "documents.creator", select: 'name email avatar' },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task", populate: [
                    { path: "commentsInProcess.creator", select: 'name email avatar' },
                    { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                ]
            },
            { path: "hoursSpentOnTask.contributions.employee", select: 'name' },
            {
                path: "process", populate: {
                    path: "tasks", populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
                        { path: "evaluations.results.employee", select: "name email _id active" },
                        { path: "evaluations.results.organizationalUnit", select: "name _id" },
                        { path: "evaluations.results.kpis" },
                        { path: "taskActions.creator", select: 'name email avatar' },
                        { path: "taskActions.comments.creator", select: 'name email avatar' },
                        { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                        { path: "taskComments.creator", select: 'name email avatar' },
                        { path: "taskComments.comments.creator", select: 'name email avatar' },
                        { path: "documents.creator", select: 'name email avatar' },
                        { path: "process" },
                        { path: "commentsInProcess.creator", select: 'name email avatar' },
                        { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                    ]
                }
            },
        ])
    return comment;
}
/**
 * Edit comment of comment
 */
exports.editChildComment = async (portal, params, body, files) => {
    let now = new Date()
    let comment1 = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { "_id": params.taskId, "commentsInProcess._id": params.commentId, "commentsInProcess.comments._id": params.childCommentId },
        {
            $set:
            {
                "commentsInProcess.$.comments.$[elem].description": body.description,
                "commentsInProcess.$.comments.$[elem].updatedAt": now
            }
        },
        {
            arrayFilters: [
                {
                    "elem._id": params.childCommentId
                }
            ]
        }
    )
    let action1 = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { "_id": params.taskId, "commentsInProcess._id": params.commentId, "commentsInProcess.comments._id": params.childCommentId },
        {
            $push:
            {
                "commentsInProcess.$.comments.$[elem].files": files
            }
        },
        {
            arrayFilters:
                [
                    {
                        "elem._id": params.childCommentId
                    }
                ]
        }
    )


    let comment = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId })
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
            { path: "evaluations.results.employee", select: "name email _id active" },
            { path: "evaluations.results.organizationalUnit", select: "name _id" },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: 'name email avatar' },
            { path: "taskActions.comments.creator", select: 'name email avatar' },
            { path: "commentsInProcess.creator", select: 'name email avatar' },
            { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
            { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
            { path: "taskComments.creator", select: 'name email avatar' },
            { path: "taskComments.comments.creator", select: 'name email avatar' },
            { path: "documents.creator", select: 'name email avatar' },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task", populate: [
                    { path: "commentsInProcess.creator", select: 'name email avatar' },
                    { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                ]
            },
            { path: "hoursSpentOnTask.contributions.employee", select: 'name' },
            {
                path: "process", populate: {
                    path: "tasks", populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id active" },
                        { path: "evaluations.results.employee", select: "name email _id active" },
                        { path: "evaluations.results.organizationalUnit", select: "name _id" },
                        { path: "evaluations.results.kpis" },
                        { path: "taskActions.creator", select: 'name email avatar' },
                        { path: "taskActions.comments.creator", select: 'name email avatar' },
                        { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                        { path: "taskComments.creator", select: 'name email avatar' },
                        { path: "taskComments.comments.creator", select: 'name email avatar' },
                        { path: "documents.creator", select: 'name email avatar' },
                        { path: "process" },
                        { path: "commentsInProcess.creator", select: 'name email avatar' },
                        { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                    ]
                }
            },
        ])
    return comment;
}

/**
 * Delete comment of comment
 */
exports.deleteChildComment = async (portal, params) => {
    let files = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$commentsInProcess" },
        { $replaceRoot: { newRoot: "$commentsInProcess" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.childCommentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } }
    ])
    let i = 0
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }
    let comment1 = await Task(connect(DB_CONNECTION, portal)).update(
        { "_id": params.taskId, "commentsInProcess._id": params.commentId, "commentsInProcess.comments._id": params.childCommentId },
        { $pull: { "commentsInProcess.$.comments": { _id: params.childCommentId } } },
        { safe: true })

    let comment = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId, "commentsInProcess._id": params.commentId, })
        .populate([
            { path: 'commentsInProcess.creator', select: 'name email avatar ' },
            { path: 'commentsInProcess.comments.creator', select: 'name email avatar' }
        ])

    return comment
}

/**
 * Xóa file của bình luận
 */
exports.deleteFileComment = async (portal, params) => {
    let file = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$commentsInProcess" },
        { $replaceRoot: { newRoot: "$commentsInProcess" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
    ])
    fs.unlinkSync(file[0].url)

    let comment1 = await Task(connect(DB_CONNECTION, portal)).update(
        { "_id": params.taskId, "commentsInProcess._id": params.commentId },
        { $pull: { "commentsInProcess.$.files": { _id: params.fileId } } },
        { safe: true }
    )
    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId, "commentsInProcess._id": params.commentId }).populate([
        { path: "commentsInProcess.creator", select: 'name email avatar' },
        { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
    ]);

    return task;
}

/**
 * Xóa file bình luận con
 */
exports.deleteFileChildComment = async (portal, params) => {
    let file = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$commentsInProcess" },
        { $replaceRoot: { newRoot: "$commentsInProcess" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.childCommentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
    ]);

    fs.unlinkSync(file[0].url);

    let action = await Task(connect(DB_CONNECTION, portal)).update(
        { "_id": params.taskId, "commentsInProcess._id": params.commentId },
        { $pull: { "commentsInProcess.$.comments.$[].files": { _id: params.fileId } } },
        { safe: true }
    );

    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId, "commentsInProcess._id": params.commentId },).populate([
        { path: "commentsInProcess.creator", select: 'name email avatar' },
        { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
    ]);
    return task;
}

exports.getAllPreceedingTasks = async (portal, params) => {
    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ "_id": params.taskId })
        .populate([
            {
                path: "preceedingTasks.task", populate: [
                    { path: "commentsInProcess.creator", select: 'name email avatar' },
                    { path: "commentsInProcess.comments.creator", select: 'name email avatar' },
                ]
            },
        ])
    return task.preceedingTasks
}
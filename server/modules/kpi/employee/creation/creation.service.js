const mongoose = require('mongoose');
const Models = require(`${SERVER_MODELS_DIR}`);
const fs = require('fs');
const { EmployeeKpi, EmployeeKpiSet, OrganizationalUnit, OrganizationalUnitKpiSet, User, taskCommentModel } = Models;
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

// File này làm nhiệm vụ thao tác với cơ sở dữ liệu của module quản lý kpi cá nhân

/*Lấy tập KPI cá nhân hiện tại theo người dùng */
exports.getEmployeeKpiSet = async (portal, id, role, month) => {

    let now = new Date(month);
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth();
    let endOfCurrentMonth = new Date(currentYear, currentMonth + 1);
    let endOfLastMonth = new Date(currentYear, currentMonth);

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


    let department = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({
        $or: [
            { deans: role },
            { viceDeans: role },
            { employees: role }
        ]
    });

    if (!department) {
        return null;
    }

    let employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ creator: id, organizationalUnit: department._id, status: { $ne: 3 }, date: { $lte: endOfCurrentMonth, $gt: endOfLastMonth } })
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])


    return employeeKpiSet;
}

/* Lấy tất cả các tập KPI của 1 nhân viên theo thời gian cho trước */
exports.getAllEmployeeKpiSetByMonth = async (portal, organizationalUnitIds, userId, startDate, endDate) => {
    let employeeKpiSetByMonth = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .find(
            {
                organizationalUnit: { $in: [...organizationalUnitIds] },
                creator: new mongoose.Types.ObjectId(userId),
                date: { $gt: new Date(startDate), $lte: new Date(endDate) }
            })
        .populate({ path: "organizationalUnit", select: "name" })
        .select({ 'automaticPoint': 1, 'employeePoint': 1, 'approvedPoint': 1, 'date': 1 })

    return employeeKpiSetByMonth;
}

/* Lấy tất cả các tập KPI của tất cả nhân viên trong mảng đơn vị cho trước theo thời gian */
exports.getAllEmployeeKpiSetOfAllEmployeeInOrganizationalUnitByMonth = async (portal, organizationalUnitIds, startDate, endDate) => {

    let organizationalUnitIdsArray = organizationalUnitIds.map(item => { return new mongoose.Types.ObjectId(item) });

    const employeeKpiSetsInOrganizationalUnitByMonth = await EmployeeKpiSet(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { 'organizationalUnit': { $in: [...organizationalUnitIdsArray] } } },

        // Thời gian lấy chưa tính tháng hiện tại(ví dụ endDate là 2020-8 thì service trả về k bao gồm kpi tháng 8)
        { $match: { 'date': { $gt: new Date(startDate), $lte: new Date(endDate) } } },

        {
            $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as: "employee"
            }
        },
        { $unwind: "$employee" },

        {
            $lookup: {
                from: "organizationalunits",
                localField: "organizationalUnit",
                foreignField: "_id",
                as: "organizationalUnit"
            }
        },
        { $unwind: "$organizationalUnit" },

        {
            $addFields: { "employeeAndUnit": { $concat: ["$employee.name", " - ", "$organizationalUnit.name"] } }
        },

        {
            $group: {
                '_id': "$employeeAndUnit",
                'employeeKpi': { $push: "$$ROOT" }
            }
        },

        { $project: { 'employeeKpi.automaticPoint': 1, 'employeeKpi.employeePoint': 1, 'employeeKpi.approvedPoint': 1, 'employeeKpi.date': 1 } }
    ])

    return employeeKpiSetsInOrganizationalUnitByMonth;
}

/* Khởi tạo tập KPI cá nhân */
exports.createEmployeeKpiSet = async (portal, data) => {
    let organizationalUnitId = data.organizationalUnit;
    let creatorId = data.creator;
    let approverId = data.approver;
    let dateId = data.date;

    let currentMonth = data.date.slice(3, 7) + '-' + data.date.slice(0, 2);
    let nextMonth;
    if (new Number(data.date.slice(0, 2)) < 12) {
        if (new Number(data.date.slice(0, 2)) < 10) {
            nextMonth = data.date.slice(3, 7) + '-0' + (new Number(data.date.slice(0, 2)) + 1);
        } else {
            nextMonth = data.date.slice(3, 7) + '-' + (new Number(data.date.slice(0, 2)) + 1);
        }
    } else {
        nextMonth = (new Number(data.date.slice(3, 7)) + 1) + '-01';
    }

    // Tìm kiếm danh sách các mục tiêu mặc định của phòng ban
    let organizationalUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .findOne({
            organizationalUnit: organizationalUnitId,
            status: 1,
            date: {
                $gte: currentMonth, $lt: nextMonth
            }
        })
        .populate("kpis");//status = 1 là kpi đã đc phê duyệt

    let defaultOrganizationalUnitKpi;
    if (organizationalUnitKpiSet.kpis) defaultOrganizationalUnitKpi = organizationalUnitKpiSet.kpis.filter(item => item.type !== 0);
    if (defaultOrganizationalUnitKpi !== []) {

        let time = dateId.split("-");
        let date = new Date(time[1], time[0], 0);

        // Tạo thông tin chung cho KPI cá nhân
        let employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
            .create({
                organizationalUnit: organizationalUnitId,
                creator: creatorId,
                approver: approverId,
                date: date,
                kpis: []
            });
        let defaultEmployeeKpi = await Promise.all(defaultOrganizationalUnitKpi.map(async (item) => {
            let defaultT = await EmployeeKpi(connect(DB_CONNECTION, portal)).create({
                name: item.name,
                parent: item._id,
                weight: 5,
                criteria: item.criteria,
                status: null,
                type: item.type
            })
            return defaultT._id;
        }));
        employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
            .findByIdAndUpdate(
                employeeKpiSet, { kpis: defaultEmployeeKpi }, { new: true }
            )
        employeeKpiSet = employeeKpiSet && await employeeKpiSet
            .populate("organizationalUnit creator approver")
            .populate({ path: "kpis", populate: { path: 'parent' } })
            .execPopulate();

        return employeeKpiSet;
    } else {
        return null;
    }
}

/* Thêm mục tiêu cho KPI cá nhân */
exports.createEmployeeKpi = async (portal, data) => {
    // Thiết lập mục tiêu cho KPI cá nhân
    let employeeKpi = await EmployeeKpi(connect(DB_CONNECTION, portal))
        .create({
            name: data.name,
            parent: data.parent,
            weight: data.weight,
            criteria: data.criteria
        })
    const employeeKpiSetId = data.employeeKpiSet;
    let employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(
            employeeKpiSetId, { $push: { kpis: employeeKpi._id } }, { new: true }
        );
    employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findById(employeeKpiSetId)
        .populate('creator approver organizationalUnit')
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])

    return employeeKpiSet;
}

/* Xóa mục tiêu của KPI cá nhân */
exports.deleteEmployeeKpi = async (portal, id, employeeKpiSetId) => {

    let employeeKpi = await EmployeeKpi(connect(DB_CONNECTION, portal)).findByIdAndDelete(id);

    let employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(employeeKpiSetId, { $pull: { kpis: id } }, { new: true })

    employeeKpiSet = employeeKpiSet && await employeeKpiSet
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .execPopulate();

    return employeeKpiSet;
}

/* Chỉnh sửa trạng thái KPI: yêu cầu phê duyệt, hủy bỏ yêu cầu phê duyệt, khóa KPI */
exports.updateEmployeeKpiSetStatus = async (portal, id, statusId) => {

    let employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(id, { $set: { status: statusId } }, { new: true })

    employeeKpiSet = employeeKpiSet && await employeeKpiSet
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .execPopulate();

    return employeeKpiSet;
}

/* Chỉnh sửa thông tin chung của KPI cá nhân */
exports.editEmployeeKpiSet = async (portal, strDate, approver, id) => {
    let arr = strDate.split("-");
    let date = new Date(arr[1], arr[0], 0)
    let employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(id, { $set: { date: date, approver: approver._id } }, { new: true })

    employeeKpiSet = employeeKpiSet && await employeeKpiSet
        .populate("organizationalUnit creator approver ")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
        .execPopulate();

    return employeeKpiSet;
}

/* Xóa toàn bộ KPI cá nhân */
exports.deleteEmployeeKpiSet = async (portal, id) => {

    let files1 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(id) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $unwind: "$files" },
            { $replaceRoot: { newRoot: "$files" } },
        ])

    let files2 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(id) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
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


    let kpis = [];
    let employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal)).findById(id);
    if (employeeKpiSet.kpis) kpis = employeeKpiSet.kpis;
    if (kpis !== []) {
        kpis = await Promise.all(kpis.map(async (item) => {
            return EmployeeKpi(connect(DB_CONNECTION, portal)).findByIdAndDelete(item._id);
        }))
    }
    employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal)).findByIdAndDelete(id);
    return [employeeKpiSet, kpis]
}

/**
 *  thêm bình luận
 */
exports.createComment = async (portal, params, body, files) => {
    const commentss = {
        description: body.description,
        creator: body.creator,
        files: files
    }
    let comment1 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .update(
            { _id: params.kpiId },
            { $push: { comments: commentss } }, { new: true }
        )
    let comment = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.kpiId })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' }
        ])
    return comment.comments;
}


/**
 * Sửa bình luận
 */
exports.editComment = async (portal, params, body, files) => {
    let commentss = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .updateOne(
            { "_id": params.kpiId, "comments._id": params.commentId },
            {
                $set: { "comments.$.description": body.description }
            }
        )

    let comment1 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .updateOne(
            { "_id": params.kpiId, "comments._id": params.commentId },
            {
                $push:
                {
                    "comments.$.files": files
                }
            }
        )
    let comment = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ "_id": params.kpiId, "comments._id": params.commentId })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
    return comment.comments;
}

/**
 * Delete comment
 */
exports.deleteComment = async (portal, params) => {
    let files1 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(params.kpiId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
            { $unwind: "$files" },
            { $replaceRoot: { newRoot: "$files" } },
        ])

    let files2 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(params.kpiId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
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
    let comments = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .update(
            { "_id": params.kpiId, "comments._id": params.commentId },
            { $pull: { comments: { _id: params.commentId } } },
            { safe: true }
        )
    let comment = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ "_id": params.kpiId })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
    return comment.comments
}

/**
 *  thêm bình luận cua binh luan
 */
exports.createChildComment = async (portal, params, body, files) => {
    let commentss = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .updateOne(
            { "_id": params.kpiId, "comments._id": params.commentId },
            {
                "$push": {
                    "comments.$.comments":
                    {
                        creator: body.creator,
                        description: body.description,
                        files: files
                    }
                }
            }
        )
    let comment = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ "_id": params.kpiId, "comments._id": params.commentId })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
    return comment.comments;
}
/**
 * Edit comment of comment
 */
exports.editChildComment = async (portal, params, body, files) => {
    let now = new Date()
    let comment1 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .updateOne(
            { "_id": params.kpiId, "comments._id": params.commentId, "comments.comments._id": params.childCommentId },
            {
                $set:
                {
                    "comments.$.comments.$[elem].description": body.description,
                    "comments.$.comments.$[elem].updatedAt": now
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
    let action1 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .updateOne(
            { "_id": params.kpiId, "comments._id": params.commentId, "comments.comments._id": params.childCommentId },
            {
                $push:
                {
                    "comments.$.comments.$[elem].files": files
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


    let comment = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ "_id": params.kpiId, "comments._id": params.commentId, "comments.comments._id": params.childCommentId })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
    return comment.comments
}

/**
 * Delete comment of comment
 */
exports.deleteChildComment = async (portal, params) => {
    let files = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(params.kpiId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
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
    let comment1 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .update(
            { "_id": params.kpiId, "comments._id": params.commentId, "comments.comments._id": params.childCommentId },
            { $pull: { "comments.$.comments": { _id: params.childCommentId } } },
            { safe: true }
        )

    let comment = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ "_id": params.kpiId, "comments._id": params.commentId, })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])

    return comment.comments
}

/**
 * Xóa file của bình luận
 */
exports.deleteFileComment = async (portal, params) => {
    let file = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(params.kpiId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
            { $unwind: "$files" },
            { $replaceRoot: { newRoot: "$files" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
        ])
    fs.unlinkSync(file[0].url)

    let comment1 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .update(
            { "_id": params.kpiId, "comments._id": params.commentId },
            { $pull: { "comments.$.files": { _id: params.fileId } } },
            { safe: true }
        )
    let task = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ "_id": params.kpiId, "comments._id": params.commentId })
        .populate([
            { path: "comments.creator", select: 'name email avatar' },
            { path: "comments.comments.creator", select: 'name email avatar' },
        ]);

    return task.comments;
}

/**
 * Xóa file bình luận con
 */
exports.deleteFileChildComment = async (portal, params) => {
    let file = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(params.kpiId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.childCommentId) } },
            { $unwind: "$files" },
            { $replaceRoot: { newRoot: "$files" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
        ]);

    fs.unlinkSync(file[0].url);

    let action = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .update(
            { "_id": params.kpiId, "comments._id": params.commentId },
            { $pull: { "comments.$.comments.$[].files": { _id: params.fileId } } },
            { safe: true }
        );

    let task = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ "_id": params.kpiId, "comments._id": params.commentId },)
        .populate([
            { path: "comments.creator", select: 'name email avatar' },
            { path: "comments.comments.creator", select: 'name email avatar' },
        ]);

    return task.comments;
}
const {
    Employee,
    AnnualLeave,
    Major,
    Task,
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);


/**
 * Lấy danh sách thông tin nghỉ phép
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.searchMajor = async (portal, params) => {
    let keySearch = {};

    if (params.majorName) {
        keySearch = {
            ...keySearch,
            "group.specialized.name": {
                $regex: params.majorName,
                $options: "i",
            }
        };
    }
    let task = await Task(connect(DB_CONNECTION, portal)).find({});
    console.log('key', params, keySearch, portal, task.length);


    let listMajor = await Major(connect(DB_CONNECTION, portal)).find(keySearch)
        .sort({
            'createdAt': 'desc'
        }).skip(params.limit * (params.page - 1)).limit(params.limit);
    let totalList = await Major(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    return {
        totalList,
        listMajor
    }
}

/**
 * Thêm mới thông tin nghỉ phép
 * @data : dữ liệu chuyên ngành tương đương mới
 * 
 */
exports.createNewAdditionalMajor = async (portal, data) => {
    // Tạo mới thông tin nghỉ phép vào database
    let AdditionalMajor = await Major(connect(DB_CONNECTION, portal)).find(
        {
            _id: data.majorID,
            "group._id": data.groupId,
        },
        {
            $push: {
                "group.$.specialized": {
                    name: data.name,
                    type: 0,
                }
            }
        }
    );

    return await Major(connect(DB_CONNECTION, portal)).find({})
}

/**
 * Xoá thông tin nghỉ phép
 * @id : Id nghỉ phép muốn xoá
 */
exports.deleteAnnualLeave = async (portal, id) => {
    return await AnnualLeave(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: id
    });
}

/**
 * Cập nhật thông tin nghỉ phép
 * @id : Id nghỉ phép muốn chỉnh sửa
 * @data : Dữ liệu thay đổi
 */
exports.updateAnnualLeave = async (portal, id, data) => {
    let annualLeave = await AnnualLeave(connect(DB_CONNECTION, portal)).findById(id);

    annualLeave.startDate = data.startDate;
    annualLeave.status = data.status;
    annualLeave.endDate = data.endDate;
    annualLeave.reason = data.reason;
    await annualLeave.save();

    return await AnnualLeave(connect(DB_CONNECTION, portal)).findOne({
        _id: id
    }).populate([{
        path: 'employee',
        select: 'emailInCompany fullName employeeNumber'
    }]);
}
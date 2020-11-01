const {
    CareerPosition,
    AnnualLeave
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);



/**
 * Lấy danh sách thông tin nghỉ phép
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.searchCareerPosition = async (portal, params) => {
    let keySearch = {};

    if (params.name) {
        keySearch = {
            ...keySearch,
            "position.description.name": {
                $regex: params.name,
                $options: "i",
            }
        };
    }
    console.log('key', params, keySearch, portal);

    let listPosition = await CareerPosition(connect(DB_CONNECTION, portal)).find(keySearch)
        .sort({
            'createdAt': 'desc'
        }).skip(params.limit * (params.page - 1)).limit(params.limit);
    let totalList = await CareerPosition(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    return {
        totalList,
        listPosition
    }
}

/**
 * Thêm mới thông tin nghỉ phép
 * @data : dữ liệu chuyên ngành tương đương mới
 * 
 */
exports.createNewAdditionalCareerPosition = async (portal, data) => {
    // Tạo mới thông tin nghỉ phép vào database
    let AdditionalMajor = await CareerPosition(connect(DB_CONNECTION, portal)).find(
        {
            _id: data.majorID,
            "position._id": data.groupId,
        },
        {
            $push: {
                "position.$.description": {
                    name: data.name,
                    type: 0,
                }
            }
        }
    );

    return await CareerPosition(connect(DB_CONNECTION, portal)).find({})
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
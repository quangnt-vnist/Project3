const {
    EducationProgram,
    Course,
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);


/**
 * Lấy danh sách tất cả các chương trình đào tạo
 * @company : Id công ty
 */
exports.getAllEducationPrograms = async (portal, company) => {
    return await EducationProgram(connect(DB_CONNECTION, portal)).find({
        company: company
    })
}

/**
 * Lấy danh sách chương trinh đào tạo theo key
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty
 */
exports.searchEducationPrograms = async (portal, params, company) => {
    let keySearch = {
        company: company
    }
    // Bắt sựu kiện tìm kiếm theo đơn vị áp dụng
    if (params.organizationalUnit) {
        keySearch = {
            ...keySearch,
            applyForOrganizationalUnits: {
                $in: params.organizationalUnit
            }
        }
    }
    // Bắt sựu kiện tìm kiếm theo chức vụ áp dụng
    if (params.position) {
        keySearch = {
            ...keySearch,
            applyForPositions: {
                $in: params.position
            }
        }
    }

    let totalList = await EducationProgram(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let educations = await EducationProgram(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip(params.page).limit(params.limit)
        .populate([{
            path: 'applyForOrganizationalUnits',
        }, {
            path: 'applyForPositions',
        }]);
    let listEducations = []

    for (let n in educations) {
        let total = await Course(connect(DB_CONNECTION, portal)).countDocuments({
            educationProgram: educations[n]._id
        });

        let listCourses = await Course(connect(DB_CONNECTION, portal)).find({
            educationProgram: educations[n]._id
        }).skip(0).limit(5)

        listEducations[n] = {
            ...educations[n]._doc,
            listCourses: listCourses,
            totalList: total
        }
    }

    return {
        totalList,
        listEducations
    }
}

/**
 * Thêm mới chương trình đào tạo
 * @data : Dữ liệu chương trình đào tạo cần thêm
 * @company : Id công ty
 */
exports.createEducationProgram = async (portal, data, company) => {
    let isEducationProgram = await EducationProgram(connect(DB_CONNECTION, portal)).findOne({
        programId: data.programId,
        company: company
    }, {
        _id: 1
    });
    if (isEducationProgram !== null) {
        return 'have_exist'
    } else {
        let createEducation = await EducationProgram(connect(DB_CONNECTION, portal)).create({
            company: company,
            name: data.name,
            programId: data.programId,
            applyForOrganizationalUnits: data.organizationalUnit,
            applyForPositions: data.position,
        });

        let newEducation = await EducationProgram(connect(DB_CONNECTION, portal)).findById(createEducation._id).populate([{
            path: 'applyForOrganizationalUnits',
        }, {
            path: 'applyForPositions',
        }])
        let totalList = await Course(connect(DB_CONNECTION, portal)).countDocuments({
            educationProgram: newEducation._id
        });
        return {
            ...newEducation._doc,
            totalList
        }
    }

}

/**
 * Xoá chương trình đào tạo
 * @id : Id chương trình đào tạo cần xoá
 */
exports.deleteEducationProgram = async (portal, id) => {
    let educationDelete = await EducationProgram(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: id
    });
    return educationDelete;
}

/**
 * Cập nhật thông tin chương trình đào tạo
 * @id : Id chương trình đào tạo cần chỉnh sửa
 * @data : Dữ liệu chỉnh sửa chương trình đào tạo
 */
exports.updateEducationProgram = async (portal, id, data) => {
    let eduacationChange = {
        name: data.name,
        programId: data.programId,
        applyForOrganizationalUnits: data.organizationalUnit,
        applyForPositions: data.position
    };
    await EducationProgram(connect(DB_CONNECTION, portal)).findOneAndUpdate({
        _id: id
    }, {
        $set: eduacationChange
    });

    let updateEducation = await EducationProgram(connect(DB_CONNECTION, portal)).findOne({
        _id: id
    }).populate([{
        path: 'applyForOrganizationalUnits',
    }, {
        path: 'applyForPositions',
    }]);

    let totalList = await Course(connect(DB_CONNECTION, portal)).countDocuments({
        educationProgram: updateEducation._id
    });
    return {
        ...updateEducation._doc,
        totalList
    }
}
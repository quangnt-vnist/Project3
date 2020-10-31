const {
    EducationProgram,
    Course,
    EmployeeCourse,
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy danh sách các khoá đào tạo theo phòng ban(đơn vị), chức vụ
 * @organizationalUnits : Array id đơn vị
 * @positions : Array id chức vụ
 * @company : Id công ty
 */
exports.getAllCourses = async (portal, company, organizationalUnits, positions) => {
    let keySearch = {
        company: company
    };
    if (organizationalUnits && organizationalUnits.length !== 0) {
        keySearch = {
            ...keySearch,
            applyForOrganizationalUnits: {
                $in: organizationalUnits
            },
        }
    }
    if (organizationalUnits && positions.length !== 0) {
        keySearch = {
            ...keySearch,
            applyForPositions: {
                $in: positions
            }
        }
    }
    let listEducations = await EducationProgram(connect(DB_CONNECTION, portal)).find(keySearch, {
        _id: 1
    })
    listEducations = listEducations.map(x => {
        return x._id
    });

    let listCourses = await Course(connect(DB_CONNECTION, portal)).find({
        educationProgram: {
            $in: listEducations
        }
    })
    return {
        listCourses
    }
}


/**
 * Lấy danh sách khoá học theo key
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty
 */
exports.searchCourses = async (portal, params, company) => {
    let keySearch = {
        company: company
    }
    if (params.educationProgram !== undefined) {
        keySearch = {
            ...keySearch,
            educationProgram: params.educationProgram
        }
    }
    // Bắt sựu kiện mã khoá đào tạo khác ""
    if (params.courseId !== undefined && params.courseId.length !== 0) {
        keySearch = {
            ...keySearch,
            courseId: {
                $regex: params.courseId,
                $options: "i"
            }
        }
    }
    // Bắt sựu kiện loại đào tạo khác null
    if (params.type !== undefined) {
        keySearch = {
            ...keySearch,
            type: params.type
        }
    }
    let totalList = await Course(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let listCourses = await Course(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip(params.page).limit(params.limit)
        .populate({
            path: 'educationProgram',
        });
    for (let n in listCourses) {
        let listEmployees = await EmployeeCourse(connect(DB_CONNECTION, portal)).find({
            course: listCourses[n]._id
        }).populate({
            path: 'employee',
            select: {
                '_id': 1,
                'fullName': 1,
                'employeeNumber': 1
            }
        });
        listCourses[n] = {
            ...listCourses[n]._doc,
            listEmployees: listEmployees
        }
    }
    return {
        totalList,
        listCourses
    }
}

/**
 * Thêm mới khoá đào tạo
 * @data : Dữ liệu khoá đào tạo cần thêm
 * @company : Id công ty 
 */
exports.createCourse = async (portal, data, company) => {
    let isCourse = await Course(connect(DB_CONNECTION, portal)).findOne({
        courseId: data.courseId,
        company: company
    }, {
        _id: 1
    });
    if (isCourse !== null) {
        return "have_exist"
    } else {
        let course = await Course(connect(DB_CONNECTION, portal)).create({
            company: company,
            name: data.name,
            courseId: data.courseId,
            offeredBy: data.offeredBy,
            coursePlace: data.coursePlace,
            startDate: data.startDate,
            endDate: data.endDate,
            cost: {
                number: data.cost,
                unit: data.unit
            },
            lecturer: data.lecturer,
            type: data.type,
            educationProgram: data.educationProgram,
            employeeCommitmentTime: data.employeeCommitmentTime
        });
        if (data.listEmployees.length !== 0) {
            data.listEmployees = data.listEmployees.map(x => {
                return {
                    course: course._id,
                    employee: x._id,
                    result: x.result
                }
            });
            await EmployeeCourse(connect(DB_CONNECTION, portal)).insertMany([...data.listEmployees]);
        }
        let newCourse = await Course(connect(DB_CONNECTION, portal)).findById(course._id).populate({
            path: 'educationProgram',
        });
        let listEmployees = await EmployeeCourse(connect(DB_CONNECTION, portal)).find({
            course: newCourse._id
        }).populate({
            path: 'employee',
            select: {
                '_id': 1,
                'fullName': 1,
                'employeeNumber': 1
            }
        });
        return {
            ...newCourse._doc,
            listEmployees
        }
    }
}

/**
 * Xoá khoá đào tạo
 * @id : Id khoá đào tạo cần xoá
 */
exports.deleteCourse = async (portal, id) => {
    let courseDelete = await Course(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: id
    });
    let listEmployees = await EmployeeCourse(connect(DB_CONNECTION, portal)).deleteMany({
        course: id
    })
    return {
        ...courseDelete._doc,
        listEmployees: listEmployees
    };
}

/**
 * Cập nhật thông tin khoá học
 * @id : Id khoá đào tạo cần xoá
 * @data : Dữ liệu chỉnh sửa khoá đào tạo
 */
exports.updateCourse = async (portal, id, data) => {
    let courseChange = {
        name: data.name,
        offeredBy: data.offeredBy,
        coursePlace: data.coursePlace,
        startDate: data.startDate,
        endDate: data.endDate,
        cost: {
            number: data.cost,
            unit: data.unit
        },
        lecturer: data.lecturer,
        type: data.type,
        educationProgram: data.educationProgram,
        employeeCommitmentTime: data.employeeCommitmentTime
    };
    await Course(connect(DB_CONNECTION, portal)).findOneAndUpdate({
        _id: id
    }, {
        $set: courseChange
    });
    await EmployeeCourse(connect(DB_CONNECTION, portal)).deleteMany({
        course: id
    });
    if (data.listEmployees.length !== 0) {
        data.listEmployees = data.listEmployees.map(x => {
            return {
                course: id,
                employee: x._id,
                result: x.result
            }
        });
        await EmployeeCourse(connect(DB_CONNECTION, portal)).insertMany([...data.listEmployees]);
    }

    let updateCourse = await Course(connect(DB_CONNECTION, portal)).findById(id).populate({
        path: 'educationProgram',
    });
    let listEmployees = await EmployeeCourse(connect(DB_CONNECTION, portal)).find({
        course: id
    }).populate({
        path: 'employee',
        select: {
            '_id': 1,
            'fullName': 1,
            'employeeNumber': 1
        }
    });
    return {
        ...updateCourse._doc,
        listEmployees
    }
}
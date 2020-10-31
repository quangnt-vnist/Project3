const {
    Example
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);

// Tạo mới một Ví dụ
exports.createExample = async (data, portal) => {
    let newExample = await Example(connect(DB_CONNECTION, portal)).create({
        exampleName: data.exampleName,
        description: data.description
    });
    let example = await Example(connect(DB_CONNECTION, portal)).findById({ _id: newExample._id });;
    return { example }
}

// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
exports.getExamples = async (params, portal) => {
    let keySearch;
    if (params.exampleName !== undefined && params.exampleName.length !== 0) {
        keySearch = {
            ...keySearch,
            exampleName: {
                $regex: params.exampleName,
                $options: "i"
            }
        }
    }
    let totalList = await Example(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let ExampleCollection = await Example(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip(params.page * params.limit)
        .limit(params.limit);
    return { data: ExampleCollection, totalList }
}
// Lấy ra một phần thông tin Ví dụ (lấy ra exampleName) theo mô hình dữ liệu số  2
exports.getOnlyExampleName = async (params, portal) => {
    let keySearch;
    if (params.exampleName !== undefined && params.exampleName.length !== 0) {
        keySearch = {
            ...keySearch,
            exampleName: {
                $regex: params.exampleName,
                $options: "i"
            }
        }
    }
    let totalList = await Example(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let ExampleCollection = await Example(connect(DB_CONNECTION, portal)).find(keySearch, { exampleName: 1 })
        .skip(params.page * params.limit)
        .limit(params.limit);
    return { data: ExampleCollection, totalList }
}

// Lấy ra Ví dụ theo id
exports.getExampleById = async (id, portal) => {
    let example = await Example(connect(DB_CONNECTION, portal)).findById({ _id: id });
    if (example) {
        return { example };
    }
    return -1;
}

// Chỉnh sửa một Ví dụ
exports.editExample = async (id, data, portal) => {
    let oldExample = await Example(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldExample) {
        return -1;
    }
    // // Cach 1 de update
    // else {
    //     oldExample.planName = data.planName ? data.planName : oldExample.planName;
    //     oldExample.description = data.description ? data.description : oldExample.description;
    // }
    // await oldExample.save();

    // Cach 2 de update
    await Example(connect(DB_CONNECTION, portal)).update({ _id: id }, { $set: data });
    let example = await Example(connect(DB_CONNECTION, portal)).findById({ _id: oldExample._id });
    return { example };
}

// Xóa một Ví dụ
exports.deleteExample = async (id, portal) => {
    let example = Example(connect(DB_CONNECTION, portal)).findByIdAndDelete({ _id: id });
    return example;
}
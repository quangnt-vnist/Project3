const mongoose = require("mongoose");
const { Status } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.getStatus = async (portal, companyId, query) => {
    const { limit, page } = query;
    let keySearch = {};

    const listStatusTotal = await Status(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    const listStatus = await Status(connect(DB_CONNECTION, portal)).find(keySearch)
    // .skip(parseInt(page)).limit(parseInt(limit));
    return { listStatusTotal, listStatus };
}

exports.getStatusById = async (portal, companyId, id) => {
    const statusById = await Status(connect(DB_CONNECTION, portal)).findById(id);
    return statusById;
}

exports.createStatus = async (portal, companyId, userId, data) => {
    const { name, description } = data;
    const newStatus = await Status(connect(DB_CONNECTION, portal)).create({
        creator: userId,
        name: name,
        description: description ? description : '',
    })

    const getNewStatus = await Status(connect(DB_CONNECTION, portal)).findById(newStatus._id);
    return getNewStatus;
}

exports.editStatus = async (portal, companyId, id, data, userId) => {
    const { name, description } = data;

    await Status(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: {
            creator: userId,
            name: name,
            description: description ? description : '',
        }
    }, { new: true });

    return await Status(connect(DB_CONNECTION, portal)).findOne({ _id: id });
}

exports.deleteStatus = async (portal, companyId, id) => {
    let deleteStatus = await Status(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return deleteStatus;
}



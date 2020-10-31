const mongoose = require("mongoose");
const { Group } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.createGroup = async (portal, companyId, userId, data) => {
    const { code, name, description, promotion } = data;
    const newGroup = await Group(connect(DB_CONNECTION, portal)).create({
        creator: userId,
        code: code,
        name: name,
        description: description ? description : '',
    })

    const getNewGroup = await Group(connect(DB_CONNECTION, portal)).findById(newGroup._id);
    return getNewGroup;
}

exports.getGroups = async (portal, companyId, query) => {
    const { limit, page } = query;
    let keySearch = {};

    const listGroupTotal = await Group(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    const groups = await Group(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
        .skip(parseInt(page)).limit(parseInt(limit));
    return { listGroupTotal, groups };
}

exports.getGroupById = async (portal, companyId, id) => {
    const groupById = await Group(connect(DB_CONNECTION, portal)).findById(id);
    return groupById;
}


exports.editGroup = async (portal, companyId, id, data, userId) => {
    const { code, name, description, promotion } = data;

    await Group(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: {
            creator: userId,
            code: code,
            name: name,
            description: description ? description : '',
            promotion: promotion ? promotion : '',
        }
    }, { new: true });

    return await Group(connect(DB_CONNECTION, portal)).findOne({ _id: id });
}

exports.deleteGroup = async (portal, companyId, id) => {
    let delGroup = await Group(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return delGroup;
}
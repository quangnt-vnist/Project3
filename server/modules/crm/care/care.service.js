const { Care } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.createCare = async (portal, companyId, data,userId) => { 
    let { startDate, endDate } = data;
    if (startDate) {
        const date = startDate.split('-');  
        startDate = [date[2], date[1], date[0]].join("-");
        data = { ...data, startDate };
    }

    if (endDate) {
        const date = endDate.split('-');  
        endDate = [date[2], date[1], date[0]].join("-");
        data = { ...data, endDate };
    }

    if (userId) {
        data = { ...data, creator: userId };
    }

    const newCare = await Care(connect(DB_CONNECTION, portal)).create(data);
    const getNewCare = await Care(connect(DB_CONNECTION, portal)).findById(newCare._id)
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'customer', select: '_id name ' })
        .populate({ path: 'caregiver', select: '_id name' })
        .populate({ path: 'careType', select: '_id name' })
    return getNewCare;
}

exports.getCares = async (portal, companyId, query) => {
    const { page, limit } = query;
    let keySearch = {};
    const listDocsTotal = await Care(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    const cares = await Care(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
        .skip(parseInt(page)).limit(parseInt(limit))
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'customer', select: '_id name' })
        .populate({ path: 'caregiver', select: '_id name' })
        .populate({ path: 'careType', select: '_id name' })
    return { listDocsTotal, cares };
}


exports.getCareById = async (portal, companyId, id) => {
    return await Care(connect(DB_CONNECTION, portal)).findById(id)
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'customer', select: '_id name' })
        .populate({ path: 'caregiver', select: '_id name' })
        .populate({path: 'careType', select: '_id name'})
}


exports.editCare = async (portal, companyId, id, data, userId) => { 
    let { startDate, endDate } = data;
    if (userId) {
        data = { ...data, creator: userId };
    }

    //format lai định dạng
    if (startDate) {
        const date = startDate.split('-');  
        startDate = [date[2], date[1], date[0]].join("-");
        data = { ...data, startDate };
    }

    //format lai định dạng
    if (endDate) {
        const date = endDate.split('-');  
        endDate = [date[2], date[1], date[0]].join("-");
        data = { ...data, endDate };
    }

    await Care(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: data
    }, { new: true });

    return await Care(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'customer', select: '_id name' })
        .populate({ path: 'caregiver', select: '_id name' })
        .populate({ path: 'careType', select: '_id name' })
}

exports.deleteCare = async (portal, companyId, id) => {
    let delCare = await Care(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return delCare;
}
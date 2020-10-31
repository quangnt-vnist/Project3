const { time } = require("cron");

const {
    PurchasingRequest
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);

function getArrayTimeFromString(stringDate) {
    arrayDate = stringDate.split('-');
    let year = arrayDate[2];
    let month = arrayDate[1];
    let day = arrayDate[0];
    const date = new Date(year, month - 1, day);
    const moment = require('moment');

    // start day of createdAt
    var start = moment(date).startOf('day');
    // end day of createdAt
    var end = moment(date).endOf('day');

    return [start, end];
}

exports.createPurchasingRequest = async (userId, data, portal) => {
    let newPurchasingRequest = await PurchasingRequest(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        creator: userId,
        materials: data.materials.map(item => {
            return {
                good: item.good,
                quantity: item.quantity
            }
        }),
        intendReceiveTime: data.intendReceiveTime,
        planCode: data.planCode,
        description: data.description,
        status: data.status
    });

    let purchasingRequest = await PurchasingRequest(connect(DB_CONNECTION, portal)).findById({ _id: newPurchasingRequest._id })
        .populate([{
            path: "creator", select: "name"
        }, {
            path: "materials.good", select: "_id code name baseUnit"
        }]);
    return { purchasingRequest }
}

exports.getAllPurchasingRequest = async (query, portal) => {
    let option = {};
    let { page, limit } = query;
    if (query.code) {
        option.code = new RegExp(query.code, "i");
    }
    if (query.planCode) {
        option.planCode = new RegExp(query.planCode, "i");
    }
    if (query.status) {
        option.status = {
            '$in': query.status
        }
    }
    if (query.intendReceiveTime) {
        option.intendReceiveTime = {
            '$gte': getArrayTimeFromString(query.intendReceiveTime)[0],
            '$lte': getArrayTimeFromString(query.intendReceiveTime)[1]
        }
    }
    if (query.createdAt) {
        option.createdAt = {
            '$gte': getArrayTimeFromString(query.createdAt)[0],
            '$lte': getArrayTimeFromString(query.createdAt)[1]
        }
    }
    if (!limit || !page) {
        let docs = await PurchasingRequest(connect(DB_CONNECTION, portal))
            .find(option)
            .populate([{
                path: "creator", select: "name"
            }, {
                path: "materials.good", select: "_id code name baseUnit"
            }]);
        let purchasingRequests = {};
        purchasingRequests.docs = docs;
        return { purchasingRequests }
    } else {
        let purchasingRequests = await PurchasingRequest(connect(DB_CONNECTION, portal))
            .paginate(option, {
                limit: limit,
                page: page,
                populate: [{
                    path: "creator", select: "name"
                }, {
                    path: "materials.good", select: "_id code name baseUnit"
                }]
            });
        return { purchasingRequests }
    }





}
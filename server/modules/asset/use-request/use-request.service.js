const Models = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);
const { RecommendDistribute, User } = Models;

/**
 * Lấy danh sách phiếu đề nghị cấp thiết bị
 */
exports.searchUseRequests = async (portal, company, query) => {
    const { receiptsCode, createReceiptsDate, reqUseStatus, reqUseEmployee, approver, page, limit, managedBy, assetId } = query;
    var keySearch = { company: company };

    // Bắt sựu kiện mã phiếu tìm kiếm khác ""
    if (receiptsCode) {
        keySearch = { ...keySearch, recommendNumber: { $regex: receiptsCode, $options: "i" } }
    }

    // Thêm key tìm kiếm phiếu theo trạng thái vào keySearch
    if (reqUseStatus) {
        keySearch = { ...keySearch, status: { $in: reqUseStatus } };
    };

    // Thêm key tìm kiếm theo người đăng ký vào keySearch
    if (reqUseEmployee) {
        let user = await User(connect(DB_CONNECTION, portal)).find({ name: { $regex: reqUseEmployee, $options: "i" } }).select('_id');
        let userIds = [];
        user.map(x => {
            userIds.push(x._id)
        })
        keySearch = { ...keySearch, proponent: { $in: userIds } };
    };

    // Thêm key tìm kiếm theo người phê duyệt vào keySearch
    if (approver) {
        let user = await User(connect(DB_CONNECTION, portal)).find({ name: { $regex: approver, $options: "i" } }).select('_id');
        let userIds = [];
        user.map(x => {
            userIds.push(x._id)
        })
        keySearch = { ...keySearch, approver: { $in: userIds } };
    };

    if (assetId) {
        keySearch = { ...keySearch, asset: { $in: assetId } };
    }
    // Thêm key tìm theo ngày lập phiếu vào keySearch
    if (createReceiptsDate) {
        let date = createReceiptsDate.split("-");
        let start = new Date(date[1], date[0] - 1, 1);
        let end = new Date(date[1], date[0], 1);

        keySearch = {
            ...keySearch,
            dateCreate: {
                $gt: start,
                $lte: end
            }
        }
    }

    var totalList = await RecommendDistribute(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    var listRecommendDistributes = await RecommendDistribute(connect(DB_CONNECTION, portal)).find(keySearch).populate({ path: 'asset proponent approver' }).sort({ 'createdAt': 'desc' }).skip(page ? parseInt(page) : 0).limit(limit ? parseInt(limit) : 0);
    var test = await RecommendDistribute(connect(DB_CONNECTION, portal)).find(keySearch);

    if (managedBy !== "" && managedBy !== undefined) {
        let tempListRecommendDistributes = listRecommendDistributes.filter(item => item.asset.managedBy.toString() === managedBy);
        listRecommendDistributes = tempListRecommendDistributes;
    }

    return { totalList, listRecommendDistributes };
}



/**
 * Lay thông tin phiếu đề nghị cap phat thiết bị theo tai san
 * @data: du lieu tai san
 */
exports.getUseRequestByAsset = async (portal, data) => {
    var listRecommendDistributes = await RecommendDistribute(connect(DB_CONNECTION, portal)).find({ asset: data.assetId }).populate({ path: 'asset proponent approver' }).sort({ 'createdAt': 'desc' });
    return listRecommendDistributes;
}

/**
 * Thêm mới thông tin phiếu đề nghị cap phat thiết bị
 * @data: dữ liệu phiếu đề nghị cap phat thiết bị
 */
exports.createUseRequest = async (portal, company, data) => {

    let dateStartUse, dateEndUse, dateCreate, date, partStart, partEnd, partCreate;
    partStart = data.dateStartUse.split('-');
    partEnd = data.dateEndUse.split('-');
    partCreate = data.dateCreate.split('-');

    if (data.startTime) {
        date = [partStart[2], partStart[1], partStart[0]].join('-') + ' ' + data.startTime;
        dateStartUse = new Date(date);
    } else {
        date = [partStart[2], partStart[1], partStart[0]].join('-')
        dateStartUse = new Date(date);
    }
    if (data.stopTime) {
        date = [partEnd[2], partEnd[1], partEnd[0]].join('-') + ' ' + data.stopTime;
        dateEndUse = new Date(date);
    } else {
        date = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        dateEndUse = new Date(date);
    }

    date = [partCreate[2], partCreate[1], partCreate[0]].join('-');
    dateCreate = new Date(date);

    var createRecommendDistribute = await RecommendDistribute(connect(DB_CONNECTION, portal)).create({
        company: company,
        recommendNumber: data.recommendNumber,
        dateCreate: dateCreate,
        proponent: data.proponent, // Người đề nghị
        reqContent: data.reqContent,
        asset: data.asset,
        dateStartUse: dateStartUse,
        dateEndUse: dateEndUse,
        approver: data.approver, // Người phê duyệt
        note: data.note,
        status: data.status,
    });
    return createRecommendDistribute;
}

/**
 * Xoá thông tin phiếu đề nghị cap phat thiết bị
 * @id: id phiếu đề nghị cap phat thiết bị muốn xoá
 */
exports.deleteUseRequest = async (id) => {
    return await RecommendDistribute(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: id
    });
}

/**
 * Update thông tin phiếu đề nghị cap phat thiết bị
 * @id: id phiếu đề nghị cap phat thiết bị muốn update
 */
exports.updateUseRequest = async (portal, id, data) => {
    let dateStartUse, dateEndUse, date, partStart, partEnd;
    partStart = data.dateStartUse.split('-');
    partEnd = data.dateEndUse.split('-');
    if (data.startTime) {
        date = [partStart[2], partStart[1], partStart[0]].join('-') + ' ' + data.startTime;
        dateStartUse = new Date(date);
    } else {
        if (data.dateStartUse.length > 12) {
            date = data.dateStartUse
        } else {
            date = [partStart[2], partStart[1], partStart[0]].join('-')

        }
        dateStartUse = new Date(date);
    }
    if (data.stopTime) {
        date = [partEnd[2], partEnd[1], partEnd[0]].join('-') + ' ' + data.stopTime;
        dateEndUse = new Date(date);
    } else {
        if (data.dateEndUse.length > 12) {
            date = data.dateEndUse
        } else {
            date = [partEnd[2], partEnd[1], partEnd[0]].join('-')
        }
        dateEndUse = new Date(date);
    }

    var recommendDistributeChange = {
        recommendNumber: data.recommendNumber,
        dateCreate: new Date(data.dateCreate),
        proponent: data.proponent, // Người đề nghị
        reqContent: data.reqContent, // Người đề nghị
        asset: data.asset,
        dateStartUse: dateStartUse,
        dateEndUse: dateEndUse,
        approver: data.approver, // Người phê duyệt
        note: data.note,
        status: data.status,
    };

    // Cập nhật thông tin phiếu đề nghị cap phat thiết bị vào database
    await RecommendDistribute(connect(DB_CONNECTION, portal)).findOneAndUpdate({
        _id: id
    }, {
        $set: recommendDistributeChange
    });
    return await RecommendDistribute(connect(DB_CONNECTION, portal)).findOne({
        _id: id
    })
}
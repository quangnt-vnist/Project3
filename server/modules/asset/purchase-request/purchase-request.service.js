const Models = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);
const { RecommendProcure, User } = Models;

/**
 * Lấy danh sách phiếu đề nghị mua sắm thiết bị
 */
exports.searchPurchaseRequests = async (portal, company, query) => {
    const { recommendNumber, approver, proponent, proposalDate, status, page, limit } = query;

    var keySearch = { company: company };

    // Bắt sựu kiện mã phiếu tìm kiếm khác ""
    if (recommendNumber) {
        keySearch = { ...keySearch, recommendNumber: { $regex: recommendNumber, $options: "i" } }
    }

    //Bắt sựu kiện tháng tìm kiếm khác ""
    if (proposalDate) {
        keySearch = { ...keySearch, dateCreate: { $regex: month, $options: "i" } }
    }

    // Thêm người đề nghị vào trường tìm kiếm
    if (proponent) {
        let user = await User(connect(DB_CONNECTION, portal)).find({ name: { $regex: proponent, $options: "i" } }).select('_id');
        let userIds = [];
        user.map(x => {
            userIds.push(x._id)
        })
        keySearch = { ...keySearch, proponent: { $in: userIds } }
    }

    // Thêm người phê duyệt vào trường tìm kiếm
    if (approver) {
        let user = await User(connect(DB_CONNECTION, portal)).find({ name: { $regex: approver, $options: "i" } }).select('_id');
        let userIds = [];
        user.map(x => {
            userIds.push(x._id)
        })
        keySearch = { ...keySearch, approver: { $in: userIds } }
    }

    // Thêm key tìm kiếm phiếu theo trạng thái vào keySearch
    if (status) {
        keySearch = { ...keySearch, status: { $in: status } };
    };
    var totalList = await RecommendProcure(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    var listRecommendProcures = await RecommendProcure(connect(DB_CONNECTION, portal)).find(keySearch).populate({ path: 'proponent approver' }).sort({ 'createdAt': 'desc' }).skip(page ? parseInt(page) : 0).limit(limit ? parseInt(limit) : 0);

    return { totalList, listRecommendProcures };
}

/**
 * Thêm mới thông tin phiếu đề nghị mua sắm thiết bị
 * @data: dữ liệu phiếu đề nghị mua sắm thiết bị
 */
exports.createPurchaseRequest = async (portal, company, data) => {
    var createRecommendProcure = await RecommendProcure(connect(DB_CONNECTION, portal)).create({
        company: company,
        recommendNumber: data.recommendNumber,
        dateCreate: data.dateCreate,
        proponent: data.proponent, // Người đề nghị
        equipmentName: data.equipmentName,
        equipmentDescription: data.equipmentDescription,
        supplier: data.supplier,
        approver: data.approver, // Người phê duyệt
        total: data.total,
        unit: data.unit,
        estimatePrice: data.estimatePrice,
        note: data.note,
        status: data.status,
    });
    return createRecommendProcure;
}

/**
 * Xoá thông tin phiếu đề nghị mua sắm thiết bị
 * @id: id phiếu đề nghị mua sắm thiết bị muốn xoá
 */
exports.deletePurchaseRequest = async (portal, id) => {
    return await RecommendProcure(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: id
    });
}

/**
 * Update thông tin phiếu đề nghị mua sắm thiết bị
 * @id: id phiếu đề nghị mua sắm thiết bị muốn update
 */
exports.updatePurchaseRequest = async (portal, id, data) => {
    var recommendProcureChange = {
        recommendNumber: data.recommendNumber,
        dateCreate: data.dateCreate,
        proponent: data.proponent, // Người đề nghị
        equipmentName: data.equipmentName,
        equipmentDescription: data.equipmentDescription,
        supplier: data.supplier,
        approver: data.approver, // Người phê duyệt
        total: data.total,
        unit: data.unit,
        estimatePrice: data.estimatePrice,
        note: data.note,
        status: data.status,
    };

    // Cập nhật thông tin phiếu đề nghị mua sắm thiết bị vào database
    await RecommendProcure(connect(DB_CONNECTION, portal)).findOneAndUpdate({
        _id: id
    }, {
        $set: recommendProcureChange
    });
    return await RecommendProcure(connect(DB_CONNECTION, portal)).findOne({
        _id: id
    })
}

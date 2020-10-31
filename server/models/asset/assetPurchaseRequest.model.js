const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Bảng đề nghị mua sắm thiết bị
const AssetPurchaseRequestSchema = new Schema({
    company: { //thuộc công ty nào
        type: Schema.Types.ObjectId,
        ref: 'companies',
        required: true
    },
    recommendNumber: { //mã phiếu
        type: String,
        required: true
    },
    dateCreate: { //ngày lập
        type: String,
        defaut: Date.now
    },
    proponent: { //người đề nghị
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    equipmentName: { //Tên thiết bị đề nghị mua sắm
        type: String,
        required: true
    },
    equipmentDescription: { // Mô tả thiết bị đề nghị mua sắm
        type: String,
    },
    supplier: { //nhà cung cấp
        type: String,
    },
    total: { //số lượng
        type: String,
    },
    unit: { //đơn vị tính
        type: String,
    },
    estimatePrice: { //Giá trị dự tính
        type: String
    },
    note: { //ghi chú
        type: String
    },
    approver: { //người phê duyệt
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: { //trạng thái, tình trạng: chờ phê duyệt || không chấp nhận || đã chấp nhận
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = (db) => {
    if (!db.models.AssetPurchaseRequest)
        return db.model('AssetPurchaseRequest', AssetPurchaseRequestSchema);
    return db.models.AssetPurchaseRequest;
}
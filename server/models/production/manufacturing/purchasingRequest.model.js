const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')


// Bảng phiếu đề nghị mua nguyên vật liệu
const PurchasingRequestSchema = new Schema({
    code: { // Mã phiếu
        type: String,
        required: true
    },
    creator: { // Người tạo
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    materials: [{ // Danh sách nguyên vật liệu
        good: { // Nguyên vật liệu
            type: Schema.Types.ObjectId,
            ref: "Good"
        },
        quantity: { // Số lượng
            type: Number
        }
    }],
    intendReceiveTime: { // Thời gian dự kiến nhận
        type: Date
    },
    planCode: {// Kế hoạch sản xuất
        type: String
    },
    status: { // Trạng thái phiếu đề nghị mua nguyên vật liệu: 1. Chưa xử lý || 2. Đã xử lý || 3. Đã hủy
        type: Number,
        default: 1
    },
    description: { // Mô tả phiếu đề nghị mua nguyên vật liệu
        type: String
    }
}, {
    // Thời gian tạo, sửa phiếu đề nghị mua nguyên vật liệu
    timestamps: true
});

PurchasingRequestSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.PurchasingRequest)
        return db.model("PurchasingRequest", PurchasingRequestSchema)
    return db.models.PurchasingRequest;
}
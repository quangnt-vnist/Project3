const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Bảng lệnh sản xuất
const ManufacturingCommandSchema = new Schema({
    code: {// Mã lệnh sản xuất
        type: String,
        required: true
    },
    manufacturingPlan: { // Lệnh thuộc kế hoạch sản xuất nào
        type: Schema.Types.ObjectId,
        ref: "ManufacturingPlan"
    },
    manufacturingMill: { //  Lệnh được thực hiện ở xưởng nào
        type: Schema.Types.ObjectId,
        ref: "ManufacturingMill"
    },
    startDate: { // Ngày bắt đầu
        type: Date
    },
    endDate: { // Ngày kết thúc
        type: Date
    },
    startTurn: { // Ca bắt đầu
        type: Number
    },
    endTurn: { //  Ca kết thúc
        type: Number
    },
    good: { // Mặt hàng
        type: Schema.Types.ObjectId,
        ref: "Good"
    },
    quantity: { // Số lượng
        type: Number
    },
    creator: { // Người tạo
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    approvers: [{ // Danh sách người phê duyệt
        approver: { // Người phê duyệt
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        approveredTime: { // Thời gian phê duyệt
            type: Date
        }
    }],
    responsible: [{ // Danh sách người thực hiện lệnh
        type: Schema.Types.ObjectId,
        ref: "Worker"
    }],
    accountable: [{ // Người giám sát lệnh
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    status: { //  Trạng thái lệnh sản xuất: 0. Lệnh được tạo, 1. Lệnh đã duyệt, 2. Lệnh đang được thực thi, 3. Lệnh trễ tiến độ, 4. Lệnh đúng tiến độ, 5. Lệnh quá hạn, 6. Lệnh bị hoãn 
        type: Number,
        default: 0
    },
    description: { // Mô tả về lệnh
        type: String
    }
}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.ManufacturingCommand)
        return db.model("ManufacturingCommand", ManufacturingCommandSchema);
    return db.models.ManufacturingCommand;
}
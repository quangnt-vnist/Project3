const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Bảng kế hoạch sản xuất
const ManufacturingPlanSchema = new Schema({
    code: { // Mã kế hoạch
        type: String,
        required: true
    },
    manufacturingOrder: { // Đơn sản xuất của kế hoạch
        type: Schema.Types.ObjectId,
        ref: "ManufacturingOrder"
    },
    products: [{ // Danh sách danh mục mặt hàng
        good: { // Mặt hàng
            type: Schema.Types.ObjectId,
            ref: "Good"
        },
        quantity: { // Số lượng sản xuất theo kế hoạch của mặt hàng
            type: Number
        },
        orderedQuantity: { // Số lượng sản xuất theo đơn sản xuất của mặt hàng
            type: Number
        },
    }],
    approvers: [{ // Danh sách người phê duyệt
        approver: { // Người phê duyệt
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        approveredTime: { // Thời gian phê duyệt
            type: Date
        }
    }],
    manufacturingCommands: [{ // Danh sách lệnh sản xuất của kế hoạch
        type: Schema.Types.ObjectId,
        ref: "ManufacturingCommand"
    }],
    creator: { // Người tạo kế hoạch
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status: { // Trạng thái kế hoạch: 0. Chưa được duyệt xong || 1. Đã được duyệt xong
        type: Number,
        default: 0
    },
    description: { //  Mô tả kế hoạch
        type: String
    },
    startDate: { // Ngày bắt đầu
        type: Date
    },
    endDate: { // Ngày dự kiến kết thúc
        type: Date
    },
    logs: [{ // Ghi lại nhật ký chỉnh sửa kế hoạch
        creator: { // Người sửa
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        title: { // Tiêu đề
            type: String
        },
        description: { // Mô tả nội dung chỉnh sửa
            type: String
        },
        createdAt: { // Thời gian sửa
            type: Date
        }
    }]
}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.ManufacturingPlan)
        return db.model("ManufacturingPlan", ManufacturingPlanSchema);
    return db.models.ManufacturingPlan;
}
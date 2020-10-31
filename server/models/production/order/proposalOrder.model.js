const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProposalOrderSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    status: { //1: Chờ phê duyệt, 2: Đã phê duyệt, 3: Đang sản xuất, 4: Hoàn thành, 5: Đã hủy
        type: Number,
        enum: [ 1, 2, 3, 4, 5 ],
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    approvers: {
        approver: {
            type: Schema.Types.ObjectId,
            required: true
        },
        timeApprove: {
            type: Date,
            required: true
        }
    },
    description: {
        type: String
    },
    priority: { //1: Thấp, 2: Trung bình, 3: Cao, 4: Đặc biệt
        type: Number,
        enum: [ 1, 2, 3, 4 ],
        required: true
    },
    goods: [{
        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good',
            required: true
        },
        quantity: {// Số lượng cần thiết
            type: Number,
            required: true
        },
        completedQuantity: {//Số lượng đã hoàn thành
            type: Number,
            required: true
        }
    }]
}, {
    timestamps: true,
})

module.exports = (db) => {
    if (db.models.ProposalOrder)
        return db.model('ProposalOrder', ProposalOrderSchema)
    return db.models.ProposalOrder
}
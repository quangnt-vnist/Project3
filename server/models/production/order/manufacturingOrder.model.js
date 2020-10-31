const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

const ManufacturingOrderSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    status: { //1: Chờ phê duyệt, 2: Đã phê duyệt, 3: Đang sản xuất, 4: Hoàn thành, 5: Đã hủy
        type: Number,
        enum: [ 1, 2, 3, 4, 5 ],
        required: true
    },
    type: { //1: Sản xuất từ đơn đề nghị, 2: Sản xuất từ đơn kinh doanh, 3: Sản xuất tồn kho
        type: Number,
        enum: [ 1, 2, 3 ],
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
    approvers: [{
        approver: {
            type: Schema.Types.ObjectId,
            required: true
        },
        timeApprove: {
            type: Date,
            required: true
        }
    }],
    description: {
        type: String
    },
    priority: { //1: Thấp, 2: Trung bình, 3: Cao, 4: Khẩn cấp 
        type: Number,
        enum: [ 1, 2, 3, 4 ],
        required: true
    },
    proposalOrders: [{
        proposalOrder: {
            type: Schema.Types.ObjectId,
            ref: 'ProposalOrder',
            required: true
        },
        priority: {
            type: Number
        },
        status: { //1: Chưa hoàn thành, 2: Đã hoàn thành
            type: Number,
            enum: [ 1, 2 ],
            required: true
        }
    }],
    salesOrders: [{
        salesOrder: {
            type: Schema.Types.ObjectId,
            ref: 'SalesOrder',
            required: true
        },
        priority: {
            type: Number
        },
        status: { //1: Chưa hoàn thành, 2: Đã hoàn thành
            type: Number,
            enum: [ 1, 2 ],
            required: true
        }
    }],
    goods: [{
        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good',
            required: true
        },
        proposalQuantity: {// Số lượng cần thiết
            type: Number,
            required: true
        },
        plannedQuantity: {//Số lượng lên kế hoạch
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

ManufacturingOrderSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (db.models.ManufacturingOrder)
        return db.model('ManufacturingOrder', ManufacturingOrderSchema)
    return db.models.ManufacturingOrder
}
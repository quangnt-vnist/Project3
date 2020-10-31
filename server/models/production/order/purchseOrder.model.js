const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const PurchaseOrderShema = new Schema({
    code: {
        type: String,
        required: true
    },
    status: {// 1: Chờ phê duyệt, 2: Đã phê duyệt, 3: Đang mua hàng, 4: Đã hoàn thành, 5: Đã hủy
        type: Number,
        enum: [ 1, 2 ,3, 4, 5 ],
        require: true
    },
    stock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },
    desciption: {
        type: String
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reponsible: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    goods: [{
        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good',
            required: true
        },
        returnRule: {
            type: String
        },
        serviceLevelAgreement: {
            type: String
        },
        name: {
            type: String,
            required: true
        },
        baseUnit: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    returnRule: {
        type: String
    },
    serviceLevelAgreement: {
        type: String
    },
    approvers: [{
        approver: {
            type: Schema.Types.ObjectId,
            required: true
        }, 
        timeApprove: {
            type: Date
        }
    }],
    partner: [{
        type: Schema.Types.ObjectId,
        required: true
    }],
    payments: [{
        accounting: {
            type: Schema.Types.ObjectId,
            required: true
        },
        money: {
            type: Number,
            required: true
        },
        paymentAt: {
            type: Date,
            required: true
        }
    }]
}, {
    timestamps: true,
})

PurchaseOrderShema.plugin(mongoosePaginate);

module.exports = (db) =>{
    if (!db.models.PurchaseOrder) 
        return db.model('PurchaseOrder', PurchaseOrderShema)
    return db.models.PurchaseOrder
}
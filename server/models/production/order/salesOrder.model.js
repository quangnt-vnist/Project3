const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoosePaginate = require('mongoose-paginate-v2')

const SalesOrderSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    status: { //1: Chờ phê duyệt, 2: đã phê duyệt, 3: Chờ lấy hàng, 4: Đang giao hàng, 5: Đã hoàn thành, 6: Hủy đơn
        type: Number,
        enum: [ 1, 2, 3, 4, 5, 6 ],
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
            ref:'User',
            required: true
        },
        approveAt: {
            type: Date,
            required: true
        }
    }],
    priority: { // 1: Thấp, 2: Trung bình, 3: Cao, 4: Đặc biệt
        type: Number,
        enum: [ 1, 2, 3, 4 ],
        required: true
    },
    deliveryStartDate: {
        type: Date
    },
    deliveryEndDate: {
        type: Date
    },
    deliveryAt: {
        type: Date
    },
    //CUSTOMER CỦA ANH TUẤN
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    }, 
    customerPhone: {
        type: String,
        required: true
    },
    customerAddress: {
        type: String,
        required: true
    },
    goods: [{
        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good',
            required: true
        },
        returnRule: [{
            type: Schema.Types.ObjectId,
            ref: 'ReturnRule'
        }],
        serviceLevelAgreement: [{
            type: Schema.Types.ObjectId,
            ref: 'ServiceLevelAgreement'
        }],
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        baseUnit: {
            type: String,
            required: true
        },
        balanceQuantity: { //Số còn dư trong kho
            type: Number,
            required: true
        },
        completedQuantity: { // Số đã sản xuất và đã nhập kho
            type: Number,
            required: true
        },
        tax: [{
            type: Schema.Types.ObjectId,
            ref: 'Tax'
        }],
        discounts: [{
            type: Schema.Types.ObjectId,
            ref: 'Discount'
        }],
        note: {
            type: String,
        }
    }],
    discounts: [{
        type: Schema.Types.ObjectId,
        ref: 'Discount'
    }],
    totalDiscounts: {
        money: {
            type: Number
        },
        goods: [{
            good: {
                type: Schema.Types.ObjectId,
                ref: 'Good',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            percent: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }],
        coin: {
            type: Number
        }
    },
    amount: {
        type: Number
    },
    totalTax: {
        type: Number,
    },
    paymentAmount: {
        type: Number
    },
    note: {
        type: String
    },
    payments:[{
        paymentType:{// 1: Tiền mặt, 2: Chuyển khoản
            type: Number,
            enum: [ 1, 2 ],
            required: true
        },
        money: {
            type: Number,
            required: true
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        bankAccount: {// Tài khoản nhận thanh toán về
            type: Schema.Types.ObjectId,
            ref: 'BankAccount'
        },
        status: {//1: Chưa xác nhận, 2: Đã xác nhận(Đối với chuyển khoản)/Đã nộp tiền(Đối với tiền mặt)
            type: Number,
            enum: [ 1, 2 ],
            required: true
        },
        confirmationPerson: {//Người phê duyệt thanh toán
            type: Schema.Types.ObjectId,
        },
        paymentAt: {
            type: Date
        },
        confirmationAt: {
            type: Date
        }
    }]
}, {
    timestamps: true,
})

SalesOrderSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.SalesOrder)
        return db.model('SalesOrder', SalesOrderSchema)
    return db.models.SalesOrder
}
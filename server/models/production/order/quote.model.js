const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const QuoteSchema = Schema({
    code: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        enum: [ 0 , 1 , 2 , 3 ], //0. Gửi yêu cầu, 1: chờ phản hồi, 2: Đã chốt đơn, 3: Đã hủy
        required: true,
        default: 1
    }, 
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    effectiveDate: {
        type: Date,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },

    //ĐỂ Ý PHẦN NÀY, SAU ANH TUẤN THÊM CUSTOMER VÀO
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
        //PHẦN QUY TẮC ĐỔI TRẢ ANH TUẤN LÀM
        returnRule: [{
            type: Schema.Types.ObjectId,
            ref: 'returnRule'
        }],
        //service level agreement
        serviceLevelAgreements: [{
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
        taxs: [{
            type: Schema.Types.ObjectId,
            ref: 'Tax'
        }],
        discounts: [{
            type: Schema.Types.ObjectId,
            ref: 'Discount'
        }],
        note: {
            type: String,
            required: true
        }
    }],
    discounts: [{
        type: Schema.Types.ObjectId,
        required: true
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
        type: Number,
        required: true
    },
    totalTax: {
        type: Number,
        required: true
    },
    paymentAmount: {
        type: Number,
        required: true
    },
    note: {
        type: String
    }
}, {
    timestamps: true,
})

QuoteSchema.plugin(mongoosePaginate);

module.exports = (db) =>{
    if(!db.models.Quote)
        return db.model('Quote', QuoteSchema)
    return db.models.Quote
}
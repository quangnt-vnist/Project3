const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiscountSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    effectiveDate: {
        type: Date
    },
    expirationDate: {
        type: Date
    },
    type: {//
        type: Number,
        enum: [ 1, 2, 3, 4, 5, 6 ],
        required: true
    },
    discountVariances: {
        money: {
            type: Number,
        },
        percent: {
            type: Number
        },
        coin: {
            type: Number
        },
        delivery: {
            type: Number
        },
        maxMoney: {
            type: Number
        },
        numberOfDelaydDays: {
            type: Number
        }
    },
    discountHoliday: {
        money: {
            type: Number
        },
        percent: {
            type: Number
        },
        coin: {
            type: Number
        },
        delivery: {
            type: Number
        },
        maxMoney: {
            type: Number
        }
    },
    inventorys: [{
        money: {
            type: Number
        },
        percent: {
            type: Number
        },
        coin: {
            type: Number
        },
        delivery: {
            type: Number
        },
        maxMoney: {
            type: Number
        },
        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good'
        },
        expirationDate: Date
    }],
    orderValues: [{
        money: {
            type: Number
        },
        percent: {
            type: Number
        },
        coin: {
            type: Number
        },
        delivery: {
            type: Number
        },
        maxMoney: {
            type: Number
        },
        minium: {
            type: Number,
            required: true
        },
        maximum: {
            type: Number
        },
        bonus: [{
            quantity: {
                type: Number,
                required: true
            },
            goods: [{
                type: Schema.Types.ObjectId,
                ref: 'Good',
                required: true
            }]
        }]
    }],
    goodQuantitys: [{
        money: {
            type: Number
        },
        percent: {
            type: Number
        },
        coin: {
            type: Number
        },
        delivery: {
            type: Number
        },
        maxMoney: {
            type: Number
        },
        minium: {
            type: Number,
            required: true
        },
        maximum:{
            type: Number
        }
    }],
    customerDiscounts: [{
        money: {
            type: Number
        },
        percent: {
            type: Number
        },
        coin: {
            type: Number
        },
        delivery: {
            type: Number
        },
        maxMoney: {
            type: Number
        },
        type: { //1. Khách thường, 2. Khách VIP
            type: Number,
            enum: [ 1, 2 ],
            required: true
        }
    }],
    bonus: [{
        good: {
            type: Schema.Types.ObjectId,
            ref:'Good',
            required: true
        },
        bonusLevel: [{
            minium: {
                type: Number,
                required: true
            },
            maximum: {
                type: Number
            },
            bonus: [{
                quantity: {
                    type:  Number,
                    required: true
                },
                goods: {
                    type: Schema.Types.ObjectId,
                    ref: 'Good',
                    required: true
                }
            }]
        }]
    }],
    version: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
})

module.exports = (db) => {
    if (db.models.Discount)
        return db.model('Discount', DiscountSchema)
    return db.models.Discount
}
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const GoodSchema = new Schema({

    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },

    code: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["product", "material", "equipment", "asset"],
        required: true
    },

    baseUnit: {
        type: String,
        required: true
    },

    units: [{

        name: {
            type: String
        },

        conversionRate: {
            type: Number
        },

        description: {
            type: String
        }
    }],

    quantity: {
        type: Number,
        default: 0
    },

    description: {
        type: String
    },

    materials: [{

        good: {
            type: Schema.Types.ObjectId,
            replies: this
        },

        quantity: {
            type: Number
        }
    }],

    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    packagingRule: {
        type: String
    },

    manufacturingMills: [{
        manufacturingMill: ObjectId,
        productivity: Number,
        personNumber: Number
    }],
    // Module chưa hoàn thiện
    returnRules: [{
        type: Schema.Types.ObjectId,
        ref: ''
    }],
    serviceLevelAgreements: [{
        type: Schema.Types.ObjectId,
        ref: 'ServiceLevelAgreement'
    }],
    discounts: [{
        type: Schema.Types.ObjectId,
        ref: 'Discount'
    }],
    taxs: [{
        type: Schema.Types.ObjectId,
        ref: 'Tax'
    }],
    pricePerBaseUnit: {
        type: Number
    },
    salesPriceVariance: {
        type: Number
    }
}, {
    timestamps: true,
});

GoodSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Good)
        return db.model('Good', GoodSchema);
    return db.models.Good;
}






// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const mongoosePaginate = require('mongoose-paginate-v2');

// const GoodSchema = new Schema ({

//     company: {
//         type: Schema.Types.ObjectId,
//         ref: 'Company'
//     },

//     category: {
//         type: Schema.Types.ObjectId,
//         ref: 'Category'
//     },

//     code: {
//         type: String,
//         required: true
//     },

//     name: {
//         type: String,
//         required: true
//     },

//     type: {
//         type: String,
//         enum: ["product", "material", "equipment", "asset"],
//         required: true
//     },

//     baseUnit: {
//         type: String,
//         required: true
//     },

//     units: [{

//         name: {
//             type: String
//         },

//         conversionRate: {
//             type: Number
//         },

//         description: {
//             type: String
//         }
//     }],

//     quantity: {
//         type: Number,
//         default: 0
//     },

//     description: {
//         type: String
//     },

//     materials: [{

//         good: {
//             type: Schema.Types.ObjectId,
//             replies: this
//         },

//         quantity: {
//             type: Number
//         }
//     }],

//     creator: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     }
// });

// GoodSchema.plugin(mongoosePaginate);

// module.exports = (db) => {
//     if(!db.models.Good)
//         return db.model('Good', GoodSchema);
//     return db.models.Good;
// }
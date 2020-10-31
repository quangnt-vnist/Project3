const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const BillSchema = new Schema ({

    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },

    fromStock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },

    toStock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },

    code: {
        type: String,
        required: true
    },

    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    partner: {
        type: Schema.Types.ObjectId,
        ref: 'Partner'
    },

    proposal: {
        type: Schema.Types.ObjectId,
        ref: 'Proposal'
    },

    timestamp: {
        type: Date,
        default: Date.now
    },

    description: {
        type: String
    },

    goodReceipts: [{

        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good'
        },

        lot: {
            type: Schema.Types.ObjectId,
            ref: 'Lot'
        },

        type: {
            type: String,
            enum: [""]
        },

        quantity: {
            type: Number
        }
    }],

    goodIssues: [{

        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good'
        },

        lot: {
            type: Schema.Types.ObjectId,
            ref: 'Lot'
        },

        type: {
            type: String,
            enum: [""]
        },

        quantity: {
            type: Number
        }
    }],

    goodReturns: [{

        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good'
        },

        lot: {
            type: Schema.Types.ObjectId,
            ref: 'Lot'
        },

        type: {
            type: String,
            enum: [""]
        },

        bill: {
            type: Schema.Types.ObjectId,
            replies: this
        },

        returnQuantity: {
            type: Number
        },

        note: {
            type: String,
            enum: [""]
        }
    }],

    stockTakes: [{

        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good'
        },

        lot: {
            type: Schema.Types.ObjectId,
            ref: 'Lot'
        },

        type: {
            type: String,
            enum: [""]
        },

        realQuantity: {
            type: Number
        },

        damagedQuantity: {
            type: Number,
            default: 0
        },

        note: {
            type: String
        }
    }]
});

BillSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.Bill)
        return db.model('Bill', BillSchema);
    return db.models.Bill;
}
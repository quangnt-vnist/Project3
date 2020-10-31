const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const LotSchema = new Schema ({

    name: {
        type: String,
        required: true
    },

    good: {
        type: Schema.Types.ObjectId,
        ref: 'Good'
    },

    stocks: [{
        stock: {
            type: Schema.Types.ObjectId,
            ref: 'Stock'
        },

        quantity: {
            type: Number
        },

        binLocations: [{
            binLocation: {
                type: Schema.Types.ObjectId,
                ref: 'BinLocation'
            },

            quantity: {
                type: Number
            }
        }]
    }],

    originalQuantity: {
        type: Number,
        default: 0
    },

    quantity: {
        type: Number,
        default: 0
    },

    expirationDate: {
        type: Date,
    },

    description: {
        type: String
    },

    lotLogs: [{

        bill: {
            type: Schema.Types.ObjectId,
            ref: 'Bill'
        },

        quantity: {
            type: Number
        },

        description: {
            type: String
        },

        type: {
            type: String
        },

        createdAt: {
            type: Date,
            default: Date.now
        },

        stock: {
            type: Schema.Types.ObjectId,
            ref: 'Stock',
        },

        binLocations: [{
            binLocation: {
                type: Schema.Types.ObjectId,
                ref: 'BinLocation'
            },

            quantity: {
                type: Number
            }
        }]
    }],

    logs: [{

        createAt: {
            type: Date,
            default: Date.now
        },

        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

        title: {
            type: String
        },

        description: {
            type: String
        }
    }]
});

LotSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.Lot)
        return db.model('Lot', LotSchema);
    return db.models.Lot;
}
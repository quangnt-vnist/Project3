const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ProposalSchema = new Schema ({

    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },

    code: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: [""]
    },

    stock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },

    description: {
        type: String
    },

    goods: [{
        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good'
        },

        quantity: {
            type: Number,
            default: 1,
            required: true
        },

        price: {
            type: Number,
            default: 1000
        }
    }],

    partner: {
        type: Schema.Types.ObjectId,
        ref: 'Partner'
    },

    moveStock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },

    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    timestamp: {
        type: Date,
        default: Date.now
    },

    expectedDate: {
        type: Date
    }
});

ProposalSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.Proposal)
        return db.model('Proposal', ProposalSchema);
    return db.models.Proposal;
}
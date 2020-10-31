const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const BinLocationSchema = new Schema ({

    parent: {
        type: Schema.Types.ObjectId,
        replies: this
    },

    child: [{
        type: Schema.Types.ObjectId,
        replies: this
    }],

    path: {
        type: String
    },

    code: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    stock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },

    status: {
        type: String,
        enum: ["1", "2", "3", "4", "5"]
    },

    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // goods: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Good'
    // }],

    department: {
        type: Schema.Types.ObjectId,
        ref: 'OrganizationalUnit'
    },

    enableGoods: [{
        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good'
        },

        contained: {
            type: Number,
            default: 0
        },

        capacity: {
            type: Number,
            default: 0
        }
    }],

    capacity: {
        type: Number,
        default: 0
    },

    contained: {
        type: Number,
        default: 0
    },

    unit: {
        type: String
    }
});

BinLocationSchema.plugin(mongoosePaginate);

module.exports = (db) =>{
    if(!db.models.BinLocation)
        return db.model('BinLocation', BinLocationSchema);
    return db.models.BinLocation;
}
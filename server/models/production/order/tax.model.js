const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const TaxSchema = new Schema({
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
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    goods: [{
        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good'
        },
        percent: {
            type: Number
        }
    }],
    version: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true,
})

TaxSchema.plugin(mongoosePaginate);

module.exports = (db) =>{
    if(!db.models.Tax)
        return db.model('Tax', TaxSchema)
    return db.models.Tax
}
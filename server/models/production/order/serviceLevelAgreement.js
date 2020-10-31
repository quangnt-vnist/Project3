const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceLevelAgreementSchema = new Schema({
    goods: [{
        type: Schema.Types.ObjectId,
        required: true
    }],
    title: {
        type: String,
        required: true
    },
    description: [{
        type: String
    }],
    creator: {
        type: Schema.Types.ObjectId,
        required: true
    },
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

module.exports = (db) =>{
    if (!db.models.ServiceLevelAgreement)
        return db.model('ServiceLevelAgreement',ServiceLevelAgreementSchema)
    return db.models.ServiceLevelAgreement
}
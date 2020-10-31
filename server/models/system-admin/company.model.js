const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CompanySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    shortName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    log: {
        type: Boolean,
        default: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    superAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

CompanySchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.Company)
        return db.model('Company', CompanySchema);
    return db.models.Company;
}
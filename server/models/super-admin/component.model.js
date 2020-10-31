const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ComponentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    deleteSoft: {
        type: Boolean,
        default: true
    },
    links: [{
        type: Schema.Types.ObjectId,
        ref: 'Link'
    }],
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

ComponentSchema.virtual('roles', {
    ref: 'Privilege',
    localField: '_id',
    foreignField: 'resourceId'
});

ComponentSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.Component)
        return db.model('Component', ComponentSchema);
    return db.models.Component;
}
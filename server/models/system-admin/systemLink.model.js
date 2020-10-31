const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const SystemLinkSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    components: [{
        type: Schema.Types.ObjectId,
        ref: 'SystemComponent'
    }],
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'RootRole'
    }],
    category: {
        type: String
    },
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

SystemLinkSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.SystemLink)
        return db.model('SystemLink', SystemLinkSchema);
    return db.models.SystemLink;
}
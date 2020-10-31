const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const SystemComponentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'RootRole'
    }],
    links: [{
        type: Schema.Types.ObjectId,
        ref: 'SystemLink'
    }],
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

SystemComponentSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.SystemComponent)
        return db.model('SystemComponent', SystemComponentSchema);
    return db.models.SystemComponent;
}
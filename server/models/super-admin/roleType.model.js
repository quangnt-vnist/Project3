const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleTypeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
},{
    timestamps: true
});

module.exports = (db) => {
    if(!db.models.RoleType)
        return db.model('RoleType', RoleTypeSchema);
    return db.models.RoleType;
}
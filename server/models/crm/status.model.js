const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const StatusSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    name: { // Tên trạng thái
        type: String,
        required: true
    },
    description: { // Mô tả trạng thái
        type: String
    },
    active: {
        type:Boolean,
        default: false,  
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    }
}, {
    timestamps: true,
});

StatusSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Status)
        return db.model('Status', StatusSchema);
    return db.models.Status;
}

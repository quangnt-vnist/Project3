const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CareTypeSchema = new Schema({
    name: { //tên loại hình chăm sóc khách hàng
        type: String,
        required: true
    },
    description: { // Mô tả loại hình chăm sóc
        type: String,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    }
}, {
    timestamps: true,
});

CareTypeSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.CareType)
        return db.model('CareType', CareTypeSchema);
    return db.models.CareType;
}
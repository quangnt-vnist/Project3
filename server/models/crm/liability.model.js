const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Chưa hoàn thiện
const LiabilitySchema = new Schema({
    code: { // Mã phiếu
        type: String,
        required: true
    },
    customer: { // Khách hàng
        type: Schema.Types.ObjectId,
        ref: 'CrmCustomer'
    },
    creator: { // Người tạo
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: { // Mô tả
        type: String
    },
    total: {
        type: Number
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    }
}, {
    timestamps: true,
});

LiabilitySchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Liability)
        return db.model('Liability', LiabilitySchema);
    return db.models.Liability;
}

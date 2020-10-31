const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const GroupSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    code: { // Mã nhóm khách hàng
        type: String,
        required: true
    },
    name: { // Tên nhóm khashc hàng (Bán lẻ, Bán buôn)
        type: String,
        required: true
    },
    description: { // Mô tả nhóm khashc hàng
        type: String
    },
    customerTotal: {
        type: Number,
        default: 0
    },
    promotion: [{ // Ưu đãi theo nhóm khách hàng
        code: {
            type: String
        },
        name: {
            type: String
        },
        value: {
            type: String,
        }
    }],
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    }
}, {
    timestamps: true,
});

GroupSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Group)
        return db.model('Group', GroupSchema);
    return db.models.Group;
}

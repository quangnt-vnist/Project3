const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ProductDiscountSchema = new Schema({
    code: { // Mã của mã giảm giá
        type: String,
        required: true
    },
    name: { // Tên mã giảm giá
        type: String,
        required: true
    },
    description: { // Mô tả danh mục
        type: String
    },
    hits: { // Số lượt sử dụng mã giảm giá
        type: Number,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    }
    // value: {

    // }
}, {
    timestamps: true,
});

ProductDiscountSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.ProductDiscount)
        return db.model('ProductDiscount', ProductDiscountSchema);
    return db.models.ProductDiscount;
}

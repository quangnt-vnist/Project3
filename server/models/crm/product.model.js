const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ProductSchema = new Schema({
    code: { // Mã Sản phẩm
        type: String,
        required: true
    },
    name: { // Tên sản phẩm
        type: String,
        required: true
    },
    productImage: {
        type: String,
    },
    description: { // Mô tả sản phẩm
        type: String
    },
    priceBeforeDiscount: {
        type: Number,
        required: true,
    },
    priceAfterDiscount: {
        type: Number,
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'ProductCategory'
    }],
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    discount: {
        type: Schema.Types.ObjectId,
        ref: 'ProductDiscount'
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    }
}, {
    timestamps: true,
});

ProductSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Product)
        return db.model('Product', ProductSchema);
    return db.models.Product;
}

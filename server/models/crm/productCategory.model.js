const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ProductCategorySchema = new Schema({
    code: { // Mã danh mục sản phẩm
        type: String,
        required: true
    },
    name: { // Tên danh mục sản phẩm
        type: String,
        required: true
    },
    description: { // Mô tả danh mục
        type: String
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    }
}, {
    timestamps: true,
});

ProductCategorySchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.ProductCategory)
        return db.model('ProductCategory', ProductCategorySchema);
    return db.models.ProductCategory;
}

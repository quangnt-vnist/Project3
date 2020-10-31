const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

// Bảng nhà máy sản xuất
const ManufacturingWorksSchema = new Schema({
    code: { // Mã nhà máy
        type: String,
        required: true
    },
    name: { // Tên nhà máy
        type: String,
        required: true
    },
    worksManager: { // Giám đốc nhà máy
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    foreman: { // Quản đốc nhà máy
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    manufacturingMills: [{ // Các xưởng của nhà máy
        type: Schema.Types.ObjectId,
        ref: "ManufacturingMill"
    }],
    phoneNumber: { // Số điện thoại của nhà máy
        type: String
    },
    status: { // Trạng thái nhà máy: 0. Không hoạt động || 1. Hoạt động bình thường
        type: Number,
        default: 1
    },
    address: { // Địa chỉ nhà máy
        type: String
    },
    description: { // Mô tả nhà máy
        type: String
    }

}, {
    timestamps: true
});

ManufacturingWorksSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.ManufacturingWorks)
        return db.model('ManufacturingWorks', ManufacturingWorksSchema);
    return db.models.ManufacturingWorks;
}
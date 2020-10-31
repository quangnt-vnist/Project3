const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')


// Bảng xưởng sản xuất
const ManufacturingMillSchema = new Schema({
    code: { // Mã xưởng sản xuất
        type: String,
        required: true
    },
    name: { // Tên xưởng sản xuất
        type: String,
        required: true
    },
    manufacturingWorks: { // Nhà máy chứa xưởng
        type: Schema.Types.ObjectId,
        ref: 'ManufacturingWorks'
    },
    description: { // Mô tả xưởng
        type: String
    },
    status: {// Trạng thái xưởng 0. Không hoạt động, 1. Đang hoạt động
        type: Number,
        default: 1
    },
    workSchedules: [{// Lịch làm việc của xưởng
        year: Number, // Năm
        numberOfTurn: [{ // Mảng số ca [3, 3 ,3 ,3, 3 ...]
            type: Number
        }],
        stateOfTurn: [{ // Mảng trạng thái ca [Mã lệnh, null, null, Mã lệnh, Mã lệnh, ...]
            type: Schema.Types.ObjectId,
            ref: "ManufacturingCommand",
            default: null
        }]
    }]
}, {
    timestamps: true
});

ManufacturingMillSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.ManufacturingMill)
        return db.model('ManufacturingMill', ManufacturingMillSchema);
    return db.models.ManufacturingMill;
}
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Bảng công nhân nhà máy
const workerSchema = new Schema({
    employeeId: { // nhân viên
        type: Schema.Types.ObjectId,
        ref: "Employee"
    },
    manufacturingWorks: { // Công nhân thuộc nhà máy nào
        type: Schema.Types.ObjectId,
        ref: "ManufacturingWorks"
    },
    workSchedules: [{ // Lịch sản xuất của công nhân
        year: Number, // Năm
        numberOfTurn: [{ // Mảng số ca [3, 3, 3, 3, ...]
            type: Number
        }],
        stateOfTurn: [{ // Mảng trạng thái ca [Mã lệnh, null, Mã lệnh, null, Mã lênh, ...]
            type: Schema.Types.ObjectId,
            ref: "ManufacturingCommand",
            default: null
        }]
    }]
}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.Worker)
        return db.model("Worker", workerSchema);
    return db.models.Worker;
}
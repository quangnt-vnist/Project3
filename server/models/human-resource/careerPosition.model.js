const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng chuyên ngành tương đương
const CareerPositionSchema = new Schema({
    name: {
        type: String,
    },
    code: {
        type: String,
    },
    description: [{
        name: {
            type: String,
        },
        code: {
            type: String,
        },
        type: {
            type: Number,
            default: 1, // 1 - default, 0 - additional
        },
        // specialized: [{
        //     name: {
        //         type: String,
        //     },
        //     code: {
        //         type: String,
        //     },
        //     type: {
        //         type: Number,
        //         default: 1, // 1 - default, 0 - additional
        //     }
        // }]
    }]
}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.CareerPosition)
        return db.model('CareerPosition', CareerPositionSchema);
    return db.models.CareerPosition;
}
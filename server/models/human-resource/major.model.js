const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng chuyên ngành tương đương
const MajorSchema = new Schema({
    name: {
        type: String,
    },
    code: {
        type: String,
    },
    group: [{
        name: {
            type: String,
        },
        code: {
            type: String,
        },
        specialized: [{
            name: {
                type: String,
            },
            code: {
                type: String,
            },
            type: {
                type: Number,
                default: 1, // 1 - default, 0 - additional
            }
        }]
    }]
}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.Major)
        return db.model('Major', MajorSchema);
    return db.models.Major;
}
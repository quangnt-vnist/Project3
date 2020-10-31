const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng datatable kỷ luật
const DisciplineSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
    decisionNumber: { // Số hiệu quyết định kỷ luật
        type: String,
        required: true,
    },
    organizationalUnit: { // Cấp ra quyết định
        type: Schema.Types.ObjectId,
        ref: 'OrganizationalUnit'
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
    },
    type: { // Hình thức kỷ luật
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.Discipline)
        return db.model('Discipline', DisciplineSchema);
    return db.models.Discipline;
}
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng datatbale lương nhân viên
const SalarySchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: 'OrganizationalUnit',
        required: true,
    },
    month: {
        type: Date,
        required: true,
    },
    mainSalary: { // Lương chính
        type: String,
        required: true,
    },
    unit: { // Đơn vị tiền lương(VND hoặc USD)
        type: String,
        required: true,
        enum: ['VND', 'USD'],
        default: 'VND',
    },
    bonus: [{ // Tiền lương thưởng khác
        nameBonus: String,
        number: String,
    }],
}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.Salary)
        return db.model('Salary', SalarySchema);
    return db.models.Salary;
}
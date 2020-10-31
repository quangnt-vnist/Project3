const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng datatable chấm công
const TimesheetSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    month: {
        type: Date,
        required: true,
    },

    totalHours: { // Số giờ làm việc
        type: Number,
    },

    totalHoursOff: { // Số giờ nghỉ
        type: Number,
    },

    // Chấm công theo giờ làm Việc
    timekeepingByHours: [{
        type: Number,
    }],

    // Chấm công theo ca làm việc
    timekeepingByShift: {
        shift1s: [{ // Ca làm việc 1 (ví dụ buổi sáng), true là làm việc, false là nghỉ việc
            type: Boolean,
        }],
        shift2s: [{ // Ca làm việc 2 (ví dụ buổi chiều), true là làm việc, false là nghỉ việc
            type: Boolean,
        }],
        shift3s: [{ // Ca làm việc 3 (ví dụ tăng ca, buổi tối), true là làm việc, false là nghỉ việc
            type: Boolean,
        }],
    },

}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.Timesheet)
        return db.model('Timesheet', TimesheetSchema);
    return db.models.Timesheet;
}
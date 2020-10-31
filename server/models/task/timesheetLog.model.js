const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model quản lý dữ liệu lịch sử bấm giờ thực hiện công việc
const TimesheetLogSchema = new Schema({
    task: { //lưu id của công việc 
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Thời gian bắt đầu bấm giờ 
    start: {
        type: Number,
        required: true
    },
    // Thời gian bắt đầu tính giờ hiện tại
    startTimer: {
        type: Number,
        required: true
    },
    stopTimer: {
        type: Number
    },
    time: {
        type: Number,
        default: 0
    },
    pause: {
        type: Boolean,
        default: false,
        required: true
    }
});

module.exports = (db) => {
    if(!db.models.TimesheetLog)
        return db.model('TimesheetLog', TimesheetLogSchema);
    return db.models.TimesheetLog;
}
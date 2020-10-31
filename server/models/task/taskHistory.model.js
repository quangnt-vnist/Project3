const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TaskHistorySchema = new Schema({
    time: {
        type: Date,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role'
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task'
    },
    log: {
        type: String
        //VD: Đã sửa tên công việc thành "Kiểm thử sản phẩm thuốc", sửa tiến dộ công việc thành "70%"
        // có 1 button show log - bấm vào thì sẽ mở 1 trang mới chứa thông tin về lịch sử
    }
});

module.exports = (db) => {
    if(!db.models.TaskHistory)
        return db.model('TaskHistory', TaskHistorySchema);
    return db.models.TaskHistory;
}
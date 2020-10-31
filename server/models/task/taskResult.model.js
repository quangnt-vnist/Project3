const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model quản lý kết quả thực hiệc công việc
const TaskResultSchema = new Schema({
    // Người được đánh giá
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // vai trò: người thực hiện: responsible, người tư vấn: consulted, người phê duyệt: accountable
    role: {
        type: String,
        required: true
    },
    // Điểm hệ thống đánh giá
    automaticPoint: {
        type: Number,
        default: 0
    },
    // Điểm tự đánh giá
    employeePoint: {
        type: Number,
        default: 0
    },
    // Điểm do quản lý đánh giá
    approvedPoint: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.TaskResult)
        return db.model('TaskResult', TaskResultSchema);
    return db.models.TaskResult;
}
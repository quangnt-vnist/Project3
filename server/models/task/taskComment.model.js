const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model quản lý các hoạt động hoặc bình luận của một công việc
const TaskCommentSchema = new Schema({
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parent: {// Có thể là comment cha hoặc là action task
        type: Schema.Types.ObjectId,
         replies: this
    },
    content: {
        type: String,
    },
    approved: {
        type: Number,
        default: 0,
        required: true
    },
    // file: {
    //     type: Schema.Types.ObjectId,
    //     ref: TaskFile,
    //     required: true
    // }
}, {
    timestamps: true
});

module.exports = (db) => {
    if(!db.models.TaskComment)
        return db.model('TaskComment', TaskCommentSchema);
    return db.models.TaskComment;
}
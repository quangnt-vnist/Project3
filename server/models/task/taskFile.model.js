const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model quản lý tài liệu của một công việc
const TaskFileSchema = new Schema({
    name: {
        type: String,
    },
    url: {
        type: String,
        required: true
    }
});

module.exports = (db) => {
    if(!db.models.TaskFile)
        return db.model('TaskFile', TaskFileSchema);
    return db.models.TaskFile;
}
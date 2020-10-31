const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model quản lý kết quả của các thông tin công việc theo mẫu
const TaskResultInformationSchema = new Schema({
    member:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    taskInformation: {
        type: Schema.Types.ObjectId,
        ref: 'TaskTemplateInformation',
        required: true
    },
    value: {
        type: Schema.Types.Mixed,
    }
}, {
    timestamps: true
});

module.exports = (db) => {
    if(!db.models.TaskResultInformation)
        return db.model('TaskResultInformation', TaskResultInformationSchema);
    return db.models.TaskResultInformation;
}
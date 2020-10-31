const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const NotificationSchema = new Schema({
    level: { //gồm 4 loại: info, general, important, emergency
        type: String
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    sender: { // Gửi từ đâu (kiểu String), có thể thông báo từ 1 công việc/tài liệu nào đó, thông báo từ BGĐ công ty, ...
        type: String,
        required: true
    },
    user: { // thông báo này của ai (người đó sẽ thấy thông báo này trong giao diện)
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    readed: { // đã đọc hay chưa?
        type: Boolean,
        default: false
    },
    manualNotification: { // Nếu là loại thông báo tạo bởi ai đó, thì sẽ kết nối với bngr 
        type: Schema.Types.ObjectId,
        ref: 'ManualNotification',
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

NotificationSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.Notification)
        return db.model('Notification', NotificationSchema);
    return db.models.Notification;
}
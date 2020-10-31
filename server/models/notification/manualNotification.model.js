const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

/** 
 * Schema lưu trữ thông tin khi admin/giám đốc muốn tạo thông báo đến các phòng ban.
 * Khi admin/giám đốc thực hiện hành động tạo thông báo, sẽ lưu dữ liệu trong bảng này và tạo các thông báo lưu vào bảng notification
 * Dữ liệu trong bảng này chỉ dùng cho admin/giám đốc xem lại thông báo đã tạo của mình, hoặc xóa đi nếu muốn
*/
const ManualNotificationSchema = new Schema({ 
    creator: { // người tạo
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: { // VD: gửi từ Ban giám đốc, từ Bộ phận bảo vệ, Nhóm X, ...
        type: String,
        required: true
    },
    level: { //gồm 4 loại: info, normal, warning, error
        type: String
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    users: [{ // gửi đến cho những người nào
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    organizationalUnits: [{ //gửi đến cho những đơn vị nào
        type: Schema.Types.ObjectId,
        ref: 'OrganizationalUnit',
    }]
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

ManualNotificationSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.ManualNotification)
        return db.model('ManualNotification', ManualNotificationSchema);
    return db.models.ManualNotification;
}
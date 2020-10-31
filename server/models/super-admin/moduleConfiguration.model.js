const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ModuleConfigurationSchema = new Schema({
    // Cấu hình cho modul quản lý nhân sự
    humanResource: {
        contractNoticeTime: { // Thời gian nhắc hết hạn hợp đồng lao động
            type: Number,
        },

        timekeepingType: {
            type: String,
            enum: ['shift', 'hours', 'shift_and_hour'] // shift chấm công theo ca, hour chấm công theo giờ, chấm công theo ca và giờ
        },

        timekeepingByShift: {
            shift1Time: {
                type: Number,
            },
            shift2Time: {
                type: Number,
            },
            shift3Time: {
                type: Number,
            }
        },

        timekeepingByShiftAndHour: {
            type: String,
        }
    },
}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.ModuleConfiguration)
        return db.model('ModuleConfiguration', ModuleConfigurationSchema);
    return db.models.ModuleConfiguration;
}
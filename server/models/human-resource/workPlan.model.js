const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng datatable nghỉ lễ tết
const WorkPlanSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    maximumNumberOfLeaveDays: {
        type: Number,
        default: 0,
        required: true,
    },
    workPlans: [{
        type: {
            type: String,
            required: true,
            enum: ['time_for_holiday', 'time_not_allow_to_leave', 'time_allow_to_leave'],
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        description: {
            type: String,
            required: true
        },
    }],
}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.WorkPlan)
        return db.model('WorkPlan', WorkPlanSchema);
    return db.models.WorkPlan;
}
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model quản lý các mục tiêu chi tiết của kpi đơn vị
const OrganizationalUnitKpiSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        replies: this
    },
    weight: {
        type: Number,
        required: true
    },
    criteria: {
        type: String,
        required: true
    },
    // Đánh đấu các mục tiêu mặc định khi thiết lập kpi cá nhân: 
    // 0 là không phải mục tiêu mặc định
    // 1 là mục tiêu mặc đinh cho vai trò A (người phê duyệt)
    // 2 là mục tiêu mặc định cho vai trò C (Người tư vấn)
    type: {
        type: Number,
        default: 0
    },
    automaticPoint: { // Điểm tự động
        type: Number,
        default: null
    },
    employeePoint: { // Điểm nhân viên tự đánh giá
        type: Number,
        default: null
    },
    approvedPoint: {
        type: Number,
        default: null
    }
});

module.exports = (db) => {
    if (!db.models.OrganizationalUnitKpi)
        return db.model('OrganizationalUnitKpi', OrganizationalUnitKpiSchema);
    return db.models.OrganizationalUnitKpi;
}

// Thuộc tính không đổi
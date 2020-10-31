const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model cho chức năng quản lý KPI đơn vị
const OrganizationalUnitKpiSetSchema = new Schema({
    // Lưu thông tin đơn vị quản lý kpi này
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: 'OrganizationalUnit',
        required: true
    },
    // Lưu thông tin người thiết lập kpi
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // KPi tháng nào
    date: {
        type: Date,
        required: true
    },
    // Danh sách các KPI trong tập kpi này
    kpis: [{
        type: Schema.Types.ObjectId,
        ref: 'OrganizationalUnitKpi',
        required: true
    }],
    automaticPoint: {
        type: Number,
        default: null
    },
    employeePoint: {
        type: Number,
        default: null
    },
    approvedPoint: {
        type: Number,
        default: null
    },
    // Trạng thái kpi đơn vị: 0: Đang thiết lập, 1: Đã kích hoạt
    status: {
        type: Number,
        default: 0
    },
    comments: [{ // Trao đổi khi thiết lập KPIs
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type : Date,
            default: Date.now
        },
        files: [{ // Các file đi kèm comments
            name: {
                type: String,
            },
            url: {
                type: String,
                required: true
            }
        }],
        comments: [{  // Comments của comment
            creator: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            content: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type : Date,
                default: Date.now
            },
            files: [{ // Các file đi kèm comments
                name: {
                    type: String,
                },
                url: {
                    type: String,
                    required: true
                }
            }],
        }],
    }]
}, {
    timestamps: true
});

module.exports = (db) => {
    if(!db.models.OrganizationalUnitKpiSet)
        return db.model('OrganizationalUnitKpiSet', OrganizationalUnitKpiSetSchema);
    return db.models.OrganizationalUnitKpiSet;
}

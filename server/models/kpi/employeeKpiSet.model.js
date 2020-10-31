const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model quản lý dữ liệu của một kpi cá nhân
const EmployeeKpiSetSchema = new Schema({
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: 'OrganizationalUnit',
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    approver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    // 0: Đang thiết lập,1: Chờ phê duyệt, 2: Đã kích hoạt
    status: {
        type: Number,
        default: 0
    },
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
    kpis: [{
        type: Schema.Types.ObjectId,
        ref: 'EmployeeKpi',
        required: true
    }],
    comments: [{ // Trao đổi khi thiết lập KPIs
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        description: {
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
            description: {
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
    if(!db.models.EmployeeKpiSet)
        return db.model('EmployeeKpiSet', EmployeeKpiSetSchema);
    return db.models.EmployeeKpiSet;
}
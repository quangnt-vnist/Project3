const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskReportSchema = new Schema({
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: 'OrganizationalUnit',
        required: true
    },
    taskTemplate: {
        type: Schema.Types.ObjectId,
        ref: 'TaskTemplate',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    readByEmployees: [{
        type: Schema.Types.ObjectId,
        ref: 'Role',
    }],
    responsibleEmployees: [{ //Người thực hiện
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    accountableEmployees: [{// Người phê duyệt
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    status: {// 0: tất cả, 1: Finished, 2: Inprocess.
        type: Number,
    },
    frequency: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    configurations: [{
        code: { // Mã thuộc tính công việc dùng trong công thức
            type: String,
        },
        name: { // Tên thuộc tính công việc
            type: String,
            required: true
        },
        extra: { // Cho kiểu dữ liệu tập giá trị, lưu lại các tập giá trị
            type: String
        },
        type: {
            type: String,
            enum: ['text', 'boolean', 'date', 'number', 'set_of_values'],
        },
        filter: {
            type: String,
        },
        showInReport: {
            type: Boolean
        },
        newName: {
            type: String
        },
        aggregationType: { // 0: tính theo kiểu trung bình cộng, 1: tính theo kiểu tổng
            type: Number
        },
        chartType: { // 0: Barchart, 1: Line Chart, 2: Pie chart,....
            type: Number
        },
        coefficient: {
            type: Number
        }
    }],
    listDataChart: [{ // danh sách dữ liệu trong biểu đồ
        id: {
            type: Number
        },
        name: {
            type: String,
        }
    }],
    dataForAxisXInChart: [{// Chiều dữ liệu đưa vào biểu đồ
        id: {
            type: Number
        },
        name: {
            type: String
        }
    }]
}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.TaskReport)
        return db.model('TaskReport', TaskReportSchema);
    return db.models.TaskReport;
}
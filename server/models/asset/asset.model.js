const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AssetSchema = new Schema({

    company: { //thuộc công ty nào
        type: Schema.Types.ObjectId,
        ref: 'companies',
        required: true
    },

    group: {
        type: String,
        enum: ["building", "vehicle", "machine", "other"]
    },

    /***************************************************************************************************
     * Tab thông tin chung
     */
    avatar: {
        type: String
    },

    code: { //2.mã tài sản
        type: String,
        required: true
    },

    assetName: { //3.tên tài sản
        type: String,
        required: true
    },

    serial: { //4. số serial 
        type: String,
    },

    assetType: [{ //5.loại tài sản
        type: Schema.Types.ObjectId,
        ref: 'AssetType',
    }],

    purchaseDate: { //6.ngày nhập, ngày mua
        type: Date,
        defaut: Date.now,
        required: true
    },

    warrantyExpirationDate: { //7.ngày bảo hành (thời gian bảo hành)
        type: Date
    },

    managedBy: { //11.Người quản lý
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },

    assignedToUser: { //12.Người đang được giao sử dụng
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },

    assignedToOrganizationalUnit: { //13.Đơn vị đang được giao sử dụng
        type: Schema.Types.ObjectId,
        ref: 'OrganizationalUnit',
    },

    location: { // 16.vị trí tài sản
        type: Schema.Types.ObjectId,
        replies: this,
        // required: true
    },

    status: { //17.tình trạng: sẵn sàng sử dụng || đang sử dụng || hỏng hóc || mất || Thanh lý
        type: String,
        // enum: ["Sẵn sàng sử dụng", "Đang sử dụng", "Hỏng hóc", "Mất", "Thanh lý"]
        enum: ["ready_to_use", "in_use", "broken", "lost", "disposed"],
    },

    typeRegisterForUse: { //Đăng ký sử dụng: 1.Không được đăng ký, 2.Đăng ký sử dụng theo giờ, 3.Đăng ký sử dụng lâu dài
        type: Number,
        //     type: String,
        //    enum: ["Được phép đăng ký sử dụng", "Không được phép đăng ký sử dụng"]
    },

    description: { //18.mô tả
        type: String,
    },

    detailInfo: [{ // thông tin chi tiết
        nameField: String, // tên trường dữ liệu
        value: String, //giá trị
    }],

    readByRoles: [{ // quyền xem theo Role
        type: Schema.Types.ObjectId,
        ref: 'RootRole'
    }],
    /***********************************************************************************************
     * Tab Khấu hao
     */
    depreciationType: { // Cách tính khấu hao
        type: String,
        // enum: ["Đường thẳng", "Số dư giảm dần", "Sản lượng"],
        enum: ["straight_line", "declining_balance", "units_of_production"],
        // Reducing balance chính là Declining Balance Method
    },

    cost: { //8. Nguyên giá
        type: Number
    },

    usefulLife: { //9. Thời gian sử dụng
        type: Number
    },

    startDepreciation: { // thời gian bắt đầu trích khấu hao
        type: Date
    },

    residualValue: { // 10. Giá trị thu hồi ước tính.
        /* Là giá trị ước tính của một tài sản vào cuối thời hạn thuê 
        hoặc thời gian sử dụng hữu ích.Theo nguyên tắc chung, 
        thời gian sử dụng hữu dụng hoặc thời gian thuê của một tài sản càng dài 
        thì giá trị còn lại của nó càng thấp */
        type: Number
    },

    rate: { // Dùng trong phương pháp Reducing balance/DecliningBalance
        type: Number,
    },

    unitsProducedDuringTheYears: [{ // Dùng trong UnitsOfProduction
        month: {
            type: Date
        },
        unitsProducedDuringTheYear: {
            type: Number
        },
    }],

    estimatedTotalProduction: { // Dùng trong UnitsOfProduction
        type: Number
    },

    /**************************************************************************************************
     * Lịch sử sử dụng - Tab cấp phát
     */
    usageLogs: [{ //ghi lại lịch sử sử dụng
        usedByUser: { // người sử dụng
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        usedByOrganizationalUnit: {
            type: Schema.Types.ObjectId,
            ref: 'OrganizationalUnit',
        },
        startDate: { // ngày bắt đầu sử dụng
            type: Date
        },
        endDate: { //ngày kết thúc sử dụng
            type: Date
        },
        description: { //mô tả
            type: String
        }
    }],

    /**************************************************************************************************
     * bảo trì: tab Sửa chữa
     */
    maintainanceLogs: [{ // bảo trì thiết bị
        maintainanceCode: { //số phiếu
            type: String,
            //  required: true
        },
        createDate: { // ngày lập
            type: Date
        },
        type: { //phân loại: 1. sửa chữa , 2.thay thế , 3. nâng cấp
            type: String,
            //  required: true,
        },
        description: { // nội dung, lý do
            type: String,
            //  required: true
        },
        startDate: { //Ngày bắt đầu sửa
            type: Date
        },
        endDate: { //Ngày hoàn thành
            type: Date
        },
        expense: { //chi phí sửa chữa - thay thế  - NÂNG CẤP
            type: Number,
            //  required: true
        },
        status: { //trạng thái, tình trạng: 1-chưa thực hiện || 2-đang thực hiện || 3-đã thực hiện
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],

    /**************************************************************************************************
     * sự cố tài sản - tab Sự cố
     */
    incidentLogs: [{ //sự cố tài sản
        incidentCode: {
            type: String
        },
        type: { //Phân loại: 1. Báo hỏng , 2.Báo mất
            type: String,
            //  require: true,
        },
        reportedBy: { //Người báo cáo
            type: Schema.Types.ObjectId,
            ref: 'User',
            // required: true
        },
        dateOfIncident: { //Ngày phát hiện
            type: Date,
            defaut: Date.now,
            // required: true
        },
        description: { //Nội dung
            type: String,
            // required: true
        },
        statusIncident: { // 1: cho xu ly || 2: da xu ly
            type: String,
            // required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],

    /**************************************************************************************************
     * Lịch sử vị trí tài sản
     */
    locationLogs: [{ //lịch sử vị trí của tài sản
        location: {
            type: String
        },
        startDate: Date,
        endDate: Date,
        description: String
    }],

    /**************************************************************************************************
     * Thông tin thanh lý
     */
    disposalDate: { // thời gian thanh lý
        type: Date
    },
    disposalType: { // 1-phá hủy(scrapped), 2-sold, 3-gifted
        type: String,
    },
    disposalCost: { // giá trị thanh lý
        type: Number,
    },
    disposalDesc: { // Nội dung thanh lý
        type: String
    },

    /***************************************************************************************************
     * trường dữ liệu động
     */
    informations: [{ //
        code: { // Mã thuộc tính
            type: String,
        },
        name: { // Tên thông tin/thuộc tính 
            type: String,
        },
        description: {
            type: String,
        },
        extra: { // Cho kiểu dữ liệu tập giá trị, lưu lại các tập giá trị
            type: String
        },
        type: {
            type: String,
            required: true,
            // enum: ['Text', 'Boolean', 'Date', 'Number', 'SetOfValues'],
            enum: ['text', 'boolean', 'date', 'number', 'set_of_values'],
        },
        value: {
            type: Schema.Types.Mixed,
        }
    }],

    /***************************************************************************************************
     * tab Tài liệu đính kèm
     */
    documents: [{ // Các tài liệu đính kèm với tài sản
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        files: [{
            fileName: {
                type: String,
            },
            url: {
                type: String,
                required: true
            },
        }],
    }],

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = (db) => {
    if (!db.models.Asset)
        return db.model('Asset', AssetSchema);
    return db.models.Asset;
}
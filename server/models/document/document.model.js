const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const DocumentSchema = new Schema({
    /**Thông tin cơ bản về tài liệu*/
    name: { //tên 
        type: String,
        required: true
    },
    domains: [{
        type: Schema.Types.ObjectId,
        ref: 'DocumentDomain'
    }],
    company: { //thuộc công ty nào
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'DocumentCategory'
    },
    description: { //mô tả
        type: String
    },
    issuingBody: { // Cơ quan ban hành
        type: String
    },
    signer: {  // Người ký
        type: String
    },
    officialNumber: { // Số hiệu. VD: 920/QD-NHNN
        type: String
    },
    views: [{
        viewer: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        time: {
            type: Date,
            default: Date.now()
        }
    }],
    downloads: [{
        downloader: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        time: {
            type: Date,
            default: Date.now()
        },
    }],
    numberOfView: { //số lần xem
        type: Number,
        default: 0
    },
    numberOfDownload: { //số lần download
        type: Number,
        default: 0
    },

    //**Thông tin về các phiên bản của tài liệu này*/
    versions: [{
        versionName: { // tên phiên bản
            type: String
        },
        issuingDate: { // Ngày ban hành
            type: Date
        },
        effectiveDate: { // ngày áp dụng
            type: Date
        },
        expiredDate: { // Ngày hết hạn
            type: Date
        },
        file: {
            type: String // vị trí lưu file upload (file doc) được tải lên
        },
        scannedFileOfSignedDocument: {
            type: String // vị trí file scan (file có chữ ký) được tải lên
        },
        // file: {
        //     name: {
        //         type: String // vị trí lưu file upload (file doc) được tải lên
        //     },
        //     url: {
        //         type: String
        //     }
        // },
        // scannedFileOfSignedDocument: {
        //     name: {
        //         type: String // vị trí lưu file upload (file doc) được tải lên
        //     },
        //     url: {
        //         type: String
        //     }
        // },
    }],


    /**Liên kết văn bản */
    relationshipDescription: { //mô tả
        type: String
    },
    relationshipDocuments: [{ //các tài liệu được liên kết
        type: Schema.Types.ObjectId,
        replies: this
    }],

    /** Những vị trí có quyền xem mẫu này */
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'Role'
    }],

    /**Hồ sơ lưu trữ bản cứng */
    archives: [{
        type: Schema.Types.ObjectId,
        ref: 'DocumentArchive'
    }],
    // archivedRecordPlaceInfo: {
    //     type: String
    // },
    archivedRecordPlaceOrganizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: 'OrganizationalUnit'
    },
    archivedRecordPlaceManager: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    /**
     * Lịch sử chỉnh sửa
     */
    logs: [{
        createdAt: {
            type: Date,
            default: Date.now
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
    }],

}, {
    timestamps: true, //ngày tạo và ngày sửa gần nhất
    toJSON: { virtuals: true }
});

DocumentSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Document)
        return db.model('Document', DocumentSchema);
    return db.models.Document;
}
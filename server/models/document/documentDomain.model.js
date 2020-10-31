const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const DocumentDomainSchema = new Schema({
    name: { //tên 
        type: String,
        required: true
    },
    description: {
        type: String
    },
    company: { //thuộc công ty nào
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    documents: [{ //chứa những document nào
        type: Schema.Types.ObjectId,
        ref: 'Document'
    }],
    parent: {
        type: Schema.Types.ObjectId,
        replies: this
    }
}, {
    timestamps: true, //ngày tạo và ngày sửa gần nhất
    toJSON: { virtuals: true }
});

DocumentDomainSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.DocumentDomain)
        return db.model('DocumentDomain', DocumentDomainSchema);
    return db.models.DocumentDomain;
}
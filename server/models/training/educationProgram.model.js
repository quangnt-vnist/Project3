const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EducationProgramSchema = new Schema({ // Chương trình đào tạo
    name: {
        type: String,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    programId: { // Mã chương trình đào tạo
        type: String,
        required: true
    },
    applyForOrganizationalUnits: [{ // Những đơn vị mà nhân viên bắt buộc phải tham gia chương trình này
        type: Schema.Types.ObjectId,
        ref: 'OrganizationalUnit'
    }],
    applyForPositions: [{ // Những chức vụ bắt buộc phải tham gia chương trình đào tạo
        type: Schema.Types.ObjectId,
        ref: 'Role'
    }]
}, {
    timestamps: true,
});

module.exports = (db) => {
    if(!db.models.EducationProgram)
        return db.model('EducationProgram', EducationProgramSchema);
    return db.models.EducationProgram;
}
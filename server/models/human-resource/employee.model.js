const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng datatable thông tin nhân viên
const EmployeeSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
    avatar: {
        type: String
    },
    fullName: {
        type: String,
        required: true
    },
    employeeNumber: {
        type: String,
        required: true
    },
    status: { // active - Đang làm việc, leave - Đã nghỉ làm
        type: String,
        default: 'active',
        enum: ['active', 'leave']
    },
    startingDate: { // Ngày bắt đầu làm việc
        type: Date,
    },
    leavingDate: { // Ngày nghỉ việc
        type: Date,
    },
    employeeTimesheetId: { // mã số chấm công của nhân viên
        type: String,
        required: true
    },
    gender: { // male - nam, female - nữ
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    birthdate: {
        type: Date,
        required: true
    },
    birthplace: {
        type: String
    },
    identityCardNumber: { // số cmnd
        type: Number,
        required: true
    },
    identityCardDate: { // ngày cấp
        type: Date,
        required: true
    },
    identityCardAddress: {
        type: String,
        required: true
    },
    emailInCompany: { // địa chỉ email dùng ở company
        type: String
    },
    nationality: { // Quốc tịch
        type: String
    },
    atmNumber: { // Số tài khoản ATM
        type: String,
    },
    bankName: { // Tên ngân hàng
        type: String,
    },
    bankAddress: {
        type: String,
    },
    ethnic: { // Dân tộc
        type: String
    },
    religion: { // Tín ngưỡng
        type: String
    },
    maritalStatus: { // Tình trạng hôn nhân: single - Độc thân, married - Đã kết hôn
        type: String,
        enum: ['single', 'married']
    },
    /**
     * Start
     * Thông tin liên hệ
     */
    phoneNumber: {
        type: Number,
        required: true
    },
    phoneNumber2: {
        type: Number,
    },
    personalEmail: {
        type: String,
    },
    personalEmail2: {
        type: String,
    },
    homePhone: { // SĐT nhà riêng
        type: Number,
    },
    emergencyContactPerson: { // Người liên hệ khẩn cấp
        type: String,
    },
    relationWithEmergencyContactPerson: { // Quan hệ với người liên hệ khẩn cấp
        type: String,
    },
    emergencyContactPersonPhoneNumber: {
        type: Number,
    },
    emergencyContactPersonEmail: {
        type: String,
    },
    emergencyContactPersonHomePhone: {
        type: Number,
    },
    emergencyContactPersonAddress: {
        type: String,
    },
    permanentResidence: { // Địa chỉ hộ khẩu thường trú
        type: String
    },
    permanentResidenceCountry: { // Quốc gia trong hộ khẩu thường trú
        type: String,
    },
    permanentResidenceCity: {
        type: String,
    },
    permanentResidenceDistrict: {
        type: String,
    },
    permanentResidenceWard: { // Phường trong hộ khẩu thường trú
        type: String,
    },
    temporaryResidence: {
        type: String,
        required: true
    },
    temporaryResidenceCountry: {
        type: String,
    },
    temporaryResidenceCity: {
        type: String,
    },
    temporaryResidenceDistrict: {
        type: String,
    },
    temporaryResidenceWard: {
        type: String,
    },
    /**
     * End
     * Thông tin liên hệ
     */
    educationalLevel: { // Trình độ văn hóa
        type: String,
        required: true,
        enum: ['12/12', '11/12', '10/12', '9/12']
    },
    foreignLanguage: { // Trình độ ngoại ngữ
        type: String
    },
    professionalSkill: { // Trình độ chuyên môn: intermediate_degree - Trung cấp, colleges - Cao đẳng, university - Đại học, bachelor - cử nhân, engineer - kỹ sư, master_degree - Thạc sỹ, phd- Tiến sỹ, unavailable - Không có 
        type: String,
        enum: ['intermediate_degree', 'colleges', 'university', 'bachelor', 'engineer', 'master_degree', 'phd', 'unavailable']
    },
    healthInsuranceNumber: {
        type: String
    },
    healthInsuranceStartDate: {
        type: Date
    },
    healthInsuranceEndDate: {
        type: Date
    },
    socialInsuranceNumber: { // Bảo hiểm XH
        type: String,
    },
    socialInsuranceDetails: [{
        startDate: Date,
        endDate: Date,
        position: String,
        company: String
    }],
    taxNumber: { // Mã số thuế thu nhập cá nhân
        type: String,
    },
    taxRepresentative: { // Đại diện của người nộp thuế
        type: String,
    },
    taxDateOfIssue: { // ngày cấp mã số thuế
        type: Date,
    },
    taxAuthority: { // Cơ quan quản lý thuế (theo mã số thuế đã cấp)
        type: String,
    },
    degrees: [{ // Bằng cấp
        name: String,
        issuedBy: String,
        year: String,
        degreeType: {
            type: String,
            enum: ['excellent', 'very_good', 'good', 'average_good', 'ordinary'] //excellent-Xuất sắc, very_good-Giỏi, good-Khá, average_good-Trung bình khá, ordinary-Trung bình
        },
        file: String,
        urlFile: String
    }],
    certificates: [{ // Chứng chỉ ngắn hạn
        name: String,
        issuedBy: String,
        startDate: Date,
        endDate: Date,
        file: String,
        urlFile: String
    }],
    experiences: [{ // Kinh nghiệm làm việc
        startDate: Date,
        endDate: Date,
        company: String,
        position: String
    }],
    contractEndDate: {
        type: Date
    },
    contractType: {
        type: String
    },
    contracts: [{
        name: String,
        contractType: String,
        startDate: Date,
        endDate: Date,
        file: String,
        urlFile: String
    }],
    archivedRecordNumber: { // Mã hồ sơ lưu trữ
        type: String
    },
    files: [{ // Các file scan đính kèm
        name: String,
        description: String,
        number: String,
        status: {
            type: String,
            enum: ['submitted', 'not_submitted_yet', 'returned'] //submitted-Đã nộp, not_submitted_yet-Chưa nộp, returned-Đã trả
        },
        file: String,
        urlFile: String
    }],
    major: [{
        // type: Schema.Types.ObjectId,
        // ref: 'Major',
        name: String,
        code: String,
    }],
    careerPosition: [{
        // type: Schema.Types.ObjectId,
        // ref: 'CareerPosition',
        name: String,
        code: String,
        startDate: Date,
        endDate: Date,
    }],
}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.Employee)
        return db.model('Employee', EmployeeSchema);
    return db.models.Employee;
}
export const configurationEmployee = {
    configurationEmployeeInfo,
    configurationExperience,
    configurationDegree,
    configurationCertificate,
    configurationContract,
    configurationSocialInsuranceDetails,
    configurationFile,

    templateImport,
}

// Cấu hình file import thông tin cơ bản của nhân viên
function configurationEmployeeInfo(translate) {
    let config = {
        rowHeader: { // Số dòng tiêu đề của bảng
            description: translate('human_resource.rowHeader'),
            value: 1
        },
        sheets: { // Tên các sheet
            description: translate('human_resource.sheets_name'),
            value: [translate(`human_resource.profile.employee_management.export.sheet1`)]
        },
        employeeNumber: { // Mã số nhân viên
            columnName: translate(`human_resource.profile.staff_number`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.staff_number`).toLowerCase()}`,
            value: translate(`human_resource.profile.staff_number`)
        },
        fullName: { // Họ và tên
            columnName: translate(`human_resource.profile.full_name`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.full_name').toLowerCase()}`,
            value: translate(`human_resource.profile.full_name`)
        },
        birthdate: { // Ngày sinh
            columnName: translate(`human_resource.profile.date_birth`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.date_birth').toLowerCase()}`,
            value: translate(`human_resource.profile.date_birth`)
        },
        gender: { // Giới tính
            columnName: translate(`human_resource.profile.gender`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.gender').toLowerCase()}`,
            value: translate(`human_resource.profile.gender`)
        },
        employeeTimesheetId: { // Mã số chấm công
            columnName: translate(`human_resource.profile.attendance_code`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.attendance_code').toLowerCase()}`,
            value: translate(`human_resource.profile.attendance_code`)
        },
        identityCardNumber: { // Số chứng minh thư
            columnName: translate(`human_resource.profile.id_card`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.id_card').toLowerCase()}`,
            value: translate(`human_resource.profile.id_card`)
        },
        identityCardDate: { // Ngày cấp chứng minh thư
            columnName: translate(`human_resource.profile.date_issued`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.date_issued').toLowerCase()}`,
            value: translate(`human_resource.profile.date_issued`)
        },
        identityCardAddress: { // Nơi cấp chứng minh thư
            columnName: translate(`human_resource.profile.issued_by`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.issued_by').toLowerCase()}`,
            value: translate(`human_resource.profile.issued_by`)
        },
        birthplace: { // Nơi sinh
            columnName: translate(`human_resource.profile.place_birth`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.place_birth').toLowerCase()}`,
            value: translate(`human_resource.profile.place_birth`)
        },
        permanentResidence: { // Hộ khẩu thưởng trú
            columnName: translate(`human_resource.profile.permanent_address`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.permanent_address').toLowerCase()}`,
            value: translate(`human_resource.profile.permanent_address`)
        },
        temporaryResidence: { // Nơi ở hiện tại
            columnName: translate(`human_resource.profile.current_residence`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.current_residence').toLowerCase()}`,
            value: translate(`human_resource.profile.current_residence`)
        },
        maritalStatus: { // Tình trạng hôn nhân
            columnName: translate(`human_resource.profile.relationship`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.relationship').toLowerCase()}`,
            value: translate(`human_resource.profile.relationship`)
        },
        status: { // Tình trạng lao động
            columnName: translate(`human_resource.profile.status_work`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.status_work').toLowerCase()}`,
            value: translate(`human_resource.profile.status_work`)
        },
        startingDate: { // Ngày bắt đầu làm việc
            columnName: translate(`human_resource.profile.starting_date`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.starting_date').toLowerCase()}`,
            value: translate(`human_resource.profile.starting_date`)
        },
        leavingDate: { // Ngày nghỉ việc
            columnName: translate(`human_resource.profile.leaving_date`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.leaving_date').toLowerCase()}`,
            value: translate(`human_resource.profile.leaving_date`)
        },
        emailInCompany: { // Email công ty
            columnName: translate(`human_resource.profile.email_company`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.email_company').toLowerCase()}`,
            value: translate(`human_resource.profile.email_company`)
        },
        taxNumber: { // Mã số thuế thu nhập cá nhân
            columnName: translate(`human_resource.profile.personal_income_tax`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.personal_income_tax').toLowerCase()}`,
            value: translate(`human_resource.profile.personal_income_tax`)
        },
        taxRepresentative: { // Đại diện của người nộp thuế
            columnName: translate(`human_resource.profile.representative`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.representative').toLowerCase()}`,
            value: translate(`human_resource.profile.representative`)
        },
        taxDateOfIssue: { // Ngày cấp mã số thuế
            columnName: translate(`human_resource.profile.day_active`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.day_active').toLowerCase()}`,
            value: translate(`human_resource.profile.day_active`)
        },
        taxAuthority: { // Cơ quan quản lý thuế
            columnName: translate(`human_resource.profile.managed_by`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.managed_by').toLowerCase()}`,
            value: translate(`human_resource.profile.managed_by`)
        },
        ethnic: { // Dân tộc
            columnName: translate(`human_resource.profile.ethnic`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.ethnic').toLowerCase()}`,
            value: translate(`human_resource.profile.ethnic`)
        },
        religion: { // Tôn giáo
            columnName: translate(`human_resource.profile.religion`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.religion').toLowerCase()}`,
            value: translate(`human_resource.profile.religion`)
        },
        nationality: { // Quốc tịch
            columnName: translate(`human_resource.profile.nationality`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.nationality').toLowerCase()}`,
            value: translate(`human_resource.profile.nationality`)
        },
        educationalLevel: { // Trình độ văn hoá
            columnName: translate(`human_resource.profile.educational_level`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.educational_level').toLowerCase()}`,
            value: translate(`human_resource.profile.educational_level`)
        },
        foreignLanguage: { // Trình độ ngoại ngữ
            columnName: translate(`human_resource.profile.language_level`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.language_level').toLowerCase()}`,
            value: translate(`human_resource.profile.language_level`)
        },
        professionalSkill: { // Trình độ chuyên môn
            columnName: translate(`human_resource.profile.qualification`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.qualification').toLowerCase()}`,
            value: translate(`human_resource.profile.qualification`)
        },
        phoneNumber: { // Điện thoại di động 1
            columnName: translate(`human_resource.profile.mobile_phone_1`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.mobile_phone_1').toLowerCase()}`,
            value: translate(`human_resource.profile.mobile_phone_1`)
        },
        phoneNumber2: { // Điện thoại di động 2
            columnName: translate(`human_resource.profile.mobile_phone_2`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.mobile_phone_2').toLowerCase()}`,
            value: translate(`human_resource.profile.mobile_phone_2`)
        },
        personalEmail: { // Email cá nhân 1
            columnName: translate(`human_resource.profile.personal_email_1`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.personal_email_1').toLowerCase()}`,
            value: translate(`human_resource.profile.personal_email_1`)
        },
        personalEmail2: { // Email cá nhân 2
            columnName: translate(`human_resource.profile.personal_email_2`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.personal_email_2').toLowerCase()}`,
            value: translate(`human_resource.profile.personal_email_2`)
        },
        homePhone: { // Điện thoại nhà riêng
            columnName: translate(`human_resource.profile.home_phone`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.home_phone').toLowerCase()}`,
            value: translate(`human_resource.profile.home_phone`)
        },
        emergencyContactPerson: { // Người liên hệ khẩn cấp
            columnName: translate(`human_resource.profile.employee_management.export.emergency_contact_person`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.employee_management.export.emergency_contact_person').toLowerCase()}`,
            value: translate(`human_resource.profile.employee_management.export.emergency_contact_person`)
        },
        relationWithEmergencyContactPerson: { // Quan hệ với người liên hệ khẩn cấp
            columnName: translate(`human_resource.profile.employee_management.export.relation_with_emergency_contact_person`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.employee_management.export.relation_with_emergency_contact_person').toLowerCase()}`,
            value: translate(`human_resource.profile.employee_management.export.relation_with_emergency_contact_person`)
        },
        emergencyContactPersonAddress: { // Địa chỉ người liên hệ khẩn cấp
            columnName: translate(`human_resource.profile.employee_management.export.emergency_contact_person_address`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.employee_management.export.emergency_contact_person_address').toLowerCase()}`,
            value: translate(`human_resource.profile.employee_management.export.emergency_contact_person_address`)
        },
        emergencyContactPersonPhoneNumber: { // Điện thoại di động người liên hệ khẩn cấp
            columnName: translate(`human_resource.profile.employee_management.export.emergency_contact_person_phone_number`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.employee_management.export.emergency_contact_person_phone_number').toLowerCase()}`,
            value: translate(`human_resource.profile.employee_management.export.emergency_contact_person_phone_number`)
        },
        emergencyContactPersonHomePhone: { // Điện thoại nhà riêng người liên hệ khẩn cấp
            columnName: translate(`human_resource.profile.employee_management.export.emergency_contact_person_home_phone`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.employee_management.export.emergency_contact_person_home_phone').toLowerCase()}`,
            value: translate(`human_resource.profile.employee_management.export.emergency_contact_person_home_phone`)
        },
        emergencyContactPersonEmail: { // Email người liên hệ khẩn cấp
            columnName: translate(`human_resource.profile.employee_management.export.emergency_contact_person_email`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.employee_management.export.emergency_contact_person_email').toLowerCase()}`,
            value: translate(`human_resource.profile.employee_management.export.emergency_contact_person_email`)
        },
        atmNumber: { // Số tài khoản ngân hàng
            columnName: translate(`human_resource.profile.employee_management.export.atmNumber`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.employee_management.export.atmNumber').toLowerCase()}`,
            value: translate(`human_resource.profile.employee_management.export.atmNumber`)
        },
        bankName: { // Tên ngân hàng
            columnName: translate(`human_resource.profile.bank_name`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.bank_name').toLowerCase()}`,
            value: translate(`human_resource.profile.bank_name`)
        },
        bankAddress: { // Chi nhánh ngân hàng
            columnName: translate(`human_resource.profile.employee_management.export.bank_address`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.employee_management.export.bank_address').toLowerCase()}`,
            value: translate(`human_resource.profile.employee_management.export.bank_address`)
        },
        healthInsuranceNumber: { // Mã số BHYT
            columnName: translate(`human_resource.profile.number_BHYT`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.number_BHYT').toLowerCase()}`,
            value: translate(`human_resource.profile.number_BHYT`)
        },
        healthInsuranceStartDate: { // Ngày BHYT có hiệu lực
            columnName: translate(`human_resource.profile.employee_management.export.health_insurance_start_date`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.employee_management.export.health_insurance_start_date').toLowerCase()}`,
            value: translate(`human_resource.profile.employee_management.export.health_insurance_start_date`)
        },
        healthInsuranceEndDate: { // Ngày BHYT hết hạn
            columnName: translate(`human_resource.profile.employee_management.export.health_insurance_end_date`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.employee_management.export.health_insurance_end_date').toLowerCase()}`,
            value: translate(`human_resource.profile.employee_management.export.health_insurance_end_date`)
        },
        socialInsuranceNumber: { // Mã số BHXH
            columnName: translate(`human_resource.profile.number_BHXH`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.number_BHXH').toLowerCase()}`,
            value: translate(`human_resource.profile.number_BHXH`)
        },
        archivedRecordNumber: { // Nơi lưu trữ hồ sơ
            columnName: translate(`human_resource.profile.attachments_code`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.attachments_code').toLowerCase()}`,
            value: translate(`human_resource.profile.attachments_code`)
        },
    };
    return config;
}

// Cấu hình file import kinh nghiệm làm việc của nhân viên
function configurationExperience(translate) {
    let config = {
        rowHeader: {
            description: translate('human_resource.rowHeader'),
            value: 1
        },
        sheets: {
            description: translate('human_resource.sheets_name'),
            value: [translate(`human_resource.profile.employee_management.export.sheet2`)]
        },
        employeeNumber: {
            columnName: translate(`human_resource.profile.staff_number`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.staff_number`).toLowerCase()}`,
            value: translate(`human_resource.profile.staff_number`)
        },
        fullName: {
            columnName: translate(`human_resource.profile.full_name`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.full_name').toLowerCase()}`,
            value: translate(`human_resource.profile.full_name`)
        },
        startDate: { // Từ tháng/năm
            columnName: translate(`human_resource.profile.from_month_year`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.from_month_year`).toLowerCase()}`,
            value: translate(`human_resource.profile.from_month_year`)
        },
        endDate: { // Đến tháng/năm
            columnName: translate(`human_resource.profile.to_month_year`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.to_month_year`).toLowerCase()}`,
            value: translate(`human_resource.profile.to_month_year`)
        },
        company: { // Đơn vị công tác
            columnName: translate(`human_resource.profile.unit`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.unit`).toLowerCase()}`,
            value: translate(`human_resource.profile.unit`)
        },
        position: { // Chức vụ
            columnName: translate(`human_resource.position`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.position`).toLowerCase()}`,
            value: translate(`human_resource.position`)
        },
    };
    return config;
}

// Cấu hình file import thông tin bằng cấp
function configurationDegree(translate) {
    let config = {
        rowHeader: {
            description: translate('human_resource.rowHeader'),
            value: 1
        },
        sheets: {
            description: translate('human_resource.sheets_name'),
            value: [translate(`human_resource.profile.employee_management.export.sheet3`)]
        },
        employeeNumber: {
            columnName: translate(`human_resource.profile.staff_number`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.staff_number`).toLowerCase()}`,
            value: translate(`human_resource.profile.staff_number`)
        },
        fullName: {
            columnName: translate(`human_resource.profile.full_name`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.full_name').toLowerCase()}`,
            value: translate(`human_resource.profile.full_name`)
        },
        name: { // Tên bằng cấp
            columnName: translate(`human_resource.profile.name_diploma`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.name_diploma`).toLowerCase()}`,
            value: translate(`human_resource.profile.name_diploma`)
        },
        issuedBy: { // Nơi đào tạo
            columnName: translate(`human_resource.profile.diploma_issued_by`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.diploma_issued_by`).toLowerCase()}`,
            value: translate(`human_resource.profile.diploma_issued_by`)
        },
        year: { // Năm tốt nghiệp
            columnName: translate(`human_resource.profile.graduation_year`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.graduation_year`).toLowerCase()}`,
            value: translate(`human_resource.profile.graduation_year`)
        },
        degreeType: { // Xếp loại
            columnName: translate(`human_resource.profile.ranking_learning`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.ranking_learning`).toLowerCase()}`,
            value: translate(`human_resource.profile.ranking_learning`)
        },
    };
    return config;

}

// Cấu hình file import thông tin chứng chỉ
function configurationCertificate(translate) {
    let config = {
        rowHeader: {
            description: translate('human_resource.rowHeader'),
            value: 1
        },
        sheets: {
            description: translate('human_resource.sheets_name'),
            value: [translate(`human_resource.profile.employee_management.export.sheet4`)]
        },
        employeeNumber: {
            columnName: translate(`human_resource.profile.staff_number`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.staff_number`).toLowerCase()}`,
            value: translate(`human_resource.profile.staff_number`)
        },
        fullName: {
            columnName: translate(`human_resource.profile.full_name`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.full_name').toLowerCase()}`,
            value: translate(`human_resource.profile.full_name`)
        },
        name: { // Tên chứng chỉ
            columnName: translate(`human_resource.profile.name_certificate`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.name_certificate`).toLowerCase()}`,
            value: translate(`human_resource.profile.name_certificate`)
        },
        issuedBy: { // Nơi cấp
            columnName: translate(`human_resource.profile.issued_by`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.issued_by`).toLowerCase()}`,
            value: translate(`human_resource.profile.issued_by`)
        },
        startDate: { // Ngày cấp
            columnName: translate(`human_resource.profile.date_issued`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.date_issued`).toLowerCase()}`,
            value: translate(`human_resource.profile.date_issued`)
        },
        endDate: { // Ngày hết hạn
            columnName: translate(`human_resource.profile.end_date_certificate`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.end_date_certificate`).toLowerCase()}`,
            value: translate(`human_resource.profile.end_date_certificate`)
        },
    }
    return config;
}

// Cấu hình file import hợp đồng lao động
function configurationContract(translate) {
    let config = {
        rowHeader: {
            description: translate('human_resource.rowHeader'),
            value: 1
        },
        sheets: {
            description: translate('human_resource.sheets_name'),
            value: [translate(`human_resource.profile.employee_management.export.sheet5`)]
        },
        employeeNumber: {
            columnName: translate(`human_resource.profile.staff_number`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.staff_number`).toLowerCase()}`,
            value: translate(`human_resource.profile.staff_number`)
        },
        fullName: {
            columnName: translate(`human_resource.profile.full_name`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.full_name').toLowerCase()}`,
            value: translate(`human_resource.profile.full_name`)
        },
        name: { // Tên hợp đồng
            columnName: translate(`human_resource.profile.name_contract`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.name_contract`).toLowerCase()}`,
            value: translate(`human_resource.profile.name_contract`)
        },
        contractType: { // Loại hợp đồng
            columnName: translate(`human_resource.profile.type_contract`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.type_contract`).toLowerCase()}`,
            value: translate(`human_resource.profile.type_contract`)
        },
        startDate: { // Ngày có hiệu lực
            columnName: translate(`human_resource.profile.start_date`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.start_date`).toLowerCase()}`,
            value: translate(`human_resource.profile.start_date`)
        },
        endDate: { // Ngày hết hạn
            columnName: translate(`human_resource.profile.end_date_certificate`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.end_date_certificate`).toLowerCase()}`,
            value: translate(`human_resource.profile.end_date_certificate`)
        },
    }
    return config;
}

// Cấu hình file import quá trình đóng bảo hiểm của nhân viên
function configurationSocialInsuranceDetails(translate) {
    let config = {
        rowHeader: {
            description: translate('human_resource.rowHeader'),
            value: 1
        },
        sheets: {
            description: translate('human_resource.sheets_name'),
            value: [translate(`human_resource.profile.employee_management.export.sheet6`),]
        },
        employeeNumber: {
            columnName: translate(`human_resource.profile.staff_number`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.staff_number`).toLowerCase()}`,
            value: translate(`human_resource.profile.staff_number`)
        },
        fullName: {
            columnName: translate(`human_resource.profile.full_name`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.full_name').toLowerCase()}`,
            value: translate(`human_resource.profile.full_name`)
        },
        startDate: { // Từ tháng/năm
            columnName: translate(`human_resource.profile.from_month_year`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.from_month_year`).toLowerCase()}`,
            value: translate(`human_resource.profile.from_month_year`)
        },
        endDate: { // Đến tháng/năm
            columnName: translate(`human_resource.profile.to_month_year`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.to_month_year`).toLowerCase()}`,
            value: translate(`human_resource.profile.to_month_year`)
        },
        company: { // Đơn vị công tác
            columnName: translate(`human_resource.profile.unit`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.unit`).toLowerCase()}`,
            value: translate(`human_resource.profile.unit`)
        },
        position: { // Chức vụ
            columnName: translate(`human_resource.position`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.position`).toLowerCase()}`,
            value: translate(`human_resource.position`)
        },
    };
    return config;
}

// Cấu hình file import tài liệu đính kèm
function configurationFile(translate) {
    let config = {
        rowHeader: {
            description: translate('human_resource.rowHeader'),
            value: 1
        },
        sheets: {
            description: translate('human_resource.sheets_name'),
            value: [translate(`human_resource.profile.employee_management.export.sheet7`)]
        },
        employeeNumber: {
            columnName: translate(`human_resource.profile.staff_number`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.staff_number`).toLowerCase()}`,
            value: translate(`human_resource.profile.staff_number`)
        },
        fullName: {
            columnName: translate(`human_resource.profile.full_name`),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.full_name').toLowerCase()}`,
            value: translate(`human_resource.profile.full_name`)
        },
        name: { // Tên tài liệu
            columnName: translate(`human_resource.profile.file_name`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.file_name`).toLowerCase()}`,
            value: translate(`human_resource.profile.file_name`)
        },
        description: { // Mô tả
            columnName: translate(`general.description`),
            description: `${translate('human_resource.title_correspond')} ${translate(`general.description`).toLowerCase()}`,
            value: translate(`general.description`)
        },
        number: { // Số lượng
            columnName: translate(`human_resource.profile.number`),
            description: `${translate('human_resource.title_correspond')} ${translate(`human_resource.profile.number`).toLowerCase()}`,
            value: translate(`human_resource.profile.number`)
        },
        status: { // Trạng thái
            columnName: translate('human_resource.status'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.status').toLowerCase()}`,
            value: translate('human_resource.status')
        },
    };
    return config;
}




function templateImport(translate) {
    let teamplateImport = {
        fileName: translate(`human_resource.profile.employee_management.file_export_name`),
            dataSheets: [
                {
                    // 1.Nhân viên
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet1`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "organizationalUnits", value: translate(`human_resource.unit`), width: 25 },
                                { key: "position", value: translate(`human_resource.position`), width: 25 },
                                { key: "birthdate", value: translate(`human_resource.profile.date_birth`) },
                                { key: "gender", value: translate(`human_resource.profile.gender`) },
                                { key: "employeeTimesheetId", value: translate(`human_resource.profile.attendance_code`) },
                                { key: "identityCardNumber", value: translate(`human_resource.profile.id_card`) },
                                { key: "identityCardDate", value: translate(`human_resource.profile.date_issued`) },
                                { key: "identityCardAddress", value: translate(`human_resource.profile.issued_by`) },
                                { key: "birthplace", value: translate(`human_resource.profile.place_birth`), width: 35 },
                                { key: "permanentResidence", value: translate(`human_resource.profile.permanent_address`), width: 35 },
                                { key: "temporaryResidence", value: translate(`human_resource.profile.current_residence`), width: 35 },
                                { key: "maritalStatus", value: translate(`human_resource.profile.relationship`) },
                                { key: "status", value: translate(`human_resource.profile.status_work`) },
                                { key: "startingDate", value: translate(`human_resource.profile.starting_date`) },
                                { key: "leavingDate", value: translate(`human_resource.profile.leaving_date`) },
                                { key: "emailInCompany", value: translate(`human_resource.profile.email_company`), width: 35 },
                                { key: "taxNumber", value: translate(`human_resource.profile.personal_income_tax`) },
                                { key: "taxRepresentative", value: translate(`human_resource.profile.representative`), width: 20 },
                                { key: "taxDateOfIssue", value: translate(`human_resource.profile.day_active`) },
                                { key: "taxAuthority", value: translate(`human_resource.profile.managed_by`), width: 35 },
                                { key: "ethnic", value: translate(`human_resource.profile.ethnic`) },
                                { key: "religion", value: translate(`human_resource.profile.religion`) },
                                { key: "nationality", value: translate(`human_resource.profile.nationality`) },
                                { key: "educationalLevel", value: translate(`human_resource.profile.educational_level`) },
                                { key: "foreignLanguage", value: translate(`human_resource.profile.language_level`) },
                                { key: "professionalSkill", value: translate(`human_resource.profile.qualification`) },
                                { key: "phoneNumber", value: translate(`human_resource.profile.mobile_phone_1`) },
                                { key: "phoneNumber2", value: translate(`human_resource.profile.mobile_phone_2`) },
                                { key: "personalEmail", value: translate(`human_resource.profile.personal_email_1`), width: 35 },
                                { key: "personalEmail2", value: translate(`human_resource.profile.personal_email_2`), width: 35 },
                                { key: "homePhone", value: translate(`human_resource.profile.home_phone`) },
                                { key: "emergencyContactPerson", value: translate(`human_resource.profile.employee_management.export.emergency_contact_person`), width: 20 },
                                { key: "relationWithEmergencyContactPerson", value: translate(`human_resource.profile.employee_management.export.relation_with_emergency_contact_person`),width: 25 },
                                { key: "emergencyContactPersonAddress", value: translate(`human_resource.profile.employee_management.export.emergency_contact_person_address`), width: 35 },
                                { key: "emergencyContactPersonPhoneNumber", value: translate(`human_resource.profile.employee_management.export.emergency_contact_person_phone_number`),width: 25 },
                                { key: "emergencyContactPersonHomePhone", value: translate(`human_resource.profile.employee_management.export.emergency_contact_person_home_phone`),width: 25 },
                                { key: "emergencyContactPersonEmail", value: translate(`human_resource.profile.employee_management.export.emergency_contact_person_email`), width: 35 },
                                { key: "atmNumber", value: translate(`human_resource.profile.employee_management.export.atmNumber`) },
                                { key: "bankName", value: translate(`human_resource.profile.bank_name`) },
                                { key: "bankAddress", value: translate(`human_resource.profile.employee_management.export.bank_address`) },
                                { key: "healthInsuranceNumber", value: translate(`human_resource.profile.number_BHYT`) },
                                { key: "healthInsuranceStartDate", value: translate(`human_resource.profile.employee_management.export.health_insurance_start_date`),width: 20 },
                                { key: "healthInsuranceEndDate", value: translate(`human_resource.profile.employee_management.export.health_insurance_end_date`),width: 20 },
                                { key: "socialInsuranceNumber", value: translate(`human_resource.profile.number_BHXH`) },
                                { key: "archivedRecordNumber", value: translate(`human_resource.profile.attachments_code`) },
                            ],
                            data: [
                                {
                                    STT: 1,
                                    archivedRecordNumber: "T3 - 123698",
                                    atmNumber: "102298653",
                                    bankAddress: "Hai Bà Trưng",
                                    bankName: "ViettinBank",
                                    birthdate: "29-09-1988",
                                    birthplace: "Hải Phương - Hải Hậu - Nam Định",
                                    educationalLevel: "12/12",
                                    emailInCompany: "nva.vnist@gmail.com",
                                    emergencyContactPerson: "Nguyễn Văn Thái",
                                    emergencyContactPersonAddress: "Hải Phương - Hải Hậu - Nam Định",
                                    emergencyContactPersonEmail: "cuong@gmail.com",
                                    emergencyContactPersonHomePhone: 962586789,
                                    emergencyContactPersonPhoneNumber: 962586278,
                                    employeeNumber: "MS2015123",
                                    employeeTimesheetId: "123455",
                                    ethnic: "Kinh",
                                    foreignLanguage: "500 Toeic",
                                    fullName: "Nguyễn Văn An",
                                    gender: translate(`human_resource.profile.male`),
                                    healthInsuranceEndDate: "16-02-2020",
                                    healthInsuranceNumber: "N1236589",
                                    healthInsuranceStartDate: "25-01-2019",
                                    homePhone: 978590338,
                                    identityCardAddress: "Nam Định",
                                    identityCardDate: "20-10-2015",
                                    identityCardNumber: 163414569,
                                    leavingDate: undefined,
                                    maritalStatus: translate(`human_resource.profile.single`),
                                    nationality: "Việt Nam",
                                    organizationalUnits: "Ban giám đốc",
                                    permanentResidence: "Hải Phương - Hải Hậu - Nam Định",
                                    personalEmail: "tranhungcuong703@gmail.com",
                                    personalEmail2: "hungkaratedo03101998@gmail.com",
                                    phoneNumber: 962586290,
                                    phoneNumber2: 9625845,
                                    position: "Giám đốc",
                                    professionalSkill: translate(`human_resource.profile.university`),
                                    relationWithEmergencyContactPerson: "Em trai",
                                    religion: "Không",
                                    socialInsuranceNumber: "XH1569874",
                                    startingDate: undefined,
                                    status: translate(`human_resource.profile.active`),
                                    taxAuthority: "Chi cục thuế Huyện Hải Hậu",
                                    taxDateOfIssue: "08-12-2019",
                                    taxNumber: "12658974",
                                    taxRepresentative: "Nguyễn Văn Hưng",
                                    temporaryResidence: "số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định",

                                },
                                {
                                    STT: 2,
                                    archivedRecordNumber: "T3 - 123698",
                                    atmNumber: "102298653",
                                    bankAddress: "Hai Bà Trưng",
                                    bankName: "ViettinBank",
                                    birthdate: "17-02-1998",
                                    birthplace: "Hải Phương - Hải Hậu - Nam Định",
                                    educationalLevel: "12/12",
                                    emailInCompany: "tvb.vnist@gmail.com",
                                    emergencyContactPerson: "Nguyễn Văn Thái",
                                    emergencyContactPersonAddress: "Hải Phương - Hải Hậu - Nam Định",
                                    emergencyContactPersonEmail: "cuong@gmail.com",
                                    emergencyContactPersonHomePhone: 962586789,
                                    emergencyContactPersonPhoneNumber: 962586278,
                                    employeeNumber: "MS2015124",
                                    employeeTimesheetId: "123456",
                                    ethnic: "Kinh",
                                    foreignLanguage: "500 Toeic",
                                    fullName: "Trần Văn Bình",
                                    gender: translate(`human_resource.profile.male`),
                                    healthInsuranceEndDate: "16-02-2020",
                                    healthInsuranceNumber: "N1236589",
                                    healthInsuranceStartDate: "25-01-2019",
                                    homePhone: 978590338,
                                    identityCardAddress: "Nam Định",
                                    identityCardDate: "20-10-2015",
                                    identityCardNumber: 163414569,
                                    leavingDate: undefined,
                                    maritalStatus: translate(`human_resource.profile.single`),
                                    nationality: "Việt Nam",
                                    organizationalUnits: "Ban giám đốc",
                                    permanentResidence: "Hải Phương - Hải Hậu - Nam Định",
                                    personalEmail: "tranhungcuong703@gmail.com",
                                    personalEmail2: "hungkaratedo03101998@gmail.com",
                                    phoneNumber: 962586290,
                                    phoneNumber2: 9625845,
                                    position: "Phó giám đốc",
                                    professionalSkill: translate(`human_resource.profile.university`),
                                    relationWithEmergencyContactPerson: "Em trai",
                                    religion: "Không",
                                    socialInsuranceNumber: "XH1569874",
                                    startingDate: undefined,
                                    status: translate(`human_resource.profile.active`),
                                    taxAuthority: "Chi cục thuế Huyện Hải Hậu",
                                    taxDateOfIssue: "08-12-2019",
                                    taxNumber: "12658974",
                                    taxRepresentative: "Nguyễn Văn Hưng",
                                    temporaryResidence: "số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định",
                                    
                                }
                            ]
                        }
                    ]
                },
                {
                    // 2.HS Nhân viên - Kinh nghiệm
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet2`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "startDate", value: translate(`human_resource.profile.from_month_year`) },
                                { key: "endDate", value: translate(`human_resource.profile.to_month_year`) },
                                { key: "company", value: translate(`human_resource.profile.unit`), width: 35 },
                                { key: "position", value: translate(`human_resource.position`), width: 25 }
                            ],
                            data: [{
                                STT: 1,
                                company: "Vnist",
                                employeeNumber: "MS2015123",
                                endDate: "02-2020",
                                fullName: "Nguyễn Văn An",
                                position: "Nhân viên",
                                startDate: "06-2019",
                            },{
                                STT: 2,
                                company: "Vnist",
                                employeeNumber: "MS2015124",
                                endDate: "02-2020",
                                fullName: "Trần Văn Bình",
                                position: "Nhân viên",
                                startDate: "06-2019",
                            }]
                        }
                    ]
                },
                {
                    // 3.HS Nhân viên - Bằng cấp
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet3`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "name", value: translate(`human_resource.profile.name_diploma`), width: 25 },
                                { key: "issuedBy", value: translate(`human_resource.profile.diploma_issued_by`), width: 35 },
                                { key: "year", value: translate(`human_resource.profile.graduation_year`) },
                                { key: "degreeType", value: translate(`human_resource.profile.ranking_learning`) },
                            ],
                            data: [{
                                STT: 1,
                                degreeType: translate(`human_resource.profile.good`),
                                employeeNumber: "MS2015123",
                                fullName: "Nguyễn Văn An",
                                issuedBy: "Đại học Bách Khoa",
                                name: "Bằng tốt nghiệp",
                                year: "2020"
                            },{
                                STT: 2,
                                degreeType: translate(`human_resource.profile.good`),
                                employeeNumber: "MS2015124",
                                fullName: "Trần Văn Bình",
                                issuedBy: "Đại học Bách Khoa",
                                name: "Bằng tốt nghiệp",
                                year: "2020"
                            }]
                        }
                    ]
                },
                {
                    // 4.HS Nhân viên - Chứng chỉ
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet4`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "name", value: translate(`human_resource.profile.name_certificate`), width: 25 },
                                { key: "issuedBy", value: translate(`human_resource.profile.issued_by`), width: 35 },
                                { key: "startDate", value: translate(`human_resource.profile.date_issued`) },
                                { key: "endDate", value: translate(`human_resource.profile.end_date_certificate`) },
                            ],
                            data: [{
                                STT: 1,
                                employeeNumber: "MS2015123",
                                endDate: "25-10-2020",
                                fullName: "Nguyễn Văn An",
                                issuedBy: "Hà Nội",
                                name: "PHP",
                                startDate: "25-10-2019",
                            },{
                                STT: 2,
                                employeeNumber: "MS2015124",
                                endDate: "25-10-2020",
                                fullName: "Trần Văn Bình",
                                issuedBy: "Hà Nội",
                                name: "PHP",
                                startDate: "25-10-2019",
                            }]
                        }
                    ]
                },
                {
                    // 5.HS Nhân viên - Hợp đồng
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet5`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "name", value: translate(`human_resource.profile.name_contract`), width: 35 },
                                { key: "contractType", value: translate(`human_resource.profile.type_contract`), width: 25 },
                                { key: "startDate", value: translate(`human_resource.profile.start_date`) },
                                { key: "endDate", value: translate(`human_resource.profile.end_date_certificate`) },
                            ],
                            data: [{
                                STT: 1,
                                contractType: "Hợp đồng theo năm",
                                employeeNumber: "MS2015123",
                                endDate: "30-09-2020",
                                fullName: "Nguyễn Văn An",
                                name: "Hợp đồng làm việc",
                                startDate: "26-06-2019",
                            },{
                                STT: 2,
                                contractType: "Hợp đồng theo năm",
                                employeeNumber: "MS2015124",
                                endDate: "26-12-2020",
                                fullName: "Trần Văn Bình",
                                name: "Hợp đồng làm việc",
                                startDate: "26-06-2019",
                            }]
                        }
                    ]
                },
                {
                    // 6.HS Nhân viên - Bảo hiểm XH
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet6`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "startDate", value: translate(`human_resource.profile.from_month_year`) },
                                { key: "endDate", value: translate(`human_resource.profile.to_month_year`) },
                                { key: "company", value: translate(`human_resource.profile.unit`), width: 35 },
                                { key: "position", value: translate(`human_resource.position`), width: 25 }
                            ],
                            data: [{
                                STT: 1,
                                company: "Vnist",
                                employeeNumber: "MS2015123",
                                endDate: "05-2020",
                                fullName: "Nguyễn Văn An",
                                position: "Nhân viên",
                                startDate: "01-2020"
                            },{
                                STT: 2,
                                company: "Vnist",
                                employeeNumber: "MS2015124",
                                endDate: "05-2020",
                                fullName: "Trần Văn Bình",
                                position: "Nhân viên",
                                startDate: "01-2020"
                            }]
                        }
                    ]
                },
                {
                    // 7.HS Nhân viên - Tài liệu
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet7`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "name", value: translate(`human_resource.profile.file_name`) },
                                { key: "description", value: translate(`general.description`), width: 35 },
                                { key: "number", value: translate(`human_resource.profile.number`) },
                                { key: "status", value: translate(`human_resource.status`) },
                            ],
                            data: [{
                                STT: 1,
                                description: "Ảnh 3x4",
                                employeeNumber: "MS2015123",
                                fullName: "Nguyễn Văn An",
                                name: "Ảnh",
                                number: "1",
                                status: translate(`human_resource.profile.submitted`),
                            },{
                                STT: 2,
                                description: "Ảnh 3x4",
                                employeeNumber: "MS2015124",
                                fullName: "Trần Văn Bình",
                                name: "Ảnh",
                                number: "1",
                                status: translate(`human_resource.profile.submitted`),
                            }]
                        }
                    ]
                },
                {
                    // 8.HS Nhân viên - Khen thưởng
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet8`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "decisionNumber", value: translate('human_resource.commendation_discipline.commendation.table.decision_number') },
                                { key: "decisionUnit", value: translate('human_resource.commendation_discipline.commendation.table.decision_unit'), width: 25 },
                                { key: "startDate", value: translate('human_resource.commendation_discipline.commendation.table.decision_date') },
                                { key: "type", value: translate('human_resource.commendation_discipline.commendation.table.reward_forms') },
                                { key: "reason", value: translate('human_resource.commendation_discipline.commendation.table.reason_praise'), width: 35 },
                            ],
                            data: [{
                                STT: 1,
                                decisionNumber: "123",
                                decisionUnit: "Phòng kinh doanh",
                                employeeNumber: "MS2015123",
                                fullName: "Nguyễn Văn An",
                                reason: "Vượt doanh số",
                                startDate: "02-02-2020",
                                type: "Thưởng tiền",
                            },{
                                STT: 2,
                                decisionNumber: "1234",
                                decisionUnit: "Phòng kinh doanh",
                                employeeNumber: "MS2015123",
                                fullName: "Nguyễn Văn An",
                                reason: "Vượt doanh số 500 triệu",
                                startDate: "02-02-2020",
                                type: "Thưởng tiền",
                            }]
                        }
                    ]
                },
                // {
                //     // 9.HS Nhân viên - Kỷ luật
                //     sheetName: translate(`human_resource.profile.employee_management.export.sheet9`),
                //     tables: [
                //         {
                //             columns: [
                //                 { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                //                 { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                //                 { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                //                 { key: "decisionNumber", value: translate('human_resource.commendation_discipline.commendation.table.decision_number') },
                //                 { key: "decisionUnit", value: translate('human_resource.commendation_discipline.commendation.table.decision_unit'), width: 25 },
                //                 { key: "startDate", value: translate('human_resource.commendation_discipline.discipline.table.start_date') },
                //                 { key: "endDate", value: translate('human_resource.commendation_discipline.discipline.table.end_date') },
                //                 { key: "type", value: translate('human_resource.commendation_discipline.discipline.table.discipline_forms') },
                //                 { key: "reason", value: translate('human_resource.commendation_discipline.discipline.table.reason_discipline'), width: 35 },
                //             ],
                //             data: [{
                //                 STT: 1,
                //                 decisionNumber: "1456",
                //                 decisionUnit: "Phòng kinh doanh",
                //                 employeeNumber: "MS2015123",
                //                 endDate: "09-02-2020",
                //                 fullName: "Nguyễn Văn An",
                //                 reason: "Không làm đủ công",
                //                 startDate: "07-02-2020",
                //                 type: "Phạt tiền",
                //             },{
                //                 STT: 2,
                //                 decisionNumber: "1457",
                //                 decisionUnit: "Phòng kinh doanh",
                //                 employeeNumber: "MS2015123",
                //                 endDate: "09-02-2020",
                //                 fullName: "Nguyễn Văn An",
                //                 reason: "Không đủ doanh số",
                //                 startDate: "07-02-2020",
                //                 type: "Phạt tiền"
                //             }]
                //         }
                //     ]
                // },
                // {
                //     // 10.HS Nhân viên - Lương thưởng
                //     sheetName: translate(`human_resource.profile.employee_management.export.sheet10`),
                //     tables: [{
                //         rowHeader: 2,
                //         merges: [{
                //             key: "other",
                //             columnName: translate('human_resource.salary.other_salary'),
                //             keyMerge: 'bonus0',
                //             colspan: 2
                //         }],
                //         columns: [
                //             { key: "STT", value: translate('human_resource.stt'), width: 7 },
                //             { key: "month", value: translate('human_resource.month'), width: 10 },
                //             { key: "year", value: translate('human_resource.work_plan.year'), width: 10 },
                //             { key: "employeeNumber", value: translate('human_resource.staff_number') },
                //             { key: "fullName", value: translate('human_resource.staff_name'), width: 20 },
                //             { key: "organizationalUnit", value: translate('human_resource.unit'), width: 25 },
                //             { key: "gender", value: translate('human_resource.profile.gender') },
                //             { key: "birthdate", value: translate('human_resource.profile.date_birth') },
                //             { key: "status", value: translate('human_resource.profile.status_work') },
                //             { key: "mainSalary", value: translate('human_resource.salary.table.main_salary'), },
                //             { key: 'bonus0',value: 'Thưởng đầu hộp SanFoVet'},
                //             { key: 'bonus1',value: 'Thưởng đầu hộp ViaVet'},
                //             { key: "total", value: translate('human_resource.salary.table.total_salary'), },
                //         ],
                //         data: [{
                //             STT: 1,
                //             employeeNumber: 'MS1256398',
                //             fullName: "Nguyễn Văn A",
                //             mainSalary: 15000000,
                //             birthdate: new Date("1995-12-10"),
                //             status: translate('human_resource.profile.active'),
                //             gender: translate('human_resource.profile.male'),
                //             organizationalUnit: 'Ban giám đốc',
                //             total: 30000000,
                //             month: 5,
                //             year: 2020,
                //             bonus0: 10000000,
                //             bonus1: 5000000
                //         }, {
                //             STT: 2,
                //             employeeNumber: 'MS1256596',
                //             fullName: "Nguyễn Thị C",
                //             mainSalary: 15000000,
                //             birthdate: new Date("1989-5-25"),
                //             status: translate('human_resource.profile.active'),
                //             gender: translate('human_resource.profile.male'),
                //             organizationalUnit: 'Phòng kinh doanh',
                //             total: 30000000,
                //             month: 5,
                //             year: 2020,
                //             bonus0: 10000000,
                //             bonus1: 5000000
                //         }]
                //     }, ]
                // },
                // {
                //     // 11.HS Nhân viên - Nghỉ phép
                //     sheetName: translate(`human_resource.profile.employee_management.export.sheet11`),
                //     tables: [
                //         {
                //             columns: [
                //                 { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                //                 { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                //                 { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                //                 { key: "organizationalUnit", value: translate('human_resource.unit'), width: 25 },
                //                 { key: "startDate", value: translate('human_resource.annual_leave.table.start_date') },
                //                 { key: "endDate", value: translate('human_resource.annual_leave.table.end_date') },
                //                 { key: "reason", value: translate('human_resource.annual_leave.table.reason'), width: 35 },
                //                 { key: "status", value: translate('human_resource.status'), width: 25 },
                //             ],
                //             data: [{
                //                 STT: 1,
                //                 employeeNumber: "MS2015123",
                //                 endDate: "08-02-2020",
                //                 fullName: "Nguyễn Văn An",
                //                 organizationalUnit: "Ban giám đốc",
                //                 reason: "Về quê",
                //                 startDate: "06-02-2020",
                //                 status: translate(`human_resource.annual_leave.status.approved`)
                //             },{
                //                 STT: 2,
                //                 employeeNumber: "MS2015123",
                //                 endDate: "10-02-2020",
                //                 fullName: "Nguyễn Văn An",
                //                 organizationalUnit: "Ban giám đốc",
                //                 reason: "Nghỉ du lịch",
                //                 startDate: "05-02-2020",
                //                 status: translate(`human_resource.annual_leave.status.waiting_for_approval`)
                //             }]
                //         }
                //     ]
                // },
            ]
    };

    return teamplateImport;
}
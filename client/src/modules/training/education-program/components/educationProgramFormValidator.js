export const EducationProgramFormValidator = {
    validateProgramName,
    validateProgramId,
    validateOrganizationalUnit,
    validatePosition

}

// Kiểm tra tên chương trình đào tạo nhập vào
function validateProgramName(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('training.education_program.name_required');
    }
    return msg;
}
// Kiểm tra mã chương trình đào tạo nhập vào
function validateProgramId(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('training.education_program.program_id_required');
    }
    return msg;
}
// Kiểm tra trường áp dụng cho đơn vị
function validateOrganizationalUnit(value, translate) {
    let msg = undefined;
    if (value.length === 0) {
        msg = translate('training.education_program.apply_for_organizational_units_required');
    }
    return msg;
}
// Kiểm tra trường áp dụng cho chức vụ
function validatePosition(value, translate) {
    let msg = undefined;
    if (value.length === 0) {
        msg = translate('training.education_program.apply_for_positions_required');
    }
    return msg;
}
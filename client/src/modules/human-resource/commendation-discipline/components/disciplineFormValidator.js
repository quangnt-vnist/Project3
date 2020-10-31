export const DisciplineFromValidator = {
    validateEmployeeNumber,
    validateReason,
    validateDecisionNumber,
    validateOrganizationalUnit,
    validateType,
}

/**
 * Kiểm tra mã nhân viên nhập vào
 * @param {*} value : Mã nhân viên
 * @param {*} translate : Props song ngữ
 */
function validateEmployeeNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.commendation_discipline.discipline.employee_number_required');
    }
    return msg;
}

/**
 * Kiểm tra số ra quyết định nhập vào
 * @param {*} value : Số ra quyết định
 * @param {*} translate : Props song ngữ
 */
function validateDecisionNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.commendation_discipline.discipline.number_decisions_required');
    }
    return msg;
}

/**
 * Kiểm tra cấp ra quyết định
 * @param {*} value : Số ra quyết định
 * @param {*} translate : Props song ngữ
 */
function validateOrganizationalUnit(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.commendation_discipline.discipline.unit_decisions_required');
    }
    return msg;
}

/**
 * Kiểm tra lý do nhập vào
 * @param {*} value 
 * @param {*} translate 
 */
function validateType(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.commendation_discipline.discipline.type_discipline_required');
    }
    return msg;
}

/**
 * Kiểm tra lý do nhập vào
 * @param {*} value : Lý do
 * @param {*} translate : Props song ngữ
 */
function validateReason(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.commendation_discipline.discipline.reason_discipline_required');
    }
    return msg;
}
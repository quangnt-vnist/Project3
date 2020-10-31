export const CommendationFromValidator = {
    validateEmployeeNumber,
    validateReason,
    validateDecisionNumber,
    validateOrganizationalUnit,
    validateType,
    validateStartDate
}
/**
 * Kiểm tra mã nhân viên nhập vào
 * @param {*} value : Mã nhân viên
 * @param {*} translate : Props song ngữ
 */
function validateEmployeeNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.commendation_discipline.commendation.employee_number_required');
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
        msg = translate('human_resource.commendation_discipline.commendation.number_decisions_required');
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
        msg = translate('human_resource.commendation_discipline.commendation.unit_decisions_required');
    }
    return msg;
}

/**
 * Kiểm tra hình thức khen thưởng nhập vào
 * @param {*} value : Hình thức khen thưởng
 * @param {*} translate : Props song ngữ
 */
function validateType(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.commendation_discipline.commendation.type_commendations_required');
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
        msg = translate('human_resource.commendation_discipline.commendation.reason_commendations_required');
    }
    return msg;
}

/**
 * Kiểm tra ngày ra quyết định
 * @param {*} value : Ngày ra quyết định
 * @param {*} translate : Props song ngữ
 */
function validateStartDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.commendation_discipline.commendation.decisions_date_required');
    }
    return msg;
}
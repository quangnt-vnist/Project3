export const TimesheetsFormValidator = {
    validateEmployeeNumber,
    validateMonth,
}

/**
 * Function kiểm tra mã nhân viên
 * @param {*} value : Mã nhân viên
 * @param {*} translate : Props song ngữ
 */
function validateEmployeeNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.employee_number_required');
    }
    return msg;
}

/**
 * Function kiểm tra tháng chấm công
 * @param {*} value : Tháng chấm công
 * @param {*} translate : Props song ngữ
 */
function validateMonth(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.timesheets.month_timesheets_required');
    }
    return msg;
}
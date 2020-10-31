import {
    VALIDATOR
} from '../../../../helpers/validator';

export const SalaryFormValidator = {
    validateEmployeeNumber,
    validateMonthSalary,
    validateMainSalary,
    validateNameSalary,
    validateMoreMoneySalary

}

/**
 * Function kiểm tra mã nhân viên
 * @param {*} value : Giá trị mã nhân viên
 * @param {*} translate : props song ngữ
 */
function validateEmployeeNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.employee_number_required');
    }
    return msg;
}

/**
 * Function kiểm tra tháng lương
 * @param {*} value : Giá trị tháng lương
 * @param {*} translate : props song ngữ
 */
function validateMonthSalary(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.salary.month_salary_required');
    }
    return msg;
}

/**
 * Function kiểm tra tiền lương chính
 * @param {*} value : Giá trị tiền lương chính
 * @param {*} translate : props song ngữ
 */
function validateMainSalary(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.salary.money_salary_required');
    }
    return msg;
}

/**
 * Function kiểm tra tên lương thưởng khác
 * @param {*} value : Giá trị tên lương thưởng khác
 * @param {*} translate : props song ngữ
 */
function validateNameSalary(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.salary.name_other_salary_required');
    }
    return msg;
}

/**
 * Function kiểm tra tiền lương thưởng khác
 * @param {*} value : Giá trị tiền lương thưởng khác
 * @param {*} translate : props song ngữ
 */
function validateMoreMoneySalary(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.salary.money_other_salary_required');
    }
    return msg;
}
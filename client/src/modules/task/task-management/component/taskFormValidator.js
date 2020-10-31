import { VALIDATOR } from '../../../../helpers/validator';

export const TaskFormValidator = {
    validateTaskUnit,
    validateTaskName,
    validateTaskDescription,
    validateTaskResponsibleEmployees,
    validateTaskAccountableEmployees,
    validateTaskStartDate,
    validateTaskEndDate,
}

function validateTaskUnit(value, translate) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = translate('task.task_management.add_err_empty_unit');
    }
    return msg;
}

function validateTaskName(value, translate) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = translate('task.task_management.add_err_empty_name');
    } else if (!VALIDATOR.isValidName(value)){
        msg = translate('task.task_management.add_err_special_character');
    }
    return msg;
}

function validateTaskDescription(value, translate) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = translate('task.task_management.add_err_empty_description');
    }
    return msg;
}

/**
 * @param {*} value Định dạng: dd-mm-yyyy
 */
function validateTaskStartDate(startDate, endDate, translate) {
    let msg = undefined;

    if (startDate.trim() === ""){
        msg = translate('task.task_management.add_err_empty_start_date');
    } else if (endDate !== ""){
        msg = _validateTaskDate(startDate, endDate, translate);
    }
    return msg;
}

/**
 * @param {*} startDate Định dạng: dd-mm-yyyy
 * @param {*} endDate Định dạng: dd-mm-yyyy
 */
function validateTaskEndDate(startDate, endDate, translate) {
    let msg = undefined;

    if (endDate.trim() === ""){
        msg = translate('task.task_management.add_err_empty_end_date');
    } else if (startDate !== ""){
        msg = _validateTaskDate(startDate, endDate, translate);
    }
    return msg;
}

/**
 * Hàm tiện ích kiểm tra ngày bắt đầu phải trước ngày kết thúc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate ngày kết thúc
 */
function _validateTaskDate(startDate, endDate, translate){
    let msg = undefined;
    var pattern = /(\d{2})\-(\d{2})\-(\d{4})/;

    var startDate = new Date(startDate.replace(pattern,'$3-$2-$1'));
    var endDate = new Date(endDate.replace(pattern,'$3-$2-$1'));
    if (startDate > endDate){
        msg = translate('task.task_management.add_err_end_date');
    }
    return msg;
}


function validateTaskResponsibleEmployees(value, translate) {
    let msg = undefined;
    if (value.length === 0){
        msg = translate('task.task_management.add_err_empty_responsible');
    }
    return msg;
}
function validateTaskAccountableEmployees(value, translate) {
    let msg = undefined;
    if (value.length === 0){
        msg = translate('task.task_management.add_err_empty_accountable');
    }
    return msg;
}
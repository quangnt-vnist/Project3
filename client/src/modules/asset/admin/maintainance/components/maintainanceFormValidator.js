import {
    VALIDATOR
} from '../../../../../helpers/validator';
export const MaintainanceFormValidator = {

    validateMaintainanceCode, //mã phiếu
    validateCreateDate, // ngày lập
    validateCode, // nội dung bảo trì
    validateDescription, // nội dung bảo trì
    validateExpense,
    validateStartDate, // ngày lập
}

/**
 * Validate TabMaintainance (Thông tin bảo trì)
 */
/**
 * Kiểm tra số phiếu nhập vào
 */
function validateMaintainanceCode(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã phiếu không được để trống";
    } else if (!VALIDATOR.isValidEmployeeNumber(value)) {
        msg = "Mã phiếu không được chứa kí tự đặc biệt";
    }
    return msg;
}

// Function kiểm tra ngày lập
function validateCreateDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày lập không được để trống";
    }
    return msg;
}

// Function kiểm tra mã tài sản
function validateCode(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã tài sản không được để trống";
    }
    return msg;
}

// Function kiểm tra nội dung bảo trì
function validateDescription(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Nội dung không được để trống";
    }
    return msg;
}

function validateExpense(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Chi phí không được để trống";
    }
    return msg;
}

// Function kiểm tra ngày lập
function validateStartDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày sửa chữa không được để trống";
    }
    return msg;
}
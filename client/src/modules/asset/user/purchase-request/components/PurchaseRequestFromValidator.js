import {
    VALIDATOR
} from '../../../../../helpers/validator';

export const PurchaseRequestFromValidator = {
    validateRecommendNumber,
    validateDateCreate,
    validateEquipment,
    validateEquipmentDescription,
    validateTotal,
    validateUnit,
    validateProponent,
    validateApprover,

}

// Kiểm tra "Mã phiếu" nhập vào
function validateRecommendNumber(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã phiếu không được để trống";
    } else if (!VALIDATOR.isValidEmployeeNumber(value)) {
        msg = "Mã phiếu không được chứa kí tự đặc biệt";
    }
    return msg;
}

// Kiểm tra "Ngày lập" nhập vào
function validateDateCreate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày lập không được để trống";
    }
    return msg;
}

// Kiểm tra "Người đề nghị" nhập vào
function validateProponent(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Người đề nghị không được để trống";
    }
    return msg;
}

// Kiểm tra "Thiết bị đề nghị mua" nhập vào
function validateEquipment(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Thiết bị đề nghị mua không được để trống";
    }
    return msg;
}

// Kiểm tra "Thiết bị đề nghị mua" nhập vào
function validateEquipmentDescription(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mô tả thiết bị đề nghị mua không được để trống";
    }
    return msg;
}

// Kiểm tra "Số lượng" nhập vào
function validateTotal(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Số lượng không được để trống";
    }
    return msg;
}
// Kiểm tra "Đơn vị tính" nhập vào
function validateUnit(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Đơn vị tính không được để trống";
    }
    return msg;
}

// Kiểm tra "Người đề nghị" nhập vào
function validateApprover(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Người phê duyệt không được để trống";
    }
    return msg;
}
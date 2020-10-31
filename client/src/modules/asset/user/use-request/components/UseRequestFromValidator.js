import {
    VALIDATOR
} from '../../../../../helpers/validator';

export const UseRequestFromValidator = {
    validateRecommendNumber,
    validateDateCreate,
    validateReqContent,
    validateProponent,
    validateCode,
    validateDateStartUse,
    validateDateEndUse,
    validateApprover,
    validateNote
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

// Kiểm tra "Nội dung đề nghị" nhập vào
function validateReqContent(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Nội dung đề nghị không được để trống";
    }
    return msg;
}

// Kiểm tra "Mã tài sản" nhập vào
function validateCode(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã tài sản không được để trống";
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

// Kiểm tra "Thời gian đăng ký sử dụng từ ngày" nhập vào
function validateDateStartUse(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Thời gian đăng ký sử dụng từ ngày không được để trống";
    }
    return msg;
}

// Kiểm tra "Thời gian đăng ký sử dụng đến ngày" nhập vào
function validateDateEndUse(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Thời gian đăng ký sử dụng đến ngày không được để trống";
    }
    return msg;
}

// Kiểm tra "Người phê duyệt" nhập vào
function validateApprover(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Người phê duyệt không được để trống";
    }
    return msg;
}

// Kiểm tra "Ghi chú" nhập vào
function validateNote(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ghi chú không được để trống";
    }
    return msg;
}

import {
    VALIDATOR
} from '../../../../../helpers/validator';

export const IncidentFormValidator = {
    validateIncidentCode,
    validateDateOfIncident,
    validateDescription,


}

//1. Kiểm tra "Mã sự cố" nhập vào
function validateIncidentCode(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã sự cố không được để trống";
    }
    return msg;
}

//2. Kiểm tra "Ngày phát hiện" nhập vào
function validateDateOfIncident(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày phát hiện không được để trống";
    }
    return msg;
}


//3. Kiểm tra "Nội dung" nhập vào
function validateDescription(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Nội dung không được để trống";
    }
    return msg;
}
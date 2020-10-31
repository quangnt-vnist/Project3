import { VALIDATOR } from '../../../helpers/validator';

export const NotificationValidator = {
    validateTitle,
    validateContent,
    validateSender,
}

function validateTitle(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "not_null";
    } else if(value.length < 4){
        msg = "no_less_4";
    } else if(value.length > 255){
        msg = "no_more_255";
    } else if (!VALIDATOR.isValidName(value)){
        msg = "no_special";
    }
    return msg;
}

function validateContent(value) {
    let msg = undefined;
    if (!VALIDATOR.isValidName(value)){
        msg = "no_special";
    }
    return msg;
}

function validateSender(value) {
    let msg = undefined;
    if (value.trim() === ""){
        msg = "not_null";
    } else if(value.length < 4){
        msg = "no_less_4";
    } else if(value.length > 255){
        msg = "no_more_255";
    } else if (!VALIDATOR.isValidName(value)){
        msg = "no_special";
    }
    return msg;
}
const nameRegex = /^[^~`!@#$%^&*()+=/*';\\<>?:",]*$/;
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^[^~`!#$%^&*()+=/*';\\<>?:",]*$/;
const employeeNumberRegex = /^[^~`!@#$%^&*()+=/*';\\<>?:",]*$/;
const urlRegex = /^[^~`!@#$%^&*()+= *';\\<>?:",]*$/;
const stringNotSpaceRegex = /^[^~`!@#$%^&*()+=/ *';\\<>?:",]*$/;

export const REGEX = {
    NAME: nameRegex,
    EMAIL: emailRegex,
    PASSWORD: passwordRegex,
    EMPLOYEE_NUMBER: employeeNumberRegex,
    URL: urlRegex,
    STRING_NOT_SPACE: stringNotSpaceRegex,
}

/**
 * Validate dữ liệu nhập vào từ người dùng trươc khi gửi đến cho server xử lý
 */
export const VALIDATOR = {
    isValidName,
    isValidEmail,
    isValidPassword,
    isValidEmployeeNumber,
    isValidUrl,
    isStringNotSpace,

    checkName,
    checkEmail,
    checkPassword,
    checkDescription,
}

// Kiểm tra tên có hợp lệ
function isValidName(name) {
    return nameRegex.test(name) ? true : false;
}

// Kiểm tra email có hợp lệ
function isValidEmail(email) {
    return emailRegex.test(String(email).toLowerCase()) ? true : false;
}

// Kiểm tra password có hợp lệ
function isValidPassword(password) {
    return passwordRegex.test(String(password).toLowerCase()) ? true : false;
}

// Kiểm tra mã số nhân viên có hợp lệ
function isValidEmployeeNumber(employeeNumber) {
    return employeeNumberRegex.test(employeeNumber) ? true : false;
}

// Kiem tra url co hop le
function isValidUrl(url) {
    return (url[0] === '/' && urlRegex.test(url)) ? true : false;
}

function isStringNotSpace(string){
    return stringNotSpaceRegex.test(string) ? true : false;
}

function checkName(name) {
    let msg;
    if(name === undefined || name === null) {
        return {
            status: false
        }
    } else {
        let dataName = name.toString();
        if(!nameRegex.test(dataName)) {
            msg = 'general.validate.nameTypeErr';
        } else if(dataName.length < 1 || dataName.length > 255) {
            msg = 'general.validate.nameLengthErr'
        }
        return msg !== undefined ?
        {
            status: false,
            msg
        } : {
            status: true
        }
    }
}

function checkEmail(email) {
    let msg;
    if(email === undefined || email === null) {
        return {
            status: false
        }
    } else {
        let dataEmail = email.toString();
        if(!emailRegex.test(dataEmail)) {
            msg = 'general.validate.emailErr';
        }
        return msg !== undefined ?
        {
            status: false,
            msg
        } : {
            status: true
        }
    }
}

function checkPassword(pass) {
    let msg;
    if(pass === undefined || pass === null) {
        return {
            status: false
        }
    } else {
        let dataPass = pass.toString();
        if(dataPass.length < 6 || dataPass.length > 30) {
            msg = 'general.validate.passwordLengthErr';
        }
        return msg !== undefined ?
        {
            status: false,
            msg
        } : {
            status: true
        }
    }
}

function checkDescription(des) {
    let msg;
    if(des === undefined || des === null) {
        return {
            status: false
        }
    } else {
        let desData = des.toString();
        if(desData.length < 1) {
            msg = 'general.validate.descriptionLengthErr'
        }
        return msg !== undefined ?
        {
            status: false,
            msg
        } : {
            status: true
        }
    }
}
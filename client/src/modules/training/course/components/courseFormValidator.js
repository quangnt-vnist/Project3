export const CourseFormValidator = {
    validateCourseName,
    validateCourseId,
    validateStartDate,
    validateEndDate,
    validateCoursePlace,
    validateOfferedBy,
    validateEducationProgram,
    validateCost,
    validateEmployeeCommitmentTime
}

/**
 * Kiểm tra tên khoá đào tạo nhập vào
 * @param {*} value 
 * @param {*} translate 
 */
function validateCourseName(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('training.course.name_required');
    }
    return msg;
}

/**
 * Kiểm tra mã khoá đào tạo nhập vào
 * @param {*} value 
 * @param {*} translate 
 */
function validateCourseId(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('training.course.course_id_required');
    }
    return msg;
}

/**
 * Kiểm tra thời gian bắt đầu nhập vào
 * @param {*} value 
 * @param {*} translate 
 */
function validateStartDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('training.course.start_date_required');
    }
    return msg;
}

/**
 * Kiểm tra thời gian kết thúc nhập vào
 * @param {*} value 
 * @param {*} translate 
 */
function validateEndDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('training.course.end_date_required');
    }
    return msg;
}

/**
 * Kiểm tra địa điểm đào tạo nhập vào
 * @param {*} value 
 * @param {*} translate 
 */
function validateCoursePlace(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('training.course.course_place_required');
    }
    return msg;
}

/**
 * Kiểm tra đơn vị đào tạo nhập vào
 * @param {*} value 
 * @param {*} translate 
 */
function validateOfferedBy(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('training.course.offered_by_required');
    }
    return msg;
}

/**
 * Kiểm tra thuộc chương trình đào tạo đào tạo nhập vào
 * @param {*} value 
 * @param {*} translate 
 */
function validateEducationProgram(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('training.course.education_program_required');
    }
    return msg;
}

/**
 * Kiểm tra chi phí đào tạo nhập vào
 * @param {*} value 
 * @param {*} translate 
 */
function validateCost(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('training.course.cost_required');
    }
    return msg;
}

/**
 * Kiểm tra thời gian cam kết nhập vào
 * @param {*} value 
 * @param {*} translate 
 */
function validateEmployeeCommitmentTime(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('training.course.employee_commitment_time_required');
    }
    return msg;
}
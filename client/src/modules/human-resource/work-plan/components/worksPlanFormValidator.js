export const WorkPlanFormValidator = {
    validateDescription,
}

/**
 * Function kiểm tra mô tả lịch nghỉ
 * @param {*} value : Mô tả lịch nghỉ
 * @param {*} translate : Props song ngữ
 */
function validateDescription(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = translate('human_resource.work_plan.reason_required');
    }
    return msg;
}
import { VALIDATOR } from '../../../../../helpers/validator';

export const TaskProcessValidator = {
    validateManager,
    validateProcessDescription,
    validateProcessName,
    validateViewer,
}


// validate name
function validateProcessName(value, translate) {
    let msg;
    if (value.trim() === "") {
        msg = translate("task.task_process.error.empty_name")
    } else if (!VALIDATOR.isValidName(value)) {
        msg = translate("task.task_process.error.special_character")
    }
    return msg;
}

// validate description
function validateProcessDescription(value, translate) {
    let msg;
    if (value.trim() === "") {
        msg = translate("task.task_process.error.empty_description")
    }
    return msg;
}

// validate viewer
function validateViewer(value, translate) {
    let msg;
    if (value.length === 0) {
        msg = translate("task.task_process.error.empty_viewer")
    }
    return msg;
}


// validate manager
function validateManager(value, translate) {
    let msg;
    if (value.length === 0) {
        msg = translate("task.task_process.error.empty_manager")
    }
    return msg;
}


import { performTaskConstants } from "./constants";
import { TaskProcessConstants } from "../../task-process/redux/constants"
export function performtasks(state = {}, action) {
    switch (action.type) {
        case performTaskConstants.GETTASK_BYID_REQUEST:
            return {
                ...state,
                task: null,
                loading: true,
                isLoading: true
            };
        case performTaskConstants.GETTASK_BYID_SUCCESS:
            return {
                ...state,
                task: action.payload,
                isLoading: false
            };
        case performTaskConstants.GETTASK_BYID_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case performTaskConstants.CREATE_RESULT_TASK_REQUEST:
            return {
                ...state,
                adding: true
            };
        case performTaskConstants.CREATE_RESULT_TASK_SUCCESS:
            return {
                ...state,
                adding: false,
                currentTask: action.task.data.content
            };
        case performTaskConstants.CREATE_RESULT_TASK_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.GET_TIMESHEET_LOGS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case performTaskConstants.GET_TIMESHEET_LOGS_SUCCESS:
            return {
                ...state,
                loading: false,
                logtimer: action.payload.data.content
            };
        case performTaskConstants.GET_TIMESHEET_LOGS_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.GET_TIMERSTATUS_REQUEST:
            return {
                ...state,
                currentTimer: null,
                loading: true
            };
        case performTaskConstants.GET_TIMERSTATUS_SUCCESS:
            return {
                ...state,
                currentTimer: action.payload.data.content
            };
        case performTaskConstants.GET_TIMERSTATUS_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.START_TIMER_REQUEST:
            return {
                ...state,
                loading: true
            };
        case performTaskConstants.START_TIMER_SUCCESS:
            return {
                ...state,
                currentTimer: action.payload.data.content
            };
        case performTaskConstants.START_TIMER_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.STOP_TIMER_REQUEST:
            return {
                ...state,
                loading: true
            };
        case performTaskConstants.STOP_TIMER_SUCCESS:
            return {
                ...state,
                task: action.payload,
                logtimer: action.payload.timesheetLogs,
                currentTimer: null,
            };
        case performTaskConstants.STOP_TIMER_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.ABC:
            return {
                ...state,
                currentTimer: null,
                loading: true
            }
        case performTaskConstants.CREATE_ACTION_COMMENT_SUCCESS:
            var taskactions = { ...state.task, taskActions: action.payload.data.content }
            return {
                ...state,
                task: taskactions
            }
        case performTaskConstants.CREATE_ACTION_COMMENT_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.CREATE_TASK_ACTION_REQUEST:
            return {
                ...state,
                adding: true
            };
        case performTaskConstants.CREATE_TASK_ACTION_SUCCESS:
            var taskactions = { ...state.task, taskActions: action.payload.data.content }
            return {
                ...state,
                task: taskactions
            }
        case performTaskConstants.CREATE_TASK_ACTION_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.EDIT_ACTION_COMMENT_REQUEST:
            return {
                ...state,
                editing: true
            };
        case performTaskConstants.EDIT_ACTION_COMMENT_SUCCESS:
            var taskactions = { ...state.task, taskActions: action.payload.data.content }
            return {
                ...state,
                task: taskactions
            }
        case performTaskConstants.EDIT_ACTION_COMMENT_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.EDIT_TASK_ACTION_REQUEST:
            return {
                ...state,
                editing: true
            };
        case performTaskConstants.EDIT_TASK_ACTION_SUCCESS:
            var taskactions = { ...state.task, taskActions: action.payload.data.content }
            return {
                ...state,
                task: taskactions
            }
        case performTaskConstants.EDIT_TASK_ACTION_FAILURE:
            return {
                error: action.error
            };
        case performTaskConstants.EDIT_TASK_INFORMATION_REQUEST:
            return {
                ...state,
                editing: true
            };
        case performTaskConstants.EDIT_TASK_INFORMATION_SUCCESS:
            return {
                ...state,
                task: action.payload
            };
        case performTaskConstants.EDIT_TASK_INFORMATION_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case performTaskConstants.CONFIRM_TASK_REQUEST:
            return {
                ...state,
                editing: true
            }
        case performTaskConstants.CONFIRM_TASK_SUCCESS:
            return {
                ...state,
                task: action.payload
            }
        case performTaskConstants.CONFIRM_TASK_FAILURE:
            return {
                ...state,
                error: action.payload
            }
        case performTaskConstants.EDIT_EMPLOYEE_COLLABORATED_WITH_ORGANIZATIONAL_UNIT_REQUEST:
            return {
                ...state,
                editing: true
            }
        case performTaskConstants.EDIT_EMPLOYEE_COLLABORATED_WITH_ORGANIZATIONAL_UNIT_SUCCESS:
            return {
                ...state,
                task: action.payload
            }
        case performTaskConstants.EDIT_EMPLOYEE_COLLABORATED_WITH_ORGANIZATIONAL_UNIT_FAILURE:
            return {
                ...state,
                error: action.payload
            }
        case performTaskConstants.DELETE_ACTION_COMMENT_REQUEST:
            return {
                ...state,
                deleting: true
            };
        case performTaskConstants.DELETE_ACTION_COMMENT_SUCCESS:
            var taskactions = { ...state.task, taskActions: action.payload.data.content }
            return {
                ...state,
                task: taskactions
            }
        case performTaskConstants.DELETE_TASK_ACTION_REQUEST:
            return {
                ...state,
                deleting: true
            }
        case performTaskConstants.DELETE_TASK_ACTION_SUCCESS:
            var taskactions = { ...state.task, taskActions: action.payload.data.content }
            return {
                ...state,
                task: taskactions
            }
        case performTaskConstants.DELETE_TASK_ACTION_FAILURE:
            return {
                error: action.error
            }
        case performTaskConstants.CREATE_TASK_COMMENT_REQUEST:
            return {
                ...state,
                adding: true
            }
        case performTaskConstants.CREATE_TASK_COMMENT_SUCCESS:
            var taskcomments = { ...state.task, taskComments: action.payload.data.content }
            return {
                ...state,
                task: taskcomments
            }
        case performTaskConstants.CREATE_TASK_COMMENT_FAILURE:
            return {
                error: action.error
            }
        case performTaskConstants.EDIT_TASK_COMMENT_REQUEST:
            return {
                ...state,
                editing: true
            }
        case performTaskConstants.EDIT_TASK_COMMENT_SUCCESS:
            var taskcomments = { ...state.task, taskComments: action.payload.data.content }
            return {
                ...state,
                task: taskcomments
            }
        case performTaskConstants.EDIT_TASK_COMMENT_FAILURE:
            return {
                error: action.error
            }
        case performTaskConstants.DELETE_TASK_COMMENT_REQUEST:
            return {
                ...state,
                deleting: true
            }
        case performTaskConstants.DELETE_TASK_COMMENT_SUCCESS:
            var taskcomments = { ...state.task, taskComments: action.payload.data.content }
            return {
                ...state,
                task: taskcomments
            }
        case performTaskConstants.DELETE_TASK_COMMENT_FAILURE:
            return {
                error: action.error
            }
        case performTaskConstants.CREATE_COMMENT_OF_TASK_COMMENT_REQUEST:
            return {
                ...state,
                adding: true
            }
        case performTaskConstants.CREATE_COMMENT_OF_TASK_COMMENT_SUCCESS:
            var taskcomments = { ...state.task, taskComments: action.payload.data.content }
            return {
                ...state,
                task: taskcomments
            }
        case performTaskConstants.CREATE_COMMENT_OF_TASK_COMMENT_FAILURE:
            return {
                ...state,
                error: action.error
            }
        case performTaskConstants.EDIT_COMMENT_OF_TASK_COMMENT_REQUEST:
            return {
                ...state,
                editing: true
            }
        case performTaskConstants.EDIT_COMMENT_OF_TASK_COMMENT_SUCCESS:
            var taskcomments = { ...state.task, taskComments: action.payload.data.content }
            return {
                ...state,
                task: taskcomments
            }
        case performTaskConstants.EDIT_COMMENT_OF_TASK_COMMENT_FAILURE:
            return {
                ...state,
                error: action.error
            }
        case performTaskConstants.DELETE_COMMENT_OF_TASK_COMMENT_REQUEST:
            return {
                ...state,
                deleting: true
            }
        case performTaskConstants.DELETE_COMMENT_OF_TASK_COMMENT_SUCCESS:
            var taskcomments = { ...state.task, taskComments: action.payload.data.content }
            return {
                ...state,
                task: taskcomments
            }
        case performTaskConstants.DELETE_COMMENT_OF_TASK_COMMENT_FAILURE:
            return {
                ...state,
                error: action.error
            }
        case performTaskConstants.EVALUATION_ACTION_REQUEST:
            return {
                ...state,
                evaluating: true
            }
        case performTaskConstants.EVALUATION_ACTION_SUCCESS:
            var taskactions = { ...state.task, taskActions: action.payload.data.content }
            return {
                ...state,
                task: taskactions
            }
        case performTaskConstants.EVALUATION_ACTION_FAILURE:
            return {
                ...state,
                error: action.error
            }
        case performTaskConstants.CONFIRM_ACTION_REQUEST:
            return {
                ...state,
                abc: true
            }
        case performTaskConstants.CONFIRM_ACTION_SUCCESS:
            var taskactions = { ...state.task, taskActions: action.payload.data.content }
            return {
                ...state,
                task: taskactions
            }
        case performTaskConstants.CONFIRM_ACTION_FAILURE:
            return {
                ...state,
                error: action.error
            }
        case performTaskConstants.UPLOAD_FILE_REQUEST:
            return {
                ...state,
                uploading: true
            }
        case performTaskConstants.UPLOAD_FILE_SUCCESS:

            var documents = { ...state.task, documents: action.payload.data.content }
            return {
                ...state,
                task: documents
            }
        case performTaskConstants.UPLOAD_FILE_FAILURE:
        case performTaskConstants.DELETE_FILE_ACTION_REQUEST:
            return {
                ...state,
                deleting: true
            }
        case performTaskConstants.DELETE_FILE_ACTION_SUCCESS:
            var taskactions = { ...state.task, taskActions: action.payload.data.content }
            return {
                ...state,
                task: taskactions
            }
        case performTaskConstants.DELETE_FILE_ACTION_FAILURE:
        case performTaskConstants.DELETE_FILE_COMMENT_OF_ACTION_REQUEST:
            return {
                ...state,
                deleting: true
            }
        case performTaskConstants.DELETE_FILE_COMMENT_OF_ACTION_SUCCESS:
            var taskactions = { ...state.task, taskActions: action.payload.data.content }
            return {
                ...state,
                task: taskactions
            }
        case performTaskConstants.DELETE_FILE_COMMENT_OF_ACTION_FAILURE:
        case performTaskConstants.DELETE_FILE_TASK_COMMENT_REQUEST:

            return {
                ...state,
                deleting: true
            }
        case performTaskConstants.DELETE_FILE_TASK_COMMENT_SUCCESS:
            var taskcomments = { ...state.task, taskComments: action.payload.data.content }
            return {
                ...state,
                task: taskcomments
            }
        case performTaskConstants.DELETE_FILE_TASK_COMMENT_FAILURE:



        case performTaskConstants.DELETE_FILE_CHILD_TASK_COMMENT_REQUEST:
            return {
                ...state,
                deleting: true
            }
        case performTaskConstants.DELETE_FILE_CHILD_TASK_COMMENT_SUCCESS:
            var taskcomments = { ...state.task, taskComments: action.payload.data.content }
            return {
                ...state,
                task: taskcomments
            }
        case performTaskConstants.DELETE_FILE_CHILD_TASK_COMMENT_FAILURE:
        case performTaskConstants.ADD_TASK_LOG_REQUEST:
            return {
                ...state,
                adding: true
            };
        case performTaskConstants.ADD_TASK_LOG_SUCCESS:
            return {
                ...state,
                adding: false,
                logs: action.payload
            };
        case performTaskConstants.ADD_TASK_LOG_FAILURE:
            return {
                error: action.error
            };

        case performTaskConstants.GET_TASK_LOG_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case performTaskConstants.GET_TASK_LOG_SUCCESS:
            return {
                ...state,
                isLoading: false,
                logs: action.payload
            };
        case performTaskConstants.GET_TASK_LOG_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case performTaskConstants.DELETE_FILE_TASK_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case performTaskConstants.DELETE_FILE_TASK_SUCCESS:
            var documents = { ...state.task, documents: action.payload }
            return {
                ...state,
                task: documents
            };
        case performTaskConstants.DELETE_FILE_TASK_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case performTaskConstants.EDIT_TASK_BY_ACCOUNTABLE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case performTaskConstants.EDIT_TASK_BY_ACCOUNTABLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case performTaskConstants.EDIT_TASK_BY_ACCOUNTABLE_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case performTaskConstants.EDIT_TASK_BY_RESPONSIBLE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case performTaskConstants.EDIT_TASK_BY_RESPONSIBLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case performTaskConstants.EDIT_TASK_BY_RESPONSIBLE_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case performTaskConstants.EVALUATE_TASK_BY_ACCOUNTABLE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case performTaskConstants.EVALUATE_TASK_BY_ACCOUNTABLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case performTaskConstants.EVALUATE_TASK_BY_ACCOUNTABLE_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case performTaskConstants.EVALUATE_TASK_BY_RESPONSIBLE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case performTaskConstants.EVALUATE_TASK_BY_RESPONSIBLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case performTaskConstants.EVALUATE_TASK_BY_RESPONSIBLE_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case performTaskConstants.EVALUATE_TASK_BY_CONSULTED_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case performTaskConstants.EVALUATE_TASK_BY_CONSULTED_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case performTaskConstants.EVALUATE_TASK_BY_CONSULTED_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };

        case performTaskConstants.EDIT_HOURS_SPENT_IN_EVALUATION_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case performTaskConstants.EDIT_HOURS_SPENT_IN_EVALUATION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload,
            };
        case performTaskConstants.EDIT_HOURS_SPENT_IN_EVALUATION_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };


        case performTaskConstants.DELETE_EVALUATION_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case performTaskConstants.DELETE_EVALUATION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case performTaskConstants.DELETE_EVALUATION_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case performTaskConstants.DELETE_DOCUMENT_TASK_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case performTaskConstants.DELETE_DOCUMENT_TASK_SUCCESS:
            var documents = { ...state.task, documents: action.payload }
            return {
                ...state,
                task: documents
            };
        case performTaskConstants.DELETE_DOCUMENT_TASK_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case performTaskConstants.EDIT_DOCUMENT_TASK_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case performTaskConstants.EDIT_DOCUMENT_TASK_SUCCESS:
            var documents = { ...state.task, documents: action.payload }
            return {
                ...state,
                task: documents
            };
        case performTaskConstants.EDIT_DOCUMENT_TASK_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case performTaskConstants.EDIT_ACTIVATE_OF_TASK_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case performTaskConstants.EDIT_ACTIVATE_OF_TASK_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case performTaskConstants.EDIT_ACTIVATE_OF_TASK_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case performTaskConstants.CREATE_COMMENT_PROCESS_REQUEST:
            return {
                ...state,
                adding: true
            }
        case performTaskConstants.CREATE_COMMENT_PROCESS_SUCCESS:
            return {
                ...state,
                task: action.payload.task
            }
        case performTaskConstants.CREATE_COMMENT_PROCESS_FAILURE:
            return {
                error: action.payload,
            }
        case performTaskConstants.CREATE_CHILD_COMMENT_REQUEST:
            return {
                ...state,
                adding: true
            }
        case performTaskConstants.CREATE_CHILD_COMMENT_SUCCESS:
            return {
                ...state,
                task: action.payload
            }
        case performTaskConstants.CREATE_CHILD_COMMENT_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case performTaskConstants.EDIT_COMMENT_PROCESS_REQUEST:
            return {
                ...state,
                editing: true
            }
        case performTaskConstants.EDIT_COMMENT_PROCESS_SUCCESS:
            return {
                ...state,
                task: action.payload.task
            }
        case performTaskConstants.EDIT_COMMENT_PROCESS_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case performTaskConstants.DELETE_COMMENT_PROCESS_REQUEST:
            return {
                ...state,
                editing: true
            }
        case performTaskConstants.DELETE_COMMENT_PROCESS_SUCCESS:
            return {
                ...state,
                task: action.payload.task
            }
        case performTaskConstants.DELETE_COMMENT_PROCESS_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case performTaskConstants.EDIT_CHILD_COMMENT_REQUEST:
            return {
                ...state,
                editing: true
            }
        case performTaskConstants.EDIT_CHILD_COMMENT_SUCCESS:
            return {
                ...state,
                task: action.payload
            }
        case performTaskConstants.EDIT_CHILD_COMMENT_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case performTaskConstants.DELETE_CHILD_COMMENT_REQUEST:
            return {
                ...state,
                deleting: true
            }
        case performTaskConstants.DELETE_CHILD_COMMENT_SUCCESS:
            var comment = { ...state.task, commentsInProcess: action.payload }
            return {
                ...state,
                task: comment
            }
        case performTaskConstants.DELETE_CHILD_COMMENT_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case performTaskConstants.DELETE_FILE_COMMENT_REQUEST:
            return {
                ...state,
                deleting: true
            }
        case performTaskConstants.DELETE_FILE_COMMENT_SUCCESS:
            return {
                ...state,
                task: action.payload
            }
        case performTaskConstants.DELETE_FILE_COMMENT_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case performTaskConstants.DELETE_FILE_CHILD_COMMENT_REQUEST:
            return {
                ...state,
                deleting: true
            }
        case performTaskConstants.DELETE_FILE_CHILD_COMMENT_SUCCESS:

            return {
                ...state,
                task: action.payload
            }
        case performTaskConstants.DELETE_FILE_CHILD_COMMENT_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case performTaskConstants.CREATE_COMMENT_PROCESS_INCOMING_REQUEST:
            return {
                ...state,
                adding: true
            }
        case performTaskConstants.CREATE_COMMENT_PROCESS_INCOMING_SUCCESS:
            return {
                ...state,
                preceedingTasks: state.preceedingTasks.map(item =>
                    item.task._id === action.payload.taskId ? { task: action.payload.task } : item)
            }
        case performTaskConstants.CREATE_COMMENT_PROCESS_INCOMING_FAILURE:
            return {
                error: action.payload,
            }
        case performTaskConstants.EDIT_COMMENT_PROCESS_INCOMING_REQUEST:
            return {
                ...state,
                editing: true
            }
        case performTaskConstants.EDIT_COMMENT_PROCESS_INCOMING_SUCCESS:
            return {
                ...state,
                preceedingTasks: state.preceedingTasks.map(item =>
                    item.task._id === action.payload.taskId ? { task: action.payload.task } : item)
            }
        case performTaskConstants.EDIT_COMMENT_PROCESS_INCOMING_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case performTaskConstants.DELETE_COMMENT_PROCESS_INCOMING_REQUEST:
            return {
                ...state,
                editing: true
            }
        case performTaskConstants.DELETE_COMMENT_PROCESS_INCOMING_SUCCESS:
            return {
                ...state,
                preceedingTasks: state.preceedingTasks.map(item =>
                    item.task._id === action.payload.taskId ? { task: action.payload.task } : item)
            }
        case performTaskConstants.DELETE_COMMENT_PROCESS_INCOMING_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case performTaskConstants.CREATE_CHILD_COMMENT_INCOMING_REQUEST:
            return {
                ...state,
                adding: true
            }
        case performTaskConstants.CREATE_CHILD_COMMENT_INCOMING_SUCCESS:
            console.log(action.payload)
            return {
                ...state,
                preceedingTasks: state.preceedingTasks.map(item =>
                    item.task._id === action.payload.taskId ? { task: action.payload.task } : item)
            }
        case performTaskConstants.CREATE_CHILD_COMMENT_INCOMING_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case performTaskConstants.EDIT_CHILD_COMMENT_INCOMING_REQUEST:
            return {
                ...state,
                editing: true
            }
        case performTaskConstants.EDIT_CHILD_COMMENT_INCOMING_SUCCESS:
            return {
                ...state,
                preceedingTasks: state.preceedingTasks.map(item =>
                    item.task._id === action.payload.taskId ? { task: action.payload.task } : item)
            }
        case performTaskConstants.EDIT_CHILD_COMMENT_INCOMING_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case performTaskConstants.DELETE_CHILD_COMMENT_INCOMING_REQUEST:
            return {
                ...state,
                deleting: true
            }
        case performTaskConstants.DELETE_CHILD_COMMENT_INCOMING_SUCCESS:
            return {
                ...state,
                preceedingTasks: state.preceedingTasks.map(item =>
                    item.task._id === action.payload.taskId ? { task: action.payload.task } : item)
            }
        case performTaskConstants.DELETE_CHILD_COMMENT_INCOMING_FAILURE:
            return {
                ...state,
                error: action.payload,
            }
        case performTaskConstants.GET_ALL_PRECEEDING_TASKS_REQUEST:
            return {
                ...state,
                editing: true
            };
        case performTaskConstants.GET_ALL_PRECEEDING_TASKS__SUCCESS:
            return {
                ...state,
                preceedingTasks: action.payload
            }
        case performTaskConstants.GET_ALL_PRECEEDING_TASKS_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
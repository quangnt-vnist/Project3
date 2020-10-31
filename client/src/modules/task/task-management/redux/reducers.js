import { taskManagementConstants } from "./constants";

export function tasks(state = {}, action) {
    switch (action.type) {
        case taskManagementConstants.GETALL_TASK_REQUEST:
            return {
                ...state,
                loading: true,
                isLoading: true
            };
        case taskManagementConstants.GETALL_TASK_SUCCESS:
            return {
                ...state,
                items: action.payload,
                isLoading: false
            };
        case taskManagementConstants.GETALL_TASK_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_BYID_REQUEST:
            return {
                ...state,
                task: null,
                loading: true,
                isLoading: true
            };
        case taskManagementConstants.GETTASK_BYID_SUCCESS:
            return {
                ...state,
                task: action.payload,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_BYID_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_REQUEST:
            return {
                ...state,
                responsibleTasks: null,
                tasks: null,
                pages: null,
                loadingResponsible: true,
                isLoading: true
            };
        case taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_SUCCESS:
            return {
                ...state,
                responsibleTasks: action.payload.tasks,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_ACCOUNTABLE_BYUSER_REQUEST:
            return {
                ...state,
                accountableTasks: null,
                tasks: null,
                pages: null,
                loadingAccountable: true,
                isLoading: true
            };
        case taskManagementConstants.GETTASK_ACCOUNTABLE_BYUSER_SUCCESS:
            return {
                ...state,
                accountableTasks: action.payload.tasks,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                loadingAccountable: false,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_ACCOUNTABLE_BYUSER_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_CONSULTED_BYUSER_REQUEST:
            return {
                ...state,
                consultedTasks: null,
                tasks: null,
                pages: null,
                loadingConsulted: true,
                isLoading: true
            };
        case taskManagementConstants.GETTASK_CONSULTED_BYUSER_SUCCESS:
            return {
                ...state,
                consultedTasks: action.payload.tasks,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_CONSULTED_BYUSER_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_INFORMED_BYUSER_REQUEST:
            return {
                ...state,
                informedTasks: null,
                tasks: null,
                pages: null,
                loadingInformed: true,
                isLoading: true
            };
        case taskManagementConstants.GETTASK_INFORMED_BYUSER_SUCCESS:
            return {
                ...state,
                informedTasks: action.payload.tasks,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_INFORMED_BYUSER_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_CREATOR_BYUSER_REQUEST:
            return {
                ...state,
                creatorTasks: null,
                tasks: null,
                pages: null,
                loadingCreator: true,
                isLoading: true
            };
        case taskManagementConstants.GETTASK_CREATOR_BYUSER_SUCCESS:
            return {
                ...state,
                creatorTasks: action.payload.tasks,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_CREATOR_BYUSER_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.ADDNEW_TASK_REQUEST:
            return {
                ...state,
                adding: true,
                isLoading: false
            };
        case taskManagementConstants.GET_PAGINATE_TASK_BYUSER_REQUEST:
            if (action.calledId) {
                return {
                    ...state,
                    isLoading: true
                };
            }
            return {
                ...state,
                tasks: null,
                pages: null,
                isLoading: true
            }

        case taskManagementConstants.GET_PAGINATE_TASK_BYUSER_SUCCESS:
            if (action.calledId === 'listSearch') {
                return {
                    ...state,
                    listSearchTasks: action.payload.tasks,
                    isLoading: false
                };
            }
            return {
                ...state,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                isLoading: false
            };
        case taskManagementConstants.GET_PAGINATE_TASK_BYUSER_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GET_PAGINATE_TASK_BY_ORGANIZATIONALUNIT_REQUEST:
            return {
                ...state,
                tasks: null,
                pages: null,
                isLoading: true
            }
        case taskManagementConstants.GET_PAGINATE_TASK_BY_ORGANIZATIONALUNIT_SUCCESS:
            return {
                ...state,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                isLoading: false
            };
        case taskManagementConstants.GET_PAGINATE_TASK_BY_ORGANIZATIONALUNIT_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.ADDNEW_TASK_REQUEST:
            return {
                ...state,
                adding: true,
                isLoading: false
            };
        case taskManagementConstants.ADDNEW_TASK_SUCCESS:
            return {
                ...state,
                tasks: [
                    ...state.tasks,
                    action.payload
                ],
                isLoading: false
            };
        case taskManagementConstants.ADDNEW_TASK_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        // case taskManagementConstants.EDIT_TASK_REQUEST:
        //     return {
        //         ...state,
        //         items: state.items.map(task =>
        //             task._id === action.id
        //                 ? { ...task, editing: true }
        //                 : task
        //         ),
        //         isLoading: false
        //     };
        // case taskManagementConstants.EDIT_TASK_SUCCESS:

        // console.log(action.payload)
        //     return {
        //         ...state,
        //         tasks: state.tasks.map(task =>
        //             task._id === action.payload.info._id
        //                 ? action.payload.info : task
        //         ),
        //         task: action.payload,
        //         isLoading: false
        //     };
        // case taskManagementConstants.EDIT_TASK_FAILURE:
        //     return {
        //         error: action.error,
        //         isLoading: false
        //     };
        case taskManagementConstants.EDIT_STATUS_OF_TASK_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case taskManagementConstants.EDIT_STATUS_OF_TASK_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case taskManagementConstants.EDIT_STATUS_OF_TASK_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };

        case taskManagementConstants.EDIT_ARCHIVED_STATUS_OF_TASK_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case taskManagementConstants.EDIT_ARCHIVED_STATUS_OF_TASK_SUCCESS:
            return {
                ...state,
                isLoading: false,
                tasks: state.tasks.filter(task => task._id !== action.payload._id),
            };

        case taskManagementConstants.EDIT_ARCHIVED_STATUS_OF_TASK_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };

        case taskManagementConstants.DELETE_TASK_REQUEST:
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task._id === action.id
                        ? { ...task, deleting: true }
                        : task
                ),
                isLoading: false
            };
        case taskManagementConstants.DELETE_TASK_SUCCESS:
            return {
                ...state,
                tasks: state.tasks.filter(task => task._id !== action.id),
                isLoading: false
            };
        case taskManagementConstants.DELETE_TASK_FAILURE:
            return {
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GET_SUBTASK_REQUEST:
            return {
                ...state,
                subtasks: null,
                isLoading: true
            };
        case taskManagementConstants.GET_SUBTASK_SUCCESS:
            return {
                ...state,
                subtasks: action.payload,
                isLoading: false
            };
        case taskManagementConstants.GET_SUBTASK_FAILURE:
            return {
                error: action.error,
                isLoading: false
            }
        case taskManagementConstants.EDIT_TASK_BY_ACCOUNTABLE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case taskManagementConstants.EDIT_TASK_BY_ACCOUNTABLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case taskManagementConstants.EDIT_TASK_BY_ACCOUNTABLE_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case taskManagementConstants.EDIT_TASK_BY_RESPONSIBLE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case taskManagementConstants.EDIT_TASK_BY_RESPONSIBLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case taskManagementConstants.EDIT_TASK_BY_RESPONSIBLE_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case taskManagementConstants.EVALUATE_TASK_BY_ACCOUNTABLE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case taskManagementConstants.EVALUATE_TASK_BY_ACCOUNTABLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case taskManagementConstants.EVALUATE_TASK_BY_ACCOUNTABLE_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case taskManagementConstants.EVALUATE_TASK_BY_RESPONSIBLE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case taskManagementConstants.EVALUATE_TASK_BY_RESPONSIBLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case taskManagementConstants.EVALUATE_TASK_BY_RESPONSIBLE_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case taskManagementConstants.EVALUATE_TASK_BY_CONSULTED_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case taskManagementConstants.EVALUATE_TASK_BY_CONSULTED_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case taskManagementConstants.EVALUATE_TASK_BY_CONSULTED_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case taskManagementConstants.GET_TASK_BY_USER_REQUEST:
            return {
                ...state,
                tasksbyuser: null,
                isLoading: true
            };
        case taskManagementConstants.GET_TASK_BY_USER_SUCCESS:
            return {
                ...state,
                tasksbyuser: action.payload,
                isLoading: false
            };
        case taskManagementConstants.GET_TASK_BY_USER_FAILURE:
            return {
                error: action.error,
                isLoading: false
            }

        case taskManagementConstants.GET_TASK_EVALUATION_REQUEST:
            return {
                ...state,
                listTaskEvaluations: null,
                isLoading: true
            };
        case taskManagementConstants.GET_TASK_EVALUATION_SUCCESS:
            return {
                ...state,
                listTaskEvaluations: action.payload,
                isLoading: false,
            };
        case taskManagementConstants.GET_TASK_EVALUATION_FAILURE:
            return {
                isLoading: false,
                error: action.error,

            }

        case taskManagementConstants.GET_TASK_IN_ORGANIZATION_UNIT_REQUEST:
            return {
                ...state,
                organizationUnitTasks: null,
                isLoading: true
            };
        case taskManagementConstants.GET_TASK_IN_ORGANIZATION_UNIT_SUCCESS:
            return {
                ...state,
                organizationUnitTasks: action.payload,
                isLoading: false,
            };
        case taskManagementConstants.GET_TASK_IN_ORGANIZATION_UNIT_FAILURE:
            return {
                isLoading: false,
                error: action.error,

            }
        default:
            return state
    }
}
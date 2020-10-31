import {
    WorkPlanConstants
} from './constants';

const initState = {
    listWorkPlan: [],
    maximumNumberOfLeaveDays: 0,
    isLoading: false,
    importWorkPlan: [],
    importStatus: false,
    error: "",
}

export function workPlan(state = initState, action) {
    switch (action.type) {
        case WorkPlanConstants.GET_WORK_PLAN_REQUEST:
        case WorkPlanConstants.CREATE_WORK_PLAN_REQUEST:
        case WorkPlanConstants.DELETE_WORK_PLAN_REQUEST:
        case WorkPlanConstants.UPDATE_WORK_PLAN_REQUEST:
        case WorkPlanConstants.IMPORT_WORK_PLAN_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case WorkPlanConstants.GET_WORK_PLAN_SUCCESS:
            return {
                ...state,
                listWorkPlan: action.payload.workPlans,
                maximumNumberOfLeaveDays: action.payload.maximumNumberOfLeaveDays,
                    isLoading: false,
            };
        case WorkPlanConstants.CREATE_WORK_PLAN_SUCCESS:
            return {
                ...state,
                listWorkPlan: [
                        ...state.listWorkPlan,
                        action.payload
                    ],
                    isLoading: false,
            };
        case WorkPlanConstants.DELETE_WORK_PLAN_SUCCESS:
            return {
                ...state,
                listWorkPlan: state.listWorkPlan.filter(workPlan => (workPlan._id !== action.payload._id)),
                    isLoading: false,
            };
        case WorkPlanConstants.UPDATE_WORK_PLAN_SUCCESS:
            if (action.payload.workPlan) {
                return {
                    ...state,
                    listWorkPlan: state.listWorkPlan.map(workPlan =>
                        (workPlan._id === action.payload.workPlan._id) ?
                        action.payload.workPlan : workPlan
                    ),
                    isLoading: false,
                };
            } else {
                return {
                    ...state,
                    maximumNumberOfLeaveDays: action.payload.maximumNumberOfLeaveDays,
                    isLoading: false,
                };
            };
        case WorkPlanConstants.IMPORT_WORK_PLAN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    importStatus: true,
                    listWorkPlan: action.payload.content,
            }
            case WorkPlanConstants.GET_WORK_PLAN_FAILURE:
            case WorkPlanConstants.CREATE_WORK_PLAN_FAILURE:
            case WorkPlanConstants.DELETE_WORK_PLAN_FAILURE:
            case WorkPlanConstants.UPDATE_WORK_PLAN_FAILURE:
            case WorkPlanConstants.IMPORT_WORK_PLAN_FAILURE:
                return {
                    ...state,
                    isLoading: false,
                        error: action.error
                };
            default:
                return state
    }
}
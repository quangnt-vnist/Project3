import { planConstants } from './constants';

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}

const initialState = {
    lists: [],
    isLoading: true,
    error: null,
    totalList: 0,
}

export function plan(state = initialState, action) {
    let index = -1;
    switch (action.type) {
        case planConstants.GET_ALL_PLANS_REQUEST:
        case planConstants.DELETE_PLAN_REQUEST:
        case planConstants.CREATE_PLAN_REQUEST:
        case planConstants.EDIT_PLAN_REQUEST:
        case planConstants.GET_DETAIL_PLAN_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case planConstants.GET_ALL_PLANS_FAILURE:
        case planConstants.DELETE_PLAN_FAILURE:
        case planConstants.CREATE_PLAN_FAILURE:
        case planConstants.EDIT_PLAN_FAILURE:
        case planConstants.GET_DETAIL_PLAN_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case planConstants.GET_ALL_PLANS_SUCCESS:
            return {
                ...state,
                lists: action.payload.content.data,
                totalList: action.payload.content.totalList,
                isLoading: false
            }
        case planConstants.DELETE_PLAN_SUCCESS:
            return {
                ...state,
                lists: state.lists.filter(plan => (plan._id !== action.payload.content._id)),
                isLoading: false
            }
        case planConstants.CREATE_PLAN_SUCCESS:
            return {
                ...state,
                isLoading: false,
            }
        case planConstants.EDIT_PLAN_SUCCESS:
            index = findIndex(state.lists, action.payload.content.plan._id);
            if (index !== -1) {
                state.lists[index] = action.payload.content.plan
            }
            return {
                ...state,
                isLoading: false
            }
        case planConstants.GET_DETAIL_PLAN_SUCCESS:
            return {
                ...state,
                currentDetailPlan: action.payload.content.plan,
                isLoading: false
            }
        default:
            return state
    }
}
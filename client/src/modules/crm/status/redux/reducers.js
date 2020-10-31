import { CrmStatusConstants } from "./constants";

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}

const initState = {
    list: [],
    totalDocs: 0,
    isLoading: true,
}

export function status(state = initState, action) {

    switch (action.type) {
        case CrmStatusConstants.GET_CRM_STATUS_REQUEST:
        case CrmStatusConstants.GET_CRM_STATUS_BY_ID_REQUEST:
        case CrmStatusConstants.CREATE_CRM_STATUS_REQUEST:
        case CrmStatusConstants.EDIT_CRM_STATUS_REQUEST:
        case CrmStatusConstants.DELETE_CRM_STATUS_SUCCESS:

            return {
                ...state,
                isLoading: true
            }

        case CrmStatusConstants.GET_CRM_STATUS_FAILE:
        case CrmStatusConstants.GET_CRM_STATUS_BY_ID_FAILE:
        case CrmStatusConstants.CREATE_CRM_STATUS_FAILE:
        case CrmStatusConstants.EDIT_CRM_STATUS_FAILE:
        case CrmStatusConstants.DELETE_CRM_STATUS_FAILE:

            return {
                ...state,
                isLoading: false
            }

        case CrmStatusConstants.GET_CRM_STATUS_SUCCESS:
            return {
                ...state,
                list: action.payload.listStatus,
                totalDocs: action.payload.listStatusTotal,
                isLoading: false
            };

        case CrmStatusConstants.GET_CRM_STATUS_BY_ID_SUCCESS:
            return {
                ...state,
                statusById: action.payload,
                isLoading: false
            };

        case CrmStatusConstants.CREATE_CRM_STATUS_SUCCESS:
            return {
                ...state,
                list: [action.payload, ...state.list],
                isLoading: false
            };

        case CrmStatusConstants.EDIT_CRM_STATUS_SUCCESS:
            return {
                ...state,
                list: state.list.map(o => ((o._id === action.payload._id) ? action.payload : o)),
                isLoading: false
            };

        case CrmStatusConstants.DELETE_CRM_STATUS_SUCCESS:
            return {
                ...state,
                list: state.list.filter(o => (o._id !== action.payload._id)),
                isLoading: false
            };

        default:
            return state;
    }
}
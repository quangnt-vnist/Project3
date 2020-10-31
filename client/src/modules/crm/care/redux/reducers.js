import { CrmCareConstants } from "./constants";

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

export function cares(state = initState, action) {

    switch (action.type) {
        case CrmCareConstants.GET_CRM_CARES_REQUEST:
        case CrmCareConstants.CREATE_CRM_CARE_REQUEST:
        case CrmCareConstants.GET_CRM_CARE_REQUEST:
        case CrmCareConstants.EDIT_CRM_CARE_REQUEST:
        case CrmCareConstants.DELETE_CRM_CARE_REQUEST:

            return {
                ...state,
                isLoading: true
            }

        case CrmCareConstants.GET_CRM_CARES_FAILE:
        case CrmCareConstants.CREATE_CRM_CARE_FAILE:
        case CrmCareConstants.GET_CRM_CARE_FAILE:
        case CrmCareConstants.EDIT_CRM_CARE_FAILE:
        case CrmCareConstants.DELETE_CRM_CARE_FAILE:
            return {
                ...state,
                isLoading: false
            }

        case CrmCareConstants.GET_CRM_CARES_SUCCESS:
            return {
                ...state,
                list: action.payload.cares,
                totalDocs: action.payload.listDocsTotal,
                isLoading: false
            };

        case CrmCareConstants.GET_CRM_CARE_SUCCESS:
            return {
                ...state,
                careById: action.payload,
                isLoading: false,
            };

        case CrmCareConstants.CREATE_CRM_CARE_SUCCESS:
            return {
                ...state,
                list: [action.payload, ...state.list],
                isLoading: false
            };

        case CrmCareConstants.EDIT_CRM_CARE_SUCCESS:
            return {
                ...state,
                list: state.list.map(o => ((o._id === action.payload._id) ? action.payload : o)),
                isLoading: false
            };

        case CrmCareConstants.DELETE_CRM_CARE_SUCCESS:
            return {
                ...state,
                list: state.list.filter(o => (o._id !== action.payload._id)),
                isLoading: false
            };

        default:
            return state;
    }
}
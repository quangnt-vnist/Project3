import { CrmCareTypeConstants } from "./constants";

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

export function careTypes(state = initState, action) {

    switch (action.type) {
        case CrmCareTypeConstants.GET_CRM_CARETYPES_REQUEST:
        case CrmCareTypeConstants.CREATE_CRM_CARETYPE_REQUEST:
        case CrmCareTypeConstants.GET_CRM_CARETYPE_REQUEST:
        case CrmCareTypeConstants.EDIT_CRM_CARETYPE_REQUEST:
        case CrmCareTypeConstants.DELETE_CRM_CARETYPE_REQUEST:

            return {
                ...state,
                isLoading: true
            }

        case CrmCareTypeConstants.GET_CRM_CARETYPES_FAILE:
        case CrmCareTypeConstants.CREATE_CRM_CARETYPE_FAILE:
        case CrmCareTypeConstants.GET_CRM_CARETYPE_FAILE:
        case CrmCareTypeConstants.EDIT_CRM_CARETYPE_FAILE:
        case CrmCareTypeConstants.DELETE_CRM_CARETYPE_FAILE:
            return {
                ...state,
                isLoading: false
            }

        case CrmCareTypeConstants.GET_CRM_CARETYPES_SUCCESS:
            return {
                ...state,
                list: action.payload.careTypes,
                totalDocs: action.payload.listDocsTotal,
                isLoading: false
            };

        case CrmCareTypeConstants.GET_CRM_CARETYPE_SUCCESS:
            return {
                ...state,
                careTypeById: action.payload,
                isLoading: false,
            };

        case CrmCareTypeConstants.CREATE_CRM_CARETYPE_SUCCESS:
            return {
                ...state,
                list: [action.payload, ...state.list],
                isLoading: false
            };

        case CrmCareTypeConstants.EDIT_CRM_CARETYPE_SUCCESS:
            return {
                ...state,
                list: state.list.map(o => ((o._id === action.payload._id) ? action.payload : o)),
                isLoading: false
            };

        case CrmCareTypeConstants.DELETE_CRM_CARETYPE_SUCCESS:
            return {
                ...state,
                list: state.list.filter(o => (o._id !== action.payload._id)),
                isLoading: false
            };

        default:
            return state;
    }
}
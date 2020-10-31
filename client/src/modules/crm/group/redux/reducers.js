import { CrmGroupConstants } from "./constants";

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

export function groups(state = initState, action) {

    switch (action.type) {
        case CrmGroupConstants.GET_CRM_GROUPS_REQUEST:
        case CrmGroupConstants.CREATE_CRM_GROUP_REQUEST:
        case CrmGroupConstants.GET_CRM_GROUP_REQUEST:
        case CrmGroupConstants.EDIT_CRM_GROUP_REQUEST:
        case CrmGroupConstants.DELETE_CRM_GROUP_REQUEST:

            return {
                ...state,
                isLoading: true
            }

        case CrmGroupConstants.GET_CRM_GROUPS_FAILE:
        case CrmGroupConstants.CREATE_CRM_GROUP_FAILE:
        case CrmGroupConstants.GET_CRM_GROUP_FAILE:
        case CrmGroupConstants.EDIT_CRM_GROUP_FAILE:
        case CrmGroupConstants.DELETE_CRM_GROUP_FAILE:

            return {
                ...state,
                isLoading: false
            }

        case CrmGroupConstants.GET_CRM_GROUPS_SUCCESS:
            return {
                ...state,
                list: action.payload.groups,
                totalDocs: action.payload.listGroupTotal,
                isLoading: false
            };

        case CrmGroupConstants.GET_CRM_GROUP_SUCCESS:
            return {
                ...state,
                groupById: action.payload,
                isLoading: false
            };

        case CrmGroupConstants.CREATE_CRM_GROUP_SUCCESS:
            return {
                ...state,
                list: [action.payload, ...state.list],
                isLoading: false
            };

        case CrmGroupConstants.EDIT_CRM_GROUP_SUCCESS:
            return {
                ...state,
                list: state.list.map(gr => ((gr._id === action.payload._id) ? action.payload : gr)),
                isLoading: false
            };

        case CrmGroupConstants.DELETE_CRM_GROUP_SUCCESS:
            return {
                ...state,
                list: state.list.filter(gr => (gr._id !== action.payload._id)),
                isLoading: false
            };

        default:
            return state;
    }
}
import {
    Constants
} from './constants';
const initState = {
    isLoading: false,
    employees: "",
    salaries: "",
    annualLeaves: "",
    commendations: "",
    disciplines: "",
    roles: "",
    courses: "",
    organizationalUnits: "",
    infoEmployeeUpdate: "",
    error: ""
}

export function employeesInfo(state = initState, action) {
    switch (action.type) {
        case Constants.GET_PERSONAL_INFOR_REQUEST:
        case Constants.UPDATE_PERSONAL_INFOR_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case Constants.GET_PERSONAL_INFOR_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    employees: action.payload.employees,
                    salaries: action.payload.salaries,
                    annualLeaves: action.payload.annualLeaves,
                    commendations: action.payload.commendations,
                    disciplines: action.payload.disciplines,
                    courses: action.payload.courses,
                    roles: action.payload.roles,
                    organizationalUnits: action.payload.organizationalUnits

            };
        case Constants.UPDATE_PERSONAL_INFOR_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    infoEmployeeUpdate: action.payload
            };
        case Constants.GET_PERSONAL_INFOR_FAILURE:
            return {
                ...state,
                isLoading: false,
                    error: action.error.message
            };
        case Constants.UPDATE_PERSONAL_INFOR_FAILURE:
            return {
                ...state,
                isLoading: false,
                    error: action.error
            };
        default:
            return state
    }
}
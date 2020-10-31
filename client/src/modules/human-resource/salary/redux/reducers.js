import {
    SalaryConstants
} from './constants';

const initState = {
    isLoading: false,
    listSalaryByMonthAndOrganizationalUnits: [],
    listSalaryByMonth: [],
    listSalarys: [],
    totalList: 0,

    importSalary: [],
    importStatus: false,
    error: "",
}

export function salary(state = initState, action) {
    switch (action.type) {
        case SalaryConstants.GET_SALARY_REQUEST:
        case SalaryConstants.CREATE_SALARY_REQUEST:
        case SalaryConstants.UPDATE_SALARY_REQUEST:
        case SalaryConstants.DELETE_SALARY_REQUEST:
        case SalaryConstants.IMPORT_SALARY_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case SalaryConstants.GET_SALARY_SUCCESS:
            if (action.callApiDashboard) {
                if (action.organizationalUnits !== undefined) {
                    return {
                        ...state,
                        isLoading: false,
                        listSalaryByMonthAndOrganizationalUnits: action.payload,
                    };
                } else {
                    return {
                        ...state,
                        isLoading: false,
                        listSalaryByMonth: action.payload,
                    };
                }
            } else {
                return {
                    ...state,
                    isLoading: false,
                    listSalarys: action.payload.listSalarys,
                    totalList: action.payload.totalList,
                };
            };
        case SalaryConstants.CREATE_SALARY_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listSalarys: [
                        ...state.listSalarys,
                        action.payload
                    ],
            };
        case SalaryConstants.UPDATE_SALARY_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listSalarys: state.listSalarys.map(salary => salary._id === action.payload._id ? action.payload : salary)
            };
        case SalaryConstants.DELETE_SALARY_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listSalarys: state.listSalarys.filter(salary => (salary._id !== action.payload._id)),
            };
        case SalaryConstants.IMPORT_SALARY_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    importStatus: true,
                    importSalary: action.payload.content,
                    error: ""
            };
        case SalaryConstants.GET_SALARY_FAILURE:
        case SalaryConstants.CREATE_SALARY_FAILURE:
        case SalaryConstants.UPDATE_SALARY_FAILURE:
        case SalaryConstants.DELETE_SALARY_FAILURE:
        case SalaryConstants.IMPORT_SALARY_FAILURE:
            return {
                ...state,
                isLoading: false,
                    error: action.error
            };

        default:
            return state
    }
}
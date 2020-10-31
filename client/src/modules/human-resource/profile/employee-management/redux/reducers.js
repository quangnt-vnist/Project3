import {
    EmployeeConstants
} from './constants';
const initState = {
    isLoading: false,
    exportData: [],

    totalList: 0,
    expiresContract: 0,
    employeesHaveBirthdateInCurrentMonth: 0,
    totalEmployeeOfOrganizationalUnits: 0,
    totalAllEmployee: 0,

    arrMonth: [],
    totalEmployees: [],
    listEmployeesHaveStartingDateOfNumberMonth: [],
    listEmployeesHaveLeavingDateOfNumberMonth: [],
    listEmployees: [],
    listEmployeesOfOrganizationalUnits: [],
    listAllEmployees: [],
    error: '',
}
export function employeesManager(state = initState, action) {
    switch (action.type) {
        case EmployeeConstants.GETALL_REQUEST:
        case EmployeeConstants.ADDEMPLOYEE_REQUEST:
        case EmployeeConstants.UPDATE_INFOR_EMPLOYEE_REQUEST:
        case EmployeeConstants.DELETE_EMPLOYEE_REQUEST:
        case EmployeeConstants.IMPORT_EMPLOYEE_REQUEST:
            return {
                ...state,
                isLoading: true,
                    exportData: [],
                    arrMonth: [],
            };
        case EmployeeConstants.GETALL_SUCCESS:
            if (action.exportData) {
                return {
                    ...state,
                    exportData: action.payload,
                    isLoading: false
                }
            } else if (action.payload.arrMonth) {
                return {
                    ...state,
                    arrMonth: action.payload.arrMonth,
                    totalEmployees: action.payload.totalEmployees,
                    listEmployeesHaveStartingDateOfNumberMonth: action.payload.listEmployeesHaveStartingDateOfNumberMonth,
                    listEmployeesHaveLeavingDateOfNumberMonth: action.payload.listEmployeesHaveLeavingDateOfNumberMonth,
                    isLoading: false
                }
            } else if (action.payload.totalList !== undefined) { // Phải để khác undefined
                return {
                    ...state,
                    listEmployees: action.payload.listEmployees,
                    totalList: action.payload.totalList,
                    expiresContract: action.payload.expiresContract,
                    employeesHaveBirthdateInCurrentMonth: action.payload.employeesHaveBirthdateInCurrentMonth,
                    isLoading: false
                };
            } else {
                return {
                    ...state,
                    totalEmployeeOfOrganizationalUnits: action.payload.totalEmployee !== undefined ?
                        action.payload.totalEmployee : state.totalEmployeeOfOrganizationalUnits,

                    listEmployeesOfOrganizationalUnits: action.payload.listEmployeesOfOrganizationalUnits !== undefined ?
                        action.payload.listEmployeesOfOrganizationalUnits : state.listEmployeesOfOrganizationalUnits,

                    totalAllEmployee: action.payload.totalAllEmployee !== undefined ?
                        action.payload.totalAllEmployee : state.totalAllEmployee,

                    listAllEmployees: action.payload.listAllEmployees !== undefined ?
                        action.payload.listAllEmployees : state.listAllEmployees,

                    isLoading: false
                }
            };
        case EmployeeConstants.ADDEMPLOYEE_SUCCESS:
            return {
                ...state,
                listEmployees: [...state.listEmployees, action.payload],
                    isLoading: false
            };
        case EmployeeConstants.UPDATE_INFOR_EMPLOYEE_SUCCESS:
            return {
                ...state,
                listEmployees: state.listEmployees.map(x => x._id === action.payload._id ? action.payload : x),
                    isLoading: false
            };
        case EmployeeConstants.DELETE_EMPLOYEE_SUCCESS:
            return {
                ...state,
                listEmployees: state.listEmployees.filter(x => (x._id !== action.payload._id)),
                    isLoading: false,
            };
        case EmployeeConstants.IMPORT_EMPLOYEE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    importEmployees: action.payload.content,
                    error: ""
            }
            case EmployeeConstants.GETALL_FAILURE:
            case EmployeeConstants.ADDEMPLOYEE_FAILURE:
            case EmployeeConstants.UPDATE_INFOR_EMPLOYEE_FAILURE:
            case EmployeeConstants.DELETE_EMPLOYEE_FAILURE:
            case EmployeeConstants.IMPORT_EMPLOYEE_FAILURE:
                return {
                    ...state,
                    isLoading: false,
                        error: action.error
                };
            default:
                return state
    }
}
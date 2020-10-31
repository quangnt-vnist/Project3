import { dashboardOrganizationalUnitKpiConstants } from "./constants";

const initState = {
    employeeKpis: null,
    tasks: null,
    organizationalUnitKpiSets: null,
    employeeKpiSets: null,
    organizationalUnitKpiSetsOfChildUnit: null,
    employeeKpisOfChildUnit: null,
    isLoading: false,
    error: null
}

export function dashboardOrganizationalUnitKpi(state = initState, action) {
    switch (action.type) {
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEEKPI_IN_ORGANIZATIONALUNIT_REQUEST:
            return {
                ...state,
                employeeKpis: null,
                loading: true,
                isLoading: false,
                employeeKpisLoading: true
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEEKPI_IN_ORGANIZATIONALUNIT_SUCCESS:
            return {
                ...state,
                loading: false,
                isLoading: false,
                employeeKpisLoading: false,
                employeeKpis: action.payload
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEEKPI_IN_ORGANIZATIONALUNIT_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_ORGANIZATIONALUNIT_REQUEST:
            return {
                ...state,
                tasksOfOrganizationalUnit: null,
                loading: true,
                isLoading: false
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_ORGANIZATIONALUNIT_SUCCESS:
            return {
                ...state,
                loading: false,
                isLoading: false,
                tasksOfOrganizationalUnit: action.payload
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_ORGANIZATIONALUNIT_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_IN_ORGANIZATIONALUNIT_REQUEST:
            return {
                ...state,
                employeeKpiSetsLoading: false,
                employeeKpiSets: null,
                loading: true,
                isLoading: false
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_IN_ORGANIZATIONALUNIT_SUCCESS:
            return {
                ...state,
                employeeKpiSetsLoading: true,
                loading: false,
                isLoading: false,
                employeeKpiSets: action.payload
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEEKPI_IN_CHILDREN_ORGANIZATIONALUNIT_REQUEST:
            return {
                ...state,
                employeeKpiSetsLoading: true,
                employeeKpisOfChildUnit: null,
                loading: true,
                isLoading: false
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEEKPI_IN_CHILDREN_ORGANIZATIONALUNIT_SUCCESS:
            return {
                ...state,
                employeeKpisOfChildUnit: action.payload,
                loading: false,
                isLoading: false
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEEKPI_IN_CHILDREN_ORGANIZATIONALUNIT_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
                isLoading: false
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_CHILDREN_ORGANIZATIONALUNIT_REQUEST:
            return {
                ...state,
                tasksOfChildrenOrganizationalUnit: null,
                loading: true,
                isLoading: false
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_CHILDREN_ORGANIZATIONALUNIT_SUCCESS:
            return {
                ...state,
                tasksOfChildrenOrganizationalUnit: action.payload,
                loading: false,
                isLoading: false
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_CHILDREN_ORGANIZATIONALUNIT_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
                isLoading: false
            }
        
        default:
            return state
    }
}
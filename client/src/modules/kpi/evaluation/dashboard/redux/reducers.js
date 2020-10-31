import { dashboardEmployeeKpiConstants } from "./constants";
 
export function dashboardEvaluationEmployeeKpiSet(state = {}, action) {
  switch (action.type) {
    case  dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ROLE_REQUEST:
      return {
        loading: true,
        isLoading: true
      };

    case dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ROLE_SUCCESS:      
      return {
        ...state,
        loading: false,
        employeeKpiSets: action.payload,
        isLoading: false
      };

    case dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ROLE_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };
      
    case  dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ID_REQUEST:
      return {
        loading: true,
        isLoading: true
      };

    case dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ID_SUCCESS:      
      return {
        ...state,
        loading: false,
        employeeKpiSets: action.payload,
        isLoading: false
      };

    case dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ID_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };

    case  dashboardEmployeeKpiConstants.GET_ALL_CHILDREN_OF_UNIT_REQUEST:
      return {
        ...state,
        childrenOrganizationalUnitLoading: false,
        childrenOrganizationalUnit: null,
        loading: true,
        isLoading: true
      };

    case dashboardEmployeeKpiConstants.GET_ALL_CHILDREN_OF_UNIT_SUCCESS:   
      return {
        ...state,
        childrenOrganizationalUnitLoading: true,
        loading: false,
        childrenOrganizationalUnit: action.payload,
        isLoading: false
      };

    case dashboardEmployeeKpiConstants.GET_ALL_CHILDREN_OF_UNIT_FAILURE:
      return { 
        ...state,
        childrenOrganizationalUnitLoading: true,
        error: action.payload,
        isLoading: false
      };

    default:
      return state
  }
}
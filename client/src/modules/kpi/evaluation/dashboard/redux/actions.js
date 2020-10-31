import {  dashboardEmployeeKpiConstants } from "./constants";
import {  dashboardEmployeeKpiService } from "./services";

export const DashboardEvaluationEmployeeKpiSetAction = {
    getAllEmployeeKpiSetOfUnitByRole,
    getAllEmployeeKpiSetOfUnitByIds,
    getChildrenOfOrganizationalUnitsAsTree
};

/**
 * Lấy tất cả KPI cá nhân theo role
 * @param {*} role 
 */
function getAllEmployeeKpiSetOfUnitByRole(role) {
    return dispatch => {
        dispatch({type: dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ROLE_REQUEST});
 
        dashboardEmployeeKpiService.getAllEmployeeKpiSetOfUnitByRole(role)
            .then(res=>{                
                dispatch({
                    type: dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ROLE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ROLE_FAILURE,
                    payload: error
                })
            })
    };
}
/**
 * Lấy tất cả KPI cá nhân theo mảng id đơn vị
 * @param {*} ids 
 */
function getAllEmployeeKpiSetOfUnitByIds(ids) {
    return dispatch => {
        dispatch({type: dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ID_REQUEST});
 
        dashboardEmployeeKpiService.getAllEmployeeKpiSetOfUnitByIds(ids)
            .then(res=>{                
                dispatch({
                    type: dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ID_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ID_FAILURE,
                    payload: error
                })
            })
    };
}


/**
 * Lấy các đơn vị con của một đơn vị và đơn vị đó
 * @param {*} role 
 */
function getChildrenOfOrganizationalUnitsAsTree(role) {
    return dispatch => {
        dispatch({type: dashboardEmployeeKpiConstants.GET_ALL_CHILDREN_OF_UNIT_REQUEST});
 
        dashboardEmployeeKpiService.getChildrenOfOrganizationalUnitsAsTree(role)
            .then(res=>{ 
                dispatch({
                    type: dashboardEmployeeKpiConstants.GET_ALL_CHILDREN_OF_UNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardEmployeeKpiConstants.GET_ALL_CHILDREN_OF_UNIT_FAILURE,
                    payload: error
                })
            })
    };
}

import { dashboardOrganizationalUnitKpiConstants } from "./constants";
import { dashboardOrganizationalUnitKpiServices } from "./services";


export const dashboardOrganizationalUnitKpiActions = {
    getAllEmployeeKpiInOrganizationalUnit,
    getAllEmployeeKpiInChildrenOrganizationalUnit,
    
    getAllEmployeeKpiSetInOrganizationalUnit,
    
    getAllTaskOfOrganizationalUnit,
    getAllTaskOfChildrenOrganizationalUnit
}

// Lấy tất cả employeeKpi thuộc organizationalUnitKpi hiện tại
function getAllEmployeeKpiInOrganizationalUnit(roleId, organizationalUnitId = undefined, month = undefined) {
    return dispatch => {
        dispatch({ type: dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEEKPI_IN_ORGANIZATIONALUNIT_REQUEST });

        dashboardOrganizationalUnitKpiServices.getAllEmployeeKpiInOrganizationalUnit(roleId, organizationalUnitId, month)
            .then(res => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEEKPI_IN_ORGANIZATIONALUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEEKPI_IN_ORGANIZATIONALUNIT_FAILURE,
                    payload: error
                })
            })
    }
}

// Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng
function getAllEmployeeKpiSetInOrganizationalUnit(roleId, organizationalUnitId, month) {
    return dispatch => {
        dispatch({ type: dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_IN_ORGANIZATIONALUNIT_REQUEST });

        dashboardOrganizationalUnitKpiServices.getAllEmployeeKpiSetInOrganizationalUnit(roleId, organizationalUnitId, month)
            .then(res => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_IN_ORGANIZATIONALUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_IN_ORGANIZATIONALUNIT_FAILURE,
                    payload: error
                })
            })
    }
}

/** Lấy tất cả EmployeeKpis thuộc các đơn vị con của đơn vị hiện tại */
function getAllEmployeeKpiInChildrenOrganizationalUnit(roleId, month, organizationalUnitId) {
    return dispatch => {
        dispatch({ type: dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEEKPI_IN_CHILDREN_ORGANIZATIONALUNIT_REQUEST });

        dashboardOrganizationalUnitKpiServices.getAllEmployeeKpiInChildrenOrganizationalUnit(roleId, month, organizationalUnitId)
            .then(res => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEEKPI_IN_CHILDREN_ORGANIZATIONALUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEEKPI_IN_CHILDREN_ORGANIZATIONALUNIT_FAILURE,
                    payload: error
                })
            })
    }
}

// Lấy tất cả task của organizationalUnit theo tháng hiện tại
function getAllTaskOfOrganizationalUnit(roleId, organizationalUnitId = undefined, month = undefined) {
    return dispatch => {
        dispatch({ type: dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_ORGANIZATIONALUNIT_REQUEST });

        dashboardOrganizationalUnitKpiServices.getAllTaskOfOrganizationalUnit(roleId, organizationalUnitId, month)
            .then(res => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_ORGANIZATIONALUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_ORGANIZATIONALUNIT_FAILURE,
                    payload: error
                })
            })
    }
}

// Lấy tất cả task của các đơn vị con của đơn vị hiện tại
function getAllTaskOfChildrenOrganizationalUnit(roleId, month, organizationalUnitId) {
    return dispatch => {
        dispatch({ type: dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_CHILDREN_ORGANIZATIONALUNIT_REQUEST });

        dashboardOrganizationalUnitKpiServices.getAllTaskOfChildrenOrganizationalUnit(roleId, month, organizationalUnitId)
            .then(res => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_CHILDREN_ORGANIZATIONALUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_CHILDREN_ORGANIZATIONALUNIT_FAILURE,
                    payload: error
                })
            })
    }
}
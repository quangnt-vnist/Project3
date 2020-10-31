import { kpiMemberConstants } from "./constants";
import { kpiMemberServices } from "./services";
export const kpiMemberActions = {
    getEmployeeKPISets,
    getKpisByMonth,
    getKpisByKpiSetId,
    approveAllKpis,
    editKpi,
    editStatusKpi,
    getTaskById,
    setPointKPI,
    setkpiImportantLevel,
    getTaskByListKpis
};
/**
 * Lấy tất cả KPI cá nhân
 */

function getEmployeeKPISets(infosearch) {
    return dispatch => {
        dispatch({ type: kpiMemberConstants.GETALL_KPIMEMBER_OfUNIT_REQUEST });
        kpiMemberServices.getEmployeeKPISets(infosearch)
            .then(res => {
                dispatch({
                    type: kpiMemberConstants.GETALL_KPIMEMBER_OfUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.GETALL_KPIMEMBER_OfUNIT_FAILURE,
                    payload: error
                })
            })
    };
}

/**
 *Lấy KPI cá nhân theo id  
 */
function getKpisByKpiSetId(id) {
    return dispatch => {
        dispatch({ type: kpiMemberConstants.GET_KPIMEMBER_BYID_REQUEST });
        kpiMemberServices.getKpisByKpiSetId(id)
            .then(res => {
                dispatch({
                    type: kpiMemberConstants.GET_KPIMEMBER_BYID_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.GET_KPIMEMBER_BYID_FAILURE,
                    payload: error
                })
            })
    };
}

/**
 * Lấy KPI cá nhân theo id 
 */
function getKpisByMonth(id, time) {
    return dispatch => {
        dispatch({ type: kpiMemberConstants.GET_KPIMEMBER_BYMONTH_REQUEST });

        kpiMemberServices.getKpisByMonth(id, time)
            .then(res => {
                dispatch({
                    type: kpiMemberConstants.GET_KPIMEMBER_BYMONTH_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.GET_KPIMEMBER_BYMONTH_FAILURE,
                    payload: error
                })
            })
    };
}
/**
 *  Phê duyệt toàn bộ KPI cá nhân
 */
function approveAllKpis(id) {
    return dispatch => {
        dispatch({ type: kpiMemberConstants.APPROVE_KPIMEMBER_REQUEST });

        kpiMemberServices.approveAllKpis(id)
            .then(res => {
                dispatch({
                    type: kpiMemberConstants.APPROVE_KPIMEMBER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.APPROVE_KPIMEMBER_FAILURE,
                    payload: error
                })
            })
    };
}
/**
 * Chỉnh sửa mục tiêu KPI cá nhân
 */
function editKpi(id, newTarget) {
    return dispatch => {
        dispatch({ type: kpiMemberConstants.EDITTARGET_KPIMEMBER_REQUEST, id });

        kpiMemberServices.editKpi(id, newTarget)
            .then(res => {
                dispatch({
                    type: kpiMemberConstants.EDITTARGET_KPIMEMBER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.EDITTARGET_KPIMEMBER_FAILURE,
                    payload: error
                })
            })
    };
}

/**
 * Chỉnh sửa trạng thái mục tiêu KPI cá nhân 
 * */
function editStatusKpi(id, status) {
    return dispatch => {
        dispatch({ type: kpiMemberConstants.EDITSTATUS_TARGET_KPIMEMBER_REQUEST });

        kpiMemberServices.editStatusKpi(id, status)
            .then(res => {
                dispatch({
                    type: kpiMemberConstants.EDITSTATUS_TARGET_KPIMEMBER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.EDITSTATUS_TARGET_KPIMEMBER_FAILURE,
                    payload: error
                })
            })
    };
}
/**
 *Lấy danh sách công việc theo id
 */
function getTaskById(id, employeeId, date, type) {
    return dispatch => {
        dispatch({ type: kpiMemberConstants.GET_TASK_BYID_REQUEST });

        kpiMemberServices.getTaskById(id, employeeId, date, type)
            .then(res => {
                dispatch({
                    type: kpiMemberConstants.GET_TASK_BYID_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.GET_TASK_BYID_FAILURE,
                    payload: error
                })
            })
    };
}
/**
 * Chỉnh sửa điểm KPI
 */
function setPointKPI(employeeId, kpiType, data) {
    return dispatch => {
        dispatch({ type: kpiMemberConstants.SET_POINTKPI_REQUEST });

        kpiMemberServices.setPointKPI(employeeId, kpiType, data)
            .then(res => {
                dispatch({
                    type: kpiMemberConstants.SET_POINTKPI_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.SET_POINTKPI_FAILURE,
                    payload: error
                })
            })
    };
}
/**
 * Chỉnh sửa độ quan trọng công việc
 */
function setkpiImportantLevel(id_kpi, date) {
    return dispatch => {
        dispatch({ type: kpiMemberConstants.TASK_IMPORTANT_LEVEL_REQUEST });

        kpiMemberServices.setkpiImportantLevel(id_kpi, date)
            .then(res => {
                dispatch({
                    type: kpiMemberConstants.TASK_IMPORTANT_LEVEL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.TASK_IMPORTANT_LEVEL_FAILURE,
                    payload: error
                })
            })
    };
}

/**
 *Lấy danh sách công việc theo danh sách Kpis
 */
function getTaskByListKpis(listKpis) {
    return dispatch => {
        dispatch({ type: kpiMemberConstants.GET_TASK_BY_LIST_KPI_REQUEST });

        kpiMemberServices.getTaskByListKpis(listKpis)
            .then(res => {
                dispatch({
                    type: kpiMemberConstants.GET_TASK_BY_LIST_KPI_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.GET_TASK_BY_LIST_KPI_FAILURE,
                    payload: error
                })
            })
    };
}

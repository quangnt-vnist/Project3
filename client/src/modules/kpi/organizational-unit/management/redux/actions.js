import { managerConstants } from "./constants";
import { managerServices } from "./services";

export const managerActions = {
    getAllKPIUnit,
    getChildTargetOfCurrentTarget,
    copyKPIUnit,
    calculateKPIUnit,
}

// lấy tất cả các KPI của đơn vị
function getAllKPIUnit(infosearch) {
    return dispatch => {
        dispatch({ type: managerConstants.GETALL_KPIUNIT_REQUEST })
        managerServices.getAllKPIUnit(infosearch)
            .then(res => {
                dispatch({
                    type: managerConstants.GETALL_KPIUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: managerConstants.GETALL_KPIUNIT_FAILURE,
                    payload: error
                })
            })

    };
}

// lấy mục tiêu con của mục tiêu hiện tại
function getChildTargetOfCurrentTarget(kpiId) {
    return dispatch => {
        dispatch({ type: managerConstants.GETCHILDTARGET_CURRENTTARGET_REQUEST });

        managerServices.getChildTargetOfCurrentTarget(kpiId)
            .then(res => {
                dispatch({
                    type: managerConstants.GETCHILDTARGET_CURRENTTARGET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: managerConstants.GETCHILDTARGET_CURRENTTARGET_FAILURE,
                    payload: error
                })
            })
    }
}

function copyKPIUnit(kpiId, data) {
    return dispatch => {
        dispatch({ type: managerConstants.COPY_KPIUNIT_REQUEST });
        managerServices.copyKPIUnit(kpiId, data)
            .then(res => {
                dispatch({
                    type: managerConstants.COPY_KPIUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: managerConstants.COPY_KPIUNIT_FAILURE,
                    payload: error
                })
            })
    }
}

function calculateKPIUnit(idKpiUnitSet, date, idKpiUnit) {
    return dispatch => {
        dispatch({ type: managerConstants.CALCULATE_KPIUNIT_REQUEST })
        managerServices.calculateKPIUnit(idKpiUnitSet, date, idKpiUnit)
            .then(res => {
                dispatch({
                    type: managerConstants.CALCULATE_KPIUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: managerConstants.CALCULATE_KPIUNIT_FAILURE,
                    payload: error
                })
            })

    };
}
import { planConstants } from './constants';
import { planServices } from './services';

export const planActions = {
    getPlans,
    deletePlan,
    createPlan,
    editPlan,
    getDetailPlan
}

function getPlans(queryData) {
    return (dispatch) => {
        dispatch({
            type: planConstants.GET_ALL_PLANS_REQUEST
        });

        planServices
            .getPlans(queryData)
            .then((res) => {
                dispatch({
                    type: planConstants.GET_ALL_PLANS_SUCCESS,
                    payload: res.data
                });
            })
            .catch((error) => {
                dispatch({
                    type: planConstants.GET_ALL_PLANS_FAILURE,
                    error
                })
            });
    }
}

function deletePlan(id) {
    return (dispatch) => {
        dispatch({
            type: planConstants.DELETE_PLAN_REQUEST
        });

        planServices
            .deletePlan(id)
            .then((res) => {
                dispatch({
                    type: planConstants.DELETE_PLAN_SUCCESS,
                    payload: res.data
                });
            })
            .catch((error) => {
                dispatch({
                    type: planConstants.DELETE_PLAN_FAILURE,
                    error
                })
            });
    }
}

function createPlan(data) {
    return (dispatch) => {
        dispatch({
            type: planConstants.CREATE_PLAN_REQUEST
        });
        planServices
            .createPlan(data)
            .then((res) => {
                dispatch({
                    type: planConstants.CREATE_PLAN_SUCCESS,
                    payload: res.data
                })
            })
            .catch((error) => {
                dispatch({
                    type: planConstants.CREATE_PLAN_FAILURE,
                    error
                })
            });
    }
}

function editPlan(id, data) {
    return (dispatch) => {
        dispatch({
            type: planConstants.EDIT_PLAN_REQUEST
        });
        planServices
            .editPlan(id, data)
            .then((res) => {
                dispatch({
                    type: planConstants.EDIT_PLAN_SUCCESS,
                    payload: res.data
                });
            })
            .catch((error) => {
                dispatch({
                    type: planConstants.EDIT_PLAN_FAILURE,
                    error
                });
            });
    }
}

function getDetailPlan(id) {
    return (dispatch) => {
        dispatch({
            type: planConstants.GET_DETAIL_PLAN_REQUEST
        });
        planServices
            .getDetailPlan(id)
            .then((res) => {
                dispatch({
                    type: planConstants.GET_DETAIL_PLAN_SUCCESS,
                    payload: res.data
                });
            })
            .catch((error) => {
                dispatch({
                    type: planConstants.GET_DETAIL_PLAN_FAILURE,
                    error
                });
            });
    }
}
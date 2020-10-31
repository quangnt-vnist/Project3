import { CrmCareServices } from "./services";
import { CrmCareConstants } from "./constants";

export const CrmCareActions = {
    getCares,
    createCare,
    getCare,
    editCare,
    deleteCare,
};

function getCares(data) {
    return dispatch => {
        dispatch({ type: CrmCareConstants.GET_CRM_CARES_REQUEST });
        CrmCareServices.getCares(data)
            .then(res => {
                dispatch({
                    type: CrmCareConstants.GET_CRM_CARES_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmCareConstants.GET_CRM_CARES_FAILE }) })
    }
}

function createCare(data) {
    return dispatch => {
        dispatch({ type: CrmCareConstants.CREATE_CRM_CARE_REQUEST });
        CrmCareServices.createCare(data)
            .then(res => {
                dispatch({
                    type: CrmCareConstants.CREATE_CRM_CARE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmCareConstants.CREATE_CRM_CARE_FAILE }) })
    }
}

function getCare(id) {
    return dispatch => {
        dispatch({ type: CrmCareConstants.GET_CRM_CARE_REQUEST });
        CrmCareServices.getCare(id)
            .then(res => {
                dispatch({
                    type: CrmCareConstants.GET_CRM_CARE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmCareConstants.GET_CRM_CARE_FAILE }) })
    }
}

function editCare(id, data) {
    return dispatch => {
        dispatch({ type: CrmCareConstants.EDIT_CRM_CARE_REQUEST });
        CrmCareServices.editCare(id, data)
            .then(res => {
                dispatch({
                    type: CrmCareConstants.EDIT_CRM_CARE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmCareConstants.EDIT_CRM_CARE_FAILE }) })
    }
}

function deleteCare(id) {
    return dispatch => {
        dispatch({ type: CrmCareConstants.DELETE_CRM_CARE_REQUEST });
        CrmCareServices.deleteCare(id)
            .then(res => {
                dispatch({
                    type: CrmCareConstants.DELETE_CRM_CARE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmCareConstants.DELETE_CRM_CARE_FAILE }) })
    }
}
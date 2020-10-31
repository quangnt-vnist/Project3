import { CrmStatusServices } from "./services";
import { CrmStatusConstants } from "./constants";

export const CrmStatusActions = {
    getStatus,
    getStatusById,
    createStatus,
    editStatus,
    deleteStatus,
};

function getStatus(data) {
    return dispatch => {
        dispatch({ type: CrmStatusConstants.GET_CRM_STATUS_REQUEST });
        CrmStatusServices.getStatus(data)
            .then(res => {
                dispatch({
                    type: CrmStatusConstants.GET_CRM_STATUS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmStatusConstants.GET_CRM_STATUS_FAILE }) })
    }
}

function getStatusById(id) {
    return dispatch => {
        dispatch({ type: CrmStatusConstants.GET_CRM_STATUS_BY_ID_REQUEST });
        CrmStatusServices.getStatusById(id)
            .then(res => {
                dispatch({
                    type: CrmStatusConstants.GET_CRM_STATUS_BY_ID_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmStatusConstants.GET_CRM_STATUS_BY_ID_FAILE }) })
    }
}

function createStatus(data) {
    return dispatch => {
        dispatch({ type: CrmStatusConstants.CREATE_CRM_STATUS_REQUEST });
        CrmStatusServices.createStatus(data)
            .then(res => {
                dispatch({
                    type: CrmStatusConstants.CREATE_CRM_STATUS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmStatusConstants.CREATE_CRM_STATUS_FAILE }) })
    }
}

function editStatus(id, data) {
    return dispatch => {
        dispatch({ type: CrmStatusConstants.EDIT_CRM_STATUS_REQUEST });
        CrmStatusServices.editStatus(id, data)
            .then(res => {
                dispatch({
                    type: CrmStatusConstants.EDIT_CRM_STATUS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmStatusConstants.EDIT_CRM_STATUS_FAILE }) })
    }
}

function deleteStatus(id) {
    return dispatch => {
        dispatch({ type: CrmStatusConstants.DELETE_CRM_STATUS_REQUEST });
        CrmStatusServices.deleteStatus(id)
            .then(res => {
                dispatch({
                    type: CrmStatusConstants.DELETE_CRM_STATUS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmStatusConstants.DELETE_CRM_STATUS_FAILE }) })
    }
}
import { CrmCareTypeServices } from "./services";
import { CrmCareTypeConstants } from "./constants";

export const CrmCareTypeActions = {
    getCareTypes,
    createCareType,
    getCareType,
    editCareType,
    deleteCareType,
};

function getCareTypes(data) {
    return dispatch => {
        dispatch({ type: CrmCareTypeConstants.GET_CRM_CARETYPES_REQUEST });
        CrmCareTypeServices.getCareTypes(data)
            .then(res => {
                dispatch({
                    type: CrmCareTypeConstants.GET_CRM_CARETYPES_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmCareTypeConstants.GET_CRM_CARETYPES_FAILE }) })
    }
}

function createCareType(data) {
    return dispatch => {
        dispatch({ type: CrmCareTypeConstants.CREATE_CRM_CARETYPE_REQUEST });
        CrmCareTypeServices.createCareType(data)
            .then(res => {
                dispatch({
                    type: CrmCareTypeConstants.CREATE_CRM_CARETYPE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmCareTypeConstants.CREATE_CRM_CARETYPE_FAILE }) })
    }
}

function getCareType(id) {
    return dispatch => {
        dispatch({ type: CrmCareTypeConstants.GET_CRM_CARETYPE_REQUEST });
        CrmCareTypeServices.getCareType(id)
            .then(res => {
                dispatch({
                    type: CrmCareTypeConstants.GET_CRM_CARETYPE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmCareTypeConstants.GET_CRM_CARETYPE_FAILE }) })
    }
}

function editCareType(id, data) {
    return dispatch => {
        dispatch({ type: CrmCareTypeConstants.EDIT_CRM_CARETYPE_REQUEST });
        CrmCareTypeServices.editCareType(id, data)
            .then(res => {
                dispatch({
                    type: CrmCareTypeConstants.EDIT_CRM_CARETYPE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmCareTypeConstants.EDIT_CRM_CARETYPE_FAILE }) })
    }
}

function deleteCareType(id) {
    return dispatch => {
        dispatch({ type: CrmCareTypeConstants.DELETE_CRM_CARETYPE_REQUEST });
        CrmCareTypeServices.deleteCareType(id)
            .then(res => {
                dispatch({
                    type: CrmCareTypeConstants.DELETE_CRM_CARETYPE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmCareTypeConstants.DELETE_CRM_CARETYPE_FAILE }) })
    }
}
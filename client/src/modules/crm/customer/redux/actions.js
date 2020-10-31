import { CrmCustomerServices } from "./services";
import { CrmCustomerConstants } from "./constants";

export const CrmCustomerActions = {
    getCustomers,
    createCustomer,
    getCustomer,
    editCustomer,
    deleteCustomer,
};

function getCustomers(data) {
    return dispatch => {
        dispatch({ type: CrmCustomerConstants.GET_CRM_CUSTOMERS_REQUEST });
        CrmCustomerServices.getCustomers(data)
            .then(res => {
                dispatch({
                    type: CrmCustomerConstants.GET_CRM_CUSTOMERS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmCustomerConstants.GET_CRM_CUSTOMERS_FAILE }) })
    }
}

function createCustomer(data) {
    return dispatch => {
        dispatch({ type: CrmCustomerConstants.CREATE_CRM_CUSTOMER_REQUEST });
        CrmCustomerServices.createCustomer(data)
            .then(res => {
                dispatch({
                    type: CrmCustomerConstants.CREATE_CRM_CUSTOMER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmCustomerConstants.CREATE_CRM_CUSTOMER_FAILE }) })
    }
}

function getCustomer(id) {
    return dispatch => {
        dispatch({ type: CrmCustomerConstants.GET_CRM_CUSTOMER_REQUEST });
        CrmCustomerServices.getCustomer(id)
            .then(res => {
                dispatch({
                    type: CrmCustomerConstants.GET_CRM_CUSTOMER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmCustomerConstants.GET_CRM_CUSTOMER_FAILE }) })
    }
}

function editCustomer(id, data) {
    return dispatch => {
        dispatch({ type: CrmCustomerConstants.EDIT_CRM_CUSTOMER_REQUEST });
        CrmCustomerServices.editCustomer(id, data)
            .then(res => {
                dispatch({
                    type: CrmCustomerConstants.EDIT_CRM_CUSTOMER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmCustomerConstants.EDIT_CRM_CUSTOMER_FAILE }) })
    }
}

function deleteCustomer(id) {
    return dispatch => {
        dispatch({ type: CrmCustomerConstants.DELETE_CRM_CUSTOMER_REQUEST });
        CrmCustomerServices.deleteCustomer(id)
            .then(res => {
                dispatch({
                    type: CrmCustomerConstants.DELETE_CRM_CUSTOMER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmCustomerConstants.DELETE_CRM_CUSTOMER_FAILE }) })
    }
}
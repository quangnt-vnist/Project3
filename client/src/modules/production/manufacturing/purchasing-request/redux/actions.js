import { purchasingRequestConstants } from "./constants"
import { purchasingRequestServices } from "./services";

export const purchasingRequestActions = {
    getAllPurchasingRequests,
    createPurchasingRequest
}

function getAllPurchasingRequests(query = {}) {
    return dispatch => {
        dispatch({
            type: purchasingRequestConstants.GET_ALL_PURCHASING_REQUEST_REQUEST
        });
        purchasingRequestServices.getAllPurchasingRequests(query)
            .then((res) => {
                dispatch({
                    type: purchasingRequestConstants.GET_ALL_PURCHASING_REQUEST_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: purchasingRequestConstants.GET_ALL_PURCHASING_REQUEST_FAILURE,
                    error
                });
            });

    }
}

function createPurchasingRequest(data) {
    return dispatch => {
        dispatch({
            type: purchasingRequestConstants.CREATE_PURCHASING_REQUEST_REQUEST
        });
        purchasingRequestServices.createPurchasingRequest(data)
            .then((res) => {
                dispatch({
                    type: purchasingRequestConstants.CREATE_PURCHASING_REQUEST_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: purchasingRequestConstants.CREATE_PURCHASING_REQUEST_FAILURE,
                    error
                });
            });
    }
}
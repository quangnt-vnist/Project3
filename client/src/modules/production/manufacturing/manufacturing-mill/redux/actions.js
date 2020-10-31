import { millConstants } from "./constants"
import { millServices } from "./services";

export const millActions = {
    getAllManufacturingMills,
    createManufacturingMill,
    editManufacturingMill,
    getDetailManufacturingMill
}

function getAllManufacturingMills(query) {
    return dispatch => {
        dispatch({
            type: millConstants.GET_ALL_MANUFACTURING_MILLS_REQUEST
        });
        millServices.getAllManufacturingMills(query)
            .then((res) => {
                dispatch({
                    type: millConstants.GET_ALL_MANUFACTURING_MILLS_SUCCESS,
                    payload: res.data.content
                })
            }).catch((error) => {
                dispatch({
                    type: millConstants.GET_ALL_MANUFACTURING_MILLS_FAILURE,
                    error
                })
            });
    }
}

function createManufacturingMill(data) {
    return dispatch => {
        dispatch({
            type: millConstants.CREATE_MANUFACTURING_MILL_REQUEST
        });
        millServices.createManufacturingMill(data)
            .then((res) => {
                dispatch({
                    type: millConstants.CREATE_MANUFACTURING_MILL_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: millConstants.CREATE_MANUFACTURING_MILL_FAILURE,
                    error
                });
            });
    }
}

function editManufacturingMill(id, data) {
    return dispatch => {
        dispatch({
            type: millConstants.EDIT_MANUFACTURING_MILL_REQUEST
        });
        millServices.editManufacturingMill(id, data)
            .then((res) => {
                dispatch({
                    type: millConstants.EDIT_MANUFACTURING_MILL_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: millConstants.EDIT_MANUFACTURING_MILL_FAILURE,
                    error
                });
            });
    }
}

function getDetailManufacturingMill(id) {
    return dispatch => {
        dispatch({
            type: millConstants.GET_DETAIL_MANUFACTURING_MILL_REQUEST
        });
        millServices.getDetailManufacturingMill(id)
            .then((res) => {
                dispatch({
                    type: millConstants.GET_DETAIL_MANUFACTURING_MILL_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: millConstants.GET_DETAIL_MANUFACTURING_MILL_FAILURE,
                    error
                })
            })
    }
}
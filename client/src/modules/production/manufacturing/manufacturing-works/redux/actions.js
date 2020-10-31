import { formatRange } from '@fullcalendar/react';
import { worksConstants } from './constants';
import { worksServices } from './services';

export const worksActions = {
    getAllManufacturingWorks,
    createManufacturingWorks,
    getDetailManufacturingWorks,
    editManufacturingWorks
}

function getAllManufacturingWorks(queryData = {}) {
    return (dispatch) => {
        dispatch({
            type: worksConstants.GET_ALL_WORKS_REQUEST
        });
        worksServices.getAllManufacturingWorks(queryData)
            .then((res) => {
                dispatch({
                    type: worksConstants.GET_ALL_WORKS_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: worksConstants.GET_ALL_WORKS_FAILURE,
                    error
                });
            });

    }
}

function createManufacturingWorks(data) {
    return (dispatch) => {
        dispatch({
            type: worksConstants.CREATE_WORKS_REQUEST
        });
        worksServices.createManufacturingWorks(data)
            .then((res) => {
                dispatch({
                    type: worksConstants.CREATE_WORKS_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: worksConstants.CREATE_WORKS_FAILURE,
                    error
                });
            });
    }
}

function getDetailManufacturingWorks(id) {
    return (dispatch) => {
        dispatch({
            type: worksConstants.GET_DETAIL_WORKS_REQUEST
        });
        worksServices.getDetailManufacturingWorks(id)
            .then((res) => {
                dispatch({
                    type: worksConstants.GET_DETAIL_WORKS_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: worksConstants.GET_DETAIL_WORKS_FAILURE,
                    error
                })
            });
    }
}

function editManufacturingWorks(id, data) {
    return (dispatch) => {
        dispatch({
            type: worksConstants.UPDATE_WORKS_REQUEST
        });
        worksServices.editManufacturingWorks(id, data)
            .then((res) => {
                dispatch({
                    type: worksConstants.UPDATE_WORKS_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: worksConstants.UPDATE_WORKS_FAILURE,
                    error
                });
            });
    }
}
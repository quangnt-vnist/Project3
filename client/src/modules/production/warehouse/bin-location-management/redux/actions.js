import { BinLocationServices } from './services';
import { BinLocationConstants } from './constants';

export const BinLocationActions = {
    getBinLocations,
    getChildBinLocations,
    getDetailBinLocation,
    createBinLocation,
    editBinLocation,
    deleteBinLocations
}

function getBinLocations(data) {
    if(data === undefined) {
        return dispatch => {
            dispatch({
                type: BinLocationConstants.GET_ALL_BIN_LOCATION_REQUEST
            })
            BinLocationServices.getBinLocations()
            .then(res => {
                dispatch({
                    type: BinLocationConstants.GET_ALL_BIN_LOCATION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch( err => {
                dispatch({
                    type: BinLocationConstants.GET_ALL_BIN_LOCATION_FAILURE,
                    error: err
                })
            })
        }
    } else {
        return dispatch => {
            dispatch({
                type: BinLocationConstants.GET_BIN_LOCATION_STOCK_REQUEST
            })
            BinLocationServices.getBinLocations(data)
            .then(res => {
                dispatch({
                    type: BinLocationConstants.GET_BIN_LOCATION_STOCK_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch( err => {
                dispatch({
                    type: BinLocationConstants.GET_BIN_LOCATION_STOCK_FAILURE,
                    error: err
                })
            })
        }
    }
}

function getChildBinLocations (data){
    if(data.limit !== undefined && data.page !== undefined) {
        return dispatch => {
            dispatch({
                type: BinLocationConstants.GET_PAGINATE_REQUEST
            })
            BinLocationServices.getChildBinLocations(data)
            .then(res => {
                dispatch({
                    type: BinLocationConstants.GET_PAGINATE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: BinLocationConstants.GET_PAGINATE_FAILURE,
                    error: err
                })
            })
        }
    }
    else {
        return dispatch => {
            dispatch({
                type: BinLocationConstants.GET_BIN_LOCATION_CHILD_REQUEST
            })
            BinLocationServices.getChildBinLocations(data)
            .then(res => {
                dispatch({
                    type: BinLocationConstants.GET_BIN_LOCATION_CHILD_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: BinLocationConstants.GET_BIN_LOCATION_CHILD_FAILURE,
                    error: err
                })
            })
        }
    }
}

function getDetailBinLocation(id) {
    return dispatch => {
        dispatch({
            type: BinLocationConstants.GET_DETAIL_BIN_REQUEST
        })
        BinLocationServices.getDetailBinLocation(id)
        .then(res => {
            dispatch({
                type: BinLocationConstants.GET_DETAIL_BIN_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: BinLocationConstants.GET_DETAIL_BIN_FAILURE,
                error: err
            })
        })
    }
}

function createBinLocation(data) {
    return dispatch => {
        dispatch({
            type: BinLocationConstants.CREATE_BIN_LOCATION_REQUEST
        })
        BinLocationServices.createBinLocation(data)
        .then(res => {
            dispatch({
                type: BinLocationConstants.CREATE_BIN_LOCATION_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: BinLocationConstants.CREATE_BIN_LOCATION_FAILURE,
                error: err
            })
        })
    }
}

function editBinLocation(id, data) {
    return dispatch => {
        dispatch({
            type: BinLocationConstants.UPDATE_BIN_LOCATION_REQUEST
        })
        BinLocationServices.editBinLocation(id, data)
        .then(res => {
            dispatch({
                type: BinLocationConstants.UPDATE_BIN_LOCATION_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: BinLocationConstants.UPDATE_BIN_LOCATION_FAILURE,
                error: err
            })
        })
    }
}

function deleteBinLocations(data, type = "single") {
    return dispatch => {
        dispatch({
            type: BinLocationConstants.DELETE_BIN_LOCATION_REQUEST
        })
        if(type !== "single"){
            BinLocationServices.deleteManyBinLocation(data)
            .then(res => {
                dispatch({
                    type: BinLocationConstants.DELETE_BIN_LOCATION_SUCCESS,
                    payload: {
                        list: res.data.content.list,
                        tree: res.data.content.tree
                    }
                })
            })
            .catch(err => {
                dispatch({
                    type: BinLocationConstants.DELETE_BIN_LOCATION_FAILURE,
                    error: err
                })
            })
        }
        else {
            BinLocationServices.deleteBinLocation(data)
            .then(res => {
                dispatch({
                    type: BinLocationConstants.DELETE_BIN_LOCATION_SUCCESS,
                    payload: {
                        list: res.data.content.list,
                        tree: res.data.content.tree
                    }
                })
            })
            .catch(err => {
                dispatch({
                    type: BinLocationConstants.DELETE_BIN_LOCATION_FAILURE,
                    error: err
                })
            })
        }
    }
}
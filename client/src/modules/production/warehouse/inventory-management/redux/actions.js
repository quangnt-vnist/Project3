const { LotServices } = require('./services');
const { LotConstants } = require('./constants');

export const LotActions = {
    getAllLots,
    getDetailLot,
    editLot
}

function getAllLots(data){
    return dispatch => {
        dispatch({
            type: LotConstants.GET_LOT_REQUEST
        })
        LotServices.getAllLots(data)
        .then(res => {
            dispatch({
                type: LotConstants.GET_LOT_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: LotConstants.GET_LOT_FAILURE,
                error: err
            })
        })
    }
}

function getDetailLot(id) {
    return dispatch => {
        dispatch({
            type: LotConstants.GET_LOT_DETAIL_REQUEST
        })
        LotServices.getDetailLot(id)
        .then(res => {
            dispatch({
                type: LotConstants.GET_LOT_DETAIL_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: LotConstants.GET_LOT_DETAIL_FAILURE,
                error: err
            })
        })
    }
}

function editLot(id, data) {
    return dispatch => {
        dispatch({
            type: LotConstants.EDIT_LOT_REQUEST
        })
        LotServices.editLot(id, data)
        .then(res => {
            dispatch({
                type: LotConstants.EDIT_LOT_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: LotConstants.EDIT_LOT_FAILURE,
                error: err
            })
        })
    }
}
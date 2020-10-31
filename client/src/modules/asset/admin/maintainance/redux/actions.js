import {MaintainanceService} from './services';
import {MaintainanceConstants} from './constants';
import {AssetManagerActions} from '../../asset-information/redux/actions';

export const MaintainanceActions = {
    getMaintainances,
    createMaintainance,
    updateMaintainance,
    deleteMaintainance
}

function getMaintainances(data) {
    return async dispatch => {
        try {
            dispatch({
                type: MaintainanceConstants.GET_MAINTAINANCE_REQUEST
            });
            const response = await MaintainanceService.getMaintainances(data);
            dispatch({
                type: MaintainanceConstants.GET_MAINTAINANCE_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: MaintainanceConstants.GET_MAINTAINANCE_FAILURE,
                error: err
            });
        }

    };
}

function createMaintainance(id, data, incident_id) {
    return async dispatch => {
        try {
            dispatch({
                type: MaintainanceConstants.CREATE_MAINTAINANCE_REQUEST
            });
            const response = await MaintainanceService.createMaintainance(id, data, incident_id);
            dispatch({
                type: MaintainanceConstants.CREATE_MAINTAINANCE_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: MaintainanceConstants.CREATE_MAINTAINANCE_FAILURE,
                error: err
            });
        }

    };
}

function updateMaintainance(id, data) {
    return dispatch => {
        dispatch({
            type: MaintainanceConstants.UPDATE_MAINTAINANCE_REQUEST
        });

        MaintainanceService.updateMaintainance(id, data)
            .then(res => {
                dispatch({
                    type: MaintainanceConstants.UPDATE_MAINTAINANCE_SUCCESS,
                    payload: res.data.content
                })
                dispatch(AssetManagerActions.getAllAsset({
                    code: "",
                    assetName: "",
                    assetType: null,
                    month: null,
                    status: "",
                    page: 0,
                    limit: 5,
                }))
            })
            .catch(err => {
                dispatch({
                    type: MaintainanceConstants.UPDATE_MAINTAINANCE_FAILURE,
                    error: err
                });
            })
    };
}

function deleteMaintainance(assetId, maintainanceId) {
    return async dispatch => {
        try {
            dispatch({
                type: MaintainanceConstants.DELETE_MAINTAINANCE_REQUEST
            });
            const response = await MaintainanceService.deleteMaintainance(assetId, maintainanceId);
            dispatch({
                type: MaintainanceConstants.DELETE_MAINTAINANCE_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: MaintainanceConstants.DELETE_MAINTAINANCE_FAILURE,
                error: err
            });
        }

    }
}

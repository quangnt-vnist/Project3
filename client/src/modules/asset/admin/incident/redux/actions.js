import {IncidentService} from './services';
import {IncidentConstants} from './constants';
import {AssetManagerActions} from '../../asset-information/redux/actions';

export const ManageIncidentActions = {
    getIncidents,
    createIncident,
    createMaintainanceForIncident,
    updateIncident,
    deleteIncident,
}

function getIncidents(data) {
    return async dispatch => {
        try {
            dispatch({
                type: IncidentConstants.GET_INCIDENT_REQUEST
            });
            const response = await IncidentService.getIncidents(data);
            dispatch({
                type: IncidentConstants.GET_INCIDENT_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: IncidentConstants.GET_INCIDENT_FAILURE,
                error: err
            });
        }

    };
}

function createIncident(id, data) {
    return async dispatch => {
        try {
            dispatch({
                type: IncidentConstants.CREATE_INCIDENT_REQUEST
            });
            const response = await IncidentService.createIncident(id, data);
            dispatch({
                type: IncidentConstants.CREATE_INCIDENT_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: IncidentConstants.CREATE_INCIDENT_FAILURE,
                error: err
            });
        }

    };
}

function createMaintainanceForIncident(id, data) {
    return async dispatch => {
        try {
            dispatch({
                type: IncidentConstants.CREATE_MAINTAINANCE_FOR_INCIDENT_REQUEST
            });
            const response = await IncidentService.createMaintainanceForIncident(id, data);
            dispatch({
                type: IncidentConstants.CREATE_MAINTAINANCE_FOR_INCIDENT_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: IncidentConstants.CREATE_MAINTAINANCE_FOR_INCIDENT_FAILURE,
                error: err
            });
        }

    };
}

function updateIncident(id, data,managedBy ='') {
    return dispatch => {
        dispatch({
            type: IncidentConstants.UPDATE_INCIDENT_REQUEST
        });

        IncidentService.updateIncident(id, data)
            .then(res => {
                dispatch({
                    type: IncidentConstants.UPDATE_INCIDENT_SUCCESS,
                    payload: res.data.content
                })
                if(managedBy='')
                {
                    dispatch(AssetManagerActions.getAllAsset({
                        code: "",
                        assetName: "",
                        assetType: null,
                        month: null,
                        status: "",
                        page: 0,
                        limit: 5,
                    }))
                }
                else {
                    dispatch(AssetManagerActions.getAllAsset({
                        code: "",
                        assetName: "",
                        assetType: null,
                        month: null,
                        status: "",
                        page: 0,
                        limit: 5,
                        managedBy:managedBy
                    }))
                }
                
            })
            .catch(err => {
                dispatch({
                    type: IncidentConstants.UPDATE_INCIDENT_FAILURE,
                    error: err
                });
            })
    };
}

function deleteIncident(assetId, incidentId) {
    return async dispatch => {
        try {
            dispatch({
                type: IncidentConstants.DELETE_INCIDENT_REQUEST
            });
            const response = await IncidentService.deleteIncident(assetId, incidentId);
            dispatch({
                type: IncidentConstants.DELETE_INCIDENT_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: IncidentConstants.DELETE_INCIDENT_FAILURE,
                error: err
            });
        }

    }
}

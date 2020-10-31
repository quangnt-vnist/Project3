import { SystemServices } from "./services";
import { SystemConstants } from "./constants";

export const SystemActions = {
    getBackups,
    getConfigBackup,
    createBackup,
    configBackup,
    deleteBackup,
    restore
}

function getBackups() {
    return dispatch => {
        dispatch({ type: SystemConstants.GET_BACKUPS_REQUEST });
        SystemServices.getBackups()
        .then(res => {
            dispatch({
                type: SystemConstants.GET_BACKUPS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(error => {
            dispatch({
                type: SystemConstants.GET_BACKUPS_FAILE,
                payload: error
            }) 
        })
    }
}

function getConfigBackup() {
    return dispatch => {
        dispatch({ type: SystemConstants.GET_CONFIG_BACKUP_REQUEST });
        SystemServices.getConfigBackup()
        .then(res => {
            dispatch({
                type: SystemConstants.GET_CONFIG_BACKUP_SUCCESS,
                payload: res.data.content.backup
            })
        })
        .catch(error => {
            dispatch({
                type: SystemConstants.GET_CONFIG_BACKUP_FAILE,
                payload: error
            }) 
        })
    }
}

function deleteBackup(version) {
    return dispatch => {
        dispatch({ type: SystemConstants.DELETE_BACKUP_REQUEST });

        SystemServices.deleteBackup(version)
            .then(res => {
                dispatch({
                    type: SystemConstants.DELETE_BACKUP_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemConstants.DELETE_BACKUP_FAILE,
                    payload: error
                })
                
            })
    }
}

function createBackup() {
    return dispatch => {
        dispatch({ type: SystemConstants.CREATE_BACKUP_REQUEST });

        SystemServices.createBackup()
            .then(res => {
                dispatch({
                    type: SystemConstants.CREATE_BACKUP_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemConstants.CREATE_BACKUP_FAILE,
                    payload: error
                })
                
            })
    }
}

function configBackup(params, data=undefined) {
    return dispatch => {
        dispatch({ type: SystemConstants.CONFIG_BACKUP_REQUEST });

        SystemServices.configBackup(params, data)
            .then(res => {
                dispatch({
                    type: SystemConstants.CONFIG_BACKUP_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemConstants.CONFIG_BACKUP_FAILE,
                    payload: error
                })
                
            })
    }
}

function restore(version) {
    return dispatch => {
        dispatch({ type: SystemConstants.RESTORE_REQUEST });

        SystemServices.restore(version)
            .then(res => {
                dispatch({
                    type: SystemConstants.RESTORE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemConstants.RESTORE_FAILE,
                    payload: error
                })
                
            })
    }
}

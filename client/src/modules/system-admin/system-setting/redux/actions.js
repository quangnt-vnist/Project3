import { SystemSettingServices } from "./services";
import { SystemSettingConstants } from "./constants";

export const SystemSettingActions = {
    getBackups,
    getConfigBackup,
    createBackup,
    configBackup,
    deleteBackup,
    restore
}

function getBackups() {
    return dispatch => {
        dispatch({ type: SystemSettingConstants.GET_BACKUPS_REQUEST });

        SystemSettingServices.getBackups()
        .then(res => {
            dispatch({
                type: SystemSettingConstants.GET_BACKUPS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(error => {
            dispatch({
                type: SystemSettingConstants.GET_BACKUPS_FAILE,
                payload: error
            }) 
        })
    }
}

function getConfigBackup() {
    return dispatch => {
        dispatch({ type: SystemSettingConstants.GET_CONFIG_BACKUP_REQUEST });
        console.log("alaoaoala")
        SystemSettingServices.getConfigBackup()
            .then(res => {
                console.log("FSDFSDFSD", res.data.content.backup)
                dispatch({
                    type: SystemSettingConstants.GET_CONFIG_BACKUP_SUCCESS,
                    payload: res.data.content.backup
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemSettingConstants.GET_CONFIG_BACKUP_FAILE,
                    payload: error
                }) 
            })
    }
}

function deleteBackup(version) {
    return dispatch => {
        dispatch({ type: SystemSettingConstants.DELETE_BACKUP_REQUEST });

        SystemSettingServices.deleteBackup(version)
            .then(res => {
                dispatch({
                    type: SystemSettingConstants.DELETE_BACKUP_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemSettingConstants.DELETE_BACKUP_FAILE,
                    payload: error
                })
                
            })
    }
}

function createBackup() {
    return dispatch => {
        dispatch({ type: SystemSettingConstants.CREATE_BACKUP_REQUEST });

        SystemSettingServices.createBackup()
            .then(res => {
                dispatch({
                    type: SystemSettingConstants.CREATE_BACKUP_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemSettingConstants.CREATE_BACKUP_FAILE,
                    payload: error
                })
                
            })
    }
}

function configBackup(params, data=undefined) {
    return dispatch => {
        dispatch({ type: SystemSettingConstants.CONFIG_BACKUP_REQUEST });

        SystemSettingServices.configBackup(params, data)
            .then(res => {
                dispatch({
                    type: SystemSettingConstants.CONFIG_BACKUP_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemSettingConstants.CONFIG_BACKUP_FAILE,
                    payload: error
                })
                
            })
    }
}

function restore(version) {
    return dispatch => {
        dispatch({ type: SystemSettingConstants.RESTORE_REQUEST });

        SystemSettingServices.restore(version)
            .then(res => {
                dispatch({
                    type: SystemSettingConstants.RESTORE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemSettingConstants.RESTORE_FAILE,
                    payload: error
                })
                
            })
    }
}

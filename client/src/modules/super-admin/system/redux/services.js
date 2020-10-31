import { sendRequest } from '../../../../helpers/requestHelper';

export const SystemServices = {
    getBackups,
    getConfigBackup,
    createBackup,
    configBackup,
    deleteBackup,
    restore
};

function getBackups() {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/system/backup`,
        method: 'GET'
    }, false, true, 'super_admin.system');
}

function getConfigBackup() {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/system/backup/config`,
        method: 'GET'
    }, false, true, 'super_admin.system');
}

function createBackup() {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/system/backup`,
        method: 'POST'
    }, true, true, 'super_admin.system');
}

function configBackup(params, data=undefined) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/system/backup/config`,
        method: 'PATCH',
        params,
        data
    }, true, true, 'super_admin.system');
}

function deleteBackup(version) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/system/backup/${version}`,
        method: 'DELETE'
    }, true, true, 'super_admin.system');
}

function restore(version) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/system/restore/${version}`,
        method: 'PATCH'
    }, true, true, 'super_admin.system');
}
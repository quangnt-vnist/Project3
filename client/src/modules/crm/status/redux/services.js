import { sendRequest } from '../../../../helpers/requestHelper';

export const CrmStatusServices = {
    getStatus,
    createStatus,
    getStatusById,
    editStatus,
    deleteStatus
};

function getStatus(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/status`,
        method: 'GET',
        params,
    }, false, true, 'crm.status');
}

function createStatus(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/status`,
        method: 'POST',
        data
    }, true, true, 'crm.status');
}

function getStatusById(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/status/${id}`,
        method: 'GET'
    }, false, true, 'crm.status');
}

function editStatus(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/status/${id}`,
        method: 'PATCH',
        data
    }, false, true, 'crm.status');
}

function deleteStatus(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/status/${id}`,
        method: 'DELETE'
    }, false, true, 'crm.status');
}
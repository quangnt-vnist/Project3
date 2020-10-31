import { sendRequest } from '../../../../helpers/requestHelper';

export const CrmGroupServices = {
    getGroups,
    createGroup,
    getGroup,
    editGroup,
    deleteGroup
};

function getGroups(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups`,
        method: 'GET',
        params,
    }, false, true, 'crm.group');
}

function createGroup(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups`,
        method: 'POST',
        data
    }, true, true, 'crm.group');
}

function getGroup(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups/${id}`,
        method: 'GET'
    }, false, true, 'group');
}

function editGroup(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups/${id}`,
        method: 'PATCH',
        data
    }, true, true, 'crm.group');
}

function deleteGroup(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups/${id}`,
        method: 'DELETE'
    }, false, true, 'crm.group');
}
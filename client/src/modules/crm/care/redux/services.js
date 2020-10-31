import { sendRequest } from '../../../../helpers/requestHelper';

export const CrmCareServices = {
    getCares,
    createCare,
    getCare,
    editCare,
    deleteCare,
};

function getCares(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/cares`,
        method: 'GET',
        params,
    }, false, true, 'crm.care');
}

function createCare(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/cares`,
        method: 'POST',
        data,
    }, true, true, 'crm.care');
}

function getCare(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/cares/${id}`,
        method: 'GET',
    }, false, true, 'crm.care');
}

function editCare(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/cares/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'crm.care');
}
function deleteCare(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/cares/${id}`,
        method: 'DELETE',
    }, false, true, 'crm.care');
}

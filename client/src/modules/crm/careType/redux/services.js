import { sendRequest } from '../../../../helpers/requestHelper';

export const CrmCareTypeServices = {
    getCareTypes,
    createCareType,
    getCareType,
    editCareType,
    deleteCareType,
};

function getCareTypes(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/careTypes`,
        method: 'GET',
        params,
    }, false, true, 'crm.careType');
}

function createCareType(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/careTypes`,
        method: 'POST',
        data,
    }, true, true, 'crm.careType');
}

function getCareType(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/careTypes/${id}`,
        method: 'GET',
    }, false, true, 'crm.careType');
}

function editCareType(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/careTypes/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'crm.careType');
}
function deleteCareType(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/careTypes/${id}`,
        method: 'DELETE',
    }, false, true, 'crm.careType');
}

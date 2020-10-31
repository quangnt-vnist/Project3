import { sendRequest } from '../../../../helpers/requestHelper';

export const SystemLinkServices = {
    getAllSystemLinks,
    getAllSystemLinkCategories,
    getSystemLink,
    createSystemLink,
    editSystemLink,
    deleteSystemLink
};

function getAllSystemLinks(params) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/system-link/system-links`,
        method: 'GET',
        params
    }, false, true, 'system_admin.system_link')
}

function getSystemLink(systemLinkId) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/system-link/system-links/${systemLinkId}`,
        method: 'GET'
    }, false, true, 'system_admin.system_link');
}

function createSystemLink(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/system-link/system-links`,
        method: 'POST',
        data
    }, true, true, 'system_admin.system_link');
}

function editSystemLink(systemLinkId, data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/system-link/system-links/${systemLinkId}`,
        method: 'PATCH',
        data
    }, true, true, 'system_admin.system_link');
}

function deleteSystemLink(systemLinkId) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/system-link/system-links/${systemLinkId}`,
        method: 'DELETE'
    }, true, true, 'system_admin.system_link');
}

function getAllSystemLinkCategories() {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/system-link/system-links-categories`,
        method: 'GET'
    }, false, true, 'system_admin.system_link');
}
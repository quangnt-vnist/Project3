import { sendRequest } from '../../../../helpers/requestHelper';

export const SystemComponentServices = {
    getAllSystemComponents,
    getSystemComponent,
    createSystemComponent,
    editSystemComponent,
    deleteSystemComponent
};

function getAllSystemComponents(params) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/system-component/system-components`,
        method: 'GET',
        params
    }, false, true, 'system_admin.system_component');
}

function getSystemComponent(systemComponentId) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/system-component/system-components/${systemComponentId}`,
        method: 'GET',
    }, false, true, 'system_admin.system_component');
}

function createSystemComponent(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/system-component/system-components`,
        method: 'POST',
        data,
    }, true, true, 'system_admin.system_component');
}

function editSystemComponent(systemComponentId, data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/system-component/system-components/${systemComponentId}`,
        method: 'PATCH',
        data,
    }, true, true, 'system_admin.system_component');
}

function deleteSystemComponent(systemComponentId, component) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/system-component/system-components/${systemComponentId}`,
        method: 'DELETE',
    }, true, true, 'system_admin.system_component');
}
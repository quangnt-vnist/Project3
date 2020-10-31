import {sendRequest} from '../../../../helpers/requestHelper';

export const ComponentServices = {
    get,
    show,
    create,
    edit,
    destroy
};

function get(params) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/component/components`,
        method: 'GET',
        params
    }, false, true, 'super_admin.component');
}

function show(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/component/components/${id}`,
        method: 'GET',
    }, false, true, 'super_admin.component');
}

function create(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/component/components`,
        method: 'POST',
        data,
    }, true, 'super_admin.component');
}

function edit(id, data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/component/components/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'super_admin.component');
}

function destroy(id, component) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/component/components/${id}`,
        method: 'DELETE',
    }, true, true, 'super_admin.component');
}
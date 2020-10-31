import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const LinkServices = {
    get,
    show,
    create,
    edit,
    destroy,
};

function get(params) {
    console.log("getlinks")
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/link/links`,
        method: 'GET',
        params
    }, false, true, 'super_admin.link');
}

function show(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/link/links/${id}`,
        method: 'GET',
    }, false, true, 'super_admin.link');
}

function create(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/link/links`,
        method: 'POST',
        data,
    }, true, true, 'super_admin.link');
}

function edit(id, data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/link/links/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'super_admin.link');
}

function destroy(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/link/links/${id}`,
        method: 'DELETE',
    }, true, true, 'super_admin.link');
}
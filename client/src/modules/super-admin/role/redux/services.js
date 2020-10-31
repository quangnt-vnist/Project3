import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const RoleServices = {
    get,
    show,
    create,
    edit,
    destroy,
};

function get(params) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/role/roles`,
        method: 'GET',
        params
    }, false, true, 'super_admin.role');
}

function show(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/role/roles/${id}`,
        method: 'GET',
    }, false, true, 'super_admin.role');
}

function create(role) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/role/roles`,
        method: 'POST',
        data: role,
    }, true, true, 'super_admin.role');
}

function edit(role) {
    let showAlert = role.showAlert === undefined ? true : false;
    let editRoleInfo = true;
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/role/roles/${role.id}`,
        method: 'PATCH',
        data: role,
        params:{
            editRoleInfo: role.editRoleInfo!== undefined? role.editRoleInfo: editRoleInfo
        }
    }, showAlert, showAlert, 'super_admin.role');
}

function destroy(roleId) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/role/roles/${roleId}`,
        method: 'DELETE',
    }, true, true, 'super_admin.role');
}
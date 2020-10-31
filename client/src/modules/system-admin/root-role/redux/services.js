import { sendRequest } from '../../../../helpers/requestHelper';

export const RootRoleServices = {
    getAllRootRoles
};

function getAllRootRoles() {  
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/root-role/root-roles`,
        method: 'GET',
    }, false, true, 'system_admin.root_role');
}

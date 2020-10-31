import {
    sendRequest
} from '../../../../helpers/requestHelper';
import {
    getStorage
} from '../../../../config';

export const DepartmentServices = {
    get,
    getDepartmentsThatUserIsDean,
    create,
    edit,
    destroy,
    importDepartment,
};

function get() {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/organizational-units/organizational-units`,
        method: 'GET',
    }, false, true, 'super_admin.organization_unit');
}

function getDepartmentsThatUserIsDean(currentRole) {
    var id = getStorage("userId");

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/organizational-units/organizational-units`,
        method: 'GET',
        params: {
            deanOfOrganizationalUnit: id
        }
    }, false, true, 'super_admin.organization_unit');
}

function create(department) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/organizational-units/organizational-units`,
        method: 'POST',
        data: department,
    }, true, true, 'super_admin.organization_unit');
}

function edit(department) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/organizational-units/organizational-units/${department._id}`,
        method: 'PATCH',
        data: department,
    }, true, true, 'super_admin.organization_unit');
}

function destroy(departmentId) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/organizational-units/organizational-units/${departmentId}`,
        method: 'DELETE',
    }, true, true, 'super_admin.organization_unit');
}

function importDepartment(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/organizational-units/organizational-units/import`,
        method: 'POST',
        data: data,
    }, true, true, 'super_admin.organization_unit');
}
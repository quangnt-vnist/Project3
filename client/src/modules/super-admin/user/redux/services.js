import {
    sendRequest
} from '../../../../helpers/requestHelper';
import {
    getStorage
} from '../../../../config';

export const UserServices = {
    get,
    getRoles,
    getLinkOfRole,
    getAllUserOfCompany,
    getAllUserOfDepartment,
    getAllUserSameDepartment,
    getRoleSameDepartmentOfUser,
    getDepartmentOfUser,
    getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany,
    getAllEmployeeOfUnitByRole,
    getAllEmployeeOfUnitByIds,
    getAllUsersWithRole,
    edit,
    create,
    destroy,
};

function get(params) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/user/users`,
        method: 'GET',
        params,
    }, false, true, 'super_admin.user');
}

/**
 *  Lấy tất cả nhân viên trong đơn vị theo mảng id đơn vị
 * @param {*} ids 
 */
function getAllEmployeeOfUnitByIds(ids) {
    let role = getStorage("currentRole");
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/user/users`,
        method: 'GET',
        params: {
            role: role,
            ids: ids
        }
    }, false, true, 'kpi.evaluation');
}

/**
 * Lấy tất cả nhân viên trong đơn vị theo role
 * @param {*} role 
 */
function getAllEmployeeOfUnitByRole(role) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/user/users`,
        method: 'GET',
        params: {
            role: role
        }
    }, false, true, 'kpi.evaluation');
}

function getRoles() {
    const id = getStorage("userId");
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/roles/${id}`,
        method: 'GET',
    }, false, true, 'super_admin.user');
}

function getLinkOfRole() {
    const currentRole = getStorage("currentRole");
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/links/role/${currentRole}`,
        method: 'GET',
    }, false, true, 'super_admin.user');
}

// Lấy tất cả các vai trò cùng phòng ban với người dùng
function getRoleSameDepartmentOfUser(currentRole) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/role/roles`,
        method: 'GET',
        params: {
            roleId: currentRole,
        }
    }, false, true, 'super_admin.user');
}

// Lấy tất cả nhân viên của công ty
function getAllUserOfCompany() {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/user/users`,
        method: 'GET',
    }, false, true, 'super_admin.user');
}

/** Lấy tất cả nhân viên của một phòng ban hoặc 1 mảng phòng ban kèm theo vai trò của họ */
function getAllUserOfDepartment(id) {
    let params = id;

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/user/users`,
        method: 'GET',
        params: {
            departmentIds: id
        },

    }, false, true, 'super_admin.user');
}

// Lấy tất cả nhân viên của một phòng ban kèm theo vai trò của họ
function getAllUserSameDepartment(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/user/users`,
        method: 'GET',
        params: {
            userRole: id
        },

    }, false, true, 'super_admin.user');
}

function getDepartmentOfUser(data) {
    const id = getStorage("userId");

    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/organizational-units/organizational-units`,
        method: 'GET',
        params: {
            userId: id,
            email: data ? data.email : data,
        }
    }, false, true, 'super_admin.organization_unit');
}

// Get all children of an organizational unit and that organizational unit
function getChildrenOfOrganizationalUnitsAsTree(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/user/users`,
        method: 'GET',
        params: {
            unitId: id
        }
    }, false, true, 'super_admin.user');
}

// Get all user in organizational unit of company
function getAllUserInAllUnitsOfCompany() {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/user/users`,
        method: 'GET',
        params: {
            unitId: -1,
        }
    }, false, true, 'super_admin.user');
}

function edit(id, data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/user/users/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'super_admin.user');
}

function create(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/user/users`,
        method: 'POST',
        data,
    }, true, true, 'super_admin.user');
}

function destroy(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/user/users/${id}`,
        method: 'DELETE',
    }, true, true, 'super_admin.user');
}

function getAllUsersWithRole() {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/user/users/roles/abc`,
        method: 'GET',
    }, false, false, 'super_admin.user');
}
import { getStorage } from '../../../../../config';
import { sendRequest } from '../../../../../helpers/requestHelper';
export const dashboardEmployeeKpiService = {
    getAllEmployeeKpiSetOfUnitByRole,
    getAllEmployeeKpiSetOfUnitByIds,
    getChildrenOfOrganizationalUnitsAsTree
};

/**
 * Lấy tất cả kpi cá nhân của các cá nhân trong đơn vị theo role
 * @param {*} role 
 */
function getAllEmployeeKpiSetOfUnitByRole(role) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/evaluation/employee-evaluation/employee-kpi-sets`,
        method: 'GET',
        params: {
            roleId: role
        }
    }, false, true, 'kpi.evaluation');
}

/**
 *  Lấy tất cả kpi cá nhân của các cá nhân trong đơn vị theo mảng id đơn vị
 * @param {*} ids 
 */
function getAllEmployeeKpiSetOfUnitByIds(ids) {
    let role = getStorage("currentRole");
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/evaluation/dashboard/employee-kpis`,
        method: 'GET',
        params: {
            role: role,
            ids: ids
        }
    }, false, true, 'kpi.evaluation');
}

/**
 * Lấy các đơn vị con của một đơn vị và đơn vị đó
 * @param {*} role 
 */
function getChildrenOfOrganizationalUnitsAsTree(role) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/dashboard/organizational-units/get-children-of-organizational-unit-as-tree`,
        method: 'GET',
        params: {
            role: role
        }
    }, false, true, 'kpi.evaluation');
}
import { sendRequest } from '../../../../../helpers/requestHelper'
export const managerServices = {
    getAllKPIUnit,
    getChildTargetOfCurrentTarget,
    copyKPIUnit,
    calculateKPIUnit,
}

// Lấy tất cả KPI đơn vị
function getAllKPIUnit(infosearch) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/creation/organizational-unit-kpi-sets`,
        method: 'GET',
        params: {
            allOrganizationalUnitKpiSet: 1,
            roleId: infosearch.role,
            status: infosearch.status,
            startDate: infosearch.startDate,
            endDate: infosearch.endDate
        }
    }, false, true, 'kpi.organizational_unit');
}

// Lấy tất cả KPI đơn vị
function getChildTargetOfCurrentTarget(kpiId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpi-sets`,
        method: 'GET',
        params: {
            organizationalUnitKpiSetId: kpiId,
            unitKpiSetByEmployeeKpiSetDate: true,
            type: "getChildTargetOfCurrentTarget"
        }
    }, false, true, 'kpi.organizational_unit');
}

function copyKPIUnit(kpiId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/management/organizational-unit-kpi-sets/${kpiId}/copy`,
        method: 'POST',
        params: {
            idunit: data.idunit,
            datenew: data.datenew,
            creator: data.creator,
        }
    }, true, true, 'kpi.organizational_unit');
}

function calculateKPIUnit(idKpiUnitSet, date, idKpiUnit) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/management/organizational-unit-kpi-sets/calculate`,
        method: 'POST',
        data: {
            idKpiUnitSet: idKpiUnitSet,
            date: date,
            idKpiUnit: idKpiUnit,
        }
    }, true, true, 'kpi.organizational_unit');
}
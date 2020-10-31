const Models = require(`${SERVER_MODELS_DIR}`);
const { OrganizationalUnitKpiSet, OrganizationalUnitKpi, } = Models;

const mongoose = require("mongoose");
const { EmployeeKpi } = require("../../../../models");
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);
const EmployeeKpiService = require(`${SERVER_MODULES_DIR}/kpi/employee/management/management.service`);



/**
 * Copy KPI đơn vị từ một tháng cũ sang tháng mới
 * @param {*} kpiId id của OrganizationalUnitKPIset của tháng cũ
 * @query {*} datenew tháng mới được chọn để tạo
 * @query {*} creator Id người tạo
 * @query {*} idunit Id của đơn vị 
 */
exports.copyKPI = async (portal, kpiId, data) => {
    var organizationalUnitOldKPISet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .findById(kpiId)
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });

    let date, dateNewKPIUnit, organizationalUnitKpiSet;
    date = data.datenew.split("-");
    dateNewKPIUnit = new Date(date[1], date[0], 0);

    var organizationalUnitNewKpi = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .create({
            organizationalUnit: organizationalUnitOldKPISet.organizationalUnit._id,
            creator: data.creator,
            date: dateNewKPIUnit,
            kpis: []
        })

    for (let i in organizationalUnitOldKPISet.kpis) {
        var target = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal))
            .create({
                name: organizationalUnitOldKPISet.kpis[i].name,
                parent: organizationalUnitOldKPISet.kpis[i].parent,
                weight: organizationalUnitOldKPISet.kpis[i].weight,
                criteria: organizationalUnitOldKPISet.kpis[i].criteria,
                type: organizationalUnitOldKPISet.kpis[i].type
            })
        organizationalUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .findByIdAndUpdate(
                organizationalUnitNewKpi, { $push: { kpis: target._id } }, { new: true }
            );
    }
    organizationalUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .find({ organizationalUnit: data.idunit })
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });

    return organizationalUnitKpiSet;
}

exports.calculateKpiUnit = async (portal, data) => {
    //const month = data.date.getMoth() + 1;
    let kpiUnitSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal)).findOne({ _id: data.idKpiUnitSet })
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });

    let organizationUnitKpiAutomaticPoint = 0;
    let organizationUnitKpiEmployeePoint = 0;
    let organizationUnitKpiApprovePoint = 0;
    for (i in kpiUnitSet.kpis) {
        let organizationUnitKpi = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal)).findOne({ _id: kpiUnitSet.kpis[i] });
        let autoPoint = 0;
        let employeePoint = 0;
        let approvedPoint = 0;

        let kpiEmployee = await EmployeeKpi(connect(DB_CONNECTION, portal)).find({ parent: organizationUnitKpi._id });
        for (j in kpiEmployee) {
            autoPoint += kpiEmployee[j].automaticPoint;
            employeePoint += kpiEmployee[j].employeePoint;
            approvedPoint += kpiEmployee[j].approvedPoint;
        }
        if (kpiEmployee.length) {
            autoPoint = autoPoint / kpiEmployee.length;
            employeePoint = employeePoint / kpiEmployee.length;
            approvedPoint = approvedPoint / kpiEmployee.length;
        }

        // update point for each kpiUnit in kpiUnitSet
        organizationUnitKpi.automaticPoint = Math.round(autoPoint);
        organizationUnitKpi.employeePoint = Math.round(employeePoint);
        organizationUnitKpi.approvedPoint = Math.round(approvedPoint);

        await organizationUnitKpi.save();

        // increase kpiUnitSet's point
        let weight = organizationUnitKpi.weight / 100;
        organizationUnitKpiAutomaticPoint += autoPoint * weight;
        organizationUnitKpiEmployeePoint += employeePoint * weight;
        organizationUnitKpiApprovePoint += approvedPoint * weight;

    }
    // update kpiUnitSet
    kpiUnitSet.automaticPoint = Math.round(organizationUnitKpiApprovePoint);
    kpiUnitSet.employeePoint = Math.round(organizationUnitKpiEmployeePoint);
    kpiUnitSet.approvedPoint = Math.round(organizationUnitKpiApprovePoint);
    await kpiUnitSet.save();
    let childrenKpi = await EmployeeKpiService.getChildTargetByParentId(portal, { organizationalUnitKpiSetId: data.idKpiUnitSet })
    return { kpiUnitSet, childrenKpi };

}
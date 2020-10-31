const Models = require(`${SERVER_MODELS_DIR}`);
const { OrganizationalUnit, EmployeeKpiSet } = Models;
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);


/**
 * Lấy tất cả KPI của nhân viên theo mảng id đơn vị
 * @id Mảng id các đơn vị
 */
exports.getAllEmployeeKpiSetOfUnitByIds = async (portal, ids) => {
    let data = [];
    for (let i = 0; i < ids.length; i++) {

        let employeekpis = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
            .find({
                organizationalUnit: ids[i]
            })
            .skip(0).limit(50)
            .populate("organizationalUnit creator approver")
            .populate({ path: "kpis", populate: { path: 'parent' } });
        data = data.concat(employeekpis);

    };
    return data;
}

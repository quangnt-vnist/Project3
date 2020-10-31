const Logger = require(`${SERVER_LOGS_DIR}`);
const DashboardService = require('./dashboard.service');
const EmployeeKpi = require('../../employee/management/management.controller');
const { query } = require('express');

/**
 * Lấy tất cả KPI của nhân viên theo mảng id đơn vị
 */

exports.getAllEmployeeKpiSetOfUnitByIds = async (req, res) => {
    if(req.query.employeeKpiCurrent){
        EmployeeKpi.getAllEmployeeKpiInOrganizationalUnit(req, res);
    }
    else{
        try {
        const employeeKpis = await DashboardService.getAllEmployeeKpiSetOfUnitByIds(req.portal, req.query.ids);
        await Logger.info(req.user.email, `GET_ALL_EMPLOYEE_KPI_SET`, req.portal);
            res.status(200).json({
                success: true,
                messages: ['get_all_kpi_member_success'],
                content: employeeKpis
            });
        } catch (error) {
            await Logger.error(req.user.email, `GET_ALL_EMPLOYEE_KPI_SET`, req.portal);
            res.status(400).json({
                messages: ['get_all_kpi_member_fail'],
                content: error
            });
        }
    }
};
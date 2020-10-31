const overviewService = require('./management.service');
const Logger = require(`${SERVER_LOGS_DIR}`);


/** Lấy tất cả tập kpi cá nhân của một nhân viên có trạng thái đã kết thúc */
exports.getAllKPIEmployeeSetsInOrganizationByMonth = async (req, res) => {

    if (req.query.type === "getChildTargetOfCurrentTarget") {
        this.getChildTargetByParentId(req, res);
    }
    else {
        try {
            let kpipersonals = await overviewService.getAllKPIEmployeeSetsInOrganizationByMonth(req.portal, req.query);

            Logger.info(req.user.email, ` get all kpi personal `, req.portal);
            res.status(200).json({
                success: true,
                messages: ['get_kpi_employee_in_department_by_month_success'],
                content: kpipersonals
            });
        } catch (error) {
            Logger.error(req.user.email, ` get all kpi personal `, req.portal);
            res.status(400).json({
                success: false,
                messages: ['get_kpi_responsible_fail'],
                content: error
            })
        }
    }
};

/**
 * Khởi tạo KPI tháng mới từ KPI tháng này trong trang quản lý KPI cá nhân
 */
exports.copyKPI = async (req, res) => {
    try {
        let kpipersonals = await overviewService.copyKPI(req.portal, req.params.id, req.query);
        Logger.info(req.user.email, ` get all kpi personal `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['copy_KPI_success'],
            content: kpipersonals
        });
    } catch (error) {
        Logger.error(req.user.email, ` get all kpi personal `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['copy_KPI_fail'],
            content: error
        })
    }

};

/** 
 * Lấy tất cả employeeKpi thuộc organizationalUnitKpi hiện tại 
 */
exports.getAllEmployeeKpiInOrganizationalUnit = async (req, res) => {
    try {
        let employeeKpis = await overviewService.getAllEmployeeKpiInOrganizationalUnit(req.portal, req.query.roleId, req.query.organizationalUnitId, req.query.month);

        Logger.info(req.user.email, ' get all employee kpi in organizational unit ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_employee_kpi_in_organizational_unit_success'],
            content: employeeKpis
        });
    } catch (error) {
        Logger.error(req.user.email, ' get all employee kpi in organizational unit ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_all_employee_kpi_in_organizational_unit_failure'],
            content: error
        })
    }
}


/** 
 * Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng
 */
exports.getAllEmployeeKpiSetInOrganizationalUnit = async (req, res) => {
    try {
        let employeeKpiSets = await overviewService.getAllEmployeeKpiSetInOrganizationalUnit(req.portal, req.query);

        Logger.info(req.user.email, ' get all employee kpi set in organizational unit ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_employee_kpi_set_in_organizational_unit_success'],
            content: employeeKpiSets
        })
    } catch (error) {
        Logger.error(req.user.email, ' get all employee kpi set in organizational unit ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_all_employee_kpi_set_in_organizational_unit_failure'],
            content: error
        })
    }
}

/** 
 * Lấy tất cả EmployeeKpis thuộc các đơn vị con của đơn vị hiện tại 
 */
exports.getAllEmployeeKpiInChildrenOrganizationalUnit = async (req, res) => {
    try {
        let employeeKpisInChildrenOrganizationalUnit = await overviewService.getAllEmployeeKpiInChildrenOrganizationalUnit(req.portal, req.user.company._id, req.query.roleId, req.query.month, req.query.organizationalUnitId);

        Logger.info(req.user.email, ' get all employee kpi set in organizational unit ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_employee_kpi_set_in_organizational_unit_success'],
            content: employeeKpisInChildrenOrganizationalUnit
        })
    } catch (error) {
        Logger.error(req.user.email, ' get all employee kpi set in organizational unit ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_all_employee_kpi_set_in_organizational_unit_failure'],
            content: error
        })
    }
}


/* 
 *Lấy tất cả các mục tiêu con của mục tiêu hiện tại
 */
exports.getChildTargetByParentId = async (req, res) => {
    try {
        let childTarget = await overviewService.getChildTargetByParentId(req.portal, req.query);

        Logger.info(req.user.email, ' get child target by parent id ', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_child_target_by_parent_id_success'],
            content: childTarget
        });
    } catch (error) {
        Logger.error(req.user.email, ' get child target by parent id ', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_child_target_by_parent_id_fail'],
            content: error
        })
    }
}
const KPIUnitService = require('./creation.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

/**
 * Get organizational unit kpi set
 */
exports.getOrganizationalUnitKpiSet = async (req, res) => {
    if (req.query.parent) {
        getParentOrganizationalUnitKpiSet(req, res);
    } else if (req.query.allOrganizationalUnitKpiSet) {
        getAllOrganizationalUnitKpiSet(req, res);
    } else if (req.query.child) {
        getAllOrganizationalUnitKpiSetByTimeOfChildUnit(req, res);
    } else if (req.query.allOrganizationalUnitKpiSetByTime) {
        getAllOrganizationalUnitKpiSetByTime(req, res);
    } else {
        try {
            var kpiunit = await KPIUnitService.getOrganizationalUnitKpiSet(req.portal, req.query);
            Logger.info(req.user.email, `Get kpi unit by role `, req.portal);
            res.status(200).json({
                success: true,
                messages: ['get_kpiunit_by_role_success'],
                content: kpiunit
            })
        } catch (error) {
            Logger.error(req.user.email, `Get kpi unit by role `, req.portal)
            res.status(400).json({
                success: false,
                messages: ['get_kpiunit_by_role_fail'],
                content: error
            })
        }
    }

}

/**
 * Chỉnh sửa thông tin chung của tập KPI đơn vị
 */
exports.editOrganizationalUnitKpiSet = async (req, res) => {
    if (req.query.status) {
        editOrganizationalUnitKpiSetStatus(req, res);
    } else {
        try {
            var organizationalUnitKpiSet = await KPIUnitService.editOrganizationalUnitKpiSet(req.portal, req.body.date, req.params.id);
            Logger.info(req.user.email, ' Edit kpi unit ', req.portal);
            res.status(200).json({
                success: true,
                messages: ['edit_kpi_success'],
                content: organizationalUnitKpiSet,
            });
        } catch (error) {
            Logger.error(req.user.email, ' Edit kpi unit ', req.portal);
            res.status(400).json({
                success: false,
                messages: ['edit_kpi_failure'],
                content: error
            })
        }
    }
}

/**
 * Xóa tập KPI đơn vị 
 */
exports.deleteOrganizationalUnitKpiSet = async (req, res) => {
    try {
        var arr = await KPIUnitService.deleteOrganizationalUnitKpiSet(req.portal, req.params.id);
        kpiunit = arr[0];
        listTarget = arr[1];
        Logger.info(req.user.email, 'delete kpi unit', req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_kpi_success'],
            content: {
                kpiunit: kpiunit,
                listtarget: listTarget
            }
        });
    } catch (error) {
        Logger.error(req.user.email, 'delete kpi unit', req.portal)
        res.status(400).json({
            success: false,
            messages: ['delete_kpi_failure'],
            content: error
        })
    }

}

/**
 * Xóa KPI đơn vị
 */
exports.deleteOrganizationalUnitKpi = async (req, res) => {
    try {
        var organizationalUnitKpiSet = await KPIUnitService.deleteOrganizationalUnitKpi(req.portal, req.params.idUnitKpi, req.params.idUnitKpiSet);
        Logger.info(req.user.email, 'delete target kpi unit', req.portal);
        res.status(200).json({
            success: true,
            messages: ['confirm_delete_target_success'],
            content: organizationalUnitKpiSet
        });
    } catch (error) {
        Logger.error(req.user.email, 'delete target kpi unit', req.portal)
        res.status(400).json({
            success: false,
            messages: ['confirm_delete_target_failure'],
            content: error
        })
    }
}

/**
 * Lấy tập KPI đơn vị của đơn vị cha của đơn vị ứng với role người dùng
 */
getParentOrganizationalUnitKpiSet = async (req, res) => {
    try {
        var kpiunit = await KPIUnitService.getParentOrganizationalUnitKpiSet(req.portal, req.query.roleId);
        Logger.info(req.user.email, 'get parent kpi unit', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_parent_by_unit_success'],
            content: kpiunit
        });
    } catch (error) {
        Logger.error(req.user.email, 'get parent kpi unit', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_parent_by_unit_failure'],
            content: error
        })
    }

}

/**
 * Thêm một KPI vào tập KPI đơn vị
 */
exports.createOrganizationalUnitKpi = async (req, res) => {
    try {
        var organizationalUnitKpiSet = await KPIUnitService.createOrganizationalUnitKpi(req.portal, req.body);
        Logger.info(req.user.email, 'create target kpi unit', req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_target_success'],
            content: organizationalUnitKpiSet,
        });
    } catch (error) {
        Logger.error(req.user.email, 'create target kpi unit', req.portal)
        res.status(400).json({
            success: false,
            messages: ['create_target_failure'],
            content: error
        })
    }
}

/**
 * Chỉnh sửa KPI đơn vị
 */
exports.editOrganizationalUnitKpi = async (req, res) => {

    try {
        var target = await KPIUnitService.editOrganizationalUnitKpi(req.portal, req.body, req.params.id);
        Logger.info(req.user.email, 'edit target kpi unit', req.portal)
        res.status(200).json({
            success: true,
            messages: ['edit_target_success'],
            content: target
        });
    } catch (error) {
        Logger.error(req.user.email, 'edit target kpi unit', req.portal)
        res.status(400).json({
            success: false,
            messages: ['edit_target_failure'],
            content: error
        })
    }

}

/**
 * Chỉnh sửa trạng thái của KPI đơn vị
 */
editOrganizationalUnitKpiSetStatus = async (req, res) => {
    try {
        var kpiunit = await KPIUnitService.editOrganizationalUnitKpiSetStatus(req.portal, req.params.id, req.query);
        Logger.info(req.user.email, 'edit status kpi unit', req.portal)
        res.status(200).json({
            success: true,
            messages: ['confirm_edit_status_success'],
            content: kpiunit,
        });
    } catch (error) {
        Logger.error(req.user.email, 'edit status kpi unit', req.portal)
        res.status(400).json({
            success: false,
            messages: ['confirm_edit_status_failure'],
            content: error
        })
    }
}

/**
 * Khởi tạo tập KPI đơn vị
 */
exports.createOrganizationalUnitKpiSet = async (req, res) => {
    try {
        var organizationalUnitKpi = await KPIUnitService.createOrganizationalUnitKpiSet(req.portal, req.body);
        Logger.info(req.user.email, 'create kpi unit', req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_organizational_unit_kpi_set_success'],
            content: organizationalUnitKpi,
        });
    } catch (error) {
        Logger.error(req.user.email, 'create kpi unit', req.portal)
        res.status(400).json({
            success: false,
            messages: ['create_organizational_unit_kpi_set_failure'],
            content: error
        })
    }
}

/** 
 * Lấy danh sách các tập KPI đơn vị theo thời gian của từng đơn vị 
 */
getAllOrganizationalUnitKpiSetByTime = async (req, res) => {
    try {
        var organizationalUnitKpiSets = await KPIUnitService.getAllOrganizationalUnitKpiSetByTime(req.portal, req.query.roleId, req.query.organizationalUnitId, req.query.startDate, req.query.endDate);
        Logger.info(req.user.email, ' get all organizational unit kpi set each year ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_organizational_unit_kpi_set_each_year_success'],
            content: organizationalUnitKpiSets
        })
    } catch (error) {
        Logger.error(req.user.email, ' get all organizational unit kpi set each year ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_all_organizational_unit_kpi_set_each_year_failure'],
            content: error
        })
    }
}

/** 
 * Lấy danh sách các tập KPI đơn vị theo thời gian của các đơn vị là con của đơn vị hiện tại và đơn vị hiện tại 
 */
getAllOrganizationalUnitKpiSetByTimeOfChildUnit = async (req, res) => {
    try {
        let childOrganizationalUnitKpiSets = await KPIUnitService.getAllOrganizationalUnitKpiSetByTimeOfChildUnit(req.portal, req.user.company._id, req.query);
        
        Logger.info(req.user.email, ' get all organizational unit kpi set each year of child unit ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_organizational_unit_kpi_set_each_year_of_child_success'],
            content: childOrganizationalUnitKpiSets
        })
    } catch (error) {
        Logger.error(req.user.email, ' get all organizational unit kpi set each year of child unit ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_all_organizational_unit_kpi_set_each_year_of_child_failure'],
            content: error
        })
    }
}

getAllOrganizationalUnitKpiSet = async (req, res) => {
    try {
        var kpiunits = await KPIUnitService.getAllOrganizationalUnitKpiSet(req.portal, req.query);
        Logger.info(req.user.email, ' get kpi unit ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_kpi_unit_success'],
            content: kpiunits
        })
    } catch (error) {
        Logger.error(req.user.email, ' get kpi unit ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_kpi_unit_fail'],
            content: error
        })
    }

};
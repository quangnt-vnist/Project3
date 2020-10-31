const managerService = require('./management.service');
const Logger = require(`${SERVER_LOGS_DIR}`);


/**
 * lấy tất cả kpi đơn vị
 * @param {*} req 
 * @param {*} res 
 */
exports.copyKPI = async (req, res) => {
    try {
        let kpiunit = await managerService.copyKPI(req.portal, req.params.id, req.query);
        Logger.info(req.user.email, ' copy kpi unit ', req.portal)
        res.status(200).json({
            success: true,
            messages: ['copy_kpi_unit_success'],
            content: kpiunit
        });
    } catch (error) {
        Logger.error(req.user.email, ' copy kpi unit ', req.portal)
        res.status(400).json({
            success: false,
            messages: ['copy_kpi_unit_fail'],
            content: error
        })
    }
}

exports.calculateKpiUnit = async (req, res) => {
    try {
        let kpiUnit = await managerService.calculateKpiUnit(req.portal, req.body);
        Logger.info(req.user.email, ' calculate kpi unit ', req.portal)
        res.status(200).json({
            success: true,
            messages: ['calculate_kpi_unit_success'],
            content: kpiUnit
        });
    } catch (error) {
        Logger.error(req.user.email, ' calculate kpi unit ', req.portal)
        res.status(400).json({
            success: false,
            messages: ['calculate_kpi_unit_fail'],
            content: error
        })
    }
}
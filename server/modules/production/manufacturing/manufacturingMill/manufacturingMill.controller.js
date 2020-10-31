const Logger = require(`${SERVER_LOGS_DIR}`);
const ManufacturingMillService = require('./manufacturingMill.service');

exports.createManufacturingMill = async (req, res) => {
    try {
        let newManufacturingMill = await ManufacturingMillService.createManufacturingMill(req.body, req.portal);

        await Logger.info(req.user.email, "CREATE_NEW_MANUFACTURING_MILL", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_mill_successfully"],
            content: newManufacturingMill
        });
    } catch (error) {
        await Logger.error(req.user.email, "CREATE_NEW_MANUFACTURING_MILL", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create__mill_failed"],
            content: error.message
        })
    }
}

exports.getAllManufacturingMills = async (req, res) => {
    try {
        let query = req.query;
        let manufacturingMills = await ManufacturingMillService.getAllManufacturingMills(query, req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_mills_successfully"],
            content: manufacturingMills
        })
    } catch (error) {
        await Logger.error(req.user.email, "GET_ALL_MANUFACTURING_MUILLS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_mills_failed"]
        })

    }
}

exports.getManufacturingMillById = async (req, res) => {
    try {
        let id = req.params.id;
        let manufacturingMill = await ManufacturingMillService.getManufacturingMillById(id, req.portal);

        await Logger.info(req.user.email, "GET_MANUFACTURING_MILL_BY_ID", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_mill_successfully"],
            content: manufacturingMill
        })
    } catch (error) {
        await Logger.error(req.user.email, "GET_MANUFACTURING_MILL_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_mill_failed"],
            content: error.message
        })
    }
}

exports.editManufacturingMill = async (req, res) => {
    try {
        let id = req.params.id;
        let data = req.body;
        let manufacturingMill = await ManufacturingMillService.editManufacturingMill(id, data, req.portal);

        await Logger.info(req.user.email, "EDIT_MANUFACTURING_MILL", req.portal);

        res.status(200).json({
            success: true,
            messages: ["edit_mill_successfully"],
            content: manufacturingMill
        })
    } catch (error) {
        await Logger.error(req.user.email, "EDIT_MANUFACTURING_MILL", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_mill_failed"],
            content: error.message
        })
    }
}

exports.deleteManufacturingMill = async (req, res) => {
    try {
        let id = req.params.id;
        let manufacturingMill = await ManufacturingMillService.deleteManufacturingMill(id, req.portal);

        await Logger.error(req.user.email, "DELETE_MANUFACTURING_MILL", req.portal);

        res.status(200).json({
            success: true,
            messages: ["delete_mill_succesfully"],
            content: manufacturingMill
        })
    } catch (error) {
        await Logger.error(req.user.email, "DELETE_MANUFACTURING_MILL", req.portal);

        res.status(400).json({
            success: false,
            messages: ["delete_mill_failed"],
            content: error.message
        });
    }
}

exports.createWorkSchedule = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body
        let manufacturingMill = await ManufacturingMillService.createWorkSchedule(id, data, req.portal);

        if (manufacturingMill !== -1) {
            res.status(201).json({
                success: true,
                messages: ["create_work_schedule_successfully"],
                content: manufacturingMill
            })
        } else {
            throw Error("manufacturing mill is not exist");
        }

    } catch (error) {
        await Logger.error(req.user.email, "CREATE_WORK_SCHEDULE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_work_schedule_failed"],
            content: error.message
        })
    }
}

exports.addCommandToSchedule = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let manufacturingMill = await ManufacturingMillService.addCommandToSchedule(id, data, req.portal);

        if (manufacturingMill !== -1) {
            res.status(201).json({
                success: true,
                messages: ["add_command_to_schedule_successfully"],
                content: manufacturingMill
            });
        } else {
            throw Error("manufacturing mill is not exist");
        }
    } catch (error) {
        await Logger.error(req.user.email, "ADD_COMMAND_TO_SCHEDULE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["add_command_to_schedule_failed"],
            content: error.message
        })
    }
}


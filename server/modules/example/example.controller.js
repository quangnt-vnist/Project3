const ExampleService = require('./example.service');
const Log = require(`${SERVER_LOGS_DIR}`);

// Thêm mới một ví dụ
exports.createExample = async (req, res) => {
    try {
        const newExample = await ExampleService.createExample(req.body, req.portal);

        await Log.info(req.user.email, 'CREATED_NEW_EXAMPLE', req.portal);

        res.status(201).json({
            success: true,
            messages: ["add_success"],
            content: newExample
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_EXAMPLE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["add_fail"],
            content: error.message
        })
    }
}

// Lấy ra đầy đủ thông tin tất cả các dịch vụ
exports.getExamples = async (req, res) => {
    try {
        let { page, limit, exampleName } = req.query;
        let data;
        let params;
        if (page === undefined || limit === undefined) {
            params = {
                exampleName: exampleName,
                page: 0,
                limit: 10
            }
            data = await ExampleService.getExamples(params, req.portal);
        } else {
            params = {
                exampleName: exampleName,
                page: Number(page),
                limit: Number(limit)
            }
            data = await ExampleService.getExamples(params, req.portal);
        }

        await Log.info(req.user.email, "GET_ALL_EXAMPLES", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_examples_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_EXAMPLES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_examples_fail"],
            content: error.message
        });
    }
}

//  Lấy ra Ví dụ theo id
exports.getExampleById = async (req, res) => {
    try {
        let { id } = req.params;
        let example = await ExampleService.getExampleById(id, req.portal);
        if (example !== -1) {
            await Log.info(req.user.email, "GET_EXAMPLE_BY_ID", req.portal);
            res.status(200).json({
                success: true,
                messages: ["get_example_by_id_success"],
                content: example
            });
        } else {
            throw Error("example is invalid")
        }
    } catch (error) {
        await Log.error(req.user.email, "GET_EXAMPLE_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_example_by_id_fail"],
            content: error.message
        });
    }
}

// Sửa Ví dụ
exports.editExample = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedExample = await ExampleService.editExample(id, data, req.portal);
        if (updatedExample !== -1) {
            await Log.info(req.user.email, "UPDATED_EXAMPLE", req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_example_success"],
                content: updatedExample
            });
        } else {
            throw Error("Example is invalid");
        }

    } catch (error) {
        await Log.error(req.user.email, "UPDATED_EXAMPLE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_example_fail"],
            content: error.message
        });
    }
}

// Xóa Ví dụ
exports.deleteExample = async (req, res) => {
    try {
        let { id } = req.params;
        let deletedExample = await ExampleService.deleteExample(id, req.portal);
        if (deletedExample) {
            await Log.info(req.user.email, "DELETED_EXAMPLE", req.portal);
            res.status(200).json({
                success: true,
                messages: ["delete_success"],
                content: deletedExample
            });
        } else {
            throw Error("Example is invalid");
        }
    } catch (error) {
        await Log.error(req.user.email, "DELETED_EXAMPLE", req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_fail"],
            content: error.message
        });
    }
}

// Lấy ra tên của tất cả các Ví dụ
exports.getOnlyExampleName = async (req, res) => {
    try {
        let { page, limit, exampleName } = req.query;
        let data;
        let params;
        if (page === undefined || limit === undefined) {
            params = {
                exampleName: exampleName,
                page: 0,
                limit: 10
            }
            data = await ExampleService.getOnlyExampleName(params, req.portal);
        } else {
            params = {
                exampleName: exampleName,
                page: Number(page),
                limit: Number(limit)
            }
            data = await ExampleService.getOnlyExampleName(params, req.portal);
        }

        await Log.info(req.user.email, "GET_ONLY_NAME_ALL_EXAMPLES", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_only_name_all_examples_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ONLY_NAME_ALL_EXAMPLES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_only_name_all_examples_fail"],
            content: error.message
        });
    }
}

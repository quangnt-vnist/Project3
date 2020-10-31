const CustomerService = require('./customer.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

/**
 * Lấy thông tin của tất cả khách hàng
 * @param {*} req 
 * @param {*} res 
 */
exports.getCustomers = async (req, res) => {
    try {
        const customers = await CustomerService.getCustomers(req.portal, req.user.company._id, req.query);
        await Logger.info(req.user.email, ' get_customers_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_customers_success'],
            content: customers
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_customers_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_customers_faile'],
            content: error
        })
    }
}

/**
 * Lấy thông tin của 1 khách hàng theo id
 * @param {*} req 
 * @param {*} res 
 */
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await CustomerService.getCustomerById(req.portal, req.user.company._id, req.params.id);
        await Logger.info(req.user.email, ' get_customer_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_customer_success'],
            content: customer
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_customer_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_customer_faile'],
            content: error
        })
    }
}

/**
 * Tạo mới một khách hàng
 * @param {*} req 
 * @param {*} res 
 */
exports.createCustomer = async (req, res) => {
    try {
        const newCustomer = await CustomerService.createCustomer(req.portal, req.user.company._id, req.body, req.user._id, req.files);
        await Logger.info(req.user.email, ' create_customer_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_customer_success'],
            content: newCustomer
        })
    } catch (error) {
        await Logger.error(req.user.email, ' create_customer_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_customer_faile'],
            content: error
        })
    }
}

/**
 * Chỉnh sửa một khách hàng
 * @param {*} req 
 * @param {*} res 
 */
exports.editCustomer = async (req, res) => {
    try {
        let avatar, fileAttachment;
        //upload avatar cho form xem chi tiết
        if (req.files && req.files.avatar) {
            let path = `${req.files.avatar[0].destination}/${req.files.avatar[0].filename}`;
            avatar = path.substr(1, path.length)
        }

        //upload file đính kèm cho form edit
        if(req.files && req.files.fileAttachment){
            fileAttachment = req.files.fileAttachment ? req.files.fileAttachment : undefined;
        }

        let fileInfomation = {
            avatar,
            fileAttachment,
        }

        const customerUpdate = await CustomerService.editCustomer(req.portal, req.user.company._id, req.params.id, req.body, req.user._id, fileInfomation);
        await Logger.info(req.user.email, ' edit_customer_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_customer_success'],
            content: customerUpdate
        })
    } catch (error) {
        await Logger.error(req.user.email, ' edit_customer_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_customer_faile'],
            content: error
        })
    }
}

/**
 * Xóa một khách hàng
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteCustomer = async (req, res) => {
    try {
        const deleteCustomer = await CustomerService.deleteCustomer(req.portal, req.user.company._id, req.params.id);
        await Logger.info(req.user.email, ' delete_customer_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_customer_success'],
            content: deleteCustomer
        })
    } catch (error) {
        await Logger.error(req.user.email, ' delete_customer_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_customer_faile'],
            content: error
        })
    }
}
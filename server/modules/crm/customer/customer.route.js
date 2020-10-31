const express = require("express");
const router = express.Router();
const { auth, uploadFile } = require(`${SERVER_MIDDLEWARE_DIR}`);
const CustomerController = require('./customer.controller');

const data = [
    { name: 'avatar', path: '/crm/customer-avatar' },
    { name: 'fileAttachment', path: '/crm/customer-files' }
]

router.get('/', auth, CustomerController.getCustomers);

router.get('/:id', auth, CustomerController.getCustomerById);
router.post('/', auth, uploadFile([{name: 'file', path: '/crm/customer-files'}], 'array'), CustomerController.createCustomer);
router.patch('/:id', auth, uploadFile(data,'fields'), CustomerController.editCustomer);
router.delete('/:id', auth, CustomerController.deleteCustomer);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
    auth,
    uploadFile
} = require(`${SERVER_MIDDLEWARE_DIR}`);

const EmployeeController = require("./profile.controller");

const data = [{
        name: 'fileAvatar',
        path: '/human-resource/avatars'
    },
    {
        name: 'fileDegree',
        path: '/human-resource/degrees'
    },
    {
        name: 'fileCertificate',
        path: '/human-resource/certificates'
    },
    {
        name: 'fileContract',
        path: '/human-resource/contracts'
    },
    {
        name: 'file',
        path: '/human-resource/files'
    }
]

// Lấy thông tin cá nhân
router.get('/employees/:id', auth, EmployeeController.getEmployeeProfile);

// Cập nhật thông tin cá nhân
router.patch('/employees/:userId', auth, uploadFile([{
    name: 'fileAvatar',
    path: '/human-resource/avatars'
}], 'single'), EmployeeController.updatePersonalInformation);

// Lấy danh sách nhân viên
router.get('/employees', auth, EmployeeController.searchEmployeeProfiles);


router.post('/employees', auth, uploadFile(data, 'fields'), EmployeeController.createEmployee);

router.put('/employees/:id', auth, uploadFile(data, 'fields'), EmployeeController.updateEmployeeInformation)
router.delete('/employees/:id', auth, EmployeeController.deleteEmployee);

// Import thông tin nhân viên
router.post('/employees/import', auth, EmployeeController.importEmployees);


module.exports = router;
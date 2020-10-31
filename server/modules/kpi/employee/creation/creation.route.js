const express = require("express");
const router = express.Router();
const EmployeeKpiSetController = require("./creation.controller");
const { auth, uploadFile } = require(`${SERVER_MIDDLEWARE_DIR}`);

/** 
 * Lấy tập KPI cá hiện hiện tại
 * Lấy tất cả các tập KPI của 1 nhân viên theo thời gian cho trước
 * Lấy tất cả các tập KPI của tất cả nhân viên trong mảng đơn vị cho trước theo thời gian
 * Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng
 * Lấy tất cả tập kpi cá nhân của một nhân viên có trạng thái đã kết thúc
 */
router.get('/employee-kpi-sets', auth, EmployeeKpiSetController.getEmployeeKpiSet);

// Khởi tạo KPI cá nhân
router.post('/employee-kpi-sets', auth, EmployeeKpiSetController.createEmployeeKpiSet);

// Chỉnh sửa thông tin chung của KPI cá nhân
router.post('/employee-kpi-sets/:id/edit', auth, EmployeeKpiSetController.editEmployeeKpiSet);

// Xóa KPI cá nhân
router.delete('/employee-kpi-sets/:id', auth, EmployeeKpiSetController.deleteEmployeeKpiSet);

// Tạo 1 mục tiêu KPI mới
router.post('/employee-kpis', auth, EmployeeKpiSetController.createEmployeeKpi);

// Xóa 1 mục tiêu KPI cá nhân
router.delete('/employee-kpis/:id', auth, EmployeeKpiSetController.deleteEmployeeKpi);

//comments
router.post('/employee-kpi-sets/:kpiId/comments', auth, uploadFile([{ name: 'files', path: '/files/kpisets' }], 'array'), EmployeeKpiSetController.createComment)
router.patch('/employee-kpi-sets/:kpiId/comments/:commentId', auth, uploadFile([{ name: 'files', path: '/files/kpisets' }], 'array'), EmployeeKpiSetController.editComment)
router.delete('/employee-kpi-sets/:kpiId/comments/:commentId', auth, EmployeeKpiSetController.deleteComment)
router.delete('/employee-kpi-sets/:kpiId/comments/:commentId/files/:fileId', auth, EmployeeKpiSetController.deleteFileComment)
//child comments
router.post('/employee-kpi-sets/:kpiId/comments/:commentId/child-comments', auth, uploadFile([{ name: 'files', path: '/files/kpisets' }], 'array'), EmployeeKpiSetController.createChildComment)
router.patch('/employee-kpi-sets/:kpiId/comments/:commentId/child-comments/:childCommentId', auth, uploadFile([{ name: 'files', path: '/files/kpisets' }], 'array'), EmployeeKpiSetController.editChildComment)
router.delete('/employee-kpi-sets/:kpiId/comments/:commentId/child-comments/:childCommentId', auth, EmployeeKpiSetController.deleteChildComment)
router.delete('/employee-kpi-sets/:kpiId/comments/:commentId/child-comments/:childCommentId/files/:fileId', auth, EmployeeKpiSetController.deleteFileChildComment)
module.exports = router;
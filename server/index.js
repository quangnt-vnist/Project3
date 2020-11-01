// NODE_MODULES
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const server = require('http').createServer(app);

require("dotenv").config();
require('./connectDatabase');
require('./global')(server);

app.use(require("cors")());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/upload/avatars", express.static("upload/avatars"));

const router = express.Router();

router.use('/auth', require('./modules/auth/auth.route'));

router.use("/annualLeave", require("./modules/human-resource/annual-leave/annualLeave.route"));
router.use("/commendation", require("./modules/human-resource/commendation/commendation.route"));
router.use("/discipline", require("./modules/human-resource/discipline/discipline.route"));
router.use("/workPlan", require("./modules/human-resource/work-plan/workPlan.route"));
router.use("/employee", require("./modules/human-resource/profile/profile.route"));
router.use("/salary", require("./modules/human-resource/salary/salary.route"));
router.use("/timesheet", require("./modules/human-resource/timesheets/timesheets.route"));

router.use("/majors", require("./modules/human-resource/major/major.route"));
router.use("/career-positions", require("./modules/human-resource/career-position/careerPosition.route"));

router.use("/kpi/employee/creation", require("./modules/kpi/employee/creation/creation.route"));
router.use("/kpi/employee/dashboard", require("./modules/kpi/employee/dashboard/dashboard.route"));
router.use("/kpi/employee/management", require("./modules/kpi/employee/management/management.route"));
router.use("/kpi/evaluation/dashboard", require("./modules/kpi/evaluation/dashboard/dashboard.route"));
router.use("/kpi/evaluation/employee-evaluation", require("./modules/kpi/evaluation/employee-evaluation/employeeEvaluation.route"));
router.use("/kpi/organizational-unit/creation", require("./modules/kpi/organizational-unit/creation/creation.route"));
router.use("/kpi/organizational-unit/dashboard", require("./modules/kpi/organizational-unit/dashboard/dashboard.route"));
router.use("/kpi/organizational-unit/management", require("./modules/kpi/organizational-unit/management/management.route"));

router.use("/notifications", require("./modules/notification/notification.route"));

router.use("/configuration", require("./modules/super-admin/module-configuration/moduleConfiguration.route"));

router.use('/system', require('./modules/super-admin/system/system.route'));
router.use('/user', require('./modules/super-admin/user/user.route'));
router.use('/role', require('./modules/super-admin/role/role.route'));
router.use('/component', require("./modules/super-admin/component/component.route"));
router.use('/link', require("./modules/super-admin/link/link.route"));
router.use('/organizational-units', require("./modules/super-admin/organizational-unit/organizationalUnit.route"));

router.use('/system-admin/company', require("./modules/system-admin/company/company.route"));
router.use('/system-admin/system-component', require("./modules/system-admin/system-component/systemComponent.route"));
router.use('/system-admin/system-link', require("./modules/system-admin/system-link/systemLink.route"));
router.use('/system-admin/root-role', require("./modules/system-admin/root-role/rootRole.route"));
router.use('/system-admin/system-setting', require("./modules/system-admin/system-setting/systemSetting.route"));

router.use("/task", require("./modules/task/task-management/task.route"));
router.use("/performtask", require("./modules/task/task-perform/taskPerform.route"));
router.use("/task/task-templates", require("./modules/task/task-template/taskTemplate.route"));
router.use("/process", require("./modules/task/tasks-process/taskProcess.route"));
router.use("/educationProgram", require("./modules/trainning/education-program/educationProgram.route"));
router.use("/course", require("./modules/trainning/course/course.route"));

router.use("/assettype", require("./modules/asset/asset-type/asset-type.route"));
router.use("/asset", require("./modules/asset/asset-management/asset.route"));
router.use("/purchase-request", require("./modules/asset/purchase-request/purchase-request.route"));
router.use("/use-request", require("./modules/asset/use-request/use-request.route"));

// Task report
router.use("/taskreports", require("./modules/report/task-report/taskReport.route"));

// warehouse
router.use("/stocks", require('./modules/production/warehouse/stock/stock.route'));
router.use("/categories", require("./modules/production/common-production/category/category.route"));
router.use("/goods", require("./modules/production/common-production/good/good.route"));
router.use("/bin-locations", require("./modules/production/warehouse/bin-location/binLocation.route"));
router.use("/lot", require("./modules/production/warehouse/inventory/inventory.route"));

router.use("/examples", require("./modules/example/example.route"));
router.use("/documents", require("./modules/document/document.route"));

// CRM
app.use("/crm/customers", require("./modules/crm/customer/customer.route"));
app.use("/crm/cares", require("./modules/crm/care/care.route"));
app.use("/crm/careTypes", require("./modules/crm/careType/careType.route"));
app.use("/crm/groups", require("./modules/crm/group/group.route"));
app.use("/crm/status", require("./modules/crm/status/status.route"));


// production - manufaturing
app.use("/manufacturing-mill", require("./modules/production/manufacturing/manufacturingMill/manufacturingMill.route"));
app.use("/manufacturing-works", require("./modules/production/manufacturing/manufacturingWorks/manufacturingWorks.route"));
app.use("/purchasing-request", require("./modules/production/manufacturing/purchasingRequest/purchasingRequest.route"));

//order
app.use("/quote", require("./modules/production/order/quote/quote.route"));
app.use("/coin-rule", require("./modules/production/order/coin-rule/coinRule.route"));
app.use("/bank-account", require("./modules/production/order/bank-account/bankAccount.route"));
app.use("/discount", require("./modules/production/order/discount/discount.route"));
app.use("/manufacturing-order", require("./modules/production/order/manufacturing-order/manufacturingOrder.route"));
app.use("/proposal-order", require("./modules/production/order/proposal-order/proposalOrder.route"));
app.use("/purchase-order", require("./modules/production/order/purchase-order/purchaseOrder.route"));
app.use("/sales-order", require("./modules/production/order/sales-order/salesOrder.route"));
app.use("/sla", require("./modules/production/order/sla/sla.route"));
app.use("/tax", require("./modules/production/order/tax/tax.route"));

app.use(router);


/**
 * Server initial
 */
const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Server up and running on: ${port} !`));
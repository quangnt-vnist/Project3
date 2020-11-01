import { IntlReducer as Intl } from 'react-redux-multilingual';
import { socket } from '../modules/socket/redux/reducers';
import { clearStorage } from '../config';
import { combineReducers } from 'redux';
import { systemSetting } from '../modules/system-admin/system-setting/redux/reducers';
import { auth } from '../modules/auth/redux/reducers';
import { company } from '../modules/system-admin/company/redux/reducers';
import { systemLinks } from '../modules/system-admin/system-link/redux/reducers';

import { system } from '../modules/super-admin/system/redux/reducers';
import { user } from '../modules/super-admin/user/redux/reducers';
import { role } from '../modules/super-admin/role/redux/reducers';
import { link } from '../modules/super-admin/link/redux/reducers';
import { component } from '../modules/super-admin/component/redux/reducers';
import { department } from '../modules/super-admin/organizational-unit/redux/reducers';
import { modelConfiguration } from '../modules/super-admin/module-configuration/redux/reducers';

import { employeesInfo } from '../modules/human-resource/profile/employee-info/redux/reducers';
import { employeesManager } from '../modules/human-resource/profile/employee-management/redux/reducers';
import { education } from '../modules/training/education-program/redux/reducers';
import { course } from '../modules/training/course/redux/reducers';
import { salary } from '../modules/human-resource/salary/redux/reducers';
import { discipline } from '../modules/human-resource/commendation-discipline/redux/reducers';
import { annualLeave } from '../modules/human-resource/annual-leave/redux/reducers';
import { workPlan } from '../modules/human-resource/work-plan/redux/reducers';
import { timesheets } from '../modules/human-resource/timesheets/redux/reducers';

import { career } from '../modules/human-resource/career-position/redux/reducers';
import { major } from '../modules/human-resource/major/redux/reducers';

import { notifications } from '../modules/notification/redux/reducers';
import { documents } from '../modules/document/redux/reducers';

import { createKpiUnit } from "../modules/kpi/organizational-unit/creation/redux/reducers";
import { dashboardOrganizationalUnitKpi } from "../modules/kpi/organizational-unit/dashboard/redux/reducers";
import { managerKpiUnit } from "../modules/kpi/organizational-unit/management/redux/reducers";
import { statisticsOfOrganizationalUnitKpi } from "../modules/kpi/statistic/redux/reducers";

import { createEmployeeKpiSet } from "../modules/kpi/employee/creation/redux/reducers"
import { KPIPersonalManager } from "../modules/kpi/employee/management/redux/reducers"
import { dashboardEmployeeKpiSet } from "../modules/kpi/employee/dashboard/redux/reducers"

import { tasktemplates } from '../modules/task/task-template/redux/reducers';
import { kpimembers } from '../modules/kpi/evaluation/employee-evaluation/redux/reducers';

import { dashboardEvaluationEmployeeKpiSet } from '../modules/kpi/evaluation/dashboard/redux/reducers';

import { performtasks } from "../modules/task/task-perform/redux/reducers";
import { tasks } from "../modules/task/task-management/redux/reducers";
import { rootRoles } from "../modules/system-admin/root-role/redux/reducers";
import { systemComponents } from "../modules/system-admin/system-component/redux/reducers";
import { taskProcess } from "../modules/task/task-process/redux/reducers"

//asset
import { recommendProcure } from "../modules/asset/user/purchase-request/redux/reducers";
import { recommendDistribute } from "../modules/asset/user/use-request/redux/reducers";
import { assetType } from "../modules/asset/admin/asset-type/redux/reducers";
import { assetsManager } from "../modules/asset/admin/asset-information/redux/reducers";
import { incidentManager } from "../modules/asset/admin/incident/redux/reducers";
import { mintainanceManager } from "../modules/asset/admin/maintainance/redux/reducers";

//report 
import { reports } from "../modules/report/task-report/redux/reducers";

//warehouse
import { stocks } from "../modules/production/warehouse/stock-management/redux/reducers";
import { categories } from "../modules/production/common-production/category-management/redux/reducers";
import { goods } from "../modules/production/common-production/good-management/redux/reducers";
import { binLocations } from "../modules/production/warehouse/bin-location-management/redux/reducers";
import { lots } from "../modules/production/warehouse/inventory-management/redux/reducers";

//crm
import { customers } from "../modules/crm/customer/redux/reducers";
import { groups } from "../modules/crm/group/redux/reducers";
import { status } from "../modules/crm/status/redux/reducers";
import { cares } from "../modules/crm/care/redux/reducers";
import { careTypes } from "../modules/crm/careType/redux/reducers";

//order
import { taxs } from "../modules/production/order/tax/redux/reducers";
import { quotes } from '../modules/production/order/quote/redux/reducers';

//plan
import { plan } from "../modules/plan/redux/reducers";


//example1
import { example1 } from "../modules/example/example1/redux/reducers";

//example2
import { example2 } from "../modules/example/example2/redux/reducers";

// Manufacturing
import { manufacturingWorks } from "../modules/production/manufacturing/manufacturing-works/redux/reducers";
import { manufacturingMill } from "../modules/production/manufacturing/manufacturing-mill/redux/reducers";
import { purchasingRequest } from "../modules/production/manufacturing/purchasing-request/redux/reducers";

const appReducer = combineReducers({
    socket,
    //system
    systemSetting,
    company,
    systemLinks,
    rootRoles,
    systemComponents,

    //admin
    system,
    user,
    role,
    link,
    component,
    department,
    modelConfiguration,

    //---------------------------
    documents,
    notifications,
    auth,

    // hr-employee
    employeesInfo,
    employeesManager,
    salary,
    discipline,
    annualLeave,
    workPlan,
    timesheets,

    // gói thầu
    career,
    major,

    // hr-tranning
    education,
    course,

    // kpi-unit
    createKpiUnit,
    dashboardOrganizationalUnitKpi,
    managerKpiUnit,
    statisticsOfOrganizationalUnitKpi,

    //kpi-personal
    createEmployeeKpiSet,
    KPIPersonalManager,
    dashboardEmployeeKpiSet,

    //tasktemplates
    tasktemplates,

    //task-managemnet
    tasks,
    performtasks,
    taskProcess,
    // kpi members
    kpimembers,

    // asset
    recommendProcure,
    recommendDistribute,
    assetType,
    assetsManager,
    incidentManager,
    mintainanceManager,

    dashboardEvaluationEmployeeKpiSet,

    //report
    reports,

    //warehouse
    stocks,
    categories,
    goods,
    binLocations,
    lots,

    // customer management
    crm: combineReducers({
        customers, groups, status, cares, careTypes
    }),

    //order
    taxs,
    quotes,
    //plane
    plan,

    //example1
    example1,

    //example2
    example2,

    // production - manufacturing works management

    manufacturingWorks,
    manufacturingMill,
    purchasingRequest,

    Intl

});

const rootReducer = (state, action) => {
    if (action.type === 'RESET') {
        state = undefined;
        clearStorage();
    }

    return appReducer(state, action);
}

export default rootReducer;
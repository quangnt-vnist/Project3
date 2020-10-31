const ROLE_TYPES = {
    ROOT: "Root",
    POSITION: "Position",
    COMPANY_DEFINED: "Company-Defined"
}
exports.ROLE_TYPES = ROLE_TYPES;

const ROOT_ROLES = {
    SYSTEM_ADMIN: {
        name: "System Admin",
        description: "Quản lý các doanh nghiệp/công ty sử dụng dịch vụ"
    },
    SUPER_ADMIN: {
        name: "Super Admin",
        description: "Super Admin của một doanh nghiệp/công ty. Chỉ có một Super Admin duy nhất, không thể xóa"
    },
    ADMIN: {
        name: "Admin",
        description: "Admin của một doanh nghiệp/công ty. Có thể có nhiều Admin"
    },
    DEAN: {
        name: "Dean",
        description: "Trưởng đơn vị trong một doanh nghiệp/công ty"
    },
    VICE_DEAN: {
        name: "Vice Dean",
        description: "Phó đơn vị trong một doanh nghiệp/công ty"
    },
    EMPLOYEE: {
        name: "Employee",
        description: "Nhân viên đơn vị trong một doanh nghiệp/công ty"
    },
}

exports.ROOT_ROLES = ROOT_ROLES;

const LINK_CATEGORY = {
    COMMON: {
        name: 'common',
        description: 'Các trang web dùng chung'
    },
    RBAC: {
        name: 'rbac-management',
        description: 'Quản lý phân quyền rbac'
    },
    KPI: {
        name: 'kpi-management',
        description: 'Quản lý kpi'
    },
    TASK: {
        name: 'task-management',
        description: 'Quản lý công việc'
    },
    HUMAN_RESOURCE: {
        name: 'employee-management',
        description: 'Quản lý nhân sự'
    },
    EDUCATION: {
        name: 'education-management',
        description: 'Quản lý đào tạo'
    },
    DOCUMENT: {
        name: 'document-management',
        description: 'Quản lý tài liệu, biểu mẫu'
    },
    PROCESS: {
        name: 'process-management',
        description: 'Quản lý quy trình'
    },
    ASSET: {
        name: 'asset-management',
        description: 'Quản lý tài sản'
    },
    REPORT: {
        name: 'report-management',
        description: 'Quản lý báo cáo'
    },
    WAREHOUSE: {
        name: 'stock-management',
        description: 'Quản lý kho'
    },
    ORDER: {
        name: "orders-management",
        description: "Quản lý đơn hàng"
    },
    CRM: {
        name: 'customer-management',
        description: 'Quản lý khách hàng'
    },
    PLAN: {
        name: "plans-management",
        description: "Quản lý kế hoạch sản xuất"
    },
    EXAMPLE: {
        name: "examples-management",
        description: "Quản lý ví dụ"
    },
    MANUFACTURING: {
        name: "manufacturing-management",
        description: "Quản lý sản xuất"
    }
};
exports.LINK_CATEGORY = LINK_CATEGORY;

const COMPONENTS = [{
    name: 'create-notification',
    description: 'Tạo thông báo mới',
    roles: [
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.SUPER_ADMIN.name,
    ],
    links: [
        '/notifications'
    ]
}, {
    name: 'create-task-template-button',
    description: 'Button thêm mới mẫu công việc',
    roles: [
        ROOT_ROLES.DEAN.name,
    ],
    links: [
        '/task-template'
    ]
}, {
    name: 'create-task-process-button',
    description: 'Button thêm mới mẫu quy trình công việc',
    roles: [
        ROOT_ROLES.DEAN.name,
    ],
    links: [
        '/task-process-template'
    ]
}, {
    name: 'create-asset',
    description: 'Button thêm mới tài sản',
    roles: [
        ROOT_ROLES.DEAN.name,
    ],
    links: [
        '/employee-manage-info-asset',
        '/manage-info-asset'
    ]
}];
exports.COMPONENTS = COMPONENTS;

const getComponentsInLink = (link) => {
    return COMPONENTS
        .filter(component => component.links.indexOf(link) !== -1)
        .map(component => component.name);
}

const LINKS = [{
    url: '/home',
    description: `Trang chủ công ty`,
    category: LINK_CATEGORY.COMMON.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name
    ],
    components: getComponentsInLink('/home')
},
{
    url: '/notifications',
    description: 'Thông báo',
    category: LINK_CATEGORY.COMMON.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/notifications')
},
{
    url: '/manage-configuration',
    description: 'Cấu hình hệ thống',
    category: LINK_CATEGORY.COMMON.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/manage-configuration')
},

{
    url: '/system-management',
    description: 'Quản lý sao lưu - phục hồi dữ liệu',
    category: LINK_CATEGORY.RBAC.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/system-management')
},

{
    url: '/departments-management',
    description: 'Quản lý cơ cấu tổ chức',
    category: LINK_CATEGORY.RBAC.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/departments-management')
},
{
    url: '/users-management',
    description: 'Quản lý người dùng',
    category: LINK_CATEGORY.RBAC.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/users-management')
},
{
    url: '/roles-management',
    description: 'Quản lý phân quyền',
    category: LINK_CATEGORY.RBAC.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/roles-management')
},
{
    url: '/links-management',
    description: 'Quản lý trang web của công ty',
    category: LINK_CATEGORY.RBAC.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/links-management')
},
{
    url: '/components-management',
    description: 'Quản lý các thành phần UI trên trang web của công ty',
    category: LINK_CATEGORY.RBAC.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/components-management')
},



{
    url: '/documents-management',
    description: 'Quản lý tài liệu biểu mẫu',
    category: LINK_CATEGORY.DOCUMENT.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/documents-management')
},
{
    url: '/documents',
    description: 'Tài liệu',
    category: LINK_CATEGORY.DOCUMENT.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/documents')
},

{
    url: '/hr-employee-capacity',
    description: 'Năng lực nhân viên',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-employee-capacity')
},
{
    url: '/hr-manage-work-plan',
    description: 'Quản lý kế hoạch làm việc',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-manage-work-plan')
},
{
    url: '/hr-add-employee',
    description: 'Thêm mới nhân viên',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-add-employee')
},
{
    url: '/hr-list-employee',
    description: 'Quản lý thông tin nhân viên',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-list-employee')
},
{
    url: '/hr-manage-department',
    description: 'Quản lý nhân sự các đơn vị',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-manage-department')
},
{
    url: '/hr-update-employee',
    description: 'Cập nhật thông tin cá nhân của nhân viên',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/hr-update-employee')
},
{
    url: '/hr-detail-employee',
    description: 'Thông tin cá nhân của nhân viên',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/hr-detail-employee')
},
{
    url: '/hr-annual-leave-personal',
    description: 'Nghỉ phép',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/hr-annual-leave-personal')
},
{
    url: '/hr-dashboard-personal',
    description: 'Bảng tin cá nhân',
    category: LINK_CATEGORY.COMMON.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/hr-dashboard-personal')
},
{
    url: '/hr-manage-leave-application',
    description: 'Quản lý đơn xin nghỉ phép',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
    ],
    components: getComponentsInLink('/hr-manage-leave-application')
},
{
    url: '/hr-salary-employee',
    description: 'Quản lý lương nhân viên',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-salary-employee')
},
{
    url: '/hr-annual-leave',
    description: 'Quản lý nghỉ phép của nhân viên',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-annual-leave')
},
{
    url: '/hr-discipline',
    description: 'Quản lý khen thưởng, kỷ luật',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-discipline')
},
{
    url: '/hr-dashboard-employee',
    description: 'Dashboard nhân sự',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-dashboard-employee')
},
{
    url: '/hr-time-keeping',
    description: 'Quản lý chấm công',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-time-keeping')
},



{
    url: '/hr-trainning-course',
    description: 'Quản lý đào tạo',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-trainning-course')
},
{
    url: '/hr-account',
    description: 'Thông tin tài khoản ',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-account')
},
{
    url: '/hr-training-plan',
    description: 'Kế hoạch đào tạo',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-training-plan')
},
{
    url: '/hr-list-education',
    description: 'Chương trình đào tạo bắt buộc',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-list-education')
},




// KPI
{
    url: '/kpi-units/create',
    description: 'Khởi tạo KPI đơn vị',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.DEAN.name,
    ],
    components: getComponentsInLink('/kpi-units/create')
},
{
    url: '/kpi-units/dashboard',
    description: 'Dashboard KPI đơn vị',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/kpi-units/dashboard')
},
{
    url: '/kpi-units/manager',
    description: 'Quản lý KPI đơn vị',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.DEAN.name,
    ],
    components: getComponentsInLink('/kpi-units/manager')
},
{
    url: '/kpi-units/statistic',
    description: 'Thống kê KPI đơn vị',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.DEAN.name,
    ],
    components: getComponentsInLink('/kpi-units/statistic')
},
{
    url: '/kpi-member/manager',
    description: 'Quản lí kpi nhân viên',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.DEAN.name,
    ],
    components: getComponentsInLink('/kpi-member/manager')
},
{
    url: '/kpi-member/dashboard',
    description: 'Dashboard KPI nhân viên',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.DEAN.name,
    ],
    components: getComponentsInLink('/kpi-member/dashboard')
},
{
    url: '/kpi-personals/dashboard',
    description: 'DashBoard Kpi cá nhân',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/kpi-personals/dashboard')
},
{
    url: '/kpi-personals/create',
    description: 'Khởi tạo KPI cá nhân',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/kpi-personals/create')
},
{
    url: '/kpi-personals/manager',
    description: 'Quản lí KPI cá nhân',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/kpi-personals/manager')
},





{
    url: '/task-template',
    description: 'Mẫu công việc',
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/task-template')
},
{
    url: '/task-management',
    description: 'Xem danh sách công việc',
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/task-management')
},
{
    url: '/task-management-unit',
    description: 'Xem danh sách công việc đơn vị',
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.DEAN.name
    ],
    components: getComponentsInLink('/task-management-unit')
},
{
    url: '/task-process-management',
    description: 'Danh sách quy trình công việc',
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ]
},
{
    url: '/task-process-template',
    description: 'Mẫu quy trình công việc',
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/task-process-template')

},
{
    url: '/task-management-dashboard',
    description: 'Dashboard công việc',
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/task-management-dashboard')
},
{
    url: '/task-organization-management-dashboard',
    description: 'Dashboard công việc của đơn vị',
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.DEAN.name,
    ],
    components: getComponentsInLink('/task-organization-management-dashboard')
},
{
    url: '/task',
    description: 'Chi tiết công việc',
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/task')
},





{
    url: '/dashboard-asset',
    description: 'DashBoard quản lý tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/dashboard-asset')
},
{
    url: '/manage-type-asset',
    description: 'Quản lý loại tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-type-asset')
},
{
    url: '/manage-info-asset',
    description: 'Quản lý thông tin tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-info-asset')
},
{
    url: '/manage-maintainance-asset',
    description: 'Quản lý bảo trì tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-maintainance-asset')
},
{
    url: '/manage-usage-asset',
    description: 'Quản lý sử dụng tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        // ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-usage-asset')
},
{
    url: '/manage-depreciation-asset',
    description: 'Quản lý khấu hao tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-depreciation-asset')
},
{
    url: '/manage-incident-asset',
    description: 'Quản lý sự cố tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-incident-asset')
},
{
    url: '/manage-asset-purchase-request',
    description: 'Quản lý đề nghị mua sắm tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-asset-purchase-request')
},
{
    url: '/manage-asset-use-request',
    description: 'Quản lý đăng ký sử dụng tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-asset-use-request')
},

{
    url: '/employee-manage-info-asset',
    description: 'Quản lý thông tin tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/employee-manage-info-asset')
},
{
    url: '/employee-manage-incident-asset',
    description: 'Quản lý thông tin sự cố tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/employee-manage-incident-asset')
},
{
    url: '/employee-manage-asset-use-request',
    description: 'Quản lý đăng kí sử dụng tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/employee-manage-asset-use-request')
},


{
    url: '/asset-purchase-request',
    description: 'Đăng ký mua sắm tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/asset-purchase-request')
},
{
    url: '/asset-use-request',
    description: 'Đăng ký sử dụng tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/asset-use-request')
},
{
    url: '/manage-assigned-asset',
    description: 'Quản lý tài sản được bàn giao',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-assigned-asset')
},
{
    url: '/view-building-list',
    description: 'Xem danh sách mặt bằng',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/view-building-list')
},




{
    url: '/task-report',
    description: 'Quản lý báo cáo công việc',
    category: LINK_CATEGORY.REPORT.name,
    roles: [
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/task-report')
},

{
    url: '/dashboard-inventory',
    description: 'Bảng tin quản lý hàng tồn',
    category: LINK_CATEGORY.WAREHOUSE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/dashboard-inventory')
},
{
    url: '/dashboard-bill',
    description: 'Bảng tin quản lý các phiếu',
    category: LINK_CATEGORY.WAREHOUSE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/dashboard-bill')
},
{
    url: '/stock-management',
    description: 'Quản lý thông tin kho',
    category: LINK_CATEGORY.WAREHOUSE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/stock-management')
},
{
    url: '/bin-location-management',
    description: 'Quản lý thông tin lưu kho',
    category: LINK_CATEGORY.WAREHOUSE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/bin-location-management')
},
{
    url: '/category-management',
    description: 'Quản lý danh mục hàng hóa',
    category: LINK_CATEGORY.WAREHOUSE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/category-management')
},
{
    url: '/good-management',
    description: 'Quản lý thông tin hàng hóa',
    category: LINK_CATEGORY.WAREHOUSE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/good-management')
},
{
    url: '/bill-management',
    description: 'Quản lý thông tin phiếu',
    category: LINK_CATEGORY.WAREHOUSE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/bill-management')
},
{
    url: '/inventory-management',
    description: 'Quản lý hàng tồn kho',
    category: LINK_CATEGORY.WAREHOUSE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/inventory-management')
},
{
    url: "/manage-sales-order",
    description: "Đơn hàng kinh doanh",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-sales-order'),
},
{
    url: "/manage-manufacturing-order",
    description: "Đơn hàng sản xuất",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-manufacturing-order'),
},
{
    url: "/manage-purchase-order",
    description: "Đơn mua hàng",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-purchase-order'),
},
{
    url: "/manage-quote",
    description: "Báo giá",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-quote'),
},
{
    url: "/manage-sales-order-dashboard",
    description: "Dashboard đơn kinh doanh",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-sales-order-dashboard'),
},
{
    url: "/manage-manufacturing-order-dashboard",
    description: "Dashboard đơn sản xuất",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-manufacturing-order-dashboard'),
},
{
    url: "/manage-discount",
    description: "Khuyến mãi",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-discount'),
},
{
    url: "/manage-tax",
    description: "Thuế",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],

    components: getComponentsInLink('/manage-tax'),
},
{
    url: "/manage-sla",
    description: "Cam kết chất lượng",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-sla'),
},
{
    url: '/crm/dashboard',
    description: `Bảng tin quản lý khách hàng`,
    category: LINK_CATEGORY.CRM.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/crm/dashboard')
},
{
    url: '/crm/customer',
    description: `Quản lý khách hàng`,
    category: LINK_CATEGORY.CRM.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/crm/customer')
}, {
    url: '/crm/lead',
    description: `Khách hàng thân thiết`,
    category: LINK_CATEGORY.CRM.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/crm/lead')
},
{
    url: '/crm/group',
    description: `Quản lý nhóm khách hàng`,
    category: LINK_CATEGORY.CRM.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/crm/group')
},
{
    url: '/crm/care',
    description: `Chăm sóc khách hàng`,
    category: LINK_CATEGORY.CRM.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/crm/care')
},
{
    url: "/manage-plans",
    description: "Quản lý đơn hàng",
    category: LINK_CATEGORY.PLAN.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-plans'),
},
{
    url: "/manage-examples-1",
    description: "Quản lý Ví dụ 1",
    category: LINK_CATEGORY.EXAMPLE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-examples-1'),
},
{
    url: "/manage-examples-2",
    description: "Quản lý Ví dụ 2",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.DEAN.name,
        ROOT_ROLES.VICE_DEAN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-examples-2'),
},
{
    url: "/manage-manufacturing-plan",
    description: "Quản lý kế hoạch sản xuất",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/manage-manufacturing-plan'),
},
{
    url: "/manage-manufacturing-command",
    description: "Quản lý lệnh sản xuất",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/manage-manufacturing-command'),
},
{
    url: "/manage-manufacturing-process",
    description: "Quản lý tiến trình sản xuất",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/manage-manufacturing-process'),
},
{
    url: "/manage-manufacturing-schedule",
    description: "Quản lý lịch sản xuất",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/manage-manufacturing-schedule'),
},
{
    url: "/manage-purchasing-request",
    description: "Quản lý phiếu đề nghị mua hàng",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/manage-purchasing-request'),
},
{
    url: "/manufacturing-dashboard",
    description: "Dashboard Quản lý sản xuất",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/track-order'),
},
{
    url: "/analysis-manufacturing-performance",
    description: "Phân tích hiệu suất sản xuất",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/analysis-manufacturing-performance'),
},
{
    url: "/manage-manufacturing-works",
    description: "Quản lý nhà máy sản xuất",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/manage-manufacturing-works'),
},
{
    url: "/manage-manufacturing-mill",
    description: "Quản lý xưởng sản xuất",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/manage-manufacturing-mill'),
},
];

exports.LINKS = LINKS;
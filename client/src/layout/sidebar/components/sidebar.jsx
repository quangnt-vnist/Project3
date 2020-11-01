import React, { Component } from "react";
import Item from "./item";
import GroupItem from "./groupItem";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withTranslate } from "react-redux-multilingual";
import { ApiImage } from "../../../common-components";

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    checkURL = (urlName, linkArr) => {
        var result = false;
        if (linkArr !== undefined) {
            linkArr.forEach((link) => {
                if (link.url === urlName) {
                    result = true;
                }
            });
        }

        return result;
    };

    render() {
        const { translate, auth } = this.props;
        const { user, links } = this.props.auth;

        return (
            <React.Fragment>
                <aside className="main-sidebar" style={{ minHeight: "100vh" }}>
                    <section className="sidebar">
                        <div className="user-panel">
                            <div className="pull-left image">
                                <img
                                    src={
                                        process.env.REACT_APP_SERVER +
                                        auth.user.avatar
                                    }
                                    className="img-circle"
                                    alt="User avatar"
                                />
                            </div>
                            <div className="pull-left info">
                                <p>{user.name}</p>
                                {this.checkURL("/notifications", links) ? (
                                    <React.Fragment>
                                        <span
                                            style={{
                                                fontSize: "10px",
                                                marginRight: "10px",
                                            }}
                                        >
                                            <i className="fa fa-circle text-success"></i>{" "}
                                            Online{" "}
                                        </span>
                                        <Link to="/notifications">
                                            <i className="fa fa-bell text-yellow"></i>
                                            {translate("menu.notifications")}
                                        </Link>
                                    </React.Fragment>
                                ) : (
                                        <p style={{ fontSize: "10px" }}>
                                            <i className="fa fa-circle text-success"></i>{" "}
                                        Online{" "}
                                        </p>
                                    )}
                            </div>
                        </div>
                        <ul
                            className="sidebar-menu"
                            data-widget="tree"
                            ref="sideBarMenu"
                        >
                            {/* Trang chủ */}
                            <Item
                                item={{
                                    name: "menu.home",
                                    path: "/home",
                                    icon: "fa fa-home",
                                }}
                            />

                            {/* Bảng tin nhân viên */}
                            <Item
                                item={{
                                    name: "menu.dashboard_personal",
                                    path: "/hr-dashboard-personal",
                                    icon: "fa fa-newspaper-o",
                                }}
                            />

                            {/* Tài khoản cá nhân */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.account",
                                    icon: "fa fa-user-circle",
                                    list: [
                                        {
                                            name: "menu.detail_employee",
                                            icon: "fa fa-user-o",
                                            path: "/hr-detail-employee",
                                        },
                                        {
                                            name: "menu.update_employee",
                                            icon: "fa fa-pencil-square-o",
                                            path: "/hr-update-employee",
                                        },
                                        {
                                            name: "menu.annual_leave_personal",
                                            icon: "fa fa-calendar",
                                            path: "/hr-annual-leave-personal",
                                        },
                                    ],
                                }}
                            />

                            {/* Quản trị của system admin */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.system_administration",
                                    icon: "fa fa-gears",
                                    list: [
                                        {
                                            name: "menu.manage_system",
                                            icon: "fa fa-gear",
                                            path: "/system/settings",
                                        },
                                        {
                                            name: "menu.manage_role",
                                            icon: "fa fa-lock",
                                            path:
                                                "/system/roles-default-management",
                                        },
                                        {
                                            name: "menu.manage_link",
                                            icon: "fa fa-link",
                                            path:
                                                "/system/links-default-management",
                                        },
                                        {
                                            name: "menu.manage_component",
                                            icon: "fa fa-object-group",
                                            path:
                                                "/system/components-default-management",
                                        },
                                    ],
                                }}
                            />

                            {/* Quản lý doanh nghiệp */}
                            <Item
                                item={{
                                    name: "menu.manage_company",
                                    icon: "fa fa-building",
                                    path: "/system/companies-management",
                                }}
                            />

                            {/* Phân quyền IAM-RBAC */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.system_administration",
                                    icon: "fa fa-key",
                                    list: [
                                        {
                                            name: "menu.manage_configuration",
                                            icon: "fa fa-gear",
                                            path: "/manage-configuration",
                                        },
                                        {
                                            name: "menu.manage_system",
                                            icon: "fa fa-database",
                                            path: "/system-management",
                                        },
                                        {
                                            name: "menu.manage_department",
                                            icon: "fa fa-sitemap",
                                            path: "/departments-management",
                                        },
                                        {
                                            name: "menu.manage_user",
                                            icon: "fa fa-users",
                                            path: "/users-management",
                                        },
                                        {
                                            name: "menu.manage_role",
                                            icon: "fa fa-lock",
                                            path: "/roles-management",
                                        },
                                        {
                                            name: "menu.manage_link",
                                            icon: "fa fa-link",
                                            path: "/links-management",
                                        },
                                        {
                                            name: "menu.manage_component",
                                            icon: "fa fa-object-group",
                                            path: "/components-management",
                                        },
                                    ],
                                }}
                            />

                            {/* Quản lý tài liệu */}
                            <Item
                                item={{
                                    name: "menu.manage_document",
                                    icon: "fa fa-folder-open",
                                    path: "/documents-management",
                                }}
                            />
                            <Item
                                item={{
                                    name: "menu.manage_document",
                                    icon: "fa fa-file-text",
                                    path: "/documents",
                                }}
                            />

                            {/* Quản lý kho */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_warehouse",
                                    icon: "fa fa-safari",
                                    list: [
                                        {
                                            name: "menu.dashboard_inventory",
                                            icon: "fa fa-dashboard",
                                            path: "/dashboard-inventory",
                                        },
                                        {
                                            name: "menu.dashboard_bill",
                                            icon: "fa fa-dashboard",
                                            path: "/dashboard-bill",
                                        },
                                        {
                                            name: "menu.stock_management",
                                            icon: "fa fa-bank",
                                            path: "/stock-management",
                                        },
                                        {
                                            name:
                                                "menu.bin_location_management",
                                            icon: "fa fa-sitemap",
                                            path: "/bin-location-management",
                                        },
                                        {
                                            name: "menu.category_management",
                                            icon: "fa fa-cubes",
                                            path: "/category-management",
                                        },
                                        {
                                            name: "menu.good_management",
                                            icon: "fa fa-gift",
                                            path: "/good-management",
                                        },
                                        {
                                            name: "menu.bill_management",
                                            icon: "fa fa-reorder",
                                            path: "/bill-management",
                                        },
                                        {
                                            name: "menu.inventory_management",
                                            icon: "fa fa-times-circle-o",
                                            path: "/inventory-management",
                                        },
                                    ],
                                }}
                            />

                            {/* Quản lý khách hàng */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.customer_Management",
                                    icon: "fa fa-users",
                                    list: [
                                        {
                                            name: "menu.crm_list.dashboard",
                                            icon: "fa fa-dashboard",
                                            path: "/crm/dashboard",
                                        },
                                        {
                                            name: "menu.crm_list.customer",
                                            icon: "fa fa-circle-o",
                                            path: "/crm/customer",
                                        },
                                        {
                                            name: "menu.crm_list.lead",
                                            icon: "fa fa-circle-o",
                                            path: "/crm/lead",
                                        },
                                        {
                                            name: "menu.crm_list.care",
                                            icon: "fa fa-circle-o",
                                            path: "/crm/care",
                                        },
                                        {
                                            name: "menu.crm_list.group",
                                            icon: "fa fa-circle-o",
                                            path: "/crm/group",
                                        },
                                        {
                                            name: "menu.crm_list.statistic",
                                            icon: "fa fa-circle-o",
                                            path: "/crm/statistic",
                                        },
                                    ],
                                }}
                            />

                            {/* Quan ly tai san */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_asset",
                                    icon: "fa fa-address-book",
                                    list: [
                                        {
                                            name: "menu.dashboard_asset",
                                            icon: "fa fa-dashboard",
                                            path: "/dashboard-asset",
                                        },
                                        {
                                            name: "menu.manage_info_asset",
                                            icon: "fa fa-sitemap",
                                            path: "/manage-info-asset",
                                        },
                                        {
                                            name:
                                                "menu.manage_depreciation_asset",
                                            icon: "fa fa-balance-scale",
                                            path: "/manage-depreciation-asset",
                                        },
                                        {
                                            name:
                                                "menu.manage_maintainance_asset",
                                            icon: "fa fa-sitemap",
                                            path: "/manage-maintainance-asset",
                                        },
                                        {
                                            name: "menu.manage_incident_asset",
                                            icon: "fa fa-calendar",
                                            path: "/manage-incident-asset",
                                        },
                                        {
                                            name:
                                                "menu.manage_recommend_distribute_asset",
                                            icon: "fa fa-calendar",
                                            path: "/manage-asset-use-request",
                                        },
                                        {
                                            name: "menu.manage_usage_asset",
                                            icon: "fa fa-sitemap",
                                            path: "/manage-usage-asset",
                                        },
                                        {
                                            name:
                                                "menu.manage_recommend_procure",
                                            icon: "fa fa-sitemap",
                                            path:
                                                "/manage-asset-purchase-request",
                                        },
                                        {
                                            name: "menu.manage_type_asset",
                                            icon: "fa fa-dashboard",
                                            path: "/manage-type-asset",
                                        },
                                        {
                                            name: "menu.view_building_list",
                                            icon: "fa fa-building",
                                            path: "/view-building-list",
                                        },
                                        {
                                            name: "menu.manage_assigned_asset",
                                            icon: "fa fa-calendar",
                                            path: "/manage-assigned-asset",
                                        },
                                        {
                                            name:
                                                "menu.employee_manage_asset_info",
                                            icon: "fa fa-sitemap",
                                            path: "/employee-manage-info-asset",
                                        },
                                        {
                                            name:
                                                "menu.recommend_distribute_asset",
                                            icon: "fa fa-calendar",
                                            path: "/asset-use-request",
                                        },
                                        {
                                            name:
                                                "menu.recommend_equipment_procurement",
                                            icon: "fa fa-calendar",
                                            path: "/asset-purchase-request",
                                        },
                                    ],
                                }}
                            />

                            {/* Quản lý đơn xin nghỉ phép */}
                            <Item
                                item={{
                                    name: "menu.leave_application",
                                    icon: "fa fa-envelope",
                                    path: "/hr-manage-leave-application",
                                }}
                            />

                            {/* Quản lý nhân sự */}
                            <GroupItem groupItem={{
                                name: 'menu.manage_employee',
                                icon: 'fa fa-address-book',
                                list: [
                                    { name: 'menu.dashboard_employee', icon: 'fa fa-dashboard', path: '/hr-dashboard-employee' },
                                    { name: 'menu.employee_capacity', icon: 'fa fa-dashboard', path: '/hr-employee-capacity' },
                                    { name: 'menu.manage_unit', icon: 'fa fa-sitemap', path: '/hr-manage-department' },
                                    { name: 'menu.add_employee', icon: 'fa fa-user-plus', path: '/hr-add-employee' },
                                    { name: 'menu.list_employee', icon: 'fa fa-address-card', path: '/hr-list-employee' },
                                    { name: 'menu.salary_employee', icon: 'fa fa-line-chart', path: '/hr-salary-employee' },
                                    { name: 'menu.time_keeping', icon: 'fa fa-calculator', path: '/hr-time-keeping' },
                                    { name: 'menu.discipline', icon: 'fa fa-balance-scale', path: '/hr-discipline' },
                                    { name: 'menu.annual_leave', icon: 'fa fa-calendar-times-o', path: '/hr-annual-leave' },
                                    { name: 'menu.manage_work_plan', icon: 'fa fa-calendar', path: '/hr-manage-work-plan' },
                                    // nhân sự gói thầu
                                    { name: 'menu.list_search_for_package', icon: 'fa fa-calendar', path: '/hr-search-for-package' },
                                    { name: 'menu.list_major', icon: 'fa fa-calendar', path: '/hr-list-major' },
                                    { name: 'menu.list_career_position', icon: 'fa fa-calendar', path: '/hr-list-career-position' },
                                ]
                            }} />

                            {/* Quản lý đào tạo */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_training",
                                    icon: "fa fa-graduation-cap",
                                    list: [
                                        {
                                            name: "menu.list_education",
                                            icon: "fa fa-university",
                                            path: "/hr-list-education",
                                        },
                                        {
                                            name: "menu.training_plan",
                                            icon: "fa fa-list-alt",
                                            path: "/hr-training-plan",
                                        },
                                    ],
                                }}
                            />

                            {/* kpi-management */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_kpi",
                                    icon: "fa fa-dashboard",
                                    list: [
                                        {
                                            name: "menu.kpi_unit_dashboard",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-units/dashboard",
                                        },
                                        {
                                            name: "menu.kpi_unit_create",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-units/create",
                                        },
                                        {
                                            name: "menu.kpi_unit_manager",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-units/manager",
                                        },
                                        {
                                            name: "menu.kpi_unit_statistic",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-units/statistic",
                                        },
                                        {
                                            name: "menu.kpi_member_dashboard",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-member/dashboard",
                                        },
                                        {
                                            name: "menu.kpi_member_manager",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-member/manager",
                                        },
                                        {
                                            name: "menu.kpi_personal_dashboard",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-personals/dashboard",
                                        },
                                        {
                                            name: "menu.kpi_personal_create",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-personals/create",
                                        },
                                        {
                                            name: "menu.kpi_personal_manager",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-personals/manager",
                                        },

                                        // { name: 'menu.kpi_unit_overview', icon: 'fa fa-circle-o', path: '/kpi-units/overview' },
                                        // { name: 'menu.kpi_personal_overview', icon: 'fa fa-circle-o', path: '/kpi-personals/overview' },
                                    ],
                                }}
                            />

                            {/* Quản lý đơn hàng */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_orders",
                                    icon: "fa  fa-book",
                                    list: [
                                        {
                                            name:
                                                "menu.manage_sales_order_dashboard",
                                            icon: "fa fa-dashboard",
                                            path:
                                                "/manage-sales-order-dashboard",
                                        },
                                        {
                                            name:
                                                "menu.manage_manufacturing_order_dashboard",
                                            icon: "fa  fa-dashboard",
                                            path:
                                                "/manage-manufacturing-order-dashboard",
                                        },
                                        {
                                            name: "menu.manage_quote",
                                            icon: "fa fa-tablet",
                                            path: "/manage-quote",
                                        },
                                        {
                                            name: "menu.manage_sales_order",
                                            icon: "fa fa-dollar",
                                            path: "/manage-sales-order",
                                        },
                                        {
                                            name:
                                                "menu.manage_manufacturing_order",
                                            icon: "fa  fa-flask",
                                            path: "/manage-manufacturing-order",
                                        },
                                        {
                                            name: "menu.manage_purchase_order",
                                            icon: "fa fa-shopping-cart",
                                            path: "/manage-purchase-order",
                                        },
                                        {
                                            name: "menu.manage_discount",
                                            icon: "fa fa-arrow-down",
                                            path: "/manage-discount",
                                        },
                                        {
                                            name: "menu.manage_tax",
                                            icon: "fa fa-money",
                                            path: "/manage-tax",
                                        },
                                        {
                                            name: "menu.manage_sla",
                                            icon: "fa fa-registered",
                                            path: "/manage-sla",
                                        },
                                    ],
                                }}
                            />

                            <Item
                                item={{
                                    name: "menu.task_template",
                                    icon: "fa fa-flash",
                                    path: "/task-template",
                                }}
                            />

                            {/* Task management */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.tasks",
                                    icon: "fa fa-tasks",
                                    list: [
                                        {
                                            name:
                                                "menu.task_organization_management_dashboard",
                                            icon: "fa fa-circle-o",
                                            path:
                                                "/task-organization-management-dashboard",
                                        },
                                        {
                                            name:
                                                "menu.task_management_dashboard",
                                            icon: "fa fa-circle-o",
                                            path: "/task-management-dashboard",
                                        },
                                        {
                                            name:
                                                'menu.task_management_of_unit',
                                            icon: 'fa fa-circle-o',
                                            path: '/task-management-unit'
                                        },
                                        {
                                            name: "menu.task_management",
                                            icon: "fa fa-circle-o",
                                            path: "/task-management",
                                        },
                                        {
                                            name: "menu.task_process_template",
                                            icon: "fa fa-circle-o",
                                            path: "/task-process-template",
                                        },
                                        {
                                            name:
                                                "menu.task_management_process",
                                            icon: "fa fa-circle-o",
                                            path: "/task-process-management",
                                        },
                                    ],
                                }}
                            />

                            {/* Report management */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.report_management",
                                    icon: "fa fa-calendar",
                                    list: [
                                        {
                                            name: "menu.task_report",
                                            icon: "fa fa-circle-o",
                                            path: "/task-report",
                                        },
                                    ],
                                }}
                            />

                            {/* Quản lý kế hoạch sản xuất */}
                            {/* <Item item={{ name: 'menu.manage_plans', icon: 'fa fa-calendar', path: '/manage-plans' }} /> */}

                            {/* CRUD ví dụ theo 2 mô hình lấy dữ liệu */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_examples",
                                    icon: "fa fa-edit",
                                    list: [
                                        {
                                            name: "menu.manage_examples_1",
                                            icon: "fa fa-circle",
                                            path: "/manage-examples-1",
                                        },
                                        {
                                            name: "menu.manage_examples_2",
                                            icon: "fa fa-adjust",
                                            path: "/manage-examples-2",
                                        },
                                    ],
                                }}
                            />

                            {/* Quản lý sản xuất */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_manufacturing",
                                    icon: "fa fa-gears",
                                    list: [
                                        {
                                            name:
                                                "menu.manufacturing_dashboard",
                                            icon: "fa fa-dashboard",
                                            path: "/manufacturing-dashboard",
                                        },
                                        {
                                            name:
                                                "menu.manage_manufacturing_plan",
                                            icon: "fa fa-file-o",
                                            path: "/manage-manufacturing-plan",
                                        },
                                        {
                                            name:
                                                "menu.manage_manufacturing_command",
                                            icon: "fa fa-gavel",
                                            path:
                                                "/manage-manufacturing-command",
                                        },
                                        {
                                            name:
                                                "menu.manage_manufacturing_process",
                                            icon: "fa fa-line-chart",
                                            path:
                                                "/manage-manufacturing-process",
                                        },
                                        // { name: 'menu.manage_manufacturing_schedule', icon: 'fa fa-calendar', path: '/manage-manufacturing-schedule' },
                                        {
                                            name:
                                                "menu.manage_purchasing_request",
                                            icon: "fa fa-file-text-o",
                                            path: "/manage-purchasing-request",
                                        },
                                        {
                                            name:
                                                "menu.analysis_manufacturing_performance",
                                            icon: "fa fa-bar-chart",
                                            path:
                                                "/analysis-manufacturing-performance",
                                        },
                                        {
                                            name:
                                                "menu.manage_manufacturing_works",
                                            icon: "fa fa-university",
                                            path: "/manage-manufacturing-works",
                                        },
                                        {
                                            name:
                                                "menu.manage_manufacturing_mill",
                                            icon: "fa fa-home",
                                            path: "/manage-manufacturing-mill",
                                        },
                                    ],
                                }}
                            />
                        </ul>
                    </section>
                </aside>
            </React.Fragment>
        );
    }

    findActiveMenu = (element) => {
        if (element.nodeName === "LI" && element.className === "active") {
            return element;
        }
        for (let i = 0; i < element.childNodes.length; ++i) {
            let child = this.findActiveMenu(element.childNodes[i]);
            if (child !== null) {
                return child;
            }
        }
        return null;
    };

    updateParentMenus = (element) => {
        element = element.parentNode;
        if (window.$(element).attr("data-widget") === "tree") {
            return;
        }
        if (element.nodeName === "LI") {
            element.className = "active treeview menu-open";
        }
        this.updateParentMenus(element);
    };

    componentDidUpdate() {
        // Tìm active menu
        let activeElement = this.findActiveMenu(this.refs.sideBarMenu);

        if (activeElement !== null) {
            // Update style của các menu cha
            this.updateParentMenus(activeElement);
        }

        /**
         * Fix bug khi menu quá dài, div content-wrapper không dài theo, dẫn đến footer không đặt ở cuối trang
         * Xem code AdminLTE
         */
        window.$(".sidebar-menu").layout();
        window.$(".sidebar-menu").data("lte.layout").fix();
    }
    componentDidMount() {
        /**
         * Yêu cầu AdminLTE tạo lại menu. Ý nghĩa: Khắc phục lỗi với menu của template AdminLTE như sau.
         * Do AdminLTE chỉ quét 1 lần (sự kiện onload) element có data là data-widget = tree để xử lý sự kiện collapse, expand menu
         * Nên khi chọn 1 menu item để chuyển trang, side menu được tạo lại, không được xử lý sự kiện nữa
         * Xem thêm trong adminlte.min.js
         */
        window.$(".sidebar-menu").tree();
    }
}

const mapStates = (state) => state;

const dispatchStateToProps = {};

export default connect(mapStates, dispatchStateToProps)(withTranslate(SideBar));

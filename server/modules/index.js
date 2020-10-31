module.exports = {
    mt_auth: require('./auth/auth.route'),

    mt_user: require('./super-admin/user/user.route'),
    mt_role: require('./super-admin/role/role.route'),
    mt_component: require("./super-admin/component/component.route"),
    mt_link: require("./super-admin/link/link.route"),
    mt_organizationalUnit: require("./super-admin/organizational-unit/organizationalUnit.route"),
    mt_privilege: require("./super-admin/privilege/privilege.route"),
    
    mt_company: require("./system-admin/company/company.route"),
    mt_systemComponent: require("./system-admin/system-component/systemComponent.route"),
    mt_systemLink: require("./system-admin/system-link/systemLink.route"),
    mt_rootRole: require("./system-admin/root-role/rootRole.route"),
    mt_systemSetting: require("./system-admin/system-setting/systemSetting.route"),
}
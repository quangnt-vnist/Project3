import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { EmployeeInfoActions } from '../redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import {
    GeneralTab, ContactTab, TaxTab, InsurranceTab, SalaryTab,
    DisciplineTab, AttachmentTab, ExperiencTab, CertificateTab, ContractTab,
} from './combinedContent';
class EmployeeDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount = async () => {
        this.props.getEmployeeProfile({ callAPIByUser: true });
        this.props.getDepartment();
    }

    render() {
        const { employeesInfo, translate } = this.props;

        let employees, salaries, annualLeaves, commendations, disciplines, courses, roles = [];

        if (employeesInfo.employees) employees = employeesInfo.employees;
        if (employeesInfo.salaries) salaries = employeesInfo.salaries;
        if (employeesInfo.annualLeaves) annualLeaves = employeesInfo.annualLeaves;
        if (employeesInfo.commendations) commendations = employeesInfo.commendations;
        if (employeesInfo.disciplines) disciplines = employeesInfo.disciplines;
        if (employeesInfo.courses) courses = employeesInfo.courses
        if (employeesInfo.roles) roles = employeesInfo.roles

        return (
            <React.Fragment>
                {
                    employees && employees.length === 0 && employeesInfo.isLoading === false &&
                    <div className="box">
                        <div className="box-body qlcv" style={{ height: '100vh' }}>
                            <strong>{translate('human_resource.profile.employee_info.no_data_personal')}</strong>
                        </div>
                    </div>
                }
                {(typeof employees !== 'undefined' && employees.length !== 0) &&
                    employees.map((x, index) => (
                        <div className="row" key={index}>
                            <div className="col-sm-12">
                                <div className="nav-tabs-custom">
                                    <ul className="nav nav-tabs">
                                        <li className="active"><a title={translate('human_resource.profile.tab_name.menu_general_infor_title')} data-toggle="tab" href="#view_general">{translate('human_resource.profile.tab_name.menu_general_infor')}</a></li>
                                        <li><a title={translate('human_resource.profile.tab_name.menu_contact_infor_title')} data-toggle="tab" href="#view_contact">{translate('human_resource.profile.tab_name.menu_contact_infor')}</a></li>
                                        <li><a title={translate('human_resource.profile.tab_name.menu_education_experience_title')} data-toggle="tab" href="#view_experience">{translate('human_resource.profile.tab_name.menu_education_experience')}</a></li>
                                        <li><a title={translate('human_resource.profile.tab_name.menu_diploma_certificate_title')} data-toggle="tab" href="#view_diploma">{translate('human_resource.profile.tab_name.menu_diploma_certificate')}</a></li>
                                        <li><a title={translate('human_resource.profile.tab_name.menu_account_tax_title')} data-toggle="tab" href="#view_account">{translate('human_resource.profile.tab_name.menu_account_tax')}</a></li>
                                        <li><a title={translate('human_resource.profile.tab_name.menu_insurrance_infor_title')} data-toggle="tab" href="#view_insurrance">{translate('human_resource.profile.tab_name.menu_insurrance_infor')}</a></li>
                                        <li><a title={translate('human_resource.profile.tab_name.menu_contract_training_title')} data-toggle="tab" href="#view_contract">{translate('human_resource.profile.tab_name.menu_contract_training')}</a></li>
                                        <li><a title={translate('human_resource.profile.tab_name.menu_reward_discipline_title')} data-toggle="tab" href="#view_reward">{translate('human_resource.profile.tab_name.menu_reward_discipline')}</a></li>
                                        <li><a title={translate('human_resource.profile.tab_name.menu_salary_sabbatical_title')} data-toggle="tab" href="#view_salary">{translate('human_resource.profile.tab_name.menu_salary_sabbatical')}</a></li>
                                        <li><a title={translate('human_resource.profile.tab_name.menu_attachments_title')} data-toggle="tab" href="#view_attachments">{translate('human_resource.profile.tab_name.menu_attachments')}</a></li>
                                    </ul>
                                    <div className="tab-content">
                                        {/* Thông tin chung */}
                                        <GeneralTab
                                            id="view_general"
                                            employee={x}
                                            roles={roles}
                                        />
                                        {/* Thông tin liên hệ */}
                                        <ContactTab
                                            id="view_contact"
                                            employee={x}
                                        />
                                        {/* Kinh nghiệm */}
                                        <ExperiencTab
                                            id="view_experience"
                                            employee={x}
                                        />
                                        {/* Thuế */}
                                        <TaxTab
                                            id="view_account"
                                            employee={x}
                                        />
                                        {/* Bằng cấp- chứng chỉ */}
                                        <CertificateTab
                                            id="view_diploma"
                                            degrees={x.degrees}
                                            certificates={x.certificates}
                                        />
                                        {/* Thông tin bảo hiểm */}
                                        <InsurranceTab
                                            id="view_insurrance"
                                            employee={x}
                                            socialInsuranceDetails={x.socialInsuranceDetails}
                                        />
                                        {/* Hợp đồng lao động */}
                                        <ContractTab
                                            id="view_contract"
                                            employee={x}
                                            courses={courses}
                                            contracts={x.contracts}
                                        />
                                        {/* Khen thưởng - kỷ luật */}
                                        <DisciplineTab
                                            id="view_reward"
                                            commendations={commendations}
                                            disciplines={disciplines}
                                        />
                                        {/* Lương thương - nghỉ phép */}
                                        <SalaryTab
                                            id="view_salary"
                                            annualLeaves={annualLeaves}
                                            salaries={salaries}
                                        />
                                        {/* Tài liệu đính kèm */}
                                        <AttachmentTab
                                            id="view_attachments"
                                            employee={x}
                                            files={x.files}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
            </React.Fragment>
        );
    };
}

function mapState(state) {
    const { employeesInfo } = state;
    return { employeesInfo };
}

const actionCreators = {
    getEmployeeProfile: EmployeeInfoActions.getEmployeeProfile,
    getDepartment: DepartmentActions.get,
}

const connectDetaiEmployee = connect(mapState, actionCreators)(withTranslate(EmployeeDetail));
export { connectDetaiEmployee as EmployeeDetail };
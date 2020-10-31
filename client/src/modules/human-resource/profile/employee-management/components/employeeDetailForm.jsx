import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../../common-components';

import {
    GeneralTab, ContactTab, TaxTab, InsurranceTab, SalaryTab,
    DisciplineTab, AttachmentTab, ExperiencTab, CertificateTab, ContractTab
} from '../../employee-info/components/combinedContent';

import { EmployeeInfoActions } from '../../employee-info/redux/actions';

class EmployeeDetailForm extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, };
        this.state = {
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                dataStatus: 0,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (nextProps._id !== this.state._id && !nextProps.employeesInfo.isLoading) {
            await this.props.getEmployeeProfile({ id: nextProps._id, callAPIByUser: false });
            this.setState({
                dataStatus: this.DATA_STATUS.QUERYING,
                employees: [],
                salaries: [],
                annualLeaves: [],
                commendations: [],
                disciplines: [],
                courses: [],
                roles: []
            })
            return false;
        };
        if (this.state.dataStatus === this.DATA_STATUS.QUERYING && !nextProps.employeesInfo.isLoading) {
            this.setState({
                dataStatus: this.DATA_STATUS.AVAILABLE,
                employees: nextProps.employeesInfo.employees,
                salaries: nextProps.employeesInfo.salaries,
                annualLeaves: nextProps.employeesInfo.annualLeaves,
                commendations: nextProps.employeesInfo.commendations,
                disciplines: nextProps.employeesInfo.disciplines,
                courses: nextProps.employeesInfo.courses,
                roles: nextProps.employeesInfo.roles,

            });
            return true;
        };
        return false;
    }

    render() {
        const { employeesInfo, translate } = this.props;

        let { _id, employees, salaries, annualLeaves, commendations, disciplines, courses, roles = [] } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID={`modal-detail-employee${_id}`} isLoading={employeesInfo.isLoading}
                    formID={`form-detail-employee${_id}`}
                    title={translate('human_resource.profile.employee_management.employee_infor')}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form className="form-group" id={`form-detail-employee${_id}`} style={{ marginTop: "-15px" }}>
                        {employees && employees.length !== 0 &&
                            employees.map((x, index) => (
                                <div className="nav-tabs-custom row" key={index}>
                                    <ul className="nav nav-tabs">
                                        <li className="active"><a title={translate('human_resource.profile.tab_name.menu_general_infor_title')} data-toggle="tab" href={`#view_general${_id}`}>{translate('human_resource.profile.tab_name.menu_general_infor')}</a></li>
                                        <li><a title={translate('human_resource.profile.tab_name.menu_contact_infor_title')} data-toggle="tab" href={`#view_contact${_id}`}>{translate('human_resource.profile.tab_name.menu_contact_infor')}</a></li>
                                        <li><a title={translate('human_resource.profile.tab_name.menu_education_experience_title')} data-toggle="tab" href={`#view_experience${_id}`}>{translate('human_resource.profile.tab_name.menu_education_experience')}</a></li>
                                        <li><a title={translate('human_resource.profile.tab_name.menu_diploma_certificate_title')} data-toggle="tab" href={`#view_diploma${_id}`}>{translate('human_resource.profile.tab_name.menu_diploma_certificate')}</a></li>
                                        <li><a title={translate('human_resource.profile.tab_name.menu_account_tax_title')} data-toggle="tab" href={`#view_account${_id}`}>{translate('human_resource.profile.tab_name.menu_account_tax')}</a></li>
                                        <li><a title={translate('human_resource.profile.tab_name.menu_insurrance_infor_title')} data-toggle="tab" href={`#view_insurrance${_id}`}>{translate('human_resource.profile.tab_name.menu_insurrance_infor')}</a></li>
                                        <li><a title={translate('human_resource.profile.tab_name.menu_contract_training_title')} data-toggle="tab" href={`#view_contract${_id}`}>{translate('human_resource.profile.tab_name.menu_contract_training')}</a></li>
                                        <li><a title={translate('human_resource.profile.tab_name.menu_reward_discipline_title')} data-toggle="tab" href={`#view_reward${_id}`}>{translate('human_resource.profile.tab_name.menu_reward_discipline')}</a></li>
                                        <li><a title={translate('human_resource.profile.tab_name.menu_salary_sabbatical_title')} data-toggle="tab" href={`#view_salary${_id}`}>{translate('human_resource.profile.tab_name.menu_salary_sabbatical')}</a></li>
                                        <li><a title={translate('human_resource.profile.tab_name.menu_attachments_title')} data-toggle="tab" href={`#view_attachments${_id}`}>{translate('human_resource.profile.tab_name.menu_attachments')}</a></li>
                                    </ul>
                                    <div className="tab-content">
                                        {/* Thông tin chung */}
                                        <GeneralTab
                                            id={`view_general${_id}`}
                                            employee={x}
                                            roles={roles}
                                        />
                                        {/* Thông tin liên hệ */}
                                        <ContactTab
                                            id={`view_contact${_id}`}
                                            employee={x}
                                        />
                                        {/* Kinh nghiệm làm việc*/}
                                        <ExperiencTab
                                            id={`view_experience${_id}`}
                                            employee={x}
                                        />
                                        {/* Thuế thu nhập cá nhân */}
                                        <TaxTab
                                            id={`view_account${_id}`}
                                            employee={x}
                                        />
                                        {/* Bằng cấp - Chúng chỉ */}
                                        <CertificateTab
                                            id={`view_diploma${_id}`}
                                            degrees={x.degrees}
                                            certificates={x.certificates}
                                        />
                                        {/* bảo hiểm y tế */}
                                        <InsurranceTab
                                            id={`view_insurrance${_id}`}
                                            employee={x}
                                            socialInsuranceDetails={x.socialInsuranceDetails}
                                        />
                                        {/* Hợp đồng lao động */}
                                        <ContractTab
                                            id={`view_contract${_id}`}
                                            employee={x}
                                            courses={courses}
                                            contracts={x.contracts}
                                        />
                                        {/* thông tin khen thương - kỷ luật */}
                                        <DisciplineTab
                                            id={`view_reward${_id}`}
                                            commendations={commendations}
                                            disciplines={disciplines}
                                        />
                                        {/* Thông tin lương thưởng */}
                                        <SalaryTab
                                            id={`view_salary${_id}`}
                                            annualLeaves={annualLeaves}
                                            salaries={salaries}
                                        />
                                        {/* Tài liệu đính kèm*/}
                                        <AttachmentTab
                                            id={`view_attachments${_id}`}
                                            employee={x}
                                            files={x.files}
                                        />
                                    </div>
                                </div>
                            ))}
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    };
}

function mapState(state) {
    const { employeesInfo } = state;
    return { employeesInfo };
};

const actionCreators = {
    getEmployeeProfile: EmployeeInfoActions.getEmployeeProfile,
}

const detailEmployee = connect(mapState, actionCreators)(withTranslate(EmployeeDetailForm));
export { detailEmployee as EmployeeDetailForm };
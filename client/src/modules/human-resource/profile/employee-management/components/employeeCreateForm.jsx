import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';

import { DialogModal } from '../../../../../common-components';

import { GeneralTab, ContactTab, TaxTab, InsurranceTab, DisciplineTab, ExperienceTab, CertificateTab, ContractTab, SalaryTab, FileTab } from '../../employee-create/components/combinedContent';

import { EmployeeManagerActions } from '../redux/actions';

class EmployeeCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: './upload/human-resource/avatars/avatar5.png',
            avatar: "",
            employee: {
                avatar: '/upload/human-resource/avatars/avatar5.png',
                gender: "male",
                maritalStatus: "single",
                educationalLevel: "12/12",
                professionalSkill: "unavailable",
                status: 'active',
                identityCardDate: this.formatDate2(Date.now()),
                birthdate: this.formatDate2(Date.now()),
                experiences: [],
                socialInsuranceDetails: [],
            },
            courses: [],
            degrees: [],
            certificates: [],
            contracts: [],
            files: [],
            disciplines: [],
            commendations: [],
            salaries: [],
            annualLeaves: [],
        };
        this.handleChangeCourse = this.handleChangeCourse.bind(this);
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về yyyy-mm, false trả về yyyy-mm-dd
     */
    formatDate2(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [year, month].join('-');
            } else return [year, month, day].join('-');
        }
        return date;
    }

    /**
     * Function upload avatar 
     * @param {*} img 
     * @param {*} avatar 
     */
    handleUpload = (img, avatar) => {
        this.setState({
            img: img,
            avatar: avatar
        })
    }

    /**
     * Function lưu các trường thông tin vào state
     * @param {*} name : Tên trường
     * @param {*} value : Giá trị của trường
     */
    handleChange = (name, value) => {
        const { employee } = this.state;
        if (name === 'startingDate' || name === 'leavingDate' || name === 'birthdate' || name === 'identityCardDate' || name === 'taxDateOfIssue' || name === 'healthInsuranceStartDate' || name === 'healthInsuranceEndDate') {
            if (value) {
                let partValue = value.split('-');
                value = [partValue[2], partValue[1], partValue[0]].join('-');
            }
        }
        this.setState({
            employee: {
                ...employee,
                [name]: value
            }
        });
    }

    /**
     * Function thêm mới kinh nghiệm làm việc
     * @param {*} data : Dữ liệu thông tin kinh nghiệm làm việc
     * @param {*} addData : Kinh nghiệm làm việc muốn thêm
     */
    handleChangeExperience = (data, addData) => {
        const { employee } = this.state;
        this.setState({
            employee: {
                ...employee,
                experiences: data
            }
        })
    }

    /**
     * Function thêm, chỉnh sửa thông tin bằng cấp
     * @param {*} data : Dữ liệu thông tin bằng cấp
     * @param {*} addData : Bằng cấp muốn thêm
     */
    handleChangeDegree = (data, addData) => {
        this.setState({
            degrees: data
        })
    }

    /**
     * Function thêm, chỉnh sửa thông tin chứng chỉ
     * @param {*} data : Dữ liệu thông tin chứng chỉ
     * @param {*} addData : Chứng chỉ muốn thêm
     */
    handleChangeCertificate = (data, addData) => {
        this.setState({
            certificates: data
        })
    }

    /**
     * Function thêm, chỉnh sửa thông tin quá trình đóng BHXH
     * @param {*} data : Dữ liệu thông tin quá trình đóng BHXH
     * @param {*} addData : Quá trình đóng BHXH muốn thêm
     */
    handleChangeBHXH = (data, addData) => {
        const { employee } = this.state;
        this.setState({
            employee: {
                ...employee,
                socialInsuranceDetails: data
            }
        })
    }

    /**
     * Function thêm thông tin hợp đồng lao động
     * @param {*} data : Dữ liệu thông tin hợp đồng
     * @param {*} addData : Hợp đồng muốn thêm
     */
    handleChangeContract = (data, addData) => {
        this.setState({
            contracts: data
        })
    }

    /**
     * Function thêm thông tin khen thưởng
     * @param {*} data : Dữ liệu thông tin khen thưởng
     * @param {*} addData : Khen thưởng muốn thêm
     */
    handleChangeConmmendation = (data, addData) => {
        this.setState({
            commendations: data
        })
    }

    /**
     * Function thêm thông tin kỷ luật
     * @param {*} data : Dữ liệu thông tin kỷ luật
     * @param {*} addData : Kỷ luật muốn thêm
     */
    handleChangeDiscipline = (data, addData) => {
        this.setState({
            disciplines: data
        })
    }

    /**
     * Function thêm thông tin lịch sử lương
     * @param {*} data : Dữ liệu thông tin lịch sử lương
     * @param {*} addData : Lịch sử lương muốn thêm
     */
    handleChangeSalary = (data, addData) => {
        this.setState({
            salaries: data
        })
    }

    /**
     * Function thêm thông tin nghỉ phép
     * @param {*} data : Dữ liệu thông tin nghỉ phép
     * @param {*} addData : Nghỉ phép muốn thêm
     */
    handleChangeAnnualLeave = (data, addData) => {
        this.setState({
            annualLeaves: data
        })
    }

    /**
     * Function thêm thông tin tài liệu đính kèm
     * @param {*} data : Dữ liệu thông tin tài liệu đính kèm
     * @param {*} addData : Tài liệu đính kèm muốn thêm
     */
    handleChangeFile = (data, addData) => {
        this.setState({
            files: data
        })
    }

    /**
     *  Function thêm thông tin quá trình đào tạo
     * @param {*} data : Dữ liệu thông tin quá trình đào tạo
     */
    handleChangeCourse = (data) => {
        this.setState({
            courses: data
        })
    }

    /**
     * Function kiểm tra các trường bắt buộc phải nhập
     * @param {*} value : Giá trị của trường cần kiểm tra
     */
    validatorInput = (value) => {
        if (value !== undefined && value.toString().trim() !== '') {
            return true;
        }
        return false;
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    isFormValidated = () => {
        const { employee } = this.state;
        let result = this.validatorInput(employee.employeeNumber) && this.validatorInput(employee.employeeTimesheetId) &&
            this.validatorInput(employee.fullName) && this.validatorInput(employee.birthdate) &&
            this.validatorInput(employee.emailInCompany) && this.validatorInput(employee.identityCardNumber) &&
            this.validatorInput(employee.identityCardDate) && this.validatorInput(employee.identityCardAddress) &&
            this.validatorInput(employee.phoneNumber) && this.validatorInput(employee.temporaryResidence);

        if (employee.healthInsuranceStartDate && employee.healthInsuranceEndDate) {
            if (new Date(employee.healthInsuranceEndDate).getTime() < new Date(employee.healthInsuranceStartDate).getTime()) {
                return false;
            }
        } else if ((employee.healthInsuranceStartDate && !employee.healthInsuranceEndDate) ||
            (!employee.healthInsuranceStartDate && employee.healthInsuranceEndDate)) {
            return false;
        }
        if (employee.leavingDate && employee.startingDate) {
            if (new Date(employee.leavingDate).getTime() < new Date(employee.startingDate).getTime()) {
                return false;
            }
        } else if (employee.leavingDate && !employee.startingDate) {
            return false;
        }
        return result;
    }

    /** Function thêm mới thông tin nhân viên */
    save = async () => {
        let { employee, degrees, certificates, contracts, files, avatar,
            disciplines, commendations, salaries, annualLeaves, courses } = this.state;

        await this.setState({
            employee: {
                ...employee,
                degrees,
                certificates,
                contracts,
                files,
                disciplines,
                commendations,
                salaries,
                annualLeaves,
                courses
            }
        })

        let formData = convertJsonObjectToFormData(this.state.employee);
        degrees.forEach(x => {
            formData.append("fileDegree", x.fileUpload);
        })
        certificates.forEach(x => {
            formData.append("fileCertificate", x.fileUpload);
        })
        contracts.forEach(x => {
            formData.append("fileContract", x.fileUpload);
        })
        files.forEach(x => {
            formData.append("file", x.fileUpload);
        })
        formData.append("fileAvatar", avatar);

        this.props.addNewEmployee(formData);
    }
    render() {
        const { translate, employeesManager } = this.props;

        const { img, employee, degrees, certificates, contracts, courses, commendations, disciplines, salaries, annualLeaves, files } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-create-employee" isLoading={employeesManager.isLoading}
                    formID="form-create-employee"
                    title={translate('human_resource.profile.add_staff')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* <form className="form-group" id="form-create-employee"> */}
                    <div className="nav-tabs-custom row" style={{ marginTop: '-15px' }} >
                        <ul className="nav nav-tabs">
                            <li className="active"><a title={translate('human_resource.profile.tab_name.menu_general_infor_title')} data-toggle="tab" href="#general">{translate('human_resource.profile.tab_name.menu_general_infor')}</a></li>
                            <li><a title={translate('human_resource.profile.tab_name.menu_contact_infor_title')} data-toggle="tab" href="#contact">{translate('human_resource.profile.tab_name.menu_contact_infor')}</a></li>
                            <li><a title={translate('human_resource.profile.tab_name.menu_education_experience_title')} data-toggle="tab" href="#experience">{translate('human_resource.profile.tab_name.menu_education_experience')}</a></li>
                            <li><a title={translate('human_resource.profile.tab_name.menu_diploma_certificate_title')} data-toggle="tab" href="#diploma">{translate('human_resource.profile.tab_name.menu_diploma_certificate')}</a></li>
                            <li><a title={translate('human_resource.profile.tab_name.menu_account_tax_title')} data-toggle="tab" href="#account">{translate('human_resource.profile.tab_name.menu_account_tax')}</a></li>
                            <li><a title={translate('human_resource.profile.tab_name.menu_insurrance_infor_title')} data-toggle="tab" href="#insurrance">{translate('human_resource.profile.tab_name.menu_insurrance_infor')}</a></li>
                            <li><a title={translate('human_resource.profile.tab_name.menu_contract_training_title')} data-toggle="tab" href="#contract">{translate('human_resource.profile.tab_name.menu_contract_training')}</a></li>
                            <li><a title={translate('human_resource.profile.tab_name.menu_reward_discipline_title')} data-toggle="tab" href="#reward">{translate('human_resource.profile.tab_name.menu_reward_discipline')}</a></li>
                            <li><a title={translate('human_resource.profile.tab_name.menu_salary_sabbatical_title')} data-toggle="tab" href="#salary">{translate('human_resource.profile.tab_name.menu_salary_sabbatical')}</a></li>
                            <li><a title={translate('human_resource.profile.tab_name.menu_attachments_title')} data-toggle="tab" href="#attachments">{translate('human_resource.profile.tab_name.menu_attachments')}</a></li>
                        </ul>
                        < div className="tab-content">
                            {/* Tab thông tin chung */}
                            <GeneralTab
                                id="general"
                                img={img}
                                handleChange={this.handleChange}
                                handleUpload={this.handleUpload}
                                employee={employee}
                            />
                            {/* Tab thông tin liên hệ */}
                            <ContactTab
                                id="contact"
                                handleChange={this.handleChange}
                                employee={employee}
                            />
                            {/* Tab học vấn - kinh nghiệm */}
                            <ExperienceTab
                                id="experience"
                                employee={employee}
                                handleChange={this.handleChange}

                                handleAddExperience={this.handleChangeExperience}
                                handleEditExperience={this.handleChangeExperience}
                                handleDeleteExperience={this.handleChangeExperience}
                            />
                            {/* Tab bằng cấp - chứng chỉ */}
                            <CertificateTab
                                id="diploma"
                                degrees={degrees}
                                certificates={certificates}

                                handleAddDegree={this.handleChangeDegree}
                                handleEditDegree={this.handleChangeDegree}
                                handleDeleteDegree={this.handleChangeDegree}

                                handleAddCertificate={this.handleChangeCertificate}
                                handleEditCertificate={this.handleChangeCertificate}
                                handleDeleteCertificate={this.handleChangeCertificate}
                            />
                            {/* Tab Tài khoản - thuế */}
                            <TaxTab
                                id="account"
                                employee={employee}
                                handleChange={this.handleChange} />
                            {/* Tab thông tin bảo hiểm */}
                            <InsurranceTab
                                id="insurrance"
                                pageCreate={true}
                                socialInsuranceDetails={employee.socialInsuranceDetails}
                                employee={employee}
                                handleChange={this.handleChange}

                                handleAddBHXH={this.handleChangeBHXH}
                                handleEditBHXH={this.handleChangeBHXH}
                                handleDeleteBHXH={this.handleChangeBHXH}
                            />
                            {/* Tab hợp đồng - quá trình đào tạo*/}
                            <ContractTab
                                id="contract"
                                pageCreate={true}
                                employee={employee}
                                contracts={contracts}
                                courses={courses}
                                handleChange={this.handleChange}

                                handleAddContract={this.handleChangeContract}
                                handleEditContract={this.handleChangeContract}
                                handleDeleteContract={this.handleChangeContract}

                                handleAddCourse={this.handleChangeCourse}
                                handleEditCourse={this.handleChangeCourse}
                                handleDeleteCourse={this.handleChangeCourse}
                            />
                            {/* Tab khen thưởng - kỷ luật*/}
                            <DisciplineTab
                                id="reward"
                                commendations={commendations}
                                disciplines={disciplines}

                                handleAddConmmendation={this.handleChangeConmmendation}
                                handleEditConmmendation={this.handleChangeConmmendation}
                                handleDeleteConmmendation={this.handleChangeConmmendation}

                                handleAddDiscipline={this.handleChangeDiscipline}
                                handleEditDiscipline={this.handleChangeDiscipline}
                                handleDeleteDiscipline={this.handleChangeDiscipline}
                            />
                            {/* Tab lương thưởng - nghỉ phép*/}
                            <SalaryTab
                                id="salary"
                                pageCreate={true}
                                salaries={salaries}
                                annualLeaves={annualLeaves}

                                handleAddSalary={this.handleChangeSalary}
                                handleEditSalary={this.handleChangeSalary}
                                handleDeleteSalary={this.handleChangeSalary}

                                handleAddAnnualLeave={this.handleChangeAnnualLeave}
                                handleEditAnnualLeave={this.handleChangeAnnualLeave}
                                handleDeleteAnnualLeave={this.handleChangeAnnualLeave}
                            />
                            {/* Tab tài liệu đính kèm */}
                            <FileTab
                                id="attachments"
                                files={files}
                                employee={employee}
                                handleChange={this.handleChange}

                                handleAddFile={this.handleChangeFile}
                                handleEditFile={this.handleChangeFile}
                                handleDeleteFile={this.handleChangeFile}
                            />
                        </div>
                    </div>
                    {/* </form> */}
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { employeesManager } = state;
    return { employeesManager };
};

const actionCreators = {
    addNewEmployee: EmployeeManagerActions.addNewEmployee,
};

const createForm = connect(mapState, actionCreators)(withTranslate(EmployeeCreateForm));
export { createForm as EmployeeCreateForm };
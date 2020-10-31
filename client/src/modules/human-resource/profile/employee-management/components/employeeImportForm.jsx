import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { EmployeeImportTab } from './combinedContent';
import { DialogModal } from '../../../../../common-components';

import {
    configurationEmployee,
} from './fileConfigurationImportEmployee';

import { EmployeeManagerActions } from '../redux/actions';

class EmployeeImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * Function chuyển dữ liệu date trong excel thành dạng dd-mm-yyyy
     * @param {*} serial :số serial của ngày
     */
    convertExcelDateToJSDate = (serial) => {
        let utc_days = Math.floor(serial - 25569);
        let utc_value = utc_days * 86400;
        let date_info = new Date(utc_value * 1000);
        let month = date_info.getMonth() + 1;
        let day = date_info.getDate();
        if (month.toString().length < 2)
            month = '0' + month;
        if (day.toString().length < 2)
            day = '0' + day;
        return [day, month, date_info.getFullYear()].join('-');
    }

    /**
     * Hàm tiện ích dùng cho các function bên dưới
     * Function chuyển String(dd-mm-yyyy) sang date
     * @param {*} data 
     */
    convertStringToDate = (data, monthYear = false) => {
        if (data) {
            data = data.split('-');
            let date;
            if (monthYear) {
                date = [data[1], data[0]];
            } else {
                date = [data[2], data[1], data[0]];
            }
            return date.join('-');
        } else {
            return data;
        }

    }

    /**
     * Function kiểm dữ liệu import thông tin cơ bản của nhân viên
     * @param {*} value : dữ liệu cần import
     */
    handleCheckImportDataOfEmployeeInfor = (value) => {
        const { translate } = this.props;

        value = value.map(x => {
            let birthdate = (!x.birthdate || typeof x.birthdate === 'string') ? x.birthdate : this.convertExcelDateToJSDate(x.birthdate);
            let identityCardDate = (!x.identityCardDate || typeof x.identityCardDate === 'string') ? x.identityCardDate : this.convertExcelDateToJSDate(x.identityCardDate);
            let startingDate = (!x.startingDate || typeof x.startingDate === 'string') ? x.startingDate : this.convertExcelDateToJSDate(x.startingDate);
            let leavingDate = (!x.leavingDate || typeof x.leavingDate === 'string') ? x.leavingDate : this.convertExcelDateToJSDate(x.leavingDate);
            let taxDateOfIssue = (!x.taxDateOfIssue || typeof x.taxDateOfIssue === 'string') ? x.taxDateOfIssue : this.convertExcelDateToJSDate(x.taxDateOfIssue);
            let healthInsuranceStartDate = (!x.healthInsuranceStartDate || typeof x.healthInsuranceStartDate === 'string') ? x.healthInsuranceStartDate : this.convertExcelDateToJSDate(x.healthInsuranceStartDate);
            let healthInsuranceEndDate = (!x.healthInsuranceEndDate || typeof x.healthInsuranceEndDate === 'string') ? x.healthInsuranceEndDate : this.convertExcelDateToJSDate(x.healthInsuranceEndDate);
            let gender = translate('human_resource.profile.male') ? "male" : "female";
            let maritalStatus = translate('human_resource.profile.single') ? "single" : "married";
            let professionalSkill, educationalLevel;
            let status = translate('human_resource.profile.active') ? "active" : "leave";
            switch (x.professionalSkill) {
                case translate('human_resource.profile.intermediate_degree'):
                    professionalSkill = "intermediate_degree";
                    break;
                case translate('human_resource.profile.colleges'):
                    professionalSkill = "colleges";
                    break;
                case translate('human_resource.profile.university'):
                    professionalSkill = "university";
                    break;
                case translate('human_resource.profile.master_degree'):
                    professionalSkill = "master_degree";
                    break;
                case translate('human_resource.profile.phd'):
                    professionalSkill = "phd";
                    break;
                case translate('human_resource.profile.unavailable'):
                    professionalSkill = "unavailable";
                    break;
                default:
                    professionalSkill = "unavailable";
            };

            switch (x.educationalLevel) {
                case '12/12':
                    educationalLevel = '12/12';
                    break;
                case '11/12':
                    educationalLevel = '11/12';
                    break;
                case '10/12':
                    educationalLevel = '10/12';
                    break;
                case '9/12':
                    educationalLevel = '9/12';
                    break;
                default:
                    educationalLevel = "12/12";
            };
            return {
                ...x,
                birthdate: this.convertStringToDate(birthdate, false),
                identityCardDate: this.convertStringToDate(identityCardDate, false),
                startingDate: this.convertStringToDate(startingDate, false),
                leavingDate: this.convertStringToDate(leavingDate, false),
                taxDateOfIssue: this.convertStringToDate(taxDateOfIssue, false),
                healthInsuranceStartDate: this.convertStringToDate(healthInsuranceStartDate, false),
                healthInsuranceEndDate: this.convertStringToDate(healthInsuranceEndDate, false),
                gender: gender,
                maritalStatus: maritalStatus,
                educationalLevel: educationalLevel,
                professionalSkill: professionalSkill,
                status: status
            };
        })

        // Check dữ liệu import có hợp lệ hay không
        let checkImportData = value, rowError = [];
        value = value.map((x, index) => {
            let errorAlert = [];
            if (x.employeeNumber === null || x.fullName === null || x.emailInCompany === null || x.employeeTimesheetId === null
                || x.birthdate === null || x.identityCardNumber === null || x.identityCardDate === null || x.identityCardAddress === null
                || x.phoneNumber === null || x.temporaryResidence === null || x.taxDateOfIssue === null || x.taxNumber === null
                || x.taxRepresentative === null || x.taxAuthority === null || checkImportData.filter(y => y.employeeNumber === x.employeeNumber).length > 1
                || checkImportData.filter(y => y.emailInCompany === x.emailInCompany).length > 1
                || checkImportData.filter(y => y.employeeTimesheetId === x.employeeTimesheetId).length > 1) {
                rowError = [...rowError, index + 1]
                x = { ...x, error: true }
            }
            if (x.employeeNumber === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.staff_number')} ${translate('human_resource.cannot_be_empty')}`];
            } else {
                if (checkImportData.filter(y => y.employeeNumber === x.employeeNumber).length > 1)
                    errorAlert = [...errorAlert, `${translate('human_resource.profile.staff_number')} ${translate('human_resource.value_duplicate')}`];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.full_name')} ${translate('human_resource.cannot_be_empty')}`];
            }
            if (x.emailInCompany === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.email_company')} ${translate('human_resource.cannot_be_empty')}`];
            } else {
                if (checkImportData.filter(y => y.emailInCompany === x.emailInCompany).length > 1)
                    errorAlert = [...errorAlert, `${translate('human_resource.profile.email_company')} ${translate('human_resource.value_duplicate')}`];
            };
            if (x.employeeTimesheetId === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.attendance_code')} ${translate('human_resource.cannot_be_empty')}`];
            } else {
                if (checkImportData.filter(y => y.employeeTimesheetId === x.employeeTimesheetId).length > 1)
                    errorAlert = [...errorAlert, `${translate('human_resource.profile.attendance_code')} ${translate('human_resource.value_duplicate')}`];
            };
            if (x.birthdate === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.date_birth')} ${translate('human_resource.cannot_be_empty')}`];
            }
            if (x.identityCardNumber === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.id_card')} ${translate('human_resource.cannot_be_empty')}`];
            }
            if (x.identityCardDate === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.date_issued')} ${translate('human_resource.cannot_be_empty')}`];
            }
            if (x.identityCardAddress === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.issued_by')} ${translate('human_resource.cannot_be_empty')}`];
            }
            if (x.phoneNumber === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.mobile_phone_1')} ${translate('human_resource.cannot_be_empty')}`];
            }
            if (x.temporaryResidence === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.current_residence')} ${translate('human_resource.cannot_be_empty')}`];
            }
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        this.setState({
            importDataOfEmployeeInfor: value,
        })
        return { importData: value, rowError: rowError }
    }

    /**
     * Function kiểm dữ liệu import kinh nghiệm làm việc
     * @param {*} value : dữ liệu cần import
     */
    handleCheckImportDataOfExperience = (value) => {
        const { translate } = this.props;

        value = value.map(x => {
            let startDate = (!x.startDate || typeof x.startDate === 'string') ? x.startDate : this.convertExcelDateToJSDate(x.startDate);
            let endDate = (!x.endDate || typeof x.endDate === 'string') ? x.endDate : this.convertExcelDateToJSDate(x.endDate);
            return {
                ...x,
                startDate: this.convertStringToDate(startDate, true),
                endDate: this.convertStringToDate(endDate, true),
            }
        });

        // Check dữ liệu import có hợp lệ hay không
        let rowError = [];
        value = value.map((x, index) => {
            let errorAlert = [];
            if (x.employeeNumber === null || x.fullName === null || x.startDate === null || x.endDate === null
                || x.company === null || x.position === null) {
                rowError = [...rowError, index + 1]
                x = { ...x, error: true }
            }
            if (x.employeeNumber === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.staff_number')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.full_name')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.startDate === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.from_month_year')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.endDate === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.to_month_year')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.company === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.unit')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.position === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.position')} ${translate('human_resource.cannot_be_empty')}`];
            };
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        this.setState({
            importDataOfExperience: value,
        })
        return { importData: value, rowError: rowError }
    }

    /**
     * Function kiểm dữ liệu import thông tin bằng cấp
     * @param {*} value : dữ liệu cần import
     */
    handleCheckImportDataOfDegree = (value) => {
        const { translate } = this.props;
        value = value.map(x => {
            let degreeType;
            switch (x.degreeType) {
                case translate('human_resource.profile.excellent'):
                    degreeType = "excellent";
                    break;
                case translate('human_resource.profile.very_good'):
                    degreeType = "very_good";
                    break;
                case translate('human_resource.profile.good'):
                    degreeType = "good";
                    break;
                case translate('human_resource.profile.average_good'):
                    degreeType = "average_good";
                    break;
                case translate('human_resource.profile.ordinary'):
                    degreeType = "ordinary";
                    break;
                default:
                    degreeType = null;
            }
            return { ...x, degreeType: degreeType }
        })


        let rowError = [];
        // Check dữ liệu import có hợp lệ hay không
        value = value.map((x, index) => {
            let errorAlert = [];
            if (x.employeeNumber === null || x.fullName === null || x.name === null || x.issuedBy === null
                || x.year === null || x.degreeType === null) {
                rowError = [...rowError, index + 1]
                x = { ...x, error: true }
            }
            if (x.employeeNumber === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.staff_number')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.full_name')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.name === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.name_diploma')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.issuedBy === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.diploma_issued_by')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.year === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.graduation_year')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.degreeType === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.ranking_learning')} ${translate('human_resource.cannot_be_empty')}`];
            };
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        this.setState({
            importDataOfDegree: value,
        })
        return { importData: value, rowError: rowError }

    }

    /**
     * Function kiểm dữ liệu import thông tin chứng chỉ
     * @param {*} value : dữ liệu cần import
     */
    handleCheckImportDataOfCertificate = (value) => {
        const { translate } = this.props;

        value = value.map(x => {
            let startDate = (!x.startDate || typeof x.startDate === 'string') ? x.startDate : this.convertExcelDateToJSDate(x.startDate);
            let endDate = (!x.endDate || typeof x.endDate === 'string') ? x.endDate : this.convertExcelDateToJSDate(x.endDate);
            return {
                ...x,
                startDate: this.convertStringToDate(startDate, false),
                endDate: this.convertStringToDate(endDate, false),
            }
        });

        let rowError = [];
        // Check dữ liệu import có hợp lệ hay không
        value = value.map((x, index) => {
            let errorAlert = [];
            if (x.employeeNumber === null || x.fullName === null || x.name === null || x.issuedBy === null
                || x.startDate === null || x.endDate === null) {
                rowError = [...rowError, index + 1]
                x = { ...x, error: true }
            }
            if (x.employeeNumber === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.staff_number')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.full_name')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.name === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.name_certificate')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.issuedBy === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.issued_by')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.startDate === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.date_issued')} ${translate('human_resource.cannot_be_empty')}`];
            };
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        this.setState({
            importDataOfCertificate: value,
        })
        return { importData: value, rowError: rowError }

    }

    /**
     * Function kiểm dữ liệu import hợp đồng lao động
     * @param {*} value : dữ liệu cần import
     */
    handleCheckImportDataOfContract = (value) => {
        const { translate } = this.props;

        value = value.map(x => {
            let startDate = (!x.startDate || typeof x.startDate === 'string') ? x.startDate : this.convertExcelDateToJSDate(x.startDate);
            let endDate = (!x.endDate || typeof x.endDate === 'string') ? x.endDate : this.convertExcelDateToJSDate(x.endDate);
            return {
                ...x,
                startDate: this.convertStringToDate(startDate, false),
                endDate: this.convertStringToDate(endDate, false),
            }
        });

        let rowError = [];
        // Check dữ liệu import có hợp lệ hay không
        value = value.map((x, index) => {
            let errorAlert = [];
            if (x.employeeNumber === null || x.fullName === null || x.name === null || x.contractType === null
                || x.startDate === null || x.endDate === null) {
                rowError = [...rowError, index + 1]
                x = { ...x, error: true }
            }
            if (x.employeeNumber === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.staff_number')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.full_name')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.name === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.name_contract')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.contractType === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.type_contract')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.startDate === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.start_date')} ${translate('human_resource.cannot_be_empty')}`];
            };
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        this.setState({
            importDataOfContract: value,
        })
        return { importData: value, rowError: rowError }
    }

    /**
     * Function kiểm dữ liệu import quá trình đóng bảo hiểm
     * @param {*} value : dữ liệu cần import
     */
    handleCheckImportDataOfSocialInsuranceDetails = (value) => {
        const { translate } = this.props;

        value = value.map(x => {
            let startDate = (!x.startDate || typeof x.startDate === 'string') ? x.startDate : this.convertExcelDateToJSDate(x.startDate);
            let endDate = (!x.endDate || typeof x.endDate === 'string') ? x.endDate : this.convertExcelDateToJSDate(x.endDate);
            return {
                ...x,
                startDate: this.convertStringToDate(startDate, true),
                endDate: this.convertStringToDate(endDate, true),
            }
        });

        // Check dữ liệu import có hợp lệ hay không
        let rowError = [];
        value = value.map((x, index) => {
            let errorAlert = [];
            if (x.employeeNumber === null || x.fullName === null || x.startDate === null || x.endDate === null
                || x.company === null || x.position === null) {
                rowError = [...rowError, index + 1]
                x = { ...x, error: true }
            }
            if (x.employeeNumber === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.staff_number')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.full_name')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.startDate === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.from_month_year')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.endDate === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.to_month_year')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.company === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.unit')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.position === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.position')} ${translate('human_resource.cannot_be_empty')}`];
            };
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        this.setState({
            importDataOfSocialInsuranceDetails: value,
        })
        return { importData: value, rowError: rowError }
    }

    /**
     * Function kiểm dữ liệu import tài liệu đính kèm
     * @param {*} value : dữ liệu cần import
     */
    handleCheckImportDataOfFile = (value) => {
        const { translate } = this.props;

        value = value.map(x => {
            let status;
            switch (x.status) {
                case translate('human_resource.profile.submitted'):
                    status = 'submitted';
                    break;
                case translate('human_resource.profile.not_submitted_yet'):
                    status = 'not_submitted_yet';
                    break;
                case translate('human_resource.profile.returned'):
                    status = 'returned';
                    break;
                default:
                    status = null;
            };
            return { ...x, status: status };
        })
        let rowError = [];
        // Check dữ liệu import có hợp lệ hay không
        value = value.map((x, index) => {
            let errorAlert = [];
            if (x.employeeNumber === null || x.fullName === null || x.name === null || x.description === null
                || x.number === null || x.status === null) {
                rowError = [...rowError, index + 1]
                x = { ...x, error: true }
            }
            if (x.employeeNumber === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.staff_number')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.full_name')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.name === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.file_name')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.description === null) {
                errorAlert = [...errorAlert, `${translate('general.description')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.number === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.number')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.status === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.status')} ${translate('human_resource.cannot_be_empty')}`];
            };
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        this.setState({
            importDataOfFile: value,
        })
        return { importData: value, rowError: rowError }
    }



    /**
     * Function bắt sự kiện import thông tin cơ bản của nhân viên
     */
    handleImportEmployeeInfor = () => {
        let { importDataOfEmployeeInfor } = this.state;
        this.props.importEmployees({ importType: "Employee_Infor", importData: importDataOfEmployeeInfor });
    }

    /**
    * Function bắt sự kiện import kinh nghiệm làm việc
    */
    handleImportExperience = () => {
        let { importDataOfExperience } = this.state;
        this.props.importEmployees({ importType: "Experience", importData: importDataOfExperience });
    }

    /**
    * Function bắt sự kiện import thông tin bằng cấp
    */
    handleImportDegree = () => {
        let { importDataOfDegree } = this.state;
        this.props.importEmployees({ importType: "Degree", importData: importDataOfDegree });
    }

    /**
    * Function bắt sự kiện import thông tin chứng chỉ
    */
    handleImportCertificate = () => {
        let { importDataOfCertificate } = this.state;
        this.props.importEmployees({ importType: "Certificate", importData: importDataOfCertificate });
    }

    /**
    * Function bắt sự kiện import hợp đồng lao động
    */
    handleImportConstract = () => {
        let { importDataOfContract } = this.state;
        this.props.importEmployees({ importType: "Contract", importData: importDataOfContract });
    }

    /**
   * Function bắt sự kiện import quá trình đóng bảo hiểm
   */
    handleImportSocialInsuranceDetails = () => {
        let { importDataOfSocialInsuranceDetails } = this.state;
        this.props.importEmployees({ importType: "SocialInsuranceDetails", importData: importDataOfSocialInsuranceDetails });
    }

    /**
    * Function bắt sự kiện import Tài liệ đính kèm
    */
    handleImportFile = () => {
        let { importDataOfFile } = this.state;
        this.props.importEmployees({ importType: "File", importData: importDataOfFile });
    }


    render() {
        const { employeesManager, translate } = this.props;
        let configurationEmployeeInfo = configurationEmployee.configurationEmployeeInfo(translate),
            configurationExperience = configurationEmployee.configurationExperience(translate),
            configurationSocialInsuranceDetails = configurationEmployee.configurationSocialInsuranceDetails(translate),
            configurationDegree = configurationEmployee.configurationDegree(translate),
            configurationCertificate = configurationEmployee.configurationCertificate(translate),
            configurationContract = configurationEmployee.configurationContract(translate),
            configurationFile = configurationEmployee.configurationFile(translate),
            teamplateImport = configurationEmployee.templateImport(translate);

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal_import_file`} isLoading={false}
                    formID={`form_import_file`}
                    title={translate('human_resource.add_data_by_excel')}
                    hasSaveButton={false}
                    hasNote={false}
                    size={75}
                >
                    <form className="form-group" id={`form_import_file`}>
                        <div className="nav-tabs-custom row" style={{ marginTop: '-15px' }} >
                            <ul className="nav nav-tabs">
                                <li className="active"><a title={translate(`human_resource.profile.employee_management.import.import_general_infor_title`)} data-toggle="tab" href="#import_employee_general_infor">{translate(`human_resource.profile.employee_management.import.import_general_infor`)}</a></li>
                                <li><a title={translate(`human_resource.profile.employee_management.import.import_experience_title`)} data-toggle="tab" href="#import_employee_experience">{translate(`human_resource.profile.employee_management.import.import_experience`)}</a></li>
                                <li><a title={translate(`human_resource.profile.employee_management.import.import_degree_title`)} data-toggle="tab" href="#import_employee_degree">{translate(`human_resource.profile.employee_management.import.import_degree`)}</a></li>
                                <li><a title={translate(`human_resource.profile.employee_management.import.import_certificate_title`)} data-toggle="tab" href="#import_employee_certificate">{translate(`human_resource.profile.employee_management.import.import_certificate`)}</a></li>
                                <li><a title={translate(`human_resource.profile.employee_management.import.import_contract_title`)} data-toggle="tab" href="#import_employee_contract">{translate(`human_resource.profile.employee_management.import.import_contract`)}</a></li>
                                <li><a title={translate(`human_resource.profile.employee_management.import.import_socialInsurance_details_title`)} data-toggle="tab" href="#import_employee_socialInsurance_details">{translate(`human_resource.profile.employee_management.import.import_socialInsurance_details`)}</a></li>
                                <li><a title={translate(`human_resource.profile.employee_management.import.import_file_title`)} data-toggle="tab" href="#import_employee_file">{translate(`human_resource.profile.employee_management.import.import_file`)}</a></li>

                            </ul>
                            < div className="tab-content">
                                <EmployeeImportTab
                                    id="import_employee_general_infor"
                                    className="tab-pane active"
                                    textareaRow={12}
                                    configTableWidth={8000}
                                    showTableWidth={5000}
                                    rowErrorOfReducer={employeesManager.error.rowErrorOfEmployeeInfor}
                                    dataOfReducer={employeesManager.error.employeesInfor}
                                    configuration={configurationEmployeeInfo}
                                    teamplateImport={teamplateImport}
                                    handleCheckImportData={this.handleCheckImportDataOfEmployeeInfor}
                                    handleImport={this.handleImportEmployeeInfor}
                                />
                                <EmployeeImportTab
                                    id="import_employee_experience"
                                    textareaRow={10}
                                    configTableWidth={1000}
                                    showTableWidth={1000}
                                    rowErrorOfReducer={employeesManager.error.rowErrorOfExperience}
                                    dataOfReducer={employeesManager.error.experiences}
                                    configuration={configurationExperience}
                                    teamplateImport={teamplateImport}
                                    handleCheckImportData={this.handleCheckImportDataOfExperience}
                                    handleImport={this.handleImportExperience}
                                />
                                <EmployeeImportTab
                                    id="import_employee_degree"
                                    textareaRow={10}
                                    configTableWidth={1000}
                                    showTableWidth={1000}
                                    rowErrorOfReducer={employeesManager.error.rowErrorOfDegree}
                                    dataOfReducer={employeesManager.error.degrees}
                                    configuration={configurationDegree}
                                    teamplateImport={teamplateImport}
                                    handleCheckImportData={this.handleCheckImportDataOfDegree}
                                    handleImport={this.handleImportDegree}
                                />
                                <EmployeeImportTab
                                    id="import_employee_certificate"
                                    textareaRow={10}
                                    configTableWidth={1000}
                                    showTableWidth={1000}
                                    rowErrorOfReducer={employeesManager.error.rowErrorOfCertificate}
                                    dataOfReducer={employeesManager.error.certificates}
                                    configuration={configurationCertificate}
                                    teamplateImport={teamplateImport}
                                    handleCheckImportData={this.handleCheckImportDataOfCertificate}
                                    handleImport={this.handleImportCertificate}
                                />
                                <EmployeeImportTab
                                    id="import_employee_contract"
                                    textareaRow={10}
                                    configTableWidth={1000}
                                    showTableWidth={1000}
                                    rowErrorOfReducer={employeesManager.error.rowErrorOfContract}
                                    dataOfReducer={employeesManager.error.contracts}
                                    configuration={configurationContract}
                                    teamplateImport={teamplateImport}
                                    handleCheckImportData={this.handleCheckImportDataOfContract}
                                    handleImport={this.handleImportConstract}
                                />
                                <EmployeeImportTab
                                    id="import_employee_socialInsurance_details"
                                    textareaRow={10}
                                    configTableWidth={1000}
                                    showTableWidth={1000}
                                    rowErrorOfReducer={employeesManager.error.rowErrorOfSocialInsuranceDetails}
                                    dataOfReducer={employeesManager.error.SocialInsuranceDetails}
                                    configuration={configurationSocialInsuranceDetails}
                                    teamplateImport={teamplateImport}
                                    handleCheckImportData={this.handleCheckImportDataOfSocialInsuranceDetails}
                                    handleImport={this.handleImportSocialInsuranceDetails}
                                />

                                <EmployeeImportTab
                                    id="import_employee_file"
                                    textareaRow={10}
                                    configTableWidth={1000}
                                    showTableWidth={1000}
                                    rowErrorOfReducer={employeesManager.error.rowErrorOfFile}
                                    dataOfReducer={employeesManager.error.files}
                                    configuration={configurationFile}
                                    teamplateImport={teamplateImport}
                                    handleCheckImportData={this.handleCheckImportDataOfFile}
                                    handleImport={this.handleImportFile}
                                />
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { employeesManager } = state;
    return { employeesManager };
};

const actionCreators = {
    importEmployees: EmployeeManagerActions.importEmployees,
};

const importExcel = connect(mapState, actionCreators)(withTranslate(EmployeeImportForm));
export { importExcel as EmployeeImportForm };
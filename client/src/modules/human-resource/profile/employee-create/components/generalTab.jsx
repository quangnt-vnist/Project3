import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, ErrorLabel, SelectBox, ApiImage } from '../../../../../common-components';

import { EmployeeCreateValidator } from './employeeCreateValidator';

// import { AuthActions } from '../../../../auth/redux/actions';

import "./addEmployee.css";

class GeneralTab extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    static formatDate(date, monthYear = false) {
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
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date;
        }
    }

    /** Function upload avatar  */
    handleUpload = (e) => {
        let file = e.target.files[0];
        if (file !== undefined) {
            let fileLoad = new FileReader();
            fileLoad.readAsDataURL(file);
            fileLoad.onload = () => {
                this.setState({
                    img: fileLoad.result
                });
                this.props.handleUpload(fileLoad.result, file)
            };
        }
    }

    /** Function lưu các trường thông tin vào state */
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        })
        this.props.handleChange(name, value);
    }

    /**
     * Funtion bắt sự kiện thay đổi trạng thái làm việc
     * @param {*} value : Trạng thái làm việc
     */
    handleChangeStatus = (value) => {
        this.setState({
            status: value[0]
        })
        this.props.handleChange('status', value[0]);
    }

    /** Funtion bắt sự kiện thay đổi giới tính */
    handleGenderChange = (e) => {
        const { value } = e.target;
        this.setState({
            gender: value,
        })
        this.props.handleChange('gender', value);
    }

    /** Funtion bắt sự kiện thay đổi tình trạng quan hệ */
    handleMaritalStatusChange = (e) => {
        const { value } = e.target;
        this.setState({
            maritalStatus: value,
        })
        this.props.handleChange('maritalStatus', value);
    }

    /** Function bắt sự kiện thay đổi mã nhân viên */
    handleMSNVChange = (e) => {
        const { value } = e.target;
        this.validateEmployeeNumber(value, true);
    }
    validateEmployeeNumber = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateEmployeeNumber(value, translate)
        if (willUpdateState) {
            this.setState({
                errorOnEmployeeNumber: msg,
                employeeNumber: value,
            });
            this.props.handleChange("employeeNumber", value);
        }
        return msg === undefined;
    }

    /** Function bắt sự kiện thay đổi mã chấm công */
    handleMSCCChange = (e) => {
        const { value } = e.target;
        this.validateMSCC(value, true);
    }
    validateMSCC = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateMSCC(value, translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnMSCC: msg,
                    employeeTimesheetId: value,
                }
            });
            this.props.handleChange("employeeTimesheetId", value);
        }
        return msg === undefined;
    }

    /** Function bắt sự kiện thay đổi Họ và tên */
    handleFullNameChange = (e) => {
        const { value } = e.target;
        this.validateFullName(value, true);
    }
    validateFullName = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateFullName(value, translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnFullName: msg,
                    fullName: value,
                }
            });
            this.props.handleChange("fullName", value);
        }
        return msg === undefined;
    }

    /** Function bắt sự kiện thay đổi Email công ty */
    handleEmailCompanyChange = (e) => {
        const { value } = e.target;
        this.validateEmailCompany(value, true);
    }
    validateEmailCompany = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateEmailCompany(value, translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnEmailCompany: msg,
                    emailInCompany: value,
                }
            });
            this.props.handleChange("emailInCompany", value);
        }
        return msg === undefined;
    }

    /** Function bắt sự kiện thay đổi số CMND */
    handleCMNDChange = (e) => {
        const { value } = e.target;
        this.validateCMND(value, true);
    }
    validateCMND = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateCMND(value, translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnCMND: msg,
                    identityCardNumber: value,
                }
            });
            this.props.handleChange("identityCardNumber", value);
        }
        return msg === undefined;
    }

    /** Function bắt sự kiện thay đổi nơi cấp */
    handleAddressCMNDChange = (e) => {
        const { value } = e.target;
        this.validateAddressCMND(value, true);
    }
    validateAddressCMND = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateAddressCMND(value, translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnAddressCMND: msg,
                    identityCardAddress: value,
                }
            });
            this.props.handleChange("identityCardAddress", value);
        }
        return msg === undefined;
    }

    /**
     * Function bắt sự kiện thay đổi ngày sinh
     * @param {*} value : Ngày sinh
     */
    handleBrithdayChange = (value) => {
        this.validateBrithday(value, true)
    }
    validateBrithday = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateBrithday(value, translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnBrithdate: msg,
                    birthdate: value,
                }
            });
            this.props.handleChange("birthdate", value);
        }
        return msg === undefined;
    }

    /**
     * Function bắt sự kiện thay đổi ngày bắt đầu làm việc
     * @param {*} value 
     */
    handleStartingDateChange = (value) => {
        const { translate } = this.props;
        let { errorOnLeavingDate, leavingDate } = this.state;

        let errorOnStartingDate = undefined;
        let startDate;
        if (value) {
            let partValue = value.split('-');
            startDate = [partValue[2], partValue[1], partValue[0]].join('-');
            let date = new Date(startDate);
            if (leavingDate) {
                let endDate = leavingDate.split('-');
                endDate = [endDate[2], endDate[1], endDate[0]].join('-');
                let d = new Date(endDate);
                if (date.getTime() >= d.getTime()) {
                    errorOnStartingDate = translate('human_resource.profile.starting_date_before_leaving_date');
                } else {
                    errorOnLeavingDate = errorOnLeavingDate === translate('human_resource.profile.leaving_date_after_starting_date') ? undefined : errorOnLeavingDate
                }
            }
        } else {
            this.props.handleChange("leavingDate", "");
            errorOnLeavingDate = undefined
        }

        this.setState({
            startingDate: value,
            leavingDate: value ? leavingDate : "",
            errorOnStartingDate: errorOnStartingDate,
            errorOnLeavingDate: errorOnLeavingDate === translate('human_resource.profile.starting_date_required') ? undefined : errorOnLeavingDate
        })
        this.props.handleChange("startingDate", value);
    }

    /**
     * Function bắt sự kiện thay đổi ngày nghỉ việc
     * @param {*} value 
     */
    handleLeavingDateChange = (value) => {
        const { translate } = this.props;
        let { startingDate } = this.state;

        if (value) {
            let partValue = value.split('-');
            let endDate = [partValue[2], partValue[1], partValue[0]].join('-');
            let date = new Date(endDate);
            if (startingDate) {
                let startDate = startingDate.split('-');
                startDate = [startDate[2], startDate[1], startDate[0]].join('-');
                let d = new Date(startDate);
                if (d.getTime() >= date.getTime()) {
                    this.setState({
                        leavingDate: value,
                        errorOnLeavingDate: translate('human_resource.profile.leaving_date_after_starting_date'),
                    })
                } else {
                    this.setState({
                        leavingDate: value,
                        errorOnStartingDate: undefined,
                        errorOnLeavingDate: undefined,
                    })
                }
            } else {
                this.setState({
                    leavingDate: value,
                    errorOnLeavingDate: translate('human_resource.profile.starting_date_required'),
                })
            }
        } else {
            this.setState({
                leavingDate: value,
                errorOnLeavingDate: undefined,
            })
        }
        this.props.handleChange("leavingDate", value);
    }

    /**
     * Function bắt sự kiện thay đổi ngày cấp CMND
     * @param {*} value : Ngày cấp CMND
     */
    handleDateCMNDChange = (value) => {
        this.validateCMNDDate(value, true);
    }
    validateCMNDDate = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateCMNDDate(value, translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnDateCMND: msg,
                    identityCardDate: value,
                }
            });
            this.props.handleChange("identityCardDate", value);
        }
        return msg === undefined;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id && nextProps.employee) {
            return {
                ...prevState,
                id: nextProps.id,
                img: nextProps.img,
                employeeNumber: nextProps.employee ? nextProps.employee.employeeNumber : '',
                employeeTimesheetId: nextProps.employee ? nextProps.employee.employeeTimesheetId : "",
                fullName: nextProps.employee ? nextProps.employee.fullName : '',
                gender: nextProps.employee ? nextProps.employee.gender : '',
                birthdate: GeneralTab.formatDate(nextProps.employee ? nextProps.employee.birthdate : ''),
                birthplace: nextProps.employee ? nextProps.employee.birthplace : '',
                emailInCompany: nextProps.employee ? nextProps.employee.emailInCompany : '',
                maritalStatus: nextProps.employee ? nextProps.employee.maritalStatus : '',
                identityCardNumber: nextProps.employee ? nextProps.employee.identityCardNumber : '',
                identityCardDate: GeneralTab.formatDate(nextProps.employee ? nextProps.employee.identityCardDate : ''),
                identityCardAddress: nextProps.employee ? nextProps.employee.identityCardAddress : '',
                ethnic: nextProps.employee ? nextProps.employee.ethnic : '',
                religion: nextProps.employee ? nextProps.employee.religion : '',
                nationality: nextProps.employee ? nextProps.employee.nationality : '',
                status: nextProps.employee ? nextProps.employee.status : "",
                startingDate: GeneralTab.formatDate(nextProps.employee ? nextProps.employee.startingDate : ''),
                leavingDate: GeneralTab.formatDate(nextProps.employee ? nextProps.employee.leavingDate : ''),

                errorOnBrithdate: undefined,
                errorOnDateCMND: undefined,
                errorOnEmployeeNumber: undefined,
                errorOnMSCC: undefined,
                errorOnFullName: undefined,
                errorOnEmailCompany: undefined,
                errorOnCMND: undefined,
                errorOnAddressCMND: undefined,
                errorOnStartingDate: undefined,
                errorOnLeavingDate: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate } = this.props;

        const { id, birthdate, identityCardDate, img, employeeNumber, employeeTimesheetId, fullName, gender, birthplace, status,
            startingDate, leavingDate, emailInCompany, maritalStatus, identityCardNumber, identityCardAddress, ethnic, religion, nationality,
            errorOnBrithdate, errorOnDateCMND, errorOnEmployeeNumber, errorOnMSCC, errorOnFullName, errorOnEmailCompany, errorOnStartingDate,
            errorOnCMND, errorOnAddressCMND, errorOnLeavingDate } = this.state;

        return (
            <div id={id} className="tab-pane active">
                <div className="row box-body">
                    {/* Ảnh đại diện */}
                    <div className="col-lg-4 col-md-4 col-ms-12 col-xs-12" style={{ textAlign: 'center' }}>
                        <div>
                            {img && <ApiImage className='attachment-img avarta' src={img} />}
                        </div>
                        <div className="upload btn btn-default ">
                            {translate('human_resource.profile.upload')}
                            <input className="upload" type="file" name="file" onChange={this.handleUpload} />
                        </div>
                    </div>

                    <div className="pull-right col-lg-8 col-md-8 col-ms-12  ">
                        {
                            id === 'page_general' &&
                            <div className="row col-lg-12 col-md-12 col-ms-12 col-xs-12">
                                <p >(<span className="text-red">*</span>): <span className="text-red">{translate('modal.note')}</span></p>
                            </div>
                        }

                        <div className="row">
                            {/* Mã số nhân viên */}
                            <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnEmployeeNumber && "has-error"}`}>
                                <label>{translate('human_resource.profile.staff_number')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="employeeNumber" value={employeeNumber} autoComplete="off" placeholder={translate('human_resource.profile.staff_number')} onChange={this.handleMSNVChange} />
                                <ErrorLabel content={errorOnEmployeeNumber} />
                            </div>
                            {/* Mã số chấm công */}
                            <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnMSCC && "has-error"}`}>
                                <label htmlFor="MSCC">{translate('human_resource.profile.attendance_code')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" placeholder={translate('human_resource.profile.attendance_code')} name="employeeTimesheetId" value={employeeTimesheetId} onChange={this.handleMSCCChange} autoComplete="off" />
                                <ErrorLabel content={errorOnMSCC} />
                            </div>
                        </div>
                        <div className="row">
                            {/* Tên nhân viên */}
                            <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnFullName && "has-error"}`}>
                                <label htmlFor="fullname">{translate('human_resource.profile.full_name')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="fullName" value={fullName} placeholder={translate('human_resource.profile.full_name')} onChange={this.handleFullNameChange} autoComplete="off" />
                                <ErrorLabel content={errorOnFullName} />
                            </div>
                            {/* Giới tính */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                <label>{translate('human_resource.profile.gender')}<span className="text-red">*</span></label>
                                <div>
                                    <div className="radio-inline">
                                        <label>
                                            <input type="radio" name={`gender${id}`} value="male" onChange={this.handleGenderChange}
                                                checked={gender === "male" ? true : false} />&nbsp;&nbsp;{translate('human_resource.profile.male')}</label>
                                    </div>
                                    <div className="radio-inline">
                                        <label>
                                            <input type="radio" name={`gender${id}`} value="female" onChange={this.handleGenderChange}
                                                checked={gender === "female" ? true : false} />&nbsp;&nbsp;{translate('human_resource.profile.female')}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {/* Ngày sinh */}
                            <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnBrithdate && "has-error"}`}>
                                <label >{translate('human_resource.profile.date_birth')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`brithday${id}`}
                                    value={birthdate}
                                    onChange={this.handleBrithdayChange}
                                />
                                <ErrorLabel content={errorOnBrithdate} />
                            </div>
                            {/* Nơi sinh */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                <label htmlFor="birthplace">{translate('human_resource.profile.place_birth')}</label>
                                <input type="text" className="form-control" name="birthplace" value={birthplace ? birthplace : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.place_birth')} autoComplete="off" />
                            </div>
                        </div>
                        <div className="row">
                            {/* Trạng thái làm việc */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                <label>{translate('human_resource.status')}</label>
                                <SelectBox
                                    id={`status${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={status}
                                    items={[{ value: 'active', text: translate('human_resource.profile.active') }, { value: 'leave', text: translate('human_resource.profile.leave') }]}
                                    onChange={this.handleChangeStatus}
                                />
                            </div>
                            {/* Tình trạng hôn nhân */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                <label>{translate('human_resource.profile.relationship')}</label>
                                <div>
                                    <div className="radio-inline">
                                        <label>
                                            <input type="radio" name={`maritalStatus${id}`} value="single" onChange={this.handleMaritalStatusChange} checked={maritalStatus === "single" ? true : false} />&nbsp;&nbsp;{translate('human_resource.profile.single')}</label>
                                    </div>
                                    <div className="radio-inline">
                                        <label>
                                            <input type="radio" name={`maritalStatus${id}`} value="married" onChange={this.handleMaritalStatusChange} checked={maritalStatus === "married" ? true : false} />&nbsp;&nbsp;{translate('human_resource.profile.married')}</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="form-group col-lg-12 col-md-12 col-ms-12 col-xs-12">
                        <div className="row">
                            {/* Email công ty */}
                            <div className={`form-group col-lg-4 col-md-4 col-ms-12 col-xs-12 ${errorOnEmailCompany && "has-error"}`}>
                                <label htmlFor="emailCompany">{translate('human_resource.profile.email')}<span className="text-red">*</span></label>
                                <input type="email" className="form-control" placeholder={translate('human_resource.profile.email_company')} name="emailInCompany" value={emailInCompany} onChange={this.handleEmailCompanyChange} autoComplete="off" />
                                <ErrorLabel content={errorOnEmailCompany} />
                            </div>
                            {/* Ngày bắt đầu làm việc */}
                            <div className={`form-group col-lg-4 col-md-4 col-ms-12 col-xs-12 ${errorOnStartingDate && "has-error"}`}>
                                <label >{translate('human_resource.profile.starting_date')}</label>
                                <DatePicker
                                    id={`startingDate${id}`}
                                    deleteValue={leavingDate ? false : true}
                                    value={startingDate}
                                    onChange={this.handleStartingDateChange}
                                />
                                <ErrorLabel content={errorOnStartingDate} />
                            </div>
                            {/* Ngày nghỉ việc */}
                            <div className={`form-group col-lg-4 col-md-4 col-ms-12 col-xs-12 ${errorOnLeavingDate && "has-error"}`}>
                                <label >{translate('human_resource.profile.leaving_date')}</label>
                                <DatePicker
                                    id={`leavingDate${id}`}
                                    value={leavingDate}
                                    onChange={this.handleLeavingDateChange}
                                />
                                <ErrorLabel content={errorOnLeavingDate} />
                            </div>
                        </div>
                        <div className="row">
                            {/* Số CMND */}
                            <div className={`form-group col-lg-4 col-md-4 col-ms-12 col-xs-12 ${errorOnCMND && "has-error"}`}>
                                <label htmlFor="CMND">{translate('human_resource.profile.id_card')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="identityCardNumber" value={identityCardNumber} onChange={this.handleCMNDChange} placeholder={translate('human_resource.profile.id_card')} autoComplete="off" />
                                <ErrorLabel content={errorOnCMND} />
                            </div>
                            {/* Ngày cấp */}
                            <div className={`form-group col-lg-4 col-md-4 col-ms-12 col-xs-12 ${errorOnDateCMND && "has-error"}`}>
                                <label >{translate('human_resource.profile.date_issued')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`dateCMND${id}`}
                                    value={identityCardDate}
                                    onChange={this.handleDateCMNDChange}
                                />
                                <ErrorLabel content={errorOnDateCMND} />
                            </div>
                            {/* Nơi cấp */}
                            <div className={`form-group col-lg-4 col-md-4 col-ms-12 col-xs-12 ${errorOnAddressCMND && "has-error"}`}>
                                <label htmlFor="addressCMND">{translate('human_resource.profile.issued_by')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="identityCardAddress" value={identityCardAddress} onChange={this.handleAddressCMNDChange} placeholder={translate('human_resource.profile.issued_by')} autoComplete="off" />
                                <ErrorLabel content={errorOnAddressCMND} />
                            </div>
                        </div>
                        <div className="row">
                            {/* Dân tộc */}
                            <div className="form-group col-lg-4 col-md-4 col-ms-12 col-xs-12">
                                <label htmlFor="national">{translate('human_resource.profile.ethnic')}</label>
                                <input type="text" className="form-control" name="ethnic" value={ethnic ? ethnic : ""} onChange={this.handleChange} placeholder={translate('human_resource.profile.ethnic')} autoComplete="off" />
                            </div>
                            {/* Tôn giáo */}
                            <div className="form-group col-lg-4 col-md-4 col-ms-12 col-xs-12">
                                <label htmlFor="religion">{translate('human_resource.profile.religion')}</label>
                                <input type="text" className="form-control" name="religion" value={religion ? religion : ""} onChange={this.handleChange} placeholder={translate('human_resource.profile.religion')} autoComplete="off" />
                            </div>
                            {/* Quốc tịch */}
                            <div className="form-group col-lg-4 col-md-4 col-ms-12 col-xs-12">
                                <label htmlFor="nation">{translate('human_resource.profile.nationality')}</label>
                                <input type="text" className="form-control" name="nationality" value={nationality ? nationality : ""} onChange={this.handleChange} placeholder={translate('human_resource.profile.nationality')} autoComplete="off" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

const generalTab = connect(null, null)(withTranslate(GeneralTab));
export { generalTab as GeneralTab };
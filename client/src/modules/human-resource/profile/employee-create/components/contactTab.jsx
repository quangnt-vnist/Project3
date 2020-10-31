import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ErrorLabel } from '../../../../../common-components';

import { EmployeeCreateValidator } from './employeeCreateValidator';

class ContactTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /** Function lưu các trường thông tin vào state */
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        })
        this.props.handleChange(name, value);
    }

    /** Function bắt sự kiện thay đổi điện thoại đi động 1 */
    handlePhoneChange = (e) => {
        const { value } = e.target;
        this.validatePhone(value, true);
    }
    validatePhone = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validatePhone(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnPhoneNumber: msg,
                    phoneNumber: value,
                }
            });
            this.props.handleChange("phoneNumber", value);
        }
        return msg === undefined;
    }

    /** Function bắt sự kiện thay đổi emailPersonal 1  */
    handleEmail1Change = (e) => {
        const { value } = e.target;
        this.validateEmail1(value, true);
    }
    validateEmail1 = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateEmail(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnPersonalEmail: msg,
                    personalEmail: value,
                }
            });
            this.props.handleChange("personalEmail", value);
        }
        return msg === undefined;
    }

    /** Function bắt sự kiện thay đổi emailPersonal 2 */
    handleEmail2Change = (e) => {
        const { value } = e.target;
        this.validateEmail2(value, true);
    }
    validateEmail2 = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateEmail(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnPersonalEmail2: msg,
                    personalEmail2: value,
                }
            });
            this.props.handleChange("personalEmail2", value);
        }
        return msg === undefined;
    }

    /** Function bắt sự kiện thay đổi email người liên hệ  */
    handleEmergencyContactPersonEmailChange = (e) => {
        const { value } = e.target;
        this.validateEmergencyContactPersonEmail(value, true);
    }
    validateEmergencyContactPersonEmail = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateEmail(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEmergencyContactPersonEmail: msg,
                    emergencyContactPersonEmail: value,
                }
            });
            this.props.handleChange("emergencyContactPersonEmail", value);
        }
        return msg === undefined;
    }

    /** Function bắt sự kiện thay đổi địa chỉ chỗ ở hiện tại */
    handleNowAddressChange = (e) => {
        const { value } = e.target;
        this.validateAddress(value, true);
    }
    validateAddress = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateAddress(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnTemporaryResidence: msg,
                    temporaryResidence: value,
                }
            });
            this.props.handleChange("temporaryResidence", value);
        }
        return msg === undefined;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                phoneNumber: nextProps.employee ? nextProps.employee.phoneNumber : "",
                phoneNumber2: nextProps.employee ? nextProps.employee.phoneNumber2 : "",
                personalEmail: nextProps.employee ? nextProps.employee.personalEmail : "",
                personalEmail2: nextProps.employee ? nextProps.employee.personalEmail2 : "",
                homePhone: nextProps.employee ? nextProps.employee.homePhone : "",
                emergencyContactPerson: nextProps.employee ? nextProps.employee.emergencyContactPerson : "",
                relationWithEmergencyContactPerson: nextProps.employee ? nextProps.employee.relationWithEmergencyContactPerson : "",
                emergencyContactPersonPhoneNumber: nextProps.employee ? nextProps.employee.emergencyContactPersonPhoneNumber : "",
                emergencyContactPersonEmail: nextProps.employee ? nextProps.employee.emergencyContactPersonEmail : "",
                emergencyContactPersonHomePhone: nextProps.employee ? nextProps.employee.emergencyContactPersonHomePhone : "",
                emergencyContactPersonAddress: nextProps.employee ? nextProps.employee.emergencyContactPersonAddress : "",
                permanentResidence: nextProps.employee ? nextProps.employee.permanentResidence : "",
                permanentResidenceCountry: nextProps.employee ? nextProps.employee.permanentResidenceCountry : "",
                permanentResidenceCity: nextProps.employee ? nextProps.employee.permanentResidenceCity : "",
                permanentResidenceDistrict: nextProps.employee ? nextProps.employee.permanentResidenceDistrict : "",
                permanentResidenceWard: nextProps.employee ? nextProps.employee.permanentResidenceWard : "",
                temporaryResidence: nextProps.employee ? nextProps.employee.temporaryResidence : "",
                temporaryResidenceCountry: nextProps.employee ? nextProps.employee.temporaryResidenceCountry : "",
                temporaryResidenceCity: nextProps.employee ? nextProps.employee.temporaryResidenceCity : "",
                temporaryResidenceDistrict: nextProps.employee ? nextProps.employee.temporaryResidenceDistrict : "",
                temporaryResidenceWard: nextProps.employee ? nextProps.employee.temporaryResidenceWard : "",

                errorOnPhoneNumber: undefined,
                errorOnTemporaryResidence: undefined,
                errorOnPersonalEmail: undefined,
                errorOnPersonalEmail2: undefined
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate } = this.props;

        // const { id } = this.props;


        const { id, phoneNumber2, phoneNumber, personalEmail, personalEmail2, homePhone, emergencyContactPerson,
            relationWithEmergencyContactPerson, emergencyContactPersonAddress, emergencyContactPersonPhoneNumber, emergencyContactPersonHomePhone, emergencyContactPersonEmail, permanentResidence,
            permanentResidenceWard, permanentResidenceDistrict, permanentResidenceCity, permanentResidenceCountry, temporaryResidence, temporaryResidenceWard, errorOnEmergencyContactPersonEmail,
            temporaryResidenceDistrict, temporaryResidenceCity, temporaryResidenceCountry, errorOnPhoneNumber, errorOnTemporaryResidence, errorOnPersonalEmail, errorOnPersonalEmail2 } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <div className="row">
                        {/* Điện thoại cá nhân 1 */}
                        <div className={`form-group col-md-4 ${errorOnPhoneNumber && "has-error"}`}>
                            <label >{translate('human_resource.profile.mobile_phone_1')}<span className="text-red">*</span></label>
                            <input type="number" className="form-control" name="phoneNumber" value={phoneNumber} onChange={this.handlePhoneChange} placeholder={translate('human_resource.profile.mobile_phone_1')} autoComplete="off" />
                            <ErrorLabel content={errorOnPhoneNumber} />
                        </div>
                        {/* Điện thoại cá nhân 2 */}
                        <div className="form-group col-md-4">
                            <label >{translate('human_resource.profile.mobile_phone_2')}</label>
                            <input type="number" className="form-control" name="phoneNumber2" value={phoneNumber2 ? phoneNumber2 : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.mobile_phone_2')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="row">
                        {/* Email cá nhân 1 */}
                        <div className={`form-group col-md-4 ${errorOnPersonalEmail && "has-error"}`}>
                            <label >{translate('human_resource.profile.personal_email_1')}</label>
                            <input type="text" className="form-control" name="personalEmail" value={personalEmail ? personalEmail : ''} onChange={this.handleEmail1Change} placeholder={translate('human_resource.profile.personal_email_1')} autoComplete="off" />
                            <ErrorLabel content={errorOnPersonalEmail} />
                        </div>
                        {/* Email cá nhân 2 */}
                        <div className={`form-group col-md-4 ${errorOnPersonalEmail2 && "has-error"}`}>
                            <label >{translate('human_resource.profile.personal_email_2')}</label>
                            <input type="text" className="form-control" name="personalEmail2" value={personalEmail2 ? personalEmail2 : ''} onChange={this.handleEmail2Change} placeholder={translate('human_resource.profile.personal_email_2')} autoComplete="off" />
                            <ErrorLabel content={errorOnPersonalEmail2} />
                        </div>
                        {/* Điện thoại cố định */}
                        <div className="form-group col-md-4">
                            <label >{translate('human_resource.profile.home_phone')}</label>
                            <input type="text" className="form-control" name="homePhone" value={homePhone ? homePhone : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.home_phone')} autoComplete="off" />
                        </div>
                    </div>
                    {/* Liên hệ khẩn cấp */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">
                            <h4 className="box-title">{translate('human_resource.profile.emergency_contact')}</h4>
                        </legend>
                        <div className="row">
                            {/* Tên người liên hệ */}
                            <div className="form-group col-md-4">
                                <label >{translate('human_resource.profile.full_name')}</label>
                                <input type="text" className="form-control" name="emergencyContactPerson" value={emergencyContactPerson ? emergencyContactPerson : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.full_name')} autoComplete="off" />
                            </div>
                            {/* Quan hệ */}
                            <div className="form-group col-md-4">
                                <label >{translate('human_resource.profile.nexus')}</label>
                                <input type="text" className="form-control" name="relationWithEmergencyContactPerson" value={relationWithEmergencyContactPerson ? relationWithEmergencyContactPerson : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.nexus')} autoComplete="off" />
                            </div>
                            {/* Địa chỉ */}
                            <div className="form-group col-md-4">
                                <label >{translate('human_resource.profile.address')}</label>
                                <input type="text" className="form-control" name="emergencyContactPersonAddress" value={emergencyContactPersonAddress ? emergencyContactPersonAddress : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.address')} autoComplete="off" />
                            </div>
                        </div>
                        <div className="row">
                            {/* Điện thoại di động */}
                            <div className="form-group col-md-4">
                                <label >{translate('human_resource.profile.mobile_phone')}</label>
                                <input type="text" className="form-control" name="emergencyContactPersonPhoneNumber" value={emergencyContactPersonPhoneNumber ? emergencyContactPersonPhoneNumber : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.mobile_phone')} autoComplete="off" />
                            </div>
                            {/* Điện thoại cố định */}
                            <div className="form-group col-md-4">
                                <label >{translate('human_resource.profile.home_phone')}</label>
                                <input type="text" className="form-control" name="emergencyContactPersonHomePhone" value={emergencyContactPersonHomePhone ? emergencyContactPersonHomePhone : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.home_phone')} autoComplete="off" />
                            </div>
                            {/* Email */}
                            <div className={`form-group col-md-4 ${errorOnEmergencyContactPersonEmail && "has-error"}`}>
                                <label >{translate('human_resource.profile.email')}</label>
                                <input type="text" className="form-control" name="emergencyContactPersonEmail" value={emergencyContactPersonEmail ? emergencyContactPersonEmail : ''} onChange={this.handleEmergencyContactPersonEmailChange} placeholder={translate('human_resource.profile.email')} autoComplete="off" />
                                <ErrorLabel content={errorOnEmergencyContactPersonEmail} />
                            </div>
                        </div>
                    </fieldset>
                    <div className="row">
                        <div className="col-md-6">
                            {/* Hộ khẩu thường trú */}
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.permanent_address')}</h4></legend>
                                {/* Địa chỉ */}
                                <div className="form-group">
                                    <label >{translate('human_resource.profile.address')}</label>
                                    <input type="text" className="form-control " name="permanentResidence" value={permanentResidence ? permanentResidence : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.address')} autoComplete="off" />
                                </div>
                                {/* Xã/Phường */}
                                <div className="form-group">
                                    <label >{translate('human_resource.profile.wards')}</label>
                                    <input type="text" className="form-control " name="permanentResidenceWard" value={permanentResidenceWard ? permanentResidenceWard : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.wards')} autoComplete="off" />
                                </div>
                                {/* Huyện/Quận */}
                                <div className="form-group">
                                    <label >{translate('human_resource.profile.district')}</label>
                                    <input type="text" className="form-control " name="permanentResidenceDistrict" value={permanentResidenceDistrict ? permanentResidenceDistrict : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.district')} autoComplete="off" />
                                </div>
                                {/* Tỉnh/Thành phố */}
                                <div className="form-group">
                                    <label >{translate('human_resource.profile.province')}</label>
                                    <input type="text" className="form-control " name="permanentResidenceCity" value={permanentResidenceCity ? permanentResidenceCity : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.province')} autoComplete="off" />
                                </div>
                                {/* Quốc gia */}
                                <div className="form-group">
                                    <label >{translate('human_resource.profile.nation')}</label>
                                    <input type="text" className="form-control " name="permanentResidenceCountry" value={permanentResidenceCountry ? permanentResidenceCountry : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.nation')} autoComplete="off" />
                                </div>
                            </fieldset>
                        </div>
                        <div className="col-md-6">
                            {/* Chỗ ở hiện tại*/}
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border"><h4 className="box-title"> {translate('human_resource.profile.current_residence')}</h4></legend>
                                {/* Địa chỉ hiện tại */}
                                <div className={`form-group ${errorOnTemporaryResidence && "has-error"}`}>
                                    <label >{translate('human_resource.profile.address')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control " name="temporaryResidence" value={temporaryResidence ? temporaryResidence : ''} onChange={this.handleNowAddressChange} placeholder={translate('human_resource.profile.address')} autoComplete="off" />
                                    <ErrorLabel content={errorOnTemporaryResidence} />
                                </div>
                                {/* Xã/Phường */}
                                <div className="form-group">
                                    <label >{translate('human_resource.profile.wards')}</label>
                                    <input type="text" className="form-control " name="temporaryResidenceWard" value={temporaryResidenceWard ? temporaryResidenceWard : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.wards')} autoComplete="off" />
                                </div>
                                {/* Huyện/Quận */}
                                <div className="form-group">
                                    <label >{translate('human_resource.profile.district')}</label>
                                    <input type="text" className="form-control " name="temporaryResidenceDistrict" value={temporaryResidenceDistrict ? temporaryResidenceDistrict : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.district')} autoComplete="off" />
                                </div>
                                {/* Tỉnh/Thành phố */}
                                <div className="form-group">
                                    <label >{translate('human_resource.profile.province')}</label>
                                    <input type="text" className="form-control " name="temporaryResidenceCity" value={temporaryResidenceCity ? temporaryResidenceCity : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.province')} autoComplete="off" />
                                </div>
                                {/* Quốc gia */}
                                <div className="form-group">
                                    <label >{translate('human_resource.profile.nation')}</label>
                                    <input type="text" className="form-control " name="temporaryResidenceCountry" value={temporaryResidenceCountry ? temporaryResidenceCountry : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.nation')} autoComplete="off" />
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
};

const contactTab = connect(null, null)(withTranslate(ContactTab));
export { contactTab as ContactTab };
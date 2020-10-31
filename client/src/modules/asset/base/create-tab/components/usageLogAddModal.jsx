import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox, TimePicker } from '../../../../../common-components';

import { AssetCreateValidator } from './combinedContent';

import { UserActions } from '../../../../super-admin/user/redux/actions';

class UsageLogAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usedByUser: "",
            usedByOrganizationalUnit: "",
            startDate: this.props.startDate ? this.formatDate(this.props.startDate) : this.formatDate(Date.now()),
            endDate: this.props.endDate ? this.formatDate(this.props.endDate) : this.formatDate(Date.now()),
            description: "",
            startTime: this.props.startTime ? this.props.startTime : "" ,
            stopTime: this.props.stopTime ? this.props.stopTime: "",
        };
    }

    // Function format ngày hiện tại thành dạnh mm-yyyy
    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        return [day, month, year].join('-');
    }

    /**
     * Bắt sự kiện thay đổi người sử dụng
     */
    handleUsedByUserChange = (value) => {
        let usedByUser = value[0] !== 'null' ? value[0] : null;
        this.setState({
            ...this.state,
            usedByUser: usedByUser
        });
    }

    /**
     * Bắt sự kiện thay đổi đơn vị sử dụng
     */
    handleUsedByOrganizationalUnitChange = (value) => {
        let usedByOrganizationalUnit = value[0] !== 'null' ? value[0] : null;
        this.setState({
            ...this.state,
            usedByOrganizationalUnit: usedByOrganizationalUnit
        });
    }

    //Bắt sự kiện thay đổi "Thời gian bắt đầu sử dụng"
    handleStartDateChange = (value) => {
        this.validateStartDate(value, true);
    }
    validateStartDate = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateStartDate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnStartDate: msg,
                    startDate: value,
                }
            });
        }
        return msg === undefined;
    }

    handleStartTimeChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                startTime: value
            }
        });

    }
    // Bắt sự kiện thay đổi "Thời gian kết thúc sử dụng"
    handleEndDateChange = (value) => {
        this.validateEndDate(value, true);
    }
    validateEndDate = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateEndDate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEndDate: msg,
                    endDate: value,
                }
            });
        }
        return msg === undefined;
    }

    handleStopTimeChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                stopTime: value
            }
        });

    }
    // Bắt sự kiện thay đổi "Nội dung"
    handleDescriptionChange = (e) => {
        let value = e.target.value;
        this.validateDescription(value, true);
    }
    validateDescription = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateDescription(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDescription: msg,
                    description: value,
                }
            });
        }
        return msg === undefined;
    }


    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let checkUsed;
        let checkUsedByUser = true, checkUsedByOrganizationalUnit = true;
        if (this.state.usedByUser == "" || !this.state.usedByUser) {
            checkUsedByUser = false
        }
        if (this.state.usedByOrganizationalUnit == "" || !this.state.usedByOrganizationalUnit) {
            checkUsedByOrganizationalUnit = false
        }

        if (!checkUsedByUser && !checkUsedByOrganizationalUnit) {
            checkUsed = false;
        } else {
            checkUsed = true;
        }

        let result = checkUsed && this.validateStartDate(this.state.startDate, false)

        return result;
    }

    // Bắt sự kiện submit form
    save = async () => {
        const { user } = this.props;
        let userlist = user.list;
        let partStart, startDate, partEnd, endDate;
        partStart = this.state.startDate.split('-');
        if( this.state.startTime != ""){
            let date = [partStart[2], partStart[1], partStart[0]].join('-');
            startDate = [date, this.state.startTime].join(' ');
        } else {
            startDate = [partStart[2], partStart[1], partStart[0]].join('-');
        }

        partEnd = this.state.endDate.split('-');
        if( this.state.stopTime != ""){
            let date = [partEnd[2], partEnd[1], partEnd[0]].join('-');
            endDate = [date, this.state.stopTime].join(' ')
        } else {
            endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        }

        if (this.state.usedByUser === '') {
            await this.setState({
                ...this.state,
                usedByUser: null,
            });
        }

        if (this.state.usedByOrganizationalUnit === '') {
            await this.setState({
                ...this.state,
                usedByOrganizationalUnit: null,
            });
        }

        if (this.isFormValidated()) {
            return this.props.handleChange({ ...this.state, startDate: startDate, endDate: endDate });
        }
    }

    render() {

        const { id } = this.props;
        const { translate, user, department } = this.props;
        const { usedByUser, usedByOrganizationalUnit, startDate, endDate, description, errorOnDescription, startTime, stopTime } = this.state;

        var userlist = user.list, departmentlist = department.list;

        return (
            <React.Fragment>
                { !this.props.calendarUsage &&
                    <ButtonModal modalID={`modal-create-usage-${id}`} button_name={translate('asset.general_information.add')} title={translate('asset.asset_info.add_usage_info')} />
                }
                <DialogModal
                    size='50' modalID={`modal-create-usage-${id}`} isLoading={false}
                    formID={`form-create-usage-${id}`}
                    title={translate('asset.asset_info.add_usage_info')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form thêm thông tin sử dụng */}
                    <form className="form-group" id={`form-create-usage-${id}`}>
                        <div className="col-md-12">

                            {/* Người sử dụng */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.user')}<span className="text-red">*</span></label>
                                <div>
                                    <div id="usedByUserBox">
                                        <SelectBox
                                            id={`usedByUser${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={[{ value: 'null', text: 'Chọn người sử dụng' }, ...userlist.map(x => { return { value: x._id, text: x.name + " - " + x.email } })]}
                                            onChange={this.handleUsedByUserChange}
                                            value={usedByUser}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.organization_unit')}</label>
                                <div>
                                    <div id="usedByUserBox">
                                        <SelectBox
                                            id={`usedByOrganizationalUnit${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={[{ value: 'null', text: 'Chọn đơn vị sử dụng' }, ...departmentlist.map(x => { return { value: x._id, text: x.name } })]}
                                            onChange={this.handleUsedByOrganizationalUnitChange}
                                            value={usedByOrganizationalUnit}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Thời gian bắt đầu sử dụng */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.handover_from_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`add-start-date-${id}`}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                            </div>
                            {this.props.typeRegisterForUse == 2 &&
                                <TimePicker
                                    id={`time-picker-start-${id}`}
                                    onChange={this.handleStartTimeChange}
                                    value={startTime}
                                // getDefaultValue = {this.getDefaultStartValue}
                                />
                            }

                            {/* Thời gian kết thúc sử dụng */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.handover_to_date')}</label>
                                <DatePicker
                                    id={`add-end-date-${id}`}
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                            </div>
                            {this.props.typeRegisterForUse == 2 &&
                                <TimePicker
                                    id={`time-picker-end-${id}`}
                                    onChange={this.handleStopTimeChange}
                                    value={stopTime}
                                // getDefaultValue = {this.getDefaultEndValue}
                                />
                            }


                            {/* Nội dung */}
                            <div className={`form-group ${!errorOnDescription ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.content')}</label>
                                <textarea className="form-control" rows="3" name="description" value={description} onChange={this.handleDescriptionChange} autoComplete="off"
                                    placeholder={translate('asset.general_information.content')}></textarea>
                                <ErrorLabel content={errorOnDescription} />
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    var { user, department } = state;
    return { user, department };
};

const actionCreators = {
    getUser: UserActions.get,
};

const addModal = connect(mapState, actionCreators)(withTranslate(UsageLogAddModal));
export { addModal as UsageLogAddModal };

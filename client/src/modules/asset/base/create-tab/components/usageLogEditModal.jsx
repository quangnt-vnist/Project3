import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';

import { AssetCreateValidator } from './combinedContent';

import { UserActions } from '../../../../super-admin/user/redux/actions';

class UsageLogEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
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
            
        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
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

    // Bắt sự kiện thay đổi "Thời gian bắt đầu sử dụng"
    handleStartDateChange = (value) => {
        this.validateStartDate(value, true);
    }
    validateStartDate = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateStartDate(value, this.props.translate)
        let partStart = value.split("-");
        let startDate = new Date ( partStart[2], partStart[1] - 1, partStart[0]);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnStartDate: msg,
                    startDate: startDate,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Thời gian kết thúc sử dụng"
    handleEndDateChange = (value) => {
        this.validateEndDate(value, true);
    }

    validateEndDate = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateEndDate(value, this.props.translate)
        let partEnd = value.split("-");
        let endDate = new Date ( partEnd[2], partEnd[1] - 1, partEnd[0]);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEndDate: msg,
                    endDate: endDate,
                }
            });
        }
        return msg === undefined;
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
        let checkUsed ;
        let checkUsedByUser = true, checkUsedByOrganizationalUnit = true;
        if(this.state.usedByUser == "" || !this.state.usedByUser){
            checkUsedByUser = false
        }
        if(this.state.usedByOrganizationalUnit == "" || !this.state.usedByOrganizationalUnit){
            checkUsedByOrganizationalUnit = false
        }
        
        if(!checkUsedByUser && !checkUsedByOrganizationalUnit){
            checkUsed = false;
        } else {
            checkUsed = true;
        }

        let result = checkUsed && this.validateStartDate(this.state.startDate, false) 

        return result;
    }

    // Bắt sự kiện submit form
    save = async () => {
        var partStart = this.formatDate(this.state.startDate).split('-');
        var startDate = [partStart[2], partStart[1], partStart[0]].join('-');
        var partEnd = this.formatDate(this.state.endDate).split('-');
        var endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        let usedByUser = this.state.usedByUser;
        let usedByOrganizationalUnit = this.state.usedByOrganizationalUnit;

        if (this.isFormValidated()) {
            return this.props.handleChange({ 
                ...this.state, 
                assignedToUser: usedByUser, 
                assignedToOrganizationalUnit: usedByOrganizationalUnit,
                startDate: startDate, 
                endDate: endDate 
            });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                _id: nextProps._id,
                index: nextProps.index,
                usedByUser: nextProps.usedByUser,
                usedByOrganizationalUnit: nextProps.usedByOrganizationalUnit,
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
                description: nextProps.description,
                errorOnDescription: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id } = this.props;
        const { translate, user, department } = this.props;
        const { usedByUser, usedByOrganizationalUnit, startDate, endDate, description, errorOnDescription } = this.state;

        var userlist = user.list, departmentlist = department.list;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-usage-${id}`} isLoading={false}
                    formID={`form-edit-usage-${id}`}
                    title={translate('asset.asset_info.edit_usage_info')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa thông tin sử dụng */}
                    <form className="form-group" id={`form-edit-usage-${id}`}>
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
                                            items={[{value: 'null', text: 'Chọn người sử dụng'}, ...userlist.map(x => { return { value: x._id, text: x.name + " - " + x.email } })]}
                                            onChange={this.handleUsedByUserChange}
                                            value={usedByUser}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Đơn vị sử dụng */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.user')}</label>
                                <div>
                                    <div id="usedByUserBox">
                                        <SelectBox
                                            id={`usedByOrganizationalUnit${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={[{value: 'null', text: 'Chọn đơn vị sử dụng'}, ...departmentlist.map(x => { return { value: x._id, text: x.name} })]}
                                            onChange={this.handleUsedByOrganizationalUnitChange}
                                            value={usedByOrganizationalUnit}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Thời gian bắt đầu sử dụng */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.handover_from_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit-start-date-${id}`}
                                    value={this.formatDate(startDate)}
                                    onChange={this.handleStartDateChange}
                                />
                            </div>

                            {/* Thời gian kết thúc sử dụng */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.handover_to_date')}</label>
                                <DatePicker
                                    id={`edit-end-date-${id}`}
                                    value={this.formatDate(endDate)}
                                    onChange={this.handleEndDateChange}
                                />
                            </div>

                            {/* Nội dung */}
                            <div className={`form-group ${!errorOnDescription ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.content')}</label>
                                <textarea className="form-control" rows="3" name="description" value={description} onChange={this.handleDescriptionChange} autoComplete="off"
                                    placeholder="Nội dung"></textarea>
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

const editModal = connect(mapState, null)(withTranslate(UsageLogEditModal));

export { editModal as UsageLogEditModal };

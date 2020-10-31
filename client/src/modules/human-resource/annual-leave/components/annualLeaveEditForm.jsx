import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components';

import { AnnualLeaveFormValidator } from './annualLeaveFormValidator';

import { AnnualLeaveActions } from '../redux/actions';

class AnnualLeaveEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * Bắt sự kiện thay đổi ngày bắt đầu
     * @param {*} value : Giá trị ngày bắt đầu
     */
    handleStartDateChange = (value) => {
        const { translate } = this.props;
        let { errorOnEndDate, endDate } = this.state;

        let errorOnStartDate;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partEndDate = endDate.split('-');
        let d = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'));

        if (date.getTime() > d.getTime()) {
            errorOnStartDate = translate('human_resource.start_date_before_end_date');
        } else {
            errorOnEndDate = undefined;
        }

        this.setState({
            startDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })
    }

    /**
     * Bắt sự kiện thay đổi ngày kết thúc
     * @param {*} value : Giá trị ngày kết thúc
     */
    handleEndDateChange = (value) => {
        const { translate } = this.props;
        let { startDate, errorOnStartDate } = this.state;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partStartDate = startDate.split('-');
        let d = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'));
        let errorOnEndDate;
        if (d.getTime() > date.getTime()) {
            errorOnEndDate = translate('human_resource.start_date_before_end_date');
        } else {
            errorOnStartDate = undefined;
        }

        this.setState({
            endDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })
    }

    /** Bắt sự kiện thay đổi lý do xin nghỉ phép */
    handleReasonChange = (e) => {
        let { value } = e.target;
        this.validateReason(value, true);
    }
    validateReason = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = AnnualLeaveFormValidator.validateReason(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnReason: msg,
                    reason: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi trạng thái đơn xin nghỉ phép */
    handleStatusChange = (e) => {
        let { value } = e.target;
        this.setState({
            ...this.state,
            status: value
        })
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    isFormValidated = () => {
        const { startDate, endDate, reason } = this.state;
        let result = this.validateReason(reason, false);
        let partStart = startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        let partEnd = endDate.split('-');
        let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        if (new Date(startDateNew).getTime() <= new Date(endDateNew).getTime()) {
            return result;
        } else return false;
    }

    /** Bắt sự kiện submit form */
    save = () => {
        const { startDate, endDate, _id } = this.state;
        let partStart = startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        let partEnd = endDate.split('-');
        let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        if (this.isFormValidated()) {
            return this.props.updateAnnualLeave(_id, { ...this.state, startDate: startDateNew, endDate: endDateNew });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                employeeNumber: nextProps.employeeNumber,
                organizationalUnit: nextProps.organizationalUnit,
                endDate: nextProps.endDate,
                startDate: nextProps.startDate,
                reason: nextProps.reason,
                status: nextProps.status,
                errorOnReason: undefined,
                errorOnStartDate: undefined,
                errorOnEndDate: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, annualLeave, department } = this.props;

        const { _id, employeeNumber, organizationalUnit, startDate, endDate, reason, status,
            errorOnReason, errorOnStartDate, errorOnEndDate } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-edit-sabbtical" isLoading={annualLeave.isLoading}
                    formID="form-edit-sabbtical"
                    title={translate('human_resource.annual_leave.edit_annual_leave')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-sabbtical">
                        {/* Mã số nhân viên*/}
                        <div className="form-group">
                            <label>{translate('human_resource.staff_number')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="employeeNumber" value={employeeNumber} disabled />
                        </div>
                        {/* Đơn vị */}
                        <div className="form-group">
                            <label>{translate('human_resource.unit')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`edit-annaul-leave-unit`}
                                className="form-control select2"
                                disabled={true}
                                style={{ width: "100%" }}
                                value={organizationalUnit}
                                items={department.list.map(y => { return { value: y._id, text: y.name } })}
                                onChange={this.handleOrganizationalUnitChange}
                            />
                        </div>
                        <div className="row">
                            {/* Ngày bắt đầu */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && "has-error"}`}>
                                <label>{translate('human_resource.annual_leave.table.start_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit_start_date${_id}`}
                                    deleteValue={false}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            {/* Ngày kết thúc */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate && "has-error"}`}>
                                <label>{translate('human_resource.annual_leave.table.end_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit_end_date${_id}`}
                                    deleteValue={false}
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                                <ErrorLabel content={errorOnEndDate} />
                            </div>
                        </div>
                        {/* Lý do */}
                        <div className={`form-group ${errorOnReason && "has-error"}`}>
                            <label>{translate('human_resource.annual_leave.table.reason')}<span className="text-red">*</span></label>
                            <textarea className="form-control" rows="3" style={{ height: 72 }} name="reason" value={reason} onChange={this.handleReasonChange}></textarea>
                            <ErrorLabel content={errorOnReason} />
                        </div>
                        {/* Trạng thái */}
                        <div className="form-group">
                            <label>{translate('human_resource.status')}<span className="text-red">*</span></label>
                            <select className="form-control" value={status} name="status" onChange={this.handleStatusChange}>
                                <option value="approved">{translate('human_resource.annual_leave.status.approved')}</option>
                                <option value="waiting_for_approval">{translate('human_resource.annual_leave.status.waiting_for_approval')}</option>
                                <option value="disapproved">{translate('human_resource.annual_leave.status.disapproved')}</option>
                            </select>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { annualLeave, department } = state;
    return { annualLeave, department };
};

const actionCreators = {
    updateAnnualLeave: AnnualLeaveActions.updateAnnualLeave,
};

const editSabbatical = connect(mapState, actionCreators)(withTranslate(AnnualLeaveEditForm));
export { editSabbatical as AnnualLeaveEditForm };
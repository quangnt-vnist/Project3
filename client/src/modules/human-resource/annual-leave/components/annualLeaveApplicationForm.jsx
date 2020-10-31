import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components';

import { AnnualLeaveFormValidator } from './annualLeaveFormValidator';

import { AnnualLeaveActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';

class AnnualLeaveApplicationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organizationalUnit: "",
            startDate: this.formatDate(Date.now()),
            endDate: this.formatDate(Date.now()),
            reason: "",
        };
    }

    componentDidMount() {
        this.props.getDepartmentOfUser();
    }

    /**
     * Function format ngày hiện tại thành dạnh dd-mm-yyyy
     * @param {*} date : Ngày muốn format
     */
    formatDate = (date) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [day, month, year].join('-');
        }
        return date;

    }

    /**
     * Bắt sự kiện thay đổi người nhận
     * @param {*} value : Giá trị người nhận
     */
    handleOrganizationalUnitChange = (value) => {
        this.validateOrganizationalUnit(value[0], true);
    }
    validateOrganizationalUnit = (value, willUpdateState = true) => {
        const { translate } = this.props;

        let msg = AnnualLeaveFormValidator.validateReason(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnOrganizationalUnit: msg,
                    organizationalUnit: value,
                }
            });
        }
        return msg === undefined;
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
            errorOnEndDate = undefined
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

        let errorOnEndDate;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partStartDate = startDate.split('-');
        let d = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'));

        if (d.getTime() > date.getTime()) {
            errorOnEndDate = translate('human_resource.start_date_before_end_date');
        } else {
            errorOnStartDate = undefined
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

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    isFormValidated = () => {
        const { organizationalUnit, reason, startDate, endDate } = this.state;

        let result = this.validateOrganizationalUnit(organizationalUnit, false) && this.validateReason(reason, false);

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
        const { startDate, endDate } = this.state;

        let partStart = startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        let partEnd = endDate.split('-');
        let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-');

        if (this.isFormValidated()) {
            return this.props.createAnnualLeave({ ...this.state, createApplication: true, startDate: startDateNew, endDate: endDateNew });
        }
    }

    render() {
        const { translate, user } = this.props;

        const { startDate, endDate, reason, organizationalUnit,
            errorOnOrganizationalUnit, errorOnReason, errorOnStartDate, errorOnEndDate } = this.state;

        return (
            <React.Fragment>
                <ButtonModal modalID="modal-aplication-annual-leave" button_name={translate('human_resource.annual_leave_personal.create_annual_leave')} />
                <DialogModal
                    size='50' modalID="modal-aplication-annual-leave" isLoading={user.isLoading}
                    formID="form-aplication-annual-leave"
                    title={translate('human_resource.annual_leave_personal.create_annual_leave')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-aplication-annual-leave">
                        {/* Người nhận */}
                        <div className={`form-group ${errorOnOrganizationalUnit && "has-error"}`}>
                            <label>{translate('human_resource.unit')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`create-application-annual-leave-unit`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={organizationalUnit}
                                items={user.organizationalUnitsOfUser ? [...user.organizationalUnitsOfUser.map(y => { return { value: y._id, text: y.name } }), { value: "", text: translate('human_resource.non_unit') }] : []}
                                onChange={this.handleOrganizationalUnitChange}
                            />
                            <ErrorLabel content={errorOnOrganizationalUnit} />
                        </div>
                        <div className="row">
                            {/* Ngày bắt đầu */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && "has-error"}`}>
                                <label>{translate('human_resource.annual_leave.table.start_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="application_start_date"
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
                                    id="application_end_date"
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
                            <textarea className="form-control" rows="3" style={{ height: 72 }} name="reason" value={reason} onChange={this.handleReasonChange} placeholder="Enter ..." autoComplete="off"></textarea>
                            <ErrorLabel content={errorOnReason} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
};

function mapState(state) {
    const { annualLeave, user } = state;
    return { annualLeave, user };
};

const actionCreators = {
    createAnnualLeave: AnnualLeaveActions.createAnnualLeave,
    getDepartmentOfUser: UserActions.getDepartmentOfUser,
};

const applicationForm = connect(mapState, actionCreators)(withTranslate(AnnualLeaveApplicationForm));
export { applicationForm as AnnualLeaveApplicationForm };

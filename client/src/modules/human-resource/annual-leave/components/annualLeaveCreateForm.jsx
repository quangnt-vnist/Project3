import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components';

import { AnnualLeaveFormValidator } from './annualLeaveFormValidator';

import { AnnualLeaveActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { EmployeeManagerActions } from '../../profile/employee-management/redux/actions';

class AnnualLeaveCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employee: "",
            startDate: this.formatDate(Date.now()),
            endDate: this.formatDate(Date.now()),
            status: "pass",
            reason: "",
        };
    }

    componentDidMount() {
        this.props.getAllEmployee();
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

    /** Function bắt sự kiện thay đổi mã nhân viên */
    handleMSNVChange = async (value) => {
        await this.props.getDepartmentOfUser({ email: value[0] });
        this.validateEmployeeNumber(value[0], true);
    }
    validateEmployeeNumber = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = AnnualLeaveFormValidator.validateEmployeeNumber(value, translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEmployee: msg,
                    employee: value,
                    organizationalUnit: "",
                }
            });

        }
        return msg === undefined;
    }

    /** Function bắt sự kiện thay đổi đơn vị */
    handleOrganizationalUnitChange = (value) => {
        this.validateOrganizationalUnit(value[0], true);
    }
    validateOrganizationalUnit = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = AnnualLeaveFormValidator.validateEmployeeNumber(value, translate);
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
        const { user } = this.props;
        let { employee, organizationalUnit, reason, startDate, endDate } = this.state;

        if (user.organizationalUnitsOfUserByEmail) {
            if (!organizationalUnit) {
                let department = user.organizationalUnitsOfUserByEmail[0];
                organizationalUnit = department._id;
            }
        }

        let result = this.validateEmployeeNumber(employee, false) &&
            this.validateReason(reason, false) && this.validateOrganizationalUnit(organizationalUnit, false);

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
        const { user, employeesManager } = this.props;
        let { organizationalUnit, startDate, endDate, employee } = this.state;
        if (user.organizationalUnitsOfUserByEmail) {
            if (!organizationalUnit) {
                let department = user.organizationalUnitsOfUserByEmail[0];
                organizationalUnit = department._id;
            }
        }
        let employeeID = employeesManager.listAllEmployees.find(x => x.emailInCompany === employee);
        employeeID = employeeID._id;

        let partStart = startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        let partEnd = endDate.split('-');
        let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-');

        if (this.isFormValidated()) {
            return this.props.createAnnualLeave({ ...this.state, startDate: startDateNew, endDate: endDateNew, employee: employeeID, organizationalUnit: organizationalUnit, });
        }
    }

    render() {
        const { translate, annualLeave, user, employeesManager } = this.props;

        let { employee, organizationalUnit, startDate, endDate, reason, status, errorOnOrganizationalUnit,
            errorOnEmployee, errorOnReason, errorOnStartDate, errorOnEndDate } = this.state;

        let listAllEmployees = employeesManager.listAllEmployees;
        let listDepartments = [{ _id: "", name: translate('human_resource.non_unit') }];
        if (user.organizationalUnitsOfUserByEmail) {
            listDepartments = user.organizationalUnitsOfUserByEmail;
            if (!organizationalUnit) {
                let department = user.organizationalUnitsOfUserByEmail[0];
                organizationalUnit = department._id;
            }
        }

        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-annual-leave" button_name={translate('human_resource.annual_leave.add_annual_leave')} title={translate('human_resource.annual_leave.add_annual_leave_title')} />
                <DialogModal
                    size='50' modalID="modal-create-annual-leave" isLoading={annualLeave.isLoading}
                    formID="form-create-annual-leave"
                    title={translate('human_resource.annual_leave.add_annual_leave_title')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-create-annual-leave">
                        {/* Mã số nhân viên */}
                        <div className={`form-group ${errorOnEmployee && "has-error"}`}>
                            <label>{translate('human_resource.staff_number')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`create-annual-leave-employee`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={employee}
                                items={listAllEmployees.map(y => { return { value: y.emailInCompany, text: `${y.employeeNumber} - ${y.fullName}` } }).concat([{ value: "", text: translate('human_resource.non_staff') }])}
                                onChange={this.handleMSNVChange}
                            />
                            <ErrorLabel content={errorOnEmployee} />
                        </div>
                        {/* Đơn vị */}
                        <div className={`form-group ${errorOnOrganizationalUnit && "has-error"}`}>
                            <label>{translate('human_resource.unit')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`create-annual-leave-unit`}
                                className="form-control select2"
                                disabled={listDepartments.length > 1 ? false : true}
                                style={{ width: "100%" }}
                                value={organizationalUnit}
                                items={listDepartments.map(y => { return { value: y._id, text: y.name } })}
                                onChange={this.handleOrganizationalUnitChange}
                            />
                            <ErrorLabel content={errorOnOrganizationalUnit} />
                        </div>
                        <div className="row">
                            {/* Ngày bắt đầu */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && "has-error"}`}>
                                <label>{translate('human_resource.annual_leave.table.start_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_start_date"
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
                                    id="create_end_date"
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
    const { annualLeave, employeesManager, user } = state;
    return { annualLeave, employeesManager, user };
};

const actionCreators = {
    createAnnualLeave: AnnualLeaveActions.createAnnualLeave,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    getDepartmentOfUser: UserActions.getDepartmentOfUser,
};

const createForm = connect(mapState, actionCreators)(withTranslate(AnnualLeaveCreateForm));
export { createForm as AnnualLeaveCreateForm };

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AnnualLeaveApplicationForm } from './combinedContent';
import { DatePicker } from '../../../../common-components';

import { WorkPlanActions } from '../../work-plan/redux/actions';
import { AnnualLeaveActions } from '../redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';

class AnnualLeave extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: new Date().getFullYear(),
        }
    }

    componentDidMount() {
        const { year } = this.state;
        this.props.getDepartment();
        this.props.getListWorkPlan({ year: year });
        this.props.getNumberAnnaulLeave({ numberAnnulLeave: true, year: year });
    }

    /**
    * Function format ngày hiện tại thành dạnh dd/mm/yyyy
    * @param {*} date : Ngày muốn format
    */
    formatDate(date) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [day, month, year].join('/');
        }
        return date;
    };

    /**
    * Function format dữ liệu Date thành string
    * @param {*} date : Ngày muốn format
    * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
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
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }

        return date;
    }


    /**
    * Bắt sự kiện thay đổi số ngày được nghỉ phép trong năm
    * @param {*} value : Tổng số ngày được nghỉ phép
    */
    handleYearChange = (value) => {
        this.setState({
            year: value
        })
    };

    // Bắt sự kiện tìm kiếm
    handleSunmitSearch = () => {
        const { year } = this.state;
        this.props.getNumberAnnaulLeave({ numberAnnulLeave: true, year: year });
    }

    render() {
        const { translate, workPlan, annualLeave, department } = this.props;

        const { year } = this.state;

        let workPlans = [], maximumNumberOfLeaveDays = 0;
        let listAnnualLeavesOfOneYear = annualLeave.listAnnualLeavesOfOneYear;
        if (workPlan.listWorkPlan && workPlan.listWorkPlan.length !== 0) {
            workPlans = workPlan.listWorkPlan;
            maximumNumberOfLeaveDays = workPlan.maximumNumberOfLeaveDays;
        };

        return (
            <div className="box" >
                <div className=" row box-body qlcv">
                    <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12 pull-right">
                        <AnnualLeaveApplicationForm />
                    </div>
                    <div className="col-lg-8 col-md-6 col-sm-6 col-xs-12">
                        <div className="form-inline">
                            {/* Năm */}
                            <div className="form-group">
                                <label style={{ width: 'auto' }}>{translate('human_resource.work_plan.year')}</label>
                                <DatePicker
                                    id="year"
                                    dateFormat="year"
                                    value={year}
                                    onChange={this.handleYearChange}
                                />
                            </div>
                            {/* Nút tìm kiếm */}
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} >{translate('general.search')}</button>
                        </div>
                    </div>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                        <div className="description-box" style={{ paddingRight: 10 }}>
                            <h4>{translate('human_resource.annual_leave_personal.inform_annual_leave')}</h4>
                            <div>
                                <strong>
                                    {translate('human_resource.annual_leave_personal.total_number_leave_of_year')}:
                                </strong>
                                &nbsp;&nbsp;
                                <span>{`${maximumNumberOfLeaveDays} ngày`}</span>
                            </div>
                            <div>
                                <strong>
                                    {translate('human_resource.annual_leave_personal.leaved')}:
                                </strong>
                                &nbsp;&nbsp;
                                <span>{`${annualLeave.numberAnnulLeave} ngày`}</span>
                            </div>
                            <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                                <thead>
                                    <tr>
                                        <th>{translate('human_resource.annual_leave.table.start_date')}</th>
                                        <th>{translate('human_resource.annual_leave.table.end_date')}</th>
                                        <th>{translate('human_resource.unit')}</th>
                                        <th>{translate('human_resource.annual_leave.table.reason')}</th>
                                        <th>{translate('human_resource.status')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listAnnualLeavesOfOneYear && listAnnualLeavesOfOneYear.length !== 0 &&
                                        listAnnualLeavesOfOneYear.map((x, index) => {
                                            let organizationalUnit = department.list.find(y => y._id === x.organizationalUnit);
                                            return (
                                                <tr key={index}>
                                                    <td>{this.formatDate2(x.startDate)}</td>
                                                    <td>{this.formatDate2(x.endDate)}</td>
                                                    <td>{organizationalUnit ? organizationalUnit.name : null}</td>
                                                    <td>{x.reason}</td>
                                                    <td>{translate(`human_resource.annual_leave.status.${x.status}`)}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            {
                                annualLeave.isLoading ?
                                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                                    (!listAnnualLeavesOfOneYear || listAnnualLeavesOfOneYear.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                            }
                        </div>
                        <div className="description-box" style={{ paddingRight: 10, marginTop: 25 }}>
                            <h4>{translate('human_resource.annual_leave_personal.list_annual_leave')}</h4>
                            <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: 40 }}>{translate('human_resource.stt')}</th>
                                        <th>{translate('human_resource.work_plan.table.timeline')}</th>
                                        <th>{translate('human_resource.work_plan.table.describe_timeline')}</th>
                                        <th>{translate('human_resource.work_plan.table.type')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {workPlans && workPlans.length !== 0 &&
                                        workPlans.map((x, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{(this.formatDate(x.startDate) === this.formatDate(x.endDate)) ? this.formatDate(x.startDate) : this.formatDate(x.startDate) + " - " + this.formatDate(x.endDate)}</td>
                                                <td>{x.description}</td>
                                                <td>{translate(`human_resource.work_plan.${x.type}`)}</td>
                                            </tr>)
                                        )}
                                </tbody>
                            </table>
                            {
                                workPlan.isLoading ?
                                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                                    (!workPlans || workPlans.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                            }
                        </div>
                    </div>
                </div >
            </div>
        );
    }
};

function mapState(state) {
    const { workPlan, annualLeave, department } = state;
    return { workPlan, annualLeave, department };
};

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getListWorkPlan: WorkPlanActions.getListWorkPlan,
    getNumberAnnaulLeave: AnnualLeaveActions.searchAnnualLeaves,
};

const annualLeave = connect(mapState, actionCreators)(withTranslate(AnnualLeave));
export { annualLeave as AnnualLeave };
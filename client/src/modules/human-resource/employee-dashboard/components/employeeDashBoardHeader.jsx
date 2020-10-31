import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { EmployeeManagerActions } from '../../profile/employee-management/redux/actions';
import { AnnualLeaveActions } from '../../annual-leave/redux/actions';
import { DisciplineActions } from '../../commendation-discipline/redux/actions';
import { SalaryActions } from '../../salary/redux/actions';

import { SelectMulti, DatePicker } from '../../../../common-components';
class EmployeeDashBoardHeader extends Component {
    constructor(props) {
        super(props);
        let partMonth = this.formatDate(Date.now(), true).split('-');
        let month = [partMonth[1], partMonth[0]].join('-');
        this.state = {
            organizationalUnits: null,
            month: month
        }
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
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

    componentDidMount() {
        const { organizationalUnits, month } = this.state;
        this.props.getAllEmployee({ organizationalUnits: organizationalUnits, status: 'active' });
        this.props.searchAnnualLeaves({ organizationalUnits: organizationalUnits, month: month });
        this.props.getListPraise({ organizationalUnits: organizationalUnits, month: month });
        this.props.getListDiscipline({ organizationalUnits: organizationalUnits, month: month });

        this.props.searchSalary({ callApiDashboard: true, organizationalUnits: organizationalUnits, month: month });
        this.props.searchSalary({ callApiDashboard: true, month: month });
    }

    /**
     * Function bắt sự kiện thay đổi unit
     * @param {*} value : Array id đơn vị
     */
    handleSelectOrganizationalUnit = async (value) => {
        if (value.length === 0) {
            value = null
        };
        await this.setState({
            organizationalUnits: value
        })
    };

    /**
     * Function lưu giá trị tháng vào state khi thay đổi
     * @param {*} value : Giá trị tháng
     */
    handleMonthChange = (value) => {
        if (value) {
            let partMonth = value.split('-');
            value = [partMonth[1], partMonth[0]].join('-');
        }
        this.setState({
            ...this.state,
            month: value
        });
    }

    /** Bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        let { organizationalUnits, month } = this.state;

        let partMonth = this.formatDate(Date.now(), true).split('-');
        let currentMonth = [partMonth[1], partMonth[0]].join('-');

        this.setState({
            arrUnitShow: organizationalUnits
        });

        this.props.getAllEmployee({ organizationalUnits: organizationalUnits, status: 'active' });
        this.props.searchAnnualLeaves({ organizationalUnits: organizationalUnits, month: month });
        this.props.getListPraise({ organizationalUnits: organizationalUnits, month: month });
        this.props.getListDiscipline({ organizationalUnits: organizationalUnits, month: month });

        this.props.searchSalary({ callApiDashboard: true, organizationalUnits: organizationalUnits, month: month ? month : currentMonth });
        this.props.searchSalary({ callApiDashboard: true, month: month ? month : currentMonth });

        this.props.handleMonthChange(this.formatDate(month ? month : currentMonth, true));
        this.props.handleSelectOrganizationalUnit(organizationalUnits);
    }

    render() {
        const { employeesManager, department, discipline, annualLeave, translate } = this.props;
        const { organizationalUnits, month, arrUnitShow } = this.state;
        let organizationalUnitsName;
        if (arrUnitShow) {
            organizationalUnitsName = department.list.filter(x => arrUnitShow.includes(x._id));
            organizationalUnitsName = organizationalUnitsName.map(x => x.name);
        }

        return (
            <React.Fragment>
                <div className="form-inline">
                    <div className="form-group">
                        <label style={{ width: 'auto' }}>{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                        <SelectMulti id="multiSelectOrganizationalUnit"
                            items={department.list.map((p, i) => { return { value: p._id, text: p.name } })}
                            options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                            onChange={this.handleSelectOrganizationalUnit}
                        >
                        </SelectMulti>
                    </div>
                    <div className="form-group">
                        <label style={{ width: 'auto' }} >{translate('human_resource.month')}</label>
                        <DatePicker
                            id="month"
                            dateFormat="month-year"
                            deleteValue={false}
                            value={this.formatDate(Date.now(), true)}
                            onChange={this.handleMonthChange}
                        />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} >{translate('general.search')}</button>
                    </div>
                </div>
                <div className="row" style={{ marginTop: 10 }}>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-users"></i></span>
                            <div className="info-box-content" title={(!arrUnitShow || arrUnitShow.length === department.list.length) ?
                                'Tổng số nhân viên trong công ty' : `Số nhân viên ${organizationalUnitsName.join(", ")}`}>
                                <span className="info-box-text">Số nhân viên</span>
                                <span className="info-box-number">
                                    {(!arrUnitShow || arrUnitShow.length === department.list.length) ? employeesManager.totalAllEmployee : employeesManager.totalEmployeeOfOrganizationalUnits}
                                </span>
                                <a href={`/hr-list-employee?organizationalUnits=${organizationalUnits}`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-gift"></i></span>
                            <div className="info-box-content" title="Số khen thưởng tháng/số khen thưởng năm" >
                                <span className="info-box-text">Số khen thưởng</span>
                                <span className="info-box-number">{discipline.totalListCommendation}/{discipline.totalListCommendationOfYear}</span>
                                <a href={`/hr-discipline?page=commendation?organizationalUnits=${organizationalUnits}?month=${month}`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-balance-scale"></i></span>
                            <div className="info-box-content" title="Số kỷ luật tháng/số kỷ luật năm">
                                <span className="info-box-text">Số kỷ luật</span>
                                <span className="info-box-number">{discipline.totalListDiscipline}/{discipline.totalListDisciplineOfYear}</span>
                                <a href={`/hr-discipline?page=discipline?organizationalUnits=${organizationalUnits}?month=${month}`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="fa fa-calendar-times-o"></i></span>
                            <div className="info-box-content" title="Số nghỉ phép tháng/số nghỉ phép năm">
                                <span className="info-box-text">Số nghỉ phép</span>
                                <span className="info-box-number">{annualLeave.totalList}/{annualLeave.totalListAnnualLeavesOfYear}</span>
                                <a href={`hr-annual-leave?organizationalUnits=${organizationalUnits}?month=${month}`} target="_blank" >Xem thêm <i className="fa  fa-arrow-circle-o-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
};
function mapState(state) {
    const { employeesManager, annualLeave, discipline, department } = state;
    return { employeesManager, annualLeave, discipline, department };
}

const actionCreators = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    searchAnnualLeaves: AnnualLeaveActions.searchAnnualLeaves,
    getListPraise: DisciplineActions.getListPraise,
    getListDiscipline: DisciplineActions.getListDiscipline,
    searchSalary: SalaryActions.searchSalary,
};

const employeeDashBoardHeader = connect(mapState, actionCreators)(withTranslate(EmployeeDashBoardHeader));
export { employeeDashBoardHeader as EmployeeDashBoardHeader };
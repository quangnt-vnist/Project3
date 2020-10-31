import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { LazyLoadComponent, forceCheckOrVisible } from '../../../../common-components';

import {
    TabHumanResource, TabSalary, TabAnualLeave, EmployeeDashBoardHeader,
} from './combinedContent';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import './employeeDashBoard.css';

class DashBoardEmployees extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organizationalUnits: null,
            actionSearch: true,
            month: this.formatDate(Date.now(), true),
        }
    };
    componentDidMount() {
        this.props.getDepartment();
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
    };

    /** Bắt sự kiện chuyển tab  */
    handleNavTabs = (value) => {
        if (!value) {
            forceCheckOrVisible(true, false);
        }

        window.dispatchEvent(new Event('resize')); // Fix lỗi chart bị resize khi đổi tab
    }

    /**
     * Bắt sự kiện thay đổi tháng
     * @param {*} value : Giá trị tháng chart nhân sự theo dải lương và chart top lương cao nhất
     */
    handleMonthChange = async (value) => {
        await this.setState({
            month: value
        })
    }

    /**
     * Bắt sự kiện thay đổi đơn vị
     * @param {*} value 
     */
    handleSelectOrganizationalUnit = async (value) => {
        await this.setState({
            organizationalUnits: value,
            actionSearch: this.state.actionSearch,
        })
    };

    render() {
        const { department } = this.props;

        const { organizationalUnits, actionSearch, month } = this.state;

        let allOrganizationalUnits = department.list.map(x => x._id);

        return (
            <div className="qlcv">
                <EmployeeDashBoardHeader handleSelectOrganizationalUnit={this.handleSelectOrganizationalUnit} handleMonthChange={this.handleMonthChange} />
                {/* <AgePyramidChart organizationalUnits={organizationalUnits} actionSearch={actionSearch} /> */}
                <div className="nav-tabs-custom">
                    <ul className="nav nav-tabs">
                        <li className="active"><a href="#human-resource" data-toggle="tab" onClick={() => this.handleNavTabs()}>Tổng quan nhân sự</a></li>
                        <li><a href="#annualLeave" data-toggle="tab" onClick={() => this.handleNavTabs()}>Nghỉ phép-Tăng ca</a></li>
                        <li><a href="#salary" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Lương thưởng nhân viên</a></li>
                    </ul>
                    <div className="tab-content ">
                        {/* Tab Nhân sự */}
                        <div className="tab-pane active" id="human-resource">
                            <LazyLoadComponent>
                                <TabHumanResource organizationalUnits={organizationalUnits} monthShow={month} actionSearch={actionSearch} />
                            </LazyLoadComponent>
                        </div>

                        {/* Tab nghỉ phép */}
                        <div className="tab-pane" id="annualLeave">
                            <LazyLoadComponent>
                                <TabAnualLeave />
                            </LazyLoadComponent>
                        </div>

                        {/* Tab lương thưởng */}
                        <div className="tab-pane" id="salary">
                            <TabSalary organizationalUnits={organizationalUnits} monthShow={month} />
                        </div>
                    </div>
                </div>






                {/* <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <BarAndLineChart nameData1='% Tổng lương' nameData2='% Mục tiêu' nameChart={'Tỷ lệ % quỹ lương công ty/doanh thu 12 tháng gần nhất'} />
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <BarAndLineChart nameData1='% Kinh doanh' nameData2='% Mục tiêu' nameChart={'Tỷ lệ % quỹ lương khối kinh doanh/doanh thu 12 tháng gần nhất'} />
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <BarAndLineChart nameData1='% Quản trị' nameData2='% Mục tiêu' nameChart={'Tỷ lệ % quỹ lương khối quản trị/doanh thu 12 tháng gần nhất'} />
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <BarAndLineChart nameData1='% Sản xuất' nameData2='% Mục tiêu' nameChart={'Tỷ lệ % quỹ lương khối sản xuất/doanh thu 12 tháng gần nhất'} />
                    </div>
                    <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                        <MultipleBarChart nameData1='% Kinh doanh' nameData2='% Sản xuất' nameData3='% Quản trị' nameChart={'Tỷ lệ % quỹ lương các khối chức năng/doanh thu 12 tháng gần nhất'} />
                    </div> */}
            </div >
        );
    }
};
function mapState(state) {
    const { employeesManager, department } = state;
    return { employeesManager, department };
}

const actionCreators = {
    getDepartment: DepartmentActions.get,
};

const DashBoard = connect(mapState, actionCreators)(withTranslate(DashBoardEmployees));
export { DashBoard as DashBoardEmployees };
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import BillDashboardHeader from './billDashboardHeader';
import GoodIssueReceiptByGood from './goodIssueReceiptByGood';
import GoodIssueReceiptByTime from './goodIssueReceiptByTime';
import TopIssueReceipt from './topIssueReceipt';
import TopIssueReceiptLeast from './topIssueReceiptLeast';
import SupplierDashboard from './supplierDashboard';
import CustomerDashboard from './customerDashboard';
import SupplierNumberDashboard from './supplierNumberDashboard';
import CustomerNumberDashboard from './customerNumberDashboard';

class DashBoardBills extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stock: null,
            actionSearch: true,
        }
    };

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
        const { stock, actionSearch } = this.state;

        return (
            <div className="qlcv">
                <BillDashboardHeader handleSelectOrganizationalUnit={this.handleSelectOrganizationalUnit} handleMonthChange={this.handleMonthChange} />
                <div className="row">
                    <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                        <GoodIssueReceiptByGood actionSearch={actionSearch} />
                    </div>
                    <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                        <GoodIssueReceiptByTime />
                    </div>

                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <TopIssueReceipt handleMonthChange={this.handleMonthChange} />
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <TopIssueReceiptLeast handleMonthChange={this.handleMonthChange} />
                    </div>

                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <CustomerDashboard handleMonthChange={this.handleMonthChange} />
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <SupplierDashboard actionSearch={actionSearch} />
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <CustomerNumberDashboard handleMonthChange={this.handleMonthChange} />
                    </div>
                    <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                        <SupplierNumberDashboard actionSearch={actionSearch} />
                    </div>

                    {/* <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                        <HumanResourceIncreaseAndDecreaseChart nameData1='Tuyển mới' nameData2='Nghỉ làm' nameChart={'Tình hình tăng giảm nhân sự'} />
                    </div>
                    <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                        <AnnualLeaveTrendsChart nameData1='Số lượt nghỉ' nameChart={'Xu hướng nghỉ phép của nhân viên'} />
                    </div> */}
                </div>
            </div>
        );
    }
};

export default connect(null, null)(withTranslate(DashBoardBills));
import React, { Component } from "react";

import QuoteSummaryChart from "./quoteSummaryChart";
import QuoteSalesMappingAreaChart from "./quoteSalesMappingAreaChart";
import TopCareBarChart from "./topCareBarChart";
import RevenueAndSalesBarChart from "./revenueAndSalesBarChart";
import SalesOrderStatusChart from "./salesOrderStatusChart";
import TopSoldBarChart from "./topSoldBarChart";
import InfoBox from "./infoBox";
import SalesOfEmployee from "./salesOfEmployee";
import { DatePicker, SelectBox } from "../../../../../common-components";
import AverageQuoteToSales from "./averageQuoteToSales";

class SalesOrderDashboard extends Component {
    onchangeDate = () => {};

    render() {
        return (
            <React.Fragment>
                <div className="qlcv">
                    <div
                        className="form-inline"
                        style={{ marginBottom: "10px" }}
                    >
                        <div className="form-group">
                            <label style={{ width: "auto" }}>Định dạng</label>
                            <SelectBox
                                id="selectBoxDay"
                                items={[
                                    { value: "1", text: "Ngày" },
                                    { value: "0", text: "Tháng" },
                                    { value: "3", text: "Năm" },
                                ]}
                                style={{ width: "10rem" }}
                                onChange={this.onchangeDate}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ width: "auto" }}>Từ</label>
                            <DatePicker
                                id="monthStartInHome"
                                dateFormat="month-year"
                                value={"02-2020"}
                                onChange={this.onchangeDate}
                                disabled={false}
                            />
                        </div>

                        {/**Chọn ngày kết thúc */}
                        <div className="form-group">
                            <label style={{ width: "auto" }}>Đến</label>
                            <DatePicker
                                id="monthEndInHome"
                                dateFormat="month-year"
                                value={"10-2020"}
                                onChange={this.handleSelectMonthEnd}
                                disabled={false}
                            />
                        </div>

                        <div className="form-group">
                            <button
                                type="button"
                                className="btn btn-success"
                                title="Tìm kiếm"
                                onClick={() => this.handleSunmitSearch()}
                            >
                                Tìm kiếm
                            </button>
                        </div>
                    </div>

                    <div className="row">
                        <InfoBox />

                        <div className="col-xs-12">
                            <div className="col-xs-6">
                                <QuoteSummaryChart />
                            </div>

                            <div className="col-xs-6">
                                <SalesOrderStatusChart />
                            </div>
                        </div>
                        <div className="col-xs-12">
                            <QuoteSalesMappingAreaChart />
                        </div>

                        <div className="col-xs-12">
                            <RevenueAndSalesBarChart />
                        </div>

                        <div className="col-xs-12">
                            <div className="col-xs-6">
                                <TopCareBarChart />
                            </div>

                            <div className="col-xs-6">
                                <TopSoldBarChart />
                            </div>
                        </div>
                        <div className="col-xs-12">
                            <SalesOfEmployee />
                        </div>
                        <div className="col-xs-12">
                            <AverageQuoteToSales />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default SalesOrderDashboard;

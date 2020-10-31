import React, { Component } from "react";
import ManufacturingOrderPieChart from "./manufacturingOrderPieChart";
import PurchaseOrderPieChart from "./purchaseOrderPieChart";
import PurchaseOrderBarChart from "./purchaseOrderBarChart";
import InfoBox from "./infoBox";
import { DatePicker, SelectBox } from "../../../../../common-components";

class ManufacturingOrderDashboard extends Component {
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
                                id="incident_before"
                                onChange={this.onchangeDate}
                                disabled={false}
                                placeholder="start date"
                                style={{ width: "120px", borderRadius: "4px" }}
                            />
                        </div>

                        {/**Chọn ngày kết thúc */}
                        <div className="form-group">
                            <label style={{ width: "auto" }}>Đến</label>
                            <DatePicker
                                id="incident_after"
                                onChange={this.onchangeDate}
                                disabled={false}
                                placeholder="end date"
                                style={{ width: "120px", borderRadius: "4px" }}
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
                                <ManufacturingOrderPieChart />
                            </div>

                            <div className="col-xs-6">
                                <PurchaseOrderPieChart />
                            </div>
                        </div>

                        <div className="col-xs-12">
                            <PurchaseOrderBarChart />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ManufacturingOrderDashboard;

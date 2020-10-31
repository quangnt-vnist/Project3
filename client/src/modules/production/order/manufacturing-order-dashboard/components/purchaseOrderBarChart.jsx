import React, { Component } from "react";

import { DatePicker, SelectBox } from "../../../../../common-components";
import c3 from "c3";
import "c3/c3.css";

class PurchaseOrderBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeGood: true, //de xem hien thi theo doanh so hay so luong san pham
        };
    }

    componentDidMount() {
        this.barChart();
    }

    setDataBarChart = () => {
        let dataBarChart = {
            columns: [
                [
                    "Thống kê mua NVL",
                    200,
                    280,
                    259,
                    233,
                    167,
                    300,
                    287,
                    159,
                    133,
                    157,
                ],
            ],
            type: "bar",
        };
        return dataBarChart;
    };

    removePreviousChart() {
        const chart = this.refs.amountPieChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    handleChangeViewChart() {
        this.setState({
            typeGood: !this.state.typeGood,
        });
    }

    onchangeDate = () => {};

    // Khởi tạo PieChart bằng C3
    barChart = () => {
        let dataBarChart = this.setDataBarChart();
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.purchaseOrderBarChart,

            data: dataBarChart,

            bar: {
                width: {
                    ratio: 0.5, // this makes bar width 50% of length between ticks
                },
                // or
                //width: 100 // this makes bar width 100px
            },
            axis: {
                y: {
                    label: {
                        text: `${
                            this.state.typeGood ? "Triệu đồng" : " Đơn vị"
                        }`,
                        position: "outer-middle",
                    },
                },
                x: {
                    type: "category",
                    categories: [
                        "10/10/2020",
                        "11/10/2020",
                        "12/10/2020",
                        "13/10/2020",
                        "14/10/2020",
                        "15/10/2020",
                        "16/10/2020",
                        "17/10/2020",
                        "18/10/2020",
                        "19/10/2020",
                    ],
                    tick: {
                        rotate: 75,
                        multiline: false,
                    },
                    height: 100,
                },
            },

            tooltip: {
                format: {
                    title: function (d) {
                        return d;
                    },
                    value: function (value) {
                        return value;
                    },
                },
            },

            legend: {
                show: true,
            },
        });
    };

    render() {
        this.barChart();
        return (
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">
                        Thống kê mua NVL từ 10/10/2020 - 19/10/2020
                    </h3>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Từ</label>
                            <DatePicker
                                id="incident_before"
                                onChange={this.onchangeDate}
                                disabled={false}
                                placeholder="start date"
                                style={{ width: "120px", borderRadius: "4px" }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Đến</label>
                            <DatePicker
                                id="incident_end"
                                onChange={this.onchangeDate}
                                disabled={false}
                                placeholder="end date"
                                style={{ width: "120px", borderRadius: "4px" }}
                            />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-success">
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                    <div className="box-tools pull-right">
                        <div className="btn-group pull-rigth">
                            <button
                                type="button"
                                className={`btn btn-xs ${
                                    this.state.typeGood
                                        ? "active"
                                        : "btn-danger"
                                }`}
                                onClick={() =>
                                    this.handleChangeViewChart(false)
                                }
                            >
                                Số đơn
                            </button>
                            <button
                                type="button"
                                className={`btn btn-xs ${
                                    this.state.typeGood
                                        ? "btn-danger"
                                        : "active"
                                }`}
                                onClick={() => this.handleChangeViewChart(true)}
                            >
                                Khoản chi
                            </button>
                        </div>
                    </div>
                    <div ref="purchaseOrderBarChart"></div>
                </div>
            </div>
        );
    }
}

export default PurchaseOrderBarChart;

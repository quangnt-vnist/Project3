import React, { Component } from "react";

import c3 from "c3";
import "c3/c3.css";

import { DatePicker, SelectBox } from "../../../../../common-components";
class TopSoldBarChart extends Component {
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
                ["Top 5 sản phẩm được mua nhiều nhất", 300, 280, 259, 233, 157],
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

    // Khởi tạo PieChart bằng C3
    barChart = () => {
        let dataBarChart = this.setDataBarChart();
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.topSoldBarChart,

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
                        "Sản phẩm A",
                        "Sản phẩm B",
                        "Sản phẩm C",
                        "Sản phẩm D",
                        "Sản phẩm E",
                    ],
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
                        Top 5 sản phẩm được mua nhiều nhất
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
                            <label className="form-control-static">
                                Chọn Top
                            </label>
                            <input
                                className="form-control"
                                type="number"
                                placeholder="Mặc định bằng 5"
                                style={{ width: "175px" }}
                            />
                        </div>
                        <div
                            className="form-group"
                            style={{ marginLeft: "20px" }}
                        >
                            <button className="btn btn-success">
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                    <div className="box-tools pull-right">
                        <div
                            className="btn-group pull-rigth"
                            style={{
                                position: "absolute",
                                right: "5px",
                                top: "5px",
                            }}
                        >
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
                                Số lượng
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
                                Doanh số
                            </button>
                        </div>
                    </div>
                    <div ref="topSoldBarChart"></div>
                </div>
            </div>
        );
    }
}

export default TopSoldBarChart;

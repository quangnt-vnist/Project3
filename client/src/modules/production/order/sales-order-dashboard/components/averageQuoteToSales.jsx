import React, { Component } from "react";

import c3 from "c3";
import "c3/c3.css";

import { DatePicker, SelectBox } from "../../../../../common-components";
class AverageQuoteToSales extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeChart: true,
        };
    }

    componentDidMount() {
        this.barChart();
    }

    setDataBarChart = () => {
        let dataBarChart = {
            columns: this.state.typeChart
                ? [
                      [
                          "Thời gian báo giá thành đơn trung bình của nhân viên phòng 247",
                          8.34,
                          10.23,
                          29.34,
                          23.65,
                          15.26,
                          14.79,
                          14.13,
                          15.95,
                          13.26,
                      ],
                  ]
                : [
                      [
                          "Thời gian báo giá thành đơn trung bình của các phòng",
                          8.34,
                          10.23,
                          29.34,
                          15.45,
                          13.46,
                      ],
                  ],
            type: "bar",
        };
        return dataBarChart;
    };

    removePreviousChart() {
        const chart = this.refs.verageQuoteToSales;
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
            bindto: this.refs.averageQuoteToSales,

            data: dataBarChart,

            bar: {
                width: {
                    ratio: 0.5, // this makes bar width 50% of length between ticks
                },
                // or
                //width: 100 // this makes bar width 100px
            },
            axis: this.state.typeChart
                ? {
                      y: {
                          label: {
                              text: "Giờ",
                              position: "outer-middle",
                          },
                      },
                      x: {
                          type: "category",
                          categories: [
                              "Nguyễn Văn A",
                              "Nguyễn Văn B",
                              "Nguyễn Văn C",
                              "Nguyễn Văn D",
                              "Nguyễn Văn E",
                              "Nguyễn Văn F",
                              "Nguyễn Văn G",
                              "Nguyễn Văn H",
                              "Nguyễn Văn K",
                          ],
                      },
                  }
                : {
                      y: {
                          label: {
                              text: "Giờ",
                              position: "outer-middle",
                          },
                      },
                      x: {
                          type: "category",
                          categories: [
                              "Phòng 247",
                              "Phòng Guni",
                              "Phòng Hunter",
                              "Phòng AB",
                              "Phòng XY",
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

    handleChangeViewChart() {
        this.setState({
            typeChart: !this.state.typeChart,
        });
    }

    render() {
        this.barChart();
        return (
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">
                        {this.state.typeChart
                            ? "Thời gian báo giá thành đơn trung bình của nhân viêN phòng 247"
                            : "Thời gian báo giá thành đơn trung bình của các phòng"}
                    </h3>
                    <div className="form-inline">
                        {this.state.typeChart ? (
                            <div className="form-group">
                                <label style={{ width: "auto" }}>
                                    Phòng kinh doanh
                                </label>
                                <SelectBox
                                    id="chart-select-sales-room"
                                    items={[
                                        {
                                            value: "Phòng 247",
                                            text: "Phòng 247",
                                        },
                                        {
                                            value: "Phòng Guni",
                                            text: "Phòng Guni",
                                        },
                                        {
                                            value: "Phòng Hunter",
                                            text: "Phòng Hunter",
                                        },
                                        { value: "Phòng AB", text: "Phòng AB" },
                                        { value: "Phòng XY", text: "Phòng XY" },
                                    ]}
                                    style={{ width: "10rem" }}
                                    onChange={this.onchangeDate}
                                />
                            </div>
                        ) : (
                            ""
                        )}
                        <div className="form-group">
                            <label className="form-control-static">Từ</label>
                            <DatePicker
                                id="incident_start"
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
                                    this.state.typeChart
                                        ? "active"
                                        : "btn-danger"
                                }`}
                                onClick={() =>
                                    this.handleChangeViewChart(false)
                                }
                            >
                                Xem chung
                            </button>
                            <button
                                type="button"
                                className={`btn btn-xs ${
                                    this.state.typeChart
                                        ? "btn-danger"
                                        : "active"
                                }`}
                                onClick={() => this.handleChangeViewChart(true)}
                            >
                                Chi tiết từng phòng
                            </button>
                        </div>
                    </div>
                    <div ref="averageQuoteToSales"></div>
                </div>
            </div>
        );
    }
}

export default AverageQuoteToSales;

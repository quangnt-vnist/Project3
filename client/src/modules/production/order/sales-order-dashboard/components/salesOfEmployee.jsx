import React, { Component } from "react";

import c3 from "c3";
import "c3/c3.css";

import { DatePicker, SelectBox } from "../../../../../common-components";
class SalesOfEmployee extends Component {
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
                          "Doanh số bán hàng của nhân viên phòng kinh doanh 247",
                          300,
                          280,
                          259,
                          233,
                          157,
                          154,
                          148,
                          145,
                          133,
                      ],
                  ]
                : [
                      [
                          "Doanh số bán hàng của các phòng",
                          300,
                          280,
                          259,
                          233,
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
            typeChart: !this.state.typeChart,
        });
    }

    // Khởi tạo PieChart bằng C3
    barChart = () => {
        let dataBarChart = this.setDataBarChart();
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.salesOfEmployee,

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
                              text: "Triệu đồng",
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
                              text: "Triệu đồng",
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

    render() {
        this.barChart();
        return (
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">
                        {this.state.typeChart
                            ? "Doanh số bán hàng của nhân viên phòng kinh doanh 247"
                            : "Doanh số bán hàng của các phòng"}
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
                    <div ref="salesOfEmployee"></div>
                </div>
            </div>
        );
    }
}

export default SalesOfEmployee;

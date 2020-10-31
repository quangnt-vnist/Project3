import React, { Component } from "react";

import c3 from "c3";
import "c3/c3.css";

import { DatePicker, SelectBox } from "../../../../../common-components";
class RevenueAndSalesBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.barChart();
    }

    setDataBarChart = () => {
        let dataBarChart = {
            columns: [
                [
                    "Doanh thu",
                    130,
                    100,
                    140,
                    200,
                    150,
                    50,
                    130,
                    100,
                    140,
                    200,
                    150,
                    50,
                ],
                [
                    "Doanh số",
                    300,
                    350,
                    300,
                    400,
                    340,
                    267,
                    300,
                    350,
                    300,
                    400,
                    340,
                    267,
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

    // Khởi tạo PieChart bằng C3
    barChart = () => {
        let dataBarChart = this.setDataBarChart();
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.revenueAndSalesBarChart,
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
                        text: "Triệu đồng",
                        position: "outer-middle",
                    },
                },
                x: {
                    type: "category",
                    categories: [
                        "21/10/2020",
                        "18/10/2020",
                        "19/10/2020",
                        "20/10/2020",
                        "21/10/2020",
                        "22/10/2020",
                        "23/10/2020",
                        "24/10/2020",
                        "25/10/2020",
                        "26/10/2020",
                        "27/10/2020",
                        "28/10/2020",
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
        //   this.barChart()
        return (
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">
                        Doanh số và doanh thu từ 21/10/2020 - 28/10/2020
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
                    <div ref="revenueAndSalesBarChart"></div>
                </div>
            </div>
        );
    }
}

export default RevenueAndSalesBarChart;

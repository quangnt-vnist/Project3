import React, { Component } from "react";

import c3 from "c3";
import "c3/c3.css";

import { DatePicker, SelectBox } from "../../../../../common-components";

class QuoteSalesMappingAreaChart extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.areaChart();
    }

    setDataAreaChart = () => {
        let dataAreaChart = {
            columns: [
                [
                    "Đơn kinh doanh",
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
                    "Báo giá",
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
            types: {
                "Đơn kinh doanh": "area",
                "Báo giá": "area-spline",
            },
        };
        return dataAreaChart;
    };

    removePreviousChart() {
        const chart = this.refs.amountAreaChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    areaChart = () => {
        let dataAreaChart = this.setDataAreaChart();
        console.log(dataAreaChart);
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.amountAreaChart,

            data: dataAreaChart,
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
        });
    };

    render() {
        return (
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">
                        Tỷ lệ báo giá thành đơn kinh doanh từ 21/10/2020 -
                        28/10/2020
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
                    <div ref="amountAreaChart"></div>
                </div>
            </div>
        );
    }
}

export default QuoteSalesMappingAreaChart;

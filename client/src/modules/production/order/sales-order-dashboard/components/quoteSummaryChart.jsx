import React, { Component } from "react";

import c3 from "c3";
import "c3/c3.css";

class QuoteSummaryChart extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.pieChart();
    }

    setDataPieChart = () => {
        let dataPieChart = [
            ["Đang đợi phản hồi từ khách hàng", 135],
            ["Đã thành đơn hàng kinh doanh", 345],
            ["Đã hủy", 453],
        ];
        return dataPieChart;
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
    pieChart = () => {
        let dataPieChart = this.setDataPieChart();
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.amountPieChart,

            data: {
                columns: dataPieChart,
                type: "pie",
            },

            pie: {
                label: {
                    format: function (value, ratio, id) {
                        return value + " M";
                    },
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
        // this.pieChart();
        return (
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">
                        Tổng tiền báo giá theo từng trạng thái
                    </h3>
                    <div ref="amountPieChart"></div>
                </div>
            </div>
        );
    }
}

export default QuoteSummaryChart;

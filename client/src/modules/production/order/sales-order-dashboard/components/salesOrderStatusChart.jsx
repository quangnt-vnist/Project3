import React, { Component } from "react";

import c3 from "c3";
import "c3/c3.css";

class SalesOrderStatusChart extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.pieChart();
    }

    setDataPieChart = () => {
        let dataPieChart = [
            ["Chờ phê duyệt", 135],
            ["Đã phê duyệt", 345],
            ["Đang sản xuất", 394],
            ["Chờ lấy hàng", 395],
            ["Đang giao hàng", 239],
            ["Đã hoàn thành", 239],
            ["Hùy đơn", 437],
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
                        return value + " đơn";
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
                    <h3 className="box-title">Trạng thái các đơn kinh doanh</h3>
                    <div ref="amountPieChart"></div>
                </div>
            </div>
        );
    }
}

export default SalesOrderStatusChart;

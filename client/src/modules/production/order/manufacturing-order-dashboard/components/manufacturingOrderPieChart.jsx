import React, { Component } from "react";

import c3 from "c3";
import "c3/c3.css";

class ManufacturingOrderPieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: true,
        };
    }

    componentDidMount() {
        this.pieChart();
    }

    setDataPieChart = () => {
        if (this.state.status) {
            let dataPieChart = [
                ["Chờ phê duyệt", 135],
                ["Đã phê duyệt", 345],
                ["Chờ mua nguyên vật liệu", 235],
                ["Đang sản xuất", 346],
                ["Đã nhập kho", 236],
            ];
            return dataPieChart;
        } else {
            let dataPieChart = [
                ["Hoàn thành đúng tiến độ", 135],
                ["Chậm tiến độ", 15],
            ];
            return dataPieChart;
        }
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

    handleChangeViewChart = () => {
        this.setState({
            status: !this.state.status,
        });
    };

    render() {
        this.pieChart();
        return (
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">
                        Thống kê trạng thái đơn sản xuất
                    </h3>
                    <div className="box-tools pull-right">
                        <div className="btn-group pull-rigth">
                            <button
                                type="button"
                                className={`btn btn-xs ${
                                    this.state.status ? "active" : "btn-danger"
                                }`}
                                onClick={() =>
                                    this.handleChangeViewChart(false)
                                }
                            >
                                Tiến độ
                            </button>
                            <button
                                type="button"
                                className={`btn btn-xs ${
                                    this.state.status ? "btn-danger" : "active"
                                }`}
                                onClick={() => this.handleChangeViewChart(true)}
                            >
                                Trạng thái
                            </button>
                        </div>
                    </div>
                    <div ref="amountPieChart"></div>
                </div>
            </div>
        );
    }
}

export default ManufacturingOrderPieChart;

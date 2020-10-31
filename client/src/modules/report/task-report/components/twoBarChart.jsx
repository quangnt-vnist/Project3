import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import c3 from 'c3';
import 'c3/c3.css';

class TwoBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barAndLineChart: false,
            pieChart: false,
        }
    }

    setDataMultiChart = (data) => {
        let dataConvert = [], dateConvert = [], valueConvert = [], chartType = [], showInReport;
        if (data) {
            data.forEach(x => {
                let date = new Date(x.time);

                if (isNaN(date)) { // axisXType cho biểu đồ tròn
                    return dateConvert = [...dateConvert, x.time.toString()];
                } else { /// axisXType cho biểu đồ cột và đường
                    let getYear = date.getFullYear();
                    let getMonth = date.getMonth() + 1;
                    let newDate = `${getYear}-${getMonth}-1`;
                    return dateConvert = [...dateConvert, newDate];
                }
            })
        }
        dateConvert.unshift("x");


        let allTasks = data.flatMap(x => x.tasks);
        // gom nhom giá trị các trường thông tin
        valueConvert = Object.values(allTasks.reduce((arr, item) => {
            arr[item.code] = arr[item.code] || [item.code];
            arr[item.code].push(item.value);
            return arr;
        }, {}));

        // gom nhom dang bieu do để 
        chartType = allTasks.reduce((obj, item) => {
            return {
                ...obj,
                [item.code]: item.chartType
            }
        }, {});

        dataConvert = [...[dateConvert], ...valueConvert];
        return { dataConvert, chartType };
    }


    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.pieChartData && nextProps.pieChartData.length > 0) {
            this.renderPieChart(nextProps.pieChartData);
        }
        if (nextProps.barLineChartData && nextProps.barLineChartData.length > 0) {
            this.renderBarAndLineChart(nextProps.barLineChartData);
        }
        return true;
    }

    // Xóa các  barchart đã render khi chưa đủ dữ liệu
    removePreviousBarChart() {
        const chart = this.refs.barChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    // Xóa các  Piechart đã render khi chưa đủ dữ liệu
    removePrceviousPieChart() {
        const chart = this.refs.pieChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    renderBarAndLineChart = (data) => {
        this.removePreviousBarChart();
        data = this.setDataMultiChart(data);

        let newData = data.dataConvert;
        let chartType = data.chartType;
        let barLinechartType = {};
        let pieChartType = {};

        // xóa chartType = pie (biểu đồ tròn)
        for (let i in chartType) {
            if (chartType[i] !== "pie") {
                barLinechartType[i] = chartType[i];
            } else {
                pieChartType[i] = chartType[i];
            }
        }


        this.chart = c3.generate({
            bindto: this.refs.barChart,
            data: {
                x: 'x',
                columns: newData,
                type: 'bar',
                types: barLinechartType,
            },
            bar: {
                width: { ratio: 0.3 }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%m - %Y',
                        outer: false,
                    },
                },
                y: {
                    tick: { outer: false },
                }
            },
        });
    }


    renderPieChart = (data) => {
        this.removePrceviousPieChart();
        data = this.setDataMultiChart(data);
        let newData = data.dataConvert;
        // let newPiedata = [...newData];
        let newPiedata = [
            ["7-2020", 130025000008],
            ["8-2020", 489011950000],
            ["9-2020", 224775049500]
        ]
        // newPiedata.shift();
        this.chart = c3.generate({
            bindto: this.refs.pieChart,
            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            data: {
                columns: newPiedata,
                type: 'pie',
            }
        })
    }
    render() {
        const { nameChart } = this.state;
        const { charType, data } = this.props;

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-xs-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Báo cáo công việc</h3>
                            </div>
                            <div className="box-body dashboard_box_body">
                                <p className="pull-left" style={{ marginBottom: 0 }}><b>Thành tiền: Vnđ</b></p>
                                <div ref="barChart"></div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">{}</h3>
                            </div>
                            <div className="box-body dashboard_box_body">
                                <p className="pull-left" style={{ marginBottom: 0 }}><b>Thành tiền: Vnđ</b></p>
                                <div ref="pieChart"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const twoBarChart = connect(null, null)(withTranslate(TwoBarChart));
export { twoBarChart as TwoBarChart };

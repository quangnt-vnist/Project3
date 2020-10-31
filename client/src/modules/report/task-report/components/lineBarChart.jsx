import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";
import './transferList.css';
import { chartFunction } from './chart';

class LineBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.dataForAxisXInChart) {
            let { dataConvert } = props.barLineChartData;
            dataConvert = dataConvert[0];
            return {
                ...state,
                startDate: dataConvert[1].slice(0, 6),
                endDate: dataConvert[dataConvert.length - 1].slice(0, 6),
                dataForAxisXInChart: props.dataForAxisXInChart.length > 0 && props.dataForAxisXInChart.map((x, index) => ((index ? '-> ' : '') + chartFunction.formatDataForAxisXInChart(x))),
            }
        }
        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.barLineChartData) {
            this.renderBarAndLineChart(nextProps.barLineChartData);
        }
        return true;
    }


    componentDidMount() {
        if (this.props.barLineChartData) {
            this.renderBarAndLineChart(this.props.barLineChartData);
        }
    }


    // Xóa các barchart đã render khi chưa đủ dữ liệu
    removePreviousBarChart() {
        const chart = this.refs.barChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }


    // Xóa các Piechart đã render khi chưa đủ dữ liệu
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
        let newData = data.dataConvert;

        // set height cho biểu đồ
        let getLenghtData = newData[0].length;
        let setHeightChart = (getLenghtData * 40) < 320 ? 320 : (getLenghtData * 60);
        let typeChart = data.typeChart;

        this.chart = c3.generate({
            bindto: this.refs.barChart,
            padding: {
                top: 20,
                bottom: 20,
                right: 20
            },
            size: {
                height: setHeightChart,
            },
            data: {
                x: 'x',
                columns: newData,
                type: 'bar',
                types: typeChart,
                // groups: [['p1', 'p2']]
            },
            bar: {
                width: {
                    ratio: 0.7
                }
            },
            axis: {
                rotated: true,
                x: {
                    type: 'category',
                    tick: {
                        multiline: true
                    },
                },
                y: {
                    label: {
                        text: 'Thành tiền',
                        position: 'outer-middle'
                    },
                }
            },

            tooltip: {
                format: {
                    value: d3.format(',')
                }
            }
        });
    }

    render() {
        const { dataForAxisXInChart, startDate, endDate } = this.state;
        return (
            <div className="row" style={{ marginBottom: '10px' }}>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="box box-primary" >
                        <div className="box-header with-border">
                            <h4 className="box-title report-title"><span style={{ marginRight: '7px' }}>Thống kê công việc từ:</span> {`${startDate}`} đến {`${endDate}`}</h4> <br />
                            <h4 className="box-title report-title" style={{ marginTop: '5px' }}><span style={{ marginRight: '7px' }}>Chiều dữ liệu:</span> {`${dataForAxisXInChart && dataForAxisXInChart.length > 0 ? dataForAxisXInChart.join(' ') : 'Thời gian'}`}</h4>
                        </div>
                        <div className="box-body lineBarChart ">
                            <div ref="barChart"></div>
                        </div>
                    </div >
                </div>
            </div>
        )
    }
}

const lineBarChart = connect(null, null)(withTranslate(LineBarChart));
export { lineBarChart as LineBarChart };

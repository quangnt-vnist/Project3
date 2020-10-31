import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import c3 from 'c3';
import 'c3/c3.css';
import './transferList.css';
import { chartFunction } from './chart';

class LineBarChartViewForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    static getDerivedStateFromProps(props, state) {
        let { id } = props;
        if (props.dataForAxisXInChart) {
            let { dataConvert } = props.barLineChartData;
            dataConvert = dataConvert[0];
            return {
                ...state,
                id,
                barLineChartData: props.barLineChartData,
                startDate: dataConvert[1].slice(0, 6),
                endDate: dataConvert[dataConvert.length - 1].slice(0, 6),
                dataForAxisXInChart: props.dataForAxisXInChart.length > 0 && props.dataForAxisXInChart.map((x, index) => ((index ? '-> ' : '') + chartFunction.formatDataForAxisXInChart(x))),
            }
        }
        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { barLineChartData, id } = nextProps;
        if (nextProps.barLineChartData) {
            this.renderBarAndLineChart(id, barLineChartData);
        }
        return true;
    }


    componentDidMount() {
        const { barLineChartData, id } = this.props;
        if (barLineChartData) {
            this.renderBarAndLineChart(id, barLineChartData);
        }
    }


    // Xóa các barchart đã render khi chưa đủ dữ liệu
    removePreviousBarChart(id) {
        const chart = this.refs[id];
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    renderBarAndLineChart = (id, data) => {
        this.removePreviousBarChart(id);
        let newData = data.dataConvert;

        // set height cho biểu đồ
        let getLenghtData = newData[0].length;
        let setHeightChart = (getLenghtData * 40) < 320 ? 320 : (getLenghtData * 60);
        let typeChart = data.typeChart;

        this.chart = c3.generate({
            bindto: document.getElementById(id),
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
            },
            bar: {
                width: {
                    ratio: (getLenghtData < 5) ? 0.4 : 0.7
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
        });
    }

    render() {
        const { dataForAxisXInChart, startDate, endDate, id, barLineChartData } = this.state;
        let { typeChart } = barLineChartData;
        let checkType = '';

        if (Object.values(typeChart).includes("bar") && Object.values(typeChart).includes("line")) {
            checkType = 'Biểu đồ cột và đường thống kê các trường thông tin của các công việc từ: ';
        } else if (Object.values(typeChart).includes("bar") && !Object.values(typeChart).includes("line")) {
            checkType = 'Biểu đồ cột thống kê các trường thông tin của các công việc từ: ';
        } else if (!Object.values(typeChart).includes("bar") && Object.values(typeChart).includes("line")) {
            checkType = 'Biểu đồ đường thống kê các trường thông tin của các công việc từ: ';
        }

        return (
            <div className="row" style={{ marginBottom: '10px' }}>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="box" >
                        <div className="box-header with-border">
                            <h4 className="box-title report-title"><span style={{ marginRight: '7px' }}>{checkType != '' && checkType} {`${startDate}`} đến {`${endDate}`}</span></h4>
                        </div>
                        <div className="box-body lineBarChart ">
                            <p className="box-body" ><span style={{ marginRight: '7px' }}>Chiều dữ liệu:</span> {`${dataForAxisXInChart && dataForAxisXInChart.length > 0 ? dataForAxisXInChart.join(' ') : 'Thời gian'}`}</p>
                            <div id={id}></div>
                        </div>
                    </div >
                </div>
            </div>
        )
    }
}

const lineBarChart = connect(null, null)(withTranslate(LineBarChartViewForm));
export { lineBarChart as LineBarChartViewForm };

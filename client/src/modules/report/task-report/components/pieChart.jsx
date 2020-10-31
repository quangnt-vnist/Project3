import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import c3 from 'c3';
import 'c3/c3.css';
import './transferList.css';
import { chartFunction } from './chart';

class PieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pieChart: false,
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.dataForAxisXInChart && props.namePieChart) {
            let { pieChartData } = props;
            return {
                ...state,
                startDate: pieChartData[0][0].slice(0, 6),
                endDate: pieChartData[pieChartData.length - 1][0].slice(0, 6),
                namePieChart: props.namePieChart,
                dataForAxisXInChart: props.dataForAxisXInChart.length > 0 && props.dataForAxisXInChart.map((x, index) => ((index ? '-> ' : '') + chartFunction.formatDataForAxisXInChart(x))),
            }
        }
        return null;
    }


    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.pieChartData) {
            this.renderPieChart(nextProps.pieChartData)
        }
        return true;
    }


    componentDidMount() {
        if (this.props.pieChartData) {
            this.renderPieChart(this.props.pieChartData)
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


    renderPieChart = (data) => {
        this.removePrceviousPieChart();
        this.chart = c3.generate({
            bindto: this.refs.pieChart,
            // Căn lề biểu đồ

            size: {
                height: 350,
                width: 480,
            },
            data: {
                columns: data,
                type: 'pie',
            },
            legend: {
                position: (data.length > 6) ? 'right' : 'bottom',
                // position: 'right',
                show: true
            }
        })
    }
    render() {
        const { namePieChart, startDate, endDate, dataForAxisXInChart } = this.state;
        return (
            <React.Fragment>
                <div className="box box-primary" >
                    <div className="box-header with-border">
                        <h4 className="box-title report-title"><span style={{ marginRight: '7px' }}>Trường thông tin:</span>{namePieChart ? (namePieChart + ' ') : ''}</h4><br />
                        <h4 className="box-title report-title" style={{ marginTop: '5px' }}><span style={{ marginRight: '7px' }}>Thống kê từ:</span>{`${startDate}`} đến {`${endDate}`}</h4><br />
                        <h4 className="box-title report-title" style={{ marginTop: '5px' }}><span style={{ marginRight: '7px' }}>Chiều dữ liệu:</span> {`${dataForAxisXInChart && dataForAxisXInChart.length > 0 ? dataForAxisXInChart.join(' ') : 'Thời gian'}`}</h4>
                    </div>
                    <div className="box-body report-box">
                        <div ref="pieChart"></div>
                    </div>
                </div >
            </React.Fragment>
        );
    }
}

const pieChart = connect(null, null)(withTranslate(PieChart));
export { pieChart as PieChart };


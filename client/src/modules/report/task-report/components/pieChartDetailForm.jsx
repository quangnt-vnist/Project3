import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import c3 from 'c3';
import 'c3/c3.css';
import './transferList.css';
import { chartFunction } from './chart';

class PieChartDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapseChart: false,
        }
    }

    collapseChart = () => {
        this.setState({
            collapseChart: !this.state.collapseChart,
        })
    }


    static getDerivedStateFromProps(props, state) {
        if (props.dataForAxisXInChart) {
            let { pieChartData, id } = props;
            return {
                ...state,
                id,
                startDate: pieChartData[0][0].slice(0, 6),
                endDate: pieChartData[pieChartData.length - 1][0].slice(0, 6),
                namePieChart: props.namePieChart,
                dataForAxisXInChart: props.dataForAxisXInChart.length > 0 && props.dataForAxisXInChart.map((x, index) => ((index ? '-> ' : '') + chartFunction.formatDataForAxisXInChart(x))),
            }
        }
        return null;
    }


    shouldComponentUpdate = (nextProps, nextState) => {
        const { pieChartData, id } = nextProps;
        if (pieChartData) {
            this.renderPieChart(id, pieChartData)
        }
        return true;
    }

    componentDidMount() {
        const { pieChartData, id } = this.props;
        if (pieChartData) {
            this.renderPieChart(id, pieChartData)
        }
    }
    // Xóa các  Piechart đã render khi chưa đủ dữ liệu
    removePrceviousPieChart(id) {
        const chart = this.refs[id];
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }


    renderPieChart = (id, data) => {
        this.removePrceviousPieChart(id);
        this.chart = c3.generate({
            bindto: document.getElementById(id),
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
                position: (data.length > 9) ? 'right' : 'bottom',
                // position: 'right',
                show: true
            }
        })
    }
    render() {
        const { namePieChart, startDate, endDate, dataForAxisXInChart, id, collapseChart } = this.state;
        return (
            <React.Fragment>
                <div className="box" >
                    <div className="box-header with-border" style={{ display: 'flex' }}>
                        <h4 className="box-title report-title"><span style={{ marginRight: '7px' }}>{`Biểu đồ tròn thống kê trường thông tin ${namePieChart ? (namePieChart + ' ') : ''} của các công việc từ `}</span>{`${startDate}`} đến {`${endDate}`}</h4>
                        <div className="box-tools pull-right">
                            <button onClick={this.collapseChart} className="btn btn-box-tool" data-toggle="collapse" data-target="#showPieChart"><i className={collapseChart ? `fa fa-plus` : `fa fa-minus`}></i></button>
                        </div>
                    </div>
                    <div className="box-body report-box in" data-toggle="collapse" aria-expanded="true" id="showPieChart">
                        <p className="box-body"><span style={{ marginRight: '7px' }}>Chiều dữ liệu:</span> {`${dataForAxisXInChart && dataForAxisXInChart.length > 0 ? dataForAxisXInChart.join(' ') : 'Thời gian'}`}</p>
                        <div id={id}></div>
                    </div>
                </div >
            </React.Fragment>
        );
    }
}

const pieChart = connect(null, null)(withTranslate(PieChartDetailForm));
export { pieChart as PieChartDetailForm };


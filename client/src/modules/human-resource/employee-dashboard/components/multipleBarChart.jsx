import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';

class MultipleBarChart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lineBar: true,
        }
    }

    componentDidMount() {
        this.renderChart(this.state);
    }
    componentDidUpdate() {
        this.renderChart(this.state);
    }
    // Bắt sự kiện thay đổi chế đọ xem biểu đồ
    handleChangeViewChart = (value) => {
        this.setState({
            ...this.state,
            lineBar: value
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            ...prevState,
            nameChart: nextProps.nameChart,
            nameData1: nextProps.nameData1,
            nameData2: nextProps.nameData2,
            nameData3: nextProps.nameData3,
            ratioX: ['x', "2019-07-01", "2019-08-01", "2019-09-01", "2019-10-01", "2019-11-02", "2019-12-01", "2020-01-01", "2020-02-01", "2020-03-01", "2020-04-01", "2020-05-01", "2020-06-01"],
            data1: ['data1', 12.33, 11.33, 10.33, 13.33, 10.33, 11.33, 12.33, 12.33, 11.33, 12.33, 9.33, 10.33],
            data2: ['data2', 13.50, 13.50, 13.50, 12.50, 11.50, 13.50, 10.50, 13.50, 13.50, 11.50, 13.50, 9.50],
            data3: ['data3', 11.50, 12.50, 19.50, 13.50, 13.50, 14.50, 13.50, 10.50, 13.50, 13.50, 12.50, 13.50]

        }
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviousChart() {
        const chart = this.refs.chart;
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    renderChart = (data) => {
        data.data1.shift(); data.data2.shift(); data.data3.shift();
        let bigData1 = data.data1.map(x => 2 * x);
        let bigData2 = data.data2.map(x => x / 2);
        let bigData3 = data.data3.map(x => x * 1.5);
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.chart,
            data: {
                x: 'x',
                columns: [],
                hide: true,
                type: data.lineBar === true ? 'bar' : 'spline',
                names: {
                    data1: data.nameData1,
                    data2: data.nameData2,
                    data3: data.nameData3
                }
            },
            bar: {
                width: { ratio: 0.8 }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%m - %Y',
                        outer: false,
                        rotate: -45,
                        multiline: false
                    },
                },
                y: {
                    tick: { outer: false },
                }
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id) { return value + '%'; }
                }
            }
        });

        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, ['data1', ...bigData1], ['data2', ...bigData2], ['data3', ...bigData3]],
            });
        }, 100);
        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, ['data1', ...data.data1], ['data2', ...data.data2], ['data3', ...data.data3]],
            });
        }, 300);
    }
    render() {
        const { lineBar, nameChart } = this.state;
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">{nameChart}</h3>
                    </div>
                    <div className="box-body dashboard_box_body">
                        <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: %</b></p>
                        <div className="box-tools pull-right">
                            <div className="btn-group pull-rigth">
                                <button type="button" className={`btn btn-xs ${lineBar === false ? 'btn-danger' : null}`} onClick={() => this.handleChangeViewChart(true)}>Bar chart</button>
                                <button type="button" className={`btn btn-xs ${lineBar === true ? 'btn-danger' : null}`} onClick={() => this.handleChangeViewChart(false)}>Line chart</button>
                            </div>
                        </div>
                        <div ref="chart"></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

// function mapState(state) {
//     const { employeesManager, department } = state;
//     return { employeesManager, department };
// }

// const actionCreators = {
//     getDepartment: DepartmentActions.get,
// };

const multipleBarChart = connect(null, null)(withTranslate(MultipleBarChart));
export { multipleBarChart as MultipleBarChart };

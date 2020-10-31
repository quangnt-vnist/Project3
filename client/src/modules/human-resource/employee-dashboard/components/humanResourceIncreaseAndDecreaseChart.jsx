/* Xu hướng tăng giảm nhân sự của nhân viên */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti, DatePicker } from '../../../../common-components';

import { EmployeeManagerActions } from '../../profile/employee-management/redux/actions';

import c3 from 'c3';
import 'c3/c3.css';

class HumanResourceIncreaseAndDecreaseChart extends Component {
    constructor(props) {
        super(props);
        let startDate = ['01', new Date().getFullYear()].join('-');
        this.state = {
            lineChart: false,
            startDate: startDate,
            startDateShow: startDate,
            endDate: this.formatDate(Date.now(), true),
            endDateShow: this.formatDate(Date.now(), true),
            organizationalUnitsSearch: []
        }
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date;
    }

    componentDidMount() {
        const { organizationalUnits, startDate, endDate } = this.state;
        let arrStart = startDate.split('-');
        let startDateNew = [arrStart[1], arrStart[0]].join('-');

        let arrEnd = endDate.split('-');
        let endDateNew = [arrEnd[1], arrEnd[0]].join('-');

        this.props.getAllEmployee({ organizationalUnits: organizationalUnits, startDate: startDateNew, endDate: endDateNew });
    }

    /**
     * Function bắt sự kiện thay đổi unit
     * @param {*} value : Array id đơn vị
     */
    handleSelectOrganizationalUnit = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            organizationalUnits: value
        })
    };

    /**
     * Bắt sự kiện thay đổi ngày bắt đầu
     * @param {*} value : Giá trị ngày bắt đầu
     */
    handleStartMonthChange = (value) => {
        this.setState({
            startDate: value
        })
    }

    /**
     * Bắt sự kiện thay đổi ngày kết thúc
     * @param {*} value : Giá trị ngày kết thúc
     */
    handleEndMonthChange = (value) => {
        this.setState({
            endDate: value,
        })
    }

    /**
     * Bắt sự kiện thay đổi chế đọ xem biểu đồ
     * @param {*} value : chế độ xem biểu đồ (true or false)
     */
    handleChangeViewChart = (value) => {
        this.setState({
            ...this.state,
            lineChart: value
        })
    }

    static isEqual = (items1, items2) => {
        if (!items1 || !items2) {
            return false;
        }
        if (items1.length !== items2.length) {
            return false;
        }
        for (let i = 0; i < items1.length; ++i) {
            if (items1[i].startingDate !== items2[i].startingDate) {
                return false;
            }
        }
        return true;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!prevState.arrMonth || nextProps.employeesManager.arrMonth.length !== prevState.arrMonth.length ||
            !HumanResourceIncreaseAndDecreaseChart.isEqual(nextProps.employeesManager.listEmployeesHaveStartingDateOfNumberMonth, prevState.listEmployeesHaveStartingDateOfNumberMonth) ||
            !HumanResourceIncreaseAndDecreaseChart.isEqual(nextProps.employeesManager.listEmployeesHaveLeavingDateOfNumberMonth, prevState.listEmployeesHaveLeavingDateOfNumberMonth)) {
            return {
                ...prevState,
                nameChart: nextProps.nameChart,
                nameData1: nextProps.nameData1,
                nameData2: nextProps.nameData2,
                nameData3: nextProps.nameData3,
                arrMonth: nextProps.employeesManager.arrMonth,
                listEmployeesHaveStartingDateOfNumberMonth: nextProps.employeesManager.listEmployeesHaveStartingDateOfNumberMonth,
                listEmployeesHaveLeavingDateOfNumberMonth: nextProps.employeesManager.listEmployeesHaveLeavingDateOfNumberMonth
            }
        }
        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.employeesManager.arrMonth.length !== this.state.arrMonth.length ||
            nextState.lineChart !== this.state.lineChart ||
            !HumanResourceIncreaseAndDecreaseChart.isEqual(nextProps.employeesManager.listEmployeesHaveStartingDateOfNumberMonth, this.state.listEmployeesHaveStartingDateOfNumberMonth) ||
            !HumanResourceIncreaseAndDecreaseChart.isEqual(nextProps.employeesManager.listEmployeesHaveLeavingDateOfNumberMonth, this.state.listEmployeesHaveLeavingDateOfNumberMonth) ||
            JSON.stringify(nextState.organizationalUnitsSearch) !== JSON.stringify(this.state.organizationalUnitsSearch)) {
            return true;
        }
        return false;
    }

    /** Xóa các chart đã render khi chưa đủ dữ liệu */
    removePreviousChart() {
        const chart = this.refs.chart;
        if (chart) {
            while (chart && chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    /**
     * Render chart
     * @param {*} data : Dữ liệu biểu đồ
     */
    renderChart = (data) => {
        data.data1.shift();
        data.data2.shift();
        let fakeData1 = data.data1.map(x => 2 * x);
        let fakeData2 = data.data2.map(x => x / 2);
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.chart,
            data: {
                x: 'x',
                columns: [],
                hide: true,
                type: data.lineChart === true ? 'spline' : 'bar',
                names: {
                    data1: data.nameData1,
                    data2: data.nameData2,
                    data3: data.nameData3,
                },
                colors: {
                    data1: '#2ca02c',
                    data2: '#ff7f0e',
                    data3: '#1f77b4'
                },
            },
            bar: {
                width: {
                    ratio: 0.8
                }
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
                    tick: {
                        outer: false
                    },
                }
            },
        });

        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, data.data3, ['data1', ...fakeData1],
                ['data2', ...fakeData2]
                ],
            });
        }, 100);
        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, data.data3, ['data1', ...data.data1],
                ['data2', ...data.data2]
                ],
            });
        }, 300);
    };

    /** Bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        const { organizationalUnits, startDate, endDate } = this.state;
        await this.setState({
            startDateShow: startDate,
            endDateShow: endDate,
            organizationalUnitsSearch: organizationalUnits,
        });

        let arrStart = startDate.split('-');
        let startDateNew = [arrStart[1], arrStart[0]].join('-');

        let arrEnd = endDate.split('-');
        let endDateNew = [arrEnd[1], arrEnd[0]].join('-');

        this.props.getAllEmployee({ organizationalUnits: organizationalUnits, startDate: startDateNew, endDate: endDateNew });
    }

    render() {
        const { department, employeesManager, translate } = this.props;

        const { lineChart, nameChart, nameData1, nameData2, nameData3, startDate, endDate, startDateShow, endDateShow, organizationalUnitsSearch } = this.state;

        let organizationalUnitsName = [];
        if (organizationalUnitsSearch) {
            organizationalUnitsName = department.list.filter(x => organizationalUnitsSearch.includes(x._id));
            organizationalUnitsName = organizationalUnitsName.map(x => x.name);
        }

        if (employeesManager.arrMonth.length !== 0) {
            let ratioX = ['x', ...employeesManager.arrMonth];
            let listEmployeesHaveStartingDateOfNumberMonth = employeesManager.listEmployeesHaveStartingDateOfNumberMonth;
            let listEmployeesHaveLeavingDateOfNumberMonth = employeesManager.listEmployeesHaveLeavingDateOfNumberMonth;
            let data1 = ['data1'], data2 = ['data2'], data3 = ["data3", ...employeesManager.totalEmployees];
            employeesManager.arrMonth.forEach(x => {
                let date = new Date(x);
                let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
                let total1 = 0, total2 = 0;
                listEmployeesHaveStartingDateOfNumberMonth.forEach(y => {
                    if (y.startingDate && firstDay.getTime() < new Date(y.startingDate).getTime() && new Date(y.startingDate).getTime() <= lastDay.getTime()) {
                        total1 += 1;
                    }
                })
                listEmployeesHaveLeavingDateOfNumberMonth.forEach(y => {
                    if (y.leavingDate && firstDay.getTime() < new Date(y.leavingDate).getTime() && new Date(y.leavingDate).getTime() <= lastDay.getTime()) {
                        total2 += 1;
                    }
                })
                data1 = [...data1, total1];
                data2 = [...data2, total2];
            })
            this.renderChart({ nameData1, nameData2, nameData3, ratioX, data1, data2, data3, lineChart });
        }

        return (
            <div className="box box-solid" >
                <div className="box-header with-border" >
                    <h3 className="box-title" > {`${nameChart} của ${(organizationalUnitsName.length === 0 || organizationalUnitsName.length === department.list.length) ? "công ty" : organizationalUnitsName.join(', ')} ${startDateShow}`}<i className="fa fa-fw fa-caret-right"></i>{endDateShow}</h3> </div>
                <div className="box-body" >
                    <div className="qlcv" style={{ marginBottom: 15 }} >
                        <div className="form-inline" >
                            <div className="form-group" >
                                <label className="form-control-static" > {translate('kpi.evaluation.dashboard.organizational_unit')} </label>
                                <SelectMulti id="multiSelectUnits-towBarChart"
                                    items={department.list.map((p, i) => { return { value: p._id, text: p.name } })}
                                    options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                                    onChange={this.handleSelectOrganizationalUnit} >
                                </SelectMulti>
                            </div>
                            <div className="form-group" >
                                <label></label>
                                <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} > {translate('general.search')} </button>
                            </div>
                        </div>
                        <div className="form-inline" >
                            <div className="form-group">
                                <label className="form-control-static" >Từ tháng</label>
                                <DatePicker
                                    id="form-month-hr"
                                    dateFormat="month-year"
                                    deleteValue={false}
                                    value={startDate}
                                    onChange={this.handleStartMonthChange}
                                />
                            </div>
                            <div className='form-group'>
                                <label className="form-control-static" >Đến tháng</label>
                                <DatePicker
                                    id="to-month-hr"
                                    dateFormat="month-year"
                                    deleteValue={false}
                                    value={endDate}
                                    onChange={this.handleEndMonthChange}
                                />
                            </div>
                        </div>

                    </div>
                    <div className="dashboard_box_body" >
                        <p className="pull-left" style={{ marginBottom: 0 }} > < b > ĐV tính: Người </b></p >
                        <div className="box-tools pull-right" >
                            <div className="btn-group pull-rigth">
                                <button type="button" className={`btn btn-xs ${lineChart ? "active" : "btn-danger"}`} onClick={() => this.handleChangeViewChart(false)}>Bar chart</button>
                                <button type="button" className={`btn btn-xs ${lineChart ? 'btn-danger' : "active"}`} onClick={() => this.handleChangeViewChart(true)}>Line chart</button>
                            </div>
                        </div>
                        <div ref="chart" ></div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapState(state) {
    const { employeesManager, department } = state;
    return { employeesManager, department };
}

const actionCreators = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
};

const increaseAndDecreaseChart = connect(mapState, actionCreators)(withTranslate(HumanResourceIncreaseAndDecreaseChart));
export { increaseAndDecreaseChart as HumanResourceIncreaseAndDecreaseChart };
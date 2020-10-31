/* Biểu đồ xu làm thêm giờ của nhân viên */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti, SelectBox, DatePicker } from '../../../../common-components';
import { TimesheetsActions } from '../../timesheets/redux/actions';

import c3 from 'c3';
import 'c3/c3.css';

class TrendOfOvertime extends Component {
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

        this.props.getTimesheets({ organizationalUnits: organizationalUnits, startDate: startDateNew, endDate: endDateNew })
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
            if (items1[i].startDate !== items2[i].startDate) {
                return false;
            }
        }
        return true;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!prevState.arrMonth || nextProps.timesheets.arrMonth.length !== prevState.arrMonth.length ||
            !TrendOfOvertime.isEqual(nextProps.timesheets.listOvertimeOfUnitsByStartDateAndEndDate, prevState.listOvertimeOfUnitsByStartDateAndEndDate)) {
            return {
                ...prevState,
                nameChart: nextProps.nameChart,
                nameData1: nextProps.nameData1,
                arrMonth: nextProps.timesheets.arrMonth,
                listOvertimeOfUnitsByStartDateAndEndDate: nextProps.timesheets.listOvertimeOfUnitsByStartDateAndEndDate,
            }
        }
        return null;

    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.timesheets.arrMonth.length !== this.state.arrMonth.length ||
            nextState.lineChart !== this.state.lineChart ||
            !TrendOfOvertime.isEqual(nextProps.timesheets.listOvertimeOfUnitsByStartDateAndEndDate, this.state.listOvertimeOfUnitsByStartDateAndEndDate) ||
            JSON.stringify(nextState.organizationalUnitsSearch) !== JSON.stringify(this.state.organizationalUnitsSearch)) {
            return true;
        }
        return false;
    }

    /** Xóa các chart đã render khi chưa đủ dữ liệu */
    removePreviousChart() {
        const chart = this.refs.barChart;
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
        let fakeData1 = data.data1.map((x, index) => {
            if (index % 2 === 0) {
                return x * 2
            } else return x / 2
        });
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.barChart,
            data: {
                x: 'x',
                columns: [],
                hide: true,
                type: data.lineChart === true ? 'spline' : 'bar',
                names: {
                    data1: data.nameData1,
                },
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
        });

        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, ['data1', ...fakeData1]],
            });
        }, 100);

        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, ['data1', ...data.data1]],
            });
        }, 300);
    }

    /** Bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        const { organizationalUnits, startDate, endDate } = this.state;
        await this.setState({
            startDateShow: startDate,
            endDateShow: endDate,
            organizationalUnitsSearch: organizationalUnits,
        })
        let arrStart = startDate.split('-');
        let startDateNew = [arrStart[1], arrStart[0]].join('-');

        let arrEnd = endDate.split('-');
        let endDateNew = [arrEnd[1], arrEnd[0]].join('-');

        this.props.getTimesheets({ organizationalUnits: organizationalUnits, startDate: startDateNew, endDate: endDateNew, })

    }

    render() {
        const { department, timesheets, translate } = this.props;
        const { lineChart, nameChart, nameData1, startDate, endDate, startDateShow, endDateShow, organizationalUnitsSearch } = this.state;

        let organizationalUnitsName = [];
        if (organizationalUnitsSearch) {
            organizationalUnitsName = department.list.filter(x => organizationalUnitsSearch.includes(x._id));
            organizationalUnitsName = organizationalUnitsName.map(x => x.name);
        }

        if (timesheets.arrMonth.length !== 0) {
            let ratioX = ['x', ...timesheets.arrMonth];
            let listOvertimeOfUnitsByStartDateAndEndDate = timesheets.listOvertimeOfUnitsByStartDateAndEndDate;
            let data1 = ['data1'];
            timesheets.arrMonth.forEach(x => {
                let overtime = 0;
                listOvertimeOfUnitsByStartDateAndEndDate.forEach(y => {
                    if (new Date(y.month).getTime() === new Date(x).getTime()) {
                        if (y.totalHoursOff <= 0) {
                            overtime = overtime + (0 - y.totalHoursOff);
                        }
                    };
                })
                data1 = [...data1, overtime]
            })
            this.renderChart({ nameData1, ratioX, data1, lineChart });
        }
        return (
            <React.Fragment>
                <div className="box box-solid">
                    <div className="box-header with-border">
                        <h3 className="box-title">{`${nameChart} của ${(organizationalUnitsName.length === 0 || organizationalUnitsName.length === department.list.length) ? "công ty" : organizationalUnitsName.join(', ')} ${startDateShow}`}<i className="fa fa-fw fa-caret-right"></i>{endDateShow}</h3>
                    </div>
                    <div className="box-body">
                        <div className="qlcv" style={{ marginBottom: 15 }}>
                            <div className="form-inline">
                                <div className="form-group">
                                    <label className="form-control-static">{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                                    <SelectMulti id="multiSelectUnitsOvertime"
                                        items={department.list.map((p, i) => { return { value: p._id, text: p.name } })}
                                        options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                                        onChange={this.handleSelectOrganizationalUnit}
                                    >
                                    </SelectMulti>
                                </div>
                                <div className="form-group">
                                    <label></label>
                                    <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} >{translate('general.search')}</button>
                                </div>
                            </div>
                            <div className="form-inline" >
                                <div className="form-group">
                                    <label className="form-control-static" >Từ tháng</label>
                                    <DatePicker
                                        id="form-month-overtime"
                                        dateFormat="month-year"
                                        deleteValue={false}
                                        value={startDate}
                                        onChange={this.handleStartMonthChange}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label className="form-control-static" >Đến tháng</label>
                                    <DatePicker
                                        id="to-month-overtime"
                                        dateFormat="month-year"
                                        deleteValue={false}
                                        value={endDate}
                                        onChange={this.handleEndMonthChange}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="dashboard_box_body">
                            <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: Số giờ</b></p>
                            <div className="box-tools pull-right">
                                <div className="btn-group pull-rigth">
                                    <button type="button" className={`btn btn-xs ${lineChart ? "active" : "btn-danger"}`} onClick={() => this.handleChangeViewChart(false)}>Bar chart</button>
                                    <button type="button" className={`btn btn-xs ${lineChart ? 'btn-danger' : "active"}`} onClick={() => this.handleChangeViewChart(true)}>Line chart</button>
                                </div>
                            </div>
                            <div ref="barChart"></div>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}

function mapState(state) {
    const { employeesManager, timesheets, department } = state;
    return { employeesManager, timesheets, department };
}

const actionCreators = {
    getTimesheets: TimesheetsActions.searchTimesheets,
};

const trendOfOvertime = connect(mapState, actionCreators)(withTranslate(TrendOfOvertime));
export { trendOfOvertime as TrendOfOvertime };

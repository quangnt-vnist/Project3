import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker } from '../../../common-components';
import { TimesheetsActions } from '../../human-resource/timesheets/redux/actions';

import c3 from 'c3';
import 'c3/c3.css';

class TrendWorkChart extends Component {
    constructor(props) {
        super(props);
        let startDate = ['01', new Date().getFullYear()].join('-');
        this.state = {
            lineChart: false,
            startDate: startDate,
            startDateShow: startDate,
            endDate: this.formatDate(Date.now(), true),
            endDateShow: this.formatDate(Date.now(), true),
            arrMonth: [],
            employeeId: this.props.auth.user.email,
        }
    }
    componentDidMount() {
        const { startDate, endDate, employeeId } = this.state;

        let arrStart = startDate.split('-');
        let startDateNew = [arrStart[1], arrStart[0]].join('-');

        let arrEnd = endDate.split('-');
        let endDateNew = [arrEnd[1], arrEnd[0]].join('-');

        this.props.getTimesheets({ callApiByEmployeeId: true, employeeId: employeeId, startDate: startDateNew, endDate: endDateNew, })
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

    /** Xóa các chart đã render khi chưa đủ dữ liệu */
    removePreviousChart() {
        const chart = this.refs.trendWork;
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
            bindto: this.refs.trendWork,
            data: {
                x: 'x',
                columns: [],
                hide: true,
                type: data.lineChart === true ? 'spline' : 'bar',
                names: {
                    data1: data.nameData1,
                    data2: data.nameData2,
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
                columns: [data.ratioX, ['data1', ...fakeData1],
                ['data2', ...fakeData2]
                ],
            });
        }, 100);
        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, ['data1', ...data.data1],
                ['data2', ...data.data2]
                ],
            });
        }, 300);
    };

    /** Bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        const { startDate, endDate, employeeId } = this.state;
        await this.setState({
            startDateShow: startDate,
            endDateShow: endDate,
        });

        let arrStart = startDate.split('-');
        let startDateNew = [arrStart[1], arrStart[0]].join('-');

        let arrEnd = endDate.split('-');
        let endDateNew = [arrEnd[1], arrEnd[0]].join('-');

        this.props.getTimesheets({ callApiByEmployeeId: true, employeeId: employeeId, startDate: startDateNew, endDate: endDateNew, })
    }

    render() {
        const { timesheets, translate } = this.props;

        const { nameChart, nameData1, nameData2 } = this.props;

        const { lineChart, startDate, endDate, startDateShow, endDateShow } = this.state;

        let listTimesheetsByEmployeeIdAndTime = timesheets.listTimesheetsByEmployeeIdAndTime;

        if (listTimesheetsByEmployeeIdAndTime.length !== 0) {
            let ratioX = ['x', ...timesheets.arrMonthById];
            let data1 = ['data1'], data2 = ['data2'];
            timesheets.arrMonthById.forEach(x => {
                let month = `${new Date(x).getFullYear()}-${new Date(x).getMonth()}`;
                let data = listTimesheetsByEmployeeIdAndTime.find(x => `${new Date(x.month).getFullYear()}-${new Date(x.month).getMonth()}` === month);
                if (data) {
                    data1 = [...data1, data.totalHours];
                    data2 = [...data2, data.totalHoursOff < 0 ? -data.totalHoursOff : 0];
                } else {
                    data1 = [...data1, 0];
                    data2 = [...data2, 0];
                }
            })
            this.renderChart({ nameData1, nameData2, ratioX, data1, data2, lineChart });
        }
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 qlcv">
                <div className="box box-solid">
                    <div className="box-header with-border">
                        <h3 className="box-title">{`${nameChart} ${startDateShow}`}<i className="fa fa-fw fa-caret-right"></i>{endDateShow}</h3>
                    </div>
                    <div className="box-body">
                        <div className="qlcv" style={{ marginBottom: 15 }}>
                            <div className="form-inline">
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

                            </div>
                            <div className="form-inline" >
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
                                <div className="form-group">
                                    <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} >{translate('general.search')}</button>
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
                            <div ref="trendWork"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { timesheets, auth } = state;
    return { timesheets, auth };
}

const actionCreators = {
    getTimesheets: TimesheetsActions.searchTimesheets,
};

const trendWorkChart = connect(mapState, actionCreators)(withTranslate(TrendWorkChart));
export { trendWorkChart as TrendWorkChart };
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { taskManagementActions } from '../../task/task-management/redux/actions';

import { CalendarEmployee } from '../../task/task-dashboard/task-personal-dashboard/calendarEmployee';

import { withTranslate } from 'react-redux-multilingual';
import { DatePicker } from '../../../common-components';
import Swal from 'sweetalert2';


class SuperHome extends Component {
    constructor(props) {
        super(props);

        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.INFO_SEARCH = {
            startMonth: currentYear + '-' + 1,
            endMonth: currentYear + '-' + (currentMonth + 2),
            startMonthTitle: '01' + '-' + currentYear,
            endMonthTitle: (currentMonth + 1) > 9 ? (currentMonth + 1) + '-' + currentYear : '0' + (currentMonth + 1) + '-' + currentYear
        }

        this.state = {
            userID: "",

            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,

            startMonth: this.INFO_SEARCH.startMonth,
            endMonth: this.INFO_SEARCH.endMonth,

            willUpdate: false,       // Khi true sẽ cập nhật dữ liệu vào props từ redux
            callAction: false
        };
    }

    componentDidMount = async () => {
        await this.props.getResponsibleTaskByUser([], 1, 1000, [], [], [], null, null, null, null, null, false);
        await this.props.getAccountableTaskByUser([], 1, 1000, [], [], [], null, null, null, null, null, false);
        await this.props.getConsultedTaskByUser([], 1, 1000, [], [], [], null, null, null, null, null, false);
        await this.props.getInformedTaskByUser([], 1, 1000, [], [], [], null, null, null, null, null, false);
        await this.props.getCreatorTaskByUser([], 1, 1000, [], [], [], null, null, null, null, null, false);

        let data = {
            type: "user"
        }
        await this.props.getTaskByUser(data);

        await this.setState(state => {
            return {
                ...state,
                dataStatus: this.DATA_STATUS.QUERYING,
                willUpdate: true       // Khi true sẽ cập nhật dữ liệu vào props từ redux
            };
        });
    }

    generateDataPoints(noOfDps) {
        let xVal = 1, yVal = 100;
        let dps = [];
        for (let i = 0; i < noOfDps; i++) {
            yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
            dps.push({ x: xVal, y: yVal });
            xVal++;
        }
        return dps;
    }

    handleSelectMonthStart = (value) => {
        let month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        let monthtitle = value.slice(0, 2) + '-' + (new Number(value.slice(3, 7)));

        this.INFO_SEARCH.startMonth = month;
        this.INFO_SEARCH.startMonthTitle = monthtitle;
    }

    handleSelectMonthEnd = (value) => {
        let month, monthtitle;

        if (value.slice(0, 2) < 12) {
            if (value.slice(0, 2) < 9) {
                month = value.slice(3, 7) + '-0' + (new Number(value.slice(0, 2)) + 1);
            } else {
                month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)) + 1);
            }

            monthtitle = value.slice(0, 2) + '-' + value.slice(3, 7);
        } else {
            month = (new Number(value.slice(3, 7)) + 1) + '-' + '01';
            monthtitle = '12' + '-' + (new Number(value.slice(3, 7)));
        }

        this.INFO_SEARCH.endMonth = month;
        this.INFO_SEARCH.endMonthTitle = monthtitle;
    }

    handleSearchData = async () => {
        let startMonth = new Date(this.INFO_SEARCH.startMonth);
        let endMonth = new Date(this.INFO_SEARCH.endMonth);

        if (startMonth.getTime() >= endMonth.getTime()) {
            const { translate } = this.props;
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm'),
            })
        } else {

            await this.setState(state => {
                return {
                    ...state,
                    startMonth: this.INFO_SEARCH.startMonth,
                    endMonth: this.INFO_SEARCH.endMonth
                }
            })
            let { startMonth, endMonth } = this.state;

            this.props.getResponsibleTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true);
            this.props.getAccountableTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true);
            this.props.getConsultedTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true);
            this.props.getInformedTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true);

            let data = { type: "user" };
            this.props.getTaskByUser(data);
        }
    }

    render() {
        const { tasks, translate } = this.props;
        const { startMonth, endMonth } = this.state;

        let d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        let defaultEndMonth = [month, year].join('-');
        let defaultStartMonth = ['01', year].join('-');
        let { startMonthTitle, endMonthTitle } = this.INFO_SEARCH;

        return (
            <React.Fragment>
                <div className="qlcv" style={{ textAlign: "right" }}>
                    {/**Chọn ngày bắt đầu */}
                    <div className="form-inline">
                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('task.task_management.from')}</label>
                            <DatePicker
                                id="monthStartInHome"
                                dateFormat="month-year"
                                value={defaultStartMonth}
                                onChange={this.handleSelectMonthStart}
                                disabled={false}
                            />
                        </div>

                        {/**Chọn ngày kết thúc */}
                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('task.task_management.to')}</label>
                            <DatePicker
                                id="monthEndInHome"
                                dateFormat="month-year"
                                value={defaultEndMonth}
                                onChange={this.handleSelectMonthEnd}
                                disabled={false}
                            />
                        </div>

                        {/**button tìm kiếm data để vẽ biểu đồ */}
                        <div className="form-group">
                            <button type="button" className="btn btn-success" onClick={this.handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                        </div>
                    </div>
                </div>

                {/* Lịch công việc chi tiết */}
                <div className="row">
                    <div className="col-xs-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.tasks_calendar')} {translate('task.task_management.lower_from')} {startMonthTitle} {translate('task.task_management.lower_to')} {endMonthTitle}</div>
                            </div>
                            <CalendarEmployee
                                startMonth={startMonth}
                                endMonth={endMonth}
                                home={true}
                            />
                        </div>

                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.dashboard_overdue')}</div>
                            </div>

                            <div className="box-body" style={{ minHeight: "300px" }}>
                                {
                                    (tasks && tasks.tasksbyuser) ?
                                        <ul className="todo-list">
                                            {
                                                (tasks.tasksbyuser.expire.length !== 0) ?
                                                    tasks.tasksbyuser.expire.map((item, key) =>
                                                        <li key={key}>
                                                            <span className="handle">
                                                                <i className="fa fa-ellipsis-v" />
                                                                <i className="fa fa-ellipsis-v" />
                                                            </span>
                                                            <span className="text"><a href={`/task?taskId=${item.task._id}`} target="_blank">{item.task.name}</a></span>
                                                            <small className="label label-danger"><i className="fa fa-clock-o" /> &nbsp;{item.totalDays} {translate('task.task_management.calc_days')}</small>
                                                        </li>
                                                    ) : "Không có công việc quá hạn"
                                            }
                                        </ul> : "Đang tải dữ liệu"
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.dashboard_about_to_overdue')}</div>
                            </div>
                            <div className="box-body" style={{ minHeight: "300px" }}>
                                {
                                    (tasks && tasks.tasksbyuser) ?
                                        <ul className="todo-list">
                                            {
                                                (tasks.tasksbyuser.deadlineincoming.length !== 0) ?
                                                    tasks.tasksbyuser.deadlineincoming.map((item, key) =>
                                                        <li key={key}>
                                                            <span className="handle">
                                                                <i className="fa fa-ellipsis-v" />
                                                                <i className="fa fa-ellipsis-v" />
                                                            </span>
                                                            <span className="text"><a href={`/task?taskId=${item.task._id}`} target="_blank">{item.task.name}</a></span>
                                                            <small className="label label-warning"><i className="fa fa-clock-o" /> &nbsp;{item.totalDays} {translate('task.task_management.calc_days')}</small>
                                                        </li>
                                                    ) : "Không có công việc nào sắp hết hạn"
                                            }
                                        </ul> : "Đang tải dữ liệu"
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks } = state;
    return { tasks };
}
const actionCreators = {
    getAllTaskByRole: taskManagementActions.getAllTaskByRole,
    getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
    getAccountableTaskByUser: taskManagementActions.getAccountableTaskByUser,
    getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
    getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
    getCreatorTaskByUser: taskManagementActions.getCreatorTaskByUser,
    getTaskByUser: taskManagementActions.getTasksByUser,
    getPaginateTasksByUser: taskManagementActions.getPaginateTasksByUser,
};
const connectedHome = connect(mapState, actionCreators)(withTranslate(SuperHome));
export { connectedHome as SuperHome };
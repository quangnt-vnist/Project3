import React, { Component } from 'react';
import { connect } from 'react-redux';

import { taskManagementActions } from '../../task-management/redux/actions';

import { SelectMulti } from '../../../../common-components/index';

import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';
// import { TaskOrganizationUnitDashboard } from '../task-organization-dashboard/taskOrganizationUnitDashboard';

class TaskStatusChart extends Component {

    constructor(props) {
        super(props);

        let { translate } = this.props;

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.ROLE = { RESPONSIBLE: 1, ACCOUNTABLE: 2, CONSULTED: 3, INFORMED: 4, CREATOR: 5 };
        this.ROLE_SELECTBOX = [
            {
                text: translate('task.task_management.responsible'),
                value: this.ROLE.RESPONSIBLE
            },
            {
                text: translate('task.task_management.accountable'),
                value: this.ROLE.ACCOUNTABLE
            },
            {
                text: translate('task.task_management.consulted'),
                value: this.ROLE.CONSULTED
            },
            {
                text: translate('task.task_management.informed'),
                value: this.ROLE.INFORMED
            },
            {
                text: translate('task.task_management.creator'),
                value: this.ROLE.CREATOR
            }
        ]

        this.DATA_SEARCH = [this.ROLE.RESPONSIBLE]

        this.state = {
            aPeriodOfTime: true,
            userId: localStorage.getItem("userId"),

            dataStatus: this.DATA_STATUS.QUERYING,

            role: this.DATA_SEARCH,

            willUpdate: false,       // Khi true sẽ cập nhật dữ liệu vào props từ redux
            callAction: false
        };

    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (
            nextProps.callAction !== this.state.callAction
            || nextProps.startMonth !== this.props.startMonth
            || nextProps.endMonth !== this.props.endMonth
        ) {

            if (this.props.TaskOrganizationUnitDashboard && this.props.units && this.props.startMonth && this.props.endMonth) {
                await this.setState(state => {
                    return {
                        ...state,
                        startMonth: this.props.startMonth,
                        endMonth: this.props.endMonth,

                    }
                })


                if (this.props.units) {
                    if (this.props.units.length)
                        await this.props.getTaskInOrganizationUnitByMonth(this.props.units, nextProps.startMonth, nextProps.endMonth);
                }
            } else {
                await this.props.getResponsibleTaskByUser([], 1, 100, [],  [], [], null, nextProps.startMonth, nextProps.endMonth, null, null, this.state.aPeriodOfTime);
                await this.props.getAccountableTaskByUser([], 1, 100, [],  [], [], null, nextProps.startMonth, nextProps.endMonth, null, null, this.state.aPeriodOfTime);
                await this.props.getConsultedTaskByUser([], 1, 100, [],  [], [], null, nextProps.startMonth, nextProps.endMonth, null, null, this.state.aPeriodOfTime);
                await this.props.getInformedTaskByUser([], 1, 100, [],  [], [], null, nextProps.startMonth, nextProps.endMonth, null, null, this.state.aPeriodOfTime);
                await this.props.getCreatorTaskByUser([], 1, 100, [],  [], [], null, nextProps.startMonth, nextProps.endMonth, null, null, this.state.aPeriodOfTime);
            }
            await this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                    willUpdate: true       // Khi true sẽ cập nhật dữ liệu vào props từ redux
                };
            });

            return false;
        }

        if (nextState.role !== this.state.role) {
            await this.setState(state => {
                return {
                    ...state,
                    role: nextState.role
                }
            })

            this.pieChart();
        }

        if (nextState.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {
            if (this.props.TaskOrganizationUnitDashboard) { // neu componet duoc goi tu dashboard organization unit
                if (this.props.units) {
                    await this.props.getTaskInOrganizationUnitByMonth(this.props.units, nextProps.startMonth, nextProps.endMonth);
                }
            }
            else {
                await this.props.getResponsibleTaskByUser([], 1, 100, [],  [], [], null, nextProps.startMonth, nextProps.endMonth, null, null, this.state.aPeriodOfTime);
                await this.props.getAccountableTaskByUser([], 1, 100, [],  [], [], null, nextProps.startMonth, nextProps.endMonth, null, null, this.state.aPeriodOfTime);
                await this.props.getConsultedTaskByUser([], 1, 100, [],  [], [], null, nextProps.startMonth, nextProps.endMonth, null, null, this.state.aPeriodOfTime);
                await this.props.getInformedTaskByUser([], 1, 100, [],  [], [], null, nextProps.startMonth, nextProps.endMonth, null, null, this.state.aPeriodOfTime);
                await this.props.getCreatorTaskByUser([], 1, 100, [],  [], [], null, nextProps.startMonth, nextProps.endMonth, null, null, this.state.aPeriodOfTime);
            }
            await this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                    willUpdate: true        // Khi true sẽ cập nhật dữ liệu vào props từ redux
                }
            });

            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (this.props.TaskOrganizationUnitDashboard) {
                if (!nextProps.tasks.organizationUnitTasks) {
                    return false;
                }

            }
            // Kiểm tra tasks đã được bind vào props hay chưa
            else if (!nextProps.tasks.responsibleTasks
                || !nextProps.tasks.accountableTasks
                || !nextProps.tasks.consultedTasks
                || !nextProps.tasks.informedTasks
                || !nextProps.tasks.creatorTasks
            ) {
                return false;           // Đang lấy dữ liệu, ko cần render lại
            };

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                }
            });

            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE && nextState.willUpdate) {
            this.pieChart();

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                    willUpdate: false       // Khi true sẽ cập nhật dữ liệu vào props từ redux
                }
            });
        }

        return false;
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {

        if (nextProps.callAction !== prevState.callAction || nextProps.startMonth !== prevState.startMonth || nextProps.endMonth !== prevState.endMonth) {
            return {
                ...prevState,
                callAction: nextProps.callAction,
                startMonth: nextProps.startMonth,
                endMonth: nextProps.endMonth
            }
        } else {
            return null
        }
    }

    handleSelectRole = (value) => {
        let role = value.map(item => Number(item));
        this.DATA_SEARCH = role
    }

    handleSearchData = () => {
        this.setState(state => {
            return {
                ...state,
                role: this.DATA_SEARCH
            }
        })
    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { translate, tasks } = this.props;

        let dataPieChart, numberOfInprocess = 0, numberOfWaitForApproval = 0, numberOfFinished = 0, numberOfDelayed = 0, numberOfCanceled = 0;
        let listTask = [], listTaskByRole = [];
        if (this.props.TaskOrganizationUnitDashboard) {
            listTask = tasks.organizationUnitTasks;
        }
        else if (tasks.responsibleTasks && tasks.accountableTasks && tasks.consultedTasks && tasks.informedTasks && tasks.creatorTasks) {
            listTaskByRole[this.ROLE.RESPONSIBLE] = tasks.responsibleTasks;
            listTaskByRole[this.ROLE.ACCOUNTABLE] = tasks.accountableTasks;
            listTaskByRole[this.ROLE.CONSULTED] = tasks.consultedTasks;
            listTaskByRole[this.ROLE.INFORMED] = tasks.informedTasks;
            listTaskByRole[this.ROLE.CREATOR] = tasks.creatorTasks;

            if (this.state.role.length !== 0) {
                this.state.role.map(role => {
                    listTask = listTask.concat(listTaskByRole[role]);
                })
            }
        };

        listTask = this.props.TaskOrganizationUnitDashboard ? listTask.tasks : listTask;
        if (listTask) {

            listTask.map(task => {
                switch (task.status) {
                    case "inprocess":
                        numberOfInprocess++;
                        break;
                    case "wait_for_approval":
                        numberOfWaitForApproval++;
                        break;
                    case "finished":
                        numberOfFinished++;
                        break;
                    case "delayed":
                        numberOfDelayed++;
                        break;
                    case "canceled":
                        numberOfCanceled++;
                        break;
                }
            });
        }

        dataPieChart = [
            [translate('task.task_management.inprocess'), numberOfInprocess],
            [translate('task.task_management.wait_for_approval'), numberOfWaitForApproval],
            [translate('task.task_management.finished'), numberOfFinished],
            [translate('task.task_management.delayed'), numberOfDelayed],
            [translate('task.task_management.canceled'), numberOfCanceled]
        ];
        return dataPieChart;
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviosChart = () => {
        const chart = this.refs.chart;
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    // Khởi tạo PieChart bằng C3
    pieChart = () => {

        this.removePreviosChart();

        let dataPieChart = this.setDataPieChart();

        this.chart = c3.generate({
            bindto: this.refs.chart,             // Đẩy chart vào thẻ div có id="chart"

            data: {                                 // Dữ liệu biểu đồ
                columns: dataPieChart,
                type: 'pie',
            },

            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            legend: {                             // Ẩn chú thích biểu đồ
                show: true
            }
        });
    }

    render() {
        const { translate, TaskOrganizationUnitDashboard } = this.props;

        return (
            <React.Fragment>
                {!TaskOrganizationUnitDashboard &&
                    <section className="form-inline">
                        <div className="form-group">
                            <label>{translate('task.task_management.role')}</label>
                            <SelectMulti
                                id={`roleOfStatusTaskSelectBox`}
                                items={this.ROLE_SELECTBOX}
                                multiple={true}
                                onChange={this.handleSelectRole}
                                options={{ allSelectedText: translate('task.task_management.select_all_status') }}
                                value={this.DATA_SEARCH}
                            />
                        </div>
                    
                        <button   button type="button" className="btn btn-success" onClick={this.handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                    </section>
                }

                <section ref="chart"></section>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { tasks } = state;
    return { tasks }
}
const actions = {
    getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
    getAccountableTaskByUser: taskManagementActions.getAccountableTaskByUser,
    getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
    getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
    getCreatorTaskByUser: taskManagementActions.getCreatorTaskByUser,
    getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth,
}

const connectedTaskStatusChart = connect(mapState, actions)(withTranslate(TaskStatusChart));
export { connectedTaskStatusChart as TaskStatusChart };
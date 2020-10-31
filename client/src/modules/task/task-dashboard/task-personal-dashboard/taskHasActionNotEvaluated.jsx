import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual'

class TaskHasActionNotEvaluated extends Component {
    constructor(props) {
        super(props);
        let currentMonth = new Date().getMonth() + 1;
        let currentYear = new Date().getFullYear();
        this.state = {
            currentMonth: currentMonth,
            currentYear: currentYear,
            userId: localStorage.getItem("userId")
        }
    }

    render() {
        let { tasks, translate } = this.props;
        let { currentMonth, currentYear, userId } = this.state;
        let accountableTasks = tasks && tasks.accountableTasks;
        let responsibleTasks = tasks && tasks.responsibleTasks;
        var TaskHasActionsAccountable = [];
        var TaskHasActionsResponsible = [];
        if (accountableTasks) {
            let inprocessAccountableTask = accountableTasks.filter(task => task.status === "inprocess")

            inprocessAccountableTask.length && inprocessAccountableTask.map(x => {
                let taskActions;

                taskActions = x.taskActions.length && x.taskActions;
                for (let i in taskActions) {
                    let month = taskActions[i].createdAt.slice(5, 7);
                    let year = taskActions[i].createdAt.slice(0, 4)
                    if (month == currentMonth && year == currentYear) {
                        if (taskActions[i].rating == -1) {
                            TaskHasActionsAccountable.push(x);
                            break;
                        }
                    }
                }
            })
        }
        if (responsibleTasks) {
            let inprocessResponsibleTasks = responsibleTasks.filter(task => task.status === "inprocess")
            inprocessResponsibleTasks.length && inprocessResponsibleTasks.map(x => {
                let taskActions;

                taskActions = x.taskActions.length && x.taskActions;
                for (let i in taskActions) {
                    let month = taskActions[i].createdAt.slice(5, 7);
                    let year = taskActions[i].createdAt.slice(0, 4)
                    if (month == currentMonth && year == currentYear) {
                        if (taskActions[i].rating == -1) {
                            TaskHasActionsResponsible.push(x);
                            break;
                        }
                    }
                }
            })
        }

        return (
            <React.Fragment>
                {/* Các công việc có hoạt động chưa đánh giá*/}
                <div className="col-xs-6">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">{translate('task.task_management.task_has_action_not_evaluated')}</div>
                        </div>
                        <div className="box-body" style={{ minHeight: "300px" }}>
                            {
                                TaskHasActionsAccountable || TaskHasActionsResponsible ?
                                    <div>
                                        {
                                            (TaskHasActionsAccountable.length !== 0) || (TaskHasActionsResponsible.length !== 0) ?
                                                <div>
                                                    <ul className="todo-list">
                                                        {
                                                            (TaskHasActionsAccountable.length !== 0) &&
                                                            TaskHasActionsAccountable.map((item, key) =>
                                                                <li key={key}>
                                                                    <span className="handle">
                                                                        <i className="fa fa-ellipsis-v" />
                                                                        <i className="fa fa-ellipsis-v" />
                                                                    </span>
                                                                    <span className="text"><a href={`/task?taskId=${item._id}`} target="_blank">{item.name}</a></span>
                                                                    &nbsp;
                                                                    <small className="label label-danger">{translate('task.task_management.approver')}</small>
                                                                </li>
                                                            )
                                                        }
                                                    </ul>
                                                    <ul className="todo-list">
                                                        {
                                                            (TaskHasActionsResponsible.length !== 0) &&
                                                            TaskHasActionsResponsible.map((item, key) =>
                                                                <li key={key}>
                                                                    <span className="handle">
                                                                        <i className="fa fa-ellipsis-v" />
                                                                        <i className="fa fa-ellipsis-v" />
                                                                    </span>
                                                                    <span className="text"><a href={`/task?taskId=${item._id}`} target="_blank">{item.name}</a></span>
                                                                    &nbsp;
                                                                    <small className="label label-warning">{translate('task.task_management.performer')}</small>
                                                                </li>
                                                            )
                                                        }
                                                    </ul>
                                                </div> : translate('task.task_management.no_task_has_action_not_evaluated')
                                        }
                                    </div> : translate('task.task_management.loading_data')
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { tasks } = state;
    return { tasks }
}

const actions = {
}

const connectedTaskHasActionNotEvaluated = connect(mapState, actions)(withTranslate(TaskHasActionNotEvaluated))
export { connectedTaskHasActionNotEvaluated as TaskHasActionNotEvaluated }
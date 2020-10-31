import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual'

class TasksIsNotLinked extends Component {
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
        let accTasks = tasks && tasks.accountableTasks;
        let resTasks = tasks && tasks.responsibleTasks;
        let conTasks = tasks && tasks.consultedTasks;
        let infTasks = tasks && tasks.informedTasks;
        let allTasks = [], notLinkedTasks = [], taskList;

        if (accTasks && resTasks && infTasks && conTasks) {
            taskList = allTasks.concat(accTasks, resTasks, conTasks, infTasks);
        }

        if (taskList) {
            let inprocessTask = taskList.filter(task => task.status === "inprocess")
            let distinctTasks = [];
            for (let i in inprocessTask) {
                let check = false;
                for (let j in distinctTasks) {

                    if (inprocessTask[i]._id === distinctTasks[j]._id) {
                        check = true
                        break;
                    }
                }
                if (!check) distinctTasks.push(inprocessTask[i])
            }
            distinctTasks.length && distinctTasks.map(x => {
                let evaluations;
                let currentEvaluate = [];

                evaluations = x.evaluations.length && x.evaluations;
                for (let i in evaluations) {
                    let month = evaluations[i].date.slice(5, 7);
                    let year = evaluations[i].date.slice(0, 4);

                    if (month == currentMonth && year == currentYear) {
                        currentEvaluate.push(evaluations[i]);
                    }
                }
                if (currentEvaluate.length === 0) notLinkedTasks.push(x);

                else {
                    let break1 = false;
                    let add = true;
                    if (currentEvaluate.length !== 0)
                        for (let i in currentEvaluate) {
                            if (currentEvaluate[i].results.length !== 0) {
                                for (let j in currentEvaluate[i].results) {
                                    let res = currentEvaluate[i].results[j];

                                    if (res.employee === userId) {
                                        add = false;
                                        if (res.kpis.length === 0) {
                                            notLinkedTasks.push(x);
                                            break1 = true
                                        }
                                    };
                                    if (break1) break;
                                }
                                if (break1) break;
                                if (add) notLinkedTasks.push(x);
                            }
                        }
                }
            })
        }
        return (
            <React.Fragment>
                {/* Các công việc chưa liên kết kpi tháng */}
                <div className="col-xs-6">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">{translate('task.task_management.task_is_not_linked_up_with_monthly_kpi')}</div>
                        </div>
                        <div className="box-body" style={{ minHeight: "300px" }}>
                            {
                                notLinkedTasks ?
                                    <ul className="todo-list">
                                        {
                                            (notLinkedTasks.length !== 0) ?
                                                notLinkedTasks.map((item, key) =>
                                                    <li key={key}>
                                                        <span className="handle">
                                                            <i className="fa fa-ellipsis-v" />
                                                            <i className="fa fa-ellipsis-v" />
                                                        </span>
                                                        <span className="text"><a href={`/task?taskId=${item._id}`} target="_blank">{item.name}</a></span>
                                                    </li>
                                                ) : translate('task.task_management.no_task_is_not_linked')
                                        }
                                    </ul> : translate('task.task_management.loading_data')
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

const connectedTasksIsNotLinked = connect(mapState, actions)(withTranslate(TasksIsNotLinked))
export { connectedTasksIsNotLinked as TasksIsNotLinked }
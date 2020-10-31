import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { taskManagementActions } from "../../task-management/redux/actions";
import './actionTab.css';
import qs from 'qs';
import { performTaskAction } from '../redux/actions';
class SubTaskTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    
    componentDidMount = () => {
        if (this.props.location) { // Nếu là trang trực tiếp (trong Route)
            const { taskId } = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
            if (taskId){
                this.props.getTaskById(taskId);
                this.props.getSubTask(taskId);
            }
        }
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('/');
    }

    render() {
        const { translate, tasks } = this.props;
        var subtasks = tasks.subtasks;

        return (
            <div>
                {subtasks && subtasks.length>0 &&
                    subtasks.map( item =>{
                    return (
                        <div className="item-box">
                            <strong><a href={`/task?taskId=${item._id}`} target="_blank" >{item.name} </a></strong>
                            <span>{item.status}, </span>
                            <span>{item.progress}%, </span>
                            <span>{this.formatDate(item.startDate)} - {this.formatDate(item.endDate)}</span>
                            <div>
                                {item.description}
                            </div>
                        </div>
                    )
                })}

                {subtasks && subtasks.length==0 && <strong>{translate("task.task_perform.none_subtask")}</strong>}
            </div>
        )
    }
}

function mapState(state) {
    const { tasks, performtasks, user, auth } = state;
    return { tasks, performtasks, user, auth };
}

const subTaskCreators = {
    getSubTask: taskManagementActions.getSubTask,
    getTaskById: performTaskAction.getTaskById
};

const subTaskTab = connect(mapState, subTaskCreators)(withTranslate(SubTaskTab));
export { subTaskTab as SubTaskTab }


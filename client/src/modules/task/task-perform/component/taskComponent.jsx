import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withTranslate } from 'react-redux-multilingual';
import { DetailTaskTab } from './detailTaskTab';
import { ActionTab } from './actionTab';

import { taskManagementActions } from "../../task-management/redux/actions";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { performTaskAction } from '../redux/actions';

import qs from 'qs';

class TaskComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskId: null
        };

        /**
         * Dùng khi mở task từ URL. Ban đầu flag là 1, chạy vào render trước, taskID=null
         * Sau đó chạy vào shouldComponentUpdate, flag có giá trị là 2, taskID sẽ là tham số từ URL 
         */
        this.flag= 1;

        this.props.getAllUserOfCompany();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (this.props.location) {
            const { taskId } = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
            if (taskId && this.flag == 1) {
                this.flag = 2;
                this.props.getTaskById(taskId);
                this.props.getDepartment();
                return true;
            }
        }
        if (nextProps.id !== this.state.id) {
            this.props.getTaskById(nextProps.id); // this.props.id // đổi thành nextProps.id để lấy dữ liệu về sớm hơn
            this.props.getDepartment();
            this.setState( state => {
                return {
                    ...state,
                    id: nextProps.id,
                }
            });
            return true;
        }
        return true;
    }

    onChangeTaskRole = (role) => {
        this.setState(state => {
            return {
                ...state,
                role: role
            }
        })
    }

    render = () => {
        const { translate } = this.props;
        const { user, tasks, performtasks } = this.props;

        let taskId = this.props.id;
        let task, units;

        if (this.props.location){
            if (this.flag !== 1){
                taskId = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).taskId;
            }
        }
        
        if( user.organizationalUnitsOfUser) {
            units = user.organizationalUnitsOfUser;
        }

        if (performtasks.task) {
            task = performtasks.task;
        }
        if (performtasks.task && performtasks.task.info){
            return (
                <div>
                    <h2>{translate('task.task_management.detail_task_permission')}</h2>
                </div>
            );
        }
        return (
            <div className="row row-equal-height" style={{ margin: "0px", height: "100%", backgroundColor: "#fff" }}>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{ paddingTop: "10px" }}>

                    <DetailTaskTab
                        id={taskId} 
                        onChangeTaskRole={this.onChangeTaskRole} 
                        task={task && task}
                        showToolbar={true}
                    />
                </div>

                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{ padding: "10px 0 10px 0", borderLeft: "1px solid #f4f4f4" }}>
                    <ActionTab
                        id={taskId}
                        role={this.state.role}
                        task={task && task}
                    />
                </div>

            </div>
        );
    }
}
function mapState(state) {
    const { tasks, performtasks, user } = state;
    return { tasks, performtasks, user };
}

const actionCreators = {
    getTaskById: performTaskAction.getTaskById,
    getDepartment: UserActions.getDepartmentOfUser,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
};

const taskComponent = connect(mapState, actionCreators)(withTranslate(TaskComponent));
export { taskComponent as TaskComponent }



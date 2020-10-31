import React, { Component, createElement } from 'react';
import { connect } from 'react-redux';

import { UserActions } from '../../../super-admin/user/redux/actions';

import { SelectBox, SelectMulti } from '../../../../common-components/index';
import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';
class DistributionOfEmployee extends Component {
    constructor(props) {
        super(props);
        this.infoSearch = {
            status: ["inprocess", "wait_for_approval", "finished", "delayed", "canceled"],
        }
        this.state = {
            listNameEmployee: [],
            status: this.infoSearch.status,
        }
    }

    shouldComponentUpdate(nextState) {
        if (!this.props.listEmployee) return false;

        else {
            this.pieChart();
            return true;
        }

    }

    handleSelectStatus = async (value) => {
        if (value.length === 0) {
            value = ["inprocess", "wait_for_approval", "finished", "delayed", "canceled"];
        }
        this.infoSearch.status = value;

    }
    handleSearchData = async () => {
        let status = this.infoSearch.status;
        await this.setState(state => {
            return {
                ...state,
                status: status
            }
        });
        this.pieChart();
    }
    filterByStatus(task) {
        let stt = this.state.status;
        for (let i in stt) {
            if (task.status === stt[i]) return true;
        }
    }

    getData = async () => {
        const { tasks } = this.props;
        const { listEmployee } = this.props;
        const { status } = this.state;
        let organizationUnitTasks = tasks.organizationUnitTasks, taskListByStatus;
        let taskListEmployee = [], numOfAccountableTask = [], numOfConsultedTask = [], numOfResponsibleTask = [], numOfInformedTask = [], nameEmployee = [];
        let accountableEmployees = 0, consultedEmployees = 0, responsibleEmployees = 0, informedEmployees = 0;

        if (status) {
            taskListByStatus = organizationUnitTasks.tasks.filter(task => this.filterByStatus(task))
        }

        for (let i in listEmployee) {
            taskListByStatus && taskListByStatus.map(task => {
                for (let j in task.accountableEmployees)
                    if (listEmployee[i].userId._id == task.accountableEmployees[j])
                        accountableEmployees += 1;
                for (let j in task.consultedEmployees)
                    if (listEmployee[i].userId._id == task.consultedEmployees[j])
                        consultedEmployees += 1;
                for (let j in task.responsibleEmployees)
                    if (listEmployee[i].userId._id == task.responsibleEmployees[j]._id)
                        responsibleEmployees += 1;
                for (let j in task.informedEmployees)
                    if (listEmployee[i].userId._id == task.informedEmployees[j])
                        informedEmployees += 1;
            })
            let employee = {
                infor: listEmployee[i],
                accountableEmployees: accountableEmployees,
                consultedEmployees: consultedEmployees,
                responsibleEmployees: responsibleEmployees,
                informedEmployees: informedEmployees,
            }
            taskListEmployee.push(employee);
            accountableEmployees = 0;
            consultedEmployees = 0;
            responsibleEmployees = 0;
            informedEmployees = 0;
        }
        for (let i in taskListEmployee) {
            numOfAccountableTask.push(taskListEmployee[i].accountableEmployees)
            numOfConsultedTask.push(taskListEmployee[i].consultedEmployees)
            numOfResponsibleTask.push(taskListEmployee[i].responsibleEmployees)
            numOfInformedTask.push(taskListEmployee[i].informedEmployees)
            nameEmployee.push(taskListEmployee[i].infor.userId.name)
        }

        let data = {
            nameEmployee: nameEmployee,
            taskCount: [numOfResponsibleTask, numOfAccountableTask, numOfConsultedTask, numOfInformedTask]
        }

        return data;
    }

    pieChart = async () => {
        const { translate } = this.props;

        let data = await this.getData();
        let dataPieChart = data.taskCount;
        let dataPieChartSlice = [];
        let res = dataPieChart[0];
        let acc = dataPieChart[1];
        let con = dataPieChart[2];
        let inf = dataPieChart[3];

        res.unshift(`${translate('task.task_management.responsible_role')}`);
        acc.unshift(`${translate('task.task_management.accountable_role')}`);
        con.unshift(`${translate('task.task_management.consulted_role')}`);
        inf.unshift(`${translate('task.task_management.informed_role')}`);

        dataPieChartSlice = [res, acc, con, inf];

        let height = data.nameEmployee.length * 60;
        let heightOfChart = height > 320 ? height : 320

        this.chart = c3.generate({
            bindto: document.getElementById("distributionChart"),

            data: {
                columns: dataPieChartSlice,
                type: 'bar',
                groups: [
                    [
                        `${translate('task.task_management.consulted_role')}`,
                        `${translate('task.task_management.informed_role')}`,
                        `${translate('task.task_management.responsible_role')}`,
                        `${translate('task.task_management.accountable_role')}`,
                    ]
                ]
            },

            size: {
                height: heightOfChart
            },

            legend: {                             // Ẩn chú thích biểu đồ
                show: true
            },

            padding: {
                top: 20,
                bottom: 20,
                right: 20,
            },

            axis: {
                x: {
                    type: 'category',
                    categories: data.nameEmployee
                },
                rotated: true
            }
        });


    }
    render() {
        let { translate } = this.props;

        return (
            <React.Fragment>
                <section className="form-inline" style={{ textAlign: "right" }}>
                    {/* Chọn trạng thái công việc */}
                    <div className="form-group">
                        <label style={{ minWidth: "150px" }}>{translate('task.task_management.task_status')}</label>
                        <SelectMulti id="multiSelectStatusInDistribution"
                            items={[
                                { value: "inprocess", text: translate('task.task_management.inprocess') },
                                { value: "wait_for_approval", text: translate('task.task_management.wait_for_approval') },
                                { value: "finished", text: translate('task.task_management.finished') },
                                { value: "delayed", text: translate('task.task_management.delayed') },
                                { value: "canceled", text: translate('task.task_management.canceled') }
                            ]}
                            onChange={this.handleSelectStatus}
                            options={{ nonSelectedText: translate('task.task_management.select_all_status'), allSelectedText: translate('task.task_management.select_all_status') }}>
                        </SelectMulti>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-success" onClick={this.handleSearchData}>{translate('task.task_management.filter')}</button>
                    </div>
                </section>

                {/* Biểu đồ đóng góp */}
                <section id="distributionChart"></section>

            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { user, tasks } = state;
    return { user, tasks };
}

const actions = {
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
};

const connectedDistributionOfEmployee = connect(mapState, actions)(withTranslate(DistributionOfEmployee));
export { connectedDistributionOfEmployee as DistributionOfEmployee };
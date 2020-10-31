import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { taskManagementActions } from '../../../../task/task-management/redux/actions';

import { ModalDetailTask } from '../../../../task/task-dashboard/task-personal-dashboard/modalDetailTask';

import Timeline, { TodayMarker } from "react-calendar-timeline"

import { SelectMulti } from '../../../../../common-components';
import moment from 'moment'
import 'react-calendar-timeline/lib/Timeline.css'
import './calendar.css'
import { performTaskAction } from '../../../../task/task-perform/redux/actions';


class ManufacturingSchedule extends Component {
    constructor(props) {
        super(props);

        let defaultTimeStart = moment()
            .startOf("month")
            .toDate();

        let defaultTimeEnd = moment()
            .startOf("month")
            .add(1, "month")
            .toDate();

        this.infoSearch = {
            taskStatus: ["all"],
        }

        this.INFO_CALENDAR = {
            delay: 0,
            intime: 0,
            overDue: 0
        }

        this.state = {
            defaultTimeStart,
            defaultTimeEnd,
            startDate: null,
            endDate: null,
            taskId: null,
            add: true,
            taskStatus: this.infoSearch.taskStatus,
        };
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {

        if (nextProps.tasks) {
            return {
                ...prevState,
                tasks: nextProps.tasks
            }
        } else {
            return null
        }
    }
    shouldComponentUpdate = async (props, state) => {
        if (props.tasks) {
            return true
        }
        else return false
    }

    handleSelectStatus = async (taskStatus) => {
        if (taskStatus.length === 0) {
            taskStatus = ["inprocess"];
        }

        this.infoSearch.taskStatus = taskStatus;
    }

    handleSearchData = async () => {
        const { tasks, TaskOrganizationUnitDashboard } = this.props;
        let status = this.infoSearch.taskStatus;

        if (tasks) {
            let taskList, tasksByStatus;

            // Đếm số công việc đơn vị
            if (TaskOrganizationUnitDashboard) {
                taskList = tasks.organizationUnitTasks && tasks.organizationUnitTasks.tasks;
                tasksByStatus = taskList && taskList.filter(task => this.filterByStatus(task));

                if (tasksByStatus) {
                    await this.countTasks(tasksByStatus);
                }
            }
            // Đếm số công việc cá nhân
            else {
                let res = tasks.responsibleTasks && tasks.responsibleTasks;
                let acc = tasks.accountableTasks && tasks.accountableTasks;
                let con = tasks.consultedTasks && tasks.consultedTasks;
                let inf = tasks.informedTasks && tasks.informedTasks;
                let fourTasks = res.concat(acc, con, inf).filter(task => this.filterByStatus(task));

                await this.countTasks(fourTasks);
            }
        }
        await this.setState(state => {
            return {
                ...state,
                taskStatus: status
            }
        })
        await this.getTaskDurations();
        await this.getTaskGroups();
    }

    // Lọc công việc theo trạng thái
    filterByStatus(task) {
        let stt = this.state.taskStatus;

        for (let i in stt) {
            if (task.status === stt[i] && task.isArchived === false) return true;
        }
    }

    // Lấy thời gian các công việc
    getTaskDurations() {
        const { tasks } = this.props;
        var taskList, tasksByStatus;
        let taskDurations = [];

        if (tasks) {
            // Phân chia công việc vào nhóm theo người thực hiện
            if (this.props.TaskOrganizationUnitDashboard) {
                taskList = tasks.organizationUnitTasks && tasks.organizationUnitTasks.tasks;
                tasksByStatus = taskList && taskList.filter(task => this.filterByStatus(task));

                if (tasksByStatus) {
                    var startTime, endTime, currentTime, start_time, end_time, title1, title2, groupTask, titleTask;
                    var workingDayMin;

                    for (let i = 1; i <= tasksByStatus.length; i++) {
                        let multi = false;
                        let responsibleEmployeeIds = [];
                        let responsibleEmployeeNames = [];
                        let addDate;

                        currentTime = new Date();

                        // Xu ly neu ngay bat dau bang ngay ket thuc
                        if (tasksByStatus[i - 1].startDate === tasksByStatus[i - 1].endDate) {
                            addDate = Date.parse(tasksByStatus[i - 1].endDate) + 86400000;
                        }
                        else {
                            addDate = tasksByStatus[i - 1].endDate;
                        }

                        startTime = new Date(tasksByStatus[i - 1].startDate);
                        endTime = new Date(addDate);

                        start_time = moment(startTime);
                        end_time = moment(endTime);

                        tasksByStatus[i - 1].responsibleEmployees.map(x => {
                            responsibleEmployeeIds.push(x._id);
                            responsibleEmployeeNames.push(x.name);
                        });

                        title1 = `${tasksByStatus[i - 1].name} - ${tasksByStatus[i - 1].progress} % `;
                        title2 = tasksByStatus[i - 1].name + " - " + responsibleEmployeeNames.join(" - ") + " - " + tasksByStatus[i - 1].progress + "%";
                        if (responsibleEmployeeIds.length > 1) {
                            multi = true;
                        }
                        if (multi) {
                            titleTask = title2;
                            groupTask = "multi-responsible-employee"
                        }
                        else {
                            titleTask = title1;
                            groupTask = responsibleEmployeeIds[0];
                        }

                        taskDurations.push({
                            id: parseInt(i),
                            group: groupTask,
                            title: titleTask,
                            canMove: false,

                            start_time: start_time,
                            end_time: end_time,

                            itemProps: {
                                style: {
                                    color: "rgb(0, 0, 0, 0.8)",
                                    borderStyle: "solid",
                                    fontWeight: '600',
                                    fontSize: 14,
                                    borderWidth: 1,
                                    borderRadius: 2,
                                }
                            }
                        })
                    }

                    let x = document.getElementsByClassName("rct-item");

                    if (x.length) {
                        for (let i = 0; i < x.length; i++) {
                            if (tasksByStatus[i]) {
                                let color;
                                currentTime = new Date();
                                startTime = new Date(tasksByStatus[i].startDate);
                                endTime = new Date(tasksByStatus[i].endDate);

                                if (currentTime > endTime && tasksByStatus[i].progress < 100) {
                                    color = "#DD4B39"; // not achieved
                                }
                                else {
                                    workingDayMin = (endTime - startTime) * tasksByStatus[i].progress / 100;
                                    let dayFromStartDate = currentTime - startTime;
                                    let timeOver = workingDayMin - dayFromStartDate;
                                    if (timeOver >= 0) {
                                        color = "#00A65A"; // In time or on time
                                    }
                                    else {
                                        color = "#F0D83A"; // delay
                                    }
                                }
                                this.displayTaskProgress(tasksByStatus[i].progress, x[i], color);
                            }
                        }
                    }
                }
            }

            // Chia nhóm công việc theo vai trò trong công việc
            else {
                let res, acc, con, inf;
                let tasksByStatus2 = [];

                res = tasks.responsibleTasks && tasks.responsibleTasks.filter(task => this.filterByStatus(task));
                acc = tasks.accountableTasks && tasks.accountableTasks.filter(task => this.filterByStatus(task));
                con = tasks.consultedTasks && tasks.consultedTasks.filter(task => this.filterByStatus(task));
                inf = tasks.informedTasks && tasks.informedTasks.filter(task => this.filterByStatus(task));

                if (res) {
                    for (let i = 0; i < res.length; i++) {
                        tasksByStatus2.push({
                            id: res[i]._id,
                            gr: 'responsible-tasks',
                            name: res[i].name,
                            startDate: res[i].startDate,
                            endDate: res[i].endDate,
                            progress: res[i].progress
                        })
                    }
                }

                if (acc) {
                    for (let i = 0; i < acc.length; i++) {
                        tasksByStatus2.push({
                            id: acc[i]._id,
                            gr: 'accountable-tasks',
                            name: acc[i].name,
                            startDate: acc[i].startDate,
                            endDate: acc[i].endDate,
                            progress: acc[i].progress
                        })
                    }
                }

                if (con) {
                    for (let i = 0; i < con.length; i++) {
                        tasksByStatus2.push({
                            id: con[i]._id,
                            gr: 'consulted-tasks',
                            name: con[i].name,
                            startDate: con[i].startDate,
                            endDate: con[i].endDate,
                            progress: con[i].progress
                        })
                    }
                }

                if (inf) {
                    for (let i = 0; i < inf.length; i++) {
                        tasksByStatus2.push({
                            id: inf[i]._id,
                            gr: 'informed-tasks',
                            name: inf[i].name,
                            startDate: inf[i].startDate,
                            endDate: inf[i].endDate,
                            progress: inf[i].progress
                        })
                    }
                }

                if (tasksByStatus2) {

                    for (let i = 0; i < tasksByStatus2.length; i++) {

                        if (tasksByStatus2[i]) {
                            let startTime, endTime, start_time, end_time;
                            let titleTask = `${tasksByStatus2[i].name} - ${tasksByStatus2[i].progress} % `;
                            let addDate2;

                            if (tasksByStatus2[i].startDate === tasksByStatus2[i].endDate) {
                                addDate2 = Date.parse(tasksByStatus2[i].endDate) + 86400000;
                            }
                            else {
                                addDate2 = tasksByStatus2[i].endDate;
                            }

                            startTime = new Date(tasksByStatus2[i].startDate);
                            endTime = new Date(addDate2);

                            start_time = moment(startTime);
                            end_time = moment(endTime);

                            taskDurations.push({
                                id: i + 1,
                                group: tasksByStatus2[i].gr,
                                title: titleTask,
                                canMove: false,
                                start_time: start_time,
                                end_time: end_time,
                                itemProps: {
                                    style: {
                                        color: "rgb(0, 0, 0, 0.8)",
                                        borderStyle: "solid",
                                        fontWeight: '600',
                                        fontSize: 14,
                                        borderWidth: 1,
                                        borderRadius: 2,
                                    }
                                }
                            })
                        }
                    }
                    let x = document.getElementsByClassName("rct-item");
                    if (x.length) {
                        for (let i = 0; i < x.length; i++) {
                            if (tasksByStatus2[i]) {
                                let color;
                                currentTime = new Date();
                                startTime = new Date(tasksByStatus2[i].startDate);
                                endTime = new Date(tasksByStatus2[i].endDate);

                                if (currentTime > endTime && tasksByStatus2[i].progress < 100) {
                                    color = "#DD4B39"; // not achieved
                                }
                                else {
                                    workingDayMin = (endTime - startTime) * tasksByStatus2[i].progress / 100;
                                    let dayFromStartDate = currentTime - startTime;
                                    let timeOver = workingDayMin - dayFromStartDate;
                                    if (timeOver >= 0) {
                                        color = "#00A65A"; // In time or on time
                                    }
                                    else {
                                        color = "#F0D83A"; // delay
                                    }
                                }
                                this.displayTaskProgress(tasksByStatus2[i].progress, x[i], color);
                            }
                        }
                    }
                }
            }
        }
        return taskDurations;
    }

    // Nhóm công việc theo người thực hiện

    getTaskGroups() {
        const { tasks, translate } = this.props;
        var taskList1, tasksByStatus1;
        let groupName = [], distinctGroupName = [], id = [], distinctId = [];
        let multiResponsibleEmployee = false;

        if (tasks) {

            // Phân nhóm công việc theo người thực hiện
            if (this.props.TaskOrganizationUnitDashboard) {
                taskList1 = tasks.organizationUnitTasks && tasks.organizationUnitTasks.tasks;
                tasksByStatus1 = taskList1 && taskList1.filter(task => this.filterByStatus(task));
                if (tasksByStatus1) {

                    for (let i = 1; i <= tasksByStatus1.length; i++) {
                        let responsibleName = [];
                        let responsibleEmployeeIds = [];

                        tasksByStatus1[i - 1].responsibleEmployees.map(x => {
                            responsibleName.push(x.name)
                            responsibleEmployeeIds.push(x._id)
                        });

                        if (responsibleEmployeeIds.length === 1) { // Nếu công việc chỉ có 1 người thực hiện
                            groupName.push({
                                id: responsibleEmployeeIds[0],
                                title: responsibleName
                            });
                            id.push(responsibleEmployeeIds[0])
                        }
                        else if (responsibleEmployeeIds.length > 1) { // Nếu công việc có nhiều người làm chung
                            multiResponsibleEmployee = true;
                        }

                    }
                    // Loại bỏ các id trùng nhau
                    if (groupName.length) {
                        for (let i = 0; i < id.length; i++) {
                            let idx = distinctId.indexOf(id[i]);

                            if (idx < 0) {
                                distinctId.push(id[i]);
                                if (groupName[i]) {
                                    distinctGroupName.push({
                                        id: groupName[i].id,
                                        title: groupName[i].title
                                    })
                                }
                            }
                        }

                        if (multiResponsibleEmployee) {
                            distinctGroupName.push({
                                id: "multi-responsible-employee",
                                title: translate('task.task_management.collaborative_tasks')
                            })
                        }
                    }
                }
            }

            //Phân nhóm công việc theo vai trò trong công việc
            else {
                let res, acc, con, inf;

                if (tasks) {
                    res = tasks.responsibleTasks && tasks.responsibleTasks.filter(task => this.filterByStatus(task));
                    acc = tasks.accountableTasks && tasks.accountableTasks.filter(task => this.filterByStatus(task));
                    con = tasks.consultedTasks && tasks.consultedTasks.filter(task => this.filterByStatus(task));
                    inf = tasks.informedTasks && tasks.informedTasks.filter(task => this.filterByStatus(task));

                    if (res && res.length) distinctGroupName.push({
                        id: "responsible-tasks",
                        title: translate('task.task_management.responsible_role')
                    })
                    if (acc && acc.length) distinctGroupName.push({
                        id: "accountable-tasks",
                        title: translate('task.task_management.accountable_role')
                    })
                    if (con && con.length) distinctGroupName.push({
                        id: "consulted-tasks",
                        title: translate('task.task_management.consulted_role')
                    })
                    if (inf && inf.length) distinctGroupName.push({
                        id: "informed-tasks",
                        title: translate('task.task_management.informed_role')
                    })
                }
            }
        }

        let group = [{ id: "no-data", title: "" }];

        return distinctGroupName.length ? distinctGroupName : group;
    }

    // Hiển thị tiến độ công việc

    displayTaskProgress = async (progress, x, color) => {
        if (x) {
            let d, child;

            d = document.createElement('div');
            d.setAttribute("class", "task-progress");
            d.style.width = progress > 5 ? `${progress}%` : `5px`;
            d.style.backgroundColor = color;

            child = x.childElementCount;
            if (child === 1) {
                await x.appendChild(d);
            }
        }
    }

    handleItemClick = async (itemId) => {
        let { tasks } = this.props;
        var taskList, tasksByStatus;

        if (tasks) {
            if (this.props.TaskOrganizationUnitDashboard) {
                taskList = tasks.organizationUnitTasks && tasks.organizationUnitTasks.tasks;
                tasksByStatus = taskList && taskList.filter(task => this.filterByStatus(task));
            }
            else {
                let res, acc, con, inf;
                var tasksByStatus2 = [];

                res = tasks.responsibleTasks && tasks.responsibleTasks.filter(task => this.filterByStatus(task));
                acc = tasks.accountableTasks && tasks.accountableTasks.filter(task => this.filterByStatus(task));
                con = tasks.consultedTasks && tasks.consultedTasks.filter(task => this.filterByStatus(task));
                inf = tasks.informedTasks && tasks.informedTasks.filter(task => this.filterByStatus(task));

                if (res) {
                    await res.map(item => {
                        tasksByStatus2.push({
                            _id: item._id
                        })
                    })
                }

                if (acc) {
                    await acc.map(item => {
                        tasksByStatus2.push({
                            _id: item._id
                        })
                    })
                }

                if (con) {
                    await con.map(item => {
                        tasksByStatus2.push({
                            _id: item._id
                        })
                    })
                }

                if (inf) {
                    await inf.map(item => {
                        tasksByStatus2.push({
                            _id: item._id
                        })
                    })
                }
                tasksByStatus = tasksByStatus2;
            }
        }

        let id = tasksByStatus[itemId - 1]._id;

        await this.setState(state => {
            return {
                ...state,
                taskId: id
            }
        })
        await this.props.getTaskById(id);
        window.$(`#modal-detail-task-schedule`).modal('show')
    }

    animateScroll = invert => {
        const width = (invert ? -1 : 1) * parseFloat(this.scrollRef.style.width);
        const duration = 1200;
        const startTime = performance.now();
        let lastWidth = 0;
        const animate = () => {
            let normalizedTime = (performance.now() - startTime) / duration;
            if (normalizedTime > 1) {
                normalizedTime = 1;
            }
            const calculatedWidth = width * 0.5 * (1 + Math.cos(Math.PI * (normalizedTime - 1)));
            this.scrollRef.scrollLeft += calculatedWidth - lastWidth;
            lastWidth = calculatedWidth;
            if (normalizedTime < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    };

    onPrevClick = () => {
        this.animateScroll(true);
    };

    onNextClick = () => {
        this.animateScroll(false);
    };

    // Đếm số lượng công việc đúng hạn, trễ hạn, quá hạn
    countTasks = (taskList) => {
        let delay = 0;
        let intime = 0;
        let overDue = 0;
        let currentTime = new Date();

        for (let i in taskList) {
            let startTime = new Date(taskList[i].startDate);
            let endTime = new Date(taskList[i].endDate);
            let workingDayMin;

            if (currentTime > endTime && taskList[i].progress < 100) {
                overDue++;
            }
            else {
                workingDayMin = (endTime - startTime) * taskList[i].progress / 100; // Số ngày làm việc tối thiểu để đúng hạn
                let dayFromStartDate = currentTime - startTime;
                let timeOver = workingDayMin - dayFromStartDate;
                if (timeOver >= 0) {
                    intime++;
                }
                else {
                    delay++;
                }
            }
        }

        let data = {
            delay: delay,
            intime: intime,
            overDue: overDue
        }

        return data;
    }

    render() {
        console.log("Lich lich")
        const { tasks, translate } = this.props;
        const { TaskOrganizationUnitDashboard } = this.props;
        const { defaultTimeStart, defaultTimeEnd, taskStatus } = this.state;

        let task = tasks && tasks.task;
        let today = new Date();
        let data;
        let rctHeadText = TaskOrganizationUnitDashboard ? translate('task.task_management.responsible') : translate('task.task_management.role');
        let rctHead = document.getElementsByClassName("rct-header-root");

        if (rctHead[0]) {
            let first = rctHead[0].children;
            if (first[0]) {
                first[0].setAttribute("id", "rct-header-text")
                first[0].innerHTML = rctHeadText;
            }
        }

        if (tasks) {
            let taskList, tasksByStatus;
            // Đếm số công việc đơn vị
            if (TaskOrganizationUnitDashboard) {
                taskList = tasks.organizationUnitTasks && tasks.organizationUnitTasks.tasks;
                tasksByStatus = taskList && taskList.filter(task => this.filterByStatus(task));

                if (tasksByStatus) {
                    data = this.countTasks(tasksByStatus);
                }
            }
            // Đếm số công việc cá nhân
            else {
                let res = tasks.responsibleTasks && tasks.responsibleTasks;
                let acc = tasks.accountableTasks && tasks.accountableTasks;
                let con = tasks.consultedTasks && tasks.consultedTasks;
                let inf = tasks.informedTasks && tasks.informedTasks;
                let fourTasks = res && acc && con && inf && res.concat(acc, con, inf).filter(task => this.filterByStatus(task));

                data = this.countTasks(fourTasks);
            }
        }
        const { idSelect } = this.props;
        var myGroups = [
            { id: 1, title: 'Ca 1' },
            { id: 2, title: 'Ca 2' },
            { id: 3, title: 'Ca 3' },
        ];

        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    <section className="form-inline" style={{ textAlign: "right", marginBottom: "10px" }}>
                        <div className="form-group">
                            <label style={{ minWidth: "150px" }}>Trạng thái</label>

                            <SelectMulti id={`multiSelectStatusInCalendar-${idSelect}`}
                                items={[
                                    { value: "all", text: "Tất cả lệnh" },
                                    { value: "inprocess", text: translate('task.task_management.inprocess') },
                                    { value: "wait_for_approval", text: translate('task.task_management.wait_for_approval') },
                                    { value: "finished", text: translate('task.task_management.finished') },
                                    { value: "delayed", text: translate('task.task_management.delayed') },
                                    { value: "canceled", text: translate('task.task_management.canceled') }
                                ]}
                                onChange={this.handleSelectStatus}
                                options={{ nonSelectedText: translate('task.task_management.inprocess'), allSelectedText: translate('task.task_management.select_all_status') }}
                                value={taskStatus}>
                            </SelectMulti>

                        </div>
                        <div className="form-group">
                            <button className="btn btn-success" onClick={this.handleSearchData}>{translate('task.task_management.filter')}</button>
                        </div>
                    </section>
                    {<ModalDetailTask action={'schedule'} task={task} />}
                    <Timeline
                        scrollRef={el => (this.scrollRef = el)}
                        groups={myGroups}
                        items={this.getTaskDurations()}
                        itemsSorted
                        itemTouchSendsClick={false}
                        stackItems
                        sidebarWidth={150}
                        itemHeightRatio={0.8}
                        onItemClick={this.handleItemClick}
                        canMove={false}
                        canResize={false}
                        defaultTimeStart={defaultTimeStart}
                        defaultTimeEnd={defaultTimeEnd}
                    >
                        <TodayMarker date={today}>
                            {
                                ({ styles, date }) => {
                                    const customStyles = {
                                        ...styles,
                                        backgroundColor: 'rgba(231, 76, 60, 1)',
                                        width: '2px',
                                        zIndex: '100'
                                    }
                                    return <div style={customStyles}></div>
                                }
                            }
                        </TodayMarker>
                    </Timeline>

                    <div className="form-inline" style={{ textAlign: "center", margin: "10px" }}>
                        <div className="form-group">
                            <div id="in-time"></div>
                            <label id="label-for-calendar">{translate('task.task_management.in_time')}({data && data.intime ? data.intime : 0})</label>
                        </div>
                        <div className="form-group">
                            <div id="delay"></div>
                            <label id="label-for-calendar">{translate('task.task_management.delayed_time')}({data && data.delay ? data.delay : 0})</label>
                        </div>
                        <div className="form-group">
                            <div id="not-achieved"></div>
                            <label id="label-for-calendar">{translate('task.task_management.not_achieved')}({data && data.overDue ? data.overDue : 0})</label>
                        </div>

                    </div>
                    <div className="form-inline pull-right" style={{ marginTop: "5px" }}>
                        <button className='btn btn-primary' onClick={this.onPrevClick}><i className="fa fa-angle-left"></i> {translate('task.task_management.prev')}</button>
                        <button className='btn btn-primary' onClick={this.onNextClick}>{translate('task.task_management.next')} <i className="fa fa-angle-right"></i></button>
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
    getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
    getAccountableTaskByUser: taskManagementActions.getAccountableTaskByUser,
    getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
    getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
    getTaskById: performTaskAction.getTaskById,
    getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth,
    getPaginateTasksByUser: taskManagementActions.getPaginateTasksByUser,

}
export default connect(mapState, actions)(withTranslate(ManufacturingSchedule));
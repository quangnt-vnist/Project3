import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { ModalDetailTask } from '../task-personal-dashboard/modalDetailTask'

import Timeline, { TodayMarker } from "react-calendar-timeline"

import { SelectMulti } from '../../../../common-components/index';
import moment from 'moment'
import 'react-calendar-timeline/lib/Timeline.css'
import '../task-personal-dashboard/calendar.css'
import { performTaskAction } from '../../task-perform/redux/actions'


class CalendarOrganizationUnit extends Component {
    constructor(props) {
        super(props);

        let defaultTimeStart = moment()
            .startOf("month")
            .toDate();

        let defaultTimeEnd = moment()
            .startOf("month")
            .add(1, "month")
            .toDate();

        this.SEARCH_INFO = {
            taskStatus: ["inprocess"],
        }

        this.INFO_CALENDAR = {
            delay: 0,
            intime: 0,
            overDue: 0,

        }

        this.state = {
            defaultTimeStart,
            defaultTimeEnd,
            startDate: null,
            endDate: null,
            taskId: null,
            add: true,
            taskStatus: this.SEARCH_INFO.taskStatus,
        };
    }

    handleSelectStatus = async (taskStatus) => {
        if (taskStatus.length === 0) {
            taskStatus = ["inprocess"];
        }

        this.SEARCH_INFO.taskStatus = taskStatus;
    }

    handleSearchData = async () => {
        // const { tasks } = this.props;
        let r = document.getElementsByClassName("task-progress");
        let status = this.SEARCH_INFO.taskStatus;

        for (let i = 0; i < r.length; i++) {
            r[i] && r[i].remove()
        }

        // if (tasks) {
        //     let taskList, tasksByStatus;

        //     // Đếm số công việc đơn vị
        //     taskList = tasks.organizationUnitTasks && tasks.organizationUnitTasks.tasks;
        //     tasksByStatus = taskList && taskList.filter(task => this.filterByStatus(task));

        //     if (tasksByStatus) {
        //         await this.countTasks(tasksByStatus);
        //     }

        // }
        await this.setState(state => {
            return {
                ...state,
                taskStatus: status
            }
        })
        // await this.getTaskDurations();
        // await this.getTaskGroups();
    }

    // Lọc công việc theo trạng thái
    filterByStatus(task) {
        let stt = this.state.taskStatus;

        for (let i in stt) {
            if (task.status === stt[i] && task.isArchived === false) return true;
        }
    }
    convertStatus(status) {
        const { translate } = this.props;

        switch (status) {
            case "inprocess": return translate('task.task_management.inprocess');
            case "wait_for_approval": return translate('task.task_management.wait_for_approval');
            case "finished": return translate('task.task_management.finished');
            case "delayed": return translate('task.task_management.delayed');
            case "canceled": return translate('task.task_management.canceled');
        }
    }

    // Lấy thời gian các công việc
    getTaskDurations() {
        const { tasks } = this.props;
        var taskList, tasksByStatus;
        let taskDurations = [];

        if (tasks) {
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

                    if (responsibleEmployeeIds.length > 1) {
                        multi = true;
                    }
                    if (multi) {
                        if (tasksByStatus[i - 1].status !== "inprocess") {
                            titleTask = `${tasksByStatus[i - 1].name} - ${responsibleEmployeeNames.join(" - ")} - (${this.convertStatus(tasksByStatus[i - 1].status)})`;
                        }
                        else titleTask = tasksByStatus[i - 1].name + " - " + responsibleEmployeeNames.join(" - ") + " - " + tasksByStatus[i - 1].progress + "%";;

                        groupTask = "multi-responsible-employee"
                    }
                    else {
                        if (tasksByStatus[i - 1].status !== "inprocess") {
                            titleTask = `${tasksByStatus[i - 1].name} - (${this.convertStatus(tasksByStatus[i - 1].status)})`;
                        }
                        else titleTask = `${tasksByStatus[i - 1].name} - ${tasksByStatus[i - 1].progress} % `;

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

                let x2 = document.getElementsByClassName("rct-items");
                let listNodes = x2[0] && x2[0].childNodes;

                if (listNodes && listNodes.length) {
                    for (let i = 0; i < listNodes.length; i++) {

                        listNodes[i].classList.add("rct-item")

                        if (tasksByStatus[i] && tasksByStatus[i].status !== "inprocess") {
                            listNodes[i].setAttribute("class", "task-background");
                        }

                        if (tasksByStatus[i] && tasksByStatus[i].status === "inprocess") {
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
                            this.displayTaskProgress(tasksByStatus[i].progress, listNodes[i], color);
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
            let ch = x.childNodes;

            if (ch[3]) ch[3].remove();
            x.appendChild(d);
        }
    }

    handleItemClick = async (itemId) => {
        let { tasks } = this.props;
        var taskList, tasksByStatus;

        if (tasks) {
            taskList = tasks.organizationUnitTasks && tasks.organizationUnitTasks.tasks;
            tasksByStatus = taskList && taskList.filter(task => this.filterByStatus(task));
        }

        let id = tasksByStatus[itemId - 1]._id;

        await this.setState(state => {
            return {
                ...state,
                taskId: id
            }
        })
        await this.props.getTaskById(id);
        window.$(`#modal-detail-task-CalendarOrganizationUnit`).modal('show')
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
        const { tasks, translate } = this.props;
        const { defaultTimeStart, defaultTimeEnd, taskStatus } = this.state;

        let task = tasks && tasks.task;
        let today = new Date();
        let data;
        let rctHeadText = translate('task.task_management.responsible');
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
            taskList = tasks.organizationUnitTasks && tasks.organizationUnitTasks.tasks;
            tasksByStatus = taskList && taskList.filter(task => this.filterByStatus(task));
            let inprocessTasks = tasksByStatus && tasksByStatus.filter(x => x.status === "inprocess")
            data = this.countTasks(inprocessTasks);

        }

        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    <section className="form-inline" style={{ textAlign: "right", marginBottom: "10px" }}>
                        {/* Chọn trạng thái công việc */}
                        <div className="form-group">
                            <label style={{ minWidth: "150px" }}>{translate('task.task_management.task_status')}</label>

                            <SelectMulti id="multiSelectStatusInCalendar"
                                items={[
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
                    {<ModalDetailTask action={'CalendarOrganizationUnit'} task={task} />}
                    <Timeline
                        scrollRef={el => (this.scrollRef = el)}
                        groups={this.getTaskGroups()}
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
    getTaskById: performTaskAction.getTaskById,

}
const connectedCalendarOrganizationUnit = connect(mapState, actions)(withTranslate(CalendarOrganizationUnit))
export { connectedCalendarOrganizationUnit as CalendarOrganizationUnit }
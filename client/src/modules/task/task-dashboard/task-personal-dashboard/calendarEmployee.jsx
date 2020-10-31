import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { ModalDetailTask } from './modalDetailTask'

import Timeline, { TodayMarker } from "react-calendar-timeline"

import { SelectMulti } from '../../../../common-components/index';
import moment from 'moment'
import 'react-calendar-timeline/lib/Timeline.css'
import './calendar.css'
import { performTaskAction } from '../../task-perform/redux/actions'


class CalendarEmployee extends Component {
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
            count: 0,
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
        let r = document.getElementsByClassName("task-progress");
        let status = this.SEARCH_INFO.taskStatus;

        for (let i = 0; i < r.length; i++) {
            r[i] && r[i].remove()
        }

        // if (tasks) {
        //     let res = tasks.responsibleTasks && tasks.responsibleTasks;
        //     let acc = tasks.accountableTasks && tasks.accountableTasks;
        //     let con = tasks.consultedTasks && tasks.consultedTasks;
        //     let inf = tasks.informedTasks && tasks.informedTasks;
        //     let fourTasks = res.concat(acc, con, inf).filter(task => this.filterByStatus(task));
        //     let inprocessTasks = fourTasks && fourTasks.filter(x => x.status === "inprocess")
        //     await this.countTasks(inprocessTasks);
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
        let taskDurations = [];

        if (tasks) {
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
                        status: res[i].status,
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
                        status: acc[i].status,
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
                        status: con[i].status,
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
                        status: inf[i].status,
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
                        let stt = this.convertStatus(tasksByStatus2[i].status)
                        let titleTask = tasksByStatus2[i].status === "inprocess" ? `${tasksByStatus2[i].name} - ${tasksByStatus2[i].progress} % ` : `${tasksByStatus2[i].name} (${stt})`;
                        let addDate2;
                        let fontColor = (tasksByStatus2[i] && tasksByStatus2[i].status === "inprocess") ? "rgba(0, 0, 0, 0.8)" : "#555"
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
                            // id: i + this.INFO_CALENDAR.count,
                            id: i,
                            group: tasksByStatus2[i].gr,
                            title: titleTask,
                            canMove: false,
                            start_time: start_time,
                            end_time: end_time,
                            itemProps: {
                                style: {
                                    color: fontColor,
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

                let x2 = document.getElementsByClassName("rct-items");
                let listNodes = x2[0] && x2[0].childNodes;

                if (listNodes && listNodes.length) {
                    for (let i = 0; i < listNodes.length; i++) {

                        listNodes[i].classList.add("rct-item")

                        if (tasksByStatus2[i] && tasksByStatus2[i].status !== "inprocess") {
                            listNodes[i].setAttribute("class", "task-background");
                        }

                        if (tasksByStatus2[i] && tasksByStatus2[i].status === "inprocess") {
                            let color;
                            let currentTime = new Date();
                            let startTime = new Date(tasksByStatus2[i].startDate);
                            let endTime = new Date(tasksByStatus2[i].endDate);

                            if (currentTime > endTime && tasksByStatus2[i].progress < 100) {
                                color = "#DD4B39"; // not achieved
                            }
                            else {
                                let workingDayMin = (endTime - startTime) * tasksByStatus2[i].progress / 100;
                                let dayFromStartDate = currentTime - startTime;
                                let timeOver = workingDayMin - dayFromStartDate;
                                if (tasksByStatus2[i].status === 'finished' || timeOver >= 0) {
                                    color = "#00A65A"; // In time or on time
                                }
                                else {
                                    color = "#F0D83A"; // delay
                                }
                            }

                            this.displayTaskProgress(tasksByStatus2[i].progress, listNodes[i], color);
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
        let distinctGroupName = [];

        if (tasks) {
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
        var tasksByStatus;

        if (tasks) {

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

        // let id = tasksByStatus[itemId - this.INFO_CALENDAR.count]._id;
        let id = tasksByStatus[itemId]._id;
        await this.setState(state => {
            return {
                ...state,
                taskId: id
            }
        })

        await this.props.getTaskById(id);
        window.$(`#modal-detail-task-Employee`).modal('show')
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
                if (taskList[i].status === 'finished' || timeOver >= 0) {
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
        let rctHeadText = translate('task.task_management.role');
        let rctHead = document.getElementsByClassName("rct-header-root");
        if (rctHead[0]) {
            let first = rctHead[0].children;
            if (first[0]) {
                first[0].setAttribute("id", "rct-header-text")
                first[0].innerHTML = rctHeadText;
            }
        }

        if (tasks) {

            // Đếm số công việc cá nhân
            let res = tasks.responsibleTasks && tasks.responsibleTasks;
            let acc = tasks.accountableTasks && tasks.accountableTasks;
            let con = tasks.consultedTasks && tasks.consultedTasks;
            let inf = tasks.informedTasks && tasks.informedTasks;
            let fourTasks = res && acc && con && inf && res.concat(acc, con, inf).filter(task => this.filterByStatus(task));
            let inprocessTasks = fourTasks && fourTasks.filter(x => x.status === "inprocess")
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
                    {<ModalDetailTask action={'Employee'} task={task} />}
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
const connectedEmployee = connect(mapState, actions)(withTranslate(CalendarEmployee))
export { connectedEmployee as CalendarEmployee }
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalPerform } from '../../task-perform/component/modalPerform';
import { TaskAddModal } from './taskAddModal';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskManagementActions } from '../redux/actions';
import { performTaskAction } from "../../task-perform/redux/actions";
import { SelectMulti, DataTableSetting, PaginateBar, TreeTable, SelectBox, DatePicker } from '../../../../common-components';
import { getStorage } from '../../../../config';
import Swal from 'sweetalert2';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';

class TaskManagement extends Component {
    constructor(props) {
        let userId = getStorage("userId");
        super(props);
        this.state = {
            perPage: 20,
            currentPage: 1,

            currentTab: "responsible",
            organizationalUnit: [],
            status: ["inprocess", "wait_for_approval"],
            priority: [],
            special: [],
            name: "",
            startDate: "",
            endDate: "",
            startDateAfter: "",
            endDateBefore: "",
            startTimer: false,
            pauseTimer: false,
            timer: {
                startedAt: "",
                creator: userId,
                task: ""
            },
        };
    }

    componentDidMount() {
        this.props.getDepartment();
        this.props.getAllDepartment();
        this.props.getResponsibleTaskByUser([], "1", "20", this.state.status, [], [], null, null, null, null, null);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let { currentTab, organizationalUnit, status, priority, special, name, startDate, endDate } = this.state;

        if (currentTab != nextState.currentTab ||
            organizationalUnit != nextState.organizationalUnit ||
            status != nextState.status ||
            priority != nextState.priority ||
            special != nextState.special ||
            name != nextState.name ||
            startDate != nextState.startDate ||
            endDate != nextState.endDate
        ) {
            return false;
        }

        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.tasks.tasks && this.props.tasks.tasks && prevProps.tasks.tasks.length !== this.props.tasks.tasks.length) {
            this.handleUpdateData();
        }
    }

    formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    list_to_tree = (list) => {
        let map = {}, node, roots = [], i, newarr = [];
        for (i = 0; i < list.length; i += 1) {
            map[list[i]._id] = i; // initialize the map
            list[i].children = []; // initialize the children
        }

        for (i = 0; i < list.length; i += 1) {
            node = list[i];
            if (node.parent !== null) {

                // if you have dangling branches check that map[node.parentId] exists
                if (map[node.parent._id] !== undefined) {
                    list[map[node.parent._id]].children.push(node);
                }
                else {
                    roots.push(node);
                }

            } else {
                roots.push(node);
            }
        }
        let change = (arr) => {
            arr.map(item => {
                newarr.push(item);
                change(item.children);
                return true;
            });
            return newarr;
        }
        let flat = change(roots).map(x => delete x.children && x);
        return flat;
    }

    setLimit = async (limit) => {
        if (Number(limit) !== this.state.perPage) {
            // Cập nhật số dòng trang trên một trang hiển thị
            await this.setState(state => {
                return {
                    ...state,
                    perPage: Number(limit)
                }
            })
            // TODO: send query
            this.handleGetDataPerPage(this.state.perPage);
        }
    }

    startTimer = async (taskId) => {
        let userId = getStorage("userId");
        let timer = {
            creator: userId,
        };
        this.props.startTimer(taskId,timer);
    }

    // Hàm xử lý trạng thái lưu kho
    handleStore = async (id) => {
        await this.props.editArchivedOfTask(id);
    }

    // Hàm xóa một công việc theo id
    handleDelete = async (id) => {
        const { tasks, translate } = this.props;
        let currentTasks = tasks.tasks.find(task => task._id === id);

        console.log('task', currentTasks);

        let progress = currentTasks.progress;
        let action = currentTasks.taskActions.filter(item => item.creator); // Nếu công việc theo mẫu, chưa hoạt động nào được xác nhận => cho xóa

        if (action.length === 0 && progress === 0) {
            Swal.fire({
                title: `Bạn có chắc chắn muốn xóa công việc "${currentTasks.name}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: this.props.translate('general.no'),
                confirmButtonText: this.props.translate('general.yes'),
            }).then((result) => {
                if (result.value) {
                    this.props.deleteTaskById(id);
                }
            })
            
        }
        else {
            Swal.fire({
                title: translate('task.task_management.confirm_delete'),
                // type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        }
    }

    handleGetDataPagination = async (index) => {
        let { organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore } = this.state;

        let oldCurrentPage = this.state.currentPage;
        let perPage = this.state.perPage;

        await this.setState(state => {
            return {
                ...state,
                currentPage: index
            }
        })
        let newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== index) {
            let content = this.state.currentTab;
            if (content === "responsible") {
                this.props.getResponsibleTaskByUser(organizationalUnit, newCurrentPage, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore);
            } else if (content === "accountable") {
                this.props.getAccountableTaskByUser(organizationalUnit, newCurrentPage, perPage, status, priority, special, name, startDate, endDate);
            } else if (content === "consulted") {
                this.props.getConsultedTaskByUser(organizationalUnit, newCurrentPage, perPage, status, priority, special, name, startDate, endDate);
            } else if (content === "creator") {
                this.props.getCreatorTaskByUser(organizationalUnit, newCurrentPage, perPage, status, priority, special, name, startDate, endDate);
            } else if (content === "informed") {
                this.props.getInformedTaskByUser(organizationalUnit, newCurrentPage, perPage, status, priority, special, name, startDate, endDate);
            } else {
                this.props.getPaginateTasksByUser(organizationalUnit, newCurrentPage, perPage, status, priority, special, name, startDate, endDate);
            }
        };
    }

    nextPage = async (pageTotal) => {
        let { organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore } = this.state;

        let oldCurrentPage = this.state.currentPage;
        await this.setState(state => {
            return {
                ...state,
                currentPage: state.currentPage === pageTotal ? pageTotal : state.currentPage + 1
            }
        })
        let newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== newCurrentPage) {
            let content = this.state.currentTab;
            if (content === "responsible") {
                this.props.getResponsibleTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore);
            } else if (content === "accountable") {
                this.props.getAccountableTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            } else if (content === "consulted") {
                this.props.getConsultedTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            } else if (content === "creator") {
                this.props.getCreatorTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            } else if (content === "informed") {
                this.props.getInformedTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            } else {
                this.props.getPaginateTasksByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            }
        };
    }

    backPage = async () => {
        let { organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore } = this.state;

        let oldCurrentPage = this.state.currentPage;
        await this.setState(state => {
            return {
                ...state,
                currentPage: state.currentPage === 1 ? 1 : state.currentPage - 1
            }
        })
        let newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== newCurrentPage) {
            let content = this.state.currentTab;
            if (content === "responsible") {
                this.props.getResponsibleTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore);
            } else if (content === "accountable") {
                this.props.getAccountableTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            } else if (content === "consulted") {
                this.props.getConsultedTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            } else if (content === "creator") {
                this.props.getCreatorTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            } else if (content === "informed") {
                this.props.getInformedTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            } else {
                this.props.getPaginateTasksByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            }
        };
    }

    handleGetDataPerPage = (perPage) => {
        let { organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore } = this.state;

        let content = this.state.currentTab;

        if (content === "responsible") {
            this.props.getResponsibleTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore);
        } else if (content === "accountable") {
            this.props.getAccountableTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        } else if (content === "consulted") {
            this.props.getConsultedTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        } else if (content === "creator") {
            this.props.getCreatorTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        } else if (content === "informed") {
            this.props.getInformedTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        } else {
            this.props.getPaginateTasksByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        }
        this.setState(state => {
            return {
                ...state,
                currentPage: 1
            }
        })
    }

    handleUpdateData = () => {
        let { organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore } = this.state;

        let content = this.state.currentTab;
        let { perPage } = this.state;

        if (content === "responsible") {
            this.props.getResponsibleTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore);
        } else if (content === "accountable") {
            this.props.getAccountableTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        } else if (content === "consulted") {
            this.props.getConsultedTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        } else if (content === "creator") {
            this.props.getCreatorTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        } else if (content === "informed") {
            this.props.getInformedTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        } else {
            this.props.getPaginateTasksByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        }
        this.setState(state => {
            return {
                ...state,
                currentPage: 1
            }
        })
    }
    convertTime = (duration) => {
        let seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    handleShowModal = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                currentTaskId: id
            }
        })
        window.$(`#modelPerformTask${id}`).modal('show');
    }

    /**
     * Mở modal thêm task mới
     * @id task cha của task sẽ thêm (là "" nếu không có cha)
     */
    handleAddTask = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                parentTask: id
            }
        });
        console.log('iddddddd', this.state.parentTask);
        window.$(`#addNewTask`).modal('show')
    }

    getResponsibleOfItem = (data, id) => {
        data.map(item => {
            if (id === item._id) {
                return item.responsibleEmployees
            }
        })
    }

    getUnitIdOfItem = (data, id) => {
        data.map(item => {
            if (id === item._id) {
                return item.organizationalUnit._id
            }
        })
    }

    formatPriority = (data) => {
        const { translate } = this.props;
        if (data === 1) return translate('task.task_management.low');
        if (data === 2) return translate('task.task_management.normal');
        if (data === 3) return translate('task.task_management.high');
    }

    formatStatus = (data) => {
        const { translate } = this.props;
        if (data === "inprocess") return translate('task.task_management.inprocess');
        else if (data === "wait_for_approval") return translate('task.task_management.wait_for_approval');
        else if (data === "finished") return translate('task.task_management.finished');
        else if (data === "delayed") return translate('task.task_management.delayed');
        else if (data === "canceled") return translate('task.task_management.canceled');
    }

    handleRoleChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                currentTab: value[0]
            }
        });
    }

    handleSelectOrganizationalUnit = (value) => {
        // if (value.length === 0) {
        //     value = '[]';
        // }

        this.setState(state => {
            return {
                ...state,
                organizationalUnit: value
            }
        });
    }

    handleSelectStatus = (value) => {
        // if (value.length === 0) {
        //     value = '[]';
        // }

        this.setState(state => {
            console.log('val-status', value);
            return {
                ...state,
                status: value
            }
        });
    }

    handleSelectPriority = (value) => {
        // if (value.length === 0) {
        //     value = '[]';
        // }

        this.setState(state => {
            return {
                ...state,
                priority: value
            }
        });
    }

    handleSelectSpecial = (value) => {
        // if (value.length === 0) {
        //     value = '[]';
        // }

        this.setState(state => {
            return {
                ...state,
                special: value
            }
        });
    }

    handleChangeName = (e) => {
        let name = e.target.value;
        if (name === '') {
            name = null;
        }

        this.setState(state => {
            return {
                ...state,
                name: name
            }
        });
    }

    handleChangeStartDate = (value) => {
        if (value === '') {
            value = null;
        }

        this.setState(state => {
            return {
                ...state,
                startDate: value
            }
        });
    }

    handleChangeEndDate = (value) => {
        if (value === '') {
            value = null;
        }

        this.setState(state => {
            return {
                ...state,
                endDate: value
            }
        });
    }

    render() {
        const { tasks, user, translate } = this.props;
        const { currentTaskId, currentPage, currentTab, parentTask, startDate, endDate, perPage, status } = this.state;
        let currentTasks, units = [];
        let pageTotals;

        if (tasks.tasks) {
            currentTasks = tasks.tasks;
            pageTotals = tasks.pages
        }

        if (user) units = user.organizationalUnitsOfUser;
        const items = [];

        // khởi tạo dữ liệu TreeTable
        let column = [
            { name: translate('task.task_management.col_name'), key: "name" },
            { name: translate('task.task_management.col_organization'), key: "organization" },
            { name: translate('task.task_management.col_priority'), key: "priority" },
            { name: translate('task.task_management.col_start_date'), key: "startDate" },
            { name: translate('task.task_management.col_end_date'), key: "endDate" },
            { name: translate('task.task_management.col_status'), key: "status" },
            { name: translate('task.task_management.col_progress'), key: "progress" },
            { name: translate('task.task_management.col_logged_time'), key: "totalLoggedTime" }
        ];
        let data = [];
        if (typeof currentTasks !== 'undefined' && currentTasks.length !== 0) {
            let dataTemp = currentTasks;

            for (let n in dataTemp) {
                data[n] = {
                    ...dataTemp[n],
                    name: dataTemp[n].name,
                    organization: dataTemp[n].organizationalUnit ? dataTemp[n].organizationalUnit.name : translate('task.task_management.err_organizational_unit'),
                    priority: this.formatPriority(dataTemp[n].priority),
                    startDate: this.formatDate(dataTemp[n].startDate),
                    endDate: this.formatDate(dataTemp[n].endDate),
                    status: this.formatStatus(dataTemp[n].status),
                    progress: dataTemp[n].progress ? dataTemp[n].progress + "%": "0%",
                    totalLoggedTime: this.convertTime(dataTemp[n].hoursSpentOnTask.totalHoursSpent),
                    parent: dataTemp[n].parent ? dataTemp[n].parent._id : null
                }
            }

            let archived = "store";
            if (dataTemp[0].isArchived === true) {
                archived = "restore";
            }

            if (currentTab === "creator" || currentTab === "informed") {
                let del = null;
                if (currentTab === "creator") {
                    del = "delete";
                }

                for (let i in data) {
                    data[i] = { ...data[i], action: ["edit", ["add", archived, del]] }
                }
            }
            if (currentTab === "responsible" || currentTab === "consulted") {
                for (let i in data) {
                    data[i] = { ...data[i], action: ["edit", "startTimer", ["add", archived]] }
                }
            }

            if (currentTab === "accountable") {
                for (let i in data) {
                    data[i] = { ...data[i], action: ["edit", "startTimer", ["add", archived, "delete"]] }
                }
            }

            if (currentTab === "all") {
                for (let i in data) {
                    data[i] = { ...data[i], action: ["edit", "add", archived] }
                }
            }

        }

        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div style={{ height: "40px" }}>
                        {currentTab !== "informed" &&
                            <button type="button" onClick={() => { this.handleAddTask("") }} className="btn btn-success pull-right" title={translate('task.task_management.add_title')}>{translate('task.task_management.add_task')}</button>
                        }
                        <TaskAddModal currentTasks={(currentTasks !== undefined && currentTasks.length !== 0) && this.list_to_tree(currentTasks)} parentTask={parentTask} />
                    </div>

                    <div className="form-inline">
                        <div className="form-group">
                            <label>{translate('task.task_management.department')}</label>
                            {units &&
                                <SelectMulti id="multiSelectUnit1"
                                    defaultValue={units.map(item => { return item._id })}
                                    items={units.map(item => { return { value: item._id, text: item.name } })}
                                    onChange={this.handleSelectOrganizationalUnit}
                                    options={{ nonSelectedText: units.length !== 0 ? translate('task.task_management.select_department') : "Bạn chưa có đơn vị", allSelectedText: translate(`task.task_management.select_all_department`) }}>
                                </SelectMulti>
                            }
                        </div>
                        <div className="form-group">
                            <label>{translate('task.task_management.status')}</label>
                            <SelectMulti id="multiSelectStatus"
                                // defaultValue={[
                                //     translate('task.task_management.inprocess')
                                // ]}
                                value={status}
                                items={[
                                    { value: "inprocess", text: translate('task.task_management.inprocess') },
                                    { value: "wait_for_approval", text: translate('task.task_management.wait_for_approval') },
                                    { value: "finished", text: translate('task.task_management.finished') },
                                    { value: "delayed", text: translate('task.task_management.delayed') },
                                    { value: "canceled", text: translate('task.task_management.canceled') }
                                ]}
                                onChange={this.handleSelectStatus}
                                options={{ nonSelectedText: translate('task.task_management.select_status'), allSelectedText: translate('task.task_management.select_all_status') }}>
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label>{translate('task.task_management.priority')}</label>
                            <SelectMulti id="multiSelectPriority" defaultValue={[
                                translate('task.task_management.high'),
                                translate('task.task_management.normal'),
                                translate('task.task_management.low')
                            ]}
                                items={[
                                    { value: "3", text: translate('task.task_management.high') },
                                    { value: "2", text: translate('task.task_management.normal') },
                                    { value: "1", text: translate('task.task_management.low') }
                                ]}
                                onChange={this.handleSelectPriority}
                                options={{ nonSelectedText: translate('task.task_management.select_priority'), allSelectedText: translate('task.task_management.select_all_priority') }}>
                            </SelectMulti>
                        </div>

                        <div className="form-group">
                            <label>{translate('task.task_management.special')}</label>
                            <SelectMulti id="multiSelectCharacteristic" defaultValue={[
                                translate('task.task_management.store'),
                                translate('task.task_management.current_month')
                            ]}
                                items={[
                                    { value: "Lưu trong kho", text: translate('task.task_management.stored') },
                                    { value: "Tháng hiện tại", text: translate('task.task_management.current_month') }
                                ]}
                                onChange={this.handleSelectSpecial}
                                options={{ nonSelectedText: translate('task.task_management.select_special'), allSelectedText: translate('task.task_management.select_all_special') }}>
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label>{translate('task.task_management.name')}</label>
                            <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_name')} name="name" onChange={(e) => this.handleChangeName(e)} />
                        </div>

                        <div className="form-group">
                            <label>{translate('task.task_management.role')}</label>
                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                id={`select-task-role`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    [
                                        { value: "responsible", text: translate('task.task_management.responsible') },
                                        { value: "accountable", text: translate('task.task_management.accountable') },
                                        { value: "consulted", text: translate('task.task_management.consulted') },
                                        { value: "creator", text: translate('task.task_management.creator') },
                                        { value: "informed", text: translate('task.task_management.informed') },
                                        { value: "all", text: translate('task.task_management.all_role') },
                                    ]
                                }
                                onChange={this.handleRoleChange}
                                multiple={false}
                            />
                        </div>

                        <div className="form-group">
                            <label>{translate('task.task_management.start_date')}</label>
                            <DatePicker
                                id="start-date"
                                dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                value={startDate} // giá trị mặc định cho datePicker    
                                onChange={this.handleChangeStartDate}
                                disabled={false}                     // sử dụng khi muốn disabled, mặc định là false
                            />
                        </div>

                        <div className="form-group">
                            <label>{translate('task.task_management.end_date')}</label>
                            <DatePicker
                                id="end-date"
                                dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                value={endDate} // giá trị mặc định cho datePicker    
                                onChange={this.handleChangeEndDate}
                                disabled={false}                     // sử dụng khi muốn disabled, mặc định là false
                            />
                        </div>
                    </div>

                    <div className="form-inline">
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" onClick={this.handleUpdateData}>{translate('task.task_management.search')}</button>
                        </div>
                    </div>

                    <DataTableSetting
                        tableId="tree-table"
                        tableContainerId="tree-table-container"
                        tableWidth="1300px"
                        columnArr={[
                            translate('task.task_management.col_name'),
                            translate('task.task_management.col_organization'),
                            translate('task.task_management.col_priority'),
                            translate('task.task_management.col_start_date'),
                            translate('task.task_management.col_end_date'),
                            translate('task.task_management.col_status'),
                            translate('task.task_management.col_progress'),
                            translate('task.task_management.col_logged_time')
                        ]}
                        limit={perPage}
                        setLimit={this.setLimit}
                        hideColumnOption={true}
                    />

                    <div id="tree-table-container">
                        <TreeTable
                            behaviour="show-children"
                            column={column}
                            data={data}
                            titleAction={{
                                edit: translate('task.task_management.action_edit'),
                                delete: translate('task.task_management.action_delete'),
                                store: translate('task.task_management.action_store'),
                                restore: translate('task.task_management.action_restore'),
                                add: translate('task.task_management.action_add'),
                                startTimer: translate('task.task_management.action_start_timer'),
                            }}
                            funcEdit={this.handleShowModal}
                            funcAdd={this.handleAddTask}
                            funcStartTimer={this.startTimer}
                            funcStore={this.handleStore}
                            funcDelete={this.handleDelete}
                        />

                    </div>
                    {
                        currentTaskId !== undefined &&
                        <ModalPerform
                            units={units}
                            id={currentTaskId}
                        />
                    }

                    <PaginateBar
                        pageTotal={tasks.pages}
                        currentPage={currentPage}
                        func={this.handleGetDataPagination}
                    />

                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { tasks, user, department } = state;
    return { tasks, user, department };
}

const actionCreators = {
    getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
    getAccountableTaskByUser: taskManagementActions.getAccountableTaskByUser,
    getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
    getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
    getCreatorTaskByUser: taskManagementActions.getCreatorTaskByUser,
    getPaginateTasksByUser: taskManagementActions.getPaginateTasksByUser,
    editArchivedOfTask: performTaskAction.editArchivedOfTask,
    getDepartment: UserActions.getDepartmentOfUser,
    getSubTask: taskManagementActions.getSubTask,
    startTimer: performTaskAction.startTimerTask,
    deleteTaskById: taskManagementActions._delete,
    getAllDepartment: DepartmentActions.get,
};
const translateTaskManagement = connect(mapState, actionCreators)(withTranslate(TaskManagement));
export { translateTaskManagement as TaskManagement };

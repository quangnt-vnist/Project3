import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ModalPerform } from '../../task-perform/component/modalPerform';

import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskManagementActions } from '../redux/actions';
import { performTaskAction } from "../../task-perform/redux/actions";
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';

import { SelectMulti, DataTableSetting, PaginateBar, TreeTable, SelectBox, DatePicker } from '../../../../common-components';
import { getStorage } from '../../../../config';
import Swal from 'sweetalert2';

class TaskManagementOfUnit extends Component {

    constructor(props) {
        super(props);

        this.state = {
            roleId: getStorage("currentRole"),
            perPage: 20,
            currentPage: 1,

            currentTab: "responsible",
            status: ["inprocess", "wait_for_approval"],
            priority: [],
            special: [],
            name: "",
            startDate: "",
            endDate: "",
            startDateAfter: "",
            endDateBefore: "",
        };
    }

    componentDidMount() {
        this.props.getDepartment();
        this.props.getAllDepartment();
        this.props.getPaginatedTasksByOrganizationalUnit(this.state.roleId, 1, 20, this.state.status, [], [], null, null, null);
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

    handleGetDataPagination = async (index) => {
        let { roleId, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore } = this.state;

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
            this.props.getPaginatedTasksByOrganizationalUnit(roleId, newCurrentPage, perPage, status, priority, special, name, startDate, endDate);
        };
    }

    nextPage = async (pageTotal) => {
        let { roleId, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore } = this.state;

        let oldCurrentPage = this.state.currentPage;
        await this.setState(state => {
            return {
                ...state,
                currentPage: state.currentPage === pageTotal ? pageTotal : state.currentPage + 1
            }
        })
        let newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== newCurrentPage) {
            this.props.getPaginatedTasksByOrganizationalUnit(roleId, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
        };
    }

    backPage = async () => {
        let { roleId, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore } = this.state;

        let oldCurrentPage = this.state.currentPage;
        await this.setState(state => {
            return {
                ...state,
                currentPage: state.currentPage === 1 ? 1 : state.currentPage - 1
            }
        })
        let newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== newCurrentPage) {
            this.props.getPaginatedTasksByOrganizationalUnit(roleId, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
        };
    }

    handleGetDataPerPage = (perPage) => {
        let { roleId, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore } = this.state;
        
        this.props.getPaginatedTasksByOrganizationalUnit(roleId, 1, perPage, status, priority, special, name, startDate, endDate);

        this.setState(state => {
            return {
                ...state,
                currentPage: 1
            }
        })
    }

    handleUpdateData = () => {
        let { roleId, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, perPage } = this.state;

        this.props.getPaginatedTasksByOrganizationalUnit(roleId, 1, perPage, status, priority, special, name, startDate, endDate);

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

            for (let i in data) {
                data[i] = { ...data[i], action: ["edit"] }
            }
        }

        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">

                        {/* Trạng thái công việc */}
                        <div className="form-group">
                            <label>{translate('task.task_management.status')}</label>
                            <SelectMulti id="multiSelectStatus"
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

                        {/* Độ ưu tiên công việc */}
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

                        {/* Đặc tính công việc */}
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

                        {/* Tên công việc */}
                        <div className="form-group">
                            <label>{translate('task.task_management.name')}</label>
                            <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_name')} name="name" onChange={(e) => this.handleChangeName(e)} />
                        </div>

                        {/* Vai trò */}
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

                        {/* Công việc chưa phân công nhân viên */}
                        <div className="form-group">
                            <label>Phân công công việc</label>
                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                id={`select-task-employee`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    [
                                        { value: 1, text: "Đã sắp xếp nhân viên cho công việc" },
                                        { value: 0, text: "Chưa sắp xếp nhân viên cho công việc" },
                                    ]
                                }
                                onChange={this.handleRoleChange}
                                multiple={false}
                            />
                        </div>

                        {/* Ngày bắt đầu */}
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

                        {/* Ngày kết thúc */}
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
                            }}
                            funcEdit={this.handleShowModal}
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
    getPaginatedTasksByOrganizationalUnit: taskManagementActions.getPaginatedTasksByOrganizationalUnit,
    getDepartment: UserActions.getDepartmentOfUser,
    getAllDepartment: DepartmentActions.get,
};
const translateTaskManagementOfUnit = connect(mapState, actionCreators)(withTranslate(TaskManagementOfUnit));
export { translateTaskManagementOfUnit as TaskManagementOfUnit };

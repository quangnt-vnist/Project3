import React, { Component } from 'react';
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal, ErrorLabel, SelectBox, DatePicker } from '../../../../common-components/';
import { getStorage } from "../../../../config";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { TaskInformationForm } from './taskInformationForm';
import { performTaskAction } from '../redux/actions';
import { TaskFormValidator } from '../../task-management/component/taskFormValidator';
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import Swal from 'sweetalert2'
import { TaskTemplateFormValidator } from '../../task-template/component/taskTemplateFormValidator';
import { taskManagementActions } from '../../task-management/redux/actions';

class ModalEditTaskByAccountableEmployee extends Component {

    constructor(props) {
        super(props);

        let userId = getStorage("userId");

        let { task } = this.props;

        let statusOptions = []; statusOptions.push(task && task.status);
        let priorityOptions = []; priorityOptions.push(task && task.priority);
        let taskName = task && task.name;
        let taskDescription = task && task.description;
        let progress = task && task.progress;
        let formula = task && task.formula;
        let parent = (task && task.parent) ? task.parent._id : "";
        let parentTask = task && task.parent;

        let info = {}, taskInfo = task && task.taskInformations;
        for (let i in taskInfo) {
            if (taskInfo[i].type === "date") {
                if (taskInfo[i].value) {
                    info[`${taskInfo[i].code}`] = {
                        value: this.formatDate(taskInfo[i].value),
                        code: taskInfo[i].code,
                        type: taskInfo[i].type
                    }
                }
                else {
                    info[`${taskInfo[i].code}`] = {
                        value: this.formatDate(Date.now()),
                        code: taskInfo[i].code,
                        type: taskInfo[i].type
                    }
                }
            }
            else if (taskInfo[i].type === "set_of_values") {
                let splitter = taskInfo[i].extra.split('\n');
                if (taskInfo[i].value) {
                    info[`${taskInfo[i].code}`] = {
                        value: [taskInfo[i].value],
                        code: taskInfo[i].code,
                        type: taskInfo[i].type
                    }
                } else {
                    info[`${taskInfo[i].code}`] = {
                        value: [splitter[0]],
                        code: taskInfo[i].code,
                        type: taskInfo[i].type
                    }
                }
            }
            else {
                if (taskInfo[i].value) {
                    info[`${taskInfo[i].code}`] = {
                        value: taskInfo[i].value,
                        code: taskInfo[i].code,
                        type: taskInfo[i].type
                    }
                }
            }
        }

        let responsibleEmployees = task && task.responsibleEmployees.map(employee => { return employee._id });
        let accountableEmployees = task && task.accountableEmployees.map(employee => { return employee._id });
        let consultedEmployees = task && task.consultedEmployees.map(employee => { return employee._id });
        let informedEmployees = task && task.informedEmployees.map(employee => { return employee._id });
        let inactiveEmployees = task && task.inactiveEmployees;
        let listInactive = {};
        for (let i in inactiveEmployees) {
            if (accountableEmployees.indexOf(inactiveEmployees[i]) !== -1) {
                listInactive[`${inactiveEmployees[i]}`] = {
                    value: inactiveEmployees[i],
                    role: 'accountable',
                    checked: true
                }
            }
            else if (responsibleEmployees.indexOf(inactiveEmployees[i]) !== -1) {
                listInactive[`${inactiveEmployees[i]}`] = {
                    value: inactiveEmployees[i],
                    role: 'responsible',
                    checked: true
                }
            }
            else if (consultedEmployees.indexOf(inactiveEmployees[i]) !== -1) {
                listInactive[`${inactiveEmployees[i]}`] = {
                    value: inactiveEmployees[i],
                    role: 'consulted',
                    checked: true
                }
            }
        }

        let startDate = this.formatDate(task.startDate);
        let endDate = this.formatDate(task.endDate);

        this.state = {
            listInactive: listInactive,
            userId: userId,
            task: task,
            info: info,
            taskName: taskName,
            taskDescription: taskDescription,
            statusOptions: statusOptions,
            priorityOptions: priorityOptions,
            progress: progress,
            formula: formula,
            parent: parent,
            parentTask: parentTask,
            startDate: startDate,
            endDate: endDate,
            responsibleEmployees: responsibleEmployees,
            accountableEmployees: accountableEmployees,
            consultedEmployees: consultedEmployees,
            informedEmployees: informedEmployees,
            inactiveEmployees: inactiveEmployees,
            errorInfo: {},
        }
    }


    componentDidMount() {
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        // unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime = false, calledId = null
        this.props.getPaginateTasksByUser([], "1", "5", [], [], [], null, null, null, null, null, false, "listSearch");
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,

                errorOnDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnPoint: undefined,
                errorOnInfoDate: undefined,
                errorOnProgress: undefined,
                errorTaskName: undefined,
                errorTaskDescription: undefined,
                errorOnFormula: undefined,
                errorInfo: {},

            }
        } else {
            return null;
        }
    }

    // Function format ngày hiện tại thành dạnh dd-mm-yyyy
    formatDate = (date) => {
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

    handleChangeProgress = async (e) => {
        let value = parseInt(e.target.value);
        await this.setState(state => {
            return {
                ...state,
                progress: value,
                errorOnProgress: this.validatePoint(value)
            }
        })
    }

    handleChangeNumberInfo = async (e) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        await this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'number'
            }
            state.errorInfo[name] = this.validateNumberInfo(value);
            return {
                ...state,
            }
        })
    }

    handleChangeTextInfo = async (e) => {
        let value = e.target.value;
        let name = e.target.name;
        console.log('name-val', name, value);
        await this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'text'
            }
            state.errorInfo[name] = this.validateTextInfo(value);
            return {
                ...state,
            }
        })
    }

    handleInfoDateChange = (value, code) => {
        console.log('value', value);
        this.setState(state => {
            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'date'
            }
            state.errorInfo[code] = this.validateDate(value);
            return {
                ...state,
            }
        });
    }

    handleSetOfValueChange = async (value, code) => {
        console.log('set', value);

        this.setState(state => {
            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'set_of_values'
            }
            return {
                ...state,
            }
        });
    }

    handleInfoBooleanChange = (event) => {
        let { name, value } = event.target;
        this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'boolean'
            }
            return {
                ...state,
            }
        });
    }


    validateInfoBoolean = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value.indexOf("") !== -1) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }

        return msg;
    }

    validateTextInfo = (value) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value === "") {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    validateNumberInfo = (value) => {
        let { translate } = this.props;
        let msg = undefined;

        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    validateDate = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value.trim() === "") {
            msg = "Ngày đánh giá bắt buộc phải chọn";
        }

        return msg;
    }

    validatePoint = (value) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    changeActiveEmployees = async (listInactive) => {
        let inactiveEmployees = [];
        for (let i in listInactive) {
            if (listInactive[i].checked === true) {
                inactiveEmployees.push(listInactive[i].value);
            }
        }
        await this.setState(state => {
            return {
                ...state,
                inactiveEmployees: inactiveEmployees
            }
        });
    }


    handleChangeActiveAccountable = async (e, id) => {
        let { task } = this.state;
        let target = e.target;
        let { value, name, checked } = target;

        let numOfResponsible = this.state.responsibleEmployees.length;
        let numOfAccountable = this.state.accountableEmployees.length;

        await this.setState(state => {
            state.listInactive[`${id}`] = {
                value: value,
                checked: checked,
                role: 'accountable'
            }
            return {
                ...state,
            }
        });

        let numOfInactiveResp = 0, numOfInactiveAcc = 0, listInactive = this.state.listInactive;

        for (let i in listInactive) {
            if (listInactive[i].checked === true) {
                if (task.responsibleEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveResp = numOfInactiveResp + 1;
                if (task.accountableEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveAcc = numOfInactiveAcc + 1;
            }
        }

        if (numOfAccountable === numOfInactiveAcc) {
            let { translate } = this.props;
            Swal.fire({
                title: translate('task.task_perform.err_has_accountable'),
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('task.task_perform.confirm'),
            }).then((res) => {
                this.setState(state => {
                    state.listInactive[`${id}`] = {
                        value: value,
                        checked: false,
                        role: 'accountable'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
        else if (numOfInactiveResp === numOfResponsible) {
            let { translate } = this.props;
            Swal.fire({
                title: translate('task.task_perform.err_has_responsible'),
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('task.task_perform.confirm'),
            }).then((res) => {
                this.setState(state => {
                    state.listInactive[`${id}`] = {
                        value: value,
                        checked: false,
                        role: 'accountable'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
    }

    handleChangeActiveResponsible = async (e, id) => {
        let { task } = this.state;
        let target = e.target;
        let { value, name, checked } = target;

        let numOfResponsible = task.responsibleEmployees.length;
        let numOfAccountable = task.accountableEmployees.length;

        await this.setState(state => {
            state.listInactive[`${id}`] = {
                value: value,
                checked: checked,
                role: 'responsible'
            }
            return {
                ...state,
            }
        });

        let numOfInactiveResp = 0, numOfInactiveAcc = 0, listInactive = this.state.listInactive;

        for (let i in listInactive) {
            if (listInactive[i].checked === true) {
                if (task.responsibleEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveResp = numOfInactiveResp + 1;
                if (task.accountableEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveAcc = numOfInactiveAcc + 1;
            }
        }

        if (numOfInactiveResp === numOfResponsible) {
            let { translate } = this.props;
            Swal.fire({
                title: translate('task.task_perform.err_has_responsible'),
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('task.task_perform.confirm'),
            }).then((res) => {
                this.setState(state => {
                    state.listInactive[`${id}`] = {
                        value: value,
                        checked: false,
                        role: 'responsible'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
        else if (numOfAccountable === numOfInactiveAcc) {
            let { translate } = this.props;
            Swal.fire({
                title: translate('task.task_perform.err_has_accountable'),
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('task.task_perform.confirm'),
            }).then((res) => {
                this.setState(state => {
                    state.listInactive[`${id}`] = {
                        value: value,
                        checked: false,
                        role: 'responsible'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
    }

    handleChangeActiveConsulted = async (e, id) => {
        let { task } = this.state;
        let target = e.target;
        let { value, name, checked } = target;

        let numOfResponsible = this.state.responsibleEmployees.length;
        let numOfAccountable = this.state.accountableEmployees.length;

        await this.setState(state => {
            state.listInactive[`${id}`] = {
                value: value,
                checked: checked,
                role: 'consulted'
            }
            return {
                ...state,
            }
        });

        let numOfInactiveResp = 0, numOfInactiveAcc = 0, listInactive = this.state.listInactive;

        for (let i in listInactive) {
            if (listInactive[i].checked === true) {
                if (task.responsibleEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveResp = numOfInactiveResp + 1;
                if (task.accountableEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveAcc = numOfInactiveAcc + 1;
            }
        }

        if (numOfAccountable === numOfInactiveAcc) {
            let { translate } = this.props;
            Swal.fire({
                title: translate('task.task_perform.err_has_accountable'),
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('task.task_perform.confirm'),
            }).then((res) => {
                numOfInactiveResp = numOfInactiveResp - 1;
                numOfInactiveAcc = numOfInactiveAcc - 1;
                this.setState(state => {
                    state.listInactive[`${id}`] = {
                        value: value,
                        checked: false,
                        role: 'consulted'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
        else if (numOfInactiveResp === numOfResponsible) {
            let { translate } = this.props;
            Swal.fire({
                title: translate('task.task_perform.err_has_responsible'),
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('task.task_perform.confirm'),
            }).then((res) => {
                numOfInactiveResp = numOfInactiveResp - 1;
                numOfInactiveAcc = numOfInactiveAcc - 1;
                this.setState(state => {
                    state.listInactive[`${id}`] = {
                        value: value,
                        checked: false,
                        role: 'consulted'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
    }

    handleTaskNameChange = event => {
        let value = event.target.value;
        this.validateTaskName(value, true);
    }

    validateTaskName = (value, willUpdateState) => {
        let { translate } = this.props;
        let errorMessage = undefined;
        if (value === "") {
            errorMessage = translate('task.task_perform.modal_approve_task.err_empty');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    taskName: value,
                    errorTaskName: errorMessage
                }
            })
        }
        return errorMessage === undefined;
    }

    handleTaskDescriptionChange = event => {
        let value = event.target.value;
        this.validateTaskDescription(value, true);
    }

    validateTaskDescription = (value, willUpdateState) => {
        let { translate } = this.props;
        let errorMessage = undefined;
        if (value === "") {
            errorMessage = translate('task.task_perform.modal_approve_task.err_empty');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    taskDescription: value,
                    errorTaskDescription: errorMessage,
                }
            })
        }
        return errorMessage === undefined;
    }


    handleChangeTaskStartDate = (value) => {
        this.validateTaskStartDate(value, true);
    }
    validateTaskStartDate = (value, willUpdateState = true) => {
        let msg = TaskFormValidator.validateTaskStartDate(value, this.state.endDate, this.props.translate);

        if (willUpdateState) {
            this.state.startDate = value;
            this.state.errorOnStartDate = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msg === undefined;
    }

    handleChangeTaskEndDate = (value) => {
        this.validateTaskEndDate(value, true);
    }
    validateTaskEndDate = (value, willUpdateState = true) => {
        let msg = TaskFormValidator.validateTaskEndDate(this.state.startDate, value, this.props.translate);

        if (willUpdateState) {
            this.state.endDate = value;
            this.state.errorOnEndDate = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msg === undefined;
    }

    handleChangeTaskFormula = (event) => {
        let value = event.target.value;
        this.validateFormula(value, true);
    }

    validateFormula = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value);

        if (willUpdateState) {
            this.state.formula = value;
            this.state.errorOnFormula = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msg === undefined;
    }

    handleTaskProgressChange = event => {
        let value = event.target.value;
        this.validateTaskProgress(value, true);
    }

    validateTaskProgress = (value, willUpdateState) => {
        let { translate } = this.props;
        let errorMessage = undefined;
        if (value === "") {
            errorMessage = translate('task.task_perform.modal_approve_task.err_empty');
        }
        if (value !== undefined && isNaN(value)) {
            errorMessage = translate('task.task_perform.err_nan');
        }
        if (value < 0 || value > 100) {
            errorMessage = translate('task.task_perform.modal_approve_task.err_range');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    taskProgress: value,
                    errorTaskProgress: errorMessage,
                }
            })
        }
        return errorMessage === undefined;
    }

    isFormValidated = () => {
        let { info, errorInfo } = this.state;
        let check = true;
        if (Object.keys(errorInfo).length !== 0) {
            for (let i in errorInfo) {
                if (errorInfo[i]) {
                    check = false;
                    return;
                }
            }
        }
        // check &&
        return this.validateTaskName(this.state.taskName, false)
            && this.validateTaskDescription(this.state.taskDescription, false)
            && (this.state.errorOnProgress === undefined && this.state.errorOnEndDate === undefined && this.state.errorOnStartDate === undefined && check);
    }

    onSearch = async (txt) => {

        await this.props.getPaginateTasksByUser([], "1", "5", [], [], [], txt, null, null, null, null, false, "listSearch");

        await this.setState(state => {
            return {
                ...state,
                parent: state.parentTask ? state.parentTask._id : "",
            }
        })
        console.log('abpernt', this.state.parent);
    }

    handleSelectedPriority = (value) => {
        this.setState(state => {
            return {
                ...state,
                priorityOptions: value
            }
        });
    }

    handleSelectedStatus = (value) => {
        this.setState(state => {
            return {
                ...state,
                statusOptions: value
            }
        })
    }

    handleSelectedParent = async (value) => {
        let val = value[0];

        await this.setState(state => {
            return {
                ...state,
                parent: val,
            }
        })
        console.log('ppppp', value, this.state.parent);
    }

    handleSelectedResponsibleEmployee = (value) => {
        this.setState(state => {
            return {
                ...state,
                responsibleEmployees: value
            }
        });
    }
    handleSelectedAccountableEmployee = (value) => {
        this.setState(state => {
            return {
                ...state,
                accountableEmployees: value
            }
        });
    }
    handleSelectedConsultedEmployee = (value) => {
        this.setState(state => {
            return {
                ...state,
                consultedEmployees: value
            }
        });
    }
    handleSelectedInformEmployee = (value) => {
        this.setState(state => {
            return {
                ...state,
                informedEmployees: value
            }
        });
    }

    handleAddTaskLog = (inactiveEmployees) => {
        let currentTask = this.state.task;
        let { taskName, taskDescription, statusOptions, priorityOptions, progress, responsibleEmployees, accountableEmployees, consultedEmployees, informedEmployees } = this.state;

        let title = '';
        let description = '';

        if (taskName !== currentTask.name || taskDescription !== currentTask.description) {
            title = title + 'Chỉnh sửa thông tin cơ bản';

            if (taskName !== currentTask.name) {
                description = description + 'Tên công việc mới: ' + taskName;
            }

            if (taskDescription !== currentTask.description) {
                description = description === '' ? description + 'Mô tả công việc mới: ' + taskDescription : description + '. ' + 'Mô tả công việc mới: ' + taskDescription;
            }
        }

        if (statusOptions[0] !== currentTask.status ||
            priorityOptions[0] !== currentTask.priority ||
            JSON.stringify(responsibleEmployees) !== JSON.stringify(currentTask.responsibleEmployees.map(employee => { return employee._id })) ||
            JSON.stringify(accountableEmployees) !== JSON.stringify(currentTask.accountableEmployees.map(employee => { return employee._id })) ||
            JSON.stringify(consultedEmployees) !== JSON.stringify(currentTask.consultedEmployees.map(employee => { return employee._id })) ||
            JSON.stringify(informedEmployees) !== JSON.stringify(currentTask.informedEmployees.map(employee => { return employee._id })) ||
            JSON.stringify(inactiveEmployees) !== JSON.stringify(currentTask.inactiveEmployees.map(employee => { return employee._id }))
        ) {
            const { user } = this.props;
            let usercompanys;
            if (user.usercompanys) usercompanys = user.usercompanys;

            title = title === '' ? title + 'Chỉnh sửa thông tin chi tiết' : title + '. ' + 'Chỉnh sửa thông tin chi tiết';

            if (statusOptions[0] !== currentTask.status) {
                description = description === '' ? description + 'Trạng thái công việc mới: ' + this.formatStatus(statusOptions[0]) : description + '. ' + 'Trạng thái công việc mới: ' + this.formatStatus(statusOptions[0]);
            }

            if (priorityOptions[0] !== currentTask.priority) {
                description = description === '' ? description + 'Mức độ ưu tiên mới: ' + this.formatPriority(parseInt(priorityOptions[0])) : description + '. ' + 'Mức độ ưu tiên mới: ' + this.formatPriority(parseInt(priorityOptions[0]));
            }

            if (JSON.stringify(responsibleEmployees) !== JSON.stringify(currentTask.responsibleEmployees.map(employee => { return employee._id }))) {
                let responsibleEmployeesArr = [];
                for (const element of responsibleEmployees) {
                    let a = usercompanys.filter(item => item._id === element);
                    responsibleEmployeesArr.push(a[0].name)
                }
                description = description === '' ? description + 'Những người thực hiện công việc mới: ' + JSON.stringify(responsibleEmployeesArr) : description + '. ' + 'Những người thực hiện công việc mới: ' + JSON.stringify(responsibleEmployeesArr);
            }

            if (JSON.stringify(accountableEmployees) !== JSON.stringify(currentTask.accountableEmployees.map(employee => { return employee._id }))) {
                let accountableEmployeesArr = [];
                for (const element of accountableEmployees) {
                    let a = usercompanys.filter(item => item._id === element);
                    accountableEmployeesArr.push(a[0].name)
                }
                description = description === '' ? description + 'Những người phê duyệt công việc mới: ' + JSON.stringify(accountableEmployeesArr) : description + '. ' + 'Những người phê duyệt công việc mới: ' + JSON.stringify(accountableEmployeesArr);
            }

            if (JSON.stringify(consultedEmployees) !== JSON.stringify(currentTask.consultedEmployees.map(employee => { return employee._id }))) {
                let consultedEmployeesArr = [];
                for (const element of consultedEmployees) {
                    let a = usercompanys.filter(item => item._id === element);
                    consultedEmployeesArr.push(a[0].name)
                }
                description = description === '' ? description + 'Những người tư vấn công việc mới: ' + JSON.stringify(consultedEmployeesArr) : description + '. ' + 'Những người tư vấn công việc mới: ' + JSON.stringify(consultedEmployeesArr);
            }

            if (JSON.stringify(informedEmployees) !== JSON.stringify(currentTask.informedEmployees.map(employee => { return employee._id }))) {
                let informedEmployeesArr = [];
                for (const element of informedEmployees) {
                    let a = usercompanys.filter(item => item._id === element);
                    informedEmployeesArr.push(a[0].name)
                }
                description = description === '' ? description + 'Những người quan sát công việc mới: ' + JSON.stringify(informedEmployeesArr) : description + '. ' + 'Những người quan sát công việc mới: ' + JSON.stringify(informedEmployeesArr);
            }

            if (JSON.stringify(inactiveEmployees) !== JSON.stringify(currentTask.inactiveEmployees.map(employee => { return employee._id }))) {
                let inactiveEmployeesArr = [];
                for (const element of inactiveEmployees) {
                    let a = usercompanys.filter(item => item._id === element);
                    inactiveEmployeesArr.push(a[0].name)
                }
                description = description === '' ? description + 'Những người không tham giá công việc nữa: ' + JSON.stringify(inactiveEmployeesArr) : description + '. ' + 'Những người không tham giá công việc nữa: ' + JSON.stringify(inactiveEmployeesArr);
            }
        }
        if (progress !== currentTask.progress) {
            title = title === '' ? title + 'Chỉnh sửa thông tin đánh giá công việc tháng này' : title + '. ' + 'Chỉnh sửa thông tin đánh giá công việc tháng này';
            description = description === '' ? description + 'Mức độ hoàn thành mới: ' + progress + "%" : description + '. ' + 'Mức độ hoàn thành mới: ' + progress + "%";
        }

        if (title !== '' || description !== '') {
            this.props.addTaskLog({
                createdAt: Date.now(),

                creator: getStorage("userId"),
                title: title,
                description: description,
            }, currentTask._id)
        }
    }

    save = () => {
        let listInactive = this.state.listInactive, taskId, inactiveEmployees = [];
        taskId = this.props.id;
        for (let i in listInactive) {
            if (listInactive[i].checked !== undefined && listInactive[i].checked === true) {
                inactiveEmployees.push(listInactive[i].value);
            }
        }
        let data = {
            name: this.state.taskName,
            description: this.state.taskDescription,
            status: this.state.statusOptions,
            priority: this.state.priorityOptions,
            formula: this.state.formula,
            parent: this.state.parent,
            user: this.state.userId,
            progress: this.state.progress,
            date: this.formatDate(Date.now()),

            startDate: this.state.startDate,
            endDate: this.state.endDate,

            accountableEmployees: this.state.accountableEmployees,
            consultedEmployees: this.state.consultedEmployees,
            responsibleEmployees: this.state.responsibleEmployees,
            informedEmployees: this.state.informedEmployees,
            inactiveEmployees: inactiveEmployees,

            info: this.state.info,
        }
        console.log('data', data);
        this.props.editTaskByAccountableEmployees(data, taskId);

        this.handleAddTaskLog(inactiveEmployees);
    }

    formatPriority = (data) => {
        const { translate } = this.props;
        if (data === 1) return translate('task.task_management.low');
        if (data === 2) return translate('task.task_management.normal');
        if (data === 3) return translate('task.task_management.high');
    }

    formatRole = (data) => {
        const { translate } = this.props;
        if (data === "consulted") return translate('task.task_management.consulted');
        if (data === "accountable") return translate('task.task_management.accountable');
        if (data === "responsible") return translate('task.task_management.responsible');
    }

    formatStatus = (data) => {
        const { translate } = this.props;
        if (data === "inprocess") return translate('task.task_management.inprocess');
        else if (data === "wait_for_approval") return translate('task.task_management.wait_for_approval');
        else if (data === "finished") return translate('task.task_management.finished');
        else if (data === "delayed") return translate('task.task_management.delayed');
        else if (data === "canceled") return translate('task.task_management.canceled');
    }

    render() {

        const { user, tasktemplates, translate } = this.props;
        const { task, errorOnEndDate, errorOnStartDate, errorTaskName, errorTaskDescription, errorOnFormula, taskName, taskDescription, statusOptions, priorityOptions,
            startDate, endDate, formula, responsibleEmployees, accountableEmployees, consultedEmployees, informedEmployees, inactiveEmployees, parent, parentTask
        } = this.state;

        const { tasks, perform, id, role, title, hasAccountable } = this.props;

        let departmentUsers, usercompanys;
        if (user.userdepartments) departmentUsers = user.userdepartments;
        if (user.usercompanys) usercompanys = user.usercompanys;

        // list công việc cha.
        let listParentTask = [{ value: "", text: `--${translate('task.task_management.add_parent_task')}--` }];

        if (tasks.listSearchTasks) {
            let arr = tasks.listSearchTasks.map(x => { return { value: x._id, text: x.name } });

            if (parentTask) {
                // kiểm tra parent cũ có trong list search hay không
                let hasParentItem = arr.find(e => e.value === parentTask._id);

                //không có parent trong arr
                !hasParentItem && listParentTask.unshift({ value: parentTask._id, text: parentTask.name })
                console.log('arr', arr);
                for (let i in arr) {
                    if (arr[i].value === parentTask._id) {
                        listParentTask.unshift({ value: parentTask._id, text: parentTask.name })
                    }
                    else listParentTask.push({ value: arr[i].value, text: arr[i].text })
                }
            }
            else {
                listParentTask = [...listParentTask, ...arr];
            }
        }


        let priorityArr = [
            { value: 1, text: translate('task.task_management.low') },
            { value: 2, text: translate('task.task_management.normal') },
            { value: 3, text: translate('task.task_management.high') }
        ];
        let statusArr = [
            { value: "inprocess", text: translate('task.task_management.inprocess') },
            { value: "wait_for_approval", text: translate('task.task_management.wait_for_approval') },
            { value: "finished", text: translate('task.task_management.finished') },
            { value: "delayed", text: translate('task.task_management.delayed') },
            { value: "canceled", text: translate('task.task_management.canceled') }
        ];

        let usersOfChildrenOrganizationalUnit;
        if (user && user.usersOfChildrenOrganizationalUnit) {
            usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
        }
        let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);

        return (
            <div>
                <React.Fragment>
                    <DialogModal
                        size={75}
                        maxWidth={750}
                        modalID={hasAccountable ? `modal-edit-task-by-${role}-${id}` : `modal-edit-task-by-${role}-${id}-has-not-accountable`}
                        formID={`form-edit-task-${role}-${id}`}
                        title={title}
                        isLoading={false}
                        func={this.save}
                        disableSubmit={!this.isFormValidated()}
                    >
                        <form id={`form-edit-task-${role}-${id}`}>
                            {/*Thông tin cơ bản*/}
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('task.task_management.edit_basic_info')}</legend>
                                <div>
                                    <div className={`form-group ${errorTaskName === undefined ? "" : "has-error"}`}>
                                        <label>{translate('task.task_management.name')}<span className="text-red">*</span></label>
                                        <input type="text"
                                            value={taskName}
                                            className="form-control" onChange={this.handleTaskNameChange} />
                                        <ErrorLabel content={errorTaskName} />
                                    </div>
                                    <div
                                        className={`form-group ${errorTaskDescription === undefined ? "" : "has-error"}`}>
                                        <label>{translate('task.task_management.detail_description')}<span className="text-red">*</span></label>
                                        <textarea
                                            rows="4"
                                            value={taskDescription}
                                            className="form-control" onChange={this.handleTaskDescriptionChange} />
                                        <ErrorLabel content={errorTaskDescription} />
                                    </div>
                                    <div className="form-group">
                                        <label>{translate('task.task_management.add_parent_task')}</label>
                                        <SelectBox
                                            id={`select-parent-${perform}-${role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={listParentTask}
                                            multiple={false}
                                            value={parent}
                                            onChange={this.handleSelectedParent}
                                            onSearch={this.onSearch}
                                        />
                                    </div>
                                </div>
                            </fieldset>

                            {/*Thông tin chi tiết*/}
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('task.task_management.edit_detail_info')}</legend>
                                <div>
                                    <div className="form-group">
                                        <label>{translate('task.task_management.detail_status')}</label>
                                        {
                                            <SelectBox
                                                id={`select-status-${perform}-${role}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={statusArr}
                                                multiple={false}
                                                value={statusOptions[0]}
                                                onChange={this.handleSelectedStatus}
                                            />
                                        }
                                    </div>

                                    {/*Mức ưu tiên*/}
                                    <div className="form-group">
                                        <label>{translate('task.task_management.detail_priority')}</label>
                                        {
                                            <SelectBox
                                                id={`select-priority-${perform}-${role}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={priorityArr}
                                                multiple={false}
                                                value={priorityOptions[0]}
                                                onChange={this.handleSelectedPriority}
                                            />
                                        }
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                        <label className="control-label">{translate('task.task_management.start_date')}*</label>
                                        <DatePicker
                                            id={`datepicker2-startdate-${id}`}
                                            value={startDate}
                                            onChange={this.handleChangeTaskStartDate}
                                        />
                                        <ErrorLabel content={errorOnStartDate} />
                                    </div>
                                    <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                        <label className="control-label">{translate('task.task_management.end_date')}*</label>
                                        <DatePicker
                                            id={`datepicker2-enddate-${id}`}
                                            value={endDate}
                                            onChange={this.handleChangeTaskEndDate}
                                        />
                                        <ErrorLabel content={errorOnEndDate} />
                                    </div>
                                </div>
                                {/**Công thức tính của mẫu công việc */}
                                <div className={` form-group ${errorOnFormula === undefined ? "" : "has-error"}`} >
                                    <label className="control-label" htmlFor="inputFormula">{translate('task_template.formula')}*</label>
                                    <input type="text" className="form-control" id="inputFormula" placeholder="progress/(dayUsed/totalDay) - (10-averageActionRating)*10 - 100*(1-p1/p2)"
                                        value={formula} onChange={this.handleChangeTaskFormula}
                                    />
                                    <ErrorLabel content={errorOnFormula} />

                                    <br />
                                    <div><span style={{ fontWeight: 800 }}>Ví dụ: </span>progress/(dayUsed/totalDay) - (10-averageActionRating)*10</div>
                                    <br />
                                    <div><span style={{ fontWeight: 800 }}>{translate('task_template.parameters')}:</span></div>
                                    <div><span style={{ fontWeight: 600 }}>overdueDate</span> - Thời gian quá hạn (ngày)</div>
                                    <div><span style={{ fontWeight: 600 }}>dayUsed</span> - Thời gian làm việc tính đến ngày đánh giá (ngày)</div>
                                    <div><span style={{ fontWeight: 600 }}>totalDay</span> - Thời gian từ ngày bắt đầu đến ngày kết thúc công việc (ngày)</div>
                                    <div><span style={{ fontWeight: 600 }}>averageActionRating</span> -  Trung bình cộng điểm đánh giá hoạt động (1-10)</div>
                                    <div><span style={{ fontWeight: 600 }}>progress</span> - % Tiến độ công việc (0-100)</div>
                                    <div><span style={{ fontWeight: 600 }}>p1, p2,...</span> - Thông tin công việc kiểu số (Chỉ có với các công việc theo mẫu)</div>
                                </div>
                            </fieldset>

                            <TaskInformationForm
                                task={task && task}

                                handleChangeProgress={this.handleChangeProgress}
                                handleInfoBooleanChange={this.handleInfoBooleanChange}
                                handleInfoDateChange={this.handleInfoDateChange}
                                handleSetOfValueChange={this.handleSetOfValueChange}
                                handleChangeNumberInfo={this.handleChangeNumberInfo}
                                handleChangeTextInfo={this.handleChangeTextInfo}

                                role={role}
                                perform={perform}
                                value={this.state}
                            />
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('task.task_management.edit_member_info')}</legend>

                                {/*Người thực hiện*/}
                                <div className="form-group">
                                    <label>{translate('task.task_management.responsible')}</label>
                                    {unitMembers &&
                                        <SelectBox
                                            id={`select-responsible-employee-${perform}-${role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={unitMembers}
                                            onChange={this.handleSelectedResponsibleEmployee}
                                            multiple={true}
                                            value={responsibleEmployees}
                                        />
                                    }
                                </div>

                                {/*Người phê duyệt*/}
                                <div className="form-group">
                                    <label>{translate('task.task_management.accountable')}</label>
                                    {unitMembers &&
                                        <SelectBox
                                            id={`select-accountable-employee-${perform}-${role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={unitMembers}
                                            onChange={this.handleSelectedAccountableEmployee}
                                            multiple={true}
                                            value={accountableEmployees}
                                        />
                                    }
                                </div>

                                {/*Người tư vấn */}
                                <div className="form-group">
                                    <label>{translate('task.task_management.consulted')}</label>
                                    {usercompanys &&
                                        <SelectBox
                                            id={`select-consulted-employee-${perform}-${role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={
                                                usercompanys.map(x => {
                                                    return { value: x._id, text: x.name };
                                                })
                                            }
                                            onChange={this.handleSelectedConsultedEmployee}
                                            multiple={true}
                                            value={consultedEmployees}
                                        />
                                    }
                                </div>

                                {/*Người giám sát*/}
                                <div className="form-group">
                                    <label>{translate('task.task_management.informed')}</label>
                                    {usercompanys &&
                                        <SelectBox
                                            id={`select-informed-employee-${perform}-${role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={
                                                usercompanys.map(x => {
                                                    return { value: x._id, text: x.name };
                                                })
                                            }
                                            onChange={this.handleSelectedInformEmployee}
                                            multiple={true}
                                            value={informedEmployees}
                                        />
                                    }
                                </div>
                            </fieldset>


                            {/* Thành viên rời khỏi công việc */}
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('task.task_management.edit_inactive_emp')}</legend>
                                <div className="form-group">

                                    <div>
                                        {/* Thành viên phê duyệt */}
                                        <div style={{ marginBottom: 15 }}>
                                            <div style={{ marginBottom: 5 }}><strong>{translate('task.task_management.accountable')}</strong></div>
                                            {
                                                task.accountableEmployees.map((elem, index) => {
                                                    return <div key={index} style={{ paddingLeft: 20 }}>
                                                        <label style={{ fontWeight: "normal", margin: "7px 0px" }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={this.state.listInactive[`${elem._id}`] && this.state.listInactive[`${elem._id}`].checked === true}
                                                                value={elem._id}
                                                                name="accountable" onChange={(e) => this.handleChangeActiveAccountable(e, elem._id)}
                                                            />&nbsp;&nbsp;&nbsp;{elem.name}
                                                        </label>
                                                    </div>
                                                })
                                            }
                                        </div>

                                        <div style={{ marginBottom: 15 }}>
                                            <div style={{ marginBottom: 5 }}><strong>{translate('task.task_management.responsible')}</strong></div>
                                            {
                                                task.responsibleEmployees.map((elem, index) => {
                                                    return <div key={index} style={{ paddingLeft: 20 }}>
                                                        <label style={{ fontWeight: "normal", margin: "7px 0px" }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={this.state.listInactive[`${elem._id}`] && this.state.listInactive[`${elem._id}`].checked === true}
                                                                value={elem._id}
                                                                name="responsible" onChange={(e) => this.handleChangeActiveResponsible(e, elem._id)}
                                                            />&nbsp;&nbsp;&nbsp;{elem.name}
                                                        </label>
                                                        <br />
                                                    </div>
                                                })
                                            }
                                        </div>

                                        {task.consultedEmployees.length !== 0 &&
                                            <div>
                                                <div style={{ marginBottom: 5 }}><strong>{translate('task.task_management.consulted')}</strong></div>
                                                {
                                                    task.consultedEmployees.map((elem, key) => {
                                                        return <div key={key} style={{ paddingLeft: 20 }}>
                                                            <label style={{ fontWeight: "normal", margin: "7px 0px" }}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={this.state.listInactive[`${elem._id}`] && this.state.listInactive[`${elem._id}`].checked === true}
                                                                    value={elem._id}
                                                                    name="consulted" onChange={(e) => this.handleChangeActiveConsulted(e, elem._id)}
                                                                />&nbsp;&nbsp;&nbsp;{elem.name}
                                                            </label>
                                                            <br />
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        }
                                    </div>
                                </div>
                            </fieldset>
                        </form>
                    </DialogModal>
                </React.Fragment>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { tasks, user, tasktemplates, performtasks } = state;
    return { tasks, user, tasktemplates, performtasks };
}

const actionGetState = { //dispatchActionToProps
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    editTaskByAccountableEmployees: performTaskAction.editTaskByAccountableEmployees,
    addTaskLog: performTaskAction.addTaskLog,
    getPaginateTasksByUser: taskManagementActions.getPaginateTasksByUser,
}

const modalEditTaskByAccountableEmployee = connect(mapStateToProps, actionGetState)(withTranslate(ModalEditTaskByAccountableEmployee));
export { modalEditTaskByAccountableEmployee as ModalEditTaskByAccountableEmployee };

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getStorage } from '../../../../../config';

import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../../../task-template/redux/actions';

import { SelectBox, ErrorLabel, DatePicker } from '../../../../../common-components';

import { TaskTemplateFormValidator } from '../../../task-template/component/taskTemplateFormValidator';
import getEmployeeSelectBoxItems from '../../../organizationalUnitHelper';
import './../../../task-template/component/tasktemplate.css';
import { TaskFormValidator } from '../../../task-management/component/taskFormValidator';

class FormCreateTaskByProcess extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentRole: localStorage.getItem('currentRole'),
            taskItem: {
                organizationalUnit: '',
                name: '',
                responsibleEmployees: [],
                accountableEmployees: [],
                consultedEmployees: [],
                informedEmployees: [],
                description: '',
                startDate: '',
                endDate: '',
                numberOfDaysTaken: '',
                priority: 3,
                preceedingTasks: [],
                followingTasks: [],
                formula: '',
            },

        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // get department of current user 
        this.props.getDepartment();
        // lấy tất cả nhân viên của công ty
        this.props.getAllUserOfCompany();
        // Lấy tất cả vai trò cùng phòng ban
        this.props.getRoleSameDepartment(localStorage.getItem("currentRole"));
        // Lấy tất cả các role là dean 
        this.props.getDepartmentsThatUserIsDean();
        // Lấy tất cả nhân viên trong công ty
        this.props.getAllUserInAllUnitsOfCompany();
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.taskTemplateId !== prevState.taskTemplateId) {
            return {
                ...prevState,
                taskTemplate: nextProps.taskTemplate,
                errorOnName: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnDescription: undefined,
                errorOnRead: undefined,
                errorOnFormula: undefined,
                errorOnUnit: undefined,
                showActionForm: undefined
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        const { department } = this.props;
        const { taskItem } = this.state;
        if (nextProps.isProcess && nextProps.id !== this.state.id) {
            let { info, listOrganizationalUnit } = nextProps;

            this.setState(state => {
                return {
                    id: nextProps.id,
                    taskItem: {
                        numberOfDaysTaken: (info && info.numberOfDaysTaken) ? info.numberOfDaysTaken : null,
                        // code: (info && info.code) ? info.code : "",
                        startDate: (info && info.startDate) ? info.startDate : nextProps.startDate,
                        endDate: (info && info.endDate) ? info.endDate : nextProps.endDate,
                        organizationalUnit: (info && info.organizationalUnit) ? info.organizationalUnit._id : [],
                        name: (info && info.name) ? info.name : '',
                        responsibleEmployees: (info && info.responsibleEmployees) ? info.responsibleEmployees.map(x => x?._id) : [],
                        accountableEmployees: (info && info.accountableEmployees) ? info.accountableEmployees.map(x => x?._id) : [],
                        consultedEmployees: (info && info.consultedEmployees) ? info.consultedEmployees.map(x => x?._id) : [],
                        informedEmployees: (info && info.informedEmployees) ? info.informedEmployees.map(x => x?._id) : [],
                        description: (info && info.description) ? info.description : '',
                        creator: (info && info.creator) ? info.creator._id : getStorage("userId"),
                        formula: (info && info.formula) ? info.formula : '',
                        priority: (info && info.priority) ? info.priority : 3,
                        taskActions: (info && info.taskActions) ? info.taskActions : [],
                        taskInformations: (info && info.taskInformations) ? info.taskInformations : [],
                        followingTasks: (info && info.followingTasks) ? info.followingTasks : [],
                        preceedingTasks: (info && info.preceedingTasks) ? info.preceedingTasks : [],
                    },
                    showMore: this.props.isProcess ? false : true,
                    showActionForm: true,
                }
            })
            this.props.getDepartment();
            let { user } = this.props;
            let defaultUnit;
            if (user && user.organizationalUnitsOfUser) defaultUnit = user.organizationalUnitsOfUser.find(item =>
                item.dean === this.state.currentRole
                || item.viceDean === this.state.currentRole
                || item.employee === this.state.currentRole);
            if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
                // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
                defaultUnit = user.organizationalUnitsOfUser[0]
            }
            this.props.getChildrenOfOrganizationalUnits(defaultUnit && defaultUnit._id);
            return false;
        }

        // Khi truy vấn lấy các đơn vị mà user là dean đã có kết quả, và thuộc tính đơn vị của newTemplate chưa được thiết lập
        if (taskItem.organizationalUnit === "" && department.departmentsThatUserIsDean) {
            // Tìm unit mà currentRole của user đang thuộc về
            let defaultUnit = department.departmentsThatUserIsDean.find(item =>
                item.deans.includes(this.state.currentRole)
                || item.viceDeans.includes(this.state.currentRole)
                || item.employees.includes(this.state.currentRole
                ));

            if (defaultUnit) {
                this.setState(state => {
                    return {
                        ...state,
                        taskItem: {
                            ...this.state.newTemplate,
                            organizationalUnit: defaultUnit._id
                        }
                    };
                });

                this.props.getChildrenOfOrganizationalUnits(defaultUnit._id);
                return false; // Sẽ cập nhật lại state nên không cần render
            }
        }
        return true;
    }

    /**Gửi req sửa mẫu công việc này */
    handleSubmit = async (event) => {
        const { taskItem } = this.state;

        this.props.editTaskTemplate(taskItem._id, taskItem);
    }

    /**
     * Xử lý form lớn tasktemplate
     */
    isTaskTemplateFormValidated = () => {
        if (!this.state.taskItem._id)
            return false;
        let result =
            this.validateTaskTemplateRead(this.state.taskItem.readByEmployees, false) &&
            this.validateTaskTemplateName(this.state.taskItem.name, false) &&
            this.validateTaskTemplateDesc(this.state.taskItem.description, false) &&
            this.validateTaskTemplateFormula(this.state.taskItem.formula, false) &&
            this.validateTaskTemplateUnit(this.state.taskItem.organizationalUnit, false);
        return result;
    }
    handleTaskTemplateName = (event) => {
        let value = event.target.value;
        this.validateTaskTemplateName(value, true);
    }
    validateTaskTemplateName = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateName(value);

        if (willUpdateState) {
            this.state.taskItem.name = value;
            this.state.taskItem.errorOnName = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        this.props.handleChangeName(value);
        this.props.onChangeTemplateData(this.state.taskItem);
        return msg == undefined;
    }

    handleTaskTemplateDesc = (event) => {
        let value = event.target.value;
        this.validateTaskTemplateDesc(value, true);
    }
    validateTaskTemplateDesc = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateDescription(value);

        if (willUpdateState) {
            this.state.taskItem.description = value;
            this.state.taskItem.errorOnDescription = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        this.props.onChangeTemplateData(this.state.taskItem);
        return msg == undefined;
    }

    handleChangeTaskPriority = (event) => {
        this.state.taskItem.priority = event.target.value;
        this.setState(state => {
            return {
                ...state,
            };
        });
        this.props.onChangeTemplateData(this.state.taskItem);
    }
    handleTaskTemplateUnit = (value) => {
        let singleValue = value[0]; // SelectBox một lựa chọn
        if (this.validateTaskTemplateUnit(singleValue, true)) {
            const { department } = this.props;

            if (department !== undefined && department.departmentsThatUserIsDean !== undefined) {
                // Khi đổi department, cần lấy lại dữ liệu cho các selectbox (ai được xem, các vai trò)
                let dept = department.departmentsThatUserIsDean.find(item => item._id === singleValue);
                if (dept) {
                    this.props.getChildrenOfOrganizationalUnits(singleValue);
                    this.props.getRoleSameDepartment(dept.dean);
                }
            }
        }
    }
    validateTaskTemplateUnit = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateUnit(value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    taskItem: { // update lại unit, và reset các selection phía sau
                        ...this.state.taskItem,
                        organizationalUnit: value,
                        errorOnUnit: msg,
                        readByEmployees: [],
                        responsibleEmployees: [],
                        accountableEmployees: [],
                        consultedEmployees: [],
                        informedEmployees: [],
                    }
                };
            });
        }
        this.props.onChangeTemplateData(this.state.taskItem);
        return msg == undefined;
    }

    handleTaskTemplateResponsible = (value) => {
        this.state.taskItem.responsibleEmployees = value;

        this.setState(state => {
            return {
                ...state,
            };
        });
        this.props.handleChangeResponsible(value);
        this.props.onChangeTemplateData(this.state.taskItem);
    }
    handleTaskTemplateAccountable = (value) => {
        this.state.taskItem.accountableEmployees = value;
        this.setState(state => {
            return {
                ...state,
            };
        });
        this.props.handleChangeAccountable(value);
        this.props.onChangeTemplateData(this.state.taskItem);
    }
    handleTaskTemplateConsult = (value) => {
        this.state.taskItem.consultedEmployees = value;
        this.setState(state => {
            return {
                ...state,
            };
        });
        this.props.onChangeTemplateData(this.state.taskItem);
    }
    handleTaskTemplateInform = (value) => {
        this.state.taskItem.informedEmployees = value;

        this.setState(state => {
            return {
                ...state,
            };
        });
        this.props.onChangeTemplateData(this.state.taskItem);
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
    formatMonth(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    handleTaskTemplateNumberOfDaysTaken = (event) => {
        let value = event.target.value;
        this.validateTaskTemplateNumberOfDaysTaken(value, true);
    }

    validateTaskTemplateNumberOfDaysTaken = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateNumberOfDaysTaken(value);

        if (willUpdateState) {
            this.state.taskItem.numberOfDaysTaken = value;
            this.state.taskItem.errorOnNumberOfDaysTaken = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        this.props.onChangeTemplateData(this.state.taskItem);
        return msg === undefined;
    }

    handleChangeTaskStartDate = (value) => {
        this.validateTaskStartDate(value, true);
    }
    validateTaskStartDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = TaskFormValidator.validateTaskStartDate(value, this.state.taskItem.endDate ? this.state.taskItem.endDate : "", translate);

        if (willUpdateState) {
            // let splitter = value.split('-');
            // let startDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
            // let timer = startDate.getTime() + this.state.taskItem.numberOfDaysTaken * 24 * 60 * 60 * 1000;

            // let endDateISO = new Date(timer).toISOString();
            // let endDate = this.formatDate(endDateISO);

            this.state.taskItem.startDate = value;
            // this.state.taskItem.endDate = endDate;
            this.state.taskItem.errorOnStartDate = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
            this.props.onChangeTemplateData(this.state.taskItem);
        }

        return msg === undefined;
    }

    handleChangeTaskEndDate = (value) => {
        this.validateTaskEndDate(value, true);
    }
    validateTaskEndDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = TaskFormValidator.validateTaskEndDate(this.state.taskItem.startDate ? this.state.taskItem.startDate : "", value, translate);

        if (willUpdateState) {
            this.state.taskItem.endDate = value;
            this.state.taskItem.errorOnEndDate = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
            this.props.onChangeTemplateData(this.state.taskItem);
        }
        return msg === undefined;
    }

    clickShowMore = () => {
        this.setState(state => {
            return {
                ...state,
                showMore: !state.showMore,
            }
        });
    }

    render() {
        const { department, user, translate } = this.props;
        const { isProcess } = this.props;

        var units, taskActions, taskInformations, listRole, departmentsThatUserIsDean, listRoles, usercompanys, userdepartments = [];
        var { taskItem, id, showMore } = this.state;

        if (taskItem && taskItem.taskActions) taskActions = taskItem.taskActions;
        if (taskItem && taskItem.taskInformations) taskInformations = taskItem.taskInformations;

        if (user.organizationalUnitsOfUser) {
            units = user.organizationalUnitsOfUser;
        }
        if (department.departmentsThatUserIsDean) {
            departmentsThatUserIsDean = department.departmentsThatUserIsDean;
        }
        if (user.usercompanys) usercompanys = user.usercompanys;
        if (user.userdepartments) userdepartments = user.userdepartments;

        var usersOfChildrenOrganizationalUnit;
        if (user && user.usersOfChildrenOrganizationalUnit) {
            usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
        }
        var usersInUnitsOfCompany;
        if (user && user.usersInUnitsOfCompany) {
            usersInUnitsOfCompany = user.usersInUnitsOfCompany;
        }

        var allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany);
        let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);

        return (
            <React.Fragment>
                {/**Form chứa thông tin của mẫu công việc đang sửa */}
                <div className="row">
                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                        {/**Đơn vị của mẫu công việc */}
                        <div className={`form-group ${taskItem.errorOnUnit === undefined ? "" : "has-error"}`} >
                            <label className="control-label">{translate('task_template.unit')} <span style={{ color: "red" }}>*</span></label>
                            {departmentsThatUserIsDean !== undefined && taskItem.organizationalUnit !== "" &&
                                <SelectBox
                                    id={`edit-unit-select-box-${taskItem._id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        departmentsThatUserIsDean.map(x => {
                                            return { value: x._id, text: x.name };
                                        })
                                    }
                                    onChange={this.handleTaskTemplateUnit}
                                    value={taskItem.organizationalUnit}
                                    multiple={false}

                                />
                            }
                            <ErrorLabel content={this.state.taskItem.errorOnUnit} />
                        </div>
                    </div>

                </div>

                <div className="row">
                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>

                        {/**Tên mẫu công việc này */}
                        <div className={`form-group ${this.state.taskItem.errorOnName === undefined ? "" : "has-error"}`} >
                            <label className="control-label">{translate('task_template.tasktemplate_name')} <span style={{ color: "red" }}>*</span></label>
                            <input type="Name" className="form-control" placeholder={translate('task_template.tasktemplate_name')} value={taskItem.name} onChange={this.handleTaskTemplateName} />
                            <ErrorLabel content={this.state.taskItem.errorOnName} />
                        </div>
                    </div>

                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>

                        {/**Mô tả mẫu công việc này */}
                        <div className={`form-group ${this.state.taskItem.errorOnDescription === undefined ? "" : "has-error"}`} >
                            <label className="control-label" htmlFor="inputDescriptionTaskTemplate">{translate('task_template.description')} <span style={{ color: "red" }}>*</span></label>
                            <textarea rows={4} type="Description" className="form-control" id="inputDescriptionTaskTemplate" name="description" placeholder={translate('task_template.description')} value={taskItem.description} onChange={this.handleTaskTemplateDesc} />
                            <ErrorLabel content={this.state.taskItem.errorOnDescription} />
                        </div>
                    </div>
                </div>
                {/**Độ ưu tiên mẫu công việc này */}
                <div className="form-group" >
                    <label className="control-label">{translate('task_template.priority')}</label>
                    <select className="form-control" value={taskItem.priority} onChange={this.handleChangeTaskPriority}>
                        <option value={3}>{translate('task_template.high')}</option>
                        <option value={2}>{translate('task_template.medium')}</option>
                        <option value={1}>{translate('task_template.low')}</option>
                    </select>
                </div>
                {/**Số ngày hoàn thành công việc dự kiến */}
                {/* <div className={`form-group ${this.state.taskItem.errorOnNumberOfDaysTaken === undefined ? "" : "has-error"}`} >
                    <label className="control-label" htmlFor="inputNumberOfDaysTaken">{translate('task_template.numberOfDaysTaken')}</label>
                    <input type="number" className="form-control" id="inputNumberOfDaysTaken" value={taskItem.numberOfDaysTaken}
                        placeholder={'Không có dữ liệu'}
                        disabled={true}
                        onChange={this.handleTaskTemplateNumberOfDaysTaken} />
                    <ErrorLabel content={this.state.taskItem.errorOnNumberOfDaysTaken} />
                </div> */}

                {/* Ngay bat dau - ngay ket thuc */}
                <div className=" row ">
                    <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${this.state.taskItem.errorOnStartDate === undefined ? "" : "has-error"}`}>
                        <label className="control-label">{translate('task.task_management.start_date')} <span style={{ color: "red" }}>*</span></label>
                        <DatePicker
                            id={`datepicker1-${id}`}
                            dateFormat="day-month-year"
                            value={taskItem.startDate}
                            onChange={this.handleChangeTaskStartDate}
                        />
                        <ErrorLabel content={this.state.taskItem.errorOnStartDate} />
                    </div>
                    <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${this.state.taskItem.errorOnEndDate === undefined ? "" : "has-error"}`}>
                        <label className="control-label">{translate('task.task_management.end_date')} <span style={{ color: "red" }}>*</span></label>
                        <DatePicker
                            id={`datepicker2-${id}`}
                            value={taskItem.endDate}
                            onChange={this.handleChangeTaskEndDate}
                        />
                        <ErrorLabel content={this.state.taskItem.errorOnEndDate} />
                    </div>
                </div>

                {/* <label className="control-label" htmlFor="inputNumberOfDaysTaken">{translate('task_template.numberOfDaysTaken')}: </label> */}

                <div className="form-group">
                    <small><i>({translate('task_template.numberOfDaysTaken')}: </i></small>
                    {taskItem.numberOfDaysTaken ?
                        <small><i>{taskItem.numberOfDaysTaken + " ngày )"}</i></small> :
                        <small><i>Không có dữ liệu. )</i></small>
                    }
                </div>

                <div className="row">
                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                        <div className='form-group' >

                            {/**Người thực hiện mẫu công việc này */}
                            <label className="control-label" >{translate('task_template.performer')} <span style={{ color: "red" }}>*</span></label>
                            {unitMembers && taskItem.responsibleEmployees &&
                                <SelectBox
                                    id={isProcess ? `create-task-responsible-select-box-${taskItem._id}-${id}` : "edit-responsible-select-box"}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={unitMembers}
                                    onChange={this.handleTaskTemplateResponsible}
                                    value={taskItem.responsibleEmployees}
                                    multiple={true}
                                    options={{ placeholder: `${translate('task_template.performer')}` }}
                                />
                            }
                        </div>
                        <div className='form-group' >

                            {/**Người phê duyệt mẫu công việc này */}
                            <label className="control-label">{translate('task_template.approver')} <span style={{ color: "red" }}>*</span></label>
                            {unitMembers && taskItem.accountableEmployees &&
                                <SelectBox
                                    id={isProcess ? `create-task-accountable-select-box-${taskItem._id}-${id}` : "edit-accountable-select-box"}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={unitMembers}
                                    onChange={this.handleTaskTemplateAccountable}
                                    value={taskItem.accountableEmployees}
                                    multiple={true}
                                    options={{ placeholder: `${translate('task_template.approver')}` }}
                                />
                            }
                        </div>
                        {
                            // showMore &&
                            <div>
                                <div className='form-group' >
                                    {/**Người hỗ trọ mẫu công việc này */}
                                    <label className="control-label">{translate('task_template.consultant')}</label>
                                    {allUnitsMember && taskItem.consultedEmployees &&
                                        <SelectBox
                                            id={isProcess ? `create-task-consulted-select-box-${taskItem._id}-${id}` : "edit-consulted-select-box"}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={allUnitsMember}
                                            onChange={this.handleTaskTemplateConsult}
                                            value={taskItem.consultedEmployees}
                                            multiple={true}
                                            options={{ placeholder: `${translate('task_template.consultant')}` }}
                                        />
                                    }
                                </div>
                                <div className='form-group' >

                                    {/**Người quan sát mẫu công việc này */}
                                    <label className="control-label">{translate('task_template.observer')}</label>
                                    {allUnitsMember && taskItem.informedEmployees &&
                                        <SelectBox
                                            id={isProcess ? `create-task-informed-select-box-${taskItem._id}-${id}` : "edit-informed-select-box"}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={allUnitsMember}
                                            onChange={this.handleTaskTemplateInform}
                                            multiple={true}
                                            value={taskItem.informedEmployees}
                                            options={{ placeholder: `${translate('task_template.observer')}` }}
                                        />
                                    }
                                </div>
                            </div>

                        }
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { department, user, tasktemplates } = state;
    return { department, user, tasktemplates };
}

const actionCreators = {
    getTaskTemplate: taskTemplateActions.getTaskTemplateById,
    editTaskTemplate: taskTemplateActions.editTaskTemplate,
    addNewTemplate: taskTemplateActions.addTaskTemplate,
    getDepartment: UserActions.getDepartmentOfUser,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
    getDepartmentsThatUserIsDean: DepartmentActions.getDepartmentsThatUserIsDean,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany

};
const connectedFormCreateTaskByProcess = connect(mapState, actionCreators)(withTranslate(FormCreateTaskByProcess));
export { connectedFormCreateTaskByProcess as FormCreateTaskByProcess };
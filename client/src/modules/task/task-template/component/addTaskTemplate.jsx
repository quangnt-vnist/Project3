import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../redux/actions';
import { InformationForm } from '../component/informationsTemplate';
import { ActionForm } from '../component/actionsTemplate';
import { SelectBox, ErrorLabel } from '../../../../common-components';
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import { TaskTemplateFormValidator } from './taskTemplateFormValidator';
import { getStorage } from '../../../../config';

class AddTaskTemplate extends Component {
    constructor(props) {
        super(props);
        let userId = getStorage("userId")
        this.state = {
            newTemplate: {
                organizationalUnit: '',
                name: '',
                readByEmployees: [],
                responsibleEmployees: [],
                accountableEmployees: [],
                consultedEmployees: [],
                informedEmployees: [],
                description: '',
                creator: userId,
                numberOfDaysTaken: '',
                formula: '',
                priority: 3,
                taskActions: [],
                taskInformations: [],
            },
            showMore: this.props.isProcess ? false : true,
            currentRole: localStorage.getItem('currentRole'),
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.getDepartment();
        this.props.getAllUserOfCompany();
        this.props.getRoleSameDepartment(localStorage.getItem("currentRole"));
        this.props.getDepartmentsThatUserIsDean();
        this.props.getAllUserInAllUnitsOfCompany();
    }

    /**Submit new template in data */
    handleSubmit = async (event) => {
        let { newTemplate } = this.state;
        const { department, user, translate, tasktemplates, isProcess } = this.props;

        let listRoles = [];
        if (user.roledepartments) {
            console.log('pppp');
            let listRole = user.roledepartments;
            for (let x in listRole.employees)
                listRoles.push(listRole.employees[x]);
        }
        console.log('list role', listRoles);
        await this.setState(state => {
            if (state.readByEmployees.length === 0) {
                state.newTemplate.readByEmployees = listRoles
            }
            return {
                ...state,
            }
        });

        this.props.addNewTemplate(newTemplate);
        window.$("#addTaskTemplate").modal("hide");
    }


    /**
     * Xử lý form lớn tasktemplate
     */
    isTaskTemplateFormValidated = () => {
        let result =
            this.validateTaskTemplateUnit(this.state.newTemplate.organizationalUnit, false) &&
            this.validateTaskTemplateRead(this.state.newTemplate.readByEmployees, false) &&
            this.validateTaskTemplateName(this.state.newTemplate.name, false) &&
            this.validateTaskTemplateDescription(this.state.newTemplate.description, false) &&
            this.validateTaskTemplateFormula(this.state.newTemplate.formula, false);
        return result;
    }
    handleTaskTemplateName = (event) => {
        let value = event.target.value;
        let { isProcess } = this.props
        isProcess && this.props.handleChangeName(value)
        this.validateTaskTemplateName(value, true);
    }

    validateTaskTemplateName = async (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateName(value);

        if (willUpdateState) {
            this.state.newTemplate.name = value;
            this.state.newTemplate.errorOnName = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        // console.log('stst', this.state.newTemplate);
        this.props.onChangeTemplateData(this.state.newTemplate);
        return msg === undefined;
    }

    handleTaskTemplateDesc = (event) => {
        let value = event.target.value;
        this.validateTaskTemplateDescription(value, true);
    }

    validateTaskTemplateDescription = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateDescription(value);

        if (willUpdateState) {
            this.state.newTemplate.description = value;
            // this.state.newTemplate.errorOnDescription = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        this.props.onChangeTemplateData(this.state.newTemplate);
        return msg === undefined;
    }

    handleTaskTemplateFormula = (event) => {
        let value = event.target.value;
        this.validateTaskTemplateFormula(value, true);
    }

    validateTaskTemplateFormula = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value);

        if (willUpdateState) {
            this.state.newTemplate.formula = value;
            // this.state.newTemplate.errorOnFormula = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        this.props.onChangeTemplateData(this.state.newTemplate);
        return msg === undefined;
    }

    handleTaskTemplateNumberOfDaysTaken = (event) => {
        let value = event.target.value;
        this.validateTaskTemplateNumberOfDaysTaken(value, true);
    }

    validateTaskTemplateNumberOfDaysTaken = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateNumberOfDaysTaken(value);

        if (willUpdateState) {
            this.state.newTemplate.numberOfDaysTaken = value;
            this.state.newTemplate.errorOnNumberOfDaysTaken = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        this.props.onChangeTemplateData(this.state.newTemplate);
        return msg === undefined;
    }

    handleChangeTaskPriority = (event) => {
        this.state.newTemplate.priority = event.target.value;
        this.setState(state => {
            return {
                ...state,
            };
        });
        this.props.onChangeTemplateData(this.state.newTemplate);
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
                    this.props.getRoleSameDepartment(dept.deans);
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
                    newTemplate: { // update lại unit, và reset các selection phía sau
                        ...this.state.newTemplate,
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
        this.props.onChangeTemplateData(this.state.newTemplate);
        return msg === undefined;
    }

    handleTaskTemplateRead = (value) => {
        this.validateTaskTemplateRead(value, true);
    }

    validateTaskTemplateRead = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateRead(value);

        if (willUpdateState) {
            let { newTemplate } = this.state;
            newTemplate.readByEmployees = value;
            newTemplate.errorOnRead = msg;
            this.setState({
                newTemplate
            });
        }
        this.props.onChangeTemplateData(this.state.newTemplate);
        return msg === undefined;
    }

    handleTaskTemplateResponsible = (value) => {
        let { newTemplate } = this.state;
        newTemplate.responsibleEmployees = value;
        this.setState({
            newTemplate
        });
        this.props.isProcess && this.props.handleChangeResponsible(value)
        this.props.onChangeTemplateData(this.state.newTemplate);
    }

    handleTaskTemplateAccountable = async (value) => {
        let { newTemplate } = this.state;
        newTemplate.accountableEmployees = value;
        await this.setState({
            newTemplate
        });
        this.props.isProcess && this.props.handleChangeAccountable(value)
        this.props.onChangeTemplateData(this.state.newTemplate);
    }

    handleTaskTemplateConsult = (value) => {
        let { newTemplate } = this.state;
        newTemplate.consultedEmployees = value;
        this.setState({
            newTemplate
        });
        this.props.onChangeTemplateData(this.state.newTemplate);
    }

    handleTaskTemplateInform = (value) => {
        let { newTemplate } = this.state;
        newTemplate.informedEmployees = value;
        this.setState({
            newTemplate
        });
        this.props.onChangeTemplateData(this.state.newTemplate);
    }

    handleTaskActionsChange = (data) => {
        let { newTemplate } = this.state;
        this.setState(state => {
            return {
                ...state,
                newTemplate: {
                    ...newTemplate,
                    taskActions: data
                },
            }
        })

        this.props.onChangeTemplateData(this.state.newTemplate);
    }

    handleTaskInformationsChange = (data) => {
        let { newTemplate } = this.state;
        this.setState(state => {
            return {
                ...state,
                newTemplate: {
                    ...newTemplate,
                    taskInformations: data
                },
            }
        })
        this.props.onChangeTemplateData(this.state.newTemplate);
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        const { department, user } = this.props;
        const { newTemplate } = this.state;

        if (nextProps.isProcess && nextProps.id !== this.state.id) {
            let { info, listOrganizationalUnit } = nextProps;
            this.setState(state => {
                return {
                    id: nextProps.id,
                    newTemplate: {
                        organizationalUnit: (info && info.organizationalUnit) ? info.organizationalUnit : [],
                        name: (info && info.name) ? info.name : '',
                        // readByEmployees: [],
                        responsibleEmployees: (info && info.responsibleEmployees) ? info.responsibleEmployees : [],
                        accountableEmployees: (info && info.accountableEmployees) ? info.accountableEmployees : [],
                        consultedEmployees: (info && info.consultedEmployees) ? info.consultedEmployees : [],
                        informedEmployees: (info && info.informedEmployees) ? info.informedEmployees : [],
                        description: (info && info.description) ? info.description : '',
                        creator: (info && info.creator) ? info.creator : getStorage("userId"),
                        numberOfDaysTaken: (info && info.numberOfDaysTaken) ? info.numberOfDaysTaken : '',
                        formula: (info && info.formula) ? info.formula : '',
                        priority: (info && info.priority) ? info.priority : 3,
                        taskActions: (info && info.taskActions) ? info.taskActions : [],
                        taskInformations: (info && info.taskInformations) ? info.taskInformations : [],
                    },
                    showMore: this.props.isProcess ? false : true,
                }
            })
            this.props.getDepartment();
            // let { user } = this.props;
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
        if (newTemplate.organizationalUnit === "" && user.organizationalUnitsOfUser) {
            // Tìm unit mà currentRole của user đang thuộc về
            let defaultUnit = user.organizationalUnitsOfUser.find(item =>
                item.deans.includes(this.state.currentRole)
                || item.viceDeans.includes(this.state.currentRole)
                || item.employees.includes(this.state.currentRole
                ));

            if (defaultUnit) {
                this.setState(state => {
                    return {
                        ...state,
                        newTemplate: {
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

    clickShowMore = () => {
        this.setState(state => {
            return {
                ...state,
                showMore: !state.showMore,
            }
        });
    }

    render() {

        var units, taskActions, taskInformations, listRole, usercompanys, userdepartments, departmentsThatUserIsDean, listRoles = [];
        const { newTemplate, showMore, accountableEmployees, responsibleEmployees, id } = this.state;
        const { department, user, translate, tasktemplates, isProcess } = this.props;
        if (newTemplate.taskActions) taskActions = newTemplate.taskActions;
        if (newTemplate.taskInformations) taskInformations = newTemplate.taskInformations;

        if (user.organizationalUnitsOfUser) {
            units = user.organizationalUnitsOfUser;
        }
        if (department.departmentsThatUserIsDean) {
            departmentsThatUserIsDean = department.departmentsThatUserIsDean;
        }
        if (user.usersInUnitsOfCompany) {
            listRole = user.usersInUnitsOfCompany;
            for (let x in listRole) {
                listRoles.push(Object.values(listRole[x].deans));
                listRoles.push(Object.values(listRole[x].viceDeans));
                listRoles.push(Object.values(listRole[x].employees));
            }
            listRole = [];
            for (let x in listRoles) {
                for (let i in listRoles[x]) {
                    if (listRole.indexOf(listRoles[x][i]) === -1) {
                        listRole = listRole.concat(listRoles[x][i]);
                    }
                }
            }
            listRoles = listRole;
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

                {/**Form chứa các thông tin của 1 task template */}

                <div className="row">
                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>

                        {/**Đơn vị(phòng ban) của Task template*/}
                        <div className={`form-group ${this.state.newTemplate.errorOnUnit === undefined ? "" : "has-error"}`} style={{ marginLeft: 0, marginRight: 0 }}>
                            <label className="control-label">{translate('task_template.unit')} <span style={{ color: "red" }}> <span style={{ color: "red" }}>*</span></span></label>
                            {usersInUnitsOfCompany !== undefined && newTemplate.organizationalUnit !== "" &&
                                <SelectBox
                                    id={`unit-select-box`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        usersInUnitsOfCompany.map(x => {
                                            return { value: x.id, text: x.department };
                                        })
                                    }
                                    value={newTemplate.organizationalUnit}
                                    onChange={this.handleTaskTemplateUnit}
                                    multiple={false}
                                    value={newTemplate.organizationalUnit}
                                />
                            }
                            <ErrorLabel content={this.state.newTemplate.errorOnUnit} />
                        </div>
                    </div>

                    {/**Những Role có quyền xem mẫu công việc này*/}
                    {!isProcess &&
                        <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                            <div className={`form-group ${this.state.newTemplate.errorOnRead === undefined ? "" : "has-error"}`} >
                                <label className="control-label">{translate('task_template.permission_view')} <span style={{ color: "red" }}>*</span></label>
                                {listRoles &&
                                    <SelectBox
                                        id={`read-select-box`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            listRoles.map(x => { return { value: x._id, text: x.name } })
                                        }
                                        value={newTemplate.readByEmployees}
                                        onChange={this.handleTaskTemplateRead}
                                        multiple={true}
                                        options={{ placeholder: `${translate('task_template.permission_view')}` }}
                                    />
                                }
                                <ErrorLabel content={this.state.newTemplate.errorOnRead} />
                            </div>
                        </div>
                    }
                </div>
                {/* </div> */}



                <div className="row">
                    {/**Tên mẫu công việc */}
                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                        <div className={`form-group ${this.state.newTemplate.errorOnName === undefined ? "" : "has-error"}`} >
                            <label className="control-label">{translate('task_template.name')} <span style={{ color: "red" }}>*</span></label>
                            <input type="Name" className="form-control" placeholder={translate('task_template.name')} value={newTemplate.name} onChange={this.handleTaskTemplateName} />
                            <ErrorLabel content={this.state.newTemplate.errorOnName} />
                        </div>
                        {/**Độ ưu tiên mẫu công việc */}
                        <div className="form-group" >
                            <label className="control-label">{translate('task_template.priority')}</label>
                            <select className="form-control" value={newTemplate.priority} onChange={this.handleChangeTaskPriority}>
                                <option value={3}>{translate('task_template.high')}</option>
                                <option value={2}>{translate('task_template.medium')}</option>
                                <option value={1}>{translate('task_template.low')}</option>
                            </select>
                        </div>
                    </div>
                    {/**Mô tả mẫu công việc */}
                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                        {/* <div className={`form-group ${this.state.newTemplate.errorOnDescription === undefined ? "" : "has-error"}`} > */}
                        <div className={`form-group`} >
                            <label className="control-label" htmlFor="inputDescriptionTaskTemplate" style={{ width: '100%', textAlign: 'left' }}>{translate('task_template.description')}</label>
                            <textarea rows={5} type="Description" className="form-control" id="inputDescriptionTaskTemplate" name="description" placeholder={translate('task_template.description')} value={newTemplate.description} onChange={this.handleTaskTemplateDesc} />
                            {/* <ErrorLabel content={this.state.newTemplate.errorOnDescription} /> */}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>

                        {/**Người chịu trách nhiệm mẫu công việc */}
                        <div className='form-group' >
                            <label className="control-label">{translate('task_template.performer')}</label>
                            {allUnitsMember &&
                                <SelectBox
                                    id={isProcess ? `responsible-select-box-${id}` : "responsible-select-box"}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={allUnitsMember}
                                    value={newTemplate.responsibleEmployees}
                                    onChange={this.handleTaskTemplateResponsible}
                                    multiple={true}
                                    options={{ placeholder: `${translate('task_template.performer')}` }}
                                />
                            }
                        </div>
                        {/**Người phê duyệt mẫu công việc */}
                        <div className='form-group' >
                            <label className="control-label">{translate('task_template.approver')}</label>
                            {allUnitsMember &&
                                <SelectBox
                                    id={isProcess ? `accountable-select-box-${id}` : "accountable-select-box"}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={allUnitsMember}
                                    value={newTemplate.accountableEmployees}
                                    onChange={this.handleTaskTemplateAccountable}
                                    multiple={true}
                                    options={{ placeholder: `${translate('task_template.approver')}` }}
                                />
                            }
                        </div>

                        {showMore &&
                            <div>
                                {/**Người tư vấn trong mẫu công việc */}
                                <div className='form-group' >
                                    <label className="control-label">{translate('task_template.consultant')}</label>
                                    {allUnitsMember &&
                                        <SelectBox
                                            id={isProcess ? `consulted-select-box-${id}` : "consulted-select-box"}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={allUnitsMember}
                                            value={newTemplate.consultedEmployees}
                                            onChange={this.handleTaskTemplateConsult}
                                            multiple={true}
                                            options={{ placeholder: `${translate('task_template.consultant')}` }}
                                        />
                                    }
                                </div>
                                {/**Người quan sát mẫu công việc */}
                                <div className='form-group' >
                                    <label className="control-label">{translate('task_template.observer')}</label>
                                    {allUnitsMember &&
                                        <SelectBox
                                            id={isProcess ? `informed-select-box-${id}` : "informed-select-box"}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={allUnitsMember}
                                            value={newTemplate.informedEmployees}
                                            onChange={this.handleTaskTemplateInform}
                                            multiple={true}
                                            options={{ placeholder: `${translate('task_template.observer')}` }}
                                        />
                                    }
                                </div>
                            </div>
                        }
                    </div>

                    {showMore &&
                        <div>
                            {isProcess &&
                                <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                                    {/**Số ngày hoàn thành công việc dự kiến */}
                                    <div className={`form-group ${this.state.newTemplate.errorOnNumberOfDaysTaken === undefined ? "" : "has-error"}`} >
                                        <label className="control-label" htmlFor="inputNumberOfDaysTaken">{translate('task_template.numberOfDaysTaken')}</label>
                                        <input type="number" className="form-control" id="inputNumberOfDaysTaken" value={newTemplate.numberOfDaysTaken}
                                            placeholder={'Nhập số ngày hoàn thành dự kiến'}
                                            onChange={this.handleTaskTemplateNumberOfDaysTaken} />
                                        <ErrorLabel content={this.state.newTemplate.errorOnNumberOfDaysTaken} />
                                    </div>
                                </div>
                            }
                            <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                                {/**Công thức tính của mẫu công việc */}
                                <div className={`form-group ${this.state.newTemplate.errorOnFormula === undefined ? "" : "has-error"}`} >
                                    <label className="control-label" htmlFor="inputFormula">{translate('task_template.formula')}</label>
                                    <input type="text" className="form-control" id="inputFormula" placeholder="progress/(dayUsed/totalDay) - (10-averageActionRating)*10 - 100*(1-p1/p2)" value={newTemplate.formula} onChange={this.handleTaskTemplateFormula} />
                                    <ErrorLabel content={this.state.newTemplate.errorOnFormula} />

                                    <br />
                                    <div><span style={{ fontWeight: 800 }}>Ví dụ: </span>progress/(dayUsed/totalDay) - (10-averageActionRating)*10 - 100*(1-p1/p2)</div>
                                    <br />
                                    <div><span style={{ fontWeight: 800 }}>{translate('task_template.parameters')}:</span></div>
                                    <div><span style={{ fontWeight: 600 }}>overdueDate</span> - Thời gian quá hạn (ngày)</div>
                                    <div><span style={{ fontWeight: 600 }}>dayUsed</span> - Thời gian làm việc tính đến ngày đánh giá (ngày)</div>
                                    <div><span style={{ fontWeight: 600 }}>totalDay</span> - Thời gian từ ngày bắt đầu đến ngày kết thúc công việc (ngày)</div>
                                    <div><span style={{ fontWeight: 600 }}>averageActionRating</span> -  Trung bình cộng điểm đánh giá hoạt động (1-10)</div>
                                    <div><span style={{ fontWeight: 600 }}>progress</span> - % Tiến độ công việc (0-100)</div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                {showMore &&
                    <div className="row">
                        {/**Các hoạt động trong mẫu công việc */}
                        <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                            <ActionForm initialData={taskActions} onDataChange={this.handleTaskActionsChange} />
                        </div>
                        {/**Các thông tin cần có mẫu công việc */}
                        <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                            <InformationForm initialData={taskInformations} onDataChange={this.handleTaskInformationsChange} />
                        </div>
                    </div>
                }

                {
                    isProcess &&
                    <div>
                        <a style={{ cursor: "pointer" }} onClick={this.clickShowMore}>
                            {showMore ?
                                <span>
                                    Show less <i className="fa fa-angle-double-up"></i>
                                </span>
                                : <span>
                                    Show more <i className="fa fa-angle-double-down"></i>
                                </span>
                            }
                        </a>
                        <br />
                    </div>
                }
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { department, user, tasktemplates } = state;
    const adding = state.tasktemplates;
    return { adding, department, user, tasktemplates };
}

const actionCreators = {
    addNewTemplate: taskTemplateActions.addTaskTemplate,
    getDepartment: UserActions.getDepartmentOfUser,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
    getDepartmentsThatUserIsDean: DepartmentActions.getDepartmentsThatUserIsDean,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany
};
const connectedAddTaskTemplate = connect(mapState, actionCreators)(withTranslate(AddTaskTemplate));
export { connectedAddTaskTemplate as AddTaskTemplate };
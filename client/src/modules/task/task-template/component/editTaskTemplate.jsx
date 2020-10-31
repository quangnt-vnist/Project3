import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../redux/actions';
import { ActionForm } from '../component/actionsTemplate';
import { SelectBox, ErrorLabel } from '../../../../common-components';
import { TaskTemplateFormValidator } from './taskTemplateFormValidator';
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import { InformationForm } from './informationsTemplate';
import { getStorage } from '../../../../config';

class EditTaskTemplate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentRole: localStorage.getItem('currentRole'),
            editingTemplate: {
                organizationalUnit: '',
                name: '',
                readByEmployees: [],
                responsibleEmployees: [],
                accountableEmployees: [],
                consultedEmployees: [],
                informedEmployees: [],
                description: '',
                numberOfDaysTaken: '',
                formula: '',
                priority: 3,
                taskActions: [],
                taskInformations: []
            },
            showMore: props.isProcess ? false : true,
        };
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
            console.log("change")
            return {
                ...prevState,
                taskTemplateId: nextProps.taskTemplateId,
                editingTemplate: nextProps.taskTemplate,
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
        const { editingTemplate } = this.state;

        // dùng cho công việc có quy trình
        if (nextProps.isProcess && nextProps.id !== this.state.id) {
            let { info, listOrganizationalUnit } = nextProps;
            this.setState(state => {
                return {
                    ...state,
                    id: nextProps.id,
                    editingTemplate: {
                        organizationalUnit: (info && info.organizationalUnit) ? info.organizationalUnit._id : [],
                        name: (info && info.name) ? info.name : '',
                        readByEmployees: info.readByEmployees,
                        responsibleEmployees: (info && info.responsibleEmployees) ? info.responsibleEmployees.map(item => { if (item) return item._id }) : [],
                        accountableEmployees: (info && info.accountableEmployees) ? info.accountableEmployees.map(item => { if (item) return item._id }) : [],
                        consultedEmployees: (info && info.consultedEmployees) ? info.consultedEmployees.map(item => { if (item) return item._id }) : [],
                        informedEmployees: (info && info.informedEmployees) ? info.informedEmployees.map(item => { if (item) return item._id }) : [],
                        description: (info && info.description) ? info.description : '',
                        creator: (info && info.creator) ? info.creator : getStorage("userId"),
                        numberOfDaysTaken: (info && info.numberOfDaysTaken) ? info.numberOfDaysTaken : '',
                        formula: (info && info.formula) ? info.formula : '',
                        priority: (info && info.priority) ? info.priority : 3,
                        taskActions: (info && info.taskActions) ? info.taskActions : [],
                        taskInformations: (info && info.taskInformations) ? info.taskInformations : [],
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

        // là dạng mẫu công việc
        else if (nextProps.isTaskTemplate && nextProps.taskTemplateId !== this.props.taskTemplateId) {

            this.setState({
                taskTemplateId: nextProps.taskTemplateId,
                editingTemplate: {
                    _id: nextProps.taskTemplate._id,
                    organizationalUnit: nextProps.taskTemplate.organizationalUnit._id,
                    name: nextProps.taskTemplate.name,
                    readByEmployees: nextProps.taskTemplate.readByEmployees,
                    responsibleEmployees: nextProps.taskTemplate.responsibleEmployees,
                    accountableEmployees: nextProps.taskTemplate.accountableEmployees,
                    consultedEmployees: nextProps.taskTemplate.consultedEmployees,
                    informedEmployees: nextProps.taskTemplate.informedEmployees,
                    description: nextProps.taskTemplate.description,
                    numberOfDaysTaken: nextProps.taskTemplate.numberOfDaysTaken,
                    formula: nextProps.taskTemplate.formula,
                    priority: nextProps.taskTemplate.priority,
                    taskActions: nextProps.taskTemplate.taskActions,
                    taskInformations: nextProps.taskTemplate.taskInformations,
                },
                showActionForm: true,
            });
            return false;
        }

        // Khi truy vấn lấy các đơn vị mà user là dean đã có kết quả, và thuộc tính đơn vị của editingTemplate chưa được thiết lập
        else if (editingTemplate.organizationalUnit === "" && department.departmentsThatUserIsDean) {
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
                        editingTemplate: {
                            ...this.state.editingTemplate,
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

    /**
     * Xử lý form lớn tasktemplate
     */
    isTaskTemplateFormValidated = () => {
        if (!this.state.editingTemplate._id)
            return false;
        let result =
            this.validateTaskTemplateRead(this.state.editingTemplate.readByEmployees, false) &&
            this.validateTaskTemplateName(this.state.editingTemplate.name, false) &&
            this.validateTaskTemplateDesc(this.state.editingTemplate.description, false) &&
            this.validateTaskTemplateFormula(this.state.editingTemplate.formula, false) &&
            this.validateTaskTemplateUnit(this.state.editingTemplate.organizationalUnit, false);
        return result;
    }

    handleTaskTemplateName = (event) => {
        let value = event.target.value;
        this.props.isProcess && this.props.handleChangeName(value)
        this.validateTaskTemplateName(value, true);
    }

    validateTaskTemplateName = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateName(value);

        if (willUpdateState) {
            this.state.editingTemplate.name = value;
            this.state.editingTemplate.errorOnName = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        this.props.onChangeTemplateData(this.state.editingTemplate);
        return msg == undefined;
    }

    handleTaskTemplateDesc = (event) => {
        let value = event.target.value;
        this.validateTaskTemplateDesc(value, true);
    }

    validateTaskTemplateDesc = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateDescription(value);

        if (willUpdateState) {
            let { editingTemplate } = this.state;
            editingTemplate.description = value;
            editingTemplate.errorOnDescription = msg;
            this.setState({
                editingTemplate
            });
        }
        this.props.onChangeTemplateData(this.state.editingTemplate);
        return msg == undefined;
    }

    handleTaskTemplateNumberOfDaysTaken = (event) => {
        let value = event.target.value;
        this.validateTaskTemplateNumberOfDaysTaken(value, true);
    }

    validateTaskTemplateNumberOfDaysTaken = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateNumberOfDaysTaken(value);

        if (willUpdateState) {
            let { editingTemplate } = this.state;
            editingTemplate.numberOfDaysTaken = value;
            editingTemplate.errorOnNumberOfDaysTaken = msg;
            this.setState({
                editingTemplate
            });
        }
        this.props.onChangeTemplateData(this.state.editingTemplate);
        return msg === undefined;
    }

    handleTaskTemplateFormula = (event) => {
        let value = event.target.value;
        this.validateTaskTemplateFormula(value, true);
    }

    validateTaskTemplateFormula = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value);

        if (willUpdateState) {
            let { editingTemplate } = this.state;
            editingTemplate.formula = value;
            editingTemplate.errorOnFormula = msg;
            this.setState({
                editingTemplate
            });
        }
        this.props.onChangeTemplateData(this.state.editingTemplate);
        return msg == undefined;
    }
    handleChangeTaskPriority = (event) => {
        let { editingTemplate } = this.state;
        editingTemplate.priority = event.target.value;
        this.setState({
            editingTemplate
        });
        this.props.onChangeTemplateData(this.state.editingTemplate);
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
        // let msg = TaskTemplateFormValidator.validateTaskTemplateUnit(value);
        let msg;

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    editingTemplate: { // update lại unit, và reset các selection phía sau
                        ...this.state.editingTemplate,
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
        this.props.onChangeTemplateData(this.state.editingTemplate);
        return msg == undefined;
    }

    handleTaskTemplateRead = (value) => {

        this.validateTaskTemplateRead(value, true);
    }

    validateTaskTemplateRead = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateRead(value);

        if (willUpdateState) {
            let { editingTemplate } = this.state;
            editingTemplate.readByEmployees = value;
            editingTemplate.errorOnRead = msg;
            this.setState({
                editingTemplate
            });
        }
        this.props.onChangeTemplateData(this.state.editingTemplate);
        return msg == undefined;
    }

    handleTaskTemplateResponsible = (value) => {
        let { editingTemplate } = this.state;
        editingTemplate.responsibleEmployees = value;
        this.setState({
            editingTemplate
        });
        this.props.isProcess && this.props.handleChangeResponsible(value)
        this.props.onChangeTemplateData(this.state.editingTemplate);
    }

    handleTaskTemplateAccountable = (value) => {
        let { editingTemplate } = this.state;
        editingTemplate.accountableEmployees = value;
        this.setState({
            editingTemplate
        });
        this.props.isProcess && this.props.handleChangeAccountable(value)
        this.props.onChangeTemplateData(this.state.editingTemplate);
    }

    handleTaskTemplateConsult = (value) => {
        let { editingTemplate } = this.state;
        editingTemplate.consultedEmployees = value;
        this.setState({
            editingTemplate
        });
        this.props.onChangeTemplateData(this.state.editingTemplate);
    }

    handleTaskTemplateInform = (value) => {
        let { editingTemplate } = this.state;
        editingTemplate.informedEmployees = value;

        this.setState({
            editingTemplate
        });
        this.props.onChangeTemplateData(this.state.editingTemplate);
    }

    handleTaskActionsChange = (data) => {
        let { editingTemplate } = this.state;
        this.setState(state => {

            return {
                ...state,
                editingTemplate: {
                    ...editingTemplate,
                    taskActions: data
                },
            }
        })
        this.props.onChangeTemplateData(this.state.editingTemplate);
    }

    handleTaskInformationsChange = (data) => {
        let { editingTemplate } = this.state;
        this.setState(state => {
            return {
                ...state,
                editingTemplate: {
                    ...editingTemplate,
                    taskInformations: data
                },
            }
        })
        this.props.onChangeTemplateData(this.state.editingTemplate);
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
        var { editingTemplate, id, showMore } = this.state;

        const { department, user, translate, tasktemplates } = this.props;
        const { isProcess } = this.props;
        if (editingTemplate && editingTemplate.taskActions) taskActions = editingTemplate.taskActions;
        if (editingTemplate && editingTemplate.taskInformations) taskInformations = editingTemplate.taskInformations;

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

        console.log("editting tasktemplate: ", editingTemplate.taskActions, this.state.showMore)

        return (
            <React.Fragment>
                {/**Form chứa thông tin của mẫu công việc đang sửa */}
                <div className="row">
                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                        {/**Đơn vị của mẫu công việc */}
                        <div className={`form-group ${editingTemplate.errorOnUnit === undefined ? "" : "has-error"}`} >
                            <label className="control-label">{translate('task_template.unit')} <span style={{ color: "red" }}>*</span></label>
                            {usersInUnitsOfCompany !== undefined && editingTemplate.organizationalUnit !== "" &&
                                <SelectBox
                                    id={`edit-unit-select-box-${editingTemplate._id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        usersInUnitsOfCompany.map(x => {
                                            return { value: x.id, text: x.department };
                                        })
                                    }
                                    onChange={this.handleTaskTemplateUnit}
                                    value={editingTemplate.organizationalUnit}
                                    multiple={false}

                                />
                            }
                            <ErrorLabel content={this.state.editingTemplate.errorOnUnit} />
                        </div>
                    </div>
                    {
                        !isProcess &&
                        <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                            {/**Role có quyền xem mẫu công việc này */}
                            <div className={`form-group ${this.state.editingTemplate.errorOnRead === undefined ? "" : "has-error"}`} >
                                <label className="control-label">{translate('task_template.permission_view')} <span style={{ color: "red" }}>*</span></label>
                                {listRole && editingTemplate.readByEmployees &&
                                    <SelectBox
                                        id={`edit-read-select-box-${editingTemplate._id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            listRoles.map(x => { return { value: x._id, text: x.name } })
                                        }
                                        onChange={this.handleTaskTemplateRead}
                                        value={editingTemplate.readByEmployees}
                                        multiple={true}
                                        options={{ placeholder: `${translate('task_template.permission_view')}` }}
                                    />
                                }
                                <ErrorLabel content={this.state.editingTemplate.errorOnRead} />
                            </div>
                        </div>
                    }

                </div>

                <div className="row">
                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>

                        {/**Tên mẫu công việc này */}
                        <div className={`form-group ${this.state.editingTemplate.errorOnName === undefined ? "" : "has-error"}`} >
                            <label className="control-label">{translate('task_template.tasktemplate_name')} <span style={{ color: "red" }}>*</span></label>
                            <input type="Name" className="form-control" placeholder={translate('task_template.tasktemplate_name')} value={editingTemplate.name} onChange={this.handleTaskTemplateName} />
                            <ErrorLabel content={this.state.editingTemplate.errorOnName} />
                        </div>

                        {/**Độ ưu tiên mẫu công việc này */}
                        <div className="form-group" >
                            <label className="control-label">{translate('task_template.priority')}</label>
                            <select className="form-control" value={editingTemplate.priority} onChange={this.handleChangeTaskPriority}>
                                <option value={3}>{translate('task_template.high')}</option>
                                <option value={2}>{translate('task_template.medium')}</option>
                                <option value={1}>{translate('task_template.low')}</option>
                            </select>
                        </div>
                    </div>

                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>

                        {/**Mô tả mẫu công việc này */}
                        <div className={`form-group `} >
                            <label className="control-label" htmlFor="inputDescriptionTaskTemplate">{translate('task_template.description')} <span style={{ color: "red" }}>*</span></label>
                            <textarea rows={5} type="Description" className="form-control" id="inputDescriptionTaskTemplate" name="description" placeholder={translate('task_template.description')} value={editingTemplate.description} onChange={this.handleTaskTemplateDesc} />
                            {/* <ErrorLabel content={this.state.editingTemplate.errorOnDescription} /> */}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                        <div className='form-group' >

                            {/**Người thực hiện mẫu công việc này */}
                            <label className="control-label" >{translate('task_template.performer')}</label>
                            {allUnitsMember && editingTemplate.responsibleEmployees &&
                                <SelectBox
                                    id={isProcess ? `edit-responsible-select-box-${editingTemplate._id}-${id}` : `edit-responsible-select-box-${editingTemplate._id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={allUnitsMember}
                                    onChange={this.handleTaskTemplateResponsible}
                                    value={editingTemplate.responsibleEmployees}
                                    multiple={true}
                                    options={{ placeholder: `${translate('task_template.performer')}` }}
                                />
                            }
                        </div>
                        <div className='form-group' >

                            {/**Người phê duyệt mẫu công việc này */}
                            <label className="control-label">{translate('task_template.approver')}</label>
                            {allUnitsMember && editingTemplate.accountableEmployees &&
                                <SelectBox
                                    id={isProcess ? `edit-accountable-select-box-${editingTemplate._id}-${id}` : `edit-accountable-select-box-${editingTemplate._id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={allUnitsMember}
                                    onChange={this.handleTaskTemplateAccountable}
                                    value={editingTemplate.accountableEmployees}
                                    multiple={true}
                                    options={{ placeholder: `${translate('task_template.approver')}` }}
                                />
                            }
                        </div>
                        <div className='form-group' >
                            {/**Người hỗ trọ mẫu công việc này */}
                            <label className="control-label">{translate('task_template.consultant')}</label>
                            {allUnitsMember && editingTemplate.consultedEmployees &&
                                <SelectBox
                                    id={isProcess ? `edit-consulted-select-box-${editingTemplate._id}-${id}` : `edit-consulted-select-box-${editingTemplate._id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={allUnitsMember}
                                    onChange={this.handleTaskTemplateConsult}
                                    value={editingTemplate.consultedEmployees}
                                    multiple={true}
                                    options={{ placeholder: `${translate('task_template.consultant')}` }}
                                />
                            }
                        </div>
                        <div className='form-group' >

                            {/**Người quan sát mẫu công việc này */}
                            <label className="control-label">{translate('task_template.observer')}</label>
                            {allUnitsMember && editingTemplate.informedEmployees &&
                                <SelectBox
                                    id={isProcess ? `edit-informed-select-box-${editingTemplate._id}-${id}` : `edit-informed-select-box-${editingTemplate._id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={allUnitsMember}
                                    onChange={this.handleTaskTemplateInform}
                                    multiple={true}
                                    value={editingTemplate.informedEmployees}
                                    options={{ placeholder: `${translate('task_template.observer')}` }}
                                />
                            }
                        </div>
                    </div>

                    {showMore &&
                        <div>
                            {isProcess &&
                                <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                                    {/**Số ngày hoàn thành công việc dự kiến */}
                                    <div className={`form-group ${this.state.editingTemplate.errorOnNumberOfDaysTaken === undefined ? "" : "has-error"}`} >
                                        <label className="control-label" htmlFor="inputNumberOfDaysTaken">{translate('task_template.numberOfDaysTaken')}</label>
                                        <input type="number" className="form-control" id="inputNumberOfDaysTaken" value={editingTemplate.numberOfDaysTaken}
                                            placeholder={'Nhập số ngày hoàn thành dự kiến'}
                                            onChange={this.handleTaskTemplateNumberOfDaysTaken} />
                                        <ErrorLabel content={this.state.editingTemplate.errorOnNumberOfDaysTaken} />
                                    </div>
                                </div>
                            }

                            <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                                {/**Công thức tính điểm mẫu công việc này */}
                                <div className={`form-group ${this.state.editingTemplate.errorOnFormula === undefined ? "" : "has-error"}`} >
                                    <label className="control-label" htmlFor="inputFormula">{translate('task_template.formula')}</label>
                                    <input type="text" className="form-control" id="inputFormula" placeholder="progress/(dayUsed/totalDay) - (10-averageActionRating)*10 - 100*(1-p1/p2)" value={editingTemplate.formula} onChange={this.handleTaskTemplateFormula} />
                                    <ErrorLabel content={this.state.editingTemplate.errorOnFormula} />

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
                        <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                            {/**Các hoạt động mẫu công việc này */}
                            <ActionForm initialData={editingTemplate.taskActions} onDataChange={this.handleTaskActionsChange} />
                        </div>

                        <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                            {/**Các hoạt động mẫu công việc này */}
                            <InformationForm initialData={editingTemplate.taskInformations} onDataChange={this.handleTaskInformationsChange} />
                        </div>

                    </div>
                }
                {isProcess &&
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
const connectedEditTaskTemplate = connect(mapState, actionCreators)(withTranslate(EditTaskTemplate));
export { connectedEditTaskTemplate as EditTaskTemplate };
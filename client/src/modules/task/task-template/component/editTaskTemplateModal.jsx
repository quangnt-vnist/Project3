import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../redux/actions';
import { EditTaskTemplate } from './editTaskTemplate';
import { DialogModal } from '../../../../common-components';
import { TaskTemplateFormValidator } from './taskTemplateFormValidator';

class ModalEditTaskTemplate extends Component {

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
                formula: '',
                priority: 3,
                taskActions: [],
                taskInformations: []
            },

        };
    }

    static getDerivedStateFromProps(props, state) {
        if(props.taskTemplateId !== state.taskTemplateId){
            return {
                ...state,
                taskTemplateId: props.taskTemplateId,
                taskTemplate: props.taskTemplate,
                editingTemplate: {
                    _id: props.taskTemplate._id,
                    organizationalUnit: props.taskTemplate.organizationalUnit._id,
                    name: props.taskTemplate.name,
                    readByEmployees: props.taskTemplate.readByEmployees,
                    responsibleEmployees: props.taskTemplate.responsibleEmployees,
                    accountableEmployees: props.taskTemplate.accountableEmployees,
                    consultedEmployees: props.taskTemplate.consultedEmployees,
                    informedEmployees: props.taskTemplate.informedEmployees,
                    description: props.taskTemplate.description,
                    formula: props.taskTemplate.formula,
                    priority: props.taskTemplate.priority,
                    taskActions: props.taskTemplate.taskActions,
                    taskInformations: props.taskTemplate.taskInformations,
                },
                showActionForm: true,
            }
        }else return null;
    }

    handleSubmit = () => {
        const { editingTemplate } = this.state;
        this.props.editTaskTemplate(editingTemplate._id, editingTemplate);
    }

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
    
    validateTaskTemplateName = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateName(value);

        if (willUpdateState) {
            let {editingTemplate} = this.state;
            editingTemplate.name = value;
            editingTemplate.errorOnName = msg;
            this.setState({
                editingTemplate
            })
        }
        return msg == undefined;
    }

    validateTaskTemplateDesc = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateDescription(value);

        if (willUpdateState) {
            let {editingTemplate} = this.state;
            editingTemplate.description = value;
            editingTemplate.errorOnDescription = msg;
            this.setState({
                editingTemplate
            })
        }
        return msg == undefined;
    }

    validateTaskTemplateFormula = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value);

        if (willUpdateState) {
            let {editingTemplate} = this.state;
            editingTemplate.formula = value;
            editingTemplate.errorOnFormula = msg;
            this.setState({
                editingTemplate
            })
        }
        return msg == undefined;
    }
   
    validateTaskTemplateUnit = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateUnit(value);

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
        return msg == undefined;
    }

    validateTaskTemplateRead = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateRead(value);

        if (willUpdateState) {
            let {editingTemplate} = this.state;
            editingTemplate.readByEmployees = value;
            editingTemplate.errorOnRead = msg;
            this.setState({
                editingTemplate
            })
        }
        return msg == undefined;
    }

    onChangeTemplateData = (value) => {
        this.setState({
            editingTemplate: value
        })
    }

    render() {
        const { department, user, translate, tasktemplates } = this.props;
        const { editingTemplate, taskTemplateId } = this.state;
        console.log("editingTemplate", editingTemplate)

        return (
            <DialogModal
                modalID="modal-edit-task-template" isLoading={user.isLoading}
                formID="form-edit-task-template"
                title={translate('task_template.edit_tasktemplate')}
                func={this.handleSubmit}
                // disableSubmit={!this.isTaskTemplateFormValidated()}
                size={100}
            >
                <React.Fragment>
                    <EditTaskTemplate 
                        isTaskTemplate={true} 
                        taskTemplate={editingTemplate} 
                        taskTemplateId={taskTemplateId} onChangeTemplateData={this.onChangeTemplateData} 
                    />
                </React.Fragment>
            </DialogModal>
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
const connectedModalEditTaskTemplate = connect(mapState, actionCreators)(withTranslate(ModalEditTaskTemplate));
export { connectedModalEditTaskTemplate as ModalEditTaskTemplate };
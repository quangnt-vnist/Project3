import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../redux/actions';
import { DialogModal } from '../../../../common-components';
import { TaskTemplateFormValidator } from './taskTemplateFormValidator';
import { AddTaskTemplate } from './addTaskTemplate';

class ModalAddTaskTemplate extends Component {
    constructor(props) {
        super(props);

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
                creator: '',
                formula: '',
                priority: 3,
                taskActions: [],
                taskInformations: []
            },
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
        // const { newTemplate } = this.state;
        // this.props.addNewTemplate(newTemplate);
        // window.$("#addTaskTemplate").modal("hide");
        let { newTemplate } = this.state;
        const { department, user, translate, tasktemplates, isProcess } = this.props;

        let listRoles = [];
        if (user.roledepartments) {
            console.log('pppp');
            let listRole = user.roledepartments;
            for (let x in listRole.employees)
                listRoles.push(listRole.employees[x]._id);
        }
        console.log('list role', listRoles);
        await this.setState( state => {
            if(state.newTemplate.readByEmployees.length === 0){
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
        // let result =
        //     this.validateTaskTemplateUnit(this.state.newTemplate.organizationalUnit, false) &&
        //     this.validateTaskTemplateRead(this.state.newTemplate.readByEmployees, false) &&
        //     this.validateTaskTemplateName(this.state.newTemplate.name, false) &&
        //     this.validateTaskTemplateDescription(this.state.newTemplate.description, false) &&
        //     this.validateTaskTemplateFormula(this.state.newTemplate.formula, false);
        // return result;
    }
    
    
    validateTaskTemplateName = (value, willUpdateState=true) => {
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
        return msg === undefined;   
    }

    validateTaskTemplateDescription = (value, willUpdateState=true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateDescription(value);

        if (willUpdateState) {
            this.state.newTemplate.description = value;
            this.state.newTemplate.errorOnDescription = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msg === undefined;
    }

    validateTaskTemplateFormula = (value, willUpdateState=true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value);

        if (willUpdateState) {
            this.state.newTemplate.formula = value;
            this.state.newTemplate.errorOnFormula = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msg === undefined;
    }

    validateTaskTemplateUnit = (value, willUpdateState=true) => {
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
        return msg === undefined;
    }

    validateTaskTemplateRead = (value, willUpdateState=true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateRead(value);

        if (willUpdateState) {
            this.state.newTemplate.readByEmployees = value;
            this.state.newTemplate.errorOnRead = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msg === undefined;
    }

    onChangeTemplateData = (value) => {
        this.setState({
            newTemplate: value
        })
    }
    
    render() {
        const { user, translate } = this.props;

        return (                    
            <React.Fragment>
                <DialogModal
                    modalID="modal-add-task-template" isLoading={user.isLoading}
                    formID="form-add-task-template"
                    title={translate('task_template.add_tasktemplate')}
                    func={this.handleSubmit}
                    // disableSubmit={!this.isTaskTemplateFormValidated()}
                    size={100}
                >
                    <AddTaskTemplate onChangeTemplateData={this.onChangeTemplateData}/>
                </DialogModal>
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
const connectedModalAddTaskTemplate = connect(mapState, actionCreators)(withTranslate(ModalAddTaskTemplate));
export { connectedModalAddTaskTemplate as ModalAddTaskTemplate };
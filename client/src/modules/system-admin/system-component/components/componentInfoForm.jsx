import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SystemComponentActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';
import { DialogModal, ErrorLabel, SelectBox} from '../../../../common-components';

class ComponentInfoForm extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    // Thiet lap cac gia tri tu props vao state
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.componentId !== prevState.componentId) {
            return {
                ...prevState,
                componentId: nextProps.componentId,
                componentName: nextProps.componentName,
                componentDescription: nextProps.componentDescription,
                componentRoles: nextProps.componentRoles,
                componentLink: nextProps.componentLink,
                componentNameError: undefined,
                componentDescriptionError: undefined
            } 
        } else {
            return null;
        }
    }

    handleName = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = ValidationHelper.validateName(translate, value, 6, 255);
        this.setState({ 
            componentName: value,
            componentNameError: message
        });
    }

    handleDescription = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = ValidationHelper.validateDescription(translate, value);
        this.setState({ 
            componentDescription: value,
            componentDescriptionError: message
        });
    }

    handleLink = (value) => {
        this.setState({
            componentLink: value
        });
    }

    handleRoles = (value) => {
        this.setState({
            componentRoles: value
        });
    }

    isFormValidated = () => {
        let {componentName, componentDescription} = this.state;
        let {translate} = this.props;
        if(!ValidationHelper.validateName(translate, componentName).status  || !ValidationHelper.validateDescription(translate, componentDescription).status) return false;
        return true;
    }

    save = () => {
        const component = { 
            name: this.state.componentName, 
            description: this.state.componentDescription, 
            links: this.state.componentLink,
            roles: this.state.componentRoles 
        };

        if (this.isFormValidated()) return this.props.editSystemComponent(this.state.componentId, component);
    }

    render() { 
        const { translate, systemLinks, rootRoles } = this.props;
        const { componentId, componentName, componentDescription, componentLink, componentRoles, componentNameError, componentDescriptionError } = this.state;

        return ( 
            <React.Fragment>
                <DialogModal
                    func={this.save}
                    modalID="modal-edit-component-default"
                    formID="form-edit-component-default"
                    title={translate('manage_component.edit')}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-edit-component-default">
                        <div className={`form-group ${componentNameError===undefined?"":"has-error"}`}>
                            <label>{ translate('manage_component.name') }<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" value={componentName} onChange={this.handleName} />
                            <ErrorLabel content={componentNameError}/>
                        </div>
                        <div className={`form-group ${componentDescriptionError===undefined?"":"has-error"}`}>
                            <label>{ translate('manage_component.description') }<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" value={componentDescription} onChange={this.handleDescription} />
                            <ErrorLabel content={componentDescriptionError}/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_component.link') }</label>
                            <SelectBox
                                id={`select-component-default-link-${componentId}`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {
                                    systemLinks.list.map( link => {return {value: link._id, text: link.url}})
                                }
                                options={{placeholder: translate('system_admin.system_component.select_link')}}
                                onChange={this.handleLink}
                                value={componentLink}
                                multiple={true}
                            />
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_component.roles') }</label>
                            <SelectBox
                                id={`select-component-default-roles-${componentId}`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {
                                    rootRoles.list.map( role => {return {value: role._id, text: role.name}})
                                }
                                onChange={this.handleRoles}
                                value={componentRoles}
                                multiple={true}
                            />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
         );
    }
}
 
function mapState(state) {
    const { systemLinks, rootRoles } = state;
    return { systemLinks, rootRoles }
}
const actions = {
    editSystemComponent: SystemComponentActions.editSystemComponent
}
 
const connectedComponentInfoForm = connect(mapState, actions)(withTranslate(ComponentInfoForm));
export { connectedComponentInfoForm as ComponentInfoForm }
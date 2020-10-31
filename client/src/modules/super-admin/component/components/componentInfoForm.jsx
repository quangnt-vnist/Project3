import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ComponentActions } from '../redux/actions';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';
class ComponentInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    
    handleComponentDescription = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = ValidationHelper.validateDescription(translate, value);
        this.setState({ 
            componentDescription: value,
            componentDescriptionError: message 
        });
    }

    handleComponentLink = (value) => {
        this.setState({
            componentLink: value[0]
        });
    }

    handleComponentRoles = (value) => {
        this.setState({
            componentRoles: value
        });
    }

    save = () => {
        const component = {
            name: this.state.componentName,
            description: this.state.componentDescription,
            roles: this.state.componentRoles
        };

        if (this.isFormValidated()) {
            return this.props.editComponent(this.state.componentId, component);
        }
    }

    isFormValidated = () => {
        let {componentDescription} = this.state;
        let {translate} = this.props;
        if(!ValidationHelper.validateDescription(translate, componentDescription).status) return false;
        return true;
    }


    // Thiet lap cac gia tri tu props vao state
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.componentId !== prevState.componentId) {
            return {
                ...prevState,
                componentId: nextProps.componentId,
                componentName: nextProps.componentName,
                componentLink: nextProps.componentLink,
                componentDescription: nextProps.componentDescription,
                componentRoles: nextProps.componentRoles,
                componentDescriptionError: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, role, link } = this.props;
        const { componentId, componentName, componentDescription, componentLink, componentRoles, componentDescriptionError } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    func={this.save}
                    modalID="modal-edit-component"
                    formID="form-edit-component"
                    title={translate('manage_component.edit')}
                    disableSubmit={!this.isFormValidated()}
                >

                    {/* Form chỉnh sửa thông tin về component */}
                    <form id="form-edit-component">

                        {/* Tên của component */}
                        <div className="form-group">
                            <label>{translate('table.name')}<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" value={componentName} disabled />
                        </div>

                        {/* Thuộc về trang nào */}
                        <div className="form-group">
                            <label>{translate('manage_component.link')}</label>
                            <SelectBox
                                id={`component-link-${componentId}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={link.list.map(link => { return { value: link.id, text: link.url } })}
                                onChange={this.handleComponentLink}
                                value={componentLink}
                                multiple={true}
                                disabled={true}
                            />
                        </div>

                        {/* Mô tả về component	 */}
                        <div className={`form-group ${!componentDescriptionError ? "" : "has-error"}`}>
                            <label>{translate('table.description')}<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" value={componentDescription} onChange={this.handleComponentDescription} />
                            <ErrorLabel content={componentDescriptionError} />
                        </div>

                        {/* Những role có component này */}
                        <div className="form-group">
                            <label>{translate('manage_component.roles')}</label>
                            <SelectBox
                                id={`component-roles-${componentId}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={role.list.map(role => { return { value: role ? role._id : null, text: role ? role.name : "Role is deleted" } })}
                                onChange={this.handleComponentRoles}
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
    const { role, link } = state;
    return { role, link };
}

const getState = {
    editComponent: ComponentActions.edit,
}

export default connect(mapState, getState)(withTranslate(ComponentInfoForm));
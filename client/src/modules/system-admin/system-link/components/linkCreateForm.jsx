import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RootRoleActions } from '../../root-role/redux/actions';
import { SystemLinkActions } from '../redux/actions';
import SystemLinkValidator from './systemLinkValidator';
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../common-components';
class CreateLinkForm extends Component {
    constructor(props) {
        super(props);

        this.state = { }
    }

    componentDidMount() {
        this.props.getAllRootRoles();
    }

    handleUrl = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = SystemLinkValidator.validateUrl(translate, value);
        this.setState({ 
            linkUrl: value,
            linkUrlError: message
        });
    }

    handleDescription = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = SystemLinkValidator.validateDescription(translate, value);
        this.setState({ 
            linkDescription: value,
            linkDescriptionError: message
        });
    }

    handleCategory = (value) => {
        this.setState({
            linkCategory: value[0]
        });
    }

    handleRoles = (value) => {
        this.setState({
            linkRoles: value
        })
    }

    isFormValidated = () => {
        let {linkUrl, linkDescription} = this.state;
        let {translate} = this.props;
        if(!SystemLinkValidator.validateUrl(translate, linkUrl).status  || !SystemLinkValidator.validateDescription(translate, linkDescription).status) return false;
        return true;
    }

    save = () => {
        const { linkUrl, linkDescription, linkRoles, linkCategory } = this.state;
        if(this.isFormValidated()) {
            return this.props.createSystemLink({
                url: linkUrl,
                description: linkDescription,
                roles: linkRoles,
                category: linkCategory
            });
        } 
    }

    render() { 
        const { translate, rootRoles, systemLinks } = this.props;
        const { linkUrlError, linkDescriptionError } = this.state;
        
        return ( 
            <React.Fragment>
                <ButtonModal modalID="modal-create-page" button_name={translate('general.add')} title={translate('system_admin.system_link.add')}/>
                <DialogModal
                    modalID="modal-create-page"
                    formID="form-create-page"
                    title={translate('system_admin.system_link.add')}
                    func={this.save} disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-create-page">
                        <div className={`form-group ${!linkUrlError ? "" : "has-error"}`}>
                            <label>{ translate('system_admin.system_link.table.url') }<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" onChange={this.handleUrl}/>
                            <ErrorLabel content={linkUrlError}/>
                        </div>
                        <div className={`form-group ${!linkDescriptionError ? "" : "has-error"}`}>
                            <label>{ translate('system_admin.system_link.table.description') }<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" onChange={this.handleDescription}/>
                            <ErrorLabel content={linkDescriptionError}/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('system_admin.system_link.table.category') }<span className="text-red"> * </span></label>
                            <SelectBox
                                id={`select-link-default-category`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {
                                    systemLinks.categories.map(category => {return {value: category.name, text: category.name+"-"+category.description}})
                                }
                                onChange={this.handleCategory}
                                multiple={false}
                            />
                        </div>
                        <div className="form-group">
                            <label>{ translate('system_admin.system_link.table.roles') }</label>
                            <SelectBox
                                id={`select-link-default-roles`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {
                                    rootRoles.list.map( role => {return {value: role._id, text: role.name}})
                                }
                                onChange={this.handleRoles}
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
    const { rootRoles, systemLinks } = state;
    return { rootRoles, systemLinks }
}
const actions = {
    getAllRootRoles: RootRoleActions.getAllRootRoles,
    createSystemLink: SystemLinkActions.createSystemLink
}
 
const connectedCreateLinkForm = connect(mapState, actions) (withTranslate(CreateLinkForm))
export { connectedCreateLinkForm as CreateLinkForm }

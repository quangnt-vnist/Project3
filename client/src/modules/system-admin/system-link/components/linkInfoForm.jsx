import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RootRoleActions } from '../../root-role/redux/actions';
import { SystemLinkActions } from '../redux/actions';
import SystemLinkValidator from './systemLinkValidator';
import {DialogModal, ErrorLabel, SelectBox} from '../../../../common-components';

class LinkInfoForm extends Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount() {
        this.props.getAllRootRoles();
    }

    // Thiet lap cac gia tri tu props vao state
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.linkId !== prevState.linkId) {
            return {
                ...prevState,
                linkId: nextProps.linkId,
                linkUrl: nextProps.linkUrl,
                linkCategory: nextProps.linkCategory,
                linkDescription: nextProps.linkDescription,
                linkRoles: nextProps.linkRoles,
                linkUrlError: undefined,
                linkDescriptionError: undefined
            } 
        } else {
            return null;
        }
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
            linkCategory: value
        });
    }

    handleRoles = (value) => {
        this.setState({
            linkRoles: value
        });
    }

    isFormValidated = () => {
        let {linkUrl, linkDescription} = this.state;
        let {translate} = this.props;
        if(!SystemLinkValidator.validateUrl(translate, linkUrl).status  || !SystemLinkValidator.validateDescription(translate, linkDescription).status) return false;
        return true;
    }

    save = () => {
        const { linkId, linkUrl, linkDescription, linkRoles, linkCategory } = this.state;
        if(this.isFormValidated()) {
            return this.props.editSystemLink(linkId, {
                url: linkUrl,
                description: linkDescription,
                roles: linkRoles,
                category: linkCategory
            });
        }  
    }

    render() { 
        const { translate, rootRoles, systemLinks } = this.props;
        const { linkId, linkUrl, linkCategory, linkDescription, linkRoles, linkUrlError, linkDescriptionError } = this.state;
        
        return ( 
            <DialogModal
                size='50' func={this.save} isLoading={systemLinks.isLoading}
                modalID="modal-edit-link-default"
                formID="form-edit-link-default"
                title={translate('manage_link.edit')}
                msg_success={translate('manage_link.edit_success')}
                msg_faile={translate('manage_link.edit_faile')}
                disableSubmit={!this.isFormValidated()}
            >
                <form id="form-edit-link-default">
                    <div className={`form-group ${linkUrlError===undefined?"":"has-error"}`}>
                        <label>{ translate('manage_link.url') }<span className="text-red"> * </span></label>
                        <input type="text" className="form-control" value={linkUrl} onChange={this.handleUrl}/>
                        <ErrorLabel content={linkUrlError}/>
                    </div>
                    <div className={`form-group ${linkDescriptionError===undefined?"":"has-error"}`}>
                        <label>{ translate('manage_link.description') }<span className="text-red"> * </span></label>
                        <input type="text" className="form-control" value={linkDescription} onChange={this.handleDescription}/>
                        <ErrorLabel content={linkDescriptionError}/>
                    </div>
                    <div className="form-group">
                        <label>{ translate('manage_link.category') }<span className="text-red"> * </span></label>
                        <SelectBox
                            id={`select-link-default-category-${linkId}`}
                            className="form-control select2"
                            style={{width: "100%"}}
                            items = {
                                systemLinks.categories.map( category => {return {value: category.name, text: category.name+"-"+category.description}})
                            }
                            onChange={this.handleCategory}
                            value={linkCategory}
                            multiple={false}
                        />
                    </div>
                    <div className="form-group">
                        <label>{ translate('manage_link.roles') }</label>
                        <SelectBox
                            id={`select-link-default-roles-${linkId}`}
                            className="form-control select2"
                            style={{width: "100%"}}
                            items = {
                                rootRoles.list.map( role => {return {value: role._id, text: role.name}})
                            }
                            onChange={this.handleRoles}
                            value={linkRoles}
                            multiple={true}
                        />
                    </div>
                </form>
            </DialogModal>
        );
    }
}
 
function mapState(state) {
    const { rootRoles, systemLinks } = state
    return { rootRoles, systemLinks }
}
const actions = {
    getAllRootRoles: RootRoleActions.getAllRootRoles,
    editSystemLink: SystemLinkActions.editSystemLink
}
 
const connectedLinkInfoForm = connect(mapState, actions)(withTranslate(LinkInfoForm))
export { connectedLinkInfoForm as LinkInfoForm }
import React, { Component } from 'react';
import MainHeaderMenu from './mainHeaderMenu';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../modules/auth/redux/actions';
import { DialogModal, ErrorLabel } from '../../../common-components';
import { Link } from 'react-router-dom';
import './header.css';
import { getStorage } from '../../../config';
import ModalChangeUserInformation from './modalChangeUserInformation';
import { toast } from 'react-toastify';
import ValidationHelper from '../../../helpers/validationHelper';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() { 
        const { translate, auth } = this.props;
        const {
            oldPasswordError, newPasswordError, confirmPasswordError
        } = this.state;

        return ( 
            <React.Fragment>
                <header className="main-header">
                    <Link to='/' className="logo">
                        <span className="logo-mini"><img src='/logo-white.png'/></span>
                        <span className="logo-lg"><b className="text-white">DX Workspace</b></span>
                    </Link>
                    <nav className="navbar navbar-static-top">
                        <a className="sidebar-toggle" data-toggle="push-menu" data-expand-on-hover={true} role="button">
                            <span className="sr-only">Toggle navigation</span>
                        </a>
                        <MainHeaderMenu/>
                    </nav>
                </header>

                {/* Modal profile */}
                {
                    auth.user.name !== undefined &&
                    <ModalChangeUserInformation
                        userId={auth.user._id}
                        userName={auth.user.name}
                        userEmail={auth.user.email}
                    />
                }

                {/* Modal Security */}
                <DialogModal
                    modalID="modal-security"
                    formID="form-security" size="30"
                    title={translate('auth.security.title')}
                    func={this.saveNewPassword} disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-security" style={{padding: '10px 20px 10px 20px'}}>
                        <div className={`form-group ${!oldPasswordError ? "" : "has-error"}`}>
                            <label>{ translate('auth.security.old_password') }<span className="text-red">*</span></label>
                            <input className="form-control" type="password" onChange={this.handleOldPassword} />
                            <ErrorLabel content={oldPasswordError} />
                        </div>
                        <div className={`form-group ${!newPasswordError ? "" : "has-error"}`}>
                            <label>{ translate('auth.security.new_password') }<span className="text-red">*</span></label>
                            <input className="form-control" type="password" onChange={this.handleNewPassword} />
                            <ErrorLabel content={newPasswordError} />
                        </div>
                        <div className={`form-group ${!confirmPasswordError ? "" : "has-error"}`}>
                            <label>{ translate('auth.security.confirm_password') }<span className="text-red">*</span></label>
                            <input className="form-control" type="password" onChange={this.handleConfirmPassword} />
                            <ErrorLabel content={confirmPasswordError} />
                        </div>
                    </form>
                </DialogModal>
                
            </React.Fragment>
         );
    }

    handleOldPassword = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = ValidationHelper.validatePassword(translate, value);
        this.setState({
            oldPassword: value,
            oldPasswordError: message
        })
    }

    handleNewPassword = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = ValidationHelper.validatePassword(translate, value);
        this.setState({
            newPassword: value,
            newPasswordError: message
        })
    }

    handleConfirmPassword = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = ValidationHelper.validatePassword(translate, value);
        this.setState({
            confirmPassword: value,
            confirmPasswordError: message
        })
    }

    isFormValidated = () => {
        const { oldPassword, newPassword, confirmPassword } = this.state;
        let {translate} = this.props;
        if(
            !ValidationHelper.validatePassword(translate, oldPassword).status ||
            !ValidationHelper.validatePassword(translate, newPassword).status ||
            !ValidationHelper.validatePassword(translate, confirmPassword).status
        ) return false;
        return true;
    }

    saveNewPassword = () => {
        const {translate} = this.props;
        const { oldPassword, newPassword, confirmPassword } = this.state;
        if(newPassword !== confirmPassword){
            toast.error(translate('auth.validator.confirm_password_invalid'));
        }
        if (this.isFormValidated()) {
            return this.props.changePassword({
                password: oldPassword,
                new_password: newPassword
            });
        }
    }

    getLinkId = (path, links) => {
        
        var linkId;
        for (let index = 0; index < links.length; index++) {
            const element = links[index];
            if(element.url === path){
                linkId = element._id;
            }
        }

        return linkId;
    } 

    componentDidMount(){
        this.props.refresh();
        
        const currentRole = getStorage("currentRole");
        this.props.getLinksOfRole(currentRole)
            .then(res=>{
                const links = res.data.content;
                const path = window.location.pathname;
                const linkId = this.getLinkId(path, links);
                this.props.getComponentsOfUserInLink(currentRole, linkId);
            })
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = {
    changePassword: AuthActions.changePassword,
    refresh: AuthActions.refresh,
    getLinksOfRole: AuthActions.getLinksOfRole,
    getComponentsOfUserInLink: AuthActions.getComponentOfUserInLink
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(Header) );
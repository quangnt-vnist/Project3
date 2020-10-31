import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AuthActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import ForgotPassword from './forgotPassword';
import { getStorage } from '../../../config';

class Login extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            emailForgot: null,
            newPassword: null,
            confirmNewPassword: null,
            portal: getStorage('portal')
        };
    }

    handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    handleSubmit = () => {
        let { email, password, portal } = this.state;
		this.props.login({ email, password, portal});
    }

    forgotPassword = () => {
        const { emailForgot } = this.state;
        this.props.forgotPassword(emailForgot);
    }

    render() { 
        const { auth, translate } = this.props;
        
        return ( 
            <div className="hold-transition login-page" style={{ minHeight: '100vh' }}>
                <div className="login-box" style={{ marginTop: 0, marginBottom: 0, paddingTop: '7vh' }}>
                    <div className="login-logo">
                        <a href="/" style={{textShadow: '0 0 20px #FFFFFF, 0 0 20px #FFFFFF', fontSize: '48px'}}><b className="text-purple">DX Workspace</b></a>
                    </div>
                    {
                        auth.error &&
                        <div className="alert alert-danger alert-dismissible">
                            <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                            <i className="icon fa fa-ban" /> {translate(`auth.${auth.error}`)}
                        </div>
                    }
                    <div className="login-box-body">
                        <form> 
                            <div className="form-group has-feedback">
                                <input name="email" onChange={this.handleChange} type="email" className="form-control" placeholder={ translate('form.email') } required/>
                                <span className="glyphicon glyphicon-envelope form-control-feedback" />
                            </div>
                            <div className="form-group has-feedback">
                                <input name="password" onChange={this.handleChange} type="password" className="form-control" placeholder={ translate('form.password') } required/>
                                <span className="glyphicon glyphicon-lock form-control-feedback" />
                            </div>
                            <div className="form-group has-feedback">
                                <input name="portal" onChange={this.handleChange} type="text" className="form-control" placeholder="Portal" value={this.state.portal}/>
                                <span className="glyphicon glyphicon-hdd form-control-feedback" />
                            </div>
                            <div className="row">
                                <div className="col-xs-8">
                                    <a data-toggle="modal" href='#modal-reset-password'>{ translate('form.forgot_password') }</a><br />
                                    <ForgotPassword />
                                </div>
                                <div className="col-xs-4">
                                    <button type="button" className="btn btn-primary btn-block btn-flat" onClick={this.handleSubmit}>{ translate('form.signin') }</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = {
    login: AuthActions.login,
    forgotPassword: AuthActions.forgotPassword,
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(Login) );
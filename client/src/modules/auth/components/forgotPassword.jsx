import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AuthActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: null,
            otp: null,
            password: null,
            confirm: null
        }
    }

    handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    forgotPassword = (data) => {
        this.props.forgotPassword({
            portal: data.portal, 
            email: data.email
        });
    }

    render() { 
        const { translate, auth } = this.props;
        const { portal, email } = this.state;
        
        return ( 
            <div className="modal fade" id="modal-reset-password">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title">{ translate('form.reset_password') }</h4>
                    </div>
                    {
                        !auth.forgotPassword ?
                        <React.Fragment>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Portal</label>
                                    <input type="text" className="form-control" name="portal" onChange={ this.handleChange }/>
                                </div>
                                <div className="form-group">
                                    <label>{ translate('form.email') }</label>
                                    <input type="text" className="form-control" name="email" onChange={ this.handleChange }/>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">{ translate('form.close') }</button>
                                <button type="button" className="btn btn-primary" onClick={() => this.forgotPassword({
                                    portal,
                                    email
                                })}>{ translate('form.next') }</button>
                            </div>
                        </React.Fragment> : 
                        <React.Fragment>
                            <div className="modal-body">
                                <div className="alert alert-success alert-dismissible">
                                    <p>Mã xác thực đã được gửi đến <strong>{ this.state.email }</strong></p>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <a href="https://mail.google.com/" className="btn btn-primary" > Kiểm tra email </a>
                            </div>
                        </React.Fragment>
                    }
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
    forgotPassword: AuthActions.forgotPassword
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(ForgotPassword) );
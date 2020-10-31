import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';
import { UserActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';

class UserEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: [
                { id: 1, name: "disable", value: false },
                { id: 2, name: "enable", value: true }
            ]
        }
    }

    checkSuperAdmin = (roleArr) => {
        let superAdmin = this.props.role.list.find(obj => {
            return obj.name === "Super Admin"
        });

        var result = false;
        for (let i = 0; i < roleArr.length; i++) {
            if (roleArr[i] === superAdmin._id) {
                result = true;
                break;
            }
        }

        return result;
    }

    save = () => {
        if (this.isFormValidated()) {
            return this.props.edit(this.props.userId, {
                email: this.state.userEmail,
                name: this.state.userName,
                active: this.state.userActive,
                roles: this.state.userRoles
            });
        }
    }

    isFormValidated = () => {
        let {userName, userEmail} = this.state;
        let {translate} = this.props;
        if(!ValidationHelper.validateName(translate, userName).status || !ValidationHelper.validateEmail(translate, userEmail).status) return false;
        return true;
    }

    handleUserName = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = ValidationHelper.validateName(translate, value, 6, 255);
        this.setState({ 
            userName: value,
            userNameError: message
        });
    }

    handleUserEmail = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = ValidationHelper.validateEmail(translate, value);
        this.setState({ 
            userEmail: value,
            userEmailError: message
        });
    }

    handleRolesChange = (value) => {
        this.setState({
            userRoles: value
        });
    }

    handleUserActiveChange = (e) => {
        let value = e.target.value;
        this.setState({
            userActive: value
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.userId !== prevState.userId) {
            return {
                ...prevState,
                userId: nextProps.userId,
                userEmail: nextProps.userEmail,
                userName: nextProps.userName,
                userActive: nextProps.userActive,
                userRoles: nextProps.userRoles,
                userAvatar: nextProps.userAvatar,
                userEmailError: undefined,
                userNameError: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, role, user, auth } = this.props;
        const { userId, userEmail, userName, userActive, userRoles, status, userNameError, userEmailError, userAvatar } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    func={this.save} isLoading={user.isLoading}
                    modalID={`modal-edit-user`}
                    formID={`form-edit-user`}
                    title={translate('manage_user.edit')}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa thông tin tài khoản người dùng */}
                    <form id={`form-edit-user`}>
                        <div className="row">
                            <div className="form-group col-sm-3" style={{paddingTop: '25px'}}>
                                <img className="user-avatar" src={process.env.REACT_APP_SERVER+userAvatar}/>
                            </div>
                            <div className="form-group col-sm-9">
                                <div className={`form-group ${!userNameError ? "" : "has-error"}`}>
                                    <label>{translate('table.name')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" value={userName} onChange={this.handleUserName} />
                                    <ErrorLabel content={userNameError} />
                                </div>
                            </div>
                            {
                                this.checkSuperAdmin(userRoles) ? // Là super admin của công ty
                                    <React.Fragment>
                                        <div className="form-group col-sm-3">
                                            <label>{translate('table.status')}<span className="text-red">*</span></label>
                                            <select
                                                className="form-control"
                                                style={{ width: '100%' }}
                                                value={userActive}
                                                disabled={true}>
                                                {
                                                    status.map(result => <option key={result.id} value={result.value}>{translate(`manage_user.${result.name}`)}</option>)
                                                }
                                            </select>
                                        </div>
                                        <div className={`form-group col-sm-6 ${!userEmailError ? "" : "has-error"}`}>
                                            <label>{translate('table.email')}<span className="text-red">*</span></label>
                                            {
                                                auth.user._id === userId ?
                                                    <input type="text" className="form-control" value={userEmail} onChange={this.handleUserEmail} /> :
                                                    <input type="text" className="form-control" value={userEmail} disabled />
                                            }
                                            <ErrorLabel content={userEmailError} />
                                        </div>
                                    </React.Fragment> :
                                    <React.Fragment>
                                    <div className="form-group col-sm-3">
                                        <label>{translate('table.status')}<span className="text-red">*</span></label>
                                        <select
                                            className="form-control"
                                            style={{ width: '100%' }}
                                            value={userActive}
                                            onChange={this.handleUserActiveChange}>
                                            {
                                                status.map(result => <option key={result.id} value={result.value}>{translate(`manage_user.${result.name}`)}</option>)
                                            }
                                        </select>
                                    </div>
                                        <div className={`form-group col-sm-6 ${!userEmailError ? "" : "has-error"}`}>
                                            <label>{translate('table.email')}<span className="text-red">*</span></label>
                                            <input type="text" className="form-control" value={userEmail} onChange={this.handleUserEmail} />
                                            <ErrorLabel content={userEmailError} />
                                        </div>
                                    </React.Fragment>
                            }
                        </div>
                        {
                            this.checkSuperAdmin(userRoles) && auth.user._id !== userId ?
                                null :
                                <div className="form-group">
                                    <label>{translate('manage_user.roles')}</label>
                                    <SelectBox
                                        id={`user-role-form${userId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            this.checkSuperAdmin(userRoles) ? // Neu tai khoan nay hien tai khong co role la Super Admin
                                                role.list.map(role => { return { value: role ? role._id : null, text: role ? role.name : "Role is deleted" } }) :
                                                role.list.filter(role => {
                                                    return role && role.name !== 'Super Admin'
                                                }).map(role => { return { value: role ? role._id : null, text: role ? role.name : "Role is deleted" } })
                                        }
                                        onChange={this.handleRolesChange}
                                        value={userRoles}
                                        multiple={true}
                                    />
                                </div>
                        }
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { user, role, auth } = state;
    return { user, role, auth };
}

const action = {
    edit: UserActions.edit
}


export default connect(mapStateToProps, action)(withTranslate(UserEditForm));
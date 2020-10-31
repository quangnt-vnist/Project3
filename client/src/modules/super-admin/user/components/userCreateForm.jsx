import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../common-components';
import { UserActions } from '../redux/actions';
import { RoleActions } from '../../role/redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';

class UserCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    save = () => {
        if (this.isFormValidated()) {
            return this.props.create({
                name: this.state.userName,
                email: this.state.userEmail,
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

    componentDidMount() {
        this.props.getRoles();
    }

    render() {
        const { translate, role, user } = this.props;
        const { userEmailError, userNameError } = this.state;

        const items = role.list.filter(role => {
            return role && role.name !== 'Super Admin'
        }).map(role => { return { value: role ? role._id : null, text: role ? role.name : "Role is deleted" } })

        return (
            <React.Fragment>
                {/* Button thêm tài khoản người dùng mới */}
                <ButtonModal modalID="modal-create-user" button_name={translate('manage_user.add')} title={translate('manage_user.add_title')} />

                <DialogModal
                    modalID="modal-create-user" isLoading={user.isLoading}
                    formID="form-create-user"
                    title={translate('manage_user.add_title')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    {/* Form thêm tài khoản người dùng mới */}
                    <form id="form-create-user" onSubmit={() => this.save(translate('manage_user.add_success'))}>

                        {/* Tên người dùng */}
                        <div className={`form-group ${!userNameError ? "" : "has-error"}`}>
                            <label>{translate('table.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleUserName} />
                            <ErrorLabel content={userNameError} />
                        </div>

                        {/* Email */}
                        <div className={`form-group ${!userEmailError ? "" : "has-error"}`}>
                            <label>{translate('table.email')}<span className="text-red">*</span></label>
                            <input type="email" className="form-control" onChange={this.handleUserEmail} />
                            <ErrorLabel content={userEmailError} />
                        </div>

                        {/* Phân quyền được cấp */}
                        <div className="form-group">
                            <label>{translate('manage_user.roles')}</label>
                            {items.length !== 0 &&
                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                    id={`user-role-form-create`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={items}
                                    onChange={this.handleRolesChange}
                                    multiple={true}
                                />
                            }
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { user, role } = state;
    return { user, role };
}

const mapDispatchToProps = {
    create: UserActions.create,
    getRoles: RoleActions.get
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(UserCreateForm));
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, SelectBox } from '../../../../common-components';

import { UserActions } from '../../../super-admin/user/redux/actions';
import { RoleActions } from '../../../super-admin/role/redux/actions';

import './employeeInOrganizationalUnit.css'

class EmployeeInOrganizationalUnitEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchItems: [],
        };
    }

    componentDidMount() {
        this.props.getUser();
    }

    handleDeansChange = (value, id) => {
        let { roleDeans } = this.state;
        roleDeans = roleDeans.map(x => {
            if (x.id === id) {
                x.users = value
            }
            return x;
        });
        this.setState({
            roleDeans: roleDeans
        });
    }

    handleViceDeansChange = (value, id) => {
        let { roleViceDeans } = this.state;
        roleViceDeans = roleViceDeans.map(x => {
            if (x.id === id) {
                x.users = value
            }
            return x;
        });
        this.setState({
            roleViceDeans: roleViceDeans
        });
    }


    /** Bắt sự kiện xoá nhân viên đơn vị */
    handleDelete = (userId, roleId) => {
        let { roleEmployees } = this.state;
        roleEmployees = roleEmployees.map(x => {
            if (x.id === roleId) {
                x = { ...x, users: x.users.filter(y => y !== userId) }
            }
            return x
        })
        this.setState({
            roleEmployees: roleEmployees
        })
    }

    /** Bắt sự kiện thêm nhân viên đơn vị */
    handleAdd = (id) => {
        let { roleEmployees } = this.state;
        let userEmployees = this.refs[`employees${id}`].getValue();
        roleEmployees = roleEmployees.map(x => {
            if (x.id === id) {
                x = { ...x, users: x.users.concat(userEmployees) }
            }
            return x
        })
        this.setState({
            roleEmployees: roleEmployees
        })
        window.$(`#employee-unit-${id}`).val(null).trigger("change");
    }

    /** Function bắt sự lưu thay đổi cơ cấu tổ chức*/
    save = () => {
        let { roleDeans, roleViceDeans, roleEmployees } = this.state;
        roleDeans.forEach(x => {
            x = { ...x, showAlert: false, editRoleInfo: false }
            this.props.edit(x);
        });
        roleViceDeans.forEach(x => {
            x = { ...x, showAlert: false, editRoleInfo: false }
            this.props.edit(x);
        });
        roleEmployees.forEach((x, index) => {
            let users = this.refs[`employees${x.id}`].getValue();
            if (roleEmployees.length - 1 === index) {
                x = { ...x, users: x.users.concat(users), editRoleInfo: false }
            } else {
                x = { ...x, users: x.users.concat(users), showAlert: false, editRoleInfo: false }
            }
            this.props.edit(x);
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            let roleDeans = nextProps.department[0].deans.map(x => {
                let infoRole = nextProps.role.find(y => y._id === x._id);
                return { id: x._id, name: x.name, parents: x.parents, users: infoRole.users.map(y => y.userId._id) }
            }),
                roleViceDeans = nextProps.department[0].viceDeans.map(x => {
                    let infoRole = nextProps.role.find(y => y._id === x._id);
                    return { id: x._id, name: x.name, parents: x.parents, users: infoRole.users.map(y => y.userId._id) }
                }),
                roleEmployees = nextProps.department[0].employees.map(x => {
                    let infoRole = nextProps.role.find(y => y._id === x._id);
                    return { id: x._id, name: x.name, parents: x.parents, users: infoRole.users.map(y => y.userId._id) }
                });
            return {
                ...prevState,
                _id: nextProps._id,
                roleDeans: roleDeans,
                roleViceDeans: roleViceDeans,
                roleEmployees: roleEmployees,
            }
        } else {
            return null;
        }
    }

    render() {
        let { translate, user } = this.props;

        const { _id, roleEmployees, roleDeans, roleViceDeans, textSearch } = this.state;

        let userlist = user.list;
        console.log(roleDeans);

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-unit${_id}`} isLoading={false}
                    formID={`form-edit-unit${_id}`}
                    title={translate('human_resource.manage_department.edit_unit')}
                    func={this.save}
                    disableSubmit={false}
                >
                    <form className="form-group" id={`form-edit-unit${_id}`}>
                        {/* Trưởng đơn vị */}
                        <fieldset className="scheduler-border" style={{ marginBottom: 10, paddingBottom: 10 }}>
                            <legend className="scheduler-border" style={{ marginBottom: 0 }}><h4 className="box-title">{translate('human_resource.manage_department.dean_unit')}</h4></legend>
                            {roleDeans && roleDeans.map((x, index) => (
                                < div className="form-group" key={index} style={{ marginBottom: 0 }}>
                                    <label>{x.name}</label>
                                    <SelectBox
                                        id={`dean-unit-${x.id}`}
                                        multiple={true}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={x.users}
                                        items={user.list.map(y => { return { value: y._id, text: `${y.name} (${y.email})` } })}
                                        onChange={(e) => this.handleDeansChange(e, x.id)}
                                    />
                                </div>
                            ))}
                        </fieldset>
                        {/* Phó đơn vị */}
                        <fieldset className="scheduler-border" style={{ marginBottom: 10, paddingBottom: 10 }}>
                            <legend className="scheduler-border" style={{ marginBottom: 0 }}><h4 className="box-title">{translate('human_resource.manage_department.vice_dean_unit')}</h4></legend>
                            {roleViceDeans && roleViceDeans.map((x, index) => (
                                < div className="form-group" key={index} style={{ marginBottom: 0 }}>
                                    <label>{x.name}</label>
                                    <SelectBox
                                        id={`vice_dean-unit-${x.id}`}
                                        className="form-control select2"
                                        multiple={true}
                                        style={{ width: "100%" }}
                                        value={x.users}
                                        items={user.list.map(y => { return { value: y._id, text: `${y.name} (${y.email})` } })}
                                        onChange={(e) => this.handleViceDeansChange(e, x.id)}
                                    />
                                </div>
                            ))}
                        </fieldset>
                        {/* Nhân viên đơn vị */}
                        <h4 style={{ marginBottom: 0, marginTop: 40 }}>{translate('human_resource.manage_department.employee_unit')}</h4>
                        {roleEmployees && roleEmployees.map((x, index) => {
                            let infoEmployee = [], users = x.users;
                            for (let n in users) {
                                infoEmployee = userlist.filter(y => y._id === users[n]).concat(infoEmployee)
                            }
                            return (
                                <fieldset key={index} className="scheduler-border" style={{ marginBottom: 10, paddingBottom: 10 }}>
                                    <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">{x.name}</h4></legend>
                                    <div className="form-group" key={index} style={{ marginBottom: 0 }}>
                                        <div className="employeeBox">
                                            <SelectBox
                                                id={`employee-unit-${x.id}`}
                                                ref={`employees${x.id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                onChange={this.handleEmployeeChange}
                                                multiple={true}
                                                items={user.list.map(y => { return { value: y._id, text: `${y.name} (${y.email})` } })}
                                            />
                                        </div>
                                        <button type="button" className="btn btn-success pull-right" style={{ marginBottom: 5 }} onClick={() => this.handleAdd(x.id)}>{translate('human_resource.manage_department.add_employee_unit')}</button>
                                    </div>
                                    <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                                        <thead>
                                            <tr>
                                                <th>{translate('table.employee_name')}</th>
                                                <th>{translate('human_resource.manage_department.email_employee')}</th>
                                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                infoEmployee.length !== 0 &&
                                                infoEmployee.map((user, index) => (
                                                    <tr key={index}>
                                                        <td style={{ textAlign: "left" }}>{user.name}</td>
                                                        <td style={{ textAlign: "left" }}>{user.email}</td>
                                                        <td>
                                                            <a className="delete" title="Delete" onClick={() => this.handleDelete(user._id, x.id)}><i className="material-icons"></i></a>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    {
                                        (infoEmployee.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                    }
                                </fieldset>
                            )
                        })}

                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { user } = state;
    return { user };
};

const actionCreators = {
    edit: RoleActions.edit,
    getUser: UserActions.get,
};

const editFrom = connect(mapState, actionCreators)(withTranslate(EmployeeInOrganizationalUnitEditForm));
export { editFrom as EmployeeInOrganizationalUnitEditForm };
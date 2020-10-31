import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SearchBar, DeleteNotification, PaginateBar, DataTableSetting, ToolTip } from '../../../../common-components';

import { RoleActions } from '../redux/actions';
import { UserActions } from '../../user/redux/actions';

import RoleCreateForm from './roleCreateForm';
import RoleInfoForm from './roleInfoForm';

import { ROLE_TYPE } from '../../../../helpers/constants';

class RoleTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 10,
            page: 1,
            option: 'name', // Mặc định tìm kiếm theo tên
            value: ''
        }
    }
    
    // Cac ham xu ly du lieu voi modal
    handleEdit = (role) => {
        this.setState({
            currentRow: role
        }, () => window.$('#modal-edit-role').modal('show'));
    }

    // Cac ham thiet lap va tim kiem gia tri
    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = () => {
        const data = {
            limit: this.state.limit,
            page: 1,
            key: this.state.option,
            value: this.state.value
        };
        this.props.get(data);
    }

    setPage = (page) => {
        this.setState({ page }, () => {
            const data = {
                limit: this.state.limit,
                page: page,
                key: this.state.option,
                value: this.state.value
            };
            this.props.get(data);
        });
    }

    setLimit = (number) => {
        this.setState({ limit: number }, () => {
            const data = {
                limit: number,
                page: this.state.page,
                key: this.state.option,
                value: this.state.value
            };
            this.props.get(data);
        });
    }

    componentDidMount() {
        this.props.get();
        this.props.get({ page: this.state.page, limit: this.state.limit });
        this.props.getUser();
    }

    deleteRole = (roleId) => {
        this.props.destroy(roleId);
    }

    render() {
        const { role, translate } = this.props;
        const { currentRow, option } = this.state;

        return (
            <React.Fragment>

                {/* Button thêm phân quyền mới */}
                <RoleCreateForm />

                {/* Form chỉnh sửa thông tin phân quyền */}
                {
                    currentRow &&
                    <RoleInfoForm
                        roleId={currentRow._id}
                        roleName={currentRow.name}
                        roleType={currentRow.type ? currentRow.type.name : null}
                        roleParents={currentRow.parents.map(parent => parent ? parent._id : null)}
                        roleUsers={currentRow.users.map(user => user && user.userId ? user.userId._id : null)}
                    />
                }

                {/* Thanh tìm kiếm */}
                <SearchBar
                    columns={[
                        { title: translate('manage_role.name'), value: 'name' }
                    ]}
                    option={option}
                    setOption={this.setOption}
                    search={this.searchWithOption}
                />

                {/* Bảng dữ liệu phân quyền */}
                <table className="table table-hover table-striped table-bordered" id="table-manage-role">
                    <thead>
                        <tr>
                            <th>{translate('manage_role.name')}</th>
                            <th>{translate('manage_role.extends')}</th>
                            <th>{translate('manage_role.users')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>
                                {translate('table.action')}
                                <DataTableSetting
                                    columnName={translate('table.action')}
                                    columnArr={[
                                        translate('manage_role.name'),
                                        translate('manage_role.extends'),
                                        translate('manage_role.users')
                                    ]}
                                    limit={this.state.limit}
                                    setLimit={this.setLimit}
                                    tableId="table-manage-role"
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            role.listPaginate && role.listPaginate.length > 0 ?
                                role.listPaginate.map(role =>
                                    <tr key={`roleList${role._id}`}>
                                        <td> {role.name} </td>
                                        <td><ToolTip dataTooltip={role.parents.map(parent => parent ? parent.name : "Parent role is deleted")} /></td>
                                        <td><ToolTip dataTooltip={role.users.map(user => user && user.userId ? user.userId.name : "Role is deleted")} /></td>
                                        <td style={{ textAlign: 'center' }}>
                                            <a className="edit" href={`#${role._id}`} onClick={() => this.handleEdit(role)}><i className="material-icons">edit</i></a>
                                            {
                                                role.type && role.type.name === ROLE_TYPE.COMPANY_DEFINED &&
                                                <DeleteNotification
                                                    content={translate('manage_role.delete')}
                                                    data={{ id: role._id, info: role.name }}
                                                    func={this.props.destroy}
                                                />
                                            }
                                        </td>
                                    </tr>
                                ) : role.isLoading ?
                                    <tr><td colSpan={'4'}>{translate('confirm.loading')}</td></tr> :
                                    <tr><td colSpan={'4'}>{translate('confirm.no_data')}</td></tr>
                        }
                    </tbody>
                </table>

                {/* PaginateBar */}
                <PaginateBar display={role.listPaginate.length} total={role.list.length} pageTotal={role.totalPages} currentPage={role.page} func={this.setPage} />
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { role } = state;
    return { role };
}

const mapDispatchToProps = {
    get: RoleActions.get,
    getUser: UserActions.get,
    destroy: RoleActions.destroy
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(RoleTable));
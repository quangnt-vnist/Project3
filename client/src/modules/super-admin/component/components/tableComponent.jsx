import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { PaginateBar, DataTableSetting, SearchBar, ToolTip } from '../../../../common-components';

import { ComponentActions } from '../redux/actions';
import { LinkActions } from '../../link/redux/actions';
import { RoleActions } from '../../role/redux/actions';

import ComponentInfoForm from './componentInfoForm';

class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 10,
            page: 1,
            option: 'name', // Mặc định tìm kiếm theo tên
            value: ''
        }
    }

    componentDidMount() {
        let {page, limit} = this.state;
        this.props.getLinks({ type: "active" });
        this.props.get({ type: "active" });
        this.props.get({ type: "active", page, limit });
        this.props.getRoles();
    }
    
    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = () => {
        let {option, limit, value} = this.state;
        const params = {
            type: "active",
            limit,
            page: 1,
            key: option,
            value
        };
        this.props.get(params);
    }

    setPage = (page) => {
        this.setState({ page });
        let {option, limit, value} = this.state;
        const params = {
            type: "active",
            limit,
            page,
            key: option,
            value
        };
        this.props.get(params);
    }

    setLimit = (number) => {
        this.setState({ limit: number });
        let {option, value, page} = this.state;
        const params = {
            type: "active",
            limit: number,
            page,
            key: option,
            value
        };
        this.props.get(params);
    }

    // Cac ham xu ly du lieu voi modal
    handleEdit = (component) => {
        this.setState({
            currentRow: component
        }, () => window.$('#modal-edit-component').modal('show'));
    }

    render() {
        const { component, translate } = this.props;
        const { currentRow } = this.state;

        return (
            <React.Fragment>
                {/* Form chỉnh sửa thông tin về component */}
                {
                    currentRow &&
                    <ComponentInfoForm
                        componentId={currentRow._id}
                        componentName={currentRow.name}
                        componentLink={currentRow.links.map(link=>link._id)}
                        componentDescription={currentRow.description}
                        componentRoles={currentRow.roles.map(role => role && role.roleId ? role.roleId._id : null)}
                    />
                }

                {/* Thanh tìm kiếm */}
                <SearchBar
                    columns={[
                        { title: translate('manage_component.name'), value: 'name' },
                        { title: translate('manage_component.description'), value: 'description' },
                    ]}
                    option={this.state.option}
                    setOption={this.setOption}
                    search={this.searchWithOption}
                />

                {/* Bảng dữ liệu các components */}
                <table className="table table-hover table-striped table-bordered" id="table-manage-component">
                    <thead>
                        <tr>
                            <th>{translate('manage_component.name')}</th>
                            <th>{translate('manage_component.link')}</th>
                            <th>{translate('manage_component.description')}</th>
                            <th>{translate('manage_component.roles')}</th>
                            <th style={{ width: "120px" }}>
                                {translate('table.action')}
                                <DataTableSetting
                                    columnArr={[
                                        translate('manage_component.name'),
                                        translate('manage_component.link'),
                                        translate('manage_component.description'),
                                        translate('manage_component.roles')
                                    ]}
                                    limit={this.state.limit}
                                    setLimit={this.setLimit}
                                    tableId="table-manage-component"
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            component.listPaginate && component.listPaginate.length > 0 ?
                                component.listPaginate.map(component =>
                                    <tr key={component._id}>
                                        <td>{component.name}</td>
                                        <td>{component.links.map(link=>`${link.url} `)}</td>
                                        <td>{component.description}</td>
                                        <td><ToolTip dataTooltip={component.roles.map(role => role && role.roleId ? role.roleId.name : "Role is deleted")} /></td>
                                        <td style={{ textAlign: 'center' }}>
                                            <a className="edit" onClick={() => this.handleEdit(component)}><i className="material-icons">edit</i></a>
                                        </td>
                                    </tr>
                                ) : component.isLoading ?
                                    <tr><td colSpan={"5"}>{translate('confirm.loading')}</td></tr> :
                                    <tr><td colSpan={"5"}>{translate('confirm.no_data')}</td></tr>
                        }
                    </tbody>
                </table>

                {/* PaginateBar */}
                <PaginateBar display={component.listPaginate.length} total={component.list.length}  pageTotal={component.totalPages} currentPage={component.page} func={this.setPage} />

            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { component } = state;
    return { component };
}

const getState = {
    get: ComponentActions.get,
    destroy: ComponentActions.destroy,
    getLinks: LinkActions.get,
    getRoles: RoleActions.get,
}

export default connect(mapState, getState)(withTranslate(TableComponent));
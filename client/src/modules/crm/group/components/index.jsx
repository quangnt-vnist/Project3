import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CrmGroupActions } from '../redux/actions';
import { SearchBar, PaginateBar, DataTableSetting, ConfirmNotification } from '../../../../common-components';
import CreateGroupForm from './createForm';
import EditGroupForm from './editForm';
class CrmGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 5,
            page: 0,
            option: 'name',
            value: ''
        }
    }

    render() {
        const { crm, translate } = this.props;
        const { list } = crm.groups;
        const { option, limit, page, groupIdEdit } = this.state;

        let pageTotal = (crm.groups.totalDocs % limit === 0) ?
            parseInt(crm.groups.totalDocs / limit) :
            parseInt((crm.groups.totalDocs / limit) + 1);
        let cr_page = parseInt((page / limit) + 1);

        return (
            <div className="box">
                <div className="box-body">
                    <CreateGroupForm />
                    {groupIdEdit && <EditGroupForm groupIdEdit={groupIdEdit} />}

                    <SearchBar
                        columns={[
                            { title: translate('crm.group.name'), value: 'name' },
                            { title: translate('crm.group.code'), value: 'code' },
                            { title: translate('crm.group.description'), value: 'description' },
                        ]}
                        option={option}
                        setOption={this.setOption}
                        search={this.searchWithOption}
                    />
                    <table className="table table-hover table-striped table-bordered" id="table-manage-crm-group" style={{ marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th>{translate('crm.group.name')}</th>
                                <th>{translate('crm.group.code')}</th>
                                <th>{translate('crm.group.description')}</th>
                                <th style={{ width: "120px" }}>
                                    {translate('table.action')}
                                    <DataTableSetting
                                        columnArr={[
                                            translate('crm.group.name'),
                                            translate('crm.group.code'),
                                            translate('crm.group.description'),
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        tableId="table-manage-crm-group"
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                list && list.length > 0 ?
                                    list.map(gr =>
                                        <tr key={gr._id}>
                                            <td>{gr.name}</td>
                                            <td>{gr.code}</td>
                                            <td>{gr.description}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <a className="text-green" onClick={() => this.handleInfo(gr._id)}><i className="material-icons">visibility</i></a>
                                                <a className="text-yellow" onClick={() => this.handleEditGroup(gr._id)}><i className="material-icons">edit</i></a>
                                                <ConfirmNotification
                                                    icon="question"
                                                    title="Xóa thông tin về khách hàng"
                                                    content="<h3>Xóa thông tin khách hàng</h3>"
                                                    name="delete"
                                                    className="text-red"
                                                    func={() => this.deleteGroup(gr._id)}
                                                />
                                            </td>
                                        </tr>
                                    ) : crm.groups.isLoading ?
                                        <tr><td colSpan={4}>{translate('general.loading')}</td></tr> :
                                        <tr><td colSpan={4}>{translate('general.no_data')}</td></tr>
                            }
                        </tbody>
                    </table>

                    {/* PaginateBar */}
                    <PaginateBar pageTotal={pageTotal} currentPage={cr_page} func={this.setPage} />
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.props.getGroups(this.state);
    }

    // Cac ham thiet lap va tim kiem gia tri
    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = async () => {
        const data = {
            limit: this.state.limit,
            page: 1,
            key: this.state.option,
            value: this.state.value
        };
        await this.props.getGroups(data);
    }

    setPage = (pageNumber) => {
        let { limit } = this.state;
        let page = (pageNumber - 1) * (limit);

        this.setState({
            page: parseInt(page),
        }, () => this.props.getGroups(this.state));
    }

    setLimit = (number) => {
        this.setState({ limit: number });
        const data = {
            limit: number,
            page: this.state.page,
            key: this.state.option,
            value: this.state.value
        };
        this.props.getGroups(data);
    }

    deleteGroup = async (id) => {
        if (id) {
            await this.props.deleteGroup(id);
        }
    }

    handleEditGroup = (id) => {
        this.setState({
            ...this.state,
            groupIdEdit: id,
        }, () => window.$('#modal-edit-group').modal('show'));
    }
}


function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
    getGroups: CrmGroupActions.getGroups,
    deleteGroup: CrmGroupActions.deleteGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmGroup));
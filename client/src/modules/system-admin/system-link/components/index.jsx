import React, { Component } from 'react';
import {connect} from 'react-redux';

import { SystemLinkActions } from '../redux/actions';

import { LinkInfoForm } from './linkInfoForm';
import { CreateLinkForm } from './linkCreateForm';

import { SearchBar, DataTableSetting, PaginateBar, DeleteNotification, ModalEditButton } from '../../../../common-components';

import { withTranslate } from 'react-redux-multilingual';
class ManageLinkSystem extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            limit: 10,
            page: 1,
            option: 'url', //mặc định tìm kiếm theo tên
            value: ''
        }
    }

    componentDidMount() {
        this.props.getAllSystemLinks();
        this.props.getAllSystemLinks({ page: this.state.page, limit: this.state.limit });
        this.props.getAllSystemLinkCategories();
    }

    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = () => {
        this.props.getAllSystemLinks({
            limit: this.state.limit,
            page: 1,
            key: this.state.option,
            value: this.state.value
        });
    }

    setPage = (page) => {
        this.setState({ page }, () => {
            this.props.getAllSystemLinks({
                limit: this.state.limit,
                page: page,
                key: this.state.option,
                value: this.state.value
            });
        });
    }

    setLimit = (number) => {
        this.setState({ limit: number }, () => {
            this.props.getAllSystemLinks({ 
                limit: number, 
                page: this.state.page,
                key: this.state.option,
                value: this.state.value
            });
        });

    }

    // Cac ham xu ly du lieu voi modal
    handleEdit = (link) => {
        this.setState({ currentRow: link }, () => {
            window.$('#modal-edit-link-default').modal('show');
        });
    }

    render() { 
        const { translate, systemLinks } = this.props;
        const {currentRow} = this.state;
        
        return ( 
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <React.Fragment>
                        <CreateLinkForm/>
                        {
                            currentRow &&
                            <LinkInfoForm
                                linkId={currentRow._id}
                                linkUrl={currentRow.url}
                                linkCategory={currentRow.category}
                                linkDescription={currentRow.description}
                                linkRoles={currentRow.roles.map(role => role._id)}
                            />
                        }
                        <SearchBar 
                            columns={[
                                { title: translate('system_admin.system_link.table.url'), value:'url' },
                                { title: translate('system_admin.system_link.table.category'), value:'category' },
                                { title: translate('system_admin.system_link.table.description'), value:'description' },
                            ]}
                            option={this.state.option}
                            setOption={this.setOption}
                            search={this.searchWithOption}
                        />
                        
                        <table className="table table-hover table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>{ translate('system_admin.system_link.table.url') }</th>
                                    <th>{ translate('system_admin.system_link.table.category') }</th>
                                    <th>{ translate('system_admin.system_link.table.description') }</th>
                                    <th>{ translate('system_admin.system_link.table.roles') }</th>
                                    <th>Components</th>
                                    <th style={{width: "120px"}}>
                                        { translate('table.action') }
                                        <DataTableSetting 
                                            columnName={translate('table.action')} 
                                            columnArr={[
                                                translate('system_admin.system_link.table.url'),
                                                translate('system_admin.system_link.table.category'),
                                                translate('system_admin.system_link.table.description'),
                                                translate('system_admin.system_link.table.roles')
                                            ]}
                                            setLimit={this.setLimit}
                                        /> 
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    systemLinks.listPaginate.length > 0 ? systemLinks.listPaginate.map( link => 
                                        <tr key={link._id}>
                                            <td>{ link.url }</td>
                                            <td>{ link.category }</td>
                                            <td>{ link.description }</td>
                                            <td>{ link.roles.map((role, index, arr) => {
                                                if(index !== arr.length - 1)
                                                    return <span key={role._id}>{role.name}, </span>
                                                else
                                                    return <span key={role._id}>{role.name}</span>
                                            }) }</td>
                                            <td>{ link.components.map(component => component.name) }</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <a onClick={() => this.handleEdit(link)} className="edit" title={translate('system_admin.system_link.edit')}><i className="material-icons">edit</i></a>
                                                <DeleteNotification 
                                                    content={translate('system_admin.system_link.delete')}
                                                    data={{
                                                        id: link._id,
                                                        info: link.url
                                                    }}
                                                    func={this.props.deleteSystemLink}
                                                />
                                            </td>
                                        </tr> 
                                    ): systemLinks.isLoading ?
                                    <tr><td colSpan={5}>{translate('general.loading')}</td></tr>:
                                    <tr><td colSpan={5}>{translate('general.no_data')}</td></tr>
                                }
                            </tbody>
                        </table>

                        {/* PaginateBar */}
                        <PaginateBar pageTotal={systemLinks.totalPages} currentPage={systemLinks.page} func={this.setPage}/>
                    </React.Fragment>
                </div>
            </div>
        );

    }
}
 
function mapState(state) {
    const { systemLinks } = state;
    return { systemLinks }
}
const actions =  {
    getAllSystemLinks: SystemLinkActions.getAllSystemLinks,
    getAllSystemLinkCategories: SystemLinkActions.getAllSystemLinkCategories,
    deleteSystemLink: SystemLinkActions.deleteSystemLink
}
 
const connectedManageLinkSystem = connect(mapState, actions)(withTranslate(ManageLinkSystem));
export { connectedManageLinkSystem as ManageLinkSystem }
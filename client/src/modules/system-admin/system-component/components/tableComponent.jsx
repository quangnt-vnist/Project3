import React, { Component } from 'react';
import {connect} from 'react-redux';
import { SystemComponentActions } from '../redux/actions';
import { SystemLinkActions } from '../../system-link/redux/actions';
import { ComponentInfoForm } from './componentInfoForm';
import { ComponentCreateForm } from './componentCreateForm';
import { PaginateBar, DataTableSetting, DeleteNotification, SearchBar, ToolTip } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
class TableComponent extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            limit: 5,
            page: 1,
            option: 'name', //mặc định tìm kiếm theo tên
            value: ''
        }
    }

    componentDidMount() {
        this.props.getAllSystemComponents();
        this.props.getAllSystemComponents({page: this.state.page, limit: this.state.limit});
        this.props.getAllSystemLinks();
    }
    
    handleEdit = (currentRow) => {
        this.setState({ currentRow }, () => {
            window.$('#modal-edit-component-default').modal('show');
        });
    }

    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = () => {
        let data = {
            limit: this.state.limit,
            page: 1,
            key: this.state.option,
            value: this.state.value
        };
        this.props.getAllSystemComponents(data);
    }

    setPage = (page) => {
        this.setState({ page }, () => {
            let data = {
                limit: this.state.limit,
                page: page,
                key: this.state.option,
                value: this.state.value
            };
            this.props.getAllSystemComponents(data);
        });
    }

    setLimit = (number) => {
        this.setState({ limit: number }, () => {
            let data = { 
                limit: number, 
                page: this.state.page,
                key: this.state.option,
                value: this.state.value
            };
            this.props.getAllSystemComponents(data);
        });
    }

    render() { 
        const { systemComponents, translate } = this.props;
        const { currentRow } = this.state;

        return ( 
            <React.Fragment>
                <ComponentCreateForm />
                {
                    currentRow !== undefined &&
                    <ComponentInfoForm
                        componentId={ currentRow._id }
                        componentName={ currentRow.name }
                        componentDescription={ currentRow.description }
                        componentLink={ currentRow.links.map(link=>link._id)}
                        componentRoles={ currentRow.roles.map(role => role._id) }
                    />
                }
                <SearchBar 
                    columns={[
                        { title: translate('system_admin.system_component.table.name'), value:'name' },
                        { title: translate('system_admin.system_component.table.description'), value:'description' },
                    ]}
                    option={this.state.option}
                    setOption={this.setOption}
                    search={this.searchWithOption}
                />

                <table className="table table-hover table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>{ translate('system_admin.system_component.table.name') }</th>
                            <th>{ translate('system_admin.system_component.table.description') }</th>
                            <th>{ translate('system_admin.system_component.table.link') }</th>
                            <th>{ translate('system_admin.system_component.table.roles') }</th>
                            <th style={{width: "120px"}}>
                                { translate('table.action') }
                                <DataTableSetting 
                                    columnName={translate('table.action')} 
                                    hideColumn={false}
                                    setLimit={this.setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            systemComponents.listPaginate.length > 0 ?
                            systemComponents.listPaginate.map( component => 
                                <tr key={ component._id }>
                                    <td>{ component.name }</td>
                                    <td>{ component.description }</td>
                                    <td><ToolTip dataTooltip={component.links.map(link=>link.url)}/></td>
                                    <td>{ component.roles.map((role, i, arr) => {
                                        if(i !== arr.length - 1)
                                            return <span key={role._id}>{role.name}, </span>
                                        else
                                            return <span key={role._id}>{role.name}</span> 
                                    }) }</td>
                                    <td style={{ textAlign: 'center'}}>
                                        <a onClick={() => this.handleEdit(component)} className="edit" title={translate('system_admin.system_component.edit')}><i className="material-icons">edit</i></a>
                                        <DeleteNotification 
                                            content={translate('system_admin.system_component.delete')}
                                            data={{
                                                id: component._id,
                                                info: component.name
                                            }}
                                            func={this.props.deleteSystemComponent}
                                        />
                                    </td>
                                </tr>
                            ): systemComponents.isLoading ?
                            <tr><td colSpan={"5"}>{translate('general.loading')}</td></tr> : 
                            <tr><td colSpan={"5"}>{translate('general.no_data')}</td></tr>
                        }
                    </tbody>
                </table>

                {/* PaginateBar */}
                <PaginateBar pageTotal={systemComponents.totalPages} currentPage={systemComponents.page} func={this.setPage}/>
            </React.Fragment>
         );
    }
}
 
function mapState(state) {
    const { systemComponents } = state;
    return { systemComponents }
}
const actions = {
    getAllSystemComponents: SystemComponentActions.getAllSystemComponents,
    deleteSystemComponent: SystemComponentActions.deleteSystemComponent,
    getAllSystemLinks: SystemLinkActions.getAllSystemLinks,
}
 
const connectedTableComponent = connect(mapState, actions)(withTranslate(TableComponent))
export { connectedTableComponent as TableComponent }
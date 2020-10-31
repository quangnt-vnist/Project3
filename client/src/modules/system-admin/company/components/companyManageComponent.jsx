import React, { Component } from 'react';import { connect } from 'react-redux';

import { CompanyActions } from '../redux/actions';

import { PaginateBar, DataTableSetting, SearchBar} from '../../../../common-components';

import { withTranslate } from 'react-redux-multilingual';
class CompanyManageComponent extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            limit: 5,
            page: 1,
            option: 'name',
            value: ''
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            nextProps.companyId !== prevState.companyId|| 
            nextProps.company.item.components.listPaginate.length !== prevState.componentPaginate.length ||
            nextProps.company.item.components.limit !== prevState.componentLimit || 
            nextProps.company.item.components.page !== prevState.componentPage
        ) {
            return {
                ...prevState,
                checkedAll: false,
                companyId: nextProps.companyId,
                companyShortName: nextProps.companyShortName,
                componentPaginate: nextProps.company.item.components.listPaginate,
                componentPage: nextProps.company.item.components.page,
                componentLimit: nextProps.company.item.components.limit,
            } 
        } else {
            return null;
        }
    }

    companyHasComponent = (componentName, companyComponents) => {
        let result = false;

        for (let i = 0; i < companyComponents.length; i++) {
            const component = companyComponents[i];
            if (componentName === component.name) {
                result = true;
                break;
            }
        }

        return result;
    }

    // Kiem tra thong tin da validated het chua?
    isFormCreateLinkValidated = () => {
        const { componentName } = this.state;

        if (componentName !== undefined) {
            return true;
        } else {
            return false; 
        }
    }

    showCreateComponentForm = () => {
        window.$("#add-new-component-default").slideDown();
    }

    closeCreateComponentForm = () => {
        window.$("#add-new-component-default").slideUp();
    }

    saveAndCloseComponentForm = () => {
        const { companyId, componentName, componentLink, componentDescription } = this.state;
        
        window.$("#add-new-component-default").slideUp();
        return this.props.addCompanyComponent(companyId, {
            name: componentName,
            link: componentLink,
            description: componentDescription
        });
    }

    deleteCompanyComponent = (companyId, componentId) => {
        return this.props.deleteCompanyComponent(companyId, componentId);
    }
    
    handleName= (e, systemComponents) => {
        const value = e.target.value;

        for (let index = 0; index < systemComponents.list.length; index++) {
            const systemComponent = systemComponents.list[index];

            if (value === systemComponent.name) {
                this.setState({
                    componentName: systemComponent.name,
                    componentLink: systemComponent.url,
                    componentDescription: systemComponent.description
                });
            }
        }
    }
    
    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = () => {
        const {companyId} = this.state;
        const params = {
            company: companyId,
            portal: this.state.companyShortName,
            limit: this.state.limit,
            page: 1,
            key: this.state.option,
            value: this.state.value
        };

        this.props.getCompanyComponents(params);
    }

    setPage = (page) => {
        this.setState({ page }, () => {
            const {companyId} = this.state;
            const params = {
                company: companyId,
                portal: this.state.companyShortName,
                limit: this.state.limit,
                page: page,
                key: this.state.option,
                value: this.state.value
            };
    
            this.props.getCompanyComponents(params);
        });
    }

    setLimit = (number) => {
        this.setState({ limit: number }, () => {
            const {companyId} = this.state;
            const params = { 
                company: companyId,
                portal: this.state.companyShortName,
                limit: number, 
                page: this.state.page,
                key: this.state.option,
                value: this.state.value
            };
    
            this.props.getCompanyComponents(params);
        });
    }

    render() { 
        const { translate, company } = this.props;
        const { companyShortName, componentPaginate, checkedAll } = this.state;

        return ( 
            <div style={{padding: '10px 0px 10px 0px'}}>
                <a className="btn btn-primary pull-right" onClick={() => this.updateCompanyComponents(companyShortName)}><i className="material-icons">save</i></a>
                <SearchBar 
                    columns={[
                        { title: translate('manage_component.name'), value: 'name' },
                        { title: translate('manage_component.description'), value: 'description' }
                    ]}
                    option={this.state.option}
                    setOption={this.setOption}
                    search={this.searchWithOption}
                />
                <DataTableSetting 
                    tableId="company-manage-component-table"
                    setLimit={this.setLimit}
                />
                <table className="table table-hover table-striped table-bordered" id="company-manage-component-table">
                    <thead>
                        <tr>
                            <th style={{width: '32px'}} className="col-fixed">
                                <input type="checkbox" value="checkall" onChange={this.checkAll} checked={checkedAll}/>
                            </th>
                            <th>{ translate('manage_component.name') }</th>
                            <th>{ translate('manage_component.link') }</th>
                            <th>{ translate('manage_component.description') }</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            componentPaginate.length > 0 ? 
                            componentPaginate.map( component => 
                                <tr key={component._id}>
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            value={component._id} 
                                            onChange={this.handleCheckbox} 
                                            checked={!component.deleteSoft}
                                        />
                                    </td>
                                    <td>{ component.name }</td>
                                    <td>{ component.link ? component.link.url : null}</td>
                                    <td>{ component.description }</td>
                                </tr> 
                            ) : (
                                company.item.components.isLoading ?
                                <tr><td colSpan='4'>{translate('confirm.loading')}</td></tr>:
                                <tr><td colSpan='4'>{translate('confirm.no_data')}</td></tr>
                            )
                        }
                    </tbody>
                </table>

                {/* Paginate Bar */}
                <PaginateBar pageTotal={company.item.components.totalPages} currentPage={company.item.components.page} func={this.setPage}/>
            </div>
         );
    }

    checkAll = (e) => {
        let {componentPaginate} = this.state;
        let {checked} = e.target;
        
        const componentArr = componentPaginate.map(component=>{
            return {
                ...component,
                deleteSoft: !checked
            }
        });
        this.setState({
            checkedAll: checked,
            componentPaginate: componentArr
        })
    }

    handleCheckbox = (e) => {
        const {componentPaginate} = this.state;
        const {value, checked} = e.target;
        for (let i = 0; i < componentPaginate.length; i++) {
            if(value === componentPaginate[i]._id){
                componentPaginate[i].deleteSoft = !checked;
                this.setState({
                    componentPaginate
                })
                break;
            }
        }
    }

    updateCompanyComponents = (portal) => {
        let {componentPaginate} = this.state;
        let data = componentPaginate.map(component=>{
            return {
                _id: component._id,
                deleteSoft: component.deleteSoft
            }
        });

        this.props.updateCompanyComponents(data , {portal});
    }
}

function mapState(state) {
    const { company, systemComponents } = state;
    return { company, systemComponents };
}
const action = {
    getCompanyComponents: CompanyActions.getCompanyComponents,
    updateCompanyComponents: CompanyActions.updateCompanyComponents,
}

const connectedCompanyManageComponent = connect(mapState, action)(withTranslate(CompanyManageComponent))
export { connectedCompanyManageComponent as CompanyManageComponent }
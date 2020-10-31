import React, { Component } from 'react';
import { connect } from 'react-redux';

import { CompanyActions } from '../redux/actions';
import { SystemLinkActions } from '../../system-link/redux/actions';
import { SystemComponentActions } from '../../system-component/redux/actions';

import { CompanyEditForm } from './companyEditForm';
import { CompanyServicesForm } from './companyServiceForm';
import { CompanyCreateForm } from './companyCreateForm';

import { PaginateBar, DataTableSetting, SearchBar } from '../../../../common-components';
import Swal from 'sweetalert2';

import { withTranslate } from 'react-redux-multilingual';
class CompanyTable extends Component {
    
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
        this.props.getAllCompanies();
        this.props.getAllCompanies({ page: this.state.page, limit: this.state.limit });
        this.props.getAllSystemLinks();
        this.props.getAllSystemComponents();
    }
    
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

        this.props.getAllCompanies(data);
    }

    setPage = (page) => {
        this.setState({ page }, () => {
            const data = {
                limit: this.state.limit,
                page: page,
                key: this.state.option,
                value: this.state.value
            };
    
            this.props.getAllCompanies(data);
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
    
            this.props.getAllCompanies(data);
        });
    }

    toggle = (id, data, title, name, btnNo, btnYes, value) => {
        Swal.fire({
            title: title,
            html: `<h4>${name}</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: btnNo,
            confirmButtonText: btnYes
        }).then((result) => {
            if (result.value) {
                this.props.editCompany(id, {
                    name: data.name,
                    shortName: data.shortName,
                    description: data.description,
                    log: value ? data.log : value,
                    active: value
                });
            }
        })
    }

    handleEdit = async (company) => {
        this.setState({ currentRow: company }, () => {
            window.$('#modal-edit-company').modal('show');
        });
    }

    handleService = async (company) => {
        this.setState({currentRow: company}, () => {
            window.$('#modal-edit-services-company').modal('show');
            this.props.getCompanyLinks({company: company._id, portal: company.shortName});
            this.props.getCompanyLinks({company: company._id, portal: company.shortName, page: 1, limit: 5 });
            this.props.getCompanyComponents({company: company._id, portal: company.shortName});
            this.props.getCompanyComponents({company: company._id, portal: company.shortName, page: 1, limit: 5 });
        });
    }

    render() { 
        const { company, translate } = this.props;
        const { currentRow } = this.state;
        
        return ( 
            <React.Fragment>
                <CompanyCreateForm/>
                {
                    currentRow !== undefined &&
                    <CompanyEditForm
                        companyId={ currentRow._id }
                        companyName={ currentRow.name }
                        companyShortName={ currentRow.shortName }
                        companyLog={currentRow.log}
                        companyDescription={ currentRow.description }
                        companyLinks={currentRow.links}
                        companyEmail={currentRow.superAdmin ? currentRow.superAdmin.email : 'Chưa xác định'}
                        companyActive={currentRow.active}
                    />
                }
                                {
                    currentRow !== undefined &&
                    <CompanyServicesForm
                        companyId={ currentRow._id }
                        companyName={ currentRow.name }
                        companyShortName={ currentRow.shortName }
                        companyLog={currentRow.log}
                        companyDescription={ currentRow.description }
                        companyLinks={currentRow.links}
                        companyEmail={currentRow.superAdmin ? currentRow.superAdmin.email : 'Chưa xác định'}
                        companyActive={currentRow.active}
                    />
                }
                <SearchBar 
                    columns={[
                        { title: translate('system_admin.company.table.name'), value: 'name' },
                        { title: translate('system_admin.company.table.short_name'), value: 'shortName' },
                        { title: translate('system_admin.company.table.description'), value: 'description' },
                    ]}
                    option={this.state.option}
                    setOption={this.setOption}
                    search={this.searchWithOption}
                />
                
                <table className="table table-hover table-striped table-bordered" id="company-table">
                    <thead>
                        <tr>
                            <th>{translate('system_admin.company.table.name')}</th>
                            <th>{translate('system_admin.company.table.short_name')}</th>
                            <th>{translate('system_admin.company.table.description')}</th>
                            <th style={{ width: "130px"}}>{translate('system_admin.company.table.log')}</th>
                            <th style={{ width: "130px"}}>{translate('system_admin.company.table.service')}</th>
                            <th style={{ width: "120px", textAlign: 'center' }}>
                                {translate('table.action')}
                                <DataTableSetting 
                                    tableId="company-table"
                                    columnName={translate('table.action')} 
                                    hideColumn={false}
                                    setLimit={this.setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            company.listPaginate.length > 0 ?
                                <React.Fragment>
                                    {
                                        company.listPaginate.map(com => 
                                            <tr 
                                                key={ com._id } 
                                                className={com.active ? "bg bg-white" : "bg bg-gray"}
                                            >
                                                <td>{ com.name }</td>
                                                <td>{ com.shortName }</td>
                                                <td>{ com.description }</td>
                                                <td>{ com.log ? <p><i className="fa fa-circle text-success" style={{fontSize: "1em", marginRight: "0.25em"}} /> {translate('system_admin.company.on')} </p> : <p><i className="fa fa-circle text-danger" /> {translate('system_admin.company.off')} </p>}</td>
                                                <td>{ com.active ? <p><i className="fa fa-circle text-success" style={{fontSize: "1em", marginRight: "0.25em"}} /> {translate('system_admin.company.on')} </p> : <p><i className="fa fa-circle text-danger" /> {translate('system_admin.company.off')} </p>}</td>
                                                <td style={{ textAlign: 'center'}}>
                                                <a onClick={() => this.handleEdit(com)} className="text-yellow" style={{width: '5px'}} title={translate('system_admin.company.edit')}><i className="material-icons">edit</i></a>
                                                <a onClick={() => this.handleService(com)} className="text-green" style={{width: '5px'}} title={translate('system_admin.company.service')}><i className="material-icons">dvr</i></a>
                                                </td>
                                            </tr>    
                                        )
                                    }
                                </React.Fragment> 
                                : company.isLoading ?
                                    <tr><td colSpan='6'>{translate('general.loading')}</td></tr>
                                    : <tr><td colSpan='6'>{translate('general.no_data')}</td></tr>
                        }
                    </tbody>
                </table>
                
                {/* Paginate Bar */}
                <PaginateBar pageTotal={company.totalPages} currentPage={company.page} func={this.setPage}/>
            </React.Fragment>
         );
    }
}

function mapState(state) {
    const { company } = state;
    return { company };
}
const action = {
    getAllCompanies: CompanyActions.getAllCompanies,
    editCompany: CompanyActions.editCompany,
    getAllSystemLinks: SystemLinkActions.getAllSystemLinks,
    getAllSystemComponents: SystemComponentActions.getAllSystemComponents,
    getCompanyLinks: CompanyActions.getCompanyLinks,
    getCompanyComponents: CompanyActions.getCompanyComponents
}

const connectedCompanyTable = connect(mapState, action)(withTranslate(CompanyTable))
export { connectedCompanyTable as CompanyTable }

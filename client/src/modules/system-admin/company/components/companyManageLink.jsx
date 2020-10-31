import React, { Component } from 'react';import { connect } from 'react-redux';
import { CompanyActions } from '../redux/actions';
import { PaginateBar, DataTableSetting, SearchBar} from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
class CompanyManageLinks extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            limit: 5,
            page: 1,
            option: 'url',
            value: ''
         }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            nextProps.companyId !== prevState.companyId || 
            nextProps.company.item.links.listPaginate.length !== prevState.linkPaginate.length ||
            nextProps.company.item.links.limit !== prevState.linkLimit || 
            nextProps.company.item.links.page !== prevState.linkPage
        ) {
            return {
                ...prevState,
                checkedAll: false,
                companyId: nextProps.companyId,
                companyShortName: nextProps.companyShortName,
                linkPaginate: nextProps.company.item.links.listPaginate,
                linkPage: nextProps.company.item.links.page,
                linkLimit: nextProps.company.item.links.limit,
            } 
        } else {
            return null;
        }
    }

    companyHasLink = (linkUrl, companyLinks) => {
        let result = false;

        for (let i = 0; i < companyLinks.length; i++) {
            const link = companyLinks[i];

            if (linkUrl === link.url) {
                result = true;
                break;
            }
        }

        return result;
    }

    // Kiem tra thong tin da validated het chua?
    isFormCreateLinkValidated = () => {
        const {linkUrl, linkDescription, linkDescriptionError} = this.state;

        if (!linkDescriptionError && linkUrl && linkDescription) {
            if (linkUrl !== 'noturl') {
                return true;
            } else {
                return false;
            }
        } else {
            return false; 
        }
    }
    
    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = () => {
        const{companyId} = this.state;
        const params = {
            company: companyId,
            portal: this.state.companyShortName,
            limit: this.state.limit,
            page: 1,
            key: this.state.option,
            value: this.state.value
        };

        this.props.getCompanyLinks(params);
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
    
            this.props.getCompanyLinks(params);
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
    
            this.props.getCompanyLinks(params);
        });
    }

    render() { 
        const { translate, company } = this.props;
        const { linkPaginate, checkedAll, companyShortName } = this.state;
        
        return ( 
            <div style={{padding: '10px 0px 10px 0px'}}>
                <a className="btn btn-primary pull-right" onClick={()=>this.updateCompanyLinks(companyShortName)}><i className="material-icons">save</i></a>
                <SearchBar 
                    columns={[
                        { title: translate('manage_link.url'), value: 'url' },
                        { title: translate('manage_link.category'), value: 'category' },
                        { title: translate('manage_link.description'), value: 'description' }
                    ]}
                    option={this.state.option}
                    setOption={this.setOption}
                    search={this.searchWithOption}
                />
                <DataTableSetting 
                    tableId="company-manage-link-table"
                    setLimit={this.setLimit}
                />
                <table className="table table-hover table-striped table-bordered" id="company-manage-link-table">
                    <thead>
                        <tr>
                            <th style={{width: '32px'}} className="col-fixed">
                                <input type="checkbox" value="checkall" onChange={this.checkAll} checked={checkedAll}/>
                            </th>
                            <th>{ translate('manage_link.url') }</th>
                            <th>{ translate('manage_link.category') }</th>
                            <th>{ translate('manage_link.description') }</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            linkPaginate.length > 0 ? 
                            linkPaginate.map( link => 
                                <tr key={link._id}>
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            value={link._id} 
                                            onChange={this.handleCheckbox} 
                                            checked={!link.deleteSoft}
                                        />
                                    </td>
                                    <td>{ link.url }</td>
                                    <td>{ link.category }</td>
                                    <td>{ link.description }</td>
                                </tr> 
                            ) : (
                                company.item.links.isLoading ?
                                <tr><td colSpan='4'>{translate('confirm.loading')}</td></tr>:
                                <tr><td colSpan='4'>{translate('confirm.no_data')}</td></tr>
                            )
                        }
                    </tbody>
                </table>
                
                {/* Paginate Bar */}
                <PaginateBar pageTotal={company.item.links.totalPages} currentPage={company.item.links.page} func={this.setPage}/>
            </div>
         );
    }

    checkAll = (e) => {
        let {linkPaginate} = this.state;
        let {checked} = e.target;
        
        const linkArr = linkPaginate.map(link=>{
            return {
                ...link,
                deleteSoft: !checked
            }
        });
        this.setState({
            checkedAll: checked,
            linkPaginate: linkArr
        })
    }

    handleCheckbox = (e) => {
        const {linkPaginate} = this.state;
        const {value, checked} = e.target;
        for (let i = 0; i < linkPaginate.length; i++) {
            if(value === linkPaginate[i]._id){
                linkPaginate[i].deleteSoft = !checked;
                this.setState({
                    linkPaginate
                })
                break;
            }
        }
    }

    updateCompanyLinks = (portal) => {
        let {linkPaginate} = this.state;
        let data = linkPaginate.map(link=>{
            return {
                _id: link._id,
                deleteSoft: link.deleteSoft
            }
        });

        this.props.updateCompanyLinks(data, {portal});
    }
}

function mapState(state) {
    const { company, systemLinks } = state;
    return { company, systemLinks };
}
const action = {
    getCompanyLinks: CompanyActions.getCompanyLinks,
    updateCompanyLinks: CompanyActions.updateCompanyLinks
}

const connectedCompanyManageLinks = connect(mapState, action)(withTranslate(CompanyManageLinks))
export { connectedCompanyManageLinks as CompanyManageLinks }
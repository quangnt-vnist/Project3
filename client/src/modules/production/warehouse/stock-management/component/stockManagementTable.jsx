import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { StockActions } from '../redux/actions';
import { GoodActions } from '../../../common-production/good-management/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { RoleActions } from '../../../../super-admin/role/redux/actions';
import StockCreateForm from './stockCreateForm';
import StockEditForm from './stockEditForm';
import StockDetailForm from './stockDetailForm';
import { DataTableSetting, DeleteNotification, PaginateBar, SelectMulti } from '../../../../../common-components';

class StockManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
            code: '',
            name: '',
            status: '',
        }
    }

    componentDidMount(){
        let { page, limit } = this.state;
        this.props.getAllDepartments();
        this.props.getAllRoles();
        this.props.getAllGoods();
        this.props.getAllStocks();
        this.props.getAllStocks({ page, limit });
    }
    
    setPage = (page) => {
        this.setState({ page });
        const data = {
            limit: this.state.limit,
            page: page,
        };
        this.props.getAllStocks(data);
    }

    setLimit = (number) => {
        this.setState({ limit: number });
        const data = {
            limit: number,
            page: this.state.page,
        };
        this.props.getAllStocks(data);
    }

    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    handleEdit = async (stock) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: stock
            }
        });

        window.$('#modal-edit-stock').modal('show');
    }

    handleCodeChange = async (e) => {
        let value = e.target.value;
        this.setState( state => {
            return {
                ...state,
                code: value.trim()
            }
        })
    }

    handleNameChange = async (e) => {
        let value = e.target.value;
        this.setState( state => {
            return {
                ...state,
                name: value.trim()
            }
        })
    }

    handleStatusChange = async (value) => {
        this.setState(state => {
            return {
                ...state,
                status: value
            }
        })
    }

    handleSubmitSearch = async () => {
        let data = {
            page: this.state.page,
            limit: this.state.limit,
            code: this.state.code,
            name: this.state.name,
            status: this.state.status
        }

        this.props.getAllStocks(data);
    }

    handleShowDetailInfo = async (stock) => {
        let id = stock._id;
        this.props.getStock(id);
        await this.setState(state => {
            return {
                ...state,
                currentRow: stock
            }
        })
        window.$('#modal-detail-stock').modal('show');
    }

    render (){
        const { stocks, translate } = this.props;
        const { listPaginate, totalPages, page } = stocks;

        return (
            <div className="box">
                <div className="box-body qlcv">
                    <StockCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.stock_management.code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleCodeChange} placeholder={translate('manage_warehouse.stock_management.code')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.stock_management.name')}</label>
                            <input type="text" className="form-control" name="name" onChange={this.handleNameChange} placeholder={translate('manage_warehouse.stock_management.name')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.stock_management.status')}</label>
                            <SelectMulti
                                id={`select-multi-status-stock`}
                                multiple="multiple"
                                options={{ nonSelectedText: translate('manage_warehouse.stock_management.choose_status'), allSelectedText: translate('manage_warehouse.stock_management.all_type') }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: translate('manage_warehouse.stock_management.1')},
                                    { value: '2', text: translate('manage_warehouse.stock_management.2')},
                                    { value: '3', text: translate('manage_warehouse.stock_management.3')},
                                    { value: '4', text: translate('manage_warehouse.stock_management.4')},
                                ]}
                                onChange={this.handleStatusChange}
                            />
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('manage_warehouse.stock_management.search')} onClick={this.handleSubmitSearch}>{translate('manage_warehouse.good_management.search')}</button>
                        </div>
                    </div>

                    {
                        this.state.currentRow &&
                        <StockEditForm
                            stockId={this.state.currentRow._id}
                            code={this.state.currentRow.code}
                            name={this.state.currentRow.name}
                            status={this.state.currentRow.status}
                            address={this.state.currentRow.address}
                            manageDepartment={this.state.currentRow.manageDepartment}
                            managementLocation={this.state.currentRow.managementLocation}
                            goodsManagement={this.state.currentRow.goods}
                            description={this.state.currentRow.description}
                        />
                    }

                    {
                        this.state.currentRow &&
                        <StockDetailForm
                            stockId={this.state.currentRow._id}
                            code={this.state.currentRow.code}
                            name={this.state.currentRow.name}
                            status={this.state.currentRow.status}
                            address={this.state.currentRow.address}
                            manageDepartment={this.state.currentRow.manageDepartment}
                            managementLocation={this.state.currentRow.managementLocation}
                            goodsManagement={this.state.currentRow.goods}
                            description={this.state.currentRow.description}
                        />
                    }

                    <table id="stock-table" className="table table-striped table-bordered table-hover" style={{marginTop: '15px'}}>
                        <thead>
                            <tr>
                                <th style={{ width: "5%" }}>{translate('manage_warehouse.stock_management.index')}</th>
                                <th>{translate('manage_warehouse.stock_management.code')}</th>
                                <th>{translate('manage_warehouse.stock_management.name')}</th>
                                <th>{translate('manage_warehouse.stock_management.status')}</th>
                                <th>{translate('manage_warehouse.stock_management.address')}</th>
                                <th>{translate('manage_warehouse.stock_management.description')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                <DataTableSetting
                                        tableId="stock-table"
                                        columnArr={[
                                            translate('manage_warehouse.stock_management.index'),
                                            translate('manage_warehouse.stock_management.code'),
                                            translate('manage_warehouse.stock_management.name'),
                                            translate('manage_warehouse.stock_management.status'),
                                            translate('manage_warehouse.stock_management.address'),
                                            translate('manage_warehouse.stock_management.description')
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            { (typeof listPaginate !== undefined && listPaginate.length !== 0) &&
                                listPaginate.map((x, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{x.code}</td>
                                        <td>{x.name}</td>
                                        <td>{translate(`manage_warehouse.stock_management.${x.status}`)}</td>
                                        <td>{x.address}</td>
                                        <td>{x.description}</td>
                                        <td style={{textAlign: 'center'}}>
                                            <a className="text-green" onClick={() => this.handleShowDetailInfo(x)}><i className="material-icons">visibility</i></a>
                                            <a onClick={() => this.handleEdit(x)} href={`#${x._id}`} className="text-yellow" ><i className="material-icons">edit</i></a>
                                            {/* <DeleteNotification
                                                content={translate('manage_warehouse.stock_management.delete_info')}
                                                data={{
                                                    id: x._id,
                                                    info: x.code + " - " + x.name
                                                }}
                                                func={this.props.deleteStock}
                                            /> */}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {stocks.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listPaginate === 'undefined' || listPaginate.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal = {totalPages} currentPage = {page} func = {this.setPage} />
                </div>
            </div>
        );
    }
    
}


function mapStateToProps(state) {
    const { stocks } = state;
    return { stocks };
}

const mapDispatchToProps = {
    getAllDepartments: DepartmentActions.get,
    getAllRoles: RoleActions.get,
    getAllGoods: GoodActions.getAllGoods,
    getAllStocks: StockActions.getAllStocks,
    deleteStock: StockActions.deleteStock,
    getStock: StockActions.getStock
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(StockManagementTable));
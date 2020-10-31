import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DataTableSetting, DeleteNotification, PaginateBar, SelectMulti } from '../../../../../../common-components';

import ArchiveDetailForm from './archiveDetailForm';
import ArchiveEditForm from './archiveEditForm';
import { BinLocationActions} from '../../redux/actions';
import { GoodActions } from '../../../../common-production/good-management/redux/actions';
import { StockActions } from '../../../../warehouse/stock-management/redux/actions';

class ArchiveManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
            path: '',
            status: '',
            stock: ''
        }
    }

    componentDidMount(){
        let { page, limit } = this.state;
        this.props.getChildBinLocations({ page, limit });
        this.props.getAllGoods();
        this.props.getAllStocks();
    }

    handleEdit = async (binLocation) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: binLocation
            }
        });

        window.$('#modal-edit-archive-stock').modal('show');
    }

    handleShowDetailInfo = async (binLocation) => {
        let id = binLocation._id;
        await this.props.getDetailBinLocation(id);
        window.$('#modal-detail-archive-bin').modal('show');
    }

    setPage = (page) => {
        this.setState({ page });
        const data = {
            limit: this.state.limit,
            page: page,
        };
        this.props.getChildBinLocations(data);
    }

    setLimit = (number) => {
        this.setState({ limit: number });
        const data = {
            limit: number,
            page: this.state.page,
        };
        this.props.getChildBinLocations(data);
    }

    handleStockChange = async (value) => {
        this.setState(state => {
            return {
                ...state,
                stock: value
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

    handleCodeChange = async (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                path: value
            }
        })
    }

    handleSubmitSearch = async () => {
        let data = {
            page: this.state.page,
            limit: this.state.limit,
            path: this.state.path,
            stock: this.state.stock,
            status: this.state.status
        }

        this.props.getChildBinLocations(data);
    }

    render (){
        const { translate, binLocations, stocks } = this.props;
        const { listStocks } = stocks;
        const { listPaginate, totalPages, page } = binLocations;
        const { currentRow } = this.state;

        return (
                <div className="box-body qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bin_location_management.stock')}</label>
                            <SelectMulti
                                id={`select-multi-stock-bin_location`}
                                multiple="multiple"
                                options={{ nonSelectedText: translate('manage_warehouse.bin_location_management.choose_status'), allSelectedText: translate('manage_warehouse.bin_location_management.all_type') }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={listStocks.map((x, index) => { return { value: x._id, text: x.name }})}
                                onChange={this.handleStockChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bin_location_management.status')}</label>
                            <SelectMulti
                                id={`select-multi-status-bin_location`}
                                multiple="multiple"
                                options={{ nonSelectedText: translate('manage_warehouse.bin_location_management.choose_status'), allSelectedText: translate('manage_warehouse.bin_location_management.all_type') }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: translate('manage_warehouse.bin_location_management.1.status')},
                                    { value: '2', text: translate('manage_warehouse.bin_location_management.2.status')},
                                    { value: '3', text: translate('manage_warehouse.bin_location_management.3.status')},
                                    { value: '4', text: translate('manage_warehouse.bin_location_management.4.status')},
                                    { value: '5', text: translate('manage_warehouse.bin_location_management.5.status')},
                                ]}
                                onChange={this.handleStatusChange}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bin_location_management.code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleCodeChange} placeholder={translate('manage_warehouse.bin_location_management.code')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('manage_warehouse.bin_location_management.search')} onClick={this.handleSubmitSearch}>{translate('manage_warehouse.good_management.search')}</button>
                        </div>
                    </div>
                    <ArchiveDetailForm />
                    { currentRow && 
                        <ArchiveEditForm
                            binId={currentRow._id}
                            binContained={currentRow.contained}
                            binEnableGoods={currentRow.enableGoods}
                            binStatus={currentRow.status}
                            binParent={currentRow.parent}
                            page={this.state.page}
                            limit={this.state.limit}
                        />
                    }
                    <table id="category-table" className="table table-striped table-bordered table-hover" style={{marginTop: '15px'}}>
                        <thead>
                            <tr>
                                {/* <th style={{ width: "5%" }}>{translate('manage_warehouse.bin_location_management.index')}</th> */}
                                <th>{translate('manage_warehouse.bin_location_management.code')}</th>
                                <th>{translate('manage_warehouse.bin_location_management.status')}</th>
                                <th>{translate('manage_warehouse.bin_location_management.capacity')}</th>
                                <th>{translate('manage_warehouse.bin_location_management.contained')}</th>
                                <th>{translate('manage_warehouse.bin_location_management.goods')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                <DataTableSetting
                                        tableId="category-table"
                                        columnArr={[
                                            // translate('manage_warehouse.bin_location_management.index'),
                                            translate('manage_warehouse.bin_location_management.code'),
                                            translate('manage_warehouse.bin_location_management.status'),
                                            translate('manage_warehouse.bin_location_management.capacity'),
                                            translate('manage_warehouse.bin_location_management.contained'),
                                            translate('manage_warehouse.bin_location_management.goods'),
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
                                        {/* <td>{index + 1}</td> */}
                                        <td>{x.path}</td>
                                        <td style={{ color: translate(`manage_warehouse.bin_location_management.${x.status}.color`)}}>{translate(`manage_warehouse.bin_location_management.${x.status}.status`)}</td>
                                        <td>{x.capacity ? x.capacity : 0} {x.unit}</td>
                                        <td>{x.contained ? x.contained : 0} {x.unit}</td>
                                        <td>{x.enableGoods.map((x, i) => { return <p key={i}>{ x.good.name }({x.contained}{x.good.baseUnit})</p> })}</td>
                                        <td style={{textAlign: 'center'}}>
                                            <a className="text-green" onClick={() => this.handleShowDetailInfo(x)}><i className="material-icons">visibility</i></a>
                                            <a onClick={() => this.handleEdit(x)} href={`#${x._id}`} className="text-yellow" ><i className="material-icons">edit</i></a>
                                            {/* <DeleteNotification
                                                content={translate('manage_warehouse.category_management.delete_info')}
                                                data={{
                                                    id: x._id,
                                                    info: x.code + " - " + x.name
                                                }}
                                                func={this.props.deleteBinLocations}
                                            /> */}
                                        </td>
                                    </tr>
                                ))
                        }
                        </tbody>
                    </table>
                    {binLocations.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listPaginate === 'undefined' || listPaginate.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal = {totalPages} currentPage = {page} func = {this.setPage} />
                </div>
        );
    }
    
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getChildBinLocations: BinLocationActions.getChildBinLocations,
    getDetailBinLocation: BinLocationActions.getDetailBinLocation,
    getAllGoods: GoodActions.getAllGoods,
    deleteBinLocations: BinLocationActions.deleteBinLocations,
    getAllStocks: StockActions.getAllStocks
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ArchiveManagementTable));
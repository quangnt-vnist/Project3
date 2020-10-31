import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import InventoryDetailForm from './inventoryDetailForm';
import LotDetailForm from './lotDetailForm';
import LotEditForm from './lotEditForm';

import { LotActions } from '../redux/actions';
import { StockActions } from '../../stock-management/redux/actions';
import { GoodActions } from '../../../common-production/good-management/redux/actions';

import { TreeTable } from './treeTable';

import { LazyLoadComponent, forceCheckOrVisible, SelectMulti, DataTableSetting, DeleteNotification, DatePicker, PaginateBar } from '../../../../../common-components/index';

class InventoryManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
            oldType: 'product',
            type: 'product',
            perPage: 1,
            dataStatus: 0,
        }
    }

    componentDidMount(){
        const { page, limit, oldType } = this.state;
        this.props.getAllStocks();
        this.props.getAllLots();
        this.props.getGoodsByType({ page, limit, type: oldType });
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if(prevState.oldType !== prevState.type) {
            nextProps.getGoodsByType({ page: prevState.page, limit: prevState.limit, type: prevState.type });
            return { 
                oldType: prevState.type,
            }
        }
        return null;
    };

    // shouldComponentUpdate(nextProps, nextPage){
    //     if(this.state.dataStatus == 1 && !nextProps.goods.isLoading && !nextProps.lots.isLoading){
    //         this.setState(state => {
    //             return {
    //                 ...state,
    //                 dataStatus: 2,
    //                 type: nextPage.type
    //             }
    //         });
    //         return true;
    //     };
    //     return false;
    // }

    handleProduct = async () => {
        let type = 'product';
        let page = 1;
        await this.setState({
            type: type,
            page: page,
            dataStatus: 0
        })
    }

    handleMaterial = async () => {
        let type = 'material';
        let page = 1;
        await this.setState({
            type: type,
            page: page,
            dataStatus: 0
        })
    }

    handleEquipment = async () => {
        let type = 'equipment';
        let page = 1;
        await this.setState({
            type: type,
            page: page,
            dataStatus: 0
        })
    }

    handleAsset = async () => {
        let type = 'asset';
        let page = 1;
        await this.setState({
            type: type,
            page: page,
            dataStatus: 0
        })
    }

    handleShowDetailInfo = (id) => {
        
        window.$('#modal-detail-inventory').modal('show');
    }

    handleShowDetailLot = async (id) => {
        const lot = await this.props.getDetailLot(id);
        await this.setState(state => {
            return {
                ...state,
            }
        })
        window.$('#modal-detail-lot').modal('show');
    }

    handleEditLot = async (id) => {
        const lot = await this.props.getDetailLot(id);
        this.setState(state => {
            return {
                ...state,
                lotId: id,
                dataStatus: 0
            }
        })
        window.$('#modal-edit-lot').modal('show');
    }

    formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    setLimit = (number) => {
        this.setState({ limit: number, dataStatus: 0 });
        const data = {
            limit: number,
            page: this.state.page,
            type: this.state.type
        };
        this.props.getGoodsByType(data);
    }

    setPage = (page) => {
        this.setState({ page, dataStatus: 0 });
        const data = {
            limit: this.state.limit,
            page: page,
            type: this.state.type
        };
        this.props.getGoodsByType(data);
    }

    handleStockChange = async (value) => {
        this.setState(state => {
            return {
                ...state,
                stock: value
            }
        })
    }

    handleCodeChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                code: value
            }
        })
    }

    handleNameChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                name: value
            }
        })
    }

    handleSubmitSearch = async () => {
        let data = {
            page: this.state.page,
            limit: this.state.limit,
            code: this.state.code,
            name: this.state.name,
        }

        this.props.getGoodsByType(data);
    }

    render() {

        const { translate, lots, goods, stocks } = this.props;
        const { type, lotId } = this.state;
        const { totalPages, page } = goods;

        let listLots = [];
        let dataGoods = goods.listPaginate ? goods.listPaginate.map((node, index) => {
            const goodId = node._id;
            let lotOfGood = [];
            lotOfGood = lots.listLots ? lots.listLots.filter(x => x.good ? x.good._id === goodId : x ) : [];
            listLots = listLots.concat(lotOfGood);
            let quantityTotal = lotOfGood ? lotOfGood.reduce(function (accumulator, currentValue){
                return accumulator + currentValue.quantity;
            }, 0) : 0;
            return {
                ...node,
                index: index + 1,
                name: node.name,
                baseUnit: node.baseUnit,
                quantity: quantityTotal,
                lot: "",
                expirationDate: "",
                parent: null,
                action: ["viewGood"]
            }
        }) : [];

        let dataLots = listLots.length ? listLots.map(node => {
            return {
                ...node,
                name: node.good ? node.good.name : "",
                baseUnit: node.good ? node.good.baseUnit : "",
                quantity: node.quantity,
                lot: node.name,
                expirationDate: this.formatDate(node.expirationDate),
                parent: node.good ? node.good._id : null,
                action: ["viewLot", "edit"]
            }
        }) : [];

        
        const dataTree = dataGoods.concat(dataLots);

        let column = [
            { name: translate('manage_warehouse.inventory_management.index'), key: "index" },
            { name: translate('manage_warehouse.inventory_management.name'), key: "name" },
            { name: translate('manage_warehouse.inventory_management.unit'), key: "baseUnit" },
            { name: translate('manage_warehouse.inventory_management.quantity'), key: "quantity" },
            { name: translate('manage_warehouse.inventory_management.lot'), key: "lot" },
            { name: translate('manage_warehouse.inventory_management.date'), key: "expirationDate" }
        ];
        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#inventory-products" data-toggle="tab" onClick={()=> this.handleProduct()}>{translate('manage_warehouse.inventory_management.product')}</a></li>
                    <li><a href="#inventory-materials" data-toggle="tab" onClick={this.handleMaterial}>{translate('manage_warehouse.inventory_management.material')}</a></li>
                    <li><a href="#inventory-equipments" data-toggle="tab" onClick={()=> this.handleEquipment()}>{translate('manage_warehouse.inventory_management.equipment')}</a></li>
                    <li><a href="#inventory-assets" data-toggle="tab" onClick={()=> this.handleAsset()}>{translate('manage_warehouse.inventory_management.asset')}</a></li>
                </ul>
                <div className="tab-content">
                    <div className="box-body qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.inventory_management.stock')}</label>
                            <SelectMulti
                                id={`select-multi-stock`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Tổng các kho", allSelectedText: "Tổng các kho" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={stocks.listStocks.map((x, index) => { return { value: x._id, text: x.name }})}
                                onChange={this.handleStockChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.purchase_date')}</label>
                            <DatePicker
                                id="purchase-month"
                                dateFormat="month-year"
                                value=""
                                onChange={this.handlePurchaseMonthChange}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.inventory_management.good_code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleCodeChange} placeholder={translate('manage_warehouse.inventory_management.good_code')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.inventory_management.name')}</label>
                            <input type="text" className="form-control" name="name" onChange={this.handleNameChange} placeholder={translate('manage_warehouse.inventory_management.name')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_warehouse.inventory_management.search')} onClick={this.handleSubmitSearch}>{translate('manage_warehouse.inventory_management.search')}</button>
                        </div>
                    </div>
                    <InventoryDetailForm />
                    <LotDetailForm />

                    { 
                        lotId &&
                        <LotEditForm
                            id={lotId}
                            lot={lots.lotDetail}
                        />
                    }
                    <DataTableSetting
                        tableId={`tree-table-${type}`}
                        tableContainerId={`tree-table-container-${type}`}
                        tableWidth="1300px"
                        columnArr={[
                            translate('manage_warehouse.inventory_management.index'),
                            translate('manage_warehouse.inventory_management.name'),
                            translate('manage_warehouse.inventory_management.unit'),
                            translate('manage_warehouse.inventory_management.quantity'),
                            translate('manage_warehouse.inventory_management.lot'),
                            translate('manage_warehouse.inventory_management.date'),
                        ]}
                        limit={this.state.limit}
                        setLimit={this.setLimit}
                        hideColumnOption={true}
                    />

                    <div id={`tree-table-container-${type}`}>
                        <TreeTable
                            tableId={`tree-table-${type}`}
                            behaviour="show-children"
                            column={column}
                            data={dataTree}
                            titleAction={{
                                edit: translate('task.task_management.action_edit'),
                                viewLot: translate('task.task_management.action_edit'),
                                viewGood: translate('task.task_management.action_edit'),
                            }}
                            funcEdit={this.handleEditLot}
                            funcViewLot={this.handleShowDetailLot}
                            funcViewGood={this.handleShowDetailInfo}
                        />

                    </div>

                    <PaginateBar pageTotal = {totalPages} currentPage = {page} func = {this.setPage} />
                    </div>
                </div>
            </div>
        );
    }
    
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllLots: LotActions.getAllLots,
    getGoodsByType: GoodActions.getGoodsByType,
    getGoodDetail: GoodActions.getGoodDetail,
    getAllStocks: StockActions.getAllStocks,
    getDetailLot: LotActions.getDetailLot
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(InventoryManagement));

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { LotActions } from '../redux/actions';
import { BinLocationActions } from '../../bin-location-management/redux/actions';

import { SelectBox, ErrorLabel, DialogModal } from '../../../../../common-components';
class LotEditForm extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_BIN = {
            binLocation: '',
            quantity: ''
        }
        this.state = {
            stocks: [],
            binLocations: [],
            binLocation: Object.assign({}, this.EMPTY_BIN),
            editInfo: false,
            quantity: 0,
            stock: '',
            stockOne: ''
        }
    }

    componentDidMount() {
        const { id } = this.props;
        this.props.getDetailLot(id);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.id !== prevState.id) {
            prevState.binLocation.binLocation = '';
            prevState.binLocation.quantity = '';
            return {
                ...prevState,
                id: nextProps.id,
                quantity: 0,
                stock: '',
                lot: nextProps.lot,
                binLocations: [],
                stocks: nextProps.lot.stocks,
                errorQuantity: undefined,
                errorBin: undefined
            }
        }
        return null;
    };

    handleBinLocationChange = (value) => {
        let binLocation = value[0];
        this.validateBin(binLocation, true);
    }

    validateBin = async (value, willUpdateState = true) => {
        const dataBins = await this.getAllBins();
        
        let msg = undefined;
        const { translate } = this.props;
        let { binLocation } = this.state;
        if(!value){
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
        let binName = dataBins.find(x => x.value === value);
            binLocation.binLocation = { _id: value, path: binName.text, capacity: binName.capacity, contained: binName.contained };
            await this.setState(state => {
                return {
                    ...state,
                    binLocation:{...binLocation},
                    errorBin: msg
                }
            });
        }
        return msg === undefined;
    }

    handleQuantityChange = (e) => {
        let value = e.target.value;
        this.validateQuantity(value, true);
    }

    validateQuantity = (value, willUpdateState = true) => {
        const { quantity, binLocations, binLocation } = this.state;
        let msg = undefined;
        const { translate } = this.props;
        let binArr = [];
        let totalQuantity = 0;

        if(binLocations.length){
            binArr = binLocations.filter(x => x.binLocation._id !== binLocation.binLocation._id);
        }

        if(binArr.length){
            for (let i = 0; i < binArr.length; i++) {
                totalQuantity = Number(totalQuantity) + Number(binArr[i].quantity);
            }
        }
        
        let total = totalQuantity;
        if(Number(value) > 0) {
            total = Number(total) + Number(value);
        }
        
        if(total > quantity){
            msg = ` Số lượng đã vượt quá số lượng tồn kho (${quantity}) `;
        }
        
        if(!value) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }

        if(value > binLocation.binLocation.capacity) {
            msg = ` Số lượng đã vượt quá định mức nơi lưu trữ (${binLocation.binLocation.capacity}) `;
        }
        if(binLocation.binLocation.contained !== null) {
            if(Number(value) > (Number(binLocation.binLocation.capacity) -Number(binLocation.binLocation.contained))) {
                msg =  ` Nơi lưu trữ chỉ còn chứa được ${(Number(binLocation.binLocation.capacity) -Number(binLocation.binLocation.contained))} `
            }
        }

        if(willUpdateState){
            this.state.binLocation.quantity = value;
            this.setState(state => {
                return {
                    ...state,
                    errorQuantity: msg
                }
            })
        }
        return msg === undefined;
    }

    isBinLocationsValidated = () => {
        let result =
            this.validateBin(this.state.binLocation.binLocation, false) &&
            this.validateQuantity(this.state.binLocation.quantity, false)
        return result;
    }

    handleAddBinLocation = async (e) => {
        const { indexStock, stockOne } = this.state;
        e.preventDefault();
        await this.setState(state => {
            let binLocations = [ ...(this.state.binLocations), state.binLocation ];
            this.state.stockOne.binLocations = binLocations;
            this.state.stocks[indexStock] = stockOne;
            return {
                ...state,
                binLocations: binLocations,
                binLocation: Object.assign({}, this.EMPTY_BIN)
            }
        })
    }

    handleClearBinLocation = (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                binLocation: Object.assign({}, this.EMPTY_BIN)
            }
        })
    }

    handleEditBinLocation = (binLocation, index) => {

        this.setState(state => {
            return {
                ...state,
                editInfo: true,
                indexInfo: index,
                binLocation: Object.assign({}, binLocation)
            }
        })
    }

    handleSaveEditBinLocation = async (e) => {
        e.preventDefault();
        const { indexInfo, binLocations, stockOne, indexStock } = this.state;
        let newBinLocations;
        if(binLocations){
            newBinLocations = binLocations.map((item, index) => {
                return (index === indexInfo) ? this.state.binLocation : item
            })
        }
        this.state.stockOne.binLocations = newBinLocations;
        this.state.stocks[indexStock] = stockOne;

        await this.setState(state => {
            return {
                ...state,
                editInfo: false,
                binLocations: newBinLocations,
                binLocation: Object.assign({}, this.EMPTY_BIN)
            }
        })
    }

    handleCancelEditBinLocation = (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                editInfo: false,
                binLocation: Object.assign({}, this.EMPTY_BIN)
            }
        })
    }

    handleDeleteBinLocation = (index) => {
        const { binLocations, indexStock, stockOne } = this.state;
        let newBinLocations;
        if(binLocations) {
            newBinLocations = binLocations.filter((item, x) => index !== x)
        }

        this.state.stockOne.binLocations = newBinLocations;
        this.state.stocks[indexStock] = stockOne;

        this.setState(state => {
            return {
                ...state,
                binLocations: newBinLocations
            }
        })
    }

    handleStockChange = async (value) => {
        const { stocks } = this.state;
        const array = this.getAllStocks();
        
        let stock = value[0];
        let indexStock;
        for(let i = 0; i < stocks.length; i++) {
            if(stock === stocks[i].stock._id) {
                indexStock = i;
            }
        }
        let data = array.filter(x => x.value === stock);
        let quantity = data[0].quantity;
        let binLocations = data[0].binLocations;
        this.setState(state => {
            return {
                ...state,
                indexStock,
                stockOne: stocks[indexStock],
                stock: value[0],
                quantity: quantity,
                binLocations: binLocations,
                binLocation: Object.assign({}, this.EMPTY_BIN),
                errorQuantity: undefined,
                errorBin: undefined
            }
        })
        await this.props.getChildBinLocations({ stock: stock });
    }

    save = async () => {
        const { id, stocks } = this.state;
        console.log(stocks);
        await this.props.editLot(id, {
            stocks: stocks,
        });

    }

    getAllStocks = () => {
        const { lot, translate } = this.props;
        if(lot){
            this.state.stocks = lot.stocks;
        }
        let stockArr = [{ value: '', text: translate('manage_warehouse.inventory_management.choose_stock') }];

        if(lot){
            lot.stocks.map(x => {
                stockArr.push({
                    value: x.stock._id,
                    text: x.stock.name,
                    quantity: x.quantity,
                    binLocations: x.binLocations,
                })
            })
        }
        return stockArr;
    }

    getAllBins = () => {
        const { binLocations, translate, lot } = this.props;
        let binArr = [{ value: '', text: translate('manage_warehouse.inventory_management.choose_bin') }];
        if(binLocations.listBinLocation.length > 0 && lot) {
            for(let i = 0; i < binLocations.listBinLocation.length; i++) {
                if(binLocations.listBinLocation[i].status == "1" || binLocations.listBinLocation[i].status == "2") {
                    let check = 0;
                    let capacity = 0;
                    let contained = 0;
                    for(let j = 0; j < binLocations.listBinLocation[i].enableGoods.length; j++) {
                        if(binLocations.listBinLocation[i].enableGoods[j].good._id === lot.good._id) {
                            capacity = binLocations.listBinLocation[i].enableGoods[j].capacity ? binLocations.listBinLocation[i].enableGoods[j].capacity : 0;
                            contained = binLocations.listBinLocation[i].enableGoods[j].contained !== undefined ? binLocations.listBinLocation[i].enableGoods[j].contained : 0;
                            check = 1;
                            break;
                        }
                    }
                    if(check === 1) {
                        // let checkBin = 0;
                        // if(this.state.binLocations.length) {
                        //     for( let k = 0; k < this.state.binLocations.length; k++ ) {
                        //         if(this.state.binLocations[k].binLocation._id === binLocations.listBinLocation[i]._id){
                        //             checkBin = 1;
                        //             break;
                        //         }
                        //     }
                        // }
                        // if(checkBin === 0){
                        //     binArr.push({ value: binLocations.listBinLocation[i]._id, text: binLocations.listBinLocation[i].path, capacity: capacity });
                        // }
                        binArr.push({ value: binLocations.listBinLocation[i]._id, text: binLocations.listBinLocation[i].path, capacity: capacity, contained: contained });
                    }
                }
            }
        }
        return binArr;
    }

    isFormValidated = () => {
        const { quantity } = this.state;
        let number = 0;
        if(this.state.binLocations.length > 0) {
            for (let i = 0; i < this.state.binLocations.length; i++) {
                number += Number(this.state.binLocations[i].quantity);
            }
        }

        let difference = Number(quantity) - Number(number);
        if(difference == 0) {
            return true;
        }
        return false;
    }

    render() {
        const { translate, binLocations } = this.props;
        const { stock, quantity, errorBin, binLocation, errorQuantity } = this.state;
        const dataStocks = this.getAllStocks();
        const dataBins = this.getAllBins();
        let number = 0;
        if(this.state.binLocations.length > 0) {
            for (let i = 0; i < this.state.binLocations.length; i++) {
                number += Number(this.state.binLocations[i].quantity);
            }
        }

        let difference = Number(quantity) - Number(number);

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-edit-lot`} isLoading={binLocations.isLoading}
                    formID={`form-edit-lot`}
                    title={translate('manage_warehouse.stock_management.add_title')}
                    msg_success={translate('manage_warehouse.stock_management.add_success')}
                    msg_faile={translate('manage_warehouse.stock_management.add_faile')}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size={75}
                >
                    <form id={`form-edit-lot`} >
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.inventory_management.stock')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-lot-edit`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={stock ? stock : { value: '', text: translate('manage_warehouse.inventory_management.choose_stock') }}
                                        items={dataStocks}
                                        onChange={this.handleStockChange}    
                                        multiple={false}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.inventory_management.number')}</label>
                                    <input type="number" className="form-control" value={quantity} disabled />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.inventory_management.bin_location')}</legend>
                                { stock ? (difference > 0 ? <div className="form-group" style={{ color: 'red', textAlign: 'center'}}>{`Bạn còn ${difference} số lượng chưa sắp xếp vào kho`}</div> :
                                <div className="form-group" style={{ color: 'green', textAlign: 'center'}}>Bạn đã xếp hết lô hàng vào kho</div>) : []}
                                <div className={`form-group ${!errorBin ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.inventory_management.archive')}</label>
                                    <SelectBox
                                        id={`select-archive-by-bin-edit`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={binLocation.binLocation ? binLocation.binLocation._id : { value: '', text: translate('manage_warehouse.inventory_management.choose_bin') }}
                                        items={dataBins}
                                        onChange={this.handleBinLocationChange}
                                        multiple={false}
                                    />
                                    <ErrorLabel content = { errorBin }/>
                                </div>
                                <div className={`form-group ${!errorQuantity ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('manage_warehouse.inventory_management.number')}</label>
                                    <div>
                                        <input type="number" className="form-control" value={binLocation.quantity} placeholder={translate('manage_warehouse.good_management.max_quantity')} onChange={this.handleQuantityChange} />
                                    </div>
                                    <ErrorLabel content = { errorQuantity }/>
                                </div>

                                <div className="pull-right" style={{marginBottom: "10px"}}>
                                    {this.state.editInfo ?
                                        <React.Fragment>
                                            <button className="btn btn-success" onClick={this.handleCancelEditBinLocation} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                                            <button className="btn btn-success" disabled={!this.isBinLocationsValidated()} onClick={this.handleSaveEditBinLocation} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                                        </React.Fragment>:
                                        <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isBinLocationsValidated()} onClick={this.handleAddBinLocation}>{translate('task_template.add')}</button>
                                    }
                                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearBinLocation}>{translate('task_template.delete')}</button>
                                </div>

                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th title={translate('manage_warehouse.inventory_management.archive')}>{translate('manage_warehouse.inventory_management.archive')}</th>
                                            <th title={translate('manage_warehouse.inventory_management.number')}>{translate('manage_warehouse.inventory_management.number')}</th>
                                            <th>{translate('task_template.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody id={`good-manage-by-stock`}>
                                        { (typeof this.state.binLocations === 'undefined' || this.state.binLocations.length === 0) ? <tr><td colSpan={3}><center>{translate('task_template.no_data')}</center></td></tr> :
                                            this.state.binLocations.map((x, index) => 
                                                <tr key={index}>
                                                    <td>{x.binLocation.path}</td>
                                                    <td>{x.quantity}</td>
                                                    <td>
                                                        <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditBinLocation(x, index)}><i className="material-icons"></i></a>
                                                        <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteBinLocation(index)}><i className="material-icons"></i></a>
                                                    </td>
                                                </tr>
                                            )   
                                        }
                                    </tbody>
                                </table>
                            </fieldset>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editLot: LotActions.editLot,
    getChildBinLocations: BinLocationActions.getChildBinLocations,
    getDetailLot: LotActions.getDetailLot,
}


export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(LotEditForm));
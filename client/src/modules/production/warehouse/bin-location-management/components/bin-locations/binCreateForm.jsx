import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { BinLocationActions } from '../../redux/actions';

import { DialogModal, SelectBox, ErrorLabel, ButtonModal, TreeSelect } from '../../../../../../common-components';

class BinCreateForm extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_GOOD = {
            good: '',
            capacity: '',
            binContained: 0,
            binStatus: '1'
        }
        this.state = {
            binDepartment: '',
            binStatus: '1',
            binUsers: [],
            binParentCreate: '',
            binStock: '',
            binEnableGoods: [],
            good: Object.assign({}, this.EMPTY_GOOD),
            editInfo: false
        }
    }

    getAllDepartment = () => {
        let { translate, department } = this.props;
        let manageDepartmentArr = [{ value: '', text: translate('manage_warehouse.bin_location_management.choose_department') }];

        department.list.map(item => {
            manageDepartmentArr.push({
                value: item._id,
                text: item.name
            })
        })

        return manageDepartmentArr;
    }

    getAllGoods = () => {
        let { translate, goods } = this.props;
        let goodArr = [{ value: '', text: translate('manage_warehouse.good_management.choose_category') }];

        goods.listALLGoods.map(item => {
            goodArr.push({
                value: item._id,
                text: item.name
            })
        })

        return goodArr;
    }

    getAllStocks = () => {
        let { translate, stocks } = this.props;
        let stockArr = [{ value: '', text: translate('manage_warehouse.good_management.choose_category') }];

        if(stocks.listStocks.length){
            stocks.listStocks.map(item => {
                stockArr.push({
                    value: item._id,
                    text: item.name
                })
            })
        }

        return stockArr;
    }

    handleGoodChange = (value) => {
        let good = value[0];
        this.validateGood(good, true);
    }

    validateGood = (value, willUpdateState = true) => {
        const dataGood = this.getAllGoods();
        
        let msg = undefined;
        const { translate } = this.props;
        let { good } = this.state;
        if(!value){
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
        let goodName = dataGood.find(x=>x.value === value);
            good.good = {_id:value,name:goodName.text};
            this.setState(state => {
                return {
                    ...state,
                    good:{...good},
                    errorGood: msg
                }
            });
        }
        return msg === undefined;
    }

    handleContainedChange = (e) => {
        let value = e.target.value;
        this.state.good.contained = value;
        this.setState(state => {
            return {
                ...state
            }
        })
    }

    handleCapacityChange = (e) => {
        let value = e.target.value;
        this.validateCapacity(value, true);
    }

    validateCapacity = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        
        if(!value) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }

        if(willUpdateState){
            this.state.good.capacity = value;
            this.setState(state => {
                return {
                    ...state,
                    errorCapacity: msg
                }
            })
        }
        return msg = undefined;
    }

    isGoodsValidated = () => {
        let result = 
            this.validateGood(this.state.good.good, false)
        return result;
    }

    handleAddGood = async (e) => {
        e.preventDefault();
        await this.setState(state => {
            let binEnableGoods = [ ...(this.state.binEnableGoods), state.good ];
            return {
                ...state,
                binEnableGoods: binEnableGoods,
                good: Object.assign({}, this.EMPTY_GOOD)
            }
        })
    }

    handleClearGood = () => {
        this.setState(state => {
            return {
                ...state,
                good: Object.assign({}, this.EMPTY_GOOD)
            }
        })
    }

    handleEditGood = (good, index) => {
        this.setState(state => {
            return {
                ...state,
                editInfo: true,
                indexInfo: index,
                good: Object.assign({}, good)
            }
        })
    }

    handleSaveEditGood = async (e) => {
        e.preventDefault();
        const { indexInfo, binEnableGoods } = this.state;
        let newEnableGoods;
        if(binEnableGoods){
            newEnableGoods = binEnableGoods.map((item, index) => {
                return (index === indexInfo) ? this.state.good : item
            })
        }

        await this.setState(state => {
            return {
                ...state,
                editInfo: false,
                binEnableGoods: newEnableGoods,
                good: Object.assign({}, this.EMPTY_GOOD)
            }
        })
    }

    handleCancelEditGood = (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                editInfo: false,
                good: Object.assign({}, this.EMPTY_GOOD)
            }
        })
    }

    handleDeleteGood = async (index) => {
        let { binEnableGoods } = this.state;
        let newEnableGoods;
        if(binEnableGoods) {
            newEnableGoods = binEnableGoods.filter((item, x) => index !== x)
        }

        this.setState(state => {
            return {
                ...state,
                binEnableGoods: newEnableGoods
            }
        })
    }

    handleCodeChange = (e) => {
        let value = e.target.value;
        this.validateCode(value, true);
    }

    validateCode = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if(!value) {
            msg = translate('manage_warehouse.category_management.validate_code');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorCode: msg,
                    binCode: value
                }
            });
        }
        return msg === undefined;
    }

    handleStatusChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                binStatus: value[0]
            }
        })
    }

    handleDepartmentChange = (value) => {
        let department = value[0];
        this.validateDepartment(department, true);
    }

    validateDepartment = (department, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if(!department) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorDepartment: msg,
                    binDepartment: department
                }
            });
        }
        return msg === undefined;
    }

    handleUnitChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                binUnit: value
            }
        })
    }

    handleStockChange = (value) => {
        let stock = value[0];
        this.validateStock(stock, true)
    }

    validateStock = async (stock, willUpdateState = true) => {
        
        let msg = undefined;
        const { translate } = this.props;
        if(!stock) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            await this.setState(state => {
                return {
                    ...state,
                    errorStock: msg,
                    binStock: stock
                }
            });
        }
        await this.props.getBinLocations({ stock });
        return msg === undefined;
    }

    handleContainedTotalChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                binContained: value
            }
        })
    }

    handleNameChange = (e) => {
        let value = e.target.value;
        this.validateName(value, true);
    }

    validateName = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if(!value) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorName: msg,
                    binName: value
                }
            });
        }
        return msg === undefined;
    }

    handleCapacityTotalChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                binCapacity: value
            }
        })
    }

    handleManagementLocationtChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                binUsers: value
            }
        })
    }

    handleParent = (value) => {
        this.setState(state => {
            return {
                ...state,
                binParentCreate: value[0]
            }
        })
    }

    handleDescriptionChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                binDescription: value
            }
        })
    }

    isValidated = () => {
        let result =
            this.validateCode(this.state.binCode, false) &&
            this.validateName(this.state.binName, false) &&
            this.validateDepartment(this.state.binDepartment, false);
        
        return result;
    }

    save = async () => {
        const { binCode, binName, binStatus, binUnit, binUsers, binPath, binContained, 
            binParentCreate, binCapacity, binDescription, binDepartment, binEnableGoods, binStock} = this.state;
        await this.props.createBinLocation({
            code: binCode,
            name: binName,
            status: binStatus,
            unit: binUnit,
            users: binUsers,
            parent: binParentCreate,
            capacity: binCapacity,
            description: binDescription,
            department: binDepartment,
            enableGoods: binEnableGoods,
            contained: binContained,
            stock: binStock
        });
        window.$(`#edit-bin-location`).slideUp();
        await this.props.getBinLocations();
    }

    render() {
        const { translate, binLocations, user, stocks } = this.props;
        const { list } = binLocations.binLocationByStock;
        const { binParentCreate, binStock, binContained, binStatus, binUsers, binDepartment, good, binEnableGoods, errorCapacity, errorCode, errorName, errorGood, errorStock, errorDepartment} = this.state;
        const dataDepartment = this.getAllDepartment();
        const dataGoods = this.getAllGoods();
        const dataStocks = this.getAllStocks();
        const listUsers = user.list;

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-create-bin-location`}
                    formID={`form-create-bin-location`}
                    title={translate('manage_warehouse.stock_management.add_title')}
                    msg_success={translate('manage_warehouse.stock_management.add_success')}
                    msg_faile={translate('manage_warehouse.stock_management.add_faile')}
                    size={75}
                    disableSubmit={!this.isValidated()}
                    func={this.save}
                >
                    <form id={`form-create-bin-location`} >
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!errorCode ? "" : "has-error"}`}>
                                <label>{translate('manage_warehouse.bin_location_management.code')}<span className="attention"> * </span></label>
                                <input type="text" className="form-control" onChange={this.handleCodeChange}/>
                                <ErrorLabel content = { errorCode }/>
                            </div>
                            <div className={`form-group ${!errorStock ? "" : "has-error"}`}>
                                <label>{translate('manage_warehouse.bin_location_management.stock')}<span className="attention"> * </span></label>
                                <SelectBox
                                    id={`select-stock-bin-location-create`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={binStock ? binStock : { value: '', text: translate('manage_warehouse.good_management.choose_category') }}
                                    items={dataStocks}
                                    onChange={this.handleStockChange}    
                                    multiple={false}
                                />
                                <ErrorLabel content = { errorStock }/>
                            </div>
                            <div className={`form-group`}>
                                <label>{translate('manage_warehouse.bin_location_management.status')}<span className="attention"> * </span></label>
                                <SelectBox
                                    id={`select-status-bin-location-create`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={binStatus}
                                    items={[
                                        { value: '1', text: translate('manage_warehouse.bin_location_management.1.status') },
                                        { value: '2', text: translate('manage_warehouse.bin_location_management.2.status') },
                                        { value: '3', text: translate('manage_warehouse.bin_location_management.3.status') },
                                        { value: '4', text: translate('manage_warehouse.bin_location_management.4.status') },
                                        { value: '5', text: translate('manage_warehouse.bin_location_management.5.status') },
                                    ]}
                                    onChange={this.handleStatusChange}    
                                    multiple={false}
                                />
                            </div>
                            <div className={`form-group ${!errorDepartment ? "" : "has-error"}`}>
                                <label>{translate('manage_warehouse.bin_location_management.department')}<span className="attention"> * </span></label>
                                <SelectBox
                                    id={`select-department-bin-create`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={binDepartment}
                                    items={dataDepartment}
                                    onChange={this.handleDepartmentChange}    
                                    multiple={false}
                                />
                                <ErrorLabel content = { errorDepartment }/>
                            </div>
                            <div className={`form-group`}>
                                <label>{translate('manage_warehouse.bin_location_management.unit')}<span className="attention"> * </span></label>
                                <input type="text" className="form-control" onChange={this.handleUnitChange} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!errorName ? "" : "has-error"}`}>
                                <label>{translate('manage_warehouse.bin_location_management.name')}<span className="attention"> * </span></label>
                                <input type="text" className="form-control" onChange={this.handleNameChange} />
                                <ErrorLabel content = { errorName }/>
                            </div>
                            <div className="form-group">
                                <label>{translate('manage_warehouse.bin_location_management.capacity')}</label>
                                <input type="number" className="form-control" onChange={this.handleCapacityTotalChange} />
                            </div>
                            <div className="form-group">
                                <label>{translate('manage_warehouse.bin_location_management.contained')}</label>
                                <input type="number" className="form-control" disabled value= {binContained} onChange={this.handleContainedTotalChange} />
                            </div>
                            <div className={`form-group`}>
                                <label>{translate('manage_warehouse.bin_location_management.management_location')}<span className="attention"> * </span></label>
                                <SelectBox
                                    id={`select-management-location-stock-create`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={binUsers}
                                    items={listUsers.map(x => { return { value: x.id, text: x.name } })}
                                    onChange={this.handleManagementLocationtChange}    
                                    multiple={true}
                                />
                            </div>
                            <div className={`form-group`}>
                                <label>{translate('manage_warehouse.bin_location_management.parent')}</label>
                                <TreeSelect data={list} value={[binParentCreate]} handleChange={this.handleParent} mode="radioSelect" />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group">
                                <label>{translate('manage_warehouse.bin_location_management.description')}</label>
                                <textarea type="text" className="form-control" onChange={this.handleDescriptionChange} />
                            </div>
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.bin_location_management.enable_good')}</legend>
                                
                                <div className={`form-group ${!errorGood ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.good_management.good')}</label>
                                    <SelectBox
                                        id={`select-good-by-bin-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={good.good._id}
                                        items={dataGoods}
                                        onChange={this.handleGoodChange}
                                        multiple={false}
                                    />
                                    <ErrorLabel content = { errorGood }/>
                                </div>
                                <div className={`form-group`}>
                                    <label className="control-label">{translate('manage_warehouse.bin_location_management.contained')}</label>
                                    <div>
                                        <input type="number" className="form-control" value={good.contained} disabled placeholder={translate('manage_warehouse.good_management.contained')} onChange={this.handleContainedChange} />
                                    </div>
                                </div>
                                <div className={`form-group ${!errorCapacity ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('manage_warehouse.bin_location_management.max_quantity')}</label>
                                    <div>
                                        <input type="number" className="form-control" value={good.capacity} placeholder={translate('manage_warehouse.good_management.max_quantity')} onChange={this.handleCapacityChange} />
                                    </div>
                                    <ErrorLabel content = { errorCapacity }/>
                                </div>

                                <div className="pull-right" style={{marginBottom: "10px"}}>
                                    {this.state.editInfo ?
                                        <React.Fragment>
                                            <button className="btn btn-success" onClick={this.handleCancelEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                                            <button className="btn btn-success" disabled={!this.isGoodsValidated()} onClick={this.handleSaveEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                                        </React.Fragment>:
                                        <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isGoodsValidated()} onClick={this.handleAddGood}>{translate('task_template.add')}</button>
                                    }
                                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>{translate('task_template.delete')}</button>
                                </div>

                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th title={translate('manage_warehouse.bin_location_management.good')}>{translate('manage_warehouse.bin_location_management.good')}</th>
                                            <th title={translate('manage_warehouse.bin_location_management.contained')}>{translate('manage_warehouse.bin_location_management.contained')}</th>
                                            <th title={translate('manage_warehouse.bin_location_management.max_quantity')}>{translate('manage_warehouse.bin_location_management.max_quantity')}</th>
                                            <th>{translate('task_template.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody id={`good-manage-by-stock`}>
                                        { (typeof binEnableGoods === 'undefined' || binEnableGoods.length === 0) ? <tr><td colSpan={4}><center>{translate('task_template.no_data')}</center></td></tr> :
                                            binEnableGoods.map((x, index) => 
                                                <tr key={index}>
                                                    <td>{x.good.name}</td>
                                                    <td>{x.contained}</td>
                                                    <td>{x.capacity}</td>
                                                    <td>
                                                        <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditGood(x, index)}><i className="material-icons"></i></a>
                                                        <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteGood(index)}><i className="material-icons"></i></a>
                                                    </td>
                                                </tr>
                                            )   
                                        }
                                    </tbody>
                                </table>
                            </fieldset>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    createBinLocation: BinLocationActions.createBinLocation,
    getBinLocations: BinLocationActions.getBinLocations,
    edit: BinLocationActions.editBinLocation
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BinCreateForm));
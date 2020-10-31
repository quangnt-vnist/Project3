import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from '../../../../../common-components';
import { StockActions } from '../redux/actions';
import { translate } from 'react-redux-multilingual/lib/utils';

class StockEditForm extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_GOOD = {
            good: '',
            maxQuantity: '',
            minQuantity: ''
        }
        this.state = {
            code: '',
            name: '',
            status: '1',
            address: '',
            goods: [],
            good: Object.assign({}, this.EMPTY_GOOD),
            managementLocation: [],
            description: '',
            manageDepartment: '',
            editInfo: false
            
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.stockId !== prevState.stockId){
            return {
                ...prevState,
                stockId: nextProps.stockId,
                code: nextProps.code,
                name: nextProps.name,
                status: nextProps.status,
                address: nextProps.address,
                goodsManagement: nextProps.goodsManagement,
                goods: nextProps.goodsManagement,
                managementLocation: nextProps.managementLocation,
                manageDepartment: nextProps.manageDepartment,
                description: nextProps.description,
                errorOnName: undefined, 
                errorOnCode: undefined, 
                errorOnAddress: undefined, 
                errorOnDepartment: undefined, 
                errorOnManagementLocation: undefined, 
                errorOnGood: undefined, 
                errorOnMinQuantity: undefined, 
                errorOnMaxQuantity: undefined

            }
        }
        else {
            return null;
        }
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
                    errorOnCode: msg,
                    code: value
                }
            });
        }
        return msg === undefined;
    }

    handleNameChange = (e) => {
        let value = e.target.value;
        this.validateName(value, true);
    }
    
    validateName = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if(!value){
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnName: msg,
                    name: value,
                }
            });
        }
        return msg === undefined;
    }

    handleAddressChange = (e) => {
        let value = e.target.value;
        this.validateAddress(value, true);
    }
    
    validateAddress = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if(!value){
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnAddress: msg,
                    address: value,
                }
            });
        }
        return msg === undefined;
    }

    handleDepartmentChange = (value) => {
        let manageDepartment = value[0];
        this.validateDepartment(manageDepartment, true);
    }
    
    validateDepartment = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if(!value){
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDepartment: msg,
                    manageDepartment: value,
                }
            });
        }
        return msg === undefined;
    }

    handleManagementLocationtChange = (value) => {
        this.validateManagementLocation(value, true);
    }
    
    validateManagementLocation = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if(!value){
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnManagementLocation: msg,
                    managementLocation: value,
                }
            });
        }
        return msg === undefined;
    }

    handleStatusChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                status: value[0]
            }
        })
    }

    handleDescriptionChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                description: value
            }
        });
    }

    handleGoodsChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                goods: value
            }
        })
    }

    isFormValidated = () => {
        let result =
            this.validateName(this.state.name, false) &&
            this.validateCode(this.state.code, false) &&
            this.validateAddress(this.state.address, false) &&
            this.validateDepartment(this.state.manageDepartment, false) &&
            this.validateManagementLocation(this.state.managementLocation, false)
        return result;
    }

    save = () => {
        if (this.isFormValidated()) {
            this.props.editStock(this.props.stockId, this.state);
        }
    }

    getAllDepartment = () => {
        let { translate } = this.props;
        let manageDepartmentArr = [{ value: '', text: translate('manage_warehouse.stock_management.choose_department') }];

        this.props.department.list.map(item => {
            manageDepartmentArr.push({
                value: item._id,
                text: item.name
            })
        })

        return manageDepartmentArr;
    }

    handleMinQuantityChange = (e) => {
        let value = e.target.value;
        this.state.good.minQuantity = value;
        this.setState(state => {
            return {
                ...state
            }
        })
    }

    handleMaxQuantityChange = (e) => {
        let value = e.target.value;
        this.state.good.maxQuantity = value;
        console.log(value);
        this.setState(state => {
            return {
                ...state
            }
        })
    }

    getAllGoods = () => {
        let { translate } = this.props;
        let goodArr = [{ value: '', text: translate('manage_warehouse.good_management.choose_category') }];

        this.props.goods.listALLGoods.map(item => {
            goodArr.push({
                value: item._id,
                text: item.name
            })
        })

        return goodArr;
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
                    errorOnGood: msg
                }
            });
        }
        return msg === undefined;
    }

    isGoodsValidated = () => {
        let result =
            this.validateGood(this.state.good.good, false)
        return result;
    }

    handleAddGood = async (e) => {
        e.preventDefault();
        await this.setState(state => {
            let goods = [ ...(this.state.goods), state.good];
            return {
                ...state,
                goods: goods,
                good: Object.assign({}, this.EMPTY_GOOD)
            }
        })
    }

    handleDeleteGood = async (index) => {
        let { goods } = this.state;
        let newGoods;
        if(goods){
            newGoods = goods.filter((item, x) => index !== x);
        }
        await this.setState(state => {
            return {
                ...state,
                goods: newGoods
            }
        })
    }

    handleEditGood = async (good, index) => {
        this.setState(state => {
            return{
                ...state,
                editInfo: true,
                indexInfo: index,
                good: Object.assign({}, good)
            }
        })
    }

    handleSaveEditGood = async (e) => {
        e.preventDefault();
        const { indexInfo, goods } = this.state;
        let newGoods;
        if(goods){
            newGoods = goods.map((item, index) => {
                return (index === indexInfo) ? this.state.good : item;
            })
        }
        await this.setState(state => {
            return {
                ...state,
                editInfo: false,
                goods: newGoods,
                good: Object.assign({}, this.EMPTY_GOOD)
            }
        })
    }

    handleCancelEditGood = async (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                editInfo: false,
                good: Object.assign({}, this.EMPTY_GOOD)
            }
        })
    }

    handleClearGood = async () => {
        this.setState(state => {
            return {
                ...state,
                good: Object.assign({}, this.EMPTY_GOOD),
            }
        })
    }

    render() {
        const { translate, stocks, role } = this.props;
        const { errorOnName, errorOnCode, errorOnAddress, errorOnDepartment, errorOnManagementLocation, 
                errorOnGood, errorOnMinQuantity, errorOnMaxQuantity, code, name, managementLocation, status, address, description, manageDepartment, goods, good } = this.state;
        const departmentManagement = this.getAllDepartment();
        const listGoods = this.getAllGoods();
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-edit-stock`} isLoading={stocks.isLoading}
                    formID={`form-edit-stock`}
                    title={translate('manage_warehouse.stock_management.add_title')}
                    msg_success={translate('manage_warehouse.stock_management.add_success')}
                    msg_faile={translate('manage_warehouse.stock_management.add_faile')}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size={75}
                >
                    <form id={`form-edit-stock`} >
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorOnCode ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.stock_management.code')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value={code} onChange={this.handleCodeChange}/>
                                    <ErrorLabel content = { errorOnCode }/>
                                </div>
                                <div className={`form-group ${!errorOnAddress ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.stock_management.address')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value={address} onChange={this.handleAddressChange} />
                                    <ErrorLabel content = { errorOnAddress } />
                                </div>
                                <div className={`form-group ${!errorOnDepartment ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.stock_management.department')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-edit-status-of-stock`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={manageDepartment ? manageDepartment : { value: '', text: translate('manage_warehouse.stock_management.choose_department') }}
                                        items={departmentManagement}
                                        onChange={this.handleDepartmentChange}    
                                        multiple={false}
                                    />
                                    <ErrorLabel content = { errorOnDepartment } />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorOnName ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.stock_management.name')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value={name} onChange={this.handleNameChange} />
                                    <ErrorLabel content = { errorOnName } />
                                </div>
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.stock_management.status')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-status-edit-stock`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={status}
                                        items={[
                                            { value: '1', text: translate('manage_warehouse.stock_management.1')},
                                            { value: '2', text: translate('manage_warehouse.stock_management.2')},
                                            { value: '3', text: translate('manage_warehouse.stock_management.3')},
                                            { value: '4', text: translate('manage_warehouse.stock_management.4')},
                                        ]}
                                        onChange={this.handleStatusChange}    
                                        multiple={false}
                                    />
                                </div>
                                <div className={`form-group ${!errorOnManagementLocation ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.stock_management.management_location')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-management-location-edit-stock`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={role.list.map((y, index) => { return { value: y._id, text: y.name}})}
                                        value={managementLocation}
                                        onChange={this.handleManagementLocationtChange}    
                                        multiple={true}
                                    />
                                    <ErrorLabel content = { errorOnManagementLocation } />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.stock_management.description')}</label>
                                    <textarea type="text" className="form-control" value={description} onChange={this.handleDescriptionChange} />
                                </div>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.stock_management.goods')}</legend>
                                    
                                    <div className={`form-group ${!errorOnGood ? "" : "has-error"}`}>
                                        <label>{translate('manage_warehouse.good_management.good')}</label>
                                        <SelectBox
                                            id={`select-edit-good-by-stock`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={good.good._id ? good.good._id : { value: '', text: translate('manage_warehouse.good_management.choose_category') }}
                                            items={listGoods}
                                            onChange={this.handleGoodChange}
                                            multiple={false}
                                        />
                                        <ErrorLabel content = { errorOnGood } />
                                    </div>

                                    <div className={`form-group ${!errorOnMinQuantity ? "" : "has-error"}`}>
                                        <label className="control-label">{translate('manage_warehouse.stock_management.min_quantity')}</label>
                                        <div>
                                            <input type="number" className="form-control" placeholder={translate('manage_warehouse.good_management.min_quantity')} value={good.minQuantity} onChange={this.handleMinQuantityChange} />
                                        </div>
                                        <ErrorLabel content = { errorOnMinQuantity } />
                                    </div>
                                    <div className={`form-group ${!errorOnMaxQuantity ? "" : "has-error"}`}>
                                        <label className="control-label">{translate('manage_warehouse.stock_management.max_quantity')}</label>
                                        <div>
                                            <input type="number" className="form-control" placeholder={translate('manage_warehouse.good_management.max_quantity')} value={good.maxQuantity} onChange={this.handleMaxQuantityChange} />
                                        </div>
                                        <ErrorLabel content = { errorOnMaxQuantity } />
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
                                                <th title={translate('manage_warehouse.stock_management.good')}>{translate('manage_warehouse.stock_management.good')}</th>
                                                <th title={translate('manage_warehouse.stock_management.min_quantity')}>{translate('manage_warehouse.stock_management.min_quantity')}</th>
                                                <th title={translate('manage_warehouse.stock_management.max_quantity')}>{translate('manage_warehouse.stock_management.max_quantity')}</th>
                                                <th>{translate('task_template.action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-edit-manage-by-stock`}>
                                            {
                                                (typeof goods === 'undefined' || goods.length === 0) ? <tr><td colSpan={4}><center>{translate('task_template.no_data')}</center></td></tr> :
                                                goods.map((x, index) =>
                                                    <tr key={index}>
                                                        <td>{x.good.name}</td>
                                                        <td>{x.minQuantity}</td>
                                                        <td>{x.maxQuantity}</td>
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
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}
function mapStateToProps(state) {
    const { stocks, department, role, goods } = state;
    return { stocks, department, role, goods };
}

const mapDispatchToProps = {
    editStock: StockActions.editStock,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(StockEditForm));
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { BinLocationActions } from '../../redux/actions';

import { SelectBox, TreeSelect, ErrorLabel, DialogModal } from '../../../../../../common-components';
class ArchiveEditForm extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_GOOD = {
            good: '',
            capacity: '',
            contained: ''
        }
        this.state = {
            binEnableGoods: [],
            good: Object.assign({}, this.EMPTY_GOOD),
            editInfo: false,
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.binId !== state.binId) {
            return {
                ...state,
                binId: props.binId,
                binStatus: props.binStatus,
                binContained: props.binContained,
                binEnableGoods: props.binEnableGoods,
                binParent: props.binParent,
                page: props.page,
                limit: props.limit,
                errorGood: undefined,
                errorCapacity: undefined
            }
        } else {
            return null;
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

    handleStatusChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                binStatus: value[0]
            }
        })
    }


    handleContainedTotalChange = (e) => {
        let value = e.target.value;
        console.log(value);
        this.setState(state => {
            return {
                ...state,
                binContained: value
            }
        })
    }

    save = async () => {
        const { binId, binContained, binEnableGoods, binStatus, binParent, page, limit} = this.state;

        let array = [];

        await this.props.editBinLocation(binId, {
            status: binStatus,
            enableGoods: binEnableGoods,
            parent: binParent,
            contained: binContained ? binContained : 0,
            array: array
        });

        await this.props.getChildBinLocations({page, limit})
    }

    render() {
        const { translate, binLocations } = this.props;
        const { binStatus, binContained, binEnableGoods, errorCapacity, errorGood, good } = this.state;
        const dataGoods = this.getAllGoods();

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-edit-archive-stock`} isLoading={binLocations.isLoading}
                    formID={`form-edit-archive-stock`}
                    title={translate('manage_warehouse.stock_management.add_title')}
                    msg_success={translate('manage_warehouse.stock_management.add_success')}
                    msg_faile={translate('manage_warehouse.stock_management.add_faile')}
                    func={this.save}
                    size={75}
                >
                    <form id={`form-edit-archive-stock`} >
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bin_location_management.status')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-status-bin-location-edit`}
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
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.bin_location_management.contained')}<span className="attention"> * </span></label>
                                    <input type="number" className="form-control" value={binContained ? binContained : ""} onChange={this.handleContainedTotalChange} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.bin_location_management.enable_good')}</legend>
                                
                                <div className={`form-group ${!errorGood ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.good_management.good')}</label>
                                    <SelectBox
                                        id={`select-good-by-bin-edit`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={good.good._id ? good.good._id : { value: '', text: translate('manage_warehouse.good_management.choose_category') }}
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
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editBinLocation: BinLocationActions.editBinLocation,
    getChildBinLocations: BinLocationActions.getChildBinLocations
}


export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ArchiveEditForm));
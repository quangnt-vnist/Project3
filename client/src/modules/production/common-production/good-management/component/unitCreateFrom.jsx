import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import {ErrorLabel} from '../../../../../common-components';

class UnitCreateForm extends Component{
    constructor(props){
        super(props);
        this.EMPTY_UNIT = {
            name: '',
            conversionRate: '',
            description: ''
        };
       
        this.state={
            unit: Object.assign({}, this.EMPTY_UNIT),
            listUnit: this.props.initialData,
            editInfo: false
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.id !== prevState.id){
            return {
                ...prevState,
                id: nextProps.id,
                listUnit: nextProps.initialData
            }
        }
        else {
            return null;
        }
    }

    handleUnitNameChange = (e) => {
        let value = e.target.value;
        this.validateUnitName(value, true);
    }
    
    validateUnitName = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if(!value){
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            this.state.unit.name = value;
            this.setState(state => {
                return {
                    ...state,
                    errorOnUnitName: msg,
                }
            });
        }
        return msg === undefined;
    }

    handleConversionRateChange = (e) => {
        let value = e.target.value;
        this.validateConversionRate(value, true);
    }
    
    validateConversionRate = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if(!value){
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            this.state.unit.conversionRate = value;
            this.setState(state => {
                return {
                    ...state,
                    errorOnUnitConversionRate: msg,
                }
            });
        }
        return msg === undefined;
    }

    handleDescriptionChange = (e) => {
        let value = e.target.value;
        this.state.unit.description = value;
        this.setState(state => {
            return {
                ...state
            }
        })
    }

    isUnitsValidated = () => {
        let result =
        this.validateUnitName(this.state.unit.name, false) &&
        this.validateConversionRate(this.state.unit.conversionRate, false)
        return result
    }

    handleAddUnit = async (e) => {
        e.preventDefault();
        await this.setState(state => {
            const listUnit = [ ...(this.state.listUnit), state.unit];
            return {
                ...state,
                listUnit: listUnit,
                unit: Object.assign({}, this.EMPTY_UNIT),
            }
        })
        this.props.onDataChange(this.state.listUnit);
    }

    handleEditUnit = async (unit, index) => {
        this.setState(state => {
            return {
                ...state,
                editInfo: true,
                indexInfo: index,
                unit: Object.assign({}, unit)
            }
        })
    }

    handleSaveEditUnit = async (e) => {
        e.preventDefault();
        const { indexInfo, listUnit } = this.state;
        let newListUnit;
        if (listUnit) {
            newListUnit = listUnit.map((item, index) => {
                return (index === indexInfo) ? this.state.unit : item;
            })
        }
        await this.setState(state => {
            return {
                ...state,
                listUnit: newListUnit,
                editInfo: false,
                unit: Object.assign({}, this.EMPTY_UNIT),
            }
        })
        this.props.onDataChange(this.state.listUnit);
    }

    handleCancelEditUnit = async (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                editInfo: false,
                unit: Object.assign({}, this.EMPTY_UNIT)
            }
        })
    }

    handleClearUnit = async (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                unit: Object.assign({}, this.EMPTY_UNIT)
            }
        })
    }

    handleDeleteUnit = async (index) => {
        const { listUnit } = this.state;
        let newListUnit;
        if(listUnit){
            newListUnit = listUnit.filter((item, x) => index !== x);
        }
        await this.setState(state => {
            return {
                ...state,
                listUnit: newListUnit
            }
        })

        this.props.onDataChange(this.state.listUnit);
    }

    render(){
        const { translate, id } = this.props;
        let { listUnit, unit, errorOnUnitName, errorOnConversionRate, description, conversionRate } =this.state;

        return(

            <fieldset className="scheduler-border">
                <legend className="scheduler-border">{translate('manage_warehouse.good_management.unit')}</legend>
                
                <div className={`form-group ${!errorOnUnitName ? "" : "has-error"}`}>
                    <label className="control-label">{translate('manage_warehouse.good_management.unit_name')}</label>
                    <div>
                        <input type="text" className="form-control" placeholder={translate('manage_warehouse.good_management.unit_name')} value={unit.name} onChange={this.handleUnitNameChange} />
                    </div>
                    <ErrorLabel content = { errorOnUnitName } />
                </div>

                <div className={`form-group ${!errorOnConversionRate ? "" : "has-error"}`}>
                    <label className="control-label">{translate('manage_warehouse.good_management.conversion_rate')}</label>
                    <div>
                        <input type="number" className="form-control" placeholder={translate('manage_warehouse.good_management.conversion_rate')} value={unit.conversionRate} onChange={this.handleConversionRateChange} />
                    </div>
                    <ErrorLabel content = { errorOnConversionRate } />
                </div>

                <div className="form-group">
                    <label className="control-label">{translate('manage_warehouse.good_management.description')}</label>
                    <div>
                        <textarea type="number" className="form-control" placeholder={translate('manage_warehouse.good_management.description')} value={unit.description} onChange={this.handleDescriptionChange} />
                    </div>
                </div>

                <div className="pull-right" style={{marginBottom: "10px"}}>
                    {this.state.editInfo ?
                        <React.Fragment>
                            <button className="btn btn-success" onClick={this.handleCancelEditUnit} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                            <button className="btn btn-success" disabled={!this.isUnitsValidated()} onClick={this.handleSaveEditUnit} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                        </React.Fragment>:
                        <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isUnitsValidated()} onClick={this.handleAddUnit}>{translate('task_template.add')}</button>
                    }
                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearUnit}>{translate('task_template.delete')}</button>
                </div>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th title={translate('manage_warehouse.good_management.name')}>{translate('manage_warehouse.good_management.name')}</th>
                            <th title={translate('manage_warehouse.good_management.conversion_rate')}>{translate('manage_warehouse.good_management.conversion_rate')}</th>
                            <th title={translate('manage_warehouse.good_management.description')}>{translate('manage_warehouse.good_management.description')}</th>
                            <th>{translate('task_template.action')}</th>
                        </tr>
                    </thead>
                    <tbody id={`unit-create-good${id}`}>
                        {
                            (typeof listUnit === 'undefined' || listUnit.length === 0) ? <tr><td colSpan={4}><center>{translate('task_template.no_data')}</center></td></tr> :
                                listUnit.map((item, index) =>
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.conversionRate}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditUnit(item, index)}><i className="material-icons"></i></a>
                                        <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteUnit(index)}><i className="material-icons"></i></a>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </fieldset>
        )
    }
}

export default connect(null, null)(withTranslate(UnitCreateForm));

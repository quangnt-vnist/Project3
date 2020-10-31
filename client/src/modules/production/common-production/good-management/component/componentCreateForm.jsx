import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { GoodActions } from '../redux/actions';

import {ErrorLabel, SelectBox} from '../../../../../common-components';

class ComponentCreateForm extends Component{
    constructor(props){
        super(props);
        this.EMPTY_GOOD = {

            good: '',
            quantity: '',
        };
       
        this.state={
            material: Object.assign({}, this.EMPTY_GOOD),
            listMaterial: this.props.initialData,
            editInfo: false
        }
    }

    componentDidMount(){
        let type = 'material';
        this.props.getAllGoodsByType({ type });
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.id !== prevState.id){
            return {
                ...prevState,
                id: nextProps.id,
                listMaterial: nextProps.initialData
            }
        }
        else {
            return null;
        }
    }

    handleQuantityChange = (e) => {
        let value = e.target.value;
        this.validateQuantity(value, true);
    }
    
    validateQuantity = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if(!value){
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            this.state.material.quantity = value;
            this.setState(state => {
                return {
                    ...state,
                    errorOnMaterialQuantity: msg,
                }
            });
        }
        return msg === undefined;
    }

    handleGoodChange = (value) => {
        let material = value[0];
        this.validateGood(material, true);
    }

    validateGood = (value, willUpdateState = true) => {
        const dataGoodByType = this.getGoodsByType();
        
        let msg = undefined;
        const { translate } = this.props;
        let {material} = this.state;
        if(!value){
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
        let goodName = dataGoodByType.find(x=>x.value === value);
            material.good = {_id:value,name:goodName.text};
            this.setState(state => {
                return {
                    ...state,
                    material:{...material},
                    errorOnGood: msg
                }
            });
        }
        return msg === undefined;
    }

    getGoodsByType = () => {
        let { goods, translate } = this.props;
        let listGoodsByType = goods.listGoodsByType;
        let goodArr = [{ value: '', text: translate('manage_warehouse.good_management.choose_category') }];

        listGoodsByType.map(item => {
            goodArr.push({
                value: item._id,
                text: item.name
            })
        })

        return goodArr;
    }

    isMaterialsValidated = () => {
        let result = 
        this.validateQuantity(this.state.material.quantity, false) &&
        this.validateGood(this.state.material.good, false)
        return result
    }

    handleAddMaterial = async (e) => {
        e.preventDefault();
        await this.setState(state => {
            let listMaterial = [ ...(this.state.listMaterial), state.material];
            return {
                ...state,
                listMaterial: listMaterial,
                material: Object.assign({}, this.EMPTY_GOOD),
            }
        })
        this.props.onDataChange(this.state.listMaterial);
    }

    handleEditMaterial = async (material, index) => {
        this.setState(state => {
            return {
                ...state,
                editInfo: true,
                indexInfo: index,
                material: Object.assign({}, material)
            }
        })
    }

    handleSaveEditMaterial = async (e) => {
        e.preventDefault();
        const { indexInfo, listMaterial } = this.state;
        let newListMaterial;
        if (listMaterial) {
            newListMaterial = listMaterial.map((item, index) => {
                return (index === indexInfo) ? this.state.material : item;
            })
        }
        await this.setState(state => {
            return {
                ...state,
                listMaterial: newListMaterial,
                editInfo: false,
                material: Object.assign({}, this.EMPTY_GOOD),
            }
        })
        this.props.onDataChange(this.state.listMaterial);
    }

    handleCancelEditMaterial = async (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                editInfo: false,
                material: Object.assign({}, this.EMPTY_GOOD)
            }
        })
    }

    handleClearMaterial = async (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                material: Object.assign({}, this.EMPTY_GOOD)
            }
        })
    }

    handleDeleteMaterial = async (index) => {
        const { listMaterial } = this.state;
        let newListMaterial;
        if(listMaterial){
            newListMaterial = listMaterial.filter((item, x) => index !== x);
        }
        await this.setState(state => {
            return {
                ...state,
                listMaterial: newListMaterial
            }
        })

        this.props.onDataChange(this.state.listMaterial);
    }

    render(){
        const { translate, id, type } = this.props;
        let { listMaterial, material, errorOnMaterialQuantity, errorOnGood } =this.state;
        const dataGoodByType = this.getGoodsByType();
        let component = '';
        if(material.good){
            component = material.good._id
        }

        return(
            
            <fieldset className="scheduler-border">
                <legend className="scheduler-border">{translate('manage_warehouse.good_management.materials')}</legend>
                
                <div className={`form-group ${!errorOnGood ? "" : "has-error"}`}>
                    <label>{translate('manage_warehouse.good_management.material')}</label>
                    <SelectBox
                        id={`select-material-by-${id}`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        value={component ? component : { value: '', text: translate('manage_warehouse.good_management.choose_category') }}
                        items={dataGoodByType}
                        onChange={this.handleGoodChange}
                        multiple={false}
                    />
                    <ErrorLabel content = { errorOnGood } />
                </div>

                <div className={`form-group ${!errorOnMaterialQuantity ? "" : "has-error"}`}>
                    <label className="control-label">{translate('manage_warehouse.good_management.quantity')}</label>
                    <div>
                        <input type="number" className="form-control" placeholder={translate('manage_warehouse.good_management.quantity')} value={material.quantity} onChange={this.handleQuantityChange} />
                    </div>
                    <ErrorLabel content = { errorOnMaterialQuantity } />
                </div>

                <div className="pull-right" style={{marginBottom: "10px"}}>
                    {this.state.editInfo ?
                        <React.Fragment>
                            <button className="btn btn-success" onClick={this.handleCancelEditMaterial} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                            <button className="btn btn-success" disabled={!this.isMaterialsValidated()} onClick={this.handleSaveEditMaterial} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                        </React.Fragment>:
                        <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isMaterialsValidated()} onClick={this.handleAddMaterial}>{translate('task_template.add')}</button>
                    }
                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearMaterial}>{translate('task_template.delete')}</button>
                </div>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th title={translate('manage_warehouse.good_management.material')}>{translate('manage_warehouse.good_management.material')}</th>
                            <th title={translate('manage_warehouse.good_management.quantity')}>{translate('manage_warehouse.good_management.quantity')}</th>
                            <th>{translate('task_template.action')}</th>
                        </tr>
                    </thead>
                    <tbody id={`material-create-${id-type}`}>
                        {
                            (typeof listMaterial === 'undefined' || listMaterial.length === 0) ? <tr><td colSpan={3}><center>{translate('task_template.no_data')}</center></td></tr> :
                            listMaterial.map((x, index) =>
                                <tr key={index}>
                                    <td>{x.good.name}</td>
                                    <td>{x.quantity}</td>
                                    <td>
                                        <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditMaterial(x, index)}><i className="material-icons"></i></a>
                                        <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteMaterial(index)}><i className="material-icons"></i></a>
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

function mapStateToProps(state) {
    const { goods } = state;
    return { goods };
}

const mapDispatchToProps = {
    getAllGoodsByType: GoodActions.getAllGoodsByType
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ComponentCreateForm));

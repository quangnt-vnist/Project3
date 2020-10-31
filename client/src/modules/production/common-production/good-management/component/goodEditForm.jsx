import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from '../../../../../common-components';
import { GoodActions } from '../redux/actions';
import { CategoryActions } from '../../category-management/redux/actions';
import UnitCreateFrom from './unitCreateFrom';
import ComponentCreateForm from './componentCreateForm';
import { translate } from 'react-redux-multilingual/lib/utils';

class GoodEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.goodId !== prevState.goodId){
            return {
                ...prevState,
                goodId: nextProps.goodId,
                type: nextProps.type,
                baseUnit: nextProps.baseUnit,
                units: nextProps.units,
                materials: nextProps.materials,
                description: nextProps.description,
                code: nextProps.code,
                name: nextProps.name,
                category: nextProps.category,
                errorOnName: undefined, 
                errorOnCode: undefined, 
                errorOnBaseUnit: undefined, 
                errorOnCategory: undefined,

            }
        } else {
            return null;
        }
    }

    handleCodeChange = (e) => {
        let value = e.target.value;
        this.validateCode(value, true);
    }

    validateCode = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate, type } = this.props;
        if(!value) {
            msg = translate('manage_warehouse.category_management.validate_code');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCode: msg,
                    code: value,
                    type: type
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

    handleBaseUnitChange = (e) => {
        let value = e.target.value;
        this.validateBaseUnit(value, true);
    }
    
    validateBaseUnit = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if(!value){
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnBaseUnit: msg,
                    baseUnit: value,
                }
            });
        }
        return msg === undefined;
    }

    handleCategoryChange = (value) => {
        let category = value[0];
        this.validateCategory(category, true);
    }

    validateCategory = (category, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if(!category){
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCategory: msg,
                    category: category,
                }
            });
        }
        return msg === undefined;
    }

    getCategoriesByType = () => {
        let { categories, translate } = this.props;
        let listCategoriesByType = categories.listCategoriesByType;
        let categoryArr = [{ value: '', text: translate('manage_warehouse.good_management.choose_category') }];

        listCategoriesByType.map(item => {
            categoryArr.push({
                value: item._id,
                text: item.name
            })
        })

        return categoryArr;
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

    handleListUnitChange = (data) => {
        this.setState(state => {
            return {
                ...state,
                units: data
            }
        })
    }

    handleListMaterialChange = (data) => {
        this.setState(state => {
            return {
                ...state,
                materials: data
            }
        })
    }

    isFormValidated = () => {
        let result =
            this.validateName(this.state.name, false) &&
            this.validateCode(this.state.code, false) &&
            this.validateBaseUnit(this.state.baseUnit, false) &&
            this.validateCategory(this.state.category, false)
        return result;
    }

    save = () => {
        if (this.isFormValidated()) {
            this.props.editGood(this.props.goodId, this.state);
        }
    }


    render() {

        let listUnit = [];
        let listMaterial = [];
        const { translate, goods, categories, type } = this.props;
        const { errorOnName, errorOnCode, errorOnBaseUnit, errorOnCategory,goodId, code, name, category, units, materials, baseUnit, description } = this.state;
        const dataSelectBox = this.getCategoriesByType();

        if(units) listUnit = units;
        if(materials) listMaterial = materials;
        let size;
        if(type === 'product'){
            size = '75';
        } else {
            size = 50;
        }
        
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-edit-good`} isLoading={goods.isLoading}
                    formID={`form-edit-good`}
                    title={translate('manage_warehouse.good_management.add_title')}
                    msg_success={translate('manage_warehouse.good_management.add_success')}
                    msg_faile={translate('manage_warehouse.good_management.add_faile')}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size={size}
                >
                    <form id={`form-edit-good`} >
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorOnCode ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.good_management.code')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value={code} onChange={this.handleCodeChange}/>
                                    <ErrorLabel content = { errorOnCode }/>
                                </div>
                                <div className={`form-group ${!errorOnBaseUnit ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.good_management.baseUnit')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value={baseUnit} onChange={this.handleBaseUnitChange} />
                                    <ErrorLabel content = { errorOnBaseUnit } />
                                </div>
                                {type === 'product' ? <UnitCreateFrom id={goodId} initialData={listUnit} onDataChange={this.handleListUnitChange} />: []}
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorOnName ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.good_management.name')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value={name} onChange={this.handleNameChange} />
                                    <ErrorLabel content = { errorOnName } />
                                </div>
                                <div className={`form-group ${!errorOnCategory ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.good_management.category')}</label>
                                    <SelectBox
                                        id={`select-category-by-${goodId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={category ? category : { value: '', text: translate('manage_warehouse.good_management.choose_category') }}
                                        items={dataSelectBox}
                                        onChange={this.handleCategoryChange}    
                                        multiple={false}
                                    />
                                    <ErrorLabel content = { errorOnCategory } />
                                </div>
                                {type === 'product' ? <ComponentCreateForm id={goodId} initialData={listMaterial} onDataChange={this.handleListMaterialChange} />: []}
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.good_management.description')}</label>
                                    <textarea type="text" className="form-control" value={description} onChange={this.handleDescriptionChange} />
                                </div>
                                {type !== 'product' ? <UnitCreateFrom id={goodId} initialData={listUnit} onDataChange={this.handleListUnitChange} />: []}
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}
function mapStateToProps(state) {
    const { goods, categories } = state;
    return { goods, categories };
}

const mapDispatchToProps = {
    editGood: GoodActions.editGood,
    getCategoriesByType: CategoryActions.getCategoriesByType
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodEditForm));
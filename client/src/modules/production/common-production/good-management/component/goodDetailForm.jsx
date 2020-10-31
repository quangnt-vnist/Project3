import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal } from '../../../../../common-components';
import { GoodActions } from '../redux/actions';
import { CategoryActions } from '../../category-management/redux/actions';

class GoodDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.goodId !== prevState.goodId || nextProps.baseUnit !== prevState.baseUnit || nextProps.units !== prevState.units || 
            nextProps.materials !== prevState.materials || nextProps.code !== prevState.code || nextProps.name !== prevState.name ||
            nextProps.category !== prevState.category || nextProps.description !== prevState.description){
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
            }
        } else {
            return null;
        }
    }

    render() {

        const { translate, goods, type, categories } = this.props;
        const { goodId, code, name, category, units, materials, baseUnit, description } = this.state;
        let size;
        if(type === 'product'){
            size = '75';
        } else {
            size = 50;
        }
        
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-good`} isLoading={goods.isLoading}
                    formID={`form-detail-good`}
                    title={translate('manage_warehouse.good_management.add_title')}
                    msg_success={translate('manage_warehouse.good_management.add_success')}
                    msg_faile={translate('manage_warehouse.good_management.add_faile')}
                    size={size}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form id={`form-detail-good`} >
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.good_management.code')}:&emsp;</strong>
                                    {code}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.good_management.baseUnit')}:&emsp;</strong>
                                    {baseUnit}
                                </div>
                                {type === 'product' ?
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.good_management.unit')}</legend>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th title={translate('manage_warehouse.good_management.name')}>{translate('manage_warehouse.good_management.name')}</th>
                                                <th title={translate('manage_warehouse.good_management.conversion_rate')}>{translate('manage_warehouse.good_management.conversion_rate')}</th>
                                                <th title={translate('manage_warehouse.good_management.description')}>{translate('manage_warehouse.good_management.description')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`unit-create-good`}>
                                            {
                                                (typeof units === 'undefined' || units.length === 0) ? <tr><td colSpan={3}><center>{translate('task_template.no_data')}</center></td></tr> :
                                                    units.map((item, index) =>
                                                    <tr key={index}>
                                                        <td>{item.name}</td>
                                                        <td>{item.conversionRate}</td>
                                                        <td>{item.description}</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </fieldset>
                                : []}
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.good_management.name')}:&emsp;</strong>
                                    {name}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.good_management.category')}:&emsp;</strong>
                                    {category && categories.listCategoriesByType.length && categories.listCategoriesByType.filter(item => item._id === category).pop() ? categories.listCategoriesByType.filter(item => item._id === category).pop().name : "aaa"}
                                </div>
                                {type === 'product' ? 
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.good_management.materials')}</legend>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th title={translate('manage_warehouse.good_management.material')}>{translate('manage_warehouse.good_management.material')}</th>
                                                <th title={translate('manage_warehouse.good_management.quantity')}>{translate('manage_warehouse.good_management.quantity')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`material-create-${type}`}>
                                            {
                                                (typeof materials === 'undefined' || materials.length === 0) ? <tr><td colSpan={3}><center>{translate('task_template.no_data')}</center></td></tr> :
                                                materials.map((x, index) =>
                                                    <tr key={index}>
                                                        <td>{x.good.name}</td>
                                                        <td>{x.quantity}</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </fieldset>
                                : []}
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.good_management.description')}:&emsp;</strong>
                                    {description}
                                </div>
                                {type !== 'product' ?
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.good_management.unit')}</legend>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th title={translate('manage_warehouse.good_management.name')}>{translate('manage_warehouse.good_management.name')}</th>
                                                <th title={translate('manage_warehouse.good_management.conversion_rate')}>{translate('manage_warehouse.good_management.conversion_rate')}</th>
                                                <th title={translate('manage_warehouse.good_management.description')}>{translate('manage_warehouse.good_management.description')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`unit-create-good`}>
                                            {
                                                (typeof units === 'undefined' || units.length === 0) ? <tr><td colSpan={3}><center>{translate('task_template.no_data')}</center></td></tr> :
                                                    units.map((item, index) =>
                                                    <tr key={index}>
                                                        <td>{item.name}</td>
                                                        <td>{item.conversionRate}</td>
                                                        <td>{item.description}</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </fieldset>
                                : []}
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
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodDetailForm));
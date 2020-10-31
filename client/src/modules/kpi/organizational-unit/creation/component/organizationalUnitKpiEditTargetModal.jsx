import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';

import { createUnitKpiActions } from '../redux/actions';

class OrganizationalUnitKpiEditTargetModal extends Component {
   
    constructor(props) {
        super(props);

        this.state = {
            _id: null,
            name: "",
            parent: undefined,
            weight: "",
            criteria: "",
            editing: false,
            errorOnName: undefined,
            errorOnCriteria: undefined,
            errorOnWeight: undefined,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.id !== prevState._id && nextProps.organizationalUnitKpi) {
            return {
                ...prevState,
                _id: nextProps.id,
                name: nextProps.organizationalUnitKpi.name,
                parent: nextProps.organizationalUnitKpi.parent ? nextProps.organizationalUnitKpi.parent._id : null,
                weight: nextProps.organizationalUnitKpi.weight,
                criteria: nextProps.organizationalUnitKpi.criteria,

                errorOnName: undefined, 
                errorOnCriteria: undefined,
                errorOnWeight: undefined,
            } 
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState._id !== this.state._id) {
            this.props.getParentTarget(localStorage.getItem("currentRole"));
            return false;
        }
        return true;
    }

    handleEditTarget = async () => { 
        let id = this.state._id;
        let newTarget = {
            name: this.state.name,
            parent: this.state.parent ? this.state.parent : null,
            weight: this.state.weight,
            criteria: this.state.criteria,
        }
        
        if (this.isFormValidated()){
            return this.props.editTargetKPIUnit(id, newTarget);
        }
    }

    handleNameChange = (e) => {
        let value = e.target.value;
        let validation = ValidationHelper.validateName(this.props.translate, value);
        
        this.setState(state => {
            return {
                ...state,
                errorOnName: validation.message,
                name: value,
            }
        });
    }

    handleParentChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                parent: value[0]
            }
        });
    }

    handleCriteriaChange = (e) => {
        let value = e.target.value;
        let validation = ValidationHelper.validateDescription(this.props.translate, value);

        this.setState(state => {
            return {
                ...state,
                errorOnCriteria: validation.message,
                criteria: value,
            }
        });
    }

    handleWeightChange = (e) => {
        let value = e.target.value;
        let validation = this.validateWeight(this.props.translate, value);

        this.setState(state => {
            return {
                ...state,
                errorOnWeight: validation.message,
                weight: value,
            }
        });
    }

    validateWeight = (translate, value) => {
        let validation = ValidationHelper.validateEmpty(translate, value);

        if (!validation.status) {
            return validation;
        }
        
        if (value < 0) {
            return {
                status: false,
                message: this.props.translate('kpi.employee.employee_kpi_set.create_employee_kpi_modal.validate_weight.less_than_0')
            };
        } else if(value > 100){
            return {
                status: false,
                message: this.props.translate('kpi.employee.employee_kpi_set.create_employee_kpi_modal.validate_weight.greater_than_100')
            };
        } else {
            return {
                status: true
            };
        }
    }

    
    isFormValidated = () => {
        const { name, criteria, weight } = this.state;
        
        let validatateName, validateCriteria, validateWeight, result;
        
        validatateName = ValidationHelper.validateName(this.props.translate, name);
        validateCriteria = ValidationHelper.validateDescription(this.props.translate, criteria);
        validateWeight = this.validateWeight(this.props.translate, weight)
        
        result = validatateName.status && validateCriteria.status && validateWeight.status;
        return result;
    }


    render() {
        const { createKpiUnit, translate } = this.props; 
        const { organizationalUnit } = this.props;
        const { editing, newTarget, _id, name, parent, weight, criteria, errorOnName, errorOnCriteria, errorOnWeight } = this.state;
        
        let parentKPI;
        if (createKpiUnit.parent) {
            parentKPI = createKpiUnit.parent;
        }

        let items;
        if (!parentKPI) {
            items = [];
        } else {    
            items = parentKPI.kpis.map(x => {
                return {value: x._id, text: x.name} });
        }

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`editTargetKPIUnit${_id}`} isLoading={editing}
                    formID="form-edit-target"
                    title={translate('kpi.organizational_unit.edit_target_kpi_modal.edit_organizational_unit_kpi')}
                    msg_success={translate('kpi.organizational_unit.edit_target_kpi_modal.success')}
                    msg_faile={translate('kpi.organizational_unit.edit_target_kpi_modal.failure')}
                    func={this.handleEditTarget}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa tiêu */}
                    <form id="form-edit-target" onSubmit={() => this.handleEditTarget(translate('kpi.organizational_unit.edit_target_kpi_modal.success'))}>
                        <div className={`form-group ${ !errorOnName ? "" : "has-error"}`}>
                            <label>{translate('kpi.organizational_unit.edit_target_kpi_modal.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={name} onChange = {this.handleNameChange}/>
                            <ErrorLabel content={errorOnName}/>
                        </div>
                        
                        {/* Mục tiêu cha */}
                        {(organizationalUnit && organizationalUnit.parent) &&//unit.parent === null này!!! kiểm tra xem đây là đơn vị gốc hay không!
                            <div className="form-group">
                                <label>{translate('kpi.organizational_unit.edit_target_kpi_modal.parents')}</label>
                                {items.length !== 0 &&
                                    <SelectBox 
                                        id={`parent-target-add${_id}`}
                                        className="form-control select2"
                                        style={{width: "100%"}}
                                        items = {items}
                                        value={parent}
                                        onChange={this.handleParentChange}
                                        multiple={false}
                                    />
                                }
                            </div>}
                            
                        {/* Tiêu chí đánh giá */}
                        <div className={`form-group ${!errorOnCriteria? "": "has-error"}`}>
                            <label>{translate('kpi.organizational_unit.edit_target_kpi_modal.evaluation_criteria')}<span className="text-red">*</span></label>
                            <textarea rows={4} type="text" className="form-control" value={criteria} onChange = {this.handleCriteriaChange}/>
                            <ErrorLabel content={errorOnCriteria}/>
                        </div>

                        {/* Trọng số */}
                        <div className={`form-group ${!errorOnWeight? "": "has-error"}`}>
                            <label>{translate('kpi.organizational_unit.edit_target_kpi_modal.weight')}<span className="text-red">*</span></label>
                            <input type="number" className="form-control" value={weight} onChange = {this.handleWeightChange}/>
                            <ErrorLabel content={errorOnWeight}/>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { createKpiUnit } = state;
    return { createKpiUnit };
}

const actionCreators = {
    getParentTarget: createUnitKpiActions.getKPIParent,
    editTargetKPIUnit: createUnitKpiActions.editTargetKPIUnit
};
const connectedOrganizationalUnitKpiEditTargetModal = connect(mapState, actionCreators)(withTranslate(OrganizationalUnitKpiEditTargetModal));
export { connectedOrganizationalUnitKpiEditTargetModal as OrganizationalUnitKpiEditTargetModal };
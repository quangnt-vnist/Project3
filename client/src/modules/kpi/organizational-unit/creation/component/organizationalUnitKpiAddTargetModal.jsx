import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';

import { createUnitKpiActions } from '../redux/actions';

class OrganizationalUnitKpiAddTargetModal extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            name: "",
            parent: null,
            weight: "",
            criteria: "",
            organizationalUnitKpiSetId: "",
            
            adding: false,
            submitted: false,

            errorOnName: undefined,
            errorOnCriteria: undefined,
            errorOnWeight: undefined,
        };
    }

    componentDidMount() {
        this.props.getParentTarget(localStorage.getItem("currentRole"));
    }

    onAddItem = async () => {
        let parentKPI = null;
        let items;
        let parent = null;
        const { createKpiUnit } = this.props;

        if (createKpiUnit.parent) {
            parentKPI = createKpiUnit.parent;
        }

        if (!this.state.parent) {
            if (!parentKPI){
                parent = null;
            } else {    
                items = parentKPI.kpis.filter(item => item.type === 0).map(x => {
                    return {value: x._id, text: x.name}
                });
                parent = items && items[0] && items[0].value;
            }    
        } else {
            parent = this.state.parent;
        }
        
        if (this.isFormValidated()){
            return await this.props.addTargetKPIUnit({
                name: this.state.name,
                parent: parent,
                weight: this.state.weight,
                criteria: this.state.criteria,
                organizationalUnitKpiSetId: this.props.organizationalUnitKpiSetId, 
            });
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
        const { translate } = this.props;
        const { name, criteria, weight } = this.state;
        
        let validatateName, validateCriteria, validateWeight, result;
        
        validatateName = ValidationHelper.validateName(translate, name);
        validateCriteria = ValidationHelper.validateDescription(translate, criteria);
        validateWeight = this.validateWeight(translate, weight)
        
        result = validatateName.status && validateCriteria.status && validateWeight.status;
        return result;
    }

    render() {
        const { createKpiUnit, translate } = this.props; 
        const { organizationalUnit } = this.props; 
        const { name, adding, weight, criteria, errorOnName, errorOnCriteria, errorOnWeight } = this.state;
        
        let parentKPI;
        if (createKpiUnit.parent) {
            parentKPI = createKpiUnit.parent;
        }

        let items;
        if(!parentKPI){
            items = [];
        } else {    
            items = parentKPI.kpis.filter(item => item.type === 0).map(x => {
                return {value: x._id, text: x.name};
            });
        }
        
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-add-target" isLoading={adding}
                    formID="form-add-target"
                    title={translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.create_organizational_unit_kpi')}
                    msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.success')}
                    msg_faile={translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.failure')}
                    func={this.onAddItem}
                    disableSubmit={!this.isFormValidated()}>
                    
                    {/* Form thêm mục tiêu */}
                    <form id="form-add-target" onSubmit={() => this.onAddItem(translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.success'))}>
                        {/* Tên mục tiêu */}
                        <div className={`form-group ${!errorOnName? "": "has-error"}`}>
                            <label>{translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={name} onChange = {this.handleNameChange}/>
                            <ErrorLabel content={errorOnName}/>
                        </div>
                        
                        {/* Mục tiêu cha */}
                        {(organizationalUnit && organizationalUnit.parent) && (items.length !== 0) && 
                            <div className="form-group">
                                <label>{translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.parents')}</label>
                                <SelectBox 
                                    id={`parent-target-add`}
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {items}
                                    onChange={this.handleParentChange}
                                    multiple={false}
                                />
                            </div>
                        }

                        {/* Tiêu chí đánh giá */}
                        <div className={`form-group ${!errorOnCriteria? "": "has-error"}`}>
                            <label>{translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.evaluation_criteria')}<span className="text-red">*</span></label>
                            <textarea rows={4} className="form-control" value={criteria} onChange = {this.handleCriteriaChange}/>
                            <ErrorLabel content={errorOnCriteria}/>
                        </div>

                        {/* Trọng số */}
                        <div className={`form-group ${!errorOnWeight? "": "has-error"}`}>
                            <label>{translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.weight')}<span className="text-red">*</span></label>
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
    addTargetKPIUnit: createUnitKpiActions.addTargetKPIUnit,
};

const connectedOrganizationalUnitKpiAddTargetModal = connect(mapState, actionCreators)(withTranslate(OrganizationalUnitKpiAddTargetModal));
export { connectedOrganizationalUnitKpiAddTargetModal as OrganizationalUnitKpiAddTargetModal };
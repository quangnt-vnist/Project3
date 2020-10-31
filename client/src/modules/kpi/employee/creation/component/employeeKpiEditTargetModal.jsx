import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withTranslate } from 'react-redux-multilingual';

import { createUnitKpiActions } from '../../../organizational-unit/creation/redux/actions';
import { createKpiSetActions } from "../redux/actions";

import { DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';


class ModalEditEmployeeKpi extends Component {

    constructor(props) {
        super(props);

        this.state = {
            _id: null,
            name: "",
            parent: undefined,
            weight: "",
            criteria: "",
            employeeKpiSet: "",

            errorOnName: undefined,
            errorOnCriteria: undefined,
            errorOnWeight: undefined,

            editing: false,
            submitted: false
        };
    }
    
    static getDerivedStateFromProps(nextProps, prevState){
        
        if (nextProps.id !== prevState._id && nextProps.employeeKpi) {
            return {
                ...prevState,
                _id: nextProps.id,
                name: nextProps.employeeKpi.name,
                parent: nextProps.employeeKpi.parent ? nextProps.employeeKpi.parent._id : null,
                weight: nextProps.employeeKpi.weight,
                criteria: nextProps.employeeKpi.criteria,

                errorOnName: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnCriteria: undefined,
                errorOnWeight: undefined,
            } 
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState._id !== this.state._id) {
            this.props.getCurrentKPIUnit(localStorage.getItem("currentRole"));

            return false;
        }
        return true;
    }
    
    /**Gửi request chỉnh sửa mục tiêu này */
    handleEditTargetEmployeeKpi = async () => {
        const { _id, name, parent, weight, criteria } = this.state;

        let newTarget = {
            name: name,
            parent: parent,
            weight: weight,
            criteria: criteria,
        } 
        
        if (this.isFormValidated()) {
            let res = await this.props.editEmployeeKpi(_id, newTarget);

            window.$(`#editEmployeeKpi${_id}`).modal("hide");
            window.$(".modal-backdrop").remove();
            window.$('body').removeClass('modal-open');
            window.$('body').css('padding-right',"0px");

            return res;
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
                parent: value,
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
        let currentOrganizationalUnitKPI, items;
        const { createKpiUnit, translate } = this.props;
        const { _id, name, weight, criteria, errorOnName, errorOnCriteria, errorOnWeight, editing, parent } = this.state;

        if (createKpiUnit.currentKPI) currentOrganizationalUnitKPI = createKpiUnit.currentKPI;
        
        if (!currentOrganizationalUnitKPI) {
            items = [];
        } else {    
            items = currentOrganizationalUnitKPI.kpis.map(x => {//type !==0 thì đc. cái này để loại những mục tiêu mặc định?
            return {value: x._id, text: x.name} });
        }
        
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`editEmployeeKpi${_id}`} isLoading={editing}
                    formID="formeditEmployeeKpi"
                    title={translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.edit_employee_kpi')}
                    msg_success={translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.success')}
                    msg_faile={translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.failure')}
                    func={this.handleEditTargetEmployeeKpi}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="formEditTargetEmployeeKpi" onSubmit={() => this.handleEditTargetEmployeeKpi(translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.success'))}>
                        
                            {/**Tên của mục tiêu */}
                            <div className={`form-group ${errorOnName === undefined ? "" : "has-error"}`}>
                                <label>{translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.name')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" value={name} onChange = {this.handleNameChange}/>
                                <ErrorLabel content={errorOnName}/>
                            </div>
                            
                            {/**Mục tiêu cha */}
                            {(createKpiUnit.currentKPI !== null) &&
                                (items.length !== 0) && 
                                    <div className="form-group">
                                        <label>{translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.parents')}<span className="text-red">*</span></label>
                                        <SelectBox
                                            id={`parent-target-edit${_id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={items}
                                            onChange={this.handleParentChange}
                                            multiple={false}
                                            value={parent ? parent : ""}
                                        />
                                    </div>
                            }
                            
                            {/**Tiêu chí đánh giá */}
                            <div className={`form-group ${errorOnCriteria === undefined ? "" : "has-error"}`}>
                                <label>{translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.evaluation_criteria')}<span className="text-red">*</span></label>
                                <textarea rows={4} className="form-control" value={criteria} onChange = {this.handleCriteriaChange}/>
                                <ErrorLabel content={errorOnCriteria}/>
                            </div>
                            
                            {/**Trọng số của mục tiêu */}
                            <div className={`form-group ${errorOnWeight === undefined ? "" : "has-error"}`}>
                            <label>{translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.weight')}<span className="text-red">*</span></label>
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
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    editEmployeeKpi: createKpiSetActions.editEmployeeKpi
};

const connectedModalEditEmployeeKpi = connect( mapState, actionCreators )( withTranslate(ModalEditEmployeeKpi) );
export { connectedModalEditEmployeeKpi as ModalEditEmployeeKpi };
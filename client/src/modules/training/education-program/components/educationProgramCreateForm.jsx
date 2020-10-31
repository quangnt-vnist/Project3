import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { EducationProgramFormValidator } from './combinedContent';

import { DialogModal, ButtonModal, ErrorLabel, SelectMulti } from '../../../../common-components';

import { EducationActions } from '../redux/actions';

class EducationProgramCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organizationalUnit: [],
            position: [],
            name: "",
            programId: "",
        };
    }

    /**
     * Function lưu giá trị đơn vị áp dụng vào state khi thay đổi
     * @param {*} value : Array id đơn vị áp dụng
     */
    handleUnitChange = (value) => {
        this.validateOrganizationalUnit(value, true);
    }
    validateOrganizationalUnit = (value, willUpdateState = true) => {
        const { translate } = this.props;

        let msg = EducationProgramFormValidator.validateOrganizationalUnit(value, translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnOrganizationalUnit: msg,
                    organizationalUnit: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Function lưu giá trị chức vụ vào state khi thay đổi
     * @param {*} value : Array id chức vụ áp dụng 
     */
    handlePositionChange = (value) => {
        this.validatePosition(value, true);
    }
    validatePosition = (value, willUpdateState = true) => {
        const { translate } = this.props;

        let msg = EducationProgramFormValidator.validatePosition(value, translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnPosition: msg,
                    position: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi mã chương trình đào tạo */
    handleProgramIdChange = (e) => {
        const { value } = e.target;
        this.validateProgramId(value, true);
    }
    validateProgramId = (value, willUpdateState = true) => {
        const { translate } = this.props;

        let msg = EducationProgramFormValidator.validateProgramId(value, translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnProgramId: msg,
                    programId: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi tên chương trình đào tạo */
    handleProgramNameChange = (e) => {
        const { value } = e.target;

        this.validateProgramName(value, true);
    }
    validateProgramName = (value, willUpdateState = true) => {
        const { translate } = this.props;

        let msg = EducationProgramFormValidator.validateProgramName(value, translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnProgramName: msg,
                    name: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    isFormValidated = () => {
        const { organizationalUnit, position, programId, name } = this.state;
        let result =
            this.validateOrganizationalUnit(organizationalUnit, false) && this.validatePosition(position, false) &&
            this.validateProgramId(programId, false) && this.validateProgramName(name, false);
        return result;
    }

    /** Bắt sự kiện thêm chương trình đào tạo */
    save = () => {
        if (this.isFormValidated()) {
            this.props.addNewEducation(this.state);
        }
    }

    render() {
        const { translate, education, department } = this.props;

        const { name, programId, organizationalUnit, position, errorOnProgramName, errorOnProgramId,
            errorOnOrganizationalUnit, errorOnPosition } = this.state;

        let listPosition = [{ value: "", text: translate('human_resource.not_unit'), disabled: true }];

        if (organizationalUnit !== null) {
            listPosition = [];
            organizationalUnit.forEach(u => {
                department.list.forEach(x => {
                    if (x._id === u) {
                        let roleDeans = x.deans.map(y => { return { _id: y._id, name: y.name } });
                        let roleViceDeans = x.viceDeans.map(y => { return { _id: y._id, name: y.name } });
                        let roleEmployees = x.employees.map(y => { return { _id: y._id, name: y.name } });
                        listPosition = listPosition.concat(roleDeans).concat(roleViceDeans).concat(roleEmployees);
                    }
                })
            })
        }

        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-education" button_name={translate('training.education_program.add_education_program')} />
                <DialogModal
                    modalID="modal-create-education" isLoading={education.isLoading}
                    formID="form-create-education"
                    title={translate('training.education_program.add_education_program')}
                    func={this.save}
                    size={50}
                    maxWidth={500}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-create-education" >
                        {/* Áp dụng cho đơn vị */}
                        <div className={`form-group ${errorOnOrganizationalUnit && "has-error"}`}>
                            <label>{translate('training.education_program.table.apply_for_organizational_units')}<span className="text-red">*</span></label>
                            <SelectMulti id={`create-multiSelectUnit`} multiple="multiple" display='inline-block'
                                options={{ nonSelectedText: translate('human_resource.non_unit'), allSelectedText: translate('human_resource.all_unit') }}
                                items={department.list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                            <ErrorLabel content={errorOnOrganizationalUnit} />
                        </div>
                        {/* Áp dụng cho chức vụ */}
                        <div className={`form-group ${errorOnPosition && "has-error"}`}>
                            <label>{translate('training.education_program.table.apply_for_positions')}<span className="text-red">*</span></label>
                            <SelectMulti id={`create-multiSelectPosition`} multiple="multiple" display='inline-block'
                                options={{ nonSelectedText: translate('human_resource.non_position'), allSelectedText: translate('human_resource.all_position') }}
                                items={listPosition.map((p, i) => { return { value: p._id, text: p.name } })} onChange={this.handlePositionChange}>
                            </SelectMulti>
                            <ErrorLabel content={errorOnPosition} />
                        </div>
                        {/* Mã chương trình đào tạo*/}
                        <div className={`form-group ${errorOnProgramId && "has-error"}`} >
                            <label>{translate('training.education_program.education_program_code')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="programId" value={programId} onChange={this.handleProgramIdChange} />
                            <ErrorLabel content={errorOnProgramId} />
                        </div>
                        {/* Tên chương trình đào tạo*/}
                        <div className={`form-group ${errorOnProgramName && "has-error"}`}>
                            <label>{translate('training.education_program.education_program_name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="name" value={name} onChange={this.handleProgramNameChange} />
                            <ErrorLabel content={errorOnProgramName} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { education, department } = state;
    return { education, department };
};

const actionCreators = {
    addNewEducation: EducationActions.createNewEducation,
};

const createForm = connect(mapState, actionCreators)(withTranslate(EducationProgramCreateForm));
export { createForm as EducationProgramCreateForm };
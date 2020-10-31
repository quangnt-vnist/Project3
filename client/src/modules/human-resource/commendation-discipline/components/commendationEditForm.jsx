import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components';

import { CommendationFromValidator } from './commendationFormValidator';

import { DisciplineActions } from '../redux/actions';

class PraiseEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * Bắt sự kiện thay đổi cấp ra quyết định
     * @param {*} value : Cấp ra quyết định
     */
    handleOrganizationalUnitChange = (value) => {
        this.validateOrganizationalUnit(value[0], true);
    }
    validateOrganizationalUnit = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = CommendationFromValidator.validateOrganizationalUnit(value, translate)
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
     * Bắt sự kiện thay đổi ngày ra quyết định
     * @param {*} value : Ngày ra quyết định
     */
    handleStartDateChange = (value) => {
        this.validateStartDate(value, true);
    }
    validateStartDate = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = CommendationFromValidator.validateStartDate(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnStartDate: msg,
                    startDate: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi hình thức khen thưởng */
    handleTypeChange = (e) => {
        let value = e.target.value;
        this.validateType(value, true);
    }
    validateType = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = CommendationFromValidator.validateType(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnType: msg,
                    type: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi thành tich(lý do) khen thưởng */
    handleReasonChange = (e) => {
        let { value } = e.target;
        this.validateReason(value, true);
    }
    validateReason = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = CommendationFromValidator.validateReason(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnReason: msg,
                    reason: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    isFormValidated = () => {
        const { organizationalUnit, type, reason, startDate } = this.state;
        let result = this.validateOrganizationalUnit(organizationalUnit, false) && this.validateType(type, false) &&
            this.validateReason(reason, false) && this.validateStartDate(startDate, false);
        return result;
    }

    /** Bắt sự kiện submit form */
    save = () => {
        const { startDate, _id } = this.state;
        let partStart = startDate.split('-');
        let startDateNew = new Date(partStart[2], partStart[1] - 1, partStart[0]);
        if (this.isFormValidated()) {
            return this.props.updatePraise(_id, { ...this.state, startDate: startDateNew });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                employeeNumber: nextProps.employeeNumber,
                decisionNumber: nextProps.decisionNumber,
                organizationalUnit: nextProps.organizationalUnit,
                startDate: nextProps.startDate,
                type: nextProps.type,
                reason: nextProps.reason,
                errorOnOrganizationalUnit: undefined,
                errorOnType: undefined,
                errorOnReason: undefined,
                errorOnStartDate: undefined
            }
        } else {
            return null;
        }
    }
    render() {
        const { translate, discipline, department } = this.props;

        const { employeeNumber, startDate, reason, decisionNumber, organizationalUnit, type, errorOnStartDate,
            errorOnOrganizationalUnit, errorOnType, errorOnReason } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-edit-praise" isLoading={discipline.isLoading}
                    formID="form-edit-praise"
                    title={translate('human_resource.commendation_discipline.commendation.edit_commendation')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-praise">
                        {/* Mã số nhân viên */}
                        <div className="form-group">
                            <label>{translate('human_resource.staff_number')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="employeeNumber" value={employeeNumber} disabled autoComplete="off" />
                        </div>
                        <div className="row">
                            {/* Số ra quyết định */}
                            <div className="col-sm-6 col-xs-12 form-group">
                                <label>{translate('human_resource.commendation_discipline.commendation.table.decision_number')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="number" value={decisionNumber} disabled
                                    autoComplete="off" placeholder={translate('human_resource.commendation_discipline.commendation.table.decision_number')} />
                            </div>
                            {/* Cấp ra quyết định */}
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnOrganizationalUnit && "has-error"}`}>
                                <label>{translate('human_resource.commendation_discipline.commendation.table.decision_unit')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`edit_commendation`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={organizationalUnit}
                                    items={[...department.list.map((u, i) => { return { value: u._id, text: u.name } }), { value: '', text: translate('human_resource.choose_decision_unit') }]}
                                    onChange={this.handleOrganizationalUnitChange}
                                />
                                <ErrorLabel content={errorOnOrganizationalUnit} />
                            </div>
                        </div>
                        <div className="row">
                            {/* Ngày ra quyết định */}
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnStartDate && "has-error"}`}>
                                <label>{translate('human_resource.commendation_discipline.commendation.table.decision_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="edit_praise_start_date"
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            {/* Hình thức khen thưởng */}
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnType && "has-error"}`}>
                                <label>{translate('human_resource.commendation_discipline.commendation.table.reward_forms')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="type" value={type} onChange={this.handleTypeChange} autoComplete="off" />
                                <ErrorLabel content={errorOnType} />
                            </div>
                        </div>
                        {/* Lý do khen thưởng*/}
                        <div className={`form-group ${errorOnReason && "has-error"}`}>
                            <label>{translate('human_resource.commendation_discipline.commendation.table.reason_praise')}<span className="text-red">*</span></label>
                            <textarea className="form-control" rows="3" name="reason" value={reason} onChange={this.handleReasonChange} placeholder="Enter ..." autoComplete="off" ></textarea>
                            <ErrorLabel content={errorOnReason} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};
function mapState(state) {
    const { discipline, department } = state;
    return { discipline, department };
};

const actionCreators = {
    updatePraise: DisciplineActions.updatePraise,
};

const editForm = connect(mapState, actionCreators)(withTranslate(PraiseEditForm));
export { editForm as PraiseEditForm };
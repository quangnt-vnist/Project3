import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';

import { CommendationFromValidator } from '../../../commendation-discipline/components/combinedContent';

class CommendationEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /** Bắt sự kiện thay đổi số quyết định */
    handleNumberChange = (e) => {
        let { value } = e.target;
        this.validateDecisionNumber(value, true);
    }
    validateDecisionNumber = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = CommendationFromValidator.validateDecisionNumber(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnNumber: msg,
                    decisionNumber: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi cấp ra quyết định
     * @param {*} value : Cấp ra quyết định
     */
    handleUnitChange = (value) => {
        this.validateOrganizationalUnit(value[0], true);
    }
    validateOrganizationalUnit = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = CommendationFromValidator.validateOrganizationalUnit(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnUnit: msg,
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
        let { value } = e.target;
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
        const { startDate, decisionNumber, type, reason, organizationalUnit } = this.state;
        let result =
            this.validateStartDate(startDate, false) &&
            this.validateDecisionNumber(decisionNumber, false) && this.validateOrganizationalUnit(organizationalUnit, false) &&
            this.validateType(type, false) && this.validateReason(reason, false);
        return result;
    }

    /** Bắt sự kiện submit form */
    save = async () => {
        const { startDate } = this.state;
        let partStart = this.state.startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        if (this.isFormValidated()) {
            return this.props.handleChange({ ...this.state, startDate: startDateNew });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                _id: nextProps._id,
                index: nextProps.index,
                decisionNumber: nextProps.decisionNumber,
                organizationalUnit: nextProps.organizationalUnit,
                startDate: nextProps.startDate,
                type: nextProps.type,
                reason: nextProps.reason,

                errorOnNumber: undefined,
                errorOnUnit: undefined,
                errorOnType: undefined,
                errorOnReason: undefined,
                errorOnStartDate: undefined

            }
        } else {
            return null;
        }
    }


    render() {
        const { translate, department } = this.props;

        const { id } = this.props;

        const { startDate, reason, decisionNumber, organizationalUnit, type, errorOnStartDate,
            errorOnNumber, errorOnUnit, errorOnType, errorOnReason } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-praise-${id}`} isLoading={false}
                    formID={`form-edit-praise-${id}`}
                    title={translate('human_resource.commendation_discipline.commendation.edit_commendation')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-edit-praise-${id}`}>
                        <div className="row">
                            {/* Số ra quyết định*/}
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnNumber && "has-error"}`}>
                                <label>{translate('human_resource.commendation_discipline.commendation.table.decision_number')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="decisionNumber" value={decisionNumber} onChange={this.handleNumberChange}
                                    autoComplete="off" placeholder={translate('human_resource.commendation_discipline.commendation.table.decision_number')} />
                                <ErrorLabel content={errorOnNumber} />
                            </div>
                            {/* Cấp ra quyết định*/}
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnUnit && "has-error"}`}>
                                <label>{translate('human_resource.commendation_discipline.commendation.table.decision_unit')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`edit_commendation${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={organizationalUnit}
                                    items={[...department.list.map((u, i) => { return { value: u._id, text: u.name } }), { value: '', text: translate('human_resource.choose_decision_unit') }]}
                                    onChange={this.handleUnitChange}
                                />
                                <ErrorLabel content={errorOnUnit} />
                            </div>
                        </div>
                        <div className="row">
                            {/* Ngày ra quyết định*/}
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnStartDate && "has-error"}`}>
                                <label>{translate('human_resource.commendation_discipline.commendation.table.decision_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit_praise_start_date${id}`}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            {/* Hình thức khen thưởng*/}
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnType && "has-error"}`}>
                                <label>{translate('human_resource.commendation_discipline.commendation.table.reward_forms')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="type" value={type} onChange={this.handleTypeChange}
                                    autoComplete="off" placeholder={translate('human_resource.commendation_discipline.commendation.table.reward_forms')} />
                                <ErrorLabel content={errorOnType} />
                            </div>
                        </div>
                        {/* Lý do khen thưởng */}
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
    const { department } = state;
    return { department };
};

const editModal = connect(mapState, null)(withTranslate(CommendationEditModal));
export { editModal as CommendationEditModal };
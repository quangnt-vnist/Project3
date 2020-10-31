import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker } from '../../../../../common-components';

import { EmployeeCreateValidator } from './combinedContent';

class SocialInsuranceEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /** Bắt sự kiện thay đổi đơn vị công tác */
    handleUnitChange = (e) => {
        let { value } = e.target;
        this.validateExperienceUnit(value, true)
    }
    validateExperienceUnit = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateExperienceUnit(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnUnit: msg,
                    company: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi chức vụ
     * @param {*} e 
     */
    handlePositionChange = (e) => {
        let value = e.target.value;
        this.validateExperiencePosition(value, true)
    }
    validateExperiencePosition = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateExperiencePosition(value, translate)
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

    /**
     * Function lưu thay đổi "từ tháng/năm" vào state
     * @param {*} value : Từ tháng/năm 
     */
    handleStartDateChange = (value) => {
        const { translate } = this.props;
        let { errorOnEndDate, endDate } = this.state;

        let errorOnStartDate;
        let partValue = value.split('-');
        let date = new Date([partValue[1], partValue[0], 1].join('-'));

        let partEndDate = endDate.split('-');
        let d = new Date([partEndDate[1], partEndDate[0], 1].join('-'));

        if (date.getTime() > d.getTime()) {
            errorOnStartDate = translate('human_resource.profile.start_month_before_end_month');
        } else {
            errorOnEndDate = undefined;
        }

        this.setState({
            startDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })

    }

    /**
     * Function lưu thay đổi "đến tháng/năm" vào state
     * @param {*} value : Đến tháng/năm
     */
    handleEndDateChange = (value) => {
        const { translate } = this.props;
        let { startDate, errorOnStartDate } = this.state;

        let errorOnEndDate;
        let partValue = value.split('-');
        let date = new Date([partValue[1], partValue[0], 1].join('-'));

        let partStartDate = startDate.split('-');
        let d = new Date([partStartDate[1], partStartDate[0], 1].join('-'));

        if (d.getTime() > date.getTime()) {
            errorOnEndDate = translate('human_resource.profile.end_month_after_start_month');
        } else {
            errorOnStartDate = undefined;
        }

        this.setState({
            endDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    isFormValidated = () => {
        const { company, position, startDate, endDate } = this.state;

        let result = this.validateExperienceUnit(company, false) && this.validateExperiencePosition(position, false);

        let partStart = startDate.split('-');
        let startDateNew = [partStart[1], partStart[0]].join('-');
        let partEnd = endDate.split('-');
        let endDateNew = [partEnd[1], partEnd[0]].join('-');

        if (new Date(startDateNew).getTime() <= new Date(endDateNew).getTime()) {
            return result;
        } else {
            return false
        }
    }

    /** Bắt sự kiện submit form */
    save = async () => {
        const { startDate, endDate } = this.state;
        let partStart = startDate.split('-');
        let startDateNew = [partStart[1], partStart[0]].join('-');
        let partEnd = endDate.split('-');
        let endDateNew = [partEnd[1], partEnd[0]].join('-');
        if (this.isFormValidated()) {
            return this.props.handleChange({ ...this.state, startDate: startDateNew, endDate: endDateNew });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                _id: nextProps._id,
                company: nextProps.company,
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
                position: nextProps.position,
                index: nextProps.index,
                errorOnPosition: undefined,
                errorOnUnit: undefined,
                errorOnStartDate: undefined,
                errorOnEndDate: undefined
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate } = this.props;

        const { id } = this.props;

        const { company, position, startDate, endDate, errorOnStartDate, errorOnEndDate, errorOnUnit, errorOnPosition } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-BHXH-${id}`} isLoading={false}
                    formID={`form-edit-BHXH-${id}`}
                    title={translate('human_resource.profile.edit_bhxh')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-edit-BHXH-${id}`}>
                        {/* Đơn vị */}
                        <div className={`form-group ${errorOnUnit && "has-error"}`}>
                            <label >{translate('human_resource.profile.unit')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="company" value={company} onChange={this.handleUnitChange} autoComplete="off" />
                            <ErrorLabel content={errorOnUnit} />
                        </div>
                        <div className="row">
                            {/* Từ tháng */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && "has-error"}`}>
                                <label>{translate('human_resource.profile.from_month_year')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`editBHXH-start-date-${id}`}
                                    dateFormat="month-year"
                                    deleteValue={false}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            {/* Đến tháng */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate && "has-error"}`}>
                                <label>{translate('human_resource.profile.to_month_year')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`editBHXH-end-date-${id}`}
                                    dateFormat="month-year"
                                    deleteValue={false}
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                                <ErrorLabel content={errorOnEndDate} />
                            </div>
                        </div>
                        {/* Chức vụ */}
                        <div className={`form-group ${errorOnPosition && "has-error"}`}>
                            <label>{translate('table.position')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="position" value={position} onChange={this.handlePositionChange} autoComplete="off" />
                            <ErrorLabel content={errorOnPosition} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

const editBHXH = connect(null, null)(withTranslate(SocialInsuranceEditModal));
export { editBHXH as SocialInsuranceEditModal };

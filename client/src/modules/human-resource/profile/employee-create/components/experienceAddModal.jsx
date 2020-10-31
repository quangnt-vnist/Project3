import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, DatePicker } from '../../../../../common-components';

import { EmployeeCreateValidator } from './combinedContent';

class ModalAddExperience extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company: "",
            startDate: this.formatDate(Date.now()),
            endDate: this.formatDate(Date.now()),
            position: "",
        }
    }

    /**
     * Function format ngày hiện tại thành dạnh mm-yyyy
     * @param {*} date : Ngày muốn format
     */
    formatDate = (date) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [month, year].join('-');
        }
        return date;
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

    /** Bắt sự kiện thay đổi chức vụ */
    handlePositionChange = (e) => {
        let { value } = e.target;
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
     * @param {*} value : Tháng bắt đầu
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
     * @param {*} value : Tháng kết thúc
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
        const { position, company, startDate, endDate } = this.state;
        let result = this.validateExperienceUnit(company, false) && this.validateExperiencePosition(position, false);
        let partStart = startDate.split('-');
        let startDateNew = [partStart[1], partStart[0]].join('-');
        let partEnd = endDate.split('-');
        let endDateNew = [partEnd[1], partEnd[0]].join('-');
        if (new Date(startDateNew).getTime() <= new Date(endDateNew).getTime()) {
            return result;
        } else return false;
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
    render() {
        const { translate } = this.props;

        const { id } = this.props;

        const { company, position, startDate, endDate, errorOnStartDate, errorOnEndDate, errorOnUnit, errorOnPosition } = this.state;

        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-create-experience-${id}`} button_name={translate('modal.create')} title={translate('human_resource.profile.add_experience')} />
                <DialogModal
                    size='50' modalID={`modal-create-experience-${id}`} isLoading={false}
                    formID={`form-create-experience-${id}`}
                    title={translate('human_resource.profile.add_experience')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-experience-${id}`}>
                        {/* Đơn vị */}
                        <div className={`form-group ${errorOnUnit && "has-error"}`}>
                            <label>{translate('human_resource.profile.unit')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="company" value={company} onChange={this.handleUnitChange} autoComplete="off" />
                            <ErrorLabel content={errorOnUnit} />
                        </div>
                        <div className="row">
                            {/* Từ thánh */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && "has-error"}`}>
                                <label>{translate('human_resource.profile.from_month_year')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`add-start-date-${id}`}
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
                                    id={`add-end-date-${id}`}
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

const addExperience = connect(null, null)(withTranslate(ModalAddExperience));
export { addExperience as ModalAddExperience };

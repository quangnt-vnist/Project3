import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, DatePicker, ErrorLabel, SelectBox } from '../../../../common-components';

import { WorkPlanFormValidator } from './combinedContent';

import { WorkPlanActions } from '../redux/actions';

class WorkPlanEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /** Bắt sự kiện thay đổi lý do nghỉ */
    handleDescriptionChange = (e) => {
        const { value } = e.target;
        this.validateDescription(value, true);
    }
    validateDescription = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = WorkPlanFormValidator.validateDescription(value, translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDescription: msg,
                    description: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
    * Bắt sự kiện thay đổi thể loại kế hoạch làm việc
    * @param {*} value : Thể loại kế hoạch làm việc
    */
    handleTypetChange = (value) => {
        this.setState({
            type: value[0],
        })
    }

    /**
     * Bắt sự kiện thay đổi thời gian bắt đầu
     * @param {*} value : Ngày bắt đầu
     */
    handleStartDateChange = (value) => {
        const { translate } = this.props;
        let { errorOnEndDate, endDate } = this.state;

        let errorOnStartDate;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partEndDate = endDate.split('-');
        let d = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'));

        if (date.getTime() > d.getTime()) {
            errorOnStartDate = translate('human_resource.start_date_before_end_date');
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
     * Bắt sự kiện thay đổi thời gian kết thúc
     * @param {*} value : Ngày kết thúc
     */
    handleEndDateChange = (value) => {
        const { translate } = this.props;
        let { startDate, errorOnStartDate } = this.state;

        let errorOnEndDate;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partStartDate = startDate.split('-');
        let d = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'));

        if (d.getTime() > date.getTime()) {
            errorOnEndDate = translate('human_resource.end_date_after_start_date');
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
        const { description, startDate, endDate } = this.state;
        let result = this.validateDescription(description, false);
        let partStart = startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        let partEnd = endDate.split('-');
        let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        if (new Date(startDateNew).getTime() <= new Date(endDateNew).getTime()) {
            return result;
        } else return false;
    }

    /** Bắt sự kiện submit form */
    save = () => {
        const { startDate, endDate, _id } = this.state;
        let partStart = startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        let partEnd = endDate.split('-');
        let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        if (this.isFormValidated()) {
            this.props.updateWorkPlan(_id, { ...this.state, startDate: startDateNew, endDate: endDateNew });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                type: nextProps.type,
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
                description: nextProps.description,

                errorOnStartDate: undefined,
                errorOnEndDate: undefined,
                errorOnDescription: undefined,

            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, workPlan } = this.props;

        const { type, startDate, endDate, description, errorOnStartDate, errorOnEndDate, errorOnDescription, _id } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-edit-work-plan" isLoading={workPlan.isLoading}
                    formID="form-edit-work-plan"
                    title={translate('human_resource.work_plan.edit_work_plan')}
                    func={this.save}
                    size={50}
                    maxWidth={500}
                >
                    <form className="form-group" id="form-edit-work-plan" >
                        {/* Thể loại kế hoạch làm việc */}
                        <div className="form-group">
                            <label>{translate('human_resource.work_plan.table.type')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`edit_type_work_plan`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={type}
                                items={[{ value: "time_for_holiday", text: translate('human_resource.work_plan.time_for_holiday') },
                                { value: 'time_allow_to_leave', text: translate('human_resource.work_plan.time_allow_to_leave') },
                                { value: 'time_not_allow_to_leave', text: translate('human_resource.work_plan.time_not_allow_to_leave') }]}
                                onChange={this.handleTypetChange}
                            />
                        </div>

                        <div className="row">
                            {/* Ngày bắt đầu */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && "has-error"}`}>
                                <label>{translate('human_resource.work_plan.table.start_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit_start_date${_id}`}
                                    deleteValue={false}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            {/* Ngày kết thúc */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate && "has-error"}`}>
                                <label>{translate('human_resource.work_plan.table.end_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit_end_date${_id}`}
                                    deleteValue={false}
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                                <ErrorLabel content={errorOnEndDate} />
                            </div>
                        </div>

                        {/* Mô tả */}
                        <div className={`form-group ${errorOnDescription && "has-error"}`}>
                            <label htmlFor="description">{translate('human_resource.work_plan.table.describe_timeline')}<span className="text-red">&#42;</span></label>
                            <textarea className="form-control" rows="3" style={{ height: 72 }} name="description" value={description} onChange={this.handleDescriptionChange}></textarea>
                            <ErrorLabel content={errorOnDescription} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { workPlan } = state;
    return { workPlan };
};

const actionCreators = {
    updateWorkPlan: WorkPlanActions.updateWorkPlan,
};

const editForm = connect(mapState, actionCreators)(withTranslate(WorkPlanEditForm));
export { editForm as WorkPlanEditForm };
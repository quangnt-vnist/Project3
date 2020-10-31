import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, DatePicker, UploadFile } from '../../../../../common-components';

import { EmployeeCreateValidator } from './combinedContent';
class CertificateAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.formatDate(Date.now()),
            endDate: "",
            name: "",
            issuedBy: "",
            urlFile: "",
            fileUpload: "",
            file: "",
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

            return [day, month, year].join('-');
        }
        return date;
    }

    /** Bắt sự kiện thay đổi file đính kèm */
    handleChangeFile = (value) => {
        if (value.length !== 0) {
            this.setState({
                file: value[0].fileName,
                urlFile: value[0].urlFile,
                fileUpload: value[0].fileUpload

            })
        } else {
            this.setState({
                file: "",
                urlFile: "",
                fileUpload: ""
            })
        }
    }

    /** Bắt sự kiên thay đổi tên chứng chỉ */
    handleNameChange = (e) => {
        let { value } = e.target;
        this.validateNameCertificate(value, true);
    }
    validateNameCertificate = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateNameCertificate(value, translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnName: msg,
                    name: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi nơi cấp */
    handleIssuedByChange = (e) => {
        let { value } = e.target;
        this.validateIssuedByCertificate(value, true);
    }
    validateIssuedByCertificate = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateIssuedByCertificate(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnUnit: msg,
                    issuedBy: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi ngày cấp
     * @param {*} value : Ngày cấp
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
            errorOnStartDate = translate('human_resource.profile.start_date_before_end_date');
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
     * Bắt sự kiện thay đổi ngày hết hạn
     * @param {*} value : Ngày hết hạn
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
            errorOnEndDate = translate('human_resource.profile.end_date_after_start_date');
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
        const { name, issuedBy, startDate, endDate } = this.state;
        let result = this.validateNameCertificate(name, false) && this.validateIssuedByCertificate(issuedBy, false);
        let partStart = startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        if (endDate) {
            let partEnd = endDate.split('-');
            let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-');
            if (new Date(startDateNew).getTime() <= new Date(endDateNew).getTime()) {
                return result;
            } else return false;
        } else {
            return result;
        }
    }

    /** Bắt sự kiện submit form */
    save = async () => {
        const { startDate, endDate } = this.state;
        let partStart = startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        let endDateNew = null;
        if (endDate) {
            let partEnd = endDate.split('-');
            endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        };
        if (this.isFormValidated()) {
            return this.props.handleChange({ ...this.state, startDate: startDateNew, endDate: endDateNew });
        }
    }

    render() {
        const { translate } = this.props;

        const { id } = this.props;

        const { name, issuedBy, endDate, startDate, errorOnName, errorOnUnit, errorOnEndDate, errorOnStartDate } = this.state;

        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-create-certificateShort-${id}`} button_name={translate('modal.create')} title={translate('human_resource.profile.add_certificate')} />
                <DialogModal
                    size='50' modalID={`modal-create-certificateShort-${id}`} isLoading={false}
                    formID={`form-create-certificateShort-${id}`}
                    title={translate('human_resource.profile.add_certificate')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-certificateShort-${id}`}>
                        {/* Tên chứng chỉ */}
                        <div className={`form-group ${errorOnName && "has-error"}`}>
                            <label>{translate('human_resource.profile.name_certificate')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="name" value={name} onChange={this.handleNameChange} autoComplete="off" />
                            <ErrorLabel content={errorOnName} />
                        </div>
                        {/* Nơi cấp */}
                        <div className={`form-group ${errorOnUnit && "has-error"}`}>
                            <label>{translate('human_resource.profile.issued_by')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="issuedBy" value={issuedBy} onChange={this.handleIssuedByChange} autoComplete="off" />
                            <ErrorLabel content={errorOnUnit} />
                        </div>
                        <div className="row">
                            {/* Ngày cấp */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && "has-error"}`}>
                                <label>{translate('human_resource.profile.date_issued')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`add-start-date-${id}`}
                                    deleteValue={false}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            {/* Ngày hết hạn */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate && "has-error"}`}>
                                <label>{translate('human_resource.profile.end_date_certificate')}</label>
                                <DatePicker
                                    id={`add-end-date-${id}`}
                                    deleteValue={true}
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                                <ErrorLabel content={errorOnEndDate} />
                            </div>
                        </div>
                        {/* File đính kèm */}
                        <div className="form-group">
                            <label htmlFor="file">{translate('human_resource.profile.attached_files')}</label>
                            <UploadFile onChange={this.handleChangeFile} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

const addModal = connect(null, null)(withTranslate(CertificateAddModal));
export { addModal as CertificateAddModal };

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker, UploadFile } from '../../../../../common-components';

import { EmployeeCreateValidator } from './combinedContent';

class CertificateEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
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
        let msg = EmployeeCreateValidator.validateNameCertificate(value, translate)
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
        const { endDate, startDate, name, issuedBy } = this.state;

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
            this.props.handleChange({ ...this.state, startDate: startDateNew, endDate: endDateNew });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                _id: nextProps._id,
                index: nextProps.index,
                issuedBy: nextProps.issuedBy,
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
                name: nextProps.name,
                file: nextProps.file,
                urlFile: nextProps.urlFile,
                fileUpload: nextProps.fileUpload,
                errorOnName: undefined,
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

        const { name, issuedBy, endDate, startDate, file, urlFile, fileUpload, errorOnName, errorOnUnit, errorOnEndDate, errorOnStartDate } = this.state;

        let files;
        if (file) {
            files = [{ fileName: file, urlFile: urlFile, fileUpload: fileUpload }]
        }

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-certificateShort-${id}`} isLoading={false}
                    formID={`form-edit-certificateShort-${id}`}
                    title={translate('human_resource.profile.edit_certificate')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-edit-certificateShort-${id}`}>
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
                                    id={`edit-start-date-${id}`}
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
                                    id={`edit-end-date-${id}`}
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
                            <UploadFile files={files} onChange={this.handleChangeFile} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

const editModal = connect(null, null)(withTranslate(CertificateEditModal));
export { editModal as CertificateEditModal };

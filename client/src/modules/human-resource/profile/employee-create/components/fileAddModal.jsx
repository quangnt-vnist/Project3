import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, UploadFile } from '../../../../../common-components';

import { EmployeeCreateValidator } from './combinedContent';

class FileAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            number: "",
            status: "submitted",
            file: "",
            urlFile: "",
            fileUpload: ""
        }
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

    /** Bắt sự kiện thay đổi trạng thái */
    handleStatusChange = (e) => {
        const { value } = e.target;
        this.setState({
            status: value
        });
    }

    /** Bắt sự kiên thay đổi tên tài liệu */
    handleNameFileChange = (e) => {
        let { value } = e.target;
        this.validateNameFile(value, true);
    }
    validateNameFile = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateNameFile(value, translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnNameFile: msg,
                    name: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Bắt sự kiên thay đổi mô tả */
    handleDiscFileChange = (e) => {
        let { value } = e.target;
        this.validateDiscFile(value, true);
    }
    validateDiscFile = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateDiscFile(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDiscFile: msg,
                    description: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Bắt sự kiên thay đổi mô tả */
    handleNumberChange = (e) => {
        let { value } = e.target;
        this.validateNumberFile(value, true);
    }
    validateNumberFile = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateNumberFile(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnNumberFile: msg,
                    number: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    isFormValidated = () => {
        const { name, description, number } = this.state;
        let result = this.validateNameFile(name, false) &&
            this.validateDiscFile(description, false) &&
            this.validateNumberFile(number, false);
        return result;
    }

    /** Bắt sự kiện submit form */
    save = () => {
        if (this.isFormValidated()) {
            return this.props.handleChange(this.state);
        }
    }

    render() {
        const { translate } = this.props;

        const { id } = this.props;

        const { name, description, number, status,
            errorOnNameFile, errorOnDiscFile, errorOnNumberFile } = this.state;

        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-create-file-${id}`} button_name={translate('modal.create')} title={translate('human_resource.profile.add_file')} />
                <DialogModal
                    size='50' modalID={`modal-create-file-${id}`} isLoading={false}
                    formID={`form-create-file-${id}`}
                    title={translate('human_resource.profile.add_file')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-file-${id}`}>
                        {/* Tên tài liệu  */}
                        <div className={`form-group ${errorOnNameFile && "has-error"}`}>
                            <label>{translate('human_resource.profile.file_name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="name" value={name} onChange={this.handleNameFileChange} autoComplete="off" />
                            <ErrorLabel content={errorOnNameFile} />
                        </div>
                        {/* Mô tả */}
                        <div className={`form-group ${errorOnDiscFile && "has-error"}`}>
                            <label>{translate('table.description')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="description" value={description} onChange={this.handleDiscFileChange} autoComplete="off" />
                            <ErrorLabel content={errorOnDiscFile} />
                        </div>
                        <div className="row">
                            {/* Số lượng */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnNumberFile && "has-error"}`}>
                                <label>{translate('human_resource.profile.number')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="number" value={number} onChange={this.handleNumberChange} autoComplete="off" />
                                <ErrorLabel content={errorOnNumberFile} />
                            </div>
                            {/* Trạng thái */}
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>{translate('table.status')}<span className="text-red">*</span></label>
                                <select className="form-control" value={status} name="status" onChange={this.handleStatusChange}>
                                    <option value="not_submitted_yet">{translate('human_resource.profile.not_submitted_yet')}</option>
                                    <option value="submitted">{translate('human_resource.profile.submitted')}</option>
                                    <option value="returned">{translate('human_resource.profile.returned')}</option>
                                </select>
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

const addModal = connect(null, null)(withTranslate(FileAddModal));
export { addModal as FileAddModal };

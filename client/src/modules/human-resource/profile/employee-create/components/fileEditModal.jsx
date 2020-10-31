import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, UploadFile } from '../../../../../common-components';

import { EmployeeCreateValidator } from './combinedContent';

class FileEditModal extends Component {
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
        let msg = EmployeeCreateValidator.validateNameFile(value, translate)
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

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                _id: nextProps._id,
                index: nextProps.index,
                name: nextProps.name,
                description: nextProps.description,
                number: nextProps.number,
                status: nextProps.status,
                file: nextProps.file,
                urlFile: nextProps.urlFile,
                fileUpload: nextProps.fileUpload,

                errorOnNameFile: undefined,
                errorOnDiscFile: undefined,
                errorOnNumberFile: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate } = this.props;

        const { id } = this.props;

        const { name, description, number, status, file, urlFile, fileUpload,
            errorOnNameFile, errorOnDiscFile, errorOnNumberFile } = this.state;

        let files;
        if (file) {
            files = [{ fileName: file, urlFile: urlFile, fileUpload: fileUpload }]
        }

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-file-${id}`} isLoading={false}
                    formID={`form-edit-file-${id}`}
                    title={translate('human_resource.profile.edit_file')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-file-${id}`}>
                        {/* Tên tài liệu */}
                        <div className={`form-group ${errorOnNameFile && "has-error"}`}>
                            <label>{translate('human_resource.profile.file_name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="name" value={name} onChange={this.handleNameFileChange} autoComplete="off" />
                            <ErrorLabel content={errorOnNameFile} />
                        </div>
                        {/* Tên mô tả */}
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
                            <UploadFile files={files} onChange={this.handleChangeFile} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

const editModal = connect(null, null)(withTranslate(FileEditModal));
export { editModal as FileEditModal };

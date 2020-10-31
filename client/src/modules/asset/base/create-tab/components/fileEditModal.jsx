import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, UploadFile } from '../../../../../common-components';

import { AssetCreateValidator } from './combinedContent';

class FileEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    // Bắt sự kiện thay đổi file đính kèm
    handleChangeFile = (file) => {
        file = file.map(x => {
            return {
                fileName: x.fileName,
                url: x.urlFile,
                fileUpload: x.fileUpload
            }
        })
        this.setState({
            files: file
        });
    }

    // Bắt sự kiện xóa file đính kèm
    handleDeleteFile = (name) => {
        const { files } = this.state;
        let newfiles = files.filter((item) => item.fileName !== name);

        this.setState(state => {
            return {
                ...state,
                files: newfiles,
            }
        })
    }

    // Bắt sự kiên thay đổi tên tài liệu
    handleNameFileChange = (e) => {
        let { value } = e.target;
        this.validateNameFile(value, true);
    }
    validateNameFile = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateNameFile(value, this.props.translate)
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

    // Bắt sự kiên thay đổi mô tả
    handleDiscFileChange = (e) => {
        let { value } = e.target;
        this.validateDiscFile(value, true);
    }
    validateDiscFile = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateDiscFile(value, this.props.translate)
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

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result = this.validateNameFile(this.state.name, false) && this.validateDiscFile(this.state.description, false);

        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        if (this.isFormValidated()) {
            return this.props.handleEditFile(this.state);
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
                files: nextProps.files,

                errorOnNameFile: undefined,
                errorOnDiscFile: undefined,
                errorOnNumberFile: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id } = this.props;
        const { translate } = this.props;
        const { name, description, files, errorOnNameFile, errorOnDiscFile, errorOnNumberFile } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-file-${id}`} isLoading={false}
                    formID={`form-edit-file-${id}`}
                    title={translate('asset.general_information.edit_document')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa tài liệu đính kèm */}
                    <form className="form-group" id={`form-create-file-${id}`}>
                        {/* Tên tài liệu */}
                        <div className={`form-group ${!errorOnNameFile ? "" : "has-error"}`}>
                            <label>{translate('asset.general_information.file_name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="name" value={name} onChange={this.handleNameFileChange} autoComplete="off" />
                            <ErrorLabel content={errorOnNameFile} />
                        </div>

                        {/* Mô tả */}
                        <div className={`form-group ${!errorOnDiscFile ? "" : "has-error"}`}>
                            <label>{translate('asset.general_information.description')}<span className="text-red">*</span></label>
                            <textarea className="form-control" rows="3" name="description" value={description} onChange={this.handleDiscFileChange} autoComplete="off"></textarea>
                            <ErrorLabel content={errorOnDiscFile} />
                        </div>

                        {/* File đính kèm */}
                        <div className="form-group">
                            <label htmlFor="file">{translate('asset.general_information.attached_file')}</label>
                            <UploadFile multiple={true} onChange={this.handleChangeFile} />
                            {/* <br />
                            <div className="upload btn btn-primary">
                                <i className="fa fa-folder"></i>
                                {" " + translate('document.choose_file')}
                                <input className="upload" type="file" name="file" onChange={this.handleChangeFile} />
                            </div> */}
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

const editModal = connect(null, null)(withTranslate(FileEditModal));

export { editModal as FileEditModal };

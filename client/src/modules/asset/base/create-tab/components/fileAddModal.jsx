import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, UploadFile } from '../../../../../common-components';

import { AssetCreateValidator } from './combinedContent';

class FileAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            number: "",
            files: [],
        }
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
            return this.props.handleChange(this.state);
        }
    }

    render() {
        const { id } = this.props;
        const { translate } = this.props;
        const { name, description, number, status, errorOnNameFile, errorOnDiscFile, errorOnNumberFile, files } = this.state;

        return (
            <React.Fragment>
                {/* Button thêm tài liệu đính kèm */}
                <ButtonModal modalID={`modal-create-file-${id}`} button_name={translate('manage_asset.add_file')} title={translate('manage_asset.add_file')} />
                <DialogModal
                    size='50' modalID={`modal-create-file-${id}`} isLoading={false}
                    formID={`form-create-file-${id}`}
                    title={translate('manage_asset.add_file')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form thêm tài liệu đính kèm */}
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
                            <label htmlFor="">Chọn tài liệu</label>
                            <UploadFile multiple={true} onChange={this.handleChangeFile} />
                        </div>

                        {/* <div className="form-group">
                            <label htmlFor="file">{translate('asset.general_information.attached_file')}</label>
                            <input type="file" style={{ height: 34, paddingTop: 2 }} className="form-control" name="file" onChange={this.handleChangeFile} />
                            <br />
                            <div className="upload btn btn-primary">
                                <i className="fa fa-folder"></i>
                                {" " + translate('document.choose_file')}
                                <input className="upload" type="file" name="file" onChange={this.handleChangeFile} />
                            </div>
                        </div> */}
                        {/* <ul style={{ listStyle: 'none' }}>
                            {files.map((child, index) => {
                                return (
                                    <React.Fragment>
                                        <li key={index}>
                                            <label><a style={{ cursor: "pointer" }} title='Xóa file này'><i className="fa fa-times" style={{ color: "black", marginRight: 5 }}
                                                onClick={(e) => this.handleDeleteFile(child.fileName)} /></a></label>
                                            <a>{child.fileName}</a>
                                        </li>
                                    </React.Fragment>
                                )
                            })}
                        </ul> */}
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

const addModal = connect(null, null)(withTranslate(FileAddModal));

export { addModal as FileAddModal };

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, UploadFile, ErrorLabel } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';

class FileEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { data } = props;
        if (props._id != state._id) {
            return {
                ...state,
                _id: props._id,
                name: data.name,
                description: data.description,
                files: [{ fileName: data.fileName, urlFile: data.url, fileUpload: data.fileUpload }],
                fileUpload: data.fileUpload,
                fileName: data.fileName,
                urlFile: data.url
            }
        } else {
            return null;
        }
    }

    /**
     * Hàm xử lý khi tên file đính kèm thay đổi
     * @param {*} e 
     */
    handlefileNameChange = (e) => {
        const { value } = e.target;
        const { translate } = this.props;

        this.setState({
            name: value,
        })

        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ nameError: message });
    }

    /**
     * Hàm xử lý khi mô tả file đính kèm thay đổi
     * @param {*} e 
     */
    handleDescriptionFileChange = (e) => {
        const { value } = e.target;
        const { translate } = this.props;

        this.setState({
            description: value,
        })

        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ descriptionError: message });
    }

    /**
     * Hàm xử lý khi file đính kèm thay đổi
     * @param {*} value 
     */
    handleChangeFile = (value) => {
        // const { translate } = this.props;
        if (value && value.length > 0) {
            this.setState({
                fileName: value[0].fileName,
                urlFile: value[0].urlFile,
                fileUpload: value[0].fileUpload,
            })

            // let { message } = ValidationHelper.validateEmpty(translate, value[0].fileUpload);
            // this.setState({ fileError: message });
        }
    }

    isFormValidated = () => {
        const { name, description, fileUpload } = this.state;
        const { translate } = this.props;
        if (!ValidationHelper.validateName(translate, name).status ||
            !ValidationHelper.validateName(translate, description).status
        )
            return false;
        return true;
    }

    save = () => {
        if (this.isFormValidated) {
            this.props.handleEditChange(this.state);
        }
    }


    render() {
        const { translate } = this.props;
        const { nameError, descriptionError, fileError, name, description, files } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size={50} modalID={`modal-fileEditModal`} isLoading={false}
                    formID={`modal-fileEditModal`}
                    title={translate('crm.customer.file.edit_file')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >

                    <form className="form-group" id={`form-create-file`}>
                        {/* Tên tài liệu  */}
                        <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                            <label>{translate('crm.customer.file.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={name ? name : ''} onChange={this.handlefileNameChange} />
                            <ErrorLabel content={nameError} />
                        </div>

                        {/* Mô tả */}
                        <div className={`form-group ${!descriptionError ? "" : "has-error"}`}>
                            <label>{translate('crm.customer.file.description')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={description ? description : ''} onChange={this.handleDescriptionFileChange} />
                            <ErrorLabel content={descriptionError} />
                        </div>

                        {/* File đính kèm */}
                        <div className={`form-group `}>
                            <label htmlFor="file">{translate('crm.customer.file.url')}<span className="text-red">*</span></label>
                            <UploadFile files={files} onChange={this.handleChangeFile} />
                            {/* <ErrorLabel content={fileError} /> */}
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(FileEditModal));
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, UploadFile, ErrorLabel } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';

class FileAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
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
        const { translate } = this.props;

        if (value && value.length > 0) {
            this.setState({
                fileName: value[0].fileName,
                urlFile: value[0].urlFile,
                fileUpload: value[0].fileUpload,
            })

            let { message } = ValidationHelper.validateEmpty(translate, value[0].fileUpload);
            this.setState({ fileError: message });
        }
    }

    /**
     * Hàm kiểm tra validate
     */
    isFormValidated = () => {
        const { name, description, fileUpload } = this.state;
        const { translate } = this.props;
        if (!ValidationHelper.validateName(translate, name).status ||
            !ValidationHelper.validateName(translate, description).status ||
            !ValidationHelper.validateName(translate, fileUpload).status)
            return false;
        return true;
    }


    save = () => {
        const { handleAddFileAttachment } = this.props;
        if (this.isFormValidated) {
            handleAddFileAttachment(this.state);
        }
    }

    render() {
        const { translate } = this.props;
        //message validate
        const { nameError, descriptionError, fileError } = this.state;

        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-create-file`} button_name={translate('modal.create')} title={translate('human_resource.profile.add_file')} />
                <DialogModal
                    size='50' modalID={`modal-create-file`} isLoading={false}
                    formID={`form-create-file`}
                    title={translate('crm.customer.file.add_file')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-file`}>
                        {/* Tên tài liệu  */}
                        <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                            <label>{translate('crm.customer.file.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="name" onChange={this.handlefileNameChange} autoComplete="off" />
                            <ErrorLabel content={nameError} />
                        </div>

                        {/* Mô tả */}
                        <div className={`form-group ${!descriptionError ? "" : "has-error"}`}>
                            <label>{translate('crm.customer.file.description')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="description" onChange={this.handleDescriptionFileChange} autoComplete="off" />
                            <ErrorLabel content={descriptionError} />
                        </div>

                        {/* File đính kèm */}
                        <div className={`form-group ${!fileError ? "" : "has-error"}`}>
                            <label htmlFor="file">{translate('crm.customer.file.url')}<span className="text-red">*</span></label>
                            <UploadFile onChange={this.handleChangeFile} />
                            <ErrorLabel content={fileError} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(FileAddModal));
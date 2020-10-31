import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, TreeSelect } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import ValidationHelper from '../../../../../helpers/validationHelper';
class CreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            archiveParent: ''
        }
    }

    handleName = (e) => {
        const { value } = e.target;
        const { translate } = this.props;
        const { message } = ValidationHelper.validateName(translate, value, 1, 255);
        this.setState({
            name: value,
            nameError: message
        });
    }

    handleDescription = (e) => {
        const {value} = e.target;
        this.setState({
            description: value
        });
    }

    handleParent = (value) => {
        this.setState({ archiveParent: value[0] });
    };

    isValidateForm = () => {
        let {name} = this.state;
        let {translate} = this.props;
        if(!ValidationHelper.validateName(translate, name, 1, 255).status) return false;
        return true;
    }

    save = () => {
        const data = {
            name: this.state.name,
            description: this.state.description,
            parent: this.state.archiveParent
        }
        this.props.createDocumentArchive(data);
    }

    render() {
        const { translate, documents } = this.props;
        const { list } = documents.administration.archives;
        let { archiveParent, nameError } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-document-archive"
                    formID="form-create-document-archive"
                    title="Thêm mục lưu trữ"
                    disableSubmit={!this.isValidateForm()}
                    func={this.save}
                >
                    <form id="form-create-document-archive">
                        <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                            <label>{translate('document.administration.archives.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleName} />
                            <ErrorLabel content={nameError} />
                        </div>
                        <div className="form-group">
                            <label>{translate('document.administration.archives.parent')}</label>
                            <TreeSelect data={list} value={archiveParent} handleChange={this.handleParent} mode="radioSelect" />
                        </div>
                        <div className="form-group">
                            <label>{translate('document.administration.archives.description')}</label>
                            <textarea style={{ minHeight: '100px' }} type="text" className="form-control" onChange={this.handleDescription} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    createDocumentArchive: DocumentActions.createDocumentArchive
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));
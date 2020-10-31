import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import { CategoryImportForm } from './categoryImportForm';
import ValidationHelper from '../../../../../helpers/validationHelper';

class CreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleSelect = (value) => {
        this.setState({ value });
    };


    handleName = (e) => {
        const value = e.target.value;
        const {translate} = this.props;
        const {message} = ValidationHelper.validateName(translate, value, 1, 255);
        this.setState({
            name: value,
            nameError: message
        })
    }

    handleDescription = (e) => {
        const value = e.target.value;
        this.setState({
            description: value
        })
    }

    isFormValidated = () => {
        const {name} = this.state;
        const {translate} = this.props;
        if(!ValidationHelper.validateName(translate, name, 1, 255).status) return false;
        return true;
    }
    
    handleAddCategory = () => {
        window.$('#modal-create-document-type').modal('show');
    }

    handImportFile = () => {
        window.$('#modal-import-file-category').modal('show');
    }

    save = () => {
        if(this.isFormValidated()){
            const { name, description } = this.state;
            this.props.createDocumentCategory({
                name,
                description
            });
        }
    }

    render() {
        const { translate } = this.props;
        const { nameError } = this.state;
        return (
            <React.Fragment>
                <CategoryImportForm />
                <div className="form-inline">
                    <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                        <button type="button" className="btn btn-success dropdown-toggler pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('document.add')}
                        >{translate('general.add')}</button>
                        <ul className="dropdown-menu pull-right">
                            <li><a href="#modal-create-document-type" title="ImportForm" onClick={(event) => { this.handleAddCategory(event) }}>{translate('document.add')}</a></li>
                            <li><a href="#modal_import_file_category" title="ImportForm" onClick={(event) => { this.handImportFile(event) }}>{translate('document.import')}</a></li>
                        </ul>
                    </div>
                </div>

                <DialogModal
                    modalID="modal-create-document-type"
                    formID="form-create-document-type"
                    title={translate('document.administration.categories.add')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-create-document-type">
                        <div className={`form-group ${nameError === undefined ? "" : "has-error"}`}>
                            <label>{translate('document.administration.categories.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control"
                                onChange={this.handleName} placeholder={translate('document.category_example')}/>
                            <ErrorLabel content={nameError} />
                        </div>
                        <div className="form-group">
                            <label>{translate('document.administration.categories.description')}</label>
                            <textarea type="text" className="form-control" onChange={this.handleDescription} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    createDocumentCategory: DocumentActions.createDocumentCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));
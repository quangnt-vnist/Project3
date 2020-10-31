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
        }
    }

    handleName = (e) => {
        const value = e.target.value;
        const { translate } = this.props;
        const { message } = ValidationHelper.validateName(translate, value)
        this.setState({
            name: value,
            nameError: message
        })
    }

    handleDescription = (e) => {
        const value = e.target.value;
        this.setState({
            description: value
        });
    }

    handleParent = (value) => {
        this.setState({ domainParent: value[0] });
    };


    isValidateForm = () => {
        const {name, description} = this.state;
        const {translate} = this.props;
        if(
            !ValidationHelper.validateName(translate, name)
        ) return false;
        return true;
    }

    save = () => {
        const { name, description, domainParent } = this.state;
        this.props.createDocumentDomain({
            name,
            description,
            parent: domainParent
        });
    }

    render() {
        const { translate, documents } = this.props;
        const { list } = documents.administration.domains;
        const { nameError, domainParent } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-document-domain"
                    formID="form-create-document-domain"
                    title={translate('document.administration.domains.add')}
                    disableSubmit={!this.isValidateForm()}
                    func={this.save}
                >
                    <form id="form-create-document-domain">
                        <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                            <label>{translate('document.administration.domains.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleName} />
                            <ErrorLabel content={nameError} />
                        </div>
                        <div className="form-group">
                            <label>{translate('document.administration.domains.parent')}</label>
                            <TreeSelect data={list} value={domainParent} handleChange={this.handleParent} mode="radioSelect" />
                        </div>
                        <div className="form-group">
                            <label>{translate('document.administration.domains.description')}</label>
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
    createDocumentDomain: DocumentActions.createDocumentDomain
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));
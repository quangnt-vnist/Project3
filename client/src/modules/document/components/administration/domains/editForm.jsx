import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ErrorLabel, TreeSelect } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import ValidationHelper from '../../../../../helpers/validationHelper';

class EditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleName = (e) => {
        const value = e.target.value;
        const {translate} = this.props;
        const {message} = ValidationHelper.validateName(translate, value)
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
            !ValidationHelper.validateName(translate, name).status
        ) return false;
        return true;
    }

    save = () => {
        const { domainId, name, description, domainParent } = this.state;
        if(this.isValidateForm())
            this.props.editDocumentDomain(domainId, {
                name,
                description,
                parent: domainParent
            });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.domainId !== prevState.domainId) {
            return {
                ...prevState,
                domainId: nextProps.domainId,
                name: nextProps.domainName,
                description: nextProps.domainDescription,
                domainParent: nextProps.domainParent,
                nameError: undefined,
                descriptionError: undefined
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, documents } = this.props;
        const { list } = documents.administration.domains;
        const { unChooseNode } = this.props;
        const { name, description, domainParent, nameError } = this.state;
        let listDomain = [];
        for (let i in list) {
            if (!unChooseNode.includes(list[i].id)) {
                listDomain.push(list[i]);
            }
        }
        const disabled = !this.isValidateForm();

        return (
            <div id="edit-document-domain">
                <div className={`form-group ${nameError === undefined ? "" : "has-error"}`}>
                    <label>{translate('document.administration.domains.name')}<span className="text-red">*</span></label>
                    <input type="text" className="form-control" onChange={this.handleName} value={name} />
                    <ErrorLabel content={nameError} />
                </div>
                <div className="form-group">
                    <label>{translate('document.administration.domains.parent')}</label>
                    <TreeSelect data={listDomain} value={[domainParent]} handleChange={this.handleParent} mode="radioSelect" />
                </div>
                <div className="form-group">
                    <label>{translate('document.administration.domains.description')}</label>
                    <textarea style={{ minHeight: '120px' }} type="text" className="form-control" onChange={this.handleDescription} value={description} />
                </div>
                <div className="form-group">
                    <button className="btn btn-success pull-right" style={{ marginLeft: '5px' }} disabled={disabled} onClick={this.save}>{translate('form.save')}</button>
                    <button className="btn btn-danger" onClick={() => {
                        window.$(`#edit-document-domain`).slideUp()
                    }}>{translate('form.close')}</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editDocumentDomain: DocumentActions.editDocumentDomain
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm));
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';
import { DocumentActions } from '../../../redux/actions';

class EditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

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

    isValidateForm = ()=>{
        const {translate} = this.props;
        const {name} = this.state;
        if(!ValidationHelper.validateName(translate, name, 1, 255).status) return false;
        return true;
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.categoryId !== prevState.categoryId) {
            return {
                ...prevState,
                categoryId: nextProps.categoryId,
                name: nextProps.categoryName,
                description: nextProps.categoryDescription,
                nameError: undefined
            } 
        } else {
            return null
        }
    }

    save = () => {
        if(this.isValidateForm()) {
            const { categoryId, name, description } = this.state;
            this.props.editDocumentCategory(categoryId, {
                name,
                description
            });
        }
    }

    render() {
        const { translate }=this.props;
        const { name, description, nameError } = this.state;
    
        return ( 
            <DialogModal
                modalID="modal-edit-document-category"
                formID="form-edit-document-category"
                title={translate('document.administration.categories.edit')}
                disableSubmit = {!this.isValidateForm()}
                func={this.save}
            >
                <form id="form-edit-document-category">
                    <div className={`form-group ${nameError === undefined ? "" : "has-error"}`}>
                        <label>{ translate('document.administration.categories.name') }<span className="text-red">*</span></label>
                        <input type="text" className="form-control" onChange={this.handleName} value={name}/>
                        <ErrorLabel content = {nameError}/>
                    </div>
                    <div className="form-group">
                        <label>{ translate('document.administration.categories.description') }<span className="text-red">*</span></label>
                        <textarea type="text" className="form-control" onChange={this.handleDescription} value={description}/>
                    </div>
                </form>
            </DialogModal>
         );
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    editDocumentCategory: DocumentActions.editDocumentCategory
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(EditForm) );
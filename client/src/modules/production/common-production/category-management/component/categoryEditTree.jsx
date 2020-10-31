import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, TreeSelect } from '../../../../../common-components';
import { CategoryActions } from '../redux/actions';

class CategoryEditTree extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    handleCode = (e) => {
        const value = e.target.value;
        this.setState({
            categoryCode: value
        })
    }

    handleName = (e) => {
        const value = e.target.value;
        this.setState({
            categoryName: value
        })
    }

    handleDescription = (e) => {
        const value = e.target.value;
        this.setState({
            categoryDescription: value
        })
    }

    handleParent = (value) => {
        this.setState({ categoryParent: value[0] });
    };

    validateName = async (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.no_blank_name');
        }
        if (willUpdateState) {
            await this.setState(state => {
                return {
                    ...state,
                    categoryName: value,
                    errorName: msg
                }
            })
        }

        return msg === undefined;
    }

    validateCode = async (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.no_blank_name');
        }
        if (willUpdateState) {
            await this.setState(state => {
                return {
                    ...state,
                    categoryCode: value,
                    errorCode: msg
                }
            })
        }

        return msg === undefined;
    }

    handleValidateName = (e) => {
        const value = e.target.value.trim();
        this.validateName(value, true);
    }

    handleValidateCode = (e) => {
        const value = e.target.value.trim();
        this.validateCode(value, true);
    }

    isValidateForm = () => {
        return this.validateName(this.state.categoryName, false) &&
            this.validateCode(this.state.categoryCode, false);
    }

    save = () => {
        const { categoryId, categoryName, categoryDescription, categoryParent, categoryCode } = this.state;
        this.props.editCategory(categoryId, {
            name: categoryName,
            code: categoryCode,
            description: categoryDescription,
            parent: categoryParent
        });
    }

    static getDerivedStateFromProps(props, state) {
        if (props.categoryId !== state.categoryId) {
            return {
                ...state,
                categoryId: props.categoryId,
                categoryName: props.categoryName,
                categoryCode: props.categoryCode,
                categoryDescription: props.categoryDescription,
                categoryParent: props.categoryParent,
                errorName: undefined,
                errorCode: undefined
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, categories } = this.props;
        const { list } = categories.categoryToTree;
        const { categoryName, categoryDescription, categoryParent, categoryCode, errorName, errorCode } = this.state;

        return (
            <div id="edit-category-good">
                <div className={`form-group ${errorCode === undefined ? "" : "has-error"}`}>
                    <label>{translate('manage_warehouse.category_management.code')}<span className="text-red">*</span></label>
                    <input type="text" className="form-control" onChange={this.handleValidateCode} value={categoryCode} />
                    <ErrorLabel content={errorCode} />
                </div>
                <div className={`form-group ${errorName === undefined ? "" : "has-error"}`}>
                    <label>{translate('manage_warehouse.category_management.name')}<span className="text-red">*</span></label>
                    <input type="text" className="form-control" onChange={this.handleValidateName} value={categoryName} />
                    <ErrorLabel content={errorName} />
                </div>
                <div className="form-group">
                    <label>{translate('document.administration.archives.parent')}</label>
                    <TreeSelect data={list} value={[categoryParent]} handleChange={this.handleParent} mode="radioSelect" />
                </div>
                <div className="form-group">
                    <label>{translate('manage_warehouse.category_management.description')}</label>
                    <textarea style={{ minHeight: '120px' }} type="text" className="form-control" onChange={this.handleDescription} value={categoryDescription} />
                </div>
                <div className="form-group">
                    <button className="btn btn-success pull-right" style={{ marginLeft: '5px' }} onClick={this.save}>{translate('form.save')}</button>
                    <button className="btn btn-danger" onClick={() => {
                        window.$(`#edit-category-good`).slideUp()
                    }}>{translate('form.close')}</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editCategory: CategoryActions.editCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CategoryEditTree));
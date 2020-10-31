import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, TreeSelect } from '../../../../../common-components';
import { CategoryActions } from '../redux/actions';
class CategoryCreateTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryParent: this.props.categoryParent,
        }
    }

    handleName = (e) => {
        const value = e.target.value;
        this.setState({
            categoryName: value
        })
    }
    handleCode = (e) => {
        const value = e.target.value;
        this.setState({
            categoryCode: value
        })
    }

    handleDescription = (e) => {
        const value = e.target.value;
        this.setState({
            categoryDesription: value
        })
    }

    handleParent = (value) => {
        this.setState({ categoryParent: value[0] });
    };

    validateName = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.no_blank_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    categoryName: value,
                    errorName: msg,
                }
            })
        }
        return msg === undefined;
    }
    handleValidateName = (e) => {
        const value = e.target.value.trim();
        this.validateName(value, true);
    }

    validateCode = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.no_blank_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    categoryCode: value,
                    errorCode: msg,
                }
            })
        }
        return msg === undefined;
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
        const { categoryName, categoryCode, categoryDesription, categoryParent } = this.state;
        this.props.createCategory({
            name: categoryName,
            code: categoryCode,
            description: categoryDesription,
            parent: categoryParent
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.categoryParent !== prevState.categoryParent && nextProps.categoryParent && nextProps.categoryParent.length) {

            return {
                ...prevState,
                categoryParent: nextProps.categoryParent,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, categories } = this.props;
        const { list } = categories.categoryToTree;
        const { categoryParent, errorName, errorCode } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-category-good"
                    formID="form-create-category-good"
                    title={translate('manage_warehouse.category_management.add')}
                    disableSubmit={!this.isValidateForm()}
                    func={this.save}
                >
                    <form id="form-create-category-good">
                        <div className={`form-group ${!errorCode ? "" : "has-error"}`}>
                            <label>{translate('manage_warehouse.category_management.code')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleValidateCode} />
                            <ErrorLabel content={errorCode} />
                        </div>
                        <div className={`form-group ${!errorName ? "" : "has-error"}`}>
                            <label>{translate('manage_warehouse.category_management.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleValidateName} />
                            <ErrorLabel content={errorName} />
                        </div>
                        <div className="form-group">
                            <label>{translate('document.administration.archives.parent')}</label>
                            <TreeSelect data={list} value={!categoryParent ? "" : [categoryParent]} handleChange={this.handleParent} mode="radioSelect" />
                        </div>
                        <div className="form-group">
                            <label>{translate('manage_warehouse.category_management.description')}</label>
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
    createCategory: CategoryActions.createCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CategoryCreateTree));
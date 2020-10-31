import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../../common-components';

import { CategoryActions } from '../redux/actions';
class CategoryCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            name: "",
            description: "",
            type: "product",
        }
    }

    handleCodeChange = (e) => {
        let value = e.target.value;
        this.validateCode(value, true);
    }

    validateCode = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if(!value) {
            msg = translate('manage_warehouse.category_management.validate_code');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCode: msg,
                    code: value,
                }
            });
        }
        return msg === undefined;
    }

    handleNameChange = (e) => {
        let value = e.target.value;
        this.validateName(value, true);
    }
    
    validateName = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if(!value){
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnName: msg,
                    name: value,
                }
            });
        }
        return msg === undefined;
    }

    handleTypeChange = (value) => {
        this.setState({
            type: value[0]
        });
    }

    handleDescriptionChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                description: value
            }
        });
    }

    isFormValidated = () => {
        let result =
            this.validateName(this.state.name, false) &&
            this.validateCode(this.state.code, false)
        return result;
    }

    save = () => {
        if (this.isFormValidated()) {
            this.props.createCategory(this.state);
        }
    }

    render() {
        const { translate, categories } = this.props;
        const { errorOnName, errorOnCode, id, code, name, type, description } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-category" button_name={translate('manage_warehouse.category_management.add')} title={translate('manage_warehouse.category_management.add_title')} />

                <DialogModal
                    modalID="modal-create-category" isLoading={categories.isLoading}
                    formID="form-create-category"
                    title={translate('manage_warehouse.category_management.add_title')}
                    msg_success={translate('manage_warehouse.category_management.add_success')}
                    msg_faile={translate('manage_warehouse.category_management.add_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-create-category">
                        <div className={`form-group ${!errorOnCode ? "" : "has-error"}`}>
                            <label>{translate('manage_warehouse.category_management.code')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={code} onChange={this.handleCodeChange} />
                            <ErrorLabel content = { errorOnCode }/>
                        </div>
                        <div className={`form-group ${!errorOnName ? "" : "has-error"}`}>
                            <label>{translate('manage_warehouse.category_management.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={name} onChange={this.handleNameChange} />
                            <ErrorLabel content = { errorOnName } />
                        </div>
                        <div className="form-group">
                            <label>{translate('manage_warehouse.category_management.type')}<span className="text-red">*</span></label>
                            <SelectBox
                                    id={`type${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={type}
                                    items= {[{ value: "product", text: translate('manage_warehouse.category_management.product') }, 
                                    { value: "material", text: translate('manage_warehouse.category_management.material') }, 
                                    { value: "equipment", text: translate('manage_warehouse.category_management.equipment') },
                                    { value: "asset", text: translate('manage_warehouse.category_management.asset')}
                                    ]}
                                    onChange={this.handleTypeChange}
                                    multiple={false}
                                />
                        </div>
                        <div className="form-group">
                            <label>{translate('manage_warehouse.category_management.description')}</label>
                            <textarea type="text" className="form-control" value={description} onChange={this.handleDescriptionChange} />
                            <ErrorLabel/>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { categories } = state;
    return { categories };
}

const mapDispatchToProps = {
    createCategory: CategoryActions.createCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CategoryCreateForm));
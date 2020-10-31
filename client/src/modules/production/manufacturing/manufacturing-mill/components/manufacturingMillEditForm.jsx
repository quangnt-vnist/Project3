import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-redux-multilingual/lib/utils';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { ButtonModal, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { generateCode } from '../../../../../helpers/generateCode';
import ValidationHelper from '../../../../../helpers/validationHelper';
import { millActions } from '../redux/actions';

class ManufacturingEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    handleClickCreate = () => {
        const code = generateCode("NMSX");
        this.setState((state) => ({
            ...state,
            code: code
        }));
    }

    getListWorks = () => {
        const { translate, manufacturingWorks } = this.props;
        let listWorksArray = [{
            value: "",
            text: translate('manufacturing.manufacturing_mill.choose_works')
        }];

        const { listWorks } = manufacturingWorks;

        if (listWorks) {
            listWorks.map((item) => {
                listWorksArray.push({
                    value: item._id,
                    text: item.name
                });
            });
        }
        return listWorksArray;

    }

    handleManufacturingWorksChange = (value) => {
        const worksValue = value[0];
        this.validateManufacturingWorks(worksValue, true);
    }

    validateManufacturingWorks(value, willUpdateState) {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "") {
            msg = translate('manufacturing.manufacturing_mill.worksValue_error');
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                worksValue: value,
                worksValueError: msg
            }));
        }

        return msg;
    }

    handleNameChange = (e) => {
        const { value } = e.target;
        this.setState({
            name: value
        });
        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 6, 255);
        this.setState({ nameError: message })
    }

    handleDescriptionChange = (e) => {
        const { value } = e.target;
        this.setState({
            description: value
        });
    }

    handleStatusChange = (value) => {
        const status = value[0];
        console.log(status);
        this.validateStatus(status, true);
    }

    validateStatus = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "") {
            msg = translate('manufacturing.manufacturing_mill.status_error');
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                status: value,
                statusError: msg
            }))
        }

        return msg;
    }

    isFormValidated = () => {
        const { name, worksValue, status } = this.state;
        const { translate } = this.props;
        if (this.validateManufacturingWorks(worksValue, false)
            || this.validateStatus(status, false)
            || !ValidationHelper.validateName(translate, name, 6, 255).status
        ) {
            return false
        }
        return true
    }

    save = () => {
        if (this.isFormValidated) {
            const data = {
                code: this.state.code,
                name: this.state.name,
                manufacturingWorks: this.state.worksValue,
                description: this.state.description,
                status: this.state.status
            }
            this.props.editManufacturingMill(this.state.millId, data);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.millId !== prevState.millId) {
            return {
                ...prevState,
                millId: nextProps.millId,
                code: nextProps.code,
                name: nextProps.name,
                worksValue: nextProps.worksValue,
                status: String(nextProps.status),
                description: nextProps.description,
                nameError: undefined,
                worksValueError: undefined,
                statusError: undefined,
            }
        }
        return null;
    }



    render() {
        const { translate, manufacturingMill } = this.props;
        const { code, name, nameError, worksValue, worksValueError, description, status, statusError } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-edit-mill" isLoading={manufacturingMill.isLoading}
                    formID="form-edit-mill"
                    title={translate('manufacturing.manufacturing_mill.mill_edit')}
                    msg_success={translate('manufacturing.manufacturing_mill.edit_mill_successfully')}
                    msg_faile={translate('manufacturing.manufacturing_mill.edit_mill_failed')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-edit-mill">
                        <div className="form-group">
                            <label>{translate('manufacturing.manufacturing_mill.code')}<span className="text-red">*</span></label>
                            <input type="text" value={code} className="form-control" disabled={true}></input>
                        </div>
                        <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.manufacturing_mill.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={name} onChange={this.handleNameChange}></input>
                            <ErrorLabel content={nameError} />
                        </div>
                        <div className={`form-group ${!worksValueError ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.manufacturing_mill.works')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`select-works-edit`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={worksValue}
                                items={this.getListWorks()}
                                onChange={this.handleManufacturingWorksChange}
                                multiple={false}
                            />
                            <ErrorLabel content={worksValueError} />
                        </div>
                        <div className={`form-group ${!statusError ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.manufacturing_mill.status')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`select-status-edit`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={status}
                                items={[
                                    { value: "", text: translate('manufacturing.manufacturing_mill.choose_status') },
                                    { value: "1", text: translate('manufacturing.manufacturing_mill.1') },
                                    { value: "0", text: translate('manufacturing.manufacturing_mill.0') }
                                ]}
                                onChange={this.handleStatusChange}
                                multiple={false}
                            />
                            <ErrorLabel content={statusError} />
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.manufacturing_mill.description')}</label>
                            <input type="text" className="form-control" value={description} onChange={this.handleDescriptionChange}></input>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    const { manufacturingWorks, manufacturingMill } = state;
    return { manufacturingWorks, manufacturingMill }
}

const mapDispatchToProps = {
    createManufacturingMill: millActions.createManufacturingMill,
    editManufacturingMill: millActions.editManufacturingMill
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingEditForm));
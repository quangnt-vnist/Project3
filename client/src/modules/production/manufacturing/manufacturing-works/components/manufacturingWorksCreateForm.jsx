import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';
import { generateCode } from '../../../../../helpers/generateCode';
import { worksActions } from '../redux/actions';

class ManufacturingWorksCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: generateCode("NMSX"),
            name: "",
            worksManagerValue: "",
            foremanValue: "",
            phoneNumber: "",
            address: "",
            status: "",
            description: ""
        }
    }

    handleChangeWorksName = (e) => {
        const { value } = e.target;
        this.setState({
            name: value
        });
        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 6, 255);
        this.setState({ nameError: message })
    }

    getListUsersArr = (role) => {
        const { translate, user } = this.props;
        const { usercompanys } = user;
        let listUsersArr = role === "worksManager"
            ?
            [{ value: "", text: translate('manufacturing.manufacturing_works.choose_worksManager') }]
            :
            [{ value: "", text: translate('manufacturing.manufacturing_works.choose_foreman') }]
        if (usercompanys) {
            usercompanys.map((item) => {
                listUsersArr.push({
                    value: item._id,
                    text: item.name
                });
            });
        }
        return listUsersArr
    }

    handleWorksManagerChange = (value) => {
        let worksManagerValue = value[0];
        this.validateWorksManager(worksManagerValue, true);
    }

    validateWorksManager = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate("manufacturing.manufacturing_works.worksManager_error");
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    worksManagerError: msg,
                    worksManagerValue: value,
                }
            });
        }
        return msg;
    }

    handleForemanChange = (value) => {
        let foremanValue = value[0];
        this.validateForeman(foremanValue, true);
    }

    validateForeman = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate("manufacturing.manufacturing_works.foreman_error");
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    foremanValue: value,
                    foremanError: msg
                }
            });
        }
        return msg;
    }

    handlePhoneNumberChange = (e) => {
        const { value } = e.target;
        this.setState({
            phoneNumber: value
        });
        let { translate } = this.props;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ phoneNumberError: message })
    }

    handleAddressChange = (e) => {
        const { value } = e.target;
        this.setState({
            address: value
        });
        let { translate } = this.props;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ addressError: message })
    }

    handleStatusChange = (value) => {
        let status = value[0];
        this.validateStatus(status, true);
    }

    validateStatus = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "") {
            msg = translate('manufacturing.manufacturing_works.status_error')
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    status: value,
                    statusError: msg
                }
            })
        }
        return msg;
    }

    handleDescriptionChange = (e) => {
        const { value } = e.target;
        this.setState({
            description: value
        })
    }

    isFormValidated = () => {
        const { name, worksManagerValue, foremanValue, status, address, phoneNumber } = this.state;
        let { translate } = this.props;
        if (!ValidationHelper.validateName(translate, name, 6, 255).status
            || !ValidationHelper.validateEmpty(translate, address).status
            || !ValidationHelper.validateEmpty(translate, phoneNumber).status
            || this.validateForeman(foremanValue, false)
            || this.validateWorksManager(worksManagerValue, false)
            || this.validateStatus(status, false)
        ) {
            return false;
        }
        return true;
    }

    save = () => {
        if (this.isFormValidated()) {
            const data = {
                code: this.state.code,
                name: this.state.name,
                worksManager: this.state.worksManagerValue,
                foreman: this.state.foremanValue,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                status: this.state.status,
                description: this.state.description
            }
            this.props.createManufacturingWorks(data);
        }
    }

    handleClickCreate = () => {
        const code = generateCode("NMSX");
        this.setState((state) => ({
            ...state,
            code: code
        }));
    }

    render() {
        const { translate, manufacturingWorks } = this.props;
        const { name, nameError, worksManagerValue, worksManagerError, foremanValue, foremanError,
            phoneNumber, phoneNumberError, address, addressError, status, statusError, description, code
        } = this.state;
        return (
            <React.Fragment>
                <ButtonModal onButtonCallBack={this.handleClickCreate} modalID="modal-create-works" button_name={translate('manufacturing.manufacturing_works.create_works')} title={translate('manufacturing.manufacturing_works.create_works')} />
                <DialogModal
                    modalID="modal-create-works" isLoading={manufacturingWorks.isLoading}
                    formID="form-create-works"
                    title={translate('manufacturing.manufacturing_works.create_works')}
                    msg_success={translate('manufacturing.manufacturing_works.create_successfully')}
                    msg_faile={translate('manufacturing.manufacturing_works.create_failed')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-create-works">
                        <div className="form-group">
                            <label>{translate('manufacturing.manufacturing_works.code')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={code} disabled={true}></input>
                        </div>
                        <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.manufacturing_works.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={name} onChange={this.handleChangeWorksName}></input>
                            <ErrorLabel content={nameError} />
                        </div>
                        <div className={`form-group ${!worksManagerError ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.manufacturing_works.worksManager')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`select-worksManage`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={worksManagerValue}
                                items={this.getListUsersArr("worksManager")}
                                onChange={this.handleWorksManagerChange}
                                multiple={false}
                            />
                            <ErrorLabel content={worksManagerError} />
                        </div>
                        <div className={`form-group ${!foremanError ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.manufacturing_works.foreman')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`select-foreman`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={foremanValue}
                                items={this.getListUsersArr()}
                                onChange={this.handleForemanChange}
                                multiple={false}
                            />
                            <ErrorLabel content={foremanError} />
                        </div>
                        <div className={`form-group ${!phoneNumberError ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.manufacturing_works.phone')}<span className="text-red">*</span></label>
                            <input type="text" value={phoneNumber} className="form-control" onChange={this.handlePhoneNumberChange}></input>
                            <ErrorLabel content={phoneNumberError} />
                        </div>
                        <div className={`form-group ${!addressError ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.manufacturing_works.address')}<span className="text-red">*</span></label>
                            <input type="text" value={address} className="form-control" onChange={this.handleAddressChange}></input>
                            <ErrorLabel content={addressError} />
                        </div>
                        <div className={`form-group ${!statusError ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.manufacturing_works.status')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`select-status`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={status}
                                items={[
                                    { value: "", text: translate('manufacturing.manufacturing_works.choose_status') },
                                    { value: "1", text: translate('manufacturing.manufacturing_works.1') },
                                    { value: "0", text: translate('manufacturing.manufacturing_works.0') }
                                ]}
                                onChange={this.handleStatusChange}
                                multiple={false}
                            />
                            <ErrorLabel content={statusError} />
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.manufacturing_works.description')}</label>
                            <input type="text" value={description} onChange={this.handleDescriptionChange} className="form-control"></input>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    const { user, manufacturingWorks } = state;
    return { user, manufacturingWorks }
}

const mapDispatchToProps = {
    createManufacturingWorks: worksActions.createManufacturingWorks
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingWorksCreateForm));
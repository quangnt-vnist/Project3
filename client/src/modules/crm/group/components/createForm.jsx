import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, ErrorLabel } from '../../../../common-components';
import { CrmGroupActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';

class CreateGroupForm extends Component {
    constructor(props) {
        super(props);
        this.state = { newCustomerGroup: {} }
    }

    /**
     * Hàm xử lý khi mã nhóm khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeGroupCode = (e) => {
        const { newCustomerGroup } = this.state;
        const { value } = e.target;
        const { translate } = this.props;

        this.setState({
            newCustomerGroup: {
                ...newCustomerGroup,
                code: value
            }
        });
        // validate Mã nhóm khách hàng
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ groupCodeError: message });
    }


    /**
     * Hàm xử lý khi tên nhóm khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeGroupName = (e) => {
        const { newCustomerGroup } = this.state;
        const { value } = e.target;
        const { translate } = this.props;

        this.setState({
            newCustomerGroup: {
                ...newCustomerGroup,
                name: value
            }
        });
        // validate tên nhóm khách hàng
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ groupNameError: message });
    }


    /**
     * Hàm xử lý khi mô tả nhóm khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeGroupDescription = (e) => {
        const { newCustomerGroup } = this.state;
        const { value } = e.target;

        this.setState({
            newCustomerGroup: {
                ...newCustomerGroup,
                description: value
            }
        });
    }


    handleChangeGroupPromotion = (e) => {
        const { newCustomerGroup } = this.state;
        const { value } = e.target;

        this.setState({
            newCustomerGroup: {
                ...newCustomerGroup,
                promotion: value
            }
        });
    }

    isFormValidated = () => {
        const { code, name } = this.state.newCustomerGroup;
        const { translate } = this.props;

        if (!ValidationHelper.validateName(translate, code).status
            || !ValidationHelper.validateDescription(translate, name).status)
            return false;
        return true;
    }

    save = () => {
        const { newCustomerGroup } = this.state;
        if (this.isFormValidated()) {
            this.props.createGroup(newCustomerGroup);
        }
    }

    render() {
        const { translate } = this.props;
        const { groups } = this.props.crm;
        const { groupNameError, groupCodeError } = this.state;

        return (
            <React.Fragment>
                <ButtonModal modalID="modal-crm-group-create" button_name={translate('general.add')} title={translate('crm.group.add')} />
                <DialogModal
                    modalID="modal-crm-group-create" isLoading={groups.isLoading}
                    formID="form-crm-group-create"
                    title={translate('crm.group.add')}
                    func={this.save}
                    size={50}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-crm-group-create">
                        {/* Mã nhóm khách hàng */}
                        <div className={`form-group ${!groupCodeError ? "" : "has-error"}`}>
                            <label>{translate('crm.group.code')}<span className="attention"> * </span></label>
                            <input type="text" className="form-control" onChange={this.handleChangeGroupCode} />
                            <ErrorLabel content={groupCodeError} />
                        </div>

                        {/* Tên nhóm khách hàng */}
                        <div className={`form-group ${!groupNameError ? "" : "has-error"}`}>
                            <label>{translate('crm.group.name')}<span className="attention"> * </span></label>
                            <input type="text" className="form-control" onChange={this.handleChangeGroupName} />
                            <ErrorLabel content={groupNameError} />
                        </div>

                        {/* Mô tả nhóm khách hàng */}
                        <div className="form-group">
                            <label>{translate('crm.group.description')}</label>
                            <textarea type="text" className="form-control" onChange={this.handleChangeGroupDescription} />
                        </div>

                        {/* Ưu đãi kèm theo nhóm khách hàng */}
                        <div className="form-group">
                            <label>{translate('crm.group.promotion')}</label>
                            <input type="text" className="form-control" onChange={this.handleChangeGroupPromotion} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
    createGroup: CrmGroupActions.createGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateGroupForm));
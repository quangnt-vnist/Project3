import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';
import { CrmCustomerActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { getStorage } from '../../../../config';
import GeneralTabCreateForm from './generalTabCreateForm';
import FileTabCreateForm from './fileTabCreateForm';
import { convertJsonObjectToFormData } from '../../../../helpers/jsonObjectToFormDataObjectConverter';
class CrmCustomerCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCustomer: {
            },
            currentRole: getStorage('currentRole')
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { auth, user } = props;
        const { newCustomer, currentRole } = state;

        if (!newCustomer.owner && auth.user && user.organizationalUnitsOfUser) {
            let getCurrentUnit = user.organizationalUnitsOfUser.find(item =>
                item.deans[0] === currentRole
                || item.viceDeans[0] === currentRole
                || item.employees[0] === currentRole);

            // Lấy người dùng của đơn vị hiện tại và người dùng của đơn vị con
            if (getCurrentUnit) {
                props.getChildrenOfOrganizationalUnits(getCurrentUnit._id);
            }

            return {
                ...state,
                newCustomer: {
                    owner: [auth.user._id],
                },
            }
        } else {
            return null;
        }
    }

    // async componentDidMount() {
    //     const { auth, user } = this.props;
    //     const { newCustomer, currentRole } = this.state;

    //     if (!newCustomer.owner && auth.user && user.organizationalUnitsOfUser) {
    //         let getCurrentUnit = await user.organizationalUnitsOfUser.find(item =>
    //             item.deans[0] === currentRole
    //             || item.viceDeans[0] === currentRole
    //             || item.employees[0] === currentRole);

    //         // Lấy người dùng của đơn vị hiện tại và người dùng của đơn vị con
    //         if (getCurrentUnit) {
    //             this.props.getChildrenOfOrganizationalUnits(getCurrentUnit._id);
    //         }

    //         this.setState({
    //             newCustomer: {
    //                 owner: [auth.user._id],
    //             },
    //         })
    //     }
    // }

    /**
     * function setState các giá trị lấy từ component con vào state
     * @param {*} name 
     * @param {*} value 
     */
    myCallBack = (name, value) => {
        const { newCustomer } = this.state;
        this.setState({
            newCustomer: {
                ...newCustomer,
                [name]: value,
            }
        })
    }

    /**
     * Hàm kiểm tra validate
     */
    isFormValidated = () => {
        const { code, name, taxNumber } = this.state.newCustomer;
        const { translate } = this.props;

        if (!ValidationHelper.validateName(translate, code).status
            || !ValidationHelper.validateName(translate, name).status
            || !ValidationHelper.validateInvalidCharacter(translate, taxNumber).status)
            return false;
        return true;
    }

    save = () => {
        const { auth } = this.props;
        let { newCustomer } = this.state;
        let formData;
        const getStatus = newCustomer.status;
        const statusHistories = [];
        const getDateTime = new Date();

        // Ghi log thay đổi trạng thái
        if (getStatus && getStatus.length > 0) {
            statusHistories.push({
                oldValue: getStatus[getStatus.length - 1],
                newValue: getStatus[getStatus.length - 1],
                createdAt: getDateTime,
                createdBy: auth.user._id,
            })
        }
        newCustomer = { ...newCustomer, statusHistories }

        // Convert file upload
        formData = convertJsonObjectToFormData(newCustomer);
        if (newCustomer.files) {
            newCustomer.files.forEach(o => {
                formData.append('file', o.fileUpload);
            })
        }

        if (this.isFormValidated) {
            this.props.createCustomer(formData);
        }
    }

    render() {
        const { translate, crm } = this.props;
        const { newCustomer } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-customer-create" isLoading={crm.customers.isLoading}
                    formID="modal-customer-create"
                    title={translate("crm.customer.add")}
                    size={75}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form thêm khách hàng mới */}
                    <div className="nav-tabs-custom">
                        <ul className="nav nav-tabs">
                            <li className="active"><a href="#customer-general" data-toggle="tab" >Thông tin chung</a></li>
                            <li><a href="#customer-fileAttachment" data-toggle="tab">Tài liệu liên quan</a></li>
                        </ul>
                        <div className="tab-content">
                            {/* Tab thông tin chung */}
                            {
                                newCustomer && newCustomer.owner &&
                                <GeneralTabCreateForm
                                    id={"customer-general"}
                                    callBackFromParentCreateForm={this.myCallBack}
                                    newCustomer={newCustomer}
                                />
                            }

                            {/* Tab file liên quan đến khách hàng */}
                            {
                                <FileTabCreateForm
                                    id={'customer-fileAttachment'}
                                    callBackFromParentCreateForm={this.myCallBack}
                                />
                            }
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { crm, auth, user } = state;
    return { crm, auth, user };
}

const mapDispatchToProps = {
    createCustomer: CrmCustomerActions.createCustomer,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomerCreate));
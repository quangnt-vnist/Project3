import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CrmCustomerActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { DialogModal } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';
import { formatFunction } from '../../common/index';
import { getStorage } from '../../../../config';

import GeneralTabEditForm from './generalTabEditForm';
import FileTabEditForm from './fileTabEditForm';
import { convertJsonObjectToFormData } from '../../../../helpers/jsonObjectToFormDataObjectConverter';
import './customer.css';

class CrmCustomerEdit extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
            editingCustomer: {},
            currentRole: getStorage('currentRole')
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { user } = props;
        const { currentRole } = state;

        if (props.customerIdEdit !== state.customerIdEdit) {
            props.getCustomer(props.customerIdEdit); //Gọi service lấy thông tin customer theo id

            if (user.organizationalUnitsOfUser) {
                let getCurrentUnit = user.organizationalUnitsOfUser.find(item =>
                    item.deans[0] === currentRole
                    || item.viceDeans[0] === currentRole
                    || item.employees[0] === currentRole);

                // Lấy người dùng của đơn vị hiện tại và người dùng của đơn vị con
                if (getCurrentUnit) {
                    props.getChildrenOfOrganizationalUnits(getCurrentUnit._id);
                }
            }
            return {
                dataStatus: 1,
                customerIdEdit: props.customerIdEdit,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        let { editingCustomer } = this.state;
        if (this.state.dataStatus === this.DATA_STATUS.QUERYING && !nextProps.crm.customers.isLoading) {
            let customer = nextProps.crm.customers.customerById;
            editingCustomer = {
                owner: customer.owner ? customer.owner.map(o => o._id) : [],
                code: customer.code ? customer.code : '',
                name: customer.name ? customer.name : '',
                customerType: customer.customerType ? parseInt(customer.customerType) : '',
                company: customer.company ? customer.company : '',
                represent: customer.represent ? customer.represent : '',
                gender: customer.gender ? customer.gender : '',
                taxNumber: customer.taxNumber ? customer.taxNumber : '',

                customerSource: customer.customerSource ? customer.customerSource : '',
                companyEstablishmentDate: customer.companyEstablishmentDate ? formatFunction.formatDate(customer.companyEstablishmentDate) : '',
                birthDate: customer.birthDate ? formatFunction.formatDate(customer.birthDate) : '',
                telephoneNumber: customer.telephoneNumber ? customer.telephoneNumber : '',
                mobilephoneNumber: customer.mobilephoneNumber ? customer.mobilephoneNumber : '',
                email: customer.email ? customer.email : '',
                email2: customer.email2 ? customer.email2 : '',

                status: customer.status ? customer.status : '', //.map(o => o._id)
                group: customer.group ? customer.group._id : '',
                address: customer.address ? customer.address : '',
                address2: customer.address2 ? customer.address2 : '',
                location: customer.location ? customer.location : '',
                website: customer.website ? customer.website : '',
                note: customer.note ? customer.note : '',
                linkedIn: customer.linkedIn ? customer.linkedIn : '',

                statusHistories: customer.statusHistories && customer.statusHistories.length > 0 ?
                    customer.statusHistories.map(o => ({
                        createdAt: o.createdAt,
                        oldValue: o.oldValue ? o.oldValue : null,
                        newValue: o.newValue,
                        createdBy: o.createdBy,
                    })) : [],
                files: customer.files,
            }

            this.setState({
                dataStatus: this.DATA_STATUS.AVAILABLE,
                editingCustomer,
            })
            return false;
        }

        if (this.state.dataStatus === this.DATA_STATUS.AVAILABLE) {
            this.setState({
                dataStatus: this.DATA_STATUS.FINISHED,
            });
            return false;
        }
        return true;
    }

    /**
     * function setState các giá trị lấy từ component con vào state
     * @param {*} name 
     * @param {*} value 
     */
    myCallBack = (name, value) => {
        const { editingCustomer } = this.state;
        this.setState({
            editingCustomer: {
                ...editingCustomer,
                [name]: value,
            }
        })
    }

    /**
     * Hàm kiểm tra validate
     */
    isFormValidated = () => {
        const { code, name, taxNumber } = this.state.editingCustomer;
        const { translate } = this.props;

        if (!ValidationHelper.validateName(translate, code).status
            || !ValidationHelper.validateName(translate, name).status
            || !ValidationHelper.validateInvalidCharacter(translate, taxNumber).status)
            return false;
        return true;
    }


    save = () => {
        let { editingCustomer, customerIdEdit } = this.state;
        let formData;
        const { auth } = this.props;
        // lấy danh sách trạng thái khách hàng sau khi edit
        const getStatus = editingCustomer.status;

        //lấy danh sách trạng thái khách hàng trước khi edit (lịch sử cũ)
        let { statusHistories } = editingCustomer;

        const getDateTime = new Date();

        // Lưu lại lịch sủ thay đổi trạng thái
        if (getStatus && getStatus.length > 0 && statusHistories && statusHistories.length > 0) {
            statusHistories = [
                ...statusHistories,
                {
                    oldValue: statusHistories[statusHistories.length - 1].newValue._id,
                    newValue: getStatus[getStatus.length - 1],
                    createdAt: getDateTime,
                    createdBy: auth.user._id,
                }
            ]
        }
        editingCustomer = { ...editingCustomer, statusHistories }

        formData = convertJsonObjectToFormData(editingCustomer);
        if (editingCustomer.files) {
            editingCustomer.files.forEach(o => {
                formData.append('fileAttachment', o.fileUpload)
            })
        }

        if (this.isFormValidated) {
            this.props.editCustomer(customerIdEdit, formData);
        }
    }

    render() {
        const { translate, crm } = this.props;
        const { editingCustomer, customerIdEdit, dataStatus } = this.state;
        console.log('edit', editingCustomer)
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-crm-customer-edit" isLoading={crm.customers.isLoading}
                    formID="form-crm-customer-edit"
                    title={translate("crm.customer.edit")}
                    size={75}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa khách hàng mới */}
                    <div className="nav-tabs-custom">
                        <ul className="nav nav-tabs">
                            <li className="active"><a href="#customer-general-edit-form" data-toggle="tab" >Thông tin chung</a></li>
                            <li><a href="#customer-fileAttachment" data-toggle="tab">Tài liệu liên quan</a></li>
                        </ul>
                        <div className="tab-content">
                            {/* Tab thông tin chung */}
                            {
                                editingCustomer && dataStatus === 3 &&
                                <GeneralTabEditForm
                                    id={"customer-general-edit-form"}
                                    callBackFromParentEditForm={this.myCallBack}
                                    editingCustomer={editingCustomer}
                                    customerIdEdit={customerIdEdit}
                                />
                            }

                            {/* Tab file liên quan đến khách hàng */}
                            {
                                editingCustomer && dataStatus === 3 &&
                                <FileTabEditForm
                                    id={`customer-fileAttachment`}
                                    files={editingCustomer.files}
                                    customerIdEdit={customerIdEdit}
                                    callBackFromParentEditForm={this.myCallBack}
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
    getCustomer: CrmCustomerActions.getCustomer,
    editCustomer: CrmCustomerActions.editCustomer,

    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomerEdit));
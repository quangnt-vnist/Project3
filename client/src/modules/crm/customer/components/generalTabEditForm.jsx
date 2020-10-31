import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectBox, DatePicker, ErrorLabel } from '../../../../common-components';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import ValidationHelper from '../../../../helpers/validationHelper';

class GeneralTabEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    static getDerivedStateFromProps(props, state) {
        const { crm, user } = props;
        let listStatus = [...crm.status.list];
        let { editingCustomer } = props;

        if (props.customerIdEdit != state.customerIdEdit && editingCustomer && listStatus && listStatus.length > 0 && user.usersOfChildrenOrganizationalUnit) {
            //timeline status

            const statusActive = editingCustomer.status.map(o => ({ _id: o._id, name: o.name, active: true }));// mảng gồm các id của trạng thái mà khách hàng có

            statusActive.forEach(x => {
                listStatus = listStatus.filter(y => x._id !== y._id);
            });

            // Lấy thành viên trong đơn vị
            let unitMembers = [];
            if (user.usersOfChildrenOrganizationalUnit) {
                unitMembers = getEmployeeSelectBoxItems(user.usersOfChildrenOrganizationalUnit);
            }

            // Lấy danh sách nhóm khách hàng
            let listGroups;
            if (crm.groups.list && crm.groups.list.length > 0) {
                listGroups = crm.groups.list.map(x => { return { value: x._id, text: x.name } })
                listGroups.unshift({ value: '', text: '---Chọn---' });
            }


            return {
                ...state,
                id: props.id,
                customerIdEdit: props.customerIdEdit,
                listStatus: [...statusActive, ...listStatus],
                ...editingCustomer,
                unitMembers,
                listGroups
            }
        } else {
            return null;
        }
    }

    /**
     * Hàm xử lý khi người sở hữu/quản lý thay đổi
     * @param {*} value 
     */
    handleChangeCustomerOwner = (value) => {
        const { callBackFromParentEditForm } = this.props;

        this.setState({
            owner: value,
        });
        callBackFromParentEditForm('owner', value);
    }


    /**
     * Hàm xử lý khi nguồn khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeCustomerSource = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            customerSource: value,
        });
        callBackFromParentEditForm('customerSource', value);
    }


    /**
     * Hàm xử lý khi mã khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeCustomerCode = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;
        const { translate } = this.props;

        this.setState({
            code: value,
        });

        // validate mã khách hàng
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ customerCodeError: message });

        callBackFromParentEditForm('code', value);
    }


    /**
     * Hàm xử lý khi tên khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeCustomerName = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;
        const { translate } = this.props;

        this.setState({
            name: value,
        });

        // validate tên khách hàng
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ customerNameError: message });

        callBackFromParentEditForm('name', value);
    }

    /**
     * Hàm xử lý khi loại khách hàng thay đổi
     * @param {*} value 
     */
    handleChangeCustomerType = (value) => {
        const { callBackFromParentEditForm } = this.props;

        this.setState({
            customerType: value[0],
        })

        callBackFromParentEditForm('customerType', parseInt(value[0]));
    }


    /**
     * Hàm xử lý khi tên công ty của khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeCustomerCompany = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            company: value,
        });
        callBackFromParentEditForm('company', value);
    }


    /**
     * Hàm xử lý khi người tại diện thay đổi
     * @param {*} e 
     */
    handleChangeRepresent = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            represent: value,
        });
        callBackFromParentEditForm('represent', value);
    }


    /**
     * Hàm xử lý khi Ngày thành lập công ty thay đổi
     * @param {*} value 
     */
    handleChangeCompanyEstablishmentDate = (value) => {
        const { callBackFromParentEditForm } = this.props;

        this.setState({
            companyEstablishmentDate: value,
        });
        callBackFromParentEditForm('companyEstablishmentDate', value);
    }


    /**
     * Hàm xử lý khi số điện thoại di động thay đổi
     * @param {*} e 
     */
    handleChangeMobilephoneNumber = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            mobilephoneNumber: parseInt(value),
        });
        callBackFromParentEditForm('mobilephoneNumber', parseInt(value));
    }

    /**
     * Hàm xử lý khi số điện thoại khách hàng bàn thay đổi
     * @param {*} e 
     */
    handleChangeTelephoneNumber = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            telephoneNumber: parseInt(value),
        });
        callBackFromParentEditForm('telephoneNumber', parseInt(value));
    }

    /**
     * Hàm xử lý khi địa chỉ email khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeCustomerEmail = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            email: value,
        });
        callBackFromParentEditForm('email', value);
    }


    /**
     * Hàm xử lý khi địa chỉ email phụ khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeCustomerEmail2 = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            email2: value,
        });
        callBackFromParentEditForm('email2', value);
    }


    /**
     * Hàm xử lý khi địa chỉ khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeCustomerAddress = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            address: value,
        });
        callBackFromParentEditForm('address', value);
    }


    /**
     * Hàm xử lý khi địa chỉ phụ khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeCustomerAddress2 = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            address2: value,
        });
        callBackFromParentEditForm('address2', value);
    }


    /**
     * Hàm xử lý khi giới tính khách hàng thay đổi
     * @param {*} value 
     */
    handleChangeCustomerGender = (value) => {
        const { callBackFromParentEditForm } = this.props;

        this.setState({
            gender: value[0],
        });
        callBackFromParentEditForm('gender', parseInt(value[0]));
    }

    /**
     * Hàm xử lý khi ngày sinh nhật khách hàng thay đổi
     * @param {*} value 
     */
    handleChangeCustomerBirth = (value) => {
        const { callBackFromParentEditForm } = this.props;

        this.setState({
            birthDate: value,
        });
        callBackFromParentEditForm('birthDate', value);
    }


    /**
     * Hàm xử lý khi nhóm khách hàng thay đổi
     * @param {*} value 
     */
    handleChangeCustomerGroup = (value) => {
        const { callBackFromParentEditForm } = this.props;

        this.setState({
            group: value[0],
        });
        callBackFromParentEditForm('group', value[0]);
    }


    /**
     * Hàm xử lý khi trạng thái khách hàng thay đổi
     * @param {*} index 
     */
    handleChangeCustomerStatus = (index) => {
        const { callBackFromParentEditForm } = this.props;
        let { listStatus } = this.state;
        let getStatusActive = [];

        listStatus.map((o, i) => {
            if (i <= index) {
                o.active = true;
            } else {
                o.active = false;
            }
            return o;
        });

        // lấy trạng thái khách hàng lưu vào db
        listStatus.forEach(o => {
            if (o.active) {
                getStatusActive.push(o._id);
            }
        })

        this.setState({
            listStatus: listStatus,
        });
        callBackFromParentEditForm('status', getStatusActive);
    }

    /**
     * Hàm xử lý khi khu vực khách hàng thay đổi
     * @param {*} value 
     */
    handleChangeCustomerLocation = (value) => {
        const { callBackFromParentEditForm } = this.props;

        this.setState({
            location: value[0],
        });
        callBackFromParentEditForm('location', parseInt(value[0]));
    }


    /**
     * Hàm xử lý khi mã số thuế khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeTaxNumber = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;
        const { translate } = this.props;

        this.setState({
            taxNumber: value,
        });

        // validate mã số thuế khách hàng
        let { message } = ValidationHelper.validateInvalidCharacter(translate, value);
        this.setState({ customerTaxNumberError: message });

        callBackFromParentEditForm('taxNumber', value);
    }


    /**
     * Hàm xử lý khi địa chỉ website khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeWebsite = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            website: value,
        });
        callBackFromParentEditForm('website', value);
    }


    /**
     * Hàm xử lý khi địa chỉ ghi chú khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeNote = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            note: value,
        });
        callBackFromParentEditForm('note', value);
    }


    /**
     * Hàm xử lý khi địa chỉ linkedIn khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeLinkedIn = (e) => {
        const { callBackFromParentEditForm } = this.props;
        const { value } = e.target;

        this.setState({
            linkedIn: value,
        });
        callBackFromParentEditForm('linkedIn', value);
    }

    render() {
        const { translate } = this.props;
        const { id } = this.props;

        const { owner, code, name, customerType, company, represent, group, listStatus, gender, location,
            taxNumber, customerSource, companyEstablishmentDate, birthDate, telephoneNumber, mobilephoneNumber,
            email, email2, address, address2, website, note, linkedIn, unitMembers, listGroups } = this.state;

        //message error
        const { customerCodeError, customerNameError, customerTaxNumberError } = this.state;
        let progressBarWidth;

        // Lấy danh sách trạng thái khách hàng
        if (listStatus) {
            const totalItem = listStatus.length;
            const numberOfActiveItems = listStatus.filter(o => o.active).length;
            progressBarWidth = totalItem > 1 && numberOfActiveItems > 0 ? ((numberOfActiveItems - 1) / (totalItem - 1)) * 100 : 0;
        }


        return (
            <React.Fragment>
                <div id={id} className="tab-pane active">
                    {/* timeline trạng thái khách hàng */}
                    <div className="row">
                        <div className="col-md-12">
                            <label>{translate('crm.customer.status')}<span className="text-red">*</span></label>
                            <div className="timeline">
                                <div className="timeline-crm-progress" style={{ width: `${progressBarWidth}%` }}></div>
                                <div className="timeline-items">
                                    {
                                        listStatus && listStatus.length > 0 &&
                                        listStatus.map((o, index) => (
                                            <div key={index} className={`timeline-item ${o.active ? 'active' : ''}`} onClick={() => this.handleChangeCustomerStatus(index)}>
                                                <div className="timeline-contain">{o.name}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Người quản lý khách hàng*/}
                        <div className="col-md-6">
                            <div className={`form-group`} >
                                <label className="control-label">{translate('crm.customer.owner')}<span className="text-red">*</span></label>
                                {unitMembers &&
                                    <SelectBox
                                        id={`customer-ownwe-edit-form`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={unitMembers}
                                        value={owner}
                                        onChange={this.handleChangeCustomerOwner}
                                        multiple={true}
                                    />
                                }
                            </div>
                        </div>

                        {/* nguồn lấy được khách hàng */}
                        <div className="col-md-6">
                            <div className={`form-group`} >
                                <label className="control-label">{translate('crm.customer.source')}</label>
                                <input type="Name" className="form-control" value={customerSource ? customerSource : ''} onChange={this.handleChangeCustomerSource} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Mã khách hàng */}
                        <div className="col-md-6">
                            <div className={`form-group ${!customerCodeError ? "" : "has-error"}`}>
                                <label>{translate('crm.customer.code')}<span className="text-red">*</span></label>
                                <input type="Name" className="form-control" value={code ? code : ''} onChange={this.handleChangeCustomerCode} />
                                <ErrorLabel content={customerCodeError} />
                            </div>
                        </div>

                        {/* Tên khách hàng */}
                        <div className="col-md-6">
                            <div className={`form-group ${!customerNameError ? "" : "has-error"}`}>
                                <label>{translate('crm.customer.name')}<span className="text-red">*</span></label>
                                <input type="Name" className="form-control" value={name ? name : ''} onChange={this.handleChangeCustomerName} />
                                <ErrorLabel content={customerNameError} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Loại khách hàng */}
                        <div className="col-md-6">
                            <div className={`form-group`} >
                                <label className="control-label">{translate('crm.customer.customerType')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`customerType-edit-form`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        { value: '', text: '---Chọn---' },
                                        { value: 1, text: 'Cá nhân' },
                                        { value: 2, text: 'Công ty' },
                                    ]}
                                    value={customerType ? customerType : ''}
                                    onChange={this.handleChangeCustomerType}
                                    multiple={false}
                                />
                            </div>
                        </div>

                        {/* Nhóm khách hàng */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.group')}</label>
                                {
                                    listGroups &&
                                    <SelectBox
                                        id={`customer-group-edit-form`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            listGroups
                                        }
                                        value={group}
                                        onChange={this.handleChangeCustomerGroup}
                                        multiple={false}
                                    />
                                }
                            </div>
                        </div>
                        {/* Tên công ty */}
                        {/* <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.company')} </label>
                                <input type="text" className="form-control" value={company ? company : ''} onChange={this.handleChangeCustomerCompany} />
                            </div>
                        </div> */}
                    </div>

                    <div className="row">
                        {/* Người đại diện */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>Người đại diện</label>
                                <input type="Name" className="form-control" value={represent ? represent : ''} onChange={this.handleChangeRepresent} />
                                <ErrorLabel content={customerNameError} />
                            </div>
                        </div>

                        {/* Số điện thoại di động*/}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.mobilephoneNumber')} </label>
                                <input type="text" className="form-control" value={mobilephoneNumber ? mobilephoneNumber : ''} onChange={this.handleChangeMobilephoneNumber} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Địa chỉ email*/}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.email')} </label>
                                <input type="email" className="form-control" value={email ? email : ''} onChange={this.handleChangeCustomerEmail} />
                            </div>
                        </div>

                        {/* Địa chỉ 1 */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.address')}</label>
                                <input type="text" className="form-control" value={address ? address : ''} onChange={this.handleChangeCustomerAddress} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Giới tính */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.gender')}</label>
                                <SelectBox
                                    id={`customer-gender-edit-form`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        [
                                            { value: '', text: '---Chọn---' },
                                            { value: 1, text: 'Nam' },
                                            { value: 2, text: 'Nữ' },
                                        ]
                                    }
                                    value={gender}
                                    onChange={this.handleChangeCustomerGender}
                                    multiple={false}
                                />
                            </div>
                        </div>

                        {/* Ngày sinh*/}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.birth')}</label>
                                <DatePicker
                                    id="birth-date-edit-form"
                                    value={birthDate ? birthDate : ''}
                                    onChange={this.handleChangeCustomerBirth}
                                    disabled={false}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Ngày thành lập công ty */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.companyEstablishmentDate')}</label>
                                <DatePicker
                                    id="companyEstablishmentDate-edit-form"
                                    value={companyEstablishmentDate ? companyEstablishmentDate : ''}
                                    onChange={this.handleChangeCompanyEstablishmentDate}
                                    disabled={false}
                                />
                            </div>
                        </div>
                        {/* Mã số thuế */}
                        <div className="col-md-6">
                            <div className={`form-group ${!customerTaxNumberError ? "" : "has-error"}`}>
                                <label>{translate('crm.customer.taxNumber')}</label>
                                <input type="text" className="form-control" value={taxNumber ? taxNumber : ''} onChange={this.handleChangeTaxNumber} />
                                <ErrorLabel content={customerTaxNumberError} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Địa chỉ 2 */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.address2')} </label>
                                <input type="text" className="form-control" value={address2 ? address2 : ''} onChange={this.handleChangeCustomerAddress2} />
                            </div>
                        </div>

                        {/* Số điện thoại cố định */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.telephoneNumber')}</label>
                                <input type="text" className="form-control" value={telephoneNumber ? telephoneNumber : ''} onChange={this.handleChangeTelephoneNumber} />
                            </div>
                        </div>

                        {/* Địa chỉ email phu*/}
                        {/* <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.secondaryEmail')}</label>
                                <input type="email" className="form-control" value={email2 ? email2 : ''} onChange={this.handleChangeCustomerEmail2} />
                            </div>
                        </div> */}
                    </div>

                    <div className="row">
                        {/* location */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.location')}  </label>
                                <SelectBox
                                    id={`customer-location-edit-form`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        [
                                            { value: '', text: '---Chọn---' },
                                            { value: 1, text: 'Bắc' },
                                            { value: 2, text: 'Trung ' },
                                            { value: 3, text: 'Nam ' },
                                        ]
                                    }
                                    value={location}
                                    onChange={this.handleChangeCustomerLocation}
                                    multiple={false}
                                />
                            </div>
                        </div>

                        {/* Website  */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.website')}</label>
                                <input type="text" className="form-control" value={website ? website : ''} onChange={this.handleChangeWebsite} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Ghi chú */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.note')}</label>
                                <textarea type="text" value={note ? note : ''} className="form-control" onChange={this.handleChangeNote} />
                            </div>
                        </div>

                        {/* LinkedIn */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.linkedIn')}</label>
                                <input type="text" className="form-control" value={linkedIn ? linkedIn : ''} onChange={this.handleChangeLinkedIn} />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { crm, user } = state;
    return { crm, user };
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GeneralTabEditForm));
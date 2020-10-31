import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectBox, DatePicker, ErrorLabel } from '../../../../common-components';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import ValidationHelper from '../../../../helpers/validationHelper';
import './customer.css';

class GeneralTabCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    static getDerivedStateFromProps(props, state) {
        const { crm, user } = props;
        if (props.id != state.id && crm.status.list && crm.status.list.length > 0 && user.usersOfChildrenOrganizationalUnit) {

            // Lấy danh sách người trong phòng ban hiện tại và con
            let unitMembers;
            if (user.usersOfChildrenOrganizationalUnit) {
                unitMembers = getEmployeeSelectBoxItems(user.usersOfChildrenOrganizationalUnit);
            }

            // Lấy danh sách nhóm khách hàng
            let listGroups;
            if (crm.groups.list && crm.groups.list.length > 0) {
                listGroups = crm.groups.list.map(o => ({ value: o._id, text: o.name }))
                listGroups.unshift({ value: '', text: '---Chọn---' });
            }

            return {
                ...state,
                id: props.id,
                owner: props.newCustomer.owner,
                unitMembers,
                listGroups,
                listStatus: crm.status.list.map(o => ({ _id: o._id, name: o.name, active: o.active }))
            }
        } else {
            return null;
        }
    }

    /**
     * Hàm xử lý khi người sở hữu/quản lý thay đổi
     * @param {*} value giá trị mới
     */
    handleChangeCustomerOwner = (value) => {
        const { callBackFromParentCreateForm } = this.props;

        this.setState({
            owner: value,
        });
        callBackFromParentCreateForm('owner', value); // Truyền giá trị về form cha
    }

    /**
     * Hàm xử lý khi nguồn khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeCustomerSource = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            customerSource: value,
        })
        callBackFromParentCreateForm('customerSource', value)
    }


    /**
     * Hàm xử lý khi mã khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeCustomerCode = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;
        const { translate } = this.props;

        this.setState({
            code: value,
        })

        // validate mã khách hàng
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ customerCodeError: message });

        callBackFromParentCreateForm('code', value)
    }


    /**
     * Hàm xử lý khi tên khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeCustomerName = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;
        const { translate } = this.props;

        this.setState({
            name: value,
        })

        // validate tên khách hàng
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ customerNameError: message });

        callBackFromParentCreateForm('name', value)
    }


    /**
     * Hàm xử lý khi loại khách hàng thay đổi
     * @param {*} value 
     */
    handleChangeCustomerType = (value) => {
        const { callBackFromParentCreateForm } = this.props;
        this.setState({
            customerType: value[0],
        })

        callBackFromParentCreateForm('customerType', parseInt(value[0]))
    }


    /**
     * Hàm xử lý khi tên công ty của khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeCompanyName = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            company: value,
        })
        callBackFromParentCreateForm('company', value)
    }


    /**
     * Hàm xử lý khi người tại diện thay đổi
     * @param {*} e 
     */
    handleChangeRepresent = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            represent: value,
        })
        callBackFromParentCreateForm('represent', value)
    }


    /**
     * Hàm xử lý khi Ngày thành lập công ty thay đổi
     * @param {*} value 
     */
    handleChangeCompanyEstablishmentDate = (value) => {
        const { callBackFromParentCreateForm } = this.props;

        this.setState({
            companyEstablishmentDate: value,
        })
        callBackFromParentCreateForm('companyEstablishmentDate', value)
    }


    /**
     * Hàm xử lý khi số điện thoại di động thay đổi
     * @param {*} e 
     */
    handleChangeMobilephoneNumber = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            mobilephoneNumber: parseInt(value),
        })
        callBackFromParentCreateForm('mobilephoneNumber', parseInt(value))
    }


    /**
     * Hàm xử lý khi số điện thoại khách hàng bàn thay đổi
     * @param {*} e 
     */
    handleChangeTelephoneNumber = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            telephoneNumber: parseInt(value),
        })
        callBackFromParentCreateForm('telephoneNumber', parseInt(value))
    }


    /**
     * Hàm xử lý khi địa chỉ email khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeCustomerEmail = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            email: value,
        })
        callBackFromParentCreateForm('email', value)
    }


    /**
     * Hàm xử lý khi địa chỉ email phụ khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeCustomerEmail2 = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            email2: value,
        })
        callBackFromParentCreateForm('email2', value)
    }


    /**
     * Hàm xử lý khi địa chỉ khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeCustomerAddress = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            address: value,
        })
        callBackFromParentCreateForm('address', value)
    }


    /**
     * Hàm xử lý khi địa chỉ phụ khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeCustomerAddress2 = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            address2: value,
        })
        callBackFromParentCreateForm('address2', value)
    }


    /**
     * Hàm xử lý khi giới tính khách hàng thay đổi
     * @param {*} value 
     */
    handleChangeCustomerGender = (value) => {
        const { callBackFromParentCreateForm } = this.props;

        this.setState({
            gender: value[0],
        })
        callBackFromParentCreateForm('gender', parseInt(value[0]))
    }


    /**
     * Hàm xử lý khi ngày sinh nhật khách hàng thay đổi
     * @param {*} value 
     */
    handleChangeCustomerBirth = (value) => {
        const { callBackFromParentCreateForm } = this.props;

        this.setState({
            birthDate: value,
        })
        callBackFromParentCreateForm('birthDate', value)
    }


    /**
     * Hàm xử lý khi nhóm khách hàng thay đổi
     * @param {*} value 
     */
    handleChangeCustomerGroup = (value) => {
        const { callBackFromParentCreateForm } = this.props;
        this.setState({
            group: value[0],
        })
        callBackFromParentCreateForm('group', value[0])
    }


    /**
     * Hàm xử lý khi trạng thái khách hàng thay đổi
     * @param {*} index 
     */
    handleChangeCustomerStatus = (index) => {
        const { listStatus } = this.state;
        const { callBackFromParentCreateForm } = this.props;
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
        })
        callBackFromParentCreateForm('status', getStatusActive)
    }


    /**
     * Hàm xử lý khi khu vực khách hàng thay đổi
     * @param {*} value 
     */
    handleChangeCustomerLocation = (value) => {
        const { callBackFromParentCreateForm } = this.props;

        this.setState({
            location: value[0],
        })
        callBackFromParentCreateForm('location', parseInt(value[0]))
    }


    /**
     * Hàm xử lý khi mã số thuế khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeTaxNumber = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;
        const { translate } = this.props;

        this.setState({
            taxNumber: value,
        })

        // validate mã số thuế khách hàng
        let { message } = ValidationHelper.validateInvalidCharacter(translate, value);
        this.setState({ customerTaxNumberError: message });

        callBackFromParentCreateForm('taxNumber', value)
    }


    /**
     * Hàm xử lý khi địa chỉ website khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeCustomerWebsite = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            website: value,
        })
        callBackFromParentCreateForm('website', value)
    }


    /**
     * Hàm xử lý khi địa chỉ ghi chú khách hàng thay đổi
     * @param {*} e
     */
    handleChangeCustomerNote = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            note: value,
        })
        callBackFromParentCreateForm('note', value)
    }

    /**
     * Hàm xử lý khi địa chỉ linkedIn khách hàng thay đổi
     * @param {*} e
     */
    handleChangeCustomerLinkedIn = (e) => {
        const { callBackFromParentCreateForm } = this.props;
        const { value } = e.target;

        this.setState({
            linkedIn: value,
        })
        callBackFromParentCreateForm('linkedIn', value)
    }

    render() {
        const { translate } = this.props; // state redux
        const { id } = this.props; // Lấy giá trị từ component cha

        const {
            listStatus,
            owner,
            customerSource,
            code,
            name,
            company,
            represent,
            customerType,
            companyEstablishmentDate,
            mobilephoneNumber,
            telephoneNumber,
            email,
            email2,
            address,
            address2,
            gender,
            birth,
            group,
            location,
            taxNumber,
            website,
            linkedIn,
            unitMembers,
            listGroups,
        } = this.state;

        const { customerNameError, customerCodeError, customerTaxNumberError, } = this.state;
        let progressBarWidth;

        // setting timeline customer status
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
                                {
                                    unitMembers &&
                                    <SelectBox
                                        id={`customer-owner`}
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
                                <input type="text" className="form-control" value={customerSource ? customerSource : ''} onChange={this.handleChangeCustomerSource} placeholder="Facebook,...." />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Mã khách hàng */}
                        <div className="col-md-6">
                            <div className={`form-group ${!customerCodeError ? "" : "has-error"}`}>
                                <label>{translate('crm.customer.code')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" value={code ? code : ''} onChange={this.handleChangeCustomerCode} placeholder={translate('crm.customer.code')} />
                                <ErrorLabel content={customerCodeError} />
                            </div>
                        </div>

                        {/* Tên khách hàng */}
                        <div className="col-md-6">
                            <div className={`form-group ${!customerNameError ? "" : "has-error"}`}>
                                <label>{translate('crm.customer.name')}<span className="text-red">*</span></label>
                                <input type="Name" className="form-control" value={name ? name : ''} onChange={this.handleChangeCustomerName} placeholder={translate('crm.customer.name')} />
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
                                    id={`customerType`}
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
                                {listGroups && <SelectBox
                                    id={`customer-group`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        listGroups
                                    }
                                    value={group ? group : ''}
                                    onChange={this.handleChangeCustomerGroup}
                                    multiple={false}
                                />}
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Người đại diện */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>Người đại diện</label>
                                <input type="Name" className="form-control" value={represent ? represent : ''} onChange={this.handleChangeRepresent} placeholder={'Người đại diện'} />
                                <ErrorLabel content={customerNameError} />
                            </div>
                        </div>

                        {/* Số điện thoại di động*/}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.mobilephoneNumber')} </label>
                                <input type="number" className="form-control" value={mobilephoneNumber ? mobilephoneNumber : ''} onChange={this.handleChangeMobilephoneNumber} placeholder={translate('crm.customer.mobilephoneNumber')} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Địa chỉ email*/}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.email')} </label>
                                <input type="email" className="form-control" value={email ? email : ''} onChange={this.handleChangeCustomerEmail} placeholder={translate('crm.customer.email')} />
                            </div>
                        </div>

                        {/* Địa chỉ 1*/}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.address')}</label>
                                <input type="text" className="form-control" value={address ? address : ''} onChange={this.handleChangeCustomerAddress} placeholder={translate('crm.customer.address')} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Tên công ty */}
                        {/* <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.company')}</label>
                                <input type="Name" className="form-control" value={company ? company : ''} onChange={this.handleChangeCompanyName} placeholder={translate('crm.customer.company')} />
                            </div>
                        </div> */}

                        {/* Giới tính */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.gender')}</label>
                                <SelectBox
                                    id={`customer-gender`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        [
                                            { value: '', text: '---Chọn---' },
                                            { value: 1, text: 'Nam' },
                                            { value: 2, text: 'Nữ' },
                                        ]
                                    }
                                    value={gender ? gender : ''}
                                    onChange={this.handleChangeCustomerGender}
                                    multiple={false}
                                />
                            </div>
                        </div>

                        {/* ngày sinh */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.birth')}</label>
                                <DatePicker
                                    id="birth-form-create"
                                    value={birth ? birth : ''}
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
                                    id="start-date-form-create"
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
                                <input type="text" className="form-control" value={taxNumber ? taxNumber : ''} onChange={this.handleChangeTaxNumber} placeholder={translate('crm.customer.taxNumber')} />
                                <ErrorLabel content={customerTaxNumberError} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Địa chỉ 2 */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.address2')}</label>
                                <input type="text" className="form-control" value={address2 ? address2 : ''} onChange={this.handleChangeCustomerAddress2} placeholder={translate('crm.customer.address2')} />
                            </div>
                        </div>

                        {/* Số điện thoại cố định */}
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('crm.customer.telephoneNumber')} </label>
                                <input type="number" className="form-control" value={telephoneNumber ? telephoneNumber : ''} onChange={this.handleChangeTelephoneNumber} placeholder={translate('crm.customer.telephoneNumber')} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* location */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.location')} </label>
                                <SelectBox
                                    id={`customer-location`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        [
                                            { value: '', text: 'Chọn' },
                                            { value: 1, text: 'Bắc' },
                                            { value: 2, text: 'Trung ' },
                                            { value: 3, text: 'Nam ' },
                                        ]
                                    }
                                    value={location ? location : ''}
                                    onChange={this.handleChangeCustomerLocation}
                                    multiple={false}
                                />
                            </div>
                        </div>

                        {/* website */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.website')}</label>
                                <input type="text" className="form-control" value={website ? website : ''} onChange={this.handleChangeCustomerWebsite} placeholder={translate('crm.customer.website')} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Ghi chú */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.note')}</label>
                                <textarea type="text" className="form-control" onChange={this.handleChangeCustomerNote} />
                            </div>
                        </div>

                        {/* linkedIn */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('crm.customer.linkedIn')}</label>
                                <input type="text" className="form-control" value={linkedIn ? linkedIn : ''} onChange={this.handleChangeCustomerLinkedIn} placeholder={translate('crm.customer.linkedIn')} />
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

export default connect(mapStateToProps, null)(withTranslate(GeneralTabCreateForm));

// {/* Địa chỉ email phu*/ }
// <div className="col-md-6">
//     <div className={`form-group`}>
//         <label>{translate('crm.customer.secondaryEmail')}</label>
//         <input type="email" className="form-control" value={email2 ? email2 : ''} onChange={this.handleChangeCustomerEmail2} placeholder={translate('crm.customer.secondaryEmail')} />
//     </div>
// </div>
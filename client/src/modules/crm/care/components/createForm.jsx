import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { ButtonModal, DatePicker, DialogModal, SelectBox, TextEditor } from '../../../../common-components';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { CrmCareTypeActions } from '../../careType/redux/action';
import { CrmCareActions } from '../redux/action';


class CreateCareForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCare: {},
            role: localStorage.getItem('currentRole'),
        }
    }

    /**
     * Hàm xử lý khi người chăm sóc khách hàng thay đổi
     * @param {*} value 
     */
    handleChangeCaregiver = (value) => {
        const { newCare } = this.state;

        this.setState({
            newCare: {
                ...newCare,
                caregiver: value,
            }
        })
    }

    /**
     * Hàm xử lý khi khách hàng được chăm sóc thay đổi
     * @param {*} value 
     */
    handleChangeCustomer = (value) => {
        const { newCare } = this.state;

        this.setState({
            newCare: {
                ...newCare,
                customer: value,
            }
        })
    }

    /**
     * Hàm xử lý khi tên công việc chăm sóc khách hàng thay đổi
     * @param {*} e 
     */
    handleChangeName = (e) => {
        const { newCare } = this.state;
        const { value } = e.target;

        this.setState({
            newCare: {
                ...newCare,
                name: value,
            }
        })
    }

    /**
     * Hàm xử lý khi mô tả công việc chăm sóc khách  hàng thay đổi
     * @param {*} e 
     * @param {*} editor 
     */
    handleChangeDescription = (e, editor) => {
        const { newCare } = this.state;
        const description = editor.getData();

        this.setState({
            newCare: {
                ...newCare,
                description,
            }
        })
    }

    /**
     * Hàm xử lý khi hình thức chăm sóc thay đổi
     * @param {*} value 
     */
    handleChangeCareType = (value) => {
        const { newCare } = this.state;

        this.setState({
            newCare: {
                ...newCare,
                careType: value,
            }
        })
    }


    /**
     * Hàm xử lý khi trạng thái công việc chăm sóc thay đổi
     * @param {*} value 
     */
    handleChangeStatus = value => {
        const { newCare } = this.state;

        this.setState({
            newCare: {
                ...newCare,
                status: value[0],
            }
        })
    }

    /**
     * Hàm xử lý khi ngày bắt đầu thực hiện công việc thay đổi
     * @param {*} value 
     */
    handleChangeStartDate = value => {
        const { newCare } = this.state;

        this.setState({
            newCare: {
                ...newCare,
                startDate: value,
            }
        })
    }


    /**
     * Hàm xử lý khi ngày kết thúc công việc thay đổi
     * @param {*} value 
     */
    handleChangeEndDate = value => {
        const { newCare } = this.state;

        this.setState({
            newCare: {
                ...newCare,
                endDate: value,
            }
        })
    }

    componentDidMount() {
        const { role } = this.state;
        this.props.getAllEmployeeOfUnitByRole(role);
        this.props.getCareTypes();
    }

    save = () => {
        const { newCare } = this.state;
        this.props.createCare(newCare);
    }

    render() {
        const { translate, user, crm } = this.props;
        const { careTypes, customers } = crm;
        let { newCare } = this.state;

        // Lấy nhân viên trong đơn vị hiện tại
        let employees;
        if (user.employees) {
            employees = user.employees.map(o => (
                { value: o.userId._id, text: o.userId.name }
            ))
        }

        let listCareTypes;
        // Lấy hình thức chắm sóc khách hàng
        if (careTypes) {
            listCareTypes = careTypes.list.map(o => (
                { value: o._id, text: o.name }
            ))
        }

        let listCustomers;
        if (customers) {
            listCustomers = customers.list.map(o => (
                { value: o._id, text: o.name }
            ))
        }
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-crm-care-create" button_name={translate('general.add')} title={translate('crm.care.add')} />
                <DialogModal
                    modalID="modal-crm-care-create"
                    formID="form-crm-care-create"
                    title={translate('crm.care.add')}
                    func={this.save}
                    size={75}
                // disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-crm-care-create">
                        {/* Nhân viên phụ trách */}
                        <div className={`form-group`}>
                            <label>{translate('crm.care.caregiver')}</label>
                            {
                                employees &&
                                <SelectBox
                                    id={`caregiver-care`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        employees
                                    }
                                    value={newCare.caregiver ? newCare.caregiver : []}
                                    onChange={this.handleChangeCaregiver}
                                    multiple={true}
                                    options={{ placeholder: translate('crm.care.caregiver') }}
                                />
                            }
                            {/* <ErrorLabel content={groupCodeError} /> */}
                        </div>

                        {/* Khách hàng được chăm sóc */}
                        <div className={`form-group`}>
                            <label>{translate('crm.care.customer')}</label>
                            {
                                listCustomers &&
                                <SelectBox
                                    id={`customer-care`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        listCustomers
                                    }
                                    value={newCare.customer ? newCare.customer : []}
                                    onChange={this.handleChangeCustomer}
                                    multiple={true}
                                    options={{ placeholder: translate('crm.care.customer') }}
                                />
                            }
                            {/* <ErrorLabel content={groupCodeError} /> */}
                        </div>

                        {/* Tên công việc */}
                        <div className={`form-group`}>
                            <label>{translate('crm.care.name')}</label>
                            <input type="text" className="form-control" onChange={this.handleChangeName} />
                            {/* <ErrorLabel content={groupNameError} /> */}
                        </div>

                        {/* Mô tả công việc chăm sóc */}
                        <div className="form-group">
                            <label>{translate('crm.care.description')}</label>
                            <TextEditor
                                onChange={this.handleChangeDescription}
                                data={newCare.description ? newCare.description : ""}
                            />
                        </div>

                        {/* Loại hình chăm sóc khách hàng */}
                        <div className="form-group">
                            <label>{translate('crm.care.careType')}</label>
                            {
                                careTypes &&
                                <SelectBox
                                    id={`customer-careType`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        listCareTypes
                                    }
                                    value={newCare.careType ? newCare.careType : []}
                                    onChange={this.handleChangeCareType}
                                    multiple={true}
                                    options={{ placeholder: translate('crm.care.careType') }}
                                />
                            }
                        </div>
                        {/* Trạng thái công việc */}
                        <div className="form-group">
                            <label>{translate('crm.care.status')}</label>
                            <SelectBox
                                id={`status-care`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    [
                                        { value: '', text: '---Chọn---' },
                                        { value: 1, text: 'Chưa thưc hiện' },
                                        { value: 2, text: 'Đang thực hiện' },
                                        { value: 3, text: 'Đang trì hoãn' },
                                        { value: 4, text: 'Đã hoàn thành' },
                                    ]
                                }
                                value={newCare.status ? newCare.status : ''}
                                onChange={this.handleChangeStatus}
                                multiple={false}
                            />
                        </div>

                        {/* Thời gian thực hiện */}
                        <div className="form-group">
                            <label>{translate('crm.care.startDate')}</label>
                            <DatePicker
                                id="startDate-form-care"
                                value={newCare.startDate ? newCare.startDate : ''}
                                onChange={this.handleChangeStartDate}
                                disabled={false}
                            />
                        </div>

                        {/* Thời gian kết thúc */}
                        <div className="form-group">
                            <label>{translate('crm.care.endDate')}</label>
                            <DatePicker
                                id="endDate-form-care"
                                value={newCare.endDate ? newCare.endDate : ''}
                                onChange={this.handleChangeEndDate}
                                disabled={false}
                            />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { crm, user } = state;
    return { crm, user };
}

const mapDispatchToProps = {
    getAllEmployeeOfUnitByRole: UserActions.getAllEmployeeOfUnitByRole,
    getCareTypes: CrmCareTypeActions.getCareTypes,
    createCare: CrmCareActions.createCare,
}


export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateCareForm));
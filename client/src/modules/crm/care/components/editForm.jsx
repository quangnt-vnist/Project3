import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, SelectBox, DatePicker, ErrorLabel } from '../../../../common-components';
import { CrmCareActions } from '../redux/action';
import { formatFunction } from '../../common/index';
import ValidationHelper from '../../../../helpers/validationHelper';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class EditCareForm extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
            careEditting: {}
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { user, crm } = props;
        if (props.careEditId !== state.careEditId) {
            props.getCare(props.careEditId);

            // Lấy nhân viên trong đơn vị hiện tại
            let employees;
            if (user.employees) {
                employees = user.employees.map(o => (
                    { value: o.userId._id, text: o.userId.name }
                ))
            }

            let listCareTypes;
            // Lấy hình thức chắm sóc khách hàng
            if (crm.careTypes) {
                listCareTypes = crm.careTypes.list.map(o => (
                    { value: o._id, text: o.name }
                ))
            }

            // Lấy danh sách khách hàng
            let listCustomers;
            if (crm.customers) {
                listCustomers = crm.customers.list.map(o => (
                    { value: o._id, text: o.name }
                ))
            }

            return {
                dataStatus: 1,
                careEditId: props.careEditId,
                employees,
                listCareTypes,
                listCustomers,
            }
        } else {
            return null;
        }
    }


    shouldComponentUpdate = (nextProps, nextState) => {
        let { careEditting, dataStatus } = this.state;
        if (dataStatus === this.DATA_STATUS.QUERYING && !nextProps.crm.cares.isLoading) {
            let care = nextProps.crm.cares.careById;
            careEditting = {
                caregiver: care.caregiver ? care.caregiver.map(o => o._id) : [],
                customer: care.customer ? care.customer.map(o => o._id) : [],
                name: care.name ? care.name : '',
                description: care.description ? care.description : '',
                careType: care.careType ? care.careType.map(o => o._id) : [],
                status: care.status ? care.status : '',
                startDate: care.startDate ? formatFunction.formatDate(care.startDate) : '',
                endDate: care.endDate ? formatFunction.formatDate(care.endDate) : ''
            }

            this.setState({
                dataStatus: this.DATA_STATUS.AVAILABLE,
                careEditting,
            })
            return false;
        }

        if (dataStatus === this.DATA_STATUS.AVAILABLE) {
            this.setState({
                dataStatus: this.DATA_STATUS.FINISHED,
            });
            return false;
        }
        return true;
    }


    /**
     * Hàm xử lý khi người chăm sóc khách hàng thay đổi
     * @param {*} value
     */
    handleChangeCaregiver = (value) => {
        const { careEditting } = this.state;
        const { translate } = this.props;

        this.setState({
            careEditting: {
                ...careEditting,
                caregiver: value,
            }
        })

        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ caregiverError: message });
    }


    /**
     * Hàm xử lý khi khách hàng được chăm sóc thay đổi
     * @param {*} value
     */
    handleChangeCustomer = (value) => {
        const { careEditting } = this.state;
        const { translate } = this.props;

        this.setState({
            careEditting: {
                ...careEditting,
                customer: value,
            }
        })

        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ customerError: message });
    }


    /**
     * Hàm xử lý khi tên công việc chăm sóc khách hàng thay đổi
     * @param {*} e
     */
    handleChangeName = (e) => {
        const { translate } = this.props;
        const { careEditting } = this.state;
        const { value } = e.target;

        this.setState({
            careEditting: {
                ...careEditting,
                name: value,
            }
        })

        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ nameError: message });
    }


    /**
     * Hàm xử lý khi mô tả công việc chăm sóc khách  hàng thay đổi
     * @param {*} e
     * @param {*} editor
     */
    handleChangeDescription = (e, editor) => {
        const { translate } = this.props;
        const { careEditting } = this.state;
        const value = editor.getData();

        this.setState({
            careEditting: {
                ...careEditting,
                description: value,
            }
        })

        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ descriptionError: message });
    }


    /**
     * Hàm xử lý khi hình thức chăm sóc thay đổi
     * @param {*} value
     */
    handleChangeCareType = (value) => {
        const { careEditting } = this.state;
        const { translate } = this.props;

        this.setState({
            careEditting: {
                ...careEditting,
                careType: value,
            }
        })

        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ careTypeError: message });
    }



    /**
     * Hàm xử lý khi trạng thái công việc chăm sóc thay đổi
     * @param {*} value
     */
    handleChangeStatus = (value) => {
        const { careEditting } = this.state;
        const { translate } = this.props;

        this.setState({
            careEditting: {
                ...careEditting,
                status: parseInt(value[0]),
            }
        })

        let { message } = ValidationHelper.validateEmpty(translate, value[0]);
        this.setState({ statusError: message });
    }


    /**
     * Hàm xử lý khi ngày bắt đầu thực hiện công việc thay đổi
     * @param {*} value
     */
    handleChangeStartDate = (value) => {
        const { careEditting } = this.state;
        const { translate } = this.props;

        this.setState({
            careEditting: {
                ...careEditting,
                startDate: value,
            }
        })

        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ startDateError: message });
    }


    /**
     * Hàm xử lý khi ngày kết thúc công việc thay đổi
     * @param {*} value
     */
    handleChangeEndDate = (value) => {
        const { careEditting } = this.state;

        this.setState({
            careEditting: {
                ...careEditting,
                endDate: parseInt(value[0]),
            }
        })
    }


    isFormValidated = () => {
        const { caregiver, customer, name, description, careType, status, startDate } = this.state.careEditting;
        const { translate } = this.props;

        if (!ValidationHelper.validateEmpty(translate, caregiver).status
            || !ValidationHelper.validateEmpty(translate, customer).status
            || !ValidationHelper.validateName(translate, name).status
            || !ValidationHelper.validateEmpty(translate, description).status
            || !ValidationHelper.validateEmpty(translate, careType).status
            || !ValidationHelper.validateEmpty(translate, status).status
            || !ValidationHelper.validateEmpty(translate, startDate).status)
            return false;
        return true;
    }


    save = () => {
        let { careEditting, careEditId } = this.state;
        if (careEditting.status) {
            const status = parseInt(careEditting.status);
            careEditting = { ...careEditting, status: status }
        }
        if (this.isFormValidated) {
            this.props.editCare(careEditId, careEditting);
        }
    }

    render() {
        const { crm, translate } = this.props;
        const { careEditting, listCustomers, listCareTypes, employees } = this.state;

        //validate error message
        const { caregiverError, customerError, nameError, descriptionError, careTypeError, statusError, startDateError } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-crm-care-edit" isLoading={crm.cares.isLoading}
                    formID="modal-crm-care-edit"
                    title={translate("crm.care.edit")}
                    size={75}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa khách hàng mới */}
                    <form id="modal-crm-care-edit">
                        {/* Nhân viên phụ trách */}
                        <div className={`form-group ${!caregiverError ? "" : "has-error"}`}>
                            <label>{translate('crm.care.caregiver')}<span className="text-red">*</span></label>
                            {
                                careEditting.caregiver && employees &&
                                <SelectBox
                                    id={`caregiver-care-edit`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        employees
                                    }
                                    value={careEditting.caregiver}
                                    onChange={this.handleChangeCaregiver}
                                    multiple={true}
                                />
                            }
                            <ErrorLabel content={caregiverError} />
                        </div>

                        {/* Khách hàng được chăm sóc */}
                        <div className={`form-group ${!customerError ? "" : "has-error"}`}>
                            <label>{translate('crm.care.customer')}<span className="text-red">*</span></label>
                            {
                                careEditting.customer && listCustomers &&
                                <SelectBox
                                    id={`customer-care-edit`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        listCustomers
                                    }
                                    value={careEditting.customer}
                                    onChange={this.handleChangeCustomer}
                                    multiple={true}
                                />
                            }
                            <ErrorLabel content={customerError} />
                        </div>

                        {/* Tên công việc */}
                        <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                            <label>{translate('crm.care.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={careEditting.name ? careEditting.name : ''} onChange={this.handleChangeName} />
                            <ErrorLabel content={nameError} />
                        </div>

                        {/* Mô tả công việc chăm sóc */}
                        <div className="form-group">
                            <label>{translate('crm.care.description')}<span className="text-red">*</span></label>
                            <CKEditor
                                editor={ClassicEditor}
                                onChange={this.handleChangeDescription}
                                data={careEditting.description}
                            />
                            <ErrorLabel content={descriptionError} />
                        </div>

                        {/* Loại hình chăm sóc khách hàng */}
                        <div className={`form-group ${!careTypeError ? "" : "has-error"}`}>
                            <label>{translate('crm.care.careType')}<span className="text-red">*</span></label>
                            {
                                careEditting.careType && listCareTypes &&
                                <SelectBox
                                    id={`customer-careType-edit`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        listCareTypes
                                    }
                                    value={careEditting.careType}
                                    onChange={this.handleChangeCareType}
                                    multiple={true}
                                />
                            }
                            <ErrorLabel content={careTypeError} />
                        </div>

                        {/* Trạng thái công việc */}
                        <div className={`form-group ${!statusError ? "" : "has-error"}`}>
                            <label>{translate('crm.care.status')}<span className="text-red">*</span></label>
                            {
                                careEditting.status &&
                                <SelectBox
                                    id={`status-care-edit`}
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
                                    value={careEditting.status}
                                    onChange={this.handleChangeStatus}
                                    multiple={false}
                                />
                            }
                            <ErrorLabel content={statusError} />
                        </div>

                        {/* Thời gian thực hiện */}
                        <div className={`form-group ${!startDateError ? "" : "has-error"}`}>
                            <label>{translate('crm.care.startDate')}<span className="text-red">*</span></label>
                            <DatePicker
                                id="startDate-care-edit"
                                value={careEditting.startDate ? careEditting.startDate : ''}
                                onChange={this.handleChangeStartDate}
                                disabled={false}
                            />
                            <ErrorLabel content={startDateError} />
                        </div>

                        {/* Thời gian kết thúc */}
                        <div className="form-group">
                            <label>{translate('crm.care.endDate')}</label>
                            <DatePicker
                                id="endDate-care-edit"
                                value={careEditting.endDate ? careEditting.endDate : ''}
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
    getCare: CrmCareActions.getCare,
    editCare: CrmCareActions.editCare,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditCareForm));
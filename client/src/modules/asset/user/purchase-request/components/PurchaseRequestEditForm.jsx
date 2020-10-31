import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';

import { PurchaseRequestFromValidator } from './PurchaseRequestFromValidator';

import { RecommendProcureActions } from '../redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';

class PurchaseRequestEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "Chờ phê duyệt"
        };
    }

    // Bắt sự kiện thay đổi mã phiếu
    handleRecommendNumberChange = (e) => {
        let value = e.target.value;
        this.validateRecommendNumber(value, true);
    }
    validateRecommendNumber = (value, willUpdateState = true) => {
        let msg = PurchaseRequestFromValidator.validateRecommendNumber(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnRecommendNumber: msg,
                    recommendNumber: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Ngày lập"
    handleDateCreateChange = (value) => {
        this.setState({
            ...this.state,
            dateCreate: value
        })
    }

    /**
     * Bắt sự kiện thay đổi người đề nghị
     */
    handleProponentChange = (value) => {
        this.setState({
            ...this.state,
            proponent: value[0]
        });
    }

    // Bắt sự kiện thay đổi "Thiết bị đề nghị mua"
    handleEquipmentChange = (e) => {
        let value = e.target.value;
        this.validateEquipment(value, true);
    }
    validateEquipment = (value, willUpdateState = true) => {
        let msg = PurchaseRequestFromValidator.validateEquipment(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEquipment: msg,
                    equipmentName: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Mô tảThiết bị đề nghị mua"
    handleEquipmentDescriptionChange = (e) => {
        let value = e.target.value;
        this.validateEquipmentDescription(value, true);
    }
    validateEquipmentDescription = (value, willUpdateState = true) => {
        let msg = PurchaseRequestFromValidator.validateEquipmentDescription(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEquipmentDescription: msg,
                    equipmentDescription: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Nhà cung cấp"
    handleSupplierChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            supplier: value
        })
    }

    // Bắt sự kiện thay đổi "Số lượng"
    handleTotalChange = (e) => {
        let value = e.target.value;
        this.validateTotal(value, true);
    }
    validateTotal = (value, willUpdateState = true) => {
        let msg = PurchaseRequestFromValidator.validateTotal(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnTotal: msg,
                    total: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Đơn vị tính"
    handleUnitChange = (e) => {
        let value = e.target.value;
        this.validateUnit(value, true);
    }
    validateUnit = (value, willUpdateState = true) => {
        let msg = PurchaseRequestFromValidator.validateUnit(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnUnit: msg,
                    unit: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Giá trị dự tính"
    handleEstimatePriceChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            estimatePrice: value
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateEquipment(this.state.equipmentName, false) &&
            this.validateTotal(this.state.total, false) &&
            this.validateUnit(this.state.unit, false);

        return result;
    }

    save = () => {
        if (this.isFormValidated()) {
            return this.props.updateRecommendProcure(this.state._id, this.state);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                recommendNumber: nextProps.recommendNumber,
                dateCreate: nextProps.dateCreate,
                proponent: nextProps.proponent,
                equipmentName: nextProps.equipmentName,
                equipmentDescription: nextProps.equipmentDescription,
                supplier: nextProps.supplier,
                total: nextProps.total,
                unit: nextProps.unit,
                estimatePrice: nextProps.estimatePrice,
                approver: nextProps.approver,
                status: nextProps.status,
                note: nextProps.note,
                errorOnEquipment: undefined,
                errorOnTotal: undefined,
                errorOnUnit: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { _id } = this.props;
        const { translate, recommendProcure, user } = this.props;
        const { recommendNumber, dateCreate, proponent, equipmentName, equipmentDescription, supplier, total, unit, estimatePrice,
            errorOnEquipment, errorOnEquipmentDescription, errorOnTotal, errorOnUnit } = this.state;

        var userlist = user.list;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-edit-recommendprocure" isLoading={recommendProcure.isLoading}
                    formID="form-edit-recommendprocure"
                    title={translate('asset.manage_recommend_procure.edit_recommend_card')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa phiếu đề nghị mua sắm thiết bị */}
                    <form className="form-group" id="form-edit-recommendprocure">
                        <div className="col-md-12">

                            <div className="col-sm-6">
                                {/* Mã phiếu */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.form_code')}</label>
                                    <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={this.handleRecommendNumberChange} />
                                </div>

                                {/* Ngày lập */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.create_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit_start_date${_id}`}
                                        value={dateCreate}
                                        onChange={this.handleDateCreateChange}
                                    />
                                </div>

                                {/* Người đề nghị */}
                                <div className={`form-group`}>
                                    <label>{translate('asset.usage.proponent')}</label>
                                    <div>
                                        <div id="proponentBox">
                                            <SelectBox
                                                id={`proponent${_id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={userlist.map(x => {
                                                    return { value: x._id, text: x.name + " - " + x.email }
                                                })}
                                                onChange={this.handleProponentChange}
                                                value={proponent ? proponent._id : null}
                                                multiple={false}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Thiết bị đề nghị mua */}
                                <div className={`form-group ${!errorOnEquipment ? "" : "has-error"}`}>
                                    <label>{translate('asset.manage_recommend_procure.asset_recommend')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="equipmentName" value={equipmentName} onChange={this.handleEquipmentChange} autoComplete="off" placeholder="Thiết bị đề nghị mua" />
                                    <ErrorLabel content={errorOnEquipment} />
                                </div>

                                {/* Mô tả thiết bị đề nghị mua */}
                                <div className={`form-group ${errorOnEquipmentDescription === undefined ? "" : "has-error"}`}>
                                    <label>{translate('asset.manage_recommend_procure.equipment_description')}</label>
                                    <textarea className="form-control" rows="3" name="equipmentDescription" value={equipmentDescription} onChange={this.handleEquipmentDescriptionChange} autoComplete="off"
                                        placeholder="Thiết bị đề nghị mua"></textarea>
                                    <ErrorLabel content={errorOnEquipmentDescription} />
                                </div>

                            </div>

                            <div className="col-sm-6">
                                {/* Nhà cung cấp */}
                                <div className="form-group">
                                    <label>{translate('asset.manage_recommend_procure.supplier')}</label>
                                    <input type="text" className="form-control" name="supplier" value={supplier} onChange={this.handleSupplierChange} />
                                </div>

                                {/* Số lượng */}
                                <div className={`form-group ${!errorOnTotal ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.number')}<span className="text-red">*</span></label>
                                    <input type="number" className="form-control" name="total" value={total} onChange={this.handleTotalChange} />
                                    <ErrorLabel content={errorOnTotal} />
                                </div>

                                {/* Đơn vị tính */}
                                <div className={`form-group ${!errorOnUnit ? "" : "has-error"}`}>
                                    <label>{translate('asset.manage_recommend_procure.unit')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="unit" value={unit} onChange={this.handleUnitChange} autoComplete="off" placeholder="Đơn vị tính" />
                                    <ErrorLabel content={errorOnUnit} />
                                </div>

                                {/* Giá trị dự tính */}
                                <div className="form-group">
                                    <label>{translate('asset.manage_recommend_procure.expected_value')} (VNĐ)</label>
                                    <input type="number" className="form-control" name="estimatePrice" value={estimatePrice} onChange={this.handleEstimatePriceChange} />
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { recommendProcure, user } = state;
    return { recommendProcure, user };
};

const actionCreators = {
    getUser: UserActions.get,
    updateRecommendProcure: RecommendProcureActions.updateRecommendProcure,
};

const editRecommendProcure = connect(mapState, actionCreators)(withTranslate(PurchaseRequestEditForm));
export { editRecommendProcure as PurchaseRequestEditForm };
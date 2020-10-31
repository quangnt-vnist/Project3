import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';

import { MaintainanceFormValidator } from './maintainanceFormValidator';

import { MaintainanceActions } from '../redux/actions';
import { AssetManagerActions } from '../../asset-information/redux/actions';

class MaintainanceEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.getAllAsset({
            code: "",
            assetName: "",
            assetType: null,
            month: null,
            status: "",
            page: 0,
            limit: 5,
        });
    }

    // Bắt sự kiện thay đổi mã phiếu
    handleMaintainanceCodeChange = (e) => {
        let { value } = e.target;
        this.validateMaintainanceCode(value, true);
    }
    validateMaintainanceCode = (value, willUpdateState = true) => {
        let msg = MaintainanceFormValidator.validateMaintainanceCode(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnMaintainanceCode: msg,
                    maintainanceCode: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Ngày lập"
    handleCreateDateChange = (value) => {
        this.validateCreateDate(value, true);
    }
    validateCreateDate = (value, willUpdateState = true) => {
        let msg = MaintainanceFormValidator.validateCreateDate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCreateDate: msg,
                    createDate: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi loại phiếu
    handleTypeChange = (value) => {
        if (value.length === 0) {
            value = ''
        }

        this.setState({
            ...this.state,
            type: value[0]
        })
    }

    /**
     * Bắt sự kiện thay đổi Mã tài sản
     */
    handleAssetChange = (value) => {
        this.setState({
            asset: value[0]
        });
    }

    // Bắt sự kiện thay đổi "Nội dung"
    handleDescriptionChange = (e) => {
        let { value } = e.target;
        this.validateDescription(value, true);
    }
    validateDescription = (value, willUpdateState = true) => {
        let msg = MaintainanceFormValidator.validateDescription(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDescription: msg,
                    description: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Ngày thực hiện"
    handleStartDateChange = (value) => {
        this.validateStartDate(value, true);
    }
    validateStartDate = (value, willUpdateState = true) => {
        let msg = MaintainanceFormValidator.validateStartDate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnStartDate: msg,
                    startDate: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Ngày hoàn thành"
    handleEndDateChange = (value) => {
        this.setState({
            ...this.state,
            endDate: value
        })
    }

    // Bắt sự kiện thay đổi "Chi phí"
    handleExpenseChange = (e) => {
        let { value } = e.target;
        this.validateExpense(value, true);
    }
    validateExpense = (value, willUpdateState = true) => {
        let msg = MaintainanceFormValidator.validateExpense(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnExpense: msg,
                    expense: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Trạng thái phiếu"
    handleStatusChange = (value) => {
        if (value.length === 0) {
            value = ''
        }

        this.setState({
            ...this.state,
            status: value[0]
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result = this.validateCreateDate(this.state.createDate, false) 
        
        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        var partCreate = this.state.createDate.split('-');
        var createDate = [partCreate[2], partCreate[1], partCreate[0]].join('-');
        var partStart = this.state.startDate.split('-');
        var startDate = [partStart[2], partStart[1], partStart[0]].join('-');
        var partEnd = this.state.endDate.split('-');
        var endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        let assetId = !this.state.asset ? this.props.assetsManager.listAssets[0]._id : this.state.asset._id;

        if (this.isFormValidated()) {
            let dataToSubit = {
                maintainanceCode: this.state.maintainanceCode,
                createDate: createDate,
                type: this.state.type,
                description: this.state.description,
                startDate: startDate,
                endDate: endDate,
                expense: this.state.expense,
                status: this.state.status,
                assetId
            }

            return this.props.updateMaintainance(this.props._id, dataToSubit);
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                asset: nextProps.asset,
                maintainanceCode: nextProps.maintainanceCode,
                createDate: nextProps.createDate,
                type: nextProps.type,
                description: nextProps.description,
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
                expense: nextProps.expense,
                status: nextProps.status,
                errorOnMaintainanceCode: undefined,
                errorOnCreateDate: undefined,
                errorOnStartDate: undefined,
                errorOnDescription: undefined,
                errorOnExpense: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { _id, translate, assetsManager } = this.props;
        const {
            maintainanceCode, createDate, type, asset, description, startDate, endDate, expense, status,
            errorOnMaintainanceCode, errorOnCreateDate, errorOnDescription, errorOnStartDate, errorOnExpense
        } = this.state;

        var assetlist = assetsManager.listAssets;
        console.log(this.state, 'this.state-u')

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-edit-maintainance" isLoading={false}
                    formID="form-create-maintainance"
                    title={translate('asset.asset_info.edit_maintenance_card')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa phiếu bỏ trì */}
                    <form className="form-group" id="form-edit-maintainance">
                        <div className="col-md-12">

                            <div className="col-sm-6">
                                {/* Mã phiếu */}
                                <div className={`form-group ${!errorOnMaintainanceCode ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.form_code')}</label>
                                    <input type="text" className="form-control" name="maintainanceCode" value={maintainanceCode} onChange={this.handleMaintainanceCodeChange} autoComplete="off" placeholder={translate('asset.general_information.form_code')} />
                                    <ErrorLabel content={errorOnMaintainanceCode} />
                                </div>

                                {/* Ngày lập */}
                                <div className={`form-group ${!errorOnCreateDate ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.create_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit-create-date${_id}`}
                                        value={createDate}
                                        onChange={this.handleCreateDateChange}
                                    />
                                    <ErrorLabel content={errorOnCreateDate} />
                                </div>

                                {/* Phân loại */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.type')}</label>
                                    <SelectBox
                                        id={`edit-type-maintainance-asset${_id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={[
                                            { value: 1, text: translate('asset.asset_info.repair') },
                                            { value: 2, text: translate('asset.asset_info.replace') },
                                            { value: 3, text: translate('asset.asset_info.upgrade') }
                                        ]}
                                        onChange={this.handleTypeChange}
                                        multiple={false}
                                    />
                                </div>

                                {/* Tài sản */}
                                <div className={`form-group`}>
                                    <label>{translate('asset.general_information.asset')}</label>
                                    <div>
                                        <div id="edit-assetBox">
                                            <SelectBox
                                                id={`edit-maintainance-asset${_id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={assetlist.map(x => ({ value: x._id, text: x.code + " - " + x.assetName }))}
                                                onChange={this.handleAssetChange}
                                                value={asset._id}
                                                multiple={false}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Nội dung */}
                                <div className={`form-group ${!errorOnDescription ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.content')}</label>
                                    <textarea className="form-control" rows="3" name="description" value={description} onChange={this.handleDescriptionChange} autoComplete="off" placeholder={translate('asset.general_information.content')}></textarea>
                                    <ErrorLabel content={errorOnDescription} />
                                </div>
                            </div>

                            <div className="col-sm-6">
                                {/* Ngày thực hiện */}
                                <div className={`form-group ${!errorOnStartDate ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.start_date')}</label>
                                    <DatePicker
                                        id={`edit-start-date${_id}`}
                                        value={startDate}
                                        onChange={this.handleStartDateChange}
                                    />
                                    <ErrorLabel content={errorOnStartDate} />
                                </div>

                                {/* Ngày hoàn thành */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.end_date')}</label>
                                    <DatePicker
                                        id={`edit-end-date${_id}`}
                                        value={endDate}
                                        onChange={this.handleEndDateChange}
                                    />
                                </div>

                                {/* Chi phí */}
                                <div className={`form-group ${!errorOnExpense ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.expense')} (VNĐ)</label>
                                    <input type="number" className="form-control" name="expense" value={expense} onChange={this.handleExpenseChange} autoComplete="off" placeholder={translate('asset.general_information.expense')} />
                                    <ErrorLabel content={errorOnExpense} />
                                </div>

                                {/* Trạng thái */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.status')}</label>
                                    <SelectBox
                                        id={`edit-status-maintainance-asset${_id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={[
                                            { value: 1, text: translate('asset.asset_info.unfulfilled') },
                                            { value: 2, text: translate('asset.asset_info.processing') },
                                            { value: 3, text: translate('asset.asset_info.made') },
                                        ]}
                                        onChange={this.handleStatusChange}
                                        multiple={false}
                                    />
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
    const { maintainance, assetsManager } = state;
    return { maintainance, assetsManager };
};

const actionCreators = {
    getAllAsset: AssetManagerActions.getAllAsset,
    updateMaintainance: MaintainanceActions.updateMaintainance,

};

const editForm = connect(mapState, actionCreators)(withTranslate(MaintainanceEditForm));
export { editForm as MaintainanceEditForm };

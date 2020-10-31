import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, TimePicker ,ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';

import { UseRequestFromValidator } from '../../../user/use-request/components/UseRequestFromValidator';

import { RecommendDistributeActions } from '../../../user/use-request/redux/actions';
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { AssetManagerActions } from '../../asset-information/redux/actions';

class UseRequestManagerEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "Chờ phê duyệt",
            managedBy : this.props.employeeId?this.props.employeeId:''
        };
    }


    formatDate(date, monthYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }

    // Bắt sự kiện thay đổi mã phiếu
    handleRecommendNumberChange = (e) => {
        let value = e.target.value;
        this.validateRecommendNumber(value, true);
    }
    validateRecommendNumber = (value, willUpdateState = true) => {
        let msg = UseRequestFromValidator.validateRecommendNumber(value, this.props.translate)
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
        this.validateDateCreate(value, true);
    }
    validateDateCreate = (value, willUpdateState = true) => {
        let msg = UseRequestFromValidator.validateDateCreate(value, this.props.translate)
        let partCreate = value.split('-');
        let dateCreate = [partCreate[2], partCreate[1], partCreate[0]].join('-'); 
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDateCreate: msg,
                    dateCreate: dateCreate,
                }
            });
        }
        return msg === undefined;
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

    // Bắt sự kiện thay đổi "Nội dung đề nghị"
    handleReqContentChange = (e) => {
        let value = e.target.value;
        this.validateReqContent(value, true);
    }
    validateReqContent = (value, willUpdateState = true) => {
        let msg = UseRequestFromValidator.validateReqContent(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnReqContent: msg,
                    reqContent: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi tài sản
     */
    handleAssetChange = (value) => {
        this.setState({
            asset: value[0]
        });
    }

    // Bắt sự kiện thay đổi "Thời gian đăng ký sử dụng từ ngày"
    handleDateStartUseChange = (value) => {
        this.validateDateStartUse(value, true);
    }
    validateDateStartUse = (value, willUpdateState = true) => {
        let msg = UseRequestFromValidator.validateDateStartUse(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDateStartUse: msg,
                    dateStartUse: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Thời gian đăng ký sử dụng đến ngày"
    handleDateEndUseChange = (value) => {
        this.validateDateEndUse(value, true);
    }
    validateDateEndUse = (value, willUpdateState = true) => {
        let msg = UseRequestFromValidator.validateDateEndUse(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDateEndUse: msg,
                    dateEndUse: value,
                }
            });
        }
        return msg === undefined;
    }

    //Bắt sự kiện thay đổi "Người phê duyệt"
    handleApproverChange = (value) => {
        this.setState({
            ...this.state,
            approver: value[0]
        });
    }

    // Bắt sự kiện thay đổi "Trạng thái"
    handleStatusChange = (value) => {
        this.setState({
            ...this.state,
            status: value[0]
        })
    }

    // Bắt sự kiện thay đổi "Ghi chú"
    handleNoteChange = (e) => {
        let value = e.target.value;
        this.validateNote(value, true);
    }
    validateNote = (value, willUpdateState = true) => {
        let msg = UseRequestFromValidator.validateNote(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnReason: msg,
                    note: value,
                }
            });
        }
        return msg === undefined;
    }

    handleStartTimeChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                startTime: value
            }
        });
    }


    handleStopTimeChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                stopTime: value
            }
        });
    }
    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result = this.validateDateCreate(this.state.dateCreate, false) &&
            this.validateReqContent(this.state.reqContent, false) &&
            this.validateDateStartUse(this.state.dateCreate, false)
            
        return result;
    }

    save = () => {
        let {managedBy} =this.state
        
        let dataToSubmit = { ...this.state, approver: this.props.auth.user._id };
        if (this.isFormValidated()) {
            let data = {
                status: dataToSubmit.status,
                recommendNumber: dataToSubmit.recommendNumber,
                dateCreate: dataToSubmit.dateCreate,
                proponent: dataToSubmit.proponent._id, // Người đề nghị
                reqContent: dataToSubmit.reqContent, // Người đề nghị
                asset: dataToSubmit.asset._id,
                dateStartUse: dataToSubmit.dateStartUse,
                dateEndUse: dataToSubmit.dateEndUse,
                approver: dataToSubmit.approver, // Người phê duyệt
                note: dataToSubmit.note,
                stopTime: dataToSubmit.stopTime,
                startTime: dataToSubmit.startTime
            }
            return this.props.updateRecommendDistribute(this.state._id, data,managedBy);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        
        if (nextProps._id !== prevState._id) {
            let startDate, endDate, startTime, stopTime, month, day, year;
            let partStart = new Date(nextProps.dateStartUse);
            if(nextProps.asset.typeRegisterForUse == 2){
                startTime = [partStart.getHours(), partStart.getMinutes()].join(':');
                startDate = [partStart.getDate(), (partStart.getMonth() + 1), partStart.getFullYear()].join('-');
            } else {
                startDate = [partStart.getDate(), (partStart.getMonth() + 1), partStart.getFullYear()].join('-');
            }
            let partStop = new Date(nextProps.dateEndUse);
            if(nextProps.asset.typeRegisterForUse == 2){
                stopTime = [partStop.getHours(), partStop.getMinutes()].join(':');
                endDate = [partStop.getDate(), (partStop.getMonth() + 1), partStop.getFullYear()].join('-');
            } else {
                endDate = [partStop.getDate(), (partStop.getMonth() + 1), partStop.getFullYear()].join('-');
            }
            return {
                ...prevState,
                _id: nextProps._id,
                recommendNumber: nextProps.recommendNumber,
                dateCreate: nextProps.dateCreate,
                proponent: nextProps.proponent,
                reqContent: nextProps.reqContent,
                asset: nextProps.asset,
                dateStartUse: startDate,
                dateEndUse: endDate,
                startTime: nextProps.asset.typeRegisterForUse == 2? startTime : null,
                stopTime: nextProps.asset.typeRegisterForUse == 2? stopTime : null,
                approver: nextProps.approver,
                status: nextProps.status,
                note: nextProps.note,
                errorOnRecommendNumber: undefined,
                errorOnDateCreate: undefined,
                errorOnReqContent: undefined,
                errorOnDateStartUse: undefined,
                errorOnDateEndUse: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { _id } = this.props;
        const { translate, recommendDistribute, user, assetsManager, auth } = this.props;
        const {
            recommendNumber, dateCreate, proponent, reqContent, asset, dateStartUse, dateEndUse, approver, status, note, startTime, stopTime,
            errorOnRecommendNumber, errorOnDateCreate, errorOnReqContent, errorOnDateStartUse, errorOnDateEndUse, typeRegisterForUse
        } = this.state;

        var assetlist = assetsManager.listAssets;
        var userlist = user.list;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-edit-recommenddistributemanage" isLoading={recommendDistribute.isLoading}
                    formID="form-edit-recommenddistributemanage"
                    title={translate('asset.asset_info.edit_usage_info')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form cập nhật phiếu đăng ký sử dụng tài sản */}
                    <form className="form-group" id="form-edit-recommenddistribute">
                        <div className="col-md-12">

                            <div className="col-sm-6">
                                {/* Mã phiếu */}
                                <div className={`form-group ${!errorOnRecommendNumber ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.form_code')}</label>
                                    <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={this.handleRecommendNumberChange} autoComplete="off" placeholder={translate('asset.general_information.form_code')} />
                                    <ErrorLabel content={errorOnRecommendNumber} />
                                </div>

                                {/* Ngày lập */}
                                <div className={`form-group ${!errorOnDateCreate ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.create_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit_start_date${_id}`}
                                        value={this.formatDate(dateCreate)}
                                        onChange={this.handleDateCreateChange}
                                    />
                                    <ErrorLabel content={errorOnDateCreate} />
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

                                {/* Nội dung đề nghị */}
                                <div className={`form-group ${!errorOnReqContent ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.content')}<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" name="reqContent" value={reqContent} onChange={this.handleReqContentChange} autoComplete="off" placeholder={translate('asset.general_information.content')} ></textarea>
                                    <ErrorLabel content={errorOnReqContent} />
                                </div>

                                {/* Tài sản */}
                                <div className={`form-group`}>
                                    <label>{translate('asset.general_information.asset')}</label>
                                    <div>
                                        <div id="edit_asset">
                                            <SelectBox
                                                id={`edit_asset${_id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={assetlist.map(x => {
                                                    return { value: x._id, text: x.code + " - " + x.assetName }
                                                })}
                                                onChange={this.handleAssetChange}
                                                value={asset ? asset._id : null}
                                                multiple={false}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                {/* Thời gian đăng ký sử dụng từ ngày */}
                                <div className={`form-group ${!errorOnDateStartUse ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.handover_from_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit_start_use${_id}`}
                                        value={dateStartUse}
                                        onChange={this.handleDateStartUseChange}
                                    />
                                    {   asset.typeRegisterForUse == 2 && 
                                        < TimePicker
                                            id={`edit_start_time_use${_id}`}
                                            value={startTime}
                                            onChange={this.handleStartTimeChange}
                                        /> 
                                    }

                                    <ErrorLabel content={errorOnDateStartUse} />
                                </div>

                                {/* Thời gian đăng ký sử dụng đến ngày */}
                                <div className={`form-group ${!errorOnDateEndUse ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.handover_to_date')}</label>
                                    <DatePicker
                                        id={`edit_end_use${_id}`}
                                        value={dateEndUse}
                                        onChange={this.handleDateEndUseChange}
                                    />
                                    {
                                        asset.typeRegisterForUse == 2 && 
                                        < TimePicker
                                            id={`edit_stop_time_use${_id}`}
                                            value={stopTime}
                                            onChange={this.handleStopTimeChange}
                                        /> 
                                    }  
                                    <ErrorLabel content={errorOnDateEndUse} />
                                </div>

                                {/* Người phê duyệt */}
                                <div className={`form-group`}>
                                    <label>{translate('asset.usage.accountable')}</label>
                                    <div>
                                        <div id="approver">
                                            <SelectBox
                                                id={`approver${_id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={userlist.map(x => {
                                                    return { value: x._id, text: x.name + " - " + x.email }
                                                })}
                                                onChange={this.handleApproverChange}
                                                value={auth.user._id}
                                                multiple={false}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Trạng thái */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.status')}</label>
                                    <SelectBox
                                        id={`status${_id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={status}
                                        items={[
                                            { value: 'approved', text: translate('asset.usage.approved') },
                                            { value: 'waiting_for_approval', text: translate('asset.usage.waiting_approval') },
                                            { value: 'disapproved', text: translate('asset.usage.not_approved') },
                                        ]}
                                        onChange={this.handleStatusChange}
                                    />
                                </div>

                                {/* Ghi chú */}
                                <div className="form-group">
                                    <label>{translate('asset.usage.note')}</label>
                                    <textarea className="form-control" rows="3" name="note" value={note} onChange={this.handleNoteChange}></textarea>
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
    const { recommendDistribute, auth, user, assetsManager } = state;
    return { recommendDistribute, auth, user, assetsManager };
};

const actionCreators = {
    getUser: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
    updateRecommendDistribute: RecommendDistributeActions.updateRecommendDistribute,

};

const editUseRequestManager = connect(mapState, actionCreators)(withTranslate(UseRequestManagerEditForm));
export { editUseRequestManager as UseRequestEditForm };

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, TimePicker ,DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';

import { UseRequestFromValidator } from './UseRequestFromValidator';

import { RecommendDistributeActions } from '../redux/actions';
import { AssetManagerActions } from '../../../admin/asset-information/redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';

class UseRequestCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendNumber: "",
            dateCreate: this.formatDate(Date.now()),
            proponent: "",
            reqContent: "",
            dateStartUse: this.props.startDate ? this.formatDate(this.props.startDate) : this.formatDate(Date.now()),
            dateEndUse: this.props.endDate ? this.formatDate(this.props.endDate) : this.formatDate(Date.now()),
            startTime : null,
            stopTime: null,
            status: "waiting_for_approval",
            asset: "",
        };
    }

    // Function format ngày hiện tại thành dạnh dd-mm-yyyy
    formatDate = (date) => {
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

        return [day, month, year].join('-');
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

    validateExitsRecommendNumber = (value) => {
        return this.props.recommendDistribute.listRecommendDistributes.some(item => item.recommendNumber === value);
    }

    // Bắt sự kiện thay đổi "Ngày lập"
    handleDateCreateChange = (value) => {
        this.validateDateCreate(value, true);
    }
    validateDateCreate = (value, willUpdateState = true) => {
        let msg = UseRequestFromValidator.validateDateCreate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDateCreate: msg,
                    dateCreate: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi người sử dụng
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
     * Bắt sự kiện thay đổi Mã tài sản
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
    // Bắt sự kiện thay đổi "Thời gian đăng ký sử dụng đến ngày"
    handleDateEndUseChange = (value) => {
        this.validateDateEndUse(value, true);
    }

    getDefaultStartValue = (value) => {
        this.setState({ startTime: value });
    }

    getDefaultEndValue = (value) => {
        this.setState({ stopTime: value });
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

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result = this.validateDateCreate(this.state.dateCreate, false) &&
            this.validateReqContent(this.state.reqContent, false) &&
            this.validateDateStartUse(this.state.dateCreate, false)

        return result;
    }

    // Bắt sự kiện submit form
    save = async () => {
        let dataToSubmit = { ...this.state, proponent: this.props.auth.user._id }
        if (this.isFormValidated() && this.validateExitsRecommendNumber(this.state.recommendNumber) === false) {
            await this.props.createRecommendDistribute(dataToSubmit);
            if(this.props._id == `calendar-${this.props.asset}`){
                await this.props.handleChange(dataToSubmit)
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                asset: nextProps.asset,
                stopTime: nextProps.stopTime,
                startTime: nextProps.startTime,
            }
        } else {
            return null;
        }
    }

    render() {
        const { _id } = this.props;
        const { translate, recommendDistribute, assetsManager, user, auth } = this.props;
        const {
            recommendNumber, dateCreate, proponent, asset, reqContent, dateStartUse, dateEndUse, approver, positionApprover, status, note,
            errorOnRecommendNumber, errorOnDateCreate, errorOnReqContent, errorOnDateStartUse, errorOnDateEndUse, startTime, stopTime
        } = this.state;
        // 
        var assetlist = assetsManager.listAssets;
        var userlist = user.list;
        console.log("This.props", `modal-create-recommenddistribute-${_id}` , this.props)
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-create-recommenddistribute-${_id}`} isLoading={recommendDistribute.isLoading}
                    formID="form-create-recommenddistribute"
                    title={translate('asset.asset_info.add_usage_info')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated() || this.validateExitsRecommendNumber(recommendNumber)}
                >
                    {/* Form thêm mới phiếu đăng ký sử dụng thiết bị */}
                    <form className="form-group" id="form-create-recommenddistribute">
                        <div className="col-md-12">

                            <div className="col-sm-6">
                                {/* Mã phiếu */}
                                <div className={`form-group ${!errorOnRecommendNumber ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.form_code')}</label>
                                    <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={this.handleRecommendNumberChange} autoComplete="off" placeholder="Mã phiếu" />
                                    <ErrorLabel content={errorOnRecommendNumber} />
                                    <ErrorLabel content={this.validateExitsRecommendNumber(recommendNumber) ? <span className="text-red">Mã phiếu đã tồn tại</span> : ''} />
                                </div>

                                {/* Ngày lập */}
                                <div className={`form-group ${!errorOnDateCreate ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.create_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="create_start_date"
                                        value={dateCreate}
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
                                                id={`add-proponent${_id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={userlist.map(x => {
                                                    return { value: x._id, text: x.name + " - " + x.email }
                                                })}
                                                onChange={this.handleProponentChange}
                                                value={auth.user._id}
                                                multiple={false}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Nội dung đề nghị */}
                                <div className={`form-group ${!errorOnReqContent ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.content')}<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" name="reqContent" value={reqContent} onChange={this.handleReqContentChange} autoComplete="off" placeholder="Nội dung đề nghị"></textarea>
                                    <ErrorLabel content={errorOnReqContent} />
                                </div>
                            </div>

                            <div className="col-sm-6">
                                {/* Tài sản */}
                                <div className={`form-group`}>
                                    <label>{translate('asset.general_information.asset')}</label>
                                    <div>
                                        <div id="assetUBox">
                                            <SelectBox
                                                id={`asset${_id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={assetlist.map(x => {
                                                    return { value: x._id, text: x.code + " - " + x.assetName }
                                                })}
                                                onChange={this.handleAssetChange}
                                                value={asset}
                                                multiple={false}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Thời gian đăng ký sử dụng từ ngày */}
                                <div className={`form-group ${errorOnDateStartUse === undefined ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.handover_from_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="create_start_use"
                                        value={dateStartUse}
                                        onChange={this.handleDateStartUseChange}
                                    />
                                    { this.props.typeRegisterForUse == 2 &&
                                    <TimePicker
                                        id={`time-picker-start`}
                                        onChange={this.handleStartTimeChange}
                                        value = {startTime}
                                        // getDefaultValue = {this.getDefaultStartValue}
                                        />
                                    }
                                    <ErrorLabel content={errorOnDateStartUse} />
                                </div>

                                {/* Thời gian đăng ký sử dụng đến ngày */}
                                <div className={`form-group ${errorOnDateEndUse === undefined ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.handover_to_date')}</label>
                                    <DatePicker
                                        id="create_end_use"
                                        value={dateEndUse}
                                        onChange={this.handleDateEndUseChange}
                                    />
                                    { this.props.typeRegisterForUse == 2 &&
                                        <TimePicker
                                        id={`time-picker-end`}
                                        onChange={this.handleStopTimeChange}
                                        value = {stopTime}
                                        // getDefaultValue = {this.getDefaultEndValue}
                                        />
                                    }
                                    
                                    <ErrorLabel content={errorOnDateEndUse} />
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
    createRecommendDistribute: RecommendDistributeActions.createRecommendDistribute,
};

const createForm = connect(mapState, actionCreators)(withTranslate(UseRequestCreateForm));
export { createForm as UseRequestCreateForm };

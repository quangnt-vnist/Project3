import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import moment from 'moment';

import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';

import { AssetCreateValidator } from '../../../base/create-tab/components/assetCreateValidator';
import { DepreciationActions } from '../redux/actions';

class DepreciationEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * Bắt sự kiện thay đổi Mã tài sản
     */
    handleAssetChange = (value) => {
        this.setState({
            asset: value[0]
        });
    }

    /**
     * Bắt sự kiện thay đổi nguyên giá
     */
    handleCostChange = (e) => {
        const { value } = e.target;
        this.validateCost(value, true);
    }
    validateCost = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateCost(value, this.props.translate)

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCost: msg,
                    cost: value
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi Giá trị thu hồi dự tính
     */
    handleResidualValueChange = (e) => {
        const { value } = e.target;
        this.validateResidualValue(value, true);
    }
    validateResidualValue = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateResidualValue(value, this.props.translate)

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnResidualValue: msg,
                    residualValue: value
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi Thời gian trích khấu hao
     */
    handleUsefulLifeChange = (e) => {
        const { value } = e.target;
        this.validateUsefulLife(value, true);
    }
    validateUsefulLife = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateUsefulLife(value, this.props.translate)

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnUsefulLife: msg,
                    usefulLife: value
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi Thời gian bắt đầu trích khấu hao
     */
    handleStartDepreciationChange = (value) => {
        this.validateStartDepreciation(value, true);
    }
    validateStartDepreciation = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateStartDepreciation(value, this.props.translate)

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnStartDepreciation: msg,
                    startDepreciation: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi sản lượng theo công suất thiết kế (trong 1 năm)
     */
    handleEstimatedTotalProductionChange = (e) => {
        const { value } = e.target;
        this.validateEstimatedTotalProduction(value, true);
    }
    validateEstimatedTotalProduction = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateEstimatedTotalProduction(value, this.props.translate)

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEstimatedTotalProduction: msg,
                    estimatedTotalProduction: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi phương pháp khấu hao
     */
    handleDepreciationTypeChange = (value) => {
        this.setState({
            depreciationType: value[0]
        })
    }


    addMonthToEndDepreciation = (day) => {
        if (day) {
            let { usefulLife } = this.state,
                splitDay = day.toString().split('-'),
                currentDate = moment(`${splitDay[2]}-${splitDay[1]}-${splitDay[0]}`),
                futureMonth = moment(currentDate).add(usefulLife, 'M'),
                futureMonthEnd = moment(futureMonth).endOf('month');

            if (currentDate.date() !== futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))) {
                futureMonth = futureMonth.add(1, 'd');
            }

            return futureMonth.format('DD-MM-YYYY');
        }
    };

    // function kiểm tra các trường bắt buộc phải nhập
    validatorInput = (value) => {
        if (value && value.toString().trim() !== '') {
            return true;
        }

        return false;
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let unitProductionValidate = true;

        if (this.state.depreciationType === "units_of_production") {
            let { unitsProducedDuringTheYears, estimatedTotalProduction } = this.state;
            let check = true;

            if (unitsProducedDuringTheYears && unitsProducedDuringTheYears.length !== 0) {
                for (let n in unitsProducedDuringTheYears) {
                    check = this.validateYear(unitsProducedDuringTheYears[n].month, n, false) && this.validateValue(unitsProducedDuringTheYears[n].unitsProducedDuringTheYear, n, false);
                    if (!check) {
                        break;
                    }
                }
            }

            unitProductionValidate = check && this.validateEstimatedTotalProduction(estimatedTotalProduction, false);
        }

        let result = this.validateStartDepreciation(this.state.startDepreciation, false) &&
            this.validatorInput(this.state.depreciationType) && unitProductionValidate;

        return result;
    }

    /**
     * Bắt sự kiện click thêm thông tin sản lượng sản phẩm
     */
    handleAddUnitsProduced = () => {
        var unitsProducedDuringTheYears = this.state.unitsProducedDuringTheYears;

        if (unitsProducedDuringTheYears && unitsProducedDuringTheYears.length !== 0) {
            let result;

            for (let n in unitsProducedDuringTheYears) {
                result = this.validateYear(unitsProducedDuringTheYears[n].month, n) && this.validateValue(unitsProducedDuringTheYears[n].unitsProducedDuringTheYear, n);
                if (!result) {
                    this.validateYear(unitsProducedDuringTheYears[n].month, n);
                    this.validateValue(unitsProducedDuringTheYears[n].unitsProducedDuringTheYear, n)
                    break;
                }
            }

            if (result) {
                this.setState({
                    unitsProducedDuringTheYears: [...unitsProducedDuringTheYears, { month: "", unitsProducedDuringTheYear: "" }]
                })
            }
        } else {
            this.setState({
                unitsProducedDuringTheYears: [{ month: "", unitsProducedDuringTheYear: "" }]
            })
        }

    }

    /**
     * Bắt sự kiện chỉnh sửa tên trường tháng sản lượng sản phẩm
     */
    handleMonthChange = (value, index) => {
        this.validateYear(value, index);
    }
    validateYear = (value, index, willUpdateState = true) => {
        let time = value.split("-");
        let date = new Date(time[1], time[0], 0)
        let partDepreciation = this.state.startDepreciation.split('-');
        let startDepreciation = [partDepreciation[2], partDepreciation[1], partDepreciation[0]].join('-');

        let partEndDepreciation = this.state.endDepreciation.split('-');
        let endDepreciation = [partEndDepreciation[2], partEndDepreciation[1], partEndDepreciation[0]].join('-');

        let msg = undefined;

        if (value.toString().trim() === "") {
            msg = "Tháng sản lượng sản phẩm không được để trống";
        } else if (date.getTime() < new Date(startDepreciation).getTime()) {
            msg = "Tháng sản lượng sản phẩm không được trước ngày bắt đầu tính khấu hao";
        } else if (date.getTime() > new Date(endDepreciation).getTime()) {
            msg = "Tháng sản lượng sản phẩm không được sau ngày kết thúc tính khấu hao";
        }

        if (willUpdateState) {
            var { unitsProducedDuringTheYears } = this.state;
            unitsProducedDuringTheYears[index] = { ...unitsProducedDuringTheYears[index], month: value }
            this.setState(state => {
                return {
                    ...state,
                    errorOnMonth: msg,
                    unitsProducedDuringTheYears: unitsProducedDuringTheYears
                }
            });
        }

        return msg === undefined;
    }

    /**
     * Bắt sự kiện chỉnh sửa giá trị trường giá trị sản lượng sản phẩm
     */
    handleChangeValue = (e, index) => {
        var { value } = e.target;
        this.validateValue(value, index);
    }
    validateValue = (value, className, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateUnitsProducedDuringTheYear(value, this.props.translate);
        if (willUpdateState) {
            var { unitsProducedDuringTheYears } = this.state;
            unitsProducedDuringTheYears[className] = { ...unitsProducedDuringTheYears[className], unitsProducedDuringTheYear: value }
            this.setState(state => {
                return {
                    ...state,
                    errorOnValue: msg,
                    unitsProducedDuringTheYears: unitsProducedDuringTheYears
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện xóa thông tin sản lượng sản phẩm
     */
    delete = (index) => {
        var { unitsProducedDuringTheYears } = this.state;
        unitsProducedDuringTheYears.splice(index, 1);
        this.setState({
            unitsProducedDuringTheYears: unitsProducedDuringTheYears
        })
        if (unitsProducedDuringTheYears.length !== 0) {
            for (let n in unitsProducedDuringTheYears) {
                this.validateYear(unitsProducedDuringTheYears[n].month, n);
                this.validateValue(unitsProducedDuringTheYears[n].unitsProducedDuringTheYear, n)
            }
        } else {
            this.setState({
                errorOnValue: undefined,
                errorOnMonth: undefined
            })
        }
    };

    save = () => {
        var partDepreciation = this.state.startDepreciation.split('-');
        var startDepreciation = [partDepreciation[2], partDepreciation[1], partDepreciation[0]].join('-');
        let assetId = !this.state.asset ? this.props.assetsManager.listAssets[0]._id : this.state.asset._id;

        if (this.isFormValidated()) {
            let dataToSubmit = {
                cost: this.state.cost,
                usefulLife: this.state.usefulLife,
                startDepreciation: startDepreciation,
                residualValue: this.state.residualValue,
                depreciationType: this.state.depreciationType,
                estimatedTotalProduction: this.state.estimatedTotalProduction,
                unitsProducedDuringTheYears: this.state.unitsProducedDuringTheYears.map((x) => ({
                    month: x.month,
                    unitsProducedDuringTheYear: x.unitsProducedDuringTheYear,
                })),
                assetId
            }
            return this.props.updateDepreciation(this.props._id, dataToSubmit);
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                asset: nextProps.asset,
                cost: nextProps.cost,
                residualValue: nextProps.residualValue,
                usefulLife: nextProps.usefulLife,
                startDepreciation: nextProps.startDepreciation,
                endDepreciation: nextProps.endDepreciation,
                depreciationType: nextProps.depreciationType,
                estimatedTotalProduction: nextProps.estimatedTotalProduction,
                unitsProducedDuringTheYears: nextProps.unitsProducedDuringTheYears,
                errorOnStartDepreciation: undefined,
                errorOnUsefulLife: undefined,
            }
        } else {
            return null;
        }
    }


    render() {
        const { _id } = this.props;
        const { translate, assetsManager } = this.props;
        const { asset,
            cost, residualValue, usefulLife, startDepreciation, depreciationType, endDepreciation, annualDepreciationValue,
            monthlyDepreciationValue, errorOnCost, errorOnStartDepreciation, errorOnDepreciationType, errorOnUsefulLife, errorOnMonth, errorOnValue, unitsProducedDuringTheYears, errorOnEstimatedTotalProduction, estimatedTotalProduction
        } = this.state;

        var assetlist = assetsManager.listAssets;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-edit-depreciation"
                    formID="form-edit-depreciation"
                    title={translate('asset.depreciation.edit_depreciation')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa thông tin khấu hao */}
                    <form className="form-group" id="form-edit-depreciation">
                        {/* Tài sản */}
                        <div className="col-md-12">
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.asset')}</label>
                                <div>
                                    <div id="assetUBox">
                                        <SelectBox
                                            id={`edit-incident-asset${_id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={assetlist.map(x => ({ value: x._id, text: x.code + " - " + x.assetName }))}
                                            onChange={this.handleAssetChange}
                                            value={_id}
                                            multiple={false}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Nguyên giá */}
                            <div className={`form-group ${!errorOnCost ? "" : "has-error"} `}>
                                <label htmlFor="cost">{translate('asset.general_information.original_price')} (VNĐ)<span className="text-red">*</span></label><br />
                                <input type="number" className="form-control" name="cost" value={cost} onChange={this.handleCostChange}
                                    placeholder={translate('asset.general_information.original_price')} autoComplete="off" />
                                <ErrorLabel content={errorOnCost} />
                            </div>

                            {/* Giá trị thu hồi ước tính */}
                            <div className={`form-group`}>
                                <label htmlFor="residualValue">{translate('asset.general_information.residual_price')} (VNĐ)</label><br />
                                <input type="number" className="form-control" name="residualValue" value={residualValue} onChange={this.handleResidualValueChange}
                                    placeholder={translate('asset.general_information.residual_price')} autoComplete="off" />
                            </div>

                            {/* Thời gian sử dụng */}
                            <div className={`form-group ${!errorOnUsefulLife ? "" : "has-error"} `}>
                                <label htmlFor="usefulLife">{translate('asset.asset_info.usage_time')} (Tháng)<span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="usefulLife" value={usefulLife} onChange={this.handleUsefulLifeChange}
                                    placeholder={translate('asset.asset_info.usage_time')} autoComplete="off" />
                                <ErrorLabel content={errorOnUsefulLife} />
                            </div>

                            {/* Thời gian bắt đầu trích khấu hao */}
                            <div className={`form-group ${!errorOnStartDepreciation ? "" : "has-error"} `}>
                                <label htmlFor="startDepreciation">{translate('asset.general_information.start_depreciation')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`startDepreciation${_id}`}
                                    value={startDepreciation}
                                    onChange={this.handleStartDepreciationChange}
                                />
                                <ErrorLabel content={errorOnStartDepreciation} />
                            </div>

                            {/* Phương pháp khấu hao */}
                            <div className={`form-group ${!errorOnDepreciationType ? "" : "has-error"}`}>
                                <label htmlFor="depreciationType">{translate('asset.general_information.depreciation_type')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`depreciationType${_id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={depreciationType}
                                    items={[
                                        { value: '', text: `---${translate('asset.depreciation.select_depreciation_type')}---` },
                                        { value: 'straight_line', text: translate('asset.depreciation.line') },
                                        { value: 'declining_balance', text: translate('asset.depreciation.declining_balance') },
                                        { value: 'units_of_production', text: translate('asset.depreciation.units_production') },
                                    ]}
                                    onChange={this.handleDepreciationTypeChange}
                                />
                                <ErrorLabel content={errorOnDepreciationType} />
                            </div>

                            {/* Sản lượng theo công suất thiết kế */}
                            {
                                depreciationType == 'units_of_production' &&
                                <div className={`form-group ${!errorOnEstimatedTotalProduction ? "" : "has-error"} `}>
                                    <label htmlFor="estimatedTotalProduction">{translate('asset.depreciation.estimated_production')}<span className="text-red">*</span></label>
                                    <input type="number" className="form-control" name="estimatedTotalProduction" value={estimatedTotalProduction} onChange={this.handleEstimatedTotalProductionChange}
                                        placeholder={translate('asset.depreciation.estimated_production')} autoComplete="off" />
                                    <ErrorLabel content={errorOnEstimatedTotalProduction} />
                                </div>
                            }

                            {/* Sản lượng sản phẩm trong các năm */}
                            {
                                depreciationType == 'units_of_production' &&
                                <div className="col-md-12" style={{ paddingLeft: '0px' }}>
                                    <label>{translate('asset.depreciation.months_production')}:
                                        <a style={{ cursor: "pointer" }} title={translate('asset.general_information.asset_properties')}><i className="fa fa-plus-square" style={{ color: "#00a65a", marginLeft: 5 }}
                                            onClick={this.handleAddUnitsProduced} /></a>
                                    </label>
                                    <div className={`form-group ${(!errorOnMonth && !errorOnValue) ? "" : "has-error"}`}>

                                        {/* Bảng thông tin chi tiết */}
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th style={{ paddingLeft: '0px' }}>{translate('page.month')}</th>
                                                    <th style={{ paddingLeft: '0px' }}>{translate('asset.depreciation.production')}</th>
                                                    <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(!unitsProducedDuringTheYears || unitsProducedDuringTheYears.length === 0) ? <tr>
                                                    <td colSpan={3}>
                                                        <center> {translate('table.no_data')}</center>
                                                    </td>
                                                </tr> :
                                                    unitsProducedDuringTheYears.map((x, index) => {
                                                        return <tr key={index}>
                                                            <td style={{ paddingLeft: '0px' }}>
                                                                <DatePicker
                                                                    id={index}
                                                                    dateFormat="month-year"
                                                                    value={x.month}
                                                                    onChange={(e) => this.handleMonthChange(e, index)}
                                                                />
                                                            </td>
                                                            <td style={{ paddingLeft: '0px' }}><input className="form-control" type="number" value={x.unitsProducedDuringTheYear} name="unitsProducedDuringTheYears" style={{ width: "100%" }} onChange={(e) => this.handleChangeValue(e, index)} /></td>
                                                            <td style={{ textAlign: "center" }}>
                                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                    })}
                                            </tbody>
                                        </table>
                                        <ErrorLabel content={errorOnMonth} />
                                        <ErrorLabel content={errorOnValue} />
                                    </div>
                                </div>
                            }

                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { assetsManager } = state;
    return { assetsManager };
};

const actionCreators = {
    updateDepreciation: DepreciationActions.updateDepreciation,
};

const editForm = connect(mapState, actionCreators)(withTranslate(DepreciationEditForm));
export { editForm as DepreciationEditForm };

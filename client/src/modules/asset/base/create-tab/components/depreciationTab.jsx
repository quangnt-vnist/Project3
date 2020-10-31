import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import moment from 'moment';

import { DatePicker, ErrorLabel, SelectBox } from '../../../../../common-components';

import { AssetCreateValidator } from './assetCreateValidator';

class DepreciationTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Function format dữ liệu Date thành string
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

    // Function lưu các trường thông tin vào state
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
        this.props.handleChange(name, value);
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
            this.props.handleChange("cost", value);
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
            this.props.handleChange("residualValue", value);
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
            this.props.handleChange("usefulLife", value);
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
        console.log('value', value);
        let msg = AssetCreateValidator.validateStartDepreciation(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnStartDepreciation: msg,
                    startDepreciation: value,
                }
            });
            this.props.handleChange("startDepreciation", value);
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
        this.props.handleChange('depreciationType', value[0]);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
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
                errorOnDepreciationType: undefined,
            }
        } else {
            return null;
        }
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

    /**
     * Bắt sự kiện thay đổi ản lượng theo công suất thiết kế (trong 1 năm)
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

            this.props.handleChange("estimatedTotalProduction", value);
        }
        return msg === undefined;
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

        let startDepreciation = undefined, endDepreciation = undefined;
        if (this.state.startDepreciation) {
            let partDepreciation = this.state.startDepreciation.split('-');
            startDepreciation = [partDepreciation[2], partDepreciation[1], partDepreciation[0]].join('-');
        }

        if (this.state.endDepreciation) {
            let partEndDepreciation = this.state.endDepreciation.split('-');
            endDepreciation = [partEndDepreciation[2], partEndDepreciation[1], partEndDepreciation[0]].join('-');
        }

        let msg = undefined;

        if (value.toString().trim() === "") {
            msg = "Tháng sản lượng sản phẩm không được để trống";
        } else if (startDepreciation && date.getTime() < new Date(startDepreciation).getTime()) {
            msg = "Tháng sản lượng sản phẩm không được trước ngày bắt đầu tính khấu hao";
        } else if (endDepreciation && date.getTime() > new Date(endDepreciation).getTime()) {
            msg = "Tháng sản lượng sản phẩm không được sau ngày kết thúc tính khấu hao";
        }

        if (willUpdateState) {
            var { unitsProducedDuringTheYears } = this.state;
            unitsProducedDuringTheYears[index] = { ...unitsProducedDuringTheYears[index], month: value }
            this.setState(state => {
                return {
                    ...state,
                    errorOnMonth: msg,
                    errorOnMonthPosition: msg ? index : null,
                    unitsProducedDuringTheYears: unitsProducedDuringTheYears
                }
            });

            this.props.handleChange("unitsProducedDuringTheYears", unitsProducedDuringTheYears);
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
                    errorOnValuePosition: msg ? className : null,
                    unitsProducedDuringTheYears: unitsProducedDuringTheYears
                }
            });

            this.props.handleChange("unitsProducedDuringTheYears", unitsProducedDuringTheYears);
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

    render() {
        const { id } = this.props;
        const { translate } = this.props;

        const {
            cost, residualValue, usefulLife, startDepreciation, depreciationType, errorOnCost, errorOnStartDepreciation,
            errorOnUsefulLife, errorOnDepreciationType, errorOnMonth, errorOnValue, unitsProducedDuringTheYears, errorOnEstimatedTotalProduction,
            estimatedTotalProduction, errorOnMonthPosition, errorOnValuePosition } = this.state;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {/* Thông tin khấu hao */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('asset.general_information.depreciation_information')}</h4></legend>

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
                                placeholder="Giá trị thu hồi ước tính" autoComplete="off" />
                        </div>

                        {/* Thời gian sử dụng */}
                        <div className={`form-group ${!errorOnUsefulLife ? "" : "has-error"} `}>
                            <label htmlFor="usefulLife">{translate('asset.asset_info.usage_time')} (Tháng)<span className="text-red">*</span></label>
                            <input type="number" className="form-control" name="usefulLife" value={usefulLife} onChange={this.handleUsefulLifeChange}
                                placeholder="Thời gian trích khấu hao" autoComplete="off" />
                            <ErrorLabel content={errorOnUsefulLife} />
                        </div>

                        {/* Thời gian bắt đầu trích khấu hao */}
                        <div className={`form-group ${!errorOnStartDepreciation ? "" : "has-error"} `}>
                            <label htmlFor="startDepreciation">{translate('asset.general_information.start_depreciation')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`startDepreciation${id}`}
                                value={startDepreciation}
                                onChange={this.handleStartDepreciationChange}
                            />
                            <ErrorLabel content={errorOnStartDepreciation} />
                        </div>

                        {/* Phương pháp khấu hao */}
                        <div className={`form-group ${!errorOnDepreciationType ? "" : "has-error"}`}>
                            <label htmlFor="depreciationType">{translate('asset.general_information.depreciation_type')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`depreciationType${id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={depreciationType}
                                items={[
                                    { value: '', text: translate('asset.depreciation.select_depreciation_type') },
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
                                    placeholder='Sản lượng theo công suất thiết kế' autoComplete="off" />
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

                                {/* Bảng thông tin chi tiết */}
                                <table className="table">
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
                                                        <div className={`form-group ${(parseInt(errorOnMonthPosition) === index && errorOnMonth) ? "has-error" : ""}`}>
                                                            <DatePicker
                                                                id={index}
                                                                dateFormat="month-year"
                                                                value={x.month}
                                                                onChange={(e) => this.handleMonthChange(e, index)}
                                                            />
                                                            {(parseInt(errorOnMonthPosition) === index && errorOnMonth) && <ErrorLabel content={errorOnMonth} />}
                                                        </div>
                                                    </td>
                                                    <td style={{ paddingLeft: '0px' }}>
                                                        <div className={`form-group ${(parseInt(errorOnValuePosition) === index && errorOnValue) ? "has-error" : ""}`}>
                                                            <input className="form-control" type="number" value={x.unitsProducedDuringTheYear} name="unitsProducedDuringTheYears" style={{ width: "100%" }} onChange={(e) => this.handleChangeValue(e, index)} />
                                                            {(parseInt(errorOnValuePosition) === index && errorOnValue) && <ErrorLabel content={errorOnValue} />}
                                                        </div>
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                                    </td>
                                                </tr>
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        }
                    </fieldset>
                </div>
            </div>
        );
    }
};

const depreciationTab = connect(null, null)(withTranslate(DepreciationTab));

export { depreciationTab as DepreciationTab };

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, ErrorLabel, SelectBox } from '../../../../../common-components';

class DisposalTab extends Component {
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
     * Bắt sự kiện thay đổi Thời gian thanh lý
     */
    handleDisposalDateChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                disposalDate: value,
            }
        });
        this.props.handleChange("disposalDate", value);
    }

    /**
     * Bắt sự kiện thay đổi hình thức thanh lý
     */
    handleDisposalTypeChange = (value) => {
        this.setState({
            disposalType: value[0]
        })
        this.props.handleChange('disposalType', value[0]);
    }

    /**
     * Bắt sự kiện thay đổi giá trị thanh lý
     */
    handleDisposalCostChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                disposalCost: value
            }
        });
        this.props.handleChange("disposalCost", value);
    }

    /**
     * Bắt sự kiện thay đổi nội dung thanh lý
     */
    handleDisposalDescriptionChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                disposalDesc: value
            }
        });
        this.props.handleChange("disposalDesc", value);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                disposalDate: nextProps.disposalDate,
                disposalType: nextProps.disposalType,
                disposalCost: nextProps.disposalCost,
                disposalDesc: nextProps.disposalDesc,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id } = this.props;
        const { translate } = this.props;
        const { disposalDate, disposalType, disposalCost, disposalDesc } = this.state;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {/* Thông tin thanh lý */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('asset.general_information.disposal_information')}</h4></legend>

                        {/* Thời gian thanh lý */}
                        <div className={`form-group`}>
                            <label htmlFor="disposalDate">{translate('asset.general_information.disposal_date')}</label>
                            <DatePicker
                                id={`disposalDate${id}`}
                                value={disposalDate ? this.formatDate(disposalDate) : ''}
                                onChange={this.handleDisposalDateChange}
                            />
                        </div>

                        {/* Hình thức thanh lý */}
                        <div className="form-group">
                            <label htmlFor="disposalType">{translate('asset.general_information.disposal_type')}</label>
                            <SelectBox
                                id={`disposalType${id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={disposalType}
                                items={[
                                    { value: '', text: '---Chọn hình thức thanh lý---' },
                                    { value: '1', text: translate('asset.asset_info.destruction') },
                                    { value: '2', text: translate('asset.asset_info.sale') },
                                    { value: '3', text: translate('asset.asset_info.give') },
                                ]}
                                onChange={this.handleDisposalTypeChange}
                            />
                        </div>

                        {/* Giá trị thanh lý */}
                        <div className={`form-group`}>
                            <label htmlFor="disposalCost">{translate('asset.general_information.disposal_price')} (VNĐ)</label><br />
                            <input type="number" className="form-control" name="disposalCost" value={disposalCost} onChange={this.handleDisposalCostChange}
                                placeholder={translate('asset.general_information.disposal_price')} autoComplete="off" />
                        </div>

                        {/* Nội dung thanh */}
                        <div className={`form-group`}>
                            <label htmlFor="disposalDesc">{translate('asset.general_information.disposal_content')}</label><br />
                            <input type="text" className="form-control" name="disposalDesc" value={disposalDesc} onChange={this.handleDisposalDescriptionChange}
                                placeholder={translate('asset.general_information.disposal_content')} autoComplete="off" />
                        </div>
                    </fieldset>
                </div>
            </div>
        );
    }
};

const disposalTab = connect(null, null)(withTranslate(DisposalTab));

export { disposalTab as DisposalTab };

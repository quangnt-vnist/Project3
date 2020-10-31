import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

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

    convertDisposalType = (type) => {
        const { translate } = this.props;

        if (type === '1') {
            return translate('asset.asset_info.destruction');
        }
        else if (type === '2') {
            return translate('asset.asset_info.sale')
        }
        else if (type === '3') {
            return translate('asset.asset_info.give')
        }
        else {
            return 'Type is deleted'
        }
    }

    render() {
        const { id } = this.props;
        const { translate } = this.props;
        const { disposalDate, disposalType, disposalCost, disposalDesc } = this.state;

        var formater = new Intl.NumberFormat();

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {/* Thông tin thanh lý */}
                    <fieldset className="scheduler-border">
                        {/* <legend className="scheduler-border"><h4 className="box-title">{translate('asset.general_information.disposal_information')}</h4></legend> */}

                        <div className="form-group" style={{ marginTop: "10px" }}>
                            <strong>{translate('asset.general_information.disposal_date')}&emsp; </strong>
                            {disposalDate ? this.formatDate(disposalDate) : ''}
                        </div>
                        <div className="form-group">
                            <strong>{translate('asset.general_information.disposal_type')}&emsp; </strong>
                            {disposalType ? this.convertDisposalType(disposalType) : ''}
                        </div>
                        <div className="form-group">
                            <strong>{translate('asset.general_information.disposal_price')}&emsp; </strong>
                            {disposalCost ? formater.format(parseInt(disposalCost)) : ''} VNĐ
                        </div>
                        <div className="form-group">
                            <strong>{translate('asset.general_information.disposal_content')}&emsp; </strong>
                            {disposalDesc}
                        </div>
                    </fieldset>
                </div>
            </div>
        );
    }
};

const disposalTab = connect(null, null)(withTranslate(DisposalTab));

export { disposalTab as DisposalTab };
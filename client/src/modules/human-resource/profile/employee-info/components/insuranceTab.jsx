import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ExportExcel } from '../../../../../common-components'

class InsurranceTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm , false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date;

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                socialInsuranceDetails: nextProps.socialInsuranceDetails,
                healthInsuranceNumber: nextProps.employee ? nextProps.employee.healthInsuranceNumber : '',
                healthInsuranceStartDate: nextProps.employee ? nextProps.employee.healthInsuranceStartDate : '',
                healthInsuranceEndDate: nextProps.employee ? nextProps.employee.healthInsuranceEndDate : '',
                socialInsuranceNumber: nextProps.employee ? nextProps.employee.socialInsuranceNumber : '',
            }
        } else {
            return null;
        }
    }

    /**
     * Function chyển đổi quá trình đóng bảo hiểm thành dạng dữ liệu dùng export
     * @param {*} data : quá trình đóng bảo hiểm
     */
    convertDataToExportData = (data) => {
        const { translate, employee } = this.props;

        data = data.map((x, index) => {
            return {
                STT: index + 1,
                startDate: this.formatDate(x.startDate, true),
                endDate: this.formatDate(x.endDate, true),
                company: x.company,
                position: x.position
            }
        })
        let exportData = {
            fileName: translate('human_resource.profile.employee_info.export_bhxh'),
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    sheetTitle: `${translate('human_resource.profile.employee_info.export_bhxh')}: ${employee.fullName} - ${employee.employeeNumber}`,
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate('human_resource.stt') },
                                { key: "startDate", value: translate('human_resource.profile.from_month_year') },
                                { key: "endDate", value: translate('human_resource.profile.to_month_year') },
                                { key: "company", value: translate('human_resource.profile.unit') },
                                { key: "position", value: translate('table.position') }
                            ],
                            data: data
                        },
                    ]
                },
            ]
        }
        return exportData
    }


    render() {
        const { translate } = this.props;

        const { id, healthInsuranceNumber, healthInsuranceStartDate, healthInsuranceEndDate, socialInsuranceNumber, socialInsuranceDetails } = this.state;

        let exportData = this.convertDataToExportData(socialInsuranceDetails);

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {/* Thông tin bảo hiểm y tê */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.bhyt')}</h4></legend>
                        <div className="row">
                            {/* Mã bảo hiểm y tế */}
                            <div className="form-group col-md-4" >
                                <strong>{translate('human_resource.profile.number_BHYT')}&emsp; </strong>
                                {healthInsuranceNumber}
                            </div>
                            {/* Ngày có hiệu lực */}
                            <div className="form-group col-md-4" >
                                <strong>{translate('human_resource.profile.start_date')}&emsp; </strong>
                                {this.formatDate(healthInsuranceStartDate)}
                            </div>
                            {/* Ngày hết hiệu lực */}
                            <div className="form-group col-md-4" >
                                <strong>{translate('human_resource.profile.end_date_certificate')}&emsp; </strong>
                                {this.formatDate(healthInsuranceEndDate)}
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.bhxh')}</h4></legend>
                        {/* Mã bảo hiểm xã hội */}
                        <div className="form-group">
                            <strong>{translate('human_resource.profile.number_BHXH')}&emsp; </strong>
                            {socialInsuranceNumber}
                        </div>
                        <ExportExcel id="detail-export-bhxh" buttonName={translate('human_resource.name_button_export')} exportData={exportData} style={{ marginBottom: 10 }} />
                        <h4 className="col-md-6" style={{ paddingLeft: 0, fontSize: 16 }}>{translate('human_resource.profile.bhxh_process')}:</h4>
                        <table className="table table-striped table-bordered table-hover " style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('human_resource.profile.from_month_year')}</th>
                                    <th>{translate('human_resource.profile.to_month_year')}</th>
                                    <th>{translate('human_resource.profile.unit')}</th>
                                    <th>{translate('table.position')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (socialInsuranceDetails && socialInsuranceDetails.length !== 0) &&
                                    socialInsuranceDetails.map((x, index) => (
                                        <tr key={index}>
                                            <td>{this.formatDate(x.startDate, true)}</td>
                                            <td>{this.formatDate(x.endDate, true)}</td>
                                            <td>{x.company}</td>
                                            <td>{x.position}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {(!socialInsuranceDetails || socialInsuranceDetails.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
                    </fieldset>
                </div>
            </div>
        );
    }
};

const tabInsurrance = connect(null, null)(withTranslate(InsurranceTab));
export { tabInsurrance as InsurranceTab };
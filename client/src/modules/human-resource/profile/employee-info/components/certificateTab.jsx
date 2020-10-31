import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AuthActions } from '../../../../auth/redux/actions';
class CertificateTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};

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
                degrees: nextProps.degrees,
                certificates: nextProps.certificates,
            }
        } else {
            return null;
        }
    }

    requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        this.props.downloadFile(path, fileName)
    }

    render() {
        const { translate } = this.props;

        const { id, degrees, certificates } = this.state;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {/* Danh sách bằng cấp */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.diploma')}</h4></legend>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>{translate('human_resource.profile.name_diploma')}</th>
                                    <th>{translate('human_resource.profile.diploma_issued_by')}</th>
                                    <th>{translate('human_resource.profile.graduation_year')}</th>
                                    <th>{translate('human_resource.profile.ranking_learning')}</th>
                                    <th>{translate('human_resource.profile.attached_files')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (degrees && degrees.length !== 0) &&
                                    degrees.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.issuedBy}</td>
                                            <td>{x.year}</td>
                                            <td>{translate(`human_resource.profile.${x.degreeType}`)}</td>
                                            <td>{!x.urlFile ? translate('human_resource.profile.no_files') :
                                                <a className='intable'
                                                    style={{ cursor: "pointer" }}
                                                    onClick={(e) => this.requestDownloadFile(e, `.${x.urlFile}`, x.name)}>
                                                    <i className="fa fa-download"> &nbsp;Download!</i>
                                                </a>
                                            }</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            (!degrees || degrees.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                    {/* Danh sách chứng chỉ */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.certificate')}</h4></legend>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('human_resource.profile.name_certificate')}</th>
                                    <th>{translate('human_resource.profile.issued_by')}</th>
                                    <th>{translate('human_resource.profile.date_issued')}</th>
                                    <th>{translate('human_resource.profile.end_date_certificate')}</th>
                                    <th>{translate('human_resource.profile.attached_files')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    certificates && certificates.length !== 0 &&
                                    certificates.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.issuedBy}</td>
                                            <td>{this.formatDate(x.startDate)}</td>
                                            <td>{this.formatDate(x.endDate)}</td>
                                            <td>{!x.urlFile ? translate('human_resource.profile.no_files') :
                                                <a className='intable'
                                                    style={{ cursor: "pointer" }}
                                                    onClick={(e) => this.requestDownloadFile(e, `.${x.urlFile}`, x.name)}>
                                                    <i className="fa fa-download"> &nbsp;Download!</i>
                                                </a>
                                            }</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {(!certificates || certificates.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
                    </fieldset>
                </div>
            </div>

        );
    }
};

const actionCreators = {
    downloadFile: AuthActions.downloadFile,
};

const tabCertificate = connect(null, actionCreators)(withTranslate(CertificateTab));
export { tabCertificate as CertificateTab };
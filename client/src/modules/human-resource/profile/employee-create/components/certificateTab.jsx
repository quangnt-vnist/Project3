import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DegreeAddModal, CertificateAddModal, DegreeEditModal, CertificateEditModal } from './combinedContent';

import { AuthActions } from '../../../../auth/redux/actions';

class CertificateTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     *  Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
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

    /**
     * Bắt sự kiện click edit bằng cấp
     * @param {*} value : Dữ liệu bằng cấp
     * @param {*} index : Số thứ tự bằng cấp muốn chỉnh sửa
     */
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-certificate-editCertificate${index}`).modal('show');
    }

    /**
     * Bắt sự kiện click edit chứng chỉ
     * @param {*} value : Dữ liệu chứng chỉ
     * @param {*} index : Số thứ tự chứng chỉ muốn chỉnh sửa
     */
    handleEditShort = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRowCertificates: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-certificateShort-editCertificateShort${index}`).modal('show');
    }

    /**
     * Function thêm thông tin bằng cấp
     * @param {*} data : Dữ liệu thông tin bằng cấp thêm
     */
    handleAddDegree = async (data) => {
        let { degrees } = this.state;
        await this.setState({
            degrees: [...degrees, {
                ...data
            }]
        })
        this.props.handleAddDegree(this.state.degrees, data)

    }

    /**
     * Function chỉnh sửa thông tin bằng cấp
     * @param {*} data : Dữ liệu thông tin bằng cấp
     */
    handleEditDegree = async (data) => {
        let { degrees } = this.state;
        degrees[data.index] = data;
        await this.setState({
            degrees: degrees
        })
        this.props.handleEditDegree(degrees, data)
    }

    /**
     * Function thêm thông tin chứng chỉ
     * @param {*} data : Dữ liệu thông tin chứng chỉ muốn thêm
     */
    handleAddCertificate = async (data) => {
        let { certificates } = this.state;
        await this.setState({
            certificates: [...certificates, {
                ...data
            }]
        })
        this.props.handleAddCertificate(this.state.certificates, data)
    }

    /**
     * Function chỉnh sửa thông tin chứng chỉ
     * @param {*} data : Dữ liệu thông tin chứng chỉ muốn chỉnh sửa
     */
    handleEditCertificate = async (data) => {
        let { certificates } = this.state;
        certificates[data.index] = data;
        await this.setState({
            certificates: certificates
        })
        this.props.handleEditCertificate(certificates, data)
    }

    /**
     * Function xoá bằng cấp
     * @param {*} index : Số thứ tự bằng cấp muốn xoá
     */
    handleDeleteDegree = async (index) => {
        let { degrees } = this.state;
        let data = degrees[index];
        degrees.splice(index, 1);
        await this.setState({
            ...this.state,
            degrees: [...degrees]
        })
        this.props.handleDeleteDegree(degrees, data)
    }

    /**
     * Function xoá chứng chỉ
     * @param {*} index : Số thứ tự chứng chỉ muốn xoá
     */
    handleDeleteCertificate = async (index) => {
        let { certificates } = this.state;
        let data = certificates[index];
        certificates.splice(index, 1);
        await this.setState({
            ...this.state,
            certificates: [...certificates]
        })
        this.props.handleDeleteCertificate(certificates, data)
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

    /**
     * function dowload file
     * @param {*} e 
     * @param {*} path : Đường dẫn file
     * @param {*} fileName : Tên file dùng để lưu
     */
    requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        this.props.downloadFile(path, fileName)
    }

    render() {
        const { translate } = this.props;

        const { id } = this.props;

        const { degrees, certificates, currentRow, currentRowCertificates } = this.state;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {/* Danh sách bằng cấp */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.diploma')}</h4></legend>
                        <DegreeAddModal handleChange={this.handleAddDegree} id={`addCertificate${id}`} />
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>{translate('human_resource.profile.name_diploma')}</th>
                                    <th>{translate('human_resource.profile.diploma_issued_by')}</th>
                                    <th>{translate('human_resource.profile.graduation_year')}</th>
                                    <th>{translate('human_resource.profile.ranking_learning')}</th>
                                    <th>{translate('human_resource.profile.attached_files')}</th>
                                    <th style={{ width: '120px' }}>{translate('general.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {degrees && degrees.length !== 0 &&
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
                                            <td>
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.profile.edit_diploma')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteDegree(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (!degrees || degrees.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>

                    {/* Danh sách chứng chỉ */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.certificate')}</h4></legend>
                        <CertificateAddModal handleChange={this.handleAddCertificate} id={`addCertificateShort${id}`} />
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('human_resource.profile.name_certificate')}</th>
                                    <th>{translate('human_resource.profile.issued_by')}</th>
                                    <th>{translate('human_resource.profile.date_issued')}</th>
                                    <th>{translate('human_resource.profile.end_date_certificate')}</th>
                                    <th>{translate('human_resource.profile.attached_files')}</th>
                                    <th style={{ width: '120px' }}>{translate('general.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {certificates && certificates.length !== 0 &&
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
                                            <td>
                                                <a onClick={() => this.handleEditShort(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.profile.edit_certificate')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteCertificate(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (!certificates || certificates.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
                {   /** Form chỉnh sửa thông tin bằng cấp */
                    currentRow !== undefined &&
                    <DegreeEditModal
                        id={`editCertificate${currentRow.index}`}
                        _id={currentRow._id}
                        index={currentRow.index}
                        name={currentRow.name}
                        issuedBy={currentRow.issuedBy}
                        year={currentRow.year}
                        degreeType={currentRow.degreeType}
                        file={currentRow.file}
                        urlFile={currentRow.urlFile}
                        fileUpload={currentRow.fileUpload}
                        handleChange={this.handleEditDegree}
                    />
                }
                {   /** Form chỉnh sửa thông tin chứng chỉ*/
                    currentRowCertificates !== undefined &&
                    <CertificateEditModal
                        id={`editCertificateShort${currentRowCertificates.index}`}
                        _id={currentRowCertificates._id}
                        index={currentRowCertificates.index}
                        name={currentRowCertificates.name}
                        issuedBy={currentRowCertificates.issuedBy}
                        startDate={this.formatDate(currentRowCertificates.startDate)}
                        endDate={this.formatDate(currentRowCertificates.endDate)}
                        file={currentRowCertificates.file}
                        urlFile={currentRowCertificates.urlFile}
                        fileUpload={currentRowCertificates.fileUpload}
                        handleChange={this.handleEditCertificate}
                    />
                }
            </div>
        );
    }
};

const actionCreators = {
    downloadFile: AuthActions.downloadFile,
};

const certificateTab = connect(null, actionCreators)(withTranslate(CertificateTab));
export { certificateTab as CertificateTab };
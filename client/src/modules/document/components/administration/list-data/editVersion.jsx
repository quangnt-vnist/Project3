import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, DatePicker, UploadFile } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import { getStorage } from "../../../../../config";

class EditVersion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            documentFile: [],
            documentFileScan: [],
        }
    }

    handleChangeVersionName = (e) => {
        const value = e.target.value;
        this.validateVersionName(value, true)
    }

    handleIssuingDate = (value) => {
        this.setState(state => {
            return {
                ...state,
                issuingDate: value,
            }
        })
    }
    handleEffectiveDate = (value) => {
        this.setState(state => {
            return {
                ...state,
                effectiveDate: value,
            }
        })
    }

    handleExpiredDate = (value) => {
        this.setState(state => {
            return {
                ...state,
                expiredDate: value,
            }
        })
    }
    handleUploadFile = (file) => {
        file = file.map(x => {
            return {
                fileName: x.fileName,
                url: x.urlFile,
                fileUpload: x.fileUpload
            }
        })
        this.setState(state => {
            return {
                ...state,
                documentFile: file
            }
        });
    }

    handleUploadFileScan = (file) => {
        file = file.map(x => {
            return {
                fileName: x.fileName,
                url: x.urlFile,
                fileUpload: x.fileUpload
            }
        })
        this.setState(state => {
            return {
                ...state,
                documentFileScan: file
            }
        });
    }
    /**
     * Function format dữ liệu Date thành string
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
        } else {
            return date
        }
    }
    validateVersionName = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        let val = value ? value.trim() : null;
        if (!val) {
            msg = translate('document.doc_version.no_blank_version_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    versionName: value,
                    errorVersionName: msg,
                }
            })
        }
        return msg === undefined;
    }



    isValidateForm = () => {
        return this.validateVersionName(this.state.versionName, false);
    }

    convertISODate = (dateStr) => {
        if (dateStr) {
            if (!dateStr.includes(':')) {
                let splitter = dateStr.split('-');
                let isoDate = new Date(splitter[2], splitter[1] - 1, splitter[0])
                return isoDate;
            }
            else
                return dateStr;
        }
        return null;
    }

    save = () => {
        const formData = new FormData();
        const { documentId, versionId, versionName, issuingDate, effectiveDate, expiredDate, documentFile, documentFileScan } = this.state;
        let title = "", descriptions = "";
        title = "Chỉnh sửa phiên bản";
        if (versionName !== this.props.versionName) {
            formData.append('versionName', versionName);
            descriptions += "Tên phiên bản mới: " + versionName + ". "
        }
        if (issuingDate !== this.props.issuingDate) {
            let date = issuingDate.split('-');
            let issuing_date = new Date(date[2], date[1], date[0]);
            formData.append('issuingDate', issuing_date);
            descriptions += "Ngày ban hành " + issuingDate + ". ";
        }
        if (effectiveDate !== this.props.effectiveDate) {
            let date = effectiveDate.split('-');
            let effective_date = new Date(date[2], date[1], date[0]);
            formData.append('effectiveDate', effective_date);
            descriptions += "Ngày hiệu lực " + effectiveDate + ". ";
        }
        if (expiredDate !== this.props.expiredDate) {
            let date = expiredDate.split('-');
            let expired_date = new Date(date[2], date[1], date[0]);
            formData.append('expiredDate', expired_date);
            descriptions += "Ngày hết hạn " + expiredDate + ". ";
        }
        if (documentFile && documentFile.length) {
            documentFile.forEach(x => {
                formData.append('file', x.fileUpload);
            })
            descriptions += "Thêm file tài liệu. "
        }
        if (documentFileScan && documentFileScan.length) {
            documentFileScan.forEach(x => {
                formData.append('fileScan', x.fileUpload);
            })
            descriptions += "Thêm file scan tài liệu";
        }
        formData.append('versionId', versionId);
        formData.append('title', title);
        formData.append('creator', getStorage("userId"))
        formData.append('descriptions', descriptions);
        this.props.editDocument(documentId, formData, 'EDIT_VERSION');
        console.log('eeeeeeeeee', this.convertISODate(issuingDate));
        console.log('aaaaaaaaaaaaaa', this.convertISODate(effectiveDate));
        this.props.updateDocumentVersions({
            _id: versionId,
            versionName: versionName,
            issuingDate: this.convertISODate(issuingDate),
            effectiveDate: this.convertISODate(effectiveDate),
            expiredDate: this.convertISODate(expiredDate),
            file: documentFile,
            scannedFileOfSignedDocument: documentFileScan,
        })
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.versionId !== prevState.versionId
        ) {
            return {
                ...prevState,
                documentId: nextProps.documentId,
                versionId: nextProps.versionId,
                versionName: nextProps.versionName,
                issuingDate: nextProps.issuingDate,
                effectiveDate: nextProps.effectiveDate,
                expiredDate: nextProps.expiredDate,
                documentFile: nextProps.documentFile,
                documentFileScan: nextProps.documentFileScan,
            }
        }
        else {
            return null;
        }
    }

    render() {
        const { translate } = this.props;
        const { versionId, versionName, issuingDate, effectiveDate, expiredDate } = this.state;
        return (
            <DialogModal
                size="25"
                modalID="modal-edit-document-version"
                formID="form-edit-document-version"
                title={translate('document.edit')}
                func={this.save}
                disableSubmit={!this.isValidateForm()}
            >
                <React.Fragment>
                    <div className={`form-group `}>
                        <label>{translate('document.doc_version.name')}<span className="text-red">*</span></label>
                        <input type="text" onChange={this.handleChangeVersionName} value={versionName} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>{translate('document.upload_file')}</label>
                        <UploadFile onChange={this.handleUploadFile} />

                    </div>
                    <div className="form-group">
                        <label>{translate('document.upload_file_scan')}</label>
                        <UploadFile onChange={this.handleUploadFileScan} />

                    </div>
                    <div className="form-group">
                        <label>{translate('document.doc_version.issuing_date')}</label>
                        <DatePicker
                            id={`document-edit-version-issuing-date-${versionId}`}
                            value={this.formatDate(issuingDate)}
                            onChange={this.handleIssuingDate}
                        />
                    </div>
                    <div className="form-group">
                        <label>{translate('document.doc_version.effective_date')}</label>
                        <DatePicker
                            id={`document-edit-version-effective-date-${versionId}`}
                            value={this.formatDate(effectiveDate)}
                            onChange={this.handleEffectiveDate}
                        />
                    </div>
                    <div className="form-group">
                        <label>{translate('document.doc_version.expired_date')}</label>
                        <DatePicker
                            id={`document-edit-version-expired-date-${versionId}`}
                            value={this.formatDate(expiredDate)}
                            onChange={this.handleExpiredDate}
                        />
                    </div>
                </React.Fragment>
            </DialogModal>
        )

    }
}
const mapStateToProps = state => state;

const mapDispatchToProps = {
    editDocument: DocumentActions.editDocument,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditVersion));


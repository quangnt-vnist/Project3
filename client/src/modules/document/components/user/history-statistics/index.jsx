import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DateTimeConverter, ToolTip } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import { RoleActions } from '../../../../super-admin/role/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { getStorage } from '../../../../../config';
import DocumentInformation from './documentInformation';

class DocumentUserHistoryStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = { option: 'name', value: '', limit: 5, page: 1 }
    }

    componentDidMount() {
        this.props.getAllRoles();
        this.props.getAllDepartments();
        this.props.getAllDocuments(getStorage('currentRole'));
        this.props.getAllDocuments(getStorage('currentRole'), { page: this.state.page, limit: this.state.limit });
        this.props.getUserDocumentStatistics('downloaded');
        this.props.getUserDocumentStatistics('common');
        this.props.getUserDocumentStatistics('latest');
    }

    toggleDocumentInformation = async (data) => {
        await this.setState({
            currentRow: data
        });
        window.$('#modal-document-information-statistics').modal('show');
        this.props.increaseNumberView(data._id)
    }

    requestDownloadDocumentFile = (id, fileName, numberVersion) => {
        this.props.downloadDocumentFile(id, fileName, numberVersion);
    }

    requestDownloadDocumentFileScan = (id, fileName, numberVersion) => {
        this.props.downloadDocumentFileScan(id, fileName, numberVersion);
    }

    render() {
        const { translate } = this.props;
        const { user } = this.props.documents;
        const { list, paginate } = user.data;
        const { downloaded, common, latest } = user;
        const { isLoading } = this.props.documents;
        const { currentRow } = this.state;

        return (
            <React.Fragment>
                {
                    currentRow !== undefined &&
                    <DocumentInformation
                        documentId={currentRow._id}
                        documentName={currentRow.name}
                        documentDescription={currentRow.description}
                        documentCategory={currentRow.category._id}
                        documentDomains={currentRow.domains.map(domain => domain._id)}
                        documentIssuingBody={currentRow.issuingBody}
                        documentOfficialNumber={currentRow.officialNumber}
                        documentSigner={currentRow.signer}
                        documentVersions={currentRow.versions}

                        documentRelationshipDescription={currentRow.relationshipDescription}
                        documentRelationshipDocuments={currentRow.relationshipDocuments}

                        documentRoles={currentRow.roles}

                        documentArchivedRecordPlaceInfo={currentRow.archivedRecordPlaceInfo}
                        documentArchivedRecordPlaceOrganizationalUnit={currentRow.archivedRecordPlaceOrganizationalUnit}
                        documentArchivedRecordPlaceManager={currentRow.archivedRecordPlaceManager}
                    />
                }
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Những tài liệu văn bản đã download</legend>
                    <table className="table-hover" style={{ width: '100%' }} id="table-manage-user-document-downloaded">
                        <thead>
                            <tr>
                                <th>{translate('document.name')}</th>
                                <th>{translate('document.description')}</th>
                                <th>{translate('document.issuing_date')}</th>
                                <th>{translate('document.effective_date')}</th>
                                <th>{translate('document.expired_date')}</th>
                                <th>{translate('document.upload_file')}</th>
                                <th>{translate('document.upload_file_scan')}</th>
                                <th>{translate('document.views')}</th>
                                <th>{translate('document.downloads')}</th>
                                <th style={{ width: '10px', textAlign: 'center' }}>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                downloaded.length > 0 ?
                                    downloaded.map(doc =>
                                        <tr key={doc._id}>
                                            <td>{doc.name}</td>
                                            <td>{doc.description}</td>
                                            <td><DateTimeConverter dateTime={doc.versions[doc.versions.length - 1].issuingDate} type="DD-MM-YYYY" /></td>
                                            <td><DateTimeConverter dateTime={doc.versions[doc.versions.length - 1].effectiveDate} type="DD-MM-YYYY" /></td>
                                            <td><DateTimeConverter dateTime={doc.versions[doc.versions.length - 1].expiredDate} type="DD-MM-YYYY" /></td>
                                            <td><a href="#" onClick={() => this.requestDownloadDocumentFile(doc._id, doc.name, doc.versions.length - 1)}><u>{translate('document.download')}</u></a></td>
                                            <td><a href="#" onClick={() => this.requestDownloadDocumentFileScan(doc._id, "SCAN_" + doc.name, doc.versions.length - 1)}><u>{translate('document.download')}</u></a></td>
                                            <td>{doc.numberOfView}<ToolTip type="latest_history" dataTooltip={doc.views.map(view => {
                                                return (
                                                    <React.Fragment>
                                                        {view.viewer + ", "} <DateTimeConverter dateTime={view.time} />
                                                    </React.Fragment>
                                                )
                                            })} /></td>
                                            <td>{doc.numberOfDownload}<ToolTip type="latest_history" dataTooltip={doc.downloads.map(download => {
                                                return (
                                                    <React.Fragment>
                                                        {download.downloader + ", "} <DateTimeConverter dateTime={download.time} />
                                                    </React.Fragment>
                                                )
                                            })} /></td>
                                            <td style={{ width: '10px' }}>
                                                <a className="text-green" title={translate('document.edit')} onClick={() => this.toggleDocumentInformation(doc)}><i className="material-icons">visibility</i></a>
                                            </td>
                                        </tr>) :
                                    isLoading ?
                                        <tr><td colSpan={10}>{translate('general.loading')}</td></tr> : <tr><td colSpan={10}>{translate('general.no_data')}</td></tr>
                            }

                        </tbody>
                    </table>
                </fieldset>

                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Những tài liệu văn bản phổ biến</legend>
                    <table className="table-hover" style={{ width: '100%' }} id="table-manage-user-document-downloaded">
                        <thead>
                            <tr>
                                <th>{translate('document.name')}</th>
                                <th>{translate('document.description')}</th>
                                <th>{translate('document.issuing_date')}</th>
                                <th>{translate('document.effective_date')}</th>
                                <th>{translate('document.expired_date')}</th>
                                <th>{translate('document.upload_file')}</th>
                                <th>{translate('document.upload_file_scan')}</th>
                                <th>{translate('document.views')}</th>
                                <th>{translate('document.downloads')}</th>
                                <th style={{ width: '10px', textAlign: 'center' }}>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                common.length > 0 ?
                                    common.map(doc =>
                                        <tr key={doc._id}>
                                            <td>{doc.name}</td>
                                            <td>{doc.description}</td>
                                            <td><DateTimeConverter dateTime={doc.versions[doc.versions.length - 1].issuingDate} type="DD-MM-YYYY" /></td>
                                            <td><DateTimeConverter dateTime={doc.versions[doc.versions.length - 1].effectiveDate} type="DD-MM-YYYY" /></td>
                                            <td><DateTimeConverter dateTime={doc.versions[doc.versions.length - 1].expiredDate} type="DD-MM-YYYY" /></td>
                                            <td><a href="#" onClick={() => this.requestDownloadDocumentFile(doc._id, doc.name, doc.versions.length - 1)}><u>{translate('document.download')}</u></a></td>
                                            <td><a href="#" onClick={() => this.requestDownloadDocumentFileScan(doc._id, "SCAN_" + doc.name, doc.versions.length - 1)}><u>{translate('document.download')}</u></a></td>
                                            <td>{doc.numberOfView}<ToolTip type="latest_history" dataTooltip={doc.views.map(view => {
                                                return (
                                                    <React.Fragment>
                                                        {view.viewer + ", "} <DateTimeConverter dateTime={view.time} />
                                                    </React.Fragment>
                                                )
                                            })} /></td>
                                            <td>{doc.numberOfDownload}<ToolTip type="latest_history" dataTooltip={doc.downloads.map(download => {
                                                return (
                                                    <React.Fragment>
                                                        {download.downloader + ", "} <DateTimeConverter dateTime={download.time} />
                                                    </React.Fragment>
                                                )
                                            })} /></td>
                                            <td style={{ width: '10px' }}>
                                                <a className="text-green" title={translate('document.edit')} onClick={() => this.toggleDocumentInformation(doc)}><i className="material-icons">visibility</i></a>
                                            </td>
                                        </tr>) :
                                    isLoading ?
                                        <tr><td colSpan={10}>{translate('general.loading')}</td></tr> : <tr><td colSpan={10}>{translate('general.no_data')}</td></tr>
                            }

                        </tbody>
                    </table>
                </fieldset>

                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Tài liệu mới nhất</legend>
                    <table className="table-hover" style={{ width: '100%' }} id="table-manage-user-document-downloaded">
                        <thead>
                            <tr>
                                <th>{translate('document.name')}</th>
                                <th>{translate('document.description')}</th>
                                <th>{translate('document.issuing_date')}</th>
                                <th>{translate('document.effective_date')}</th>
                                <th>{translate('document.expired_date')}</th>
                                <th>{translate('document.upload_file')}</th>
                                <th>{translate('document.upload_file_scan')}</th>
                                <th>{translate('document.views')}</th>
                                <th>{translate('document.downloads')}</th>
                                <th style={{ width: '10px', textAlign: 'center' }}>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                latest.length > 0 ?
                                    latest.map(doc =>
                                        <tr key={doc._id}>
                                            <td>{doc.name}</td>
                                            <td>{doc.description}</td>
                                            <td><DateTimeConverter dateTime={doc.versions[doc.versions.length - 1].issuingDate} type="DD-MM-YYYY" /></td>
                                            <td><DateTimeConverter dateTime={doc.versions[doc.versions.length - 1].effectiveDate} type="DD-MM-YYYY" /></td>
                                            <td><DateTimeConverter dateTime={doc.versions[doc.versions.length - 1].expiredDate} type="DD-MM-YYYY" /></td>
                                            <td><a href="#" onClick={() => this.requestDownloadDocumentFile(doc._id, doc.name, doc.versions.length - 1)}><u>{translate('document.download')}</u></a></td>
                                            <td><a href="#" onClick={() => this.requestDownloadDocumentFileScan(doc._id, "SCAN_" + doc.name, doc.versions.length - 1)}><u>{translate('document.download')}</u></a></td>
                                            <td>{doc.numberOfView}<ToolTip type="latest_history" dataTooltip={doc.views.map(view => {
                                                return (
                                                    <React.Fragment>
                                                        {view.viewer + ", "} <DateTimeConverter dateTime={view.time} />
                                                    </React.Fragment>
                                                )
                                            })} /></td>
                                            <td>{doc.numberOfDownload}<ToolTip type="latest_history" dataTooltip={doc.downloads.map(download => {
                                                return (
                                                    <React.Fragment>
                                                        {download.downloader + ", "} <DateTimeConverter dateTime={download.time} />
                                                    </React.Fragment>
                                                )
                                            })} /></td>
                                            <td style={{ width: '10px' }}>
                                                <a className="text-green" title={translate('document.edit')} onClick={() => this.toggleDocumentInformation(doc)}><i className="material-icons">visibility</i></a>
                                            </td>
                                        </tr>) :
                                    isLoading ?
                                        <tr><td colSpan={10}>{translate('general.loading')}</td></tr> : <tr><td colSpan={10}>{translate('general.no_data')}</td></tr>
                            }

                        </tbody>
                    </table>
                </fieldset>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllDepartments: DepartmentActions.get,
    getAllRoles: RoleActions.get,
    getAllDocuments: DocumentActions.getDocumentsUserCanView,
    increaseNumberView: DocumentActions.increaseNumberView,
    downloadDocumentFile: DocumentActions.downloadDocumentFile,
    downloadDocumentFileScan: DocumentActions.downloadDocumentFileScan,
    getUserDocumentStatistics: DocumentActions.getUserDocumentStatistics
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DocumentUserHistoryStatistics));
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DateTimeConverter, DataTableSetting, TreeSelect, SelectBox, ExportExcel, PaginateBar } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import { RoleActions } from '../../../../super-admin/role/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { getStorage } from '../../../../../config';
import DocumentInformation from '../documents/documentInformation';
class DocumentNew extends Component {
    constructor(props) {
        super(props);
        this.state = { option: 'name', value: '', limit: 5, page: 1 }
    }

    componentDidMount() {
        this.props.getAllRoles();
        this.props.getAllDepartments();
        this.props.getAllDocuments(getStorage('currentRole'));
        this.props.getAllDocuments(getStorage('currentRole'), { page: this.state.page, limit: this.state.limit });
        this.props.getUserDocumentStatistics('latest', { page: this.state.page, limit: this.state.limit });
    }

    toggleDocumentInformation = async (data) => {
        await this.setState({
            currentRow: data
        });
        window.$('#modal-information-user-document').modal('show');
        this.props.increaseNumberView(data._id)
    }

    requestDownloadDocumentFile = (id, fileName, numberVersion) => {
        this.props.downloadDocumentFile(id, fileName, numberVersion);
    }

    requestDownloadDocumentFileScan = (id, fileName, numberVersion) => {
        this.props.downloadDocumentFileScan(id, fileName, numberVersion);
    }
    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }
    findPath = (select) => {
        const archives = this.props.documents.administration.archives.list;
        let paths = select.map(s => {
            let archive = archives.filter(arch => arch._id === s);
            return archive[0] ? archive[0].path : "";
        })
        return paths;

    }
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
    handleCategoryChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                category: value,
            }
        })
    }
    handleDomainChange = (value) => {
        this.setState({ domain: value });
    }
    handleDomains = value => {
        this.setState({ documentDomains: value });
    }
    handleNameChange = (e) => {
        const value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                name: value.trim(),
            }
        })
    }
    handleArchiveChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                archive: value,
            }
        })
    }

    findRole = (id) => {
        const listRole = this.props.role.list;
        let role = listRole.filter((role) => role._id === id);
        if (role && role.length)
            return role[0].name;
        else return "";
    }

    searchWithOption = async () => {
        let path = this.state.archive ? this.findPath(this.state.archive) : "";
        const data = {
            limit: this.state.limit,
            page: 1,
            name: this.state.name,
            category: this.state.category ? this.state.category[0] : "",
            domains: this.state.domain ? this.state.domain : "",
            archives: path && path.length ? path : "",
        };
        await this.props.getUserDocumentStatistics('latest', data);
    }
    convertDataToExportData = (data) => {
        let newData = [];
        for (let i = 0; i < data.length; i++) {
            let element = {};
            let x = data[i];
            let length = 0;
            let domain = "";
            let length_domains, length_archives, length_relationship, length_roles, length_versions, length_logs, length_views, length_downloads;
            if (x.domains && x.domains.length) {
                element.domains = x.domains[0].name;
                length_domains = x.domains.length;
            } else {
                element.domains = "";
                length_domains = 0;
            }
            if (x.archives && x.archives.length) {
                element.archives = x.archives[0].path;
                length_archives = x.archives.length;
            } else {
                element.archives = "";
                length_archives = 0;
            }
            if (x.roles && x.roles.length) {
                element.roles = this.findRole(x.roles[0]);
                length_roles = x.roles.length;
            } else {
                element.roles = 0;
                length_roles = 0;
            }
            if (x.relationshipDocuments && x.relationshipDocuments.length) {
                element.relationshipDocuments = x.relationshipDocuments[0].name;
                length_relationship = x.relationshipDocuments.length;
            } else {
                element.relationshipDocuments = "";
                length_relationship = 0;
            }
            if (x.versions && x.versions.length) {
                element.versionName = x.versions[0].versionName;
                element.issuingDate = this.formatDate(x.versions[0].issuingDate);
                element.effectiveDate = this.formatDate(x.versions[0].effectiveDate);
                element.expiredDate = this.formatDate(x.versions[0].expiredDate);
                length_versions = x.versions.length;
            } else {
                element.versionName = "";
                element.issuingDate = "";
                element.effectiveDate = "";
                element.expiredDate = "";
                length_versions = 0;
            }
            if (x.views && x.views.length) {
                element.viewer = x.views[0].viewer.name;
                element.timeView = this.formatDate(x.views[0].time);
                length_views = x.views.length;
            } else {
                element.viewer = "";
                element.timeView = "";
                length_views = 0;
            }
            if (x.downloads && x.downloads.length) {
                element.downloader = x.downloads[0].downloader.name;
                element.timeDownload = this.formatDate(x.downloads[0].time);
                length_downloads = x.downloads.length;
            } else {
                element.downloader = "";
                element.timeDownload = "";
                length_downloads = 0;
            }
            if (x.logs && x.logs.length) {
                element.title = x.logs[0].title;
                element.description = x.logs[0].description;
                length_logs = x.logs.length;
            } else {
                element.title = "";
                element.descriptionLogs = "";
                length_logs = 0;
            }
            element.name = x.name;
            element.description = x.description ? x.description : "";
            element.issuingBody = x.issuingBody ? x.issuingBody : "";
            element.signer = x.signer ? x.signer : "";
            element.category = x.category ? x.category.name : "";
            element.relationshipDescription = x.relationshipDescription ? x.relationshipDescription : "";
            element.organizationUnitManager = x.organizationUnitManager ? x.organizationUnitManager.name : "";
            element.officialNumber = x.officialNumber ? x.officialNumber : "";
            let max_length = Math.max(length_domains, length_archives, length_relationship, length_roles, length_versions, length_logs, length_views, length_downloads);

            newData = [...newData, element];
            if (max_length > 1) {
                for (let i = 1; i < max_length; i++) {
                    let object = {
                        name: "",
                        description: "",
                        issuingBody: "",
                        signer: "",
                        category: "",
                        relationshipDescription: "",
                        organizationUnitManager: "",
                        officialNumber: "",
                        domains: i < length_domains ? x.domains[i].name : "",
                        archives: i < length_archives ? x.archives[i].path : "",
                        roles: i < length_roles ? this.findRole(x.roles[i]) : "",
                        relationshipDocuments: i < length_relationship ? x.relationshipDocuments[i].name : "",
                        versionName: i < length_versions ? x.versions[i].versionName : "",
                        issuingDate: i < length_versions ? this.formatDate(x.versions[i].issuingDate) : "",
                        effectiveDate: i < length_versions ? this.formatDate(x.versions[i].effectiveDate) : "",
                        expiredDate: i < length_versions ? this.formatDate(x.versions[i].expiredDate) : "",
                        viewer: i < length_views ? x.views[i].viewer.name : "",
                        timeView: i < length_views ? this.formatDate(x.views[i].time) : "",
                        downloader: i < length_downloads ? x.downloads[i].downloader.name : "",
                        timeDownload: i < length_downloads ? this.formatDate(x.downloads[i].time) : "",
                        title: i < length_logs ? x.logs[i].title : "",
                        descriptionLogs: i < length_logs ? x.logs[i].description : "",

                    }
                    newData = [...newData, object];
                }
            }


        }
        let exportData = {
            fileName: "Bảng thống kê tài liệu",
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle: "Danh sách tài liệu",
                    tables: [
                        {
                            tableName: "Bảng thống kê tài liệu",
                            merges: [{
                                key: "Versions",
                                columnName: "Phiên bản",
                                keyMerge: 'versionName',
                                colspan: 3
                            }, {
                                key: "Views",
                                columnName: "Người đã xem",
                                keyMerge: 'viewer',
                                colspan: 2
                            }, {
                                key: "Downloads",
                                columnName: "Người đã tải",
                                keyMerge: 'downloader',
                                colspan: 2,
                            }, {
                                key: "Logs",
                                columnName: "Lịch sử chỉnh sửa",
                                keyMerge: 'title',
                                colspan: 2,
                            },
                            ],
                            rowHeader: 2,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "name", value: "Tên" },
                                { key: "description", value: "Mô tả" },
                                { key: "category", value: "Loai tài liệu" },
                                { key: "issuingBody", value: "Cơ quan ban hành" },
                                { key: "signer", value: "Người ký" },
                                { key: "relationshipDescription", value: "Mô tả liên kết" },
                                { key: "organizationUnitManager", value: "Cơ quan quản lí" },
                                { key: "domains", value: "Danh mục" },
                                { key: "archives", value: "Địa chỉ lưu trữ" },
                                { key: "roles", value: "Các chức danh được xem" },
                                { key: "versionName", value: "Tên phiên bản" },
                                { key: "issuingDate", value: "Ngày ban hành" },
                                { key: "effectiveDate", value: "Ngày hiệu lực" },
                                { key: "viewer", value: "Người đã xem" },
                                { key: "timeView", value: "Thời gian xem" },
                                { key: "downloader", value: "Người đã tải" },
                                { key: "timeDownload", value: "Người đã tải" },
                                { key: "title", value: "Tiêu đề chỉnh sửa" },
                                { key: "descriptionLogs", value: "Chỉnh sửa chi tiết" },

                            ],
                            data: newData
                        }
                    ]
                },
            ]
        }

        return exportData
    }

    convertData = (data) => {
        let array = data.map(item => {
            return {
                value: item.id,
                text: item.name,
            }
        })
        array.unshift({ value: "", text: "Tất cả các loại" });
        return array;
    }
    render() {
        const { translate } = this.props;
        const { user } = this.props.documents;
        const { isLoading } = this.props.documents;
        const { latest } = user;
        let paginate = latest.paginate;
        const { domains, categories, archives } = this.props.documents.administration;
        const docs = this.props.documents.user.data;
        const { currentRow, archive, category, domain } = this.state;
        const listDomain = domains.list
        const listCategory = this.convertData(categories.list)
        const listArchive = archives.list;
        let list = [];
        if (isLoading === false) {
            list = docs.list;
        }
        let dataExport = [];
        if (isLoading === false) {
            dataExport = latest.list;
        }
        let exportData = dataExport ? this.convertDataToExportData(dataExport) : "";
        return (
            <div className="qlcv">
                <React.Fragment>
                    {
                        currentRow !== undefined &&
                        <DocumentInformation
                            documentId={currentRow._id}
                            documentName={currentRow.name}
                            documentDescription={currentRow.description}
                            documentCategory={currentRow.category ? currentRow.category.name : ""}
                            documentDomains={currentRow.domains ? currentRow.domains.map(domain => domain.name) : []}
                            documentArchives={currentRow.archives ? currentRow.archives.map(archive => archive.path) : []}
                            documentIssuingBody={currentRow.issuingBody}
                            documentOfficialNumber={currentRow.officialNumber}
                            documentSigner={currentRow.signer}
                            documentVersions={currentRow.versions}

                            documentRelationshipDescription={currentRow.relationshipDescription}
                            documentRelationshipDocuments={currentRow.relationshipDocuments ? currentRow.relationshipDocuments.map(document => document.name) : []}

                            documentRoles={currentRow.roles}

                            documentArchivedRecordPlaceInfo={currentRow.archivedRecordPlaceInfo}
                            documentArchivedRecordPlaceOrganizationalUnit={currentRow.archivedRecordPlaceOrganizationalUnit}
                            documentArchivedRecordPlaceManager={currentRow.archivedRecordPlaceManager}
                            documentLogs={currentRow.logs}
                        />
                    }
                    {<ExportExcel id="export-document-downloaded" exportData={exportData} style={{ marginLeft: 5 }} />}
                    <div className="form-inline">
                        <div className="form-group">
                            <label>{translate('document.category')}</label>
                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                id={`stattus-category-new`}
                                style={{ width: "100%" }}
                                items={listCategory}
                                onChange={this.handleCategoryChange}
                                value={category}
                            />
                        </div>
                        <div className="form-group" >
                            <label>{translate('document.store.information')}</label>
                            <TreeSelect
                                id="tree-select-search-archive"
                                data={listArchive}
                                className="form-control"
                                handleChange={this.handleArchiveChange}
                                value={archive}
                                mode="hierarchical"
                                style={{ width: " 100%" }}
                            />
                        </div>

                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label>{translate('document.domain')}</label>
                            <TreeSelect
                                id="tree-select-search-domain"
                                data={listDomain}
                                className="form-control"
                                handleChange={this.handleDomainChange}
                                value={domain}
                                mode="hierarchical"
                                style={{ width: "100%" }}
                            />
                        </div>
                        <div className="form-group">
                            <label>{translate('document.name')}</label>
                            <input type="text" className="form-control" onChange={this.handleNameChange} />
                        </div>

                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" onClick={() => this.searchWithOption()}>{
                                translate('kpi.organizational_unit.management.over_view.search')}</button>
                        </div>
                    </div>
                    <table className="table table-hover table-striped table-bordered" id="table-manage-user-document-downloaded">
                        <thead>
                            <tr>
                                <th>{translate('document.name')}</th>
                                <th>{translate('document.description')}</th>
                                <th>{translate('document.issuing_date')}</th>
                                <th>{translate('document.effective_date')}</th>
                                <th>{translate('document.expired_date')}</th>
                                <th>{translate('document.upload_file')}</th>
                                <th>{translate('document.upload_file_scan')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>
                                    {translate('general.action')}
                                    <DataTableSetting
                                        columnArr={[
                                            translate('document.name'),
                                            translate('document.description'),
                                            translate('document.issuing_date'),
                                            translate('document.effective_date'),
                                            translate('document.expired_date'),
                                            translate('document.upload_file'),
                                            translate('document.upload_file_scan')
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                        tableId="table-manage-user-document-new"
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                paginate && paginate.length > 0 ?
                                    paginate.map(doc =>
                                        <tr key={doc._id}>
                                            <td>{doc.name}</td>
                                            <td>{doc.description}</td>
                                            <td>{doc.versions.length ? this.formatDate(doc.versions[doc.versions.length - 1].issuingDate) : null}</td>
                                            <td>{doc.versions.length ? this.formatDate(doc.versions[doc.versions.length - 1].effectiveDate) : null}</td>
                                            <td>{doc.versions.length ? this.formatDate(doc.versions[doc.versions.length - 1].expiredDate) : null}</td>
                                            <td>
                                                <a href="#" onClick={() => this.requestDownloadDocumentFile(doc._id, doc.name, doc.versions.length - 1)}>
                                                    <u>{doc.versions[doc.versions.length - 1].file ? translate('document.download') : ""}</u>
                                                </a>
                                            </td>
                                            <td>
                                                <a href="#" onClick={() => this.requestDownloadDocumentFileScan(doc._id, "SCAN_" + doc.name, doc.versions.length - 1)}>
                                                    <u>{doc.versions[doc.versions.length - 1].scannedFileOfSignedDocument ? translate('document.download') : ""}</u>
                                                </a>
                                            </td>
                                            <td style={{ width: '10px' }}>
                                                <a className="text-green" title={translate('document.edit')} onClick={() => this.toggleDocumentInformation(doc)}><i className="material-icons">visibility</i></a>
                                            </td>
                                        </tr>) :
                                    isLoading ?
                                        <tr><td colSpan={10}>{translate('general.loading')}</td></tr> : <tr><td colSpan={10}>{translate('general.no_data')}</td></tr>
                            }

                        </tbody>
                    </table>
                    <PaginateBar pageTotal={latest.totalPages} currentPage={latest.page} func={this.setPage} />
                </React.Fragment>
            </div>
        );
    }
    setPage = async (page) => {
        this.setState({ page });
        let path = this.state.archive ? this.findPath(this.state.archive) : "";
        this.setState({ page });
        const data = {
            limit: this.state.limit,
            page: page,
            name: this.state.name,
            category: this.state.category ? this.state.category[0] : "",
            domains: this.state.domain ? this.state.domain : "",
            archives: path && path.length ? path : "",
        };
        await this.props.getUserDocumentStatistics('latest', data);
    }

    setLimit = (number) => {
        if (this.state.limit !== number) {
            this.setState({ limit: number });
            const data = { limit: number, page: this.state.page };
            this.props.getUserDocumentStatistics('latest', data);
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DocumentNew));
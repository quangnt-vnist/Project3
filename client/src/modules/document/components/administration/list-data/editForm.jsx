import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import { DialogModal, ButtonModal, DateTimeConverter, SelectBox, DatePicker, TreeSelect, ErrorLabel, UploadFile } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import moment from 'moment';
import { getStorage } from "../../../../../config";
import EditVersion from "./editVersion";
class EditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            documentVersionName: "",
            page: 1,
            limit: 5,

        }
    }

    handleName = (e) => {
        const value = e.target.value;
        this.validateName(value, true)
    }

    handleCategory = (value) => {
        this.validateCategory(value[0], true);
    }

    handleDomains = value => {
        this.setState({ documentDomains: value });
    }
    handleArchives = value => {
        this.setState({ documentArchives: value });
    }

    handleDescription = (e) => {
        const { value } = e.target;
        this.setState({ documentDescription: value });
    }

    handleIssuingBody = (e) => {
        const value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                documentIssuingBody: value,
            }
        })
    }
    handleOfficialNumber = (e) => {
        const value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                documentOfficialNumber: value,
            }
        })
    }

    handleSigner = (e) => {
        const value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                documentSigner: value,
            }
        })
    }
    handleRelationshipDescription = (e) => {
        const { value } = e.target;
        this.setState({ documentRelationshipDescription: value });
    }
    handleChangeVersionName = (e) => {
        const value = e.target.value;
        this.validateVersionName(value, true)
    }
    handleRelationshipDocuments = value => {
        this.setState({ relatedDocuments: value });
    }

    handleRoles = (value) => {
        this.setState({ documentRoles: value });
    }


    handleArchivedRecordPlaceOrganizationalUnit = (value) => {
        this.setState(state => {
            return {
                ...state,
                documentArchivedRecordPlaceOrganizationalUnit: value[0]
            }
        });
    }

    handleVersionName = (e) => {
        const value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                documentVersionName: value,
            }
        })
    }
    handleArchivedRecordPlaceManager = (e) => {
        const { value } = e.target;
        this.setState(state => {
            return {
                ...state,
                documentArchivedRecordPlace: {
                    ...state.documentArchivedRecordPlace,
                    manager: value
                }
            }
        });
    }

    handleVersionName = (e) => {
        const value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                documentVersionName: value,
            }
        })
    }

    handleIssuingDate = (value) => {
        this.setState(state => {
            return {
                ...state,
                documentIssuingDate: value,
            }
        })
    }

    handleEffectiveDate = (value) => {
        this.setState(state => {
            return {
                ...state,
                documentEffectiveDate: value,
            }
        })
    }

    handleExpiredDate = (value) => {
        this.setState(state => {
            return {
                ...state,
                documentExpiredDate: value,
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


    validateName = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value.trim()) {
            msg = translate('document.no_blank_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    documentName: value,
                    errorName: msg,
                }
            })
        }
        return msg === undefined;
    }


    validateCategory = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.doc_version.no_blank_category');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    documentCategory: value,
                    errorCategory: msg,
                }
            })
        }
        return msg === undefined;
    }
    validateVersionName = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        let val = value.trim();
        if (!val) {
            msg = translate('document.doc_version.no_blank_version_name');
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    documentVersionName: value,
                    errorVersionName: msg,
                }
            })
        }
        return msg === undefined;
    }


    isValidateForm = () => {
        return this.validateName(this.state.documentName, false)
            && this.validateCategory(this.state.documentCategory, false)
    }
    isValidateFormAddVersion = () => {
        return this.validateVersionName(this.state.documentVersionName, false);
    }
    compareArray = (array1, array2) => {
        if (array1 && array2) {
            if (array1.length !== array2.length) {
                return false;
            }
            else {
                for (let i = 0; i < array1.length; i++) {
                    if (array1[i] !== array2[i]) {
                        return false;
                    }
                }
                return true;
            }
        }
    }

    save = () => {
        const {
            documentId,
            documentName,
            documentCategory,
            documentDomains,
            documentArchives,
            documentDescription,
            documentIssuingBody,
            documentOfficialNumber,
            documentSigner,
            documentRelationshipDescription,
            relatedDocuments,
            documentRoles,
            documentArchivedRecordPlaceOrganizationalUnit,
        } = this.state;
        const { role, documents, department } = this.props;
        const categories = documents.administration.categories.list.map(category => { return { value: category._id, text: category.name } });
        const { list } = documents.administration.domains;
        const roleList = role.list.map(role => { return { value: role._id, text: role.name } });
        const relationshipDocs = documents.administration.data.list
        const archives = documents.administration.archives.list;
        let title = "";
        let description = "";
        const formData = new FormData();
        formData.append('name', documentName);
        if (documentName !== this.props.documentName) {
            if (!title.includes("Chỉnh sửa thông tin văn bản.")) {
                title = (title + " Chỉnh sửa thông tin văn bản ");
            }
            description += "Thay đổi tên: " + documentName + ". ";
        }
        if (!this.compareArray(documentCategory, this.props.documentCategory)) {
            if (!title.includes("Chỉnh sửa thông tin văn bản.")) {
                title = (title + "Chỉnh sửa thông tin văn bản.");
            }

            let nameCategory = categories.filter(item => item.value === documentCategory)
            description += "Thay đổi loại tài liệu: " + nameCategory[0].text + ". ";
            formData.append('category', documentCategory);
        }
        if (!this.compareArray(documentDomains, this.props.documentDomains)) {
            if (!title.includes("Chỉnh sửa thông tin văn bản.")) {
                title = (title + " Chỉnh sửa thông tin văn bản");
            }

            description += "Danh mục mới: ";
            let newDomain = [];
            for (let i = 0; i < documentDomains.length; i++) {
                formData.append('domains[]', documentDomains[i]);
                let domain = list.filter(item => item.id === documentDomains[i]);
                newDomain.push(domain[0].name);

            }
            description += newDomain.join(" ") + ". ";
        }
        if (!this.compareArray(documentArchives, this.props.documentArchives)) {

            if (!title.includes("Chỉnh sửa thông tin văn bản.")) {
                title = (title + " Chỉnh sửa thông tin văn bản");
            }
            description += "Địa chỉ lưu trữ mới: ";
            let newArchives = [];
            for (let i = 0; i < documentArchives.length; i++) {
                formData.append('archives[]', documentArchives[i]);
                let archive = archives.filter(item => item.id === documentArchives[i]);
                newArchives.push(archive[0].name);
            }
            description += newArchives.join(" ") + ". ";
        }
        if (documentDescription !== this.props.documentDescription) {
            if (!title.includes("Chỉnh sửa thông tin văn bản.")) {
                title = (title + "Chỉnh sửa thông tin văn bản.");
            }
            description += "Mô tả mới: " + documentDescription + ". ";
            formData.append('description', documentDescription);
        }
        if (documentIssuingBody !== this.props.documentIssuingBody) {
            if (!title.includes("Chỉnh sửa thông tin văn bản.")) {
                title = (title + "Chỉnh sửa thông tin văn bản.");
            }
            description += "Cơ quan ban hành mới: " + documentIssuingBody + ". ";
            formData.append('issuingBody', documentIssuingBody);
        }
        if (documentOfficialNumber !== this.props.documentOfficialNumber) {
            if (!title.includes("Chỉnh sửa thông tin văn bản.")) {
                title = (title + "Chỉnh sửa thông tin văn bản.");
            }
            description += "Số hiệu mới: " + documentOfficialNumber + ". ";
            formData.append('officialNumber', documentOfficialNumber);
        }
        if (documentSigner !== this.props.documentSigner) {
            if (!title.includes("Chỉnh sửa thông tin văn bản.")) {
                title = (title + "Chỉnh sửa thông tin văn bản.");
            }
            description += "Người ký mới: " + documentSigner + ". ";
            formData.append('signer', documentSigner);
        }

        if (documentRelationshipDescription !== this.props.documentRelationshipDescription) {
            if (!title.includes("Chỉnh sửa tài liệu liên kết")) {
                title += "Chỉnh sửa tài liệu liên kết."
            }
            description += "Mô tả liên kết tài liệu mới: ";
            formData.append('relationshipDescription', documentRelationshipDescription);
        }
        if (!this.compareArray(relatedDocuments, this.props.documentRelationshipDocuments)) {
            if (!title.includes("Chỉnh sửa mô tả liên kết.")) {
                title += "Chỉnh sửa mô tả liên kết."
            }
            description += "Tài liệu liên kết mới: "
            let newArray = [];
            for (let i = 0; i < relatedDocuments.length; i++) {
                formData.append('relationshipDocuments[]', relatedDocuments[i]);
                let relationship = relationshipDocs.filter(item => item.id === relatedDocuments[i]);
                newArray.push(relationship[0].name);

            }
            description += newArray.join(" - ") + ".";
        }
        if (documentRoles !== this.props.documentRoles) {
            if (!title.includes("Chỉnh sửa phân quyền")) {
                title += "Chỉnh sửa phân quyền. "
            }
            description += "Các phân quyền mới: "
            for (let i = 0; i < documentRoles.length; i++) {
                formData.append('roles[]', documentRoles[i]);
                let nameRole = roleList.filter(item => item.value === documentRoles[i])
                description += nameRole[0].text + " ";
            }
        }
        if (documentArchivedRecordPlaceOrganizationalUnit !== this.props.documentArchivedRecordPlaceOrganizationalUnit) {
            if (!title.includes("Chỉnh sửa đơn vị quản lí")) {
                title += "Chỉnh sửa đơn vị quản lí"
            }
            let newDepartment;
            newDepartment = department.list.filter(d => d._id === documentArchivedRecordPlaceOrganizationalUnit)
            description += "Đơn vị quản lí mới " + newDepartment[0].name + ". "
            formData.append('archivedRecordPlaceOrganizationalUnit', documentArchivedRecordPlaceOrganizationalUnit);
        }

        if (title) {
            formData.append('title', title);
            formData.append('creator', getStorage("userId"))
        }
        if (description) {
            formData.append('descriptions', description)
        }
        if (title) {
            this.props.editDocument(documentId, formData);
        }
    }
    toggleEditVersion = async (data) => {
        await this.setState({
            currentVersion: data
        });
        window.$('#modal-edit-document-version').modal('show');
    }

    addNewVersion = id => {
        const {
            documentVersionName,
            documentIssuingDate,
            documentEffectiveDate,
            documentExpiredDate,
            documentFile,
            documentFileScan
        } = this.state;
        let title, descriptions;
        title = "Thêm phiên bản mới";
        const formData = new FormData();
        if (documentVersionName) {
            formData.append('versionName', documentVersionName);
            descriptions = "Tên phiên bản mới: " + documentVersionName + ". ";
        }
        if (documentIssuingDate) {
            descriptions += "Ngày ban hành " + moment(documentIssuingDate, "DD-MM-YYYY") + ". ";
            formData.append('issuingDate', moment(documentIssuingDate, "DD-MM-YYYY"));
        }
        if (documentEffectiveDate) {
            descriptions += "Ngày hiệu lực " + moment(documentEffectiveDate, "DD-MM-YYYY") + ". ";
            formData.append('effectiveDate', moment(documentEffectiveDate, "DD-MM-YYYY"));
        }
        if (documentExpiredDate) {
            descriptions += "Ngày hết hạn" + + moment(documentExpiredDate, "DD-MM-YYYY") + ". ";
            formData.append('expiredDate', moment(documentExpiredDate, "DD-MM-YYYY"));
        }
        if (documentFile) {
            descriptions += "Thêm file tài liệu. "
            formData.append('file', documentFile);
        }
        if (documentFileScan) {
            descriptions += "Thêm file scan tài liệu";
            formData.append('fileScan', documentFileScan);
        }

        formData.append('title', title);
        formData.append('creator', getStorage("userId"))
        formData.append('descriptions', descriptions)
        this.props.editDocument(id, formData, 'ADD_VERSION');

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.documentId !== prevState.documentId) {
            return {
                ...prevState,
                documentId: nextProps.documentId,
                documentName: nextProps.documentName,
                documentDescription: nextProps.documentDescription,
                documentCategory: nextProps.documentCategory,
                documentDomains: nextProps.documentDomains,
                documentArchives: nextProps.documentArchives,
                documentIssuingBody: nextProps.documentIssuingBody,
                documentOfficialNumber: nextProps.documentOfficialNumber,
                documentSigner: nextProps.documentSigner,

                documentVersions: nextProps.documentVersions,

                documentRelationshipDescription: nextProps.documentRelationshipDescription,
                relatedDocuments: nextProps.documentRelationshipDocuments.map(item => item.id),

                documentRoles: nextProps.documentRoles,

                documentArchivedRecordPlaceInfo: nextProps.documentArchivedRecordPlaceInfo,
                documentArchivedRecordPlaceOrganizationalUnit: nextProps.documentArchivedRecordPlaceOrganizationalUnit,
                documentArchivedRecordPlaceManager: nextProps.documentArchivedRecordPlaceManager,

                errorName: undefined,

            }
        } else if (nextProps.documentVersions.length !== prevState.documentVersions.length) {
            return {
                ...prevState,
                documentId: nextProps.documentId,
                documentVersions: nextProps.documentVersions,
            }
        } else {
            return null;
        }
    }

    requestDownloadDocumentFile = (id, fileName, numberVersion) => {
        this.props.downloadDocumentFile(id, fileName, numberVersion);
    }

    requestDownloadDocumentFileScan = (id, fileName, numberVersion) => {
        this.props.downloadDocumentFileScan(id, fileName, numberVersion);
    }
    findPath = (archives, select) => {
        let paths = select.map(s => {
            let archive = archives.filter(arch => arch._id === s);
            return archive[0] ? archive[0].path : "";
        })
        return paths;

    }
    deleteDocumentVersion = (documentId, versionId, info) => {
        const { translate } = this.props;
        Swal.fire({
            html: `<h4 style="color: red"><div>${translate('document.delete')}</div> <div>"${info}" ?</div></h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                let title = "Xóa phiên bản ";
                let descriptions = "Xoá phiên bản " + info;
                this.props.editDocument(documentId, {
                    title: title,
                    descriptions: descriptions,
                    versionId: versionId,
                    creator: getStorage("userId"),
                }, 'DELETE_VERSION');
            }
        })
    }
    onSearch = async (name) => {

        await this.props.getAllDocuments({ page: this.state.page, limit: this.state.limit, name: name, calledId: "relationshipDocs" });
        this.setState(state => {
            return {
                ...state,
            }
        });
    }

    updateDocumentVersions = async (version) => {
        let { documentVersions } = this.state;
        for (let i in documentVersions) {
            if (documentVersions[i]._id === version._id) {
                documentVersions[i] = version
            }
        }

        this.setState({ documentVersions: documentVersions });
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

    render() {
        const {
            documentId, documentName, documentDescription, documentCategory, documentDomains,
            documentIssuingBody, documentOfficialNumber, documentSigner, documentVersions,
            documentRelationshipDescription, relatedDocuments,
            documentRoles, documentArchives,
            documentArchivedRecordPlaceOrganizationalUnit, currentVersion,
        } = this.state;
        const { errorName } = this.state;
        const { translate, role, documents, department, documentRelationshipDocuments } = this.props;
        const categories = documents.administration.categories.list.map(category => { return { value: category._id, text: category.name } });
        const { list } = documents.administration.domains;
        const roleList = role.list.map(role => { return { value: role._id, text: role.name } });

        let tmpMap = {};
        let relationshipDocs = documents.administration.relationshipDocs.paginate.map(
            doc => {
                tmpMap[doc._id] = true;
                return { value: doc._id, text: doc.name }
            }
        );
        documentRelationshipDocuments.forEach(doc => {
            if (!tmpMap[doc._id]) {
                relationshipDocs.push({ value: doc._id, text: doc.name })
            }
        });

        const archives = documents.administration.archives.list;
        let path = documentArchives ? this.findPath(archives, documentArchives) : "";
        return (
            <React.Fragment>
                <DialogModal
                    size="100"
                    modalID="modal-edit-document"
                    formID="form-edit-document"
                    title={translate('document.edit')}
                    func={this.save}
                    disableSubmit={!this.isValidateForm()}
                >
                    {
                        currentVersion &&
                        <EditVersion
                            documentId={documentId}
                            versionId={currentVersion._id}
                            versionName={currentVersion.versionName}
                            issuingDate={currentVersion.issuingDate}
                            effectiveDate={currentVersion.effectiveDate}
                            expiredDate={currentVersion.expiredDate}
                            documentFile={currentVersion.documentFile}
                            documentFileScan={currentVersion.documentFileScan}

                            updateDocumentVersions={this.updateDocumentVersions}
                        />
                    }
                    <form id="form-edit-document">
                        <div className="nav-tabs-custom">
                            <ul className="nav nav-tabs">
                                <li className="active"><a href="#doc-edit-info" data-toggle="tab">{translate('document.infomation_docs')}</a></li>
                                <li><a href="#doc-edit-sub-info" data-toggle="tab">{translate('document.relationship_role_store')}</a></li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane active" id="doc-edit-info">
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                            <div className={`form-group ${!errorName ? "" : "has-error"}`}>
                                                <label>{translate('document.name')}<span className="text-red">*</span></label>
                                                <input type="text" className="form-control" value={documentName} onChange={this.handleName} />
                                                <ErrorLabel content={errorName} />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.doc_version.issuing_body')}</label>
                                                <input type="text" className="form-control" onChange={this.handleIssuingBody} value={documentIssuingBody} />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.doc_version.official_number')}</label>
                                                <input type="text" className="form-control" onChange={this.handleOfficialNumber} value={documentOfficialNumber} />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.doc_version.signer')}</label>
                                                <input type="text" className="form-control" onChange={this.handleSigner} value={documentSigner} />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                            <div className="form-group">
                                                <label>{translate('document.category')}<span className="text-red">*</span></label>
                                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                    id={`select-box-edit-document-category-${documentId}`}
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={categories}
                                                    value={documentCategory}
                                                    onChange={this.handleCategory}
                                                    multiple={false}
                                                    options={{ placeholder: translate('document.administration.categories.select') }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.domain')}</label>
                                                <TreeSelect
                                                    data={list}
                                                    value={documentDomains}
                                                    handleChange={this.handleDomains}
                                                    mode="hierarchical"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.description')}</label>
                                                <textarea type="text" className="form-control" onChange={this.handleDescription} value={documentDescription ? documentDescription : ""} />
                                            </div>


                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <ButtonModal modalID="sub-modal-add-document-new-version" button_name={translate('general.add')} title={translate('document.add')} />
                                            <DialogModal
                                                modalID="sub-modal-add-document-new-version"
                                                formID="sub-form-add-document-new-version"
                                                title={translate('document.add_version')}
                                                func={() => this.addNewVersion(documentId)}
                                                disableSubmit={!this.isValidateFormAddVersion()}
                                            >
                                                <React.Fragment>
                                                    <div className={`form-group `}>
                                                        <label>{translate('document.doc_version.name')}<span className="text-red">*</span></label>
                                                        <input type="text" onChange={this.handleChangeVersionName} className="form-control" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>{translate('document.upload_file')}</label>
                                                        <UploadFile multiple={true} onChange={this.handleUploadFile} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>{translate('document.upload_file_scan')}</label>
                                                        <UploadFile multiple={true} onChange={this.handleUploadFileScan} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>{translate('document.doc_version.issuing_date')}</label>
                                                        <DatePicker
                                                            id={`document-edit-version-issuing-date-${documentId}`}
                                                            onChange={this.handleIssuingDate}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>{translate('document.doc_version.effective_date')}</label>
                                                        <DatePicker
                                                            id={`document-edit-version-effective-date-${documentId}`}
                                                            onChange={this.handleEffectiveDate}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>{translate('document.doc_version.expired_date')}</label>
                                                        <DatePicker
                                                            id={`document-edit-version-expired-date-${documentId}`}
                                                            onChange={this.handleExpiredDate}
                                                        />
                                                    </div>
                                                </React.Fragment>
                                            </DialogModal>
                                            <table className="table table-hover table-striped table-bordered" id="table-document-version">
                                                <thead>
                                                    <tr>
                                                        <th>{translate('document.version')}</th>
                                                        <th>{translate('document.issuing_date')}</th>
                                                        <th>{translate('document.effective_date')}</th>
                                                        <th>{translate('document.expired_date')}</th>
                                                        <th>{translate('document.doc_version.file')}</th>
                                                        <th>{translate('document.doc_version.scanned_file_of_signed_document')}</th>
                                                        <th style={{ width: '80px', textAlign: 'center' }}>
                                                            {translate('general.action')}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        documentVersions !== undefined && documentVersions.length > 0 ?
                                                            documentVersions.map((version, i) => {
                                                                return <tr key={i}>
                                                                    <td>{version.versionName}</td>
                                                                    <td>{this.formatDate(version.issuingDate)}</td>
                                                                    <td>{this.formatDate(version.effectiveDate)}</td>
                                                                    <td>{this.formatDate(version.expiredDate)}</td>
                                                                    <td>
                                                                        <a href="#" onClick={() => this.requestDownloadDocumentFile(documentId, documentName, i)}>
                                                                            <u>{version.file ? translate('document.download') : ""}</u>
                                                                        </a>
                                                                    </td>
                                                                    <td>
                                                                        <a href="#" onClick={() => this.requestDownloadDocumentFileScan(documentId, "SCAN_" + documentName, i)}>
                                                                            <u>{version.scannedFileOfSignedDocument ? translate('document.download') : ""}</u>
                                                                        </a>
                                                                    </td>
                                                                    <td>
                                                                        <a className="text-yellow" title={translate('document.edit')} onClick={() => this.toggleEditVersion(version)}>
                                                                            <i className="material-icons">edit</i>
                                                                        </a>
                                                                        <a className="text-red" title={translate('document.delete')} onClick={() => this.deleteDocumentVersion(documentId, version._id, version.versionName)}>
                                                                            <i className="material-icons">delete</i>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            }) : <tr><td colSpan={7}>{translate('document.no_version')}</td></tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="doc-edit-sub-info">
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                            <div className="form-group">
                                                <label>{translate('document.relationship.description')}</label>
                                                <textarea type="text" style={{ height: 107 }} className="form-control" onChange={this.handleRelationshipDescription} value={documentRelationshipDescription} />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.relationship.list')}</label>
                                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                    id="select-edit-documents-relationship-to-document"
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={relationshipDocs}
                                                    onChange={this.handleRelationshipDocuments}
                                                    value={relatedDocuments}
                                                    multiple={true}
                                                    onSearch={this.onSearch}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                            <div className="form-group">
                                                <label>{translate('document.store.organizational_unit_manage')}</label>
                                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                    id={`select-edit-documents-organizational-unit-manage${documentId}`}
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={department.list.map(organ => { return { value: organ._id, text: organ.name } })}
                                                    onChange={this.handleArchivedRecordPlaceOrganizationalUnit}
                                                    value={[documentArchivedRecordPlaceOrganizationalUnit]}
                                                    multiple={false}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.roles')}</label>
                                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                    id={`select-edit-document-users-see-permission-${documentId}`}
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={roleList}
                                                    value={documentRoles}
                                                    onChange={this.handleRoles}
                                                    multiple={true}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>{translate('document.store.information')}</label>
                                                <TreeSelect
                                                    data={archives}
                                                    value={documentArchives}
                                                    handleChange={this.handleArchives}
                                                    mode="hierarchical"
                                                />
                                                {path && path.length ? path.map(y =>
                                                    <div>{y}</div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllDocuments: DocumentActions.getDocuments,
    editDocument: DocumentActions.editDocument,
    downloadDocumentFile: DocumentActions.downloadDocumentFile,
    downloadDocumentFileScan: DocumentActions.downloadDocumentFileScan
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm));
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, DateTimeConverter, SelectBox } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';

class DocumentInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    
    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.documentId !== prevState.documentId) {
            return {
                ...prevState,
                documentId: nextProps.documentId,
                documentName: nextProps.documentName,
                documentDescription: nextProps.documentDescription,
                documentCategory: nextProps.documentCategory,
                documentDomains: nextProps.documentDomains,
                documentIssuingBody: nextProps.documentIssuingBody,
                documentOfficialNumber: nextProps.documentOfficialNumber,
                documentSigner: nextProps.documentSigner,

                documentVersions: nextProps.documentVersions,

                documentRelationshipDescription: nextProps.documentRelationshipDescription,
                documentRelationshipDocuments: nextProps.documentRelationshipDocuments,

                documentRoles: nextProps.documentRoles,

                documentArchivedRecordPlaceInfo: nextProps.documentArchivedRecordPlaceInfo,
                documentArchivedRecordPlaceOrganizationalUnit: nextProps.documentArchivedRecordPlaceOrganizationalUnit,
                documentArchivedRecordPlaceManager: nextProps.documentArchivedRecordPlaceManager,
            } 
        }else if(nextProps.documentVersions.length > prevState.documentVersions.length){
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

    render() {
        const {
            documentId, documentName, documentDescription, documentCategory, documentDomains, 
            documentIssuingBody, documentOfficialNumber, documentSigner, documentVersions, 
            documentRelationshipDescription, documentRelationshipDocuments,
            documentRoles, 
            documentArchivedRecordPlaceInfo, documentArchivedRecordPlaceOrganizationalUnit, documentArchivedRecordPlaceManager
        } = this.state;
        const {translate, role, documents, department, user}=this.props;
        const categories = documents.administration.categories.list.map(category=>{return{value: category._id, text: category.name}});
        const domains = documents.administration.domains.list.map(domain=>{ return {value: domain._id, text: domain.name}});
        const roleList = role.list.map( role => {return {value: role._id, text: role.name}});
        const relationshipDocs = documents.administration.data.list.filter(doc => doc._id !== documentId).map(doc=>{return {value: doc._id, text: doc.name}})
        const userManage = documents.administration.data.user_manage.map(user=> {return {value: user._id, text: `${user.name} ${user.email}`}});
        
        return ( 
            <React.Fragment>
                <DialogModal
                    modalID="modal-document-information-statistics"
                    formID="form-document-information-statistics"
                    title={translate('document.information')}
                    hasSaveButton={false}
                >
                    <form id="form-document-information-statistics">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('document.infomation_docs')}</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{ translate('document.name') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" value={documentName} disabled/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.issuing_body') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" value={documentIssuingBody} disabled/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.official_number') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" value={documentOfficialNumber} disabled/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.doc_version.signer') }<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" value={documentSigner} disabled/>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>{ translate('document.category') }<span className="text-red">*</span></label>
                                        <SelectBox
                                            id={`select-box-edit-user-document-category-${documentId}`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items = {categories}
                                            value={documentCategory}
                                            multiple={false}
                                            options={{placeholder: translate('document.administration.categories.not_select')}}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.domain') }<span className="text-red">*</span></label>
                                        <SelectBox
                                            id={`select-box-edit-user-document-domains-${documentId}`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            value={documentDomains}
                                            items = {domains}
                                            multiple={true}
                                            options={{placeholder: translate('document.administration.domains.not_select')}}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('document.description') }<span className="text-red">*</span></label>
                                        <textarea type="text" className="form-control" value={documentDescription} disabled/>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{ translate('document.doc_version.title') }</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <table className="table table-hover table-striped table-bordered" id="table-document-version">
                                        <thead>
                                            <tr>
                                                <th>{translate('document.version')}</th>
                                                <th>{translate('document.issuing_date')}</th>
                                                <th>{translate('document.effective_date')}</th>
                                                <th>{translate('document.expired_date')}</th>
                                                <th>{translate('document.doc_version.file')}</th>
                                                <th>{translate('document.doc_version.scanned_file_of_signed_document')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                documentVersions !== undefined && documentVersions.length > 0 ?
                                                documentVersions.map((version, i) => {
                                                    return <tr key={i}>
                                                        <td>{version.versionName}</td>
                                                        <td><DateTimeConverter dateTime={version.issuingDate} type="DD-MM-YYYY"/></td>
                                                        <td><DateTimeConverter dateTime={version.effectiveDate} type="DD-MM-YYYY"/></td>
                                                        <td><DateTimeConverter dateTime={version.expiredDate} type="DD-MM-YYYY"/></td>
                                                        <td><a href="#" onClick={()=>this.requestDownloadDocumentFile(documentId, documentName, i)}><u>{translate('document.download')}</u></a></td>
                                                        <td><a href="#" onClick={()=>this.requestDownloadDocumentFileScan(documentId, "SCAN_"+documentName, i)}><u>{translate('document.download')}</u></a></td>
                                                    </tr>
                                                }) : <tr><td colSpan={7}>{translate('document.no_version')}</td></tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{ translate('document.relationship.title') }</legend>
                            <div className="form-group">
                                <label>{ translate('document.relationship.description') }<span className="text-red">*</span></label>
                                <textarea type="text" className="form-control" value={documentRelationshipDescription} disabled/>
                            </div>
                            <div className="form-group">
                                <label>{ translate('document.relationship.list') }<span className="text-red">*</span></label>
                                <SelectBox
                                    id="select-edit-documents-user-relationship-to-document"
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {relationshipDocs}
                                    value={documentRelationshipDocuments}
                                    multiple={true}
                                    disabled={true}
                                />
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{ translate('document.roles') }</legend>
                            <SelectBox
                                id={`select-edit-user-document-users-see-permission-${documentId}`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {roleList}
                                value={documentRoles}
                                multiple={true}
                                disabled={true}
                            />
                        </fieldset>

                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{ translate('document.store.title') }</legend>
                            <div className="form-group">
                                <label>{ translate('document.store.information') }<span className="text-red">*</span></label>
                                <input type="text" className="form-control" value={documentArchivedRecordPlaceInfo} disabled/>
                            </div>
                            <div className="form-group">
                                <label>{ translate('document.store.organizational_unit_manage') }<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`select-edit-user-documents-organizational-unit-manage${documentId}`}
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {department.list.map(organ => {return {value: organ._id, text: organ.name}})}
                                    value={documentArchivedRecordPlaceOrganizationalUnit}
                                    multiple={false}
                                    disabled={true}
                                />
                            </div>
                            {/* <div className="form-group">
                                <label>{ translate('document.store.user_manage') }<span className="text-red">*</span></label>
                                <SelectBox
                                    id="select-edit-user-documents-user-manage"
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {userManage}
                                    value={documentArchivedRecordPlaceManager}
                                    onChange={this.handleArchivedRecordPlaceManager}
                                    options={{placeholder: translate('document.store.select_user')}}
                                    multiple={false}
                                    disabled={true}
                                />
                            </div> */}
                        </fieldset>
                    </form>
                </DialogModal>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    editDocument: DocumentActions.editDocument,
    downloadDocumentFile: DocumentActions.downloadDocumentFile,
    downloadDocumentFileScan: DocumentActions.downloadDocumentFileScan
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(DocumentInformation) );
import React, { Component } from 'react';
import { configDocument, exportDocument } from './fileConfigImportDocument.js'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../../common-components';
import { AuthActions } from '../../../../auth/redux/actions';
import { DocumentActions } from '../../../redux/actions'

class DocumentImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configData: configDocument,
            checkFileImport: true,
            rowError: [],
            importData: [],
            importShowData: [],
            limit: 100,
            page: 0
        }
    }

    // Function thay đổi cấu hình file import
    handleChangeConfig = (value) => {
        this.setState({
            configData: value,
            importData: [],
        })
    }

    handleImportExcel = (value, checkFileImport) => {

        let startDate = new Date(1900, 1, 1, 0, 0, 0);
        let date = -2209131850214;
        let values = [];
        let showValues = [];
        let k = -1;
        for (let i in value) {
            let x = value[i];
            if (x.name) {
                k = k + 1;
                let issuingDate = "";
                let effectiveDate = "";
                let expiredDate = "";
                if (x.issuingDate) {
                    issuingDate = date + x.issuingDate * 24 * 60 * 60 * 1000;
                }
                if (x.effectiveDate) {
                    effectiveDate = date + x.effectiveDate * 24 * 60 * 60 * 1000;
                }
                if (x.expiredDate) {
                    expiredDate = date + x.expiredDate * 24 * 60 * 60 * 1000;
                }

                values = [...values, {
                    "STT": k + 1,
                    "name": x.name,
                    "description": x.description,
                    "archives": [x.archives],
                    "domains": [x.domains],
                    "issuingBody": x.issuingBody,
                    "signer": x.signer,
                    "officialNumber": x.officialNumber,
                    "versionName": x.versionName,
                    "issuingDate": issuingDate,
                    "effectiveDate": effectiveDate,
                    "expiredDate": expiredDate,
                    "category": x.category,
                    "relationshipDescription": x.relationshipDescription,
                    "documentRelationshipList": [x.documentRelationshipList],
                    "role": [x.roles],
                    "organizationUnitManager": x.organizationUnitManager,
                }];
                showValues = [...showValues, {
                    "name": x.name,
                    "description": x.description,
                    "archives": [x.archives],
                    "domains": [x.domains],
                    "issuingBody": x.issuingBody,
                    "signer": x.signer,
                    "officialNumber": x.officialNumber,
                    "versionName": x.versionName,
                    "issuingDate": issuingDate,
                    "effectiveDate": effectiveDate,
                    "expiredDate": expiredDate,
                    "category": x.category,
                    "category": x.category,
                    "relationshipDescription": x.relationshipDescription,
                    "documentRelationshipList": [x.documentRelationshipList],
                    "roles": [x.roles],
                    "organizationUnitManager": x.organizationUnitManager,
                }]
            } else {
                if (k >= 0) {
                    let out = {
                        "STT": "",
                        "name": "",
                        "description": "",
                        "archives": [],
                        "domains": [],
                        "issuingBody": "",
                        "signer": "",
                        "officialNumber": "",
                        "versionName": "",
                        "issuingDate": "",
                        "effectiveDate": "",
                        "expiredDate": "",
                        "category": "",
                        "relationshipDescription": "",
                        "documentRelationshipList": [],
                        "roles": [],
                        "organizationUnitManager": "",
                    }
                    if (x.domains) {
                        showValues[k].domains = [...showValues[k].domains, x.domains];
                        out.domains = [x.domains]
                    }
                    if (x.archives) {
                        showValues[k].archives = [...showValues[k].archives, x.archives];
                        out.archives = [x.archives];
                    }
                    if (x.roles) {
                        showValues[k].roles = [...showValues[k].roles, x.roles];
                        out.roles = [x.roles];
                    }
                    if (x.relationshipDocuments) {
                        showValues[k].relationshipDocuments = [...showValues[k].relationshipDocuments, x.relationshipDocuments];
                        out.relationshipDocuments = [x.relationshipDocuments];
                    }
                }
            }
        }
        // value = values;
        if (checkFileImport) {
            let rowError = [];
            for (let i in value) {
                let x = value[i];
                let errorAlert = [];
                // if (x.name === null) {
                //     rowError = [...rowError, i + 1];
                //     x = { ...x, error: true };
                // }
                // if (x.name === null) {
                //     errorAlert = [errorAlert, "Tên danh mục không được để trống"];
                // }
                x = { ...x, errorAlert: errorAlert };
                value[i] = x;
            }

            this.setState({
                importData: value,
                importShowData: showValues,
                rowError: rowError,
                checkFileImport: checkFileImport,
            })
        } else {
            this.setState({
                checkFileImport: checkFileImport,
            })
        }

    }

    handleExportFile = (dataExport) => {
        for (let i in dataExport.dataSheets) {
            for (let j in dataExport.dataSheets[i].tables) {
                let data = dataExport.dataSheets[i].tables[j].data;
                let newData = [];
                for (let k in data) {
                    let element = {};
                    let x = data[k];
                    let length_domains, length_archives, length_relationship, length_roles;
                    if (x.name) {
                        if (Array.isArray(x.domains)) {
                            element.domains = x.domains[0] ? x.domains[0] : "";
                            length_domains = x.domains.length;
                        } else {
                            element.domains = x.domains ? x.domains : "";
                            length_domains = 0;
                        }
                        if (Array.isArray(x.archives)) {
                            element.archives = x.archives[0] ? x.archives[0] : "";
                            length_archives = x.archives.length;
                        } else {
                            element.archives = x.archives ? x.archives : "";
                            length_archives = 0;
                        }
                        if (Array.isArray(x.documentRelationshipList)) {
                            element.documentRelationshipList = x.documentRelationshipList[0] ? x.documentRelationshipList[0] : "";
                            length_relationship = x.documentRelationshipList.length;
                        } else {
                            element.documentRelationshipList = x.documentRelationshipList ? x.documentRelationshipList : "";
                            length_relationship = 0;
                        }
                        if (Array.isArray(x.roles)) {
                            element.roles = x.roles[0] ? x.roles[0] : "";
                            length_roles = x.roles.length;
                        } else {
                            element.roles = x.roles ? x.roles : "";
                            length_roles = 0;
                        }
                        element.name = x.name;
                        element.description = x.description ? x.description : "";
                        element.issuingBody = x.issuingBody ? x.issuingBody : "";
                        element.signer = x.signer ? x.signer : "";
                        element.versionName = x.versionName ? x.versionName : "";
                        element.officialNumber = x.officialNumber ? x.officialNumber : "";
                        element.issuingDate = x.issuingDate ? x.issuingDate : "";
                        element.effectiveDate = x.effectiveDate ? x.effectiveDate : "";
                        element.expiredDate = x.expiredDate ? x.expiredDate : "";
                        element.category = x.category ? x.category : "";
                        element.relationshipDescription = x.relationshipDescription ? x.relationshipDescription : "";
                        element.organizationUnitManager = x.organizationUnitManager ? x.organizationUnitManager : "";

                        newData = [...newData, element];
                        let max_length = Math.max(length_roles, length_domains, length_archives, length_relationship);
                        if (max_length > 1) {
                            for (let n = 1; n < max_length; n++) {
                                let object = {
                                    name: "",
                                    description: "",
                                    archives: n < length_archives ? x.archives[n] : "",
                                    domains: n < length_domains ? x.domains[n] : "",
                                    issuingBody: "",
                                    signer: "",
                                    versionName: "",
                                    officialNumber: "",
                                    issuingDate: "",
                                    effectiveDate: "",
                                    expiredDate: "",
                                    category: "",
                                    relationshipDescription: "",
                                    documentRelationshipList: n < length_relationship ? x.documentRelationshipList[n] : "",
                                    roles: n < length_roles ? x.roles[n] : "",
                                    organizationUnitManagement: "",
                                }
                                newData = [...newData, object];

                            }
                        }


                    }
                }
                dataExport.dataSheets[i].tables[j].data = newData;
            }
        }
        return dataExport;
    }


    save = () => {
        let { importShowData } = this.state;
        this.props.importDocument(importShowData);
    }
    render() {
        const { translate } = this.props;
        let { limit, page, importData, rowError, configData, checkFileImport } = this.state;
        let dataExport = this.handleExportFile(exportDocument);

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal_import_file_document`} isLoading={false}
                    formID={`form_import_file_document`}
                    title="Thêm tài liệu bằng import file excel"
                    func={this.save}
                    disableSubmit={false}
                    size={75}
                >
                    <form className="form-group" id={`form_import_file`}>
                        <ConFigImportFile
                            id="import_taskTemplate_config"
                            configData={configData}
                            // textareaRow={8}
                            scrollTable={false}
                            handleChangeConfig={this.handleChangeConfig}
                        />
                        <div className="row">
                            <div className="form-group col-md-4 col-xs-12">
                                <ImportFileExcel
                                    configData={configData}
                                    handleImportExcel={this.handleImportExcel}
                                />
                            </div>
                            <div className="form-group col-md-4 col-xs-12">
                                <label></label>
                                <ExportExcel id="download_template_task_template" type='link' exportData={dataExport}
                                    buttonName='Download file import mẫu' />
                            </div>
                            <div className="form-group col-md-12 col-xs-12">
                                <ShowImportData
                                    id="import_taskTemplate_show_data"
                                    configData={configData}
                                    importData={importData}
                                    rowError={rowError}
                                    scrollTable={false}
                                    checkFileImport={checkFileImport}
                                    limit={limit}
                                    page={page}
                                />
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        )
    }

}

function mapState(state) {
    const { importDocument } = state;
    return { importDocument };
};
const actionCreators = {
    importDocument: DocumentActions.importDocument,
    downloadFile: AuthActions.downloadFile,
};
const importFileExcel = connect(mapState, actionCreators)(withTranslate(DocumentImportForm));
export { importFileExcel as DocumentImportForm };








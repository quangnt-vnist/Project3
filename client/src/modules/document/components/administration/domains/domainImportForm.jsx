import React, { Component } from 'react';
import { configDomain, exportDomain } from './fileConfigurationImportDomain.js'
import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../../common-components';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../../auth/redux/actions';
import { DocumentActions } from '../../../redux/actions'

class DomainImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configData: configDomain,
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
        let values = [];
        let showValues = [];
        let k = -1;
        for (let i in value) {
            let x = value[i];
            if (x.name) {
                values = [...value, {
                    "STT": k + 1,
                    "name": x.name,
                    "description": x.description,
                    "parent": x.parent,

                }];
                showValues = [...showValues, {
                    "STT": k + 1,
                    "name": x.name,
                    "description": x.description,
                    "parent": x.parent,

                }]
            }
        }
        value = values;
        if (checkFileImport) {
            let rowError = [];
            for (let i in value) {
                let x = value[i];
                let errorAlert = [];
                if (x.name === null) {
                    rowError = [...rowError, i + 1];
                    x = { ...x, error: true };
                }
                if (x.name === null) {
                    errorAlert = [errorAlert, "Tên danh mục không được để trống"];
                }
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

    save = () => {
        let { importShowData } = this.state;
        this.props.importDomain(importShowData);
    }
    render() {
        let { limit, page, importData, rowError, configData, checkFileImport } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal_import_file-domain`} isLoading={false}
                    formID={`form_import_file_domain`}
                    title="Thêm danh mục bằng import file excel"
                    func={this.save}
                    disableSubmit={false}
                    size={75}
                >
                    <form className="form-group" id={`form_import_file`}>
                        <ConFigImportFile
                            id="import_taskTemplate_config"
                            configData={configData}
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
                                <ExportExcel id="download_template_task_template" type='link' exportData={exportDomain}
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
    const { importDomain } = state;
    return { importDomain };
};
const actionCreators = {
    importDomain: DocumentActions.importDocumentDomain,
    downloadFile: AuthActions.downloadFile,
};
const importFileExcel = connect(mapState, actionCreators)(withTranslate(DomainImportForm));
export { importFileExcel as DomainImportForm };








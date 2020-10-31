import React, { Component } from 'react';
import { configCategory, exportCategory } from './fileConfigDocumentCategory'
import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../../common-components';
//import { taskTemplateActions } from '../redux/actions';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../../auth/redux/actions';
import { DocumentActions } from '../../../redux/actions'

class CategoryImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configData: configCategory,
            checkFileImport: true,
            rowError: [],
            importData: [],
            importShowData: [],
            limit: 100,
            page: 0
        }
    }

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

                }];
                showValues = [...showValues, {
                    "STT": k + 1,
                    "name": x.name,
                    "description": x.description,

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
        this.props.importCategory(importShowData);
    }

    render() {
        const { translate } = this.props;
        let { limit, page, importData, rowError, configData, checkFileImport } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-import-file-category" isLoading={false}
                    formID="form-import-file-category"
                    title="Thêm loại tài liệu bằng import file excel"
                    func={this.save}
                    disableSubmit={false}
                    size={75}
                >
                    <form className="form-group" id="form-import-file-category">
                        <ConFigImportFile
                            id="import_taskTemplate_config"
                            configData={configData}
                            //textareaRow={8}
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
                                <ExportExcel id="download_template_task_template" type='link' exportData={exportCategory}
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
    const { importCategory } = state;
    return { importCategory };
};
const actionCreators = {
    importCategory: DocumentActions.importDocumentCategory,
    downloadFile: AuthActions.downloadFile,
};
const importFileExcel = connect(mapState, actionCreators)(withTranslate(CategoryImportForm));
export { importFileExcel as CategoryImportForm };
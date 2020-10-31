import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withTranslate } from 'react-redux-multilingual';

import { AssetTypeActions } from '../redux/actions';

import { configAssetType, importAssetTypeTemplate } from './fileConfigurationImportAssetType';

import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../../common-components';

class ImportAssetTypeModal extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            configData: configAssetType,
            limit: 100,
            page: 0
        }
    }

    save = () => {
        const { importShowData } = this.state;
        
        this.props.createAssetTypes(importShowData);
    }

    handleChangeConfig = (value) => {
        this.setState({
            configData: value,
            importData: [],
        })
    }

    convertDataExport = (dataExport) => {
        for (let i = 0; i < dataExport.dataSheets.length; i++) {
            for (let j = 0; j < dataExport.dataSheets[i].tables.length; j++) {
                let datas = [];
                let data = dataExport.dataSheets[i].tables[j].data;

                for (let index = 0; index < data.length; index++) {
                    let dataTemporary = data[index];
                    let information = [], length = 0;

                    if (dataTemporary && Array.isArray(dataTemporary.information)) {
                        information = dataTemporary.information;
                        if (information && information.length !== 0) {
                            length = information.length;
                        }
                    } 

                    let out = {
                        STT: index + 1,
                        code: dataTemporary.code,
                        name: dataTemporary.name,
                        description: dataTemporary.description,
                        information: information[0]
                    }
                    datas = [...datas, out];

                    if (length > 1) {
                        for (let i = 1; i < length; i++) {
                            out = {
                                STT: "",
                                code: "",
                                name: "",
                                description: "",
                                information: information[i],
                            };
                            datas = [...datas, out];
                        }
                    }
                }
                dataExport.dataSheets[i].tables[j].data = datas;
            }
        }
        return dataExport;
    }

    handleImportExcel = (value, checkFileImport) => {
        let values = [], valueShow = [], index = -1;
        
        for (let i = 0; i < value.length; i++) {
            let valueTemporary = value[i];
            if (valueTemporary.name) {
                index = index + 1;
                values = [...values, {
                    "STT": index + 1,
                    "code": valueTemporary.code,
                    "name": valueTemporary.name,
                    "description": valueTemporary.description,
                    "information": valueTemporary.information
                }];
                valueShow = [...valueShow, {
                    "typeNumber": valueTemporary.code,
                    "typeName": valueTemporary.name,
                    "description": valueTemporary.description,
                    "defaultInformation": [{ nameField: valueTemporary.information }]
                }];
            } else {
                if (index >= 0) {
                    let out = {
                        "STT": "",
                        "code": "",
                        "name": "",
                        "description": "",
                        "information": "",
                    }

                    if (valueTemporary.information) {
                        out.information = valueTemporary.information;
                    }
                    if (valueTemporary.information && valueShow[index]) {
                        valueShow[index].defaultInformation = [...valueShow[index].defaultInformation, { nameField: valueTemporary.information }];
                    }

                    values = [...values, out];
                }
            }
        }
        value = values;

        if (checkFileImport) {
            let rowError = [];
            for (let i = 0; i < value.length; i++) {
                let x = value[i], errorAlert = [];

                if (x.name === null || x.code === null) {
                    rowError = [...rowError, i + 1];
                    x = { ...x, error: true };
                }
                if (x.code === null) {
                    errorAlert = [...errorAlert, 'Mã loại tài sản không được để trống'];
                }
                if (x.name === null) {
                    errorAlert = [...errorAlert, 'Tên loại tài sản không được để trống'];
                }

                x = { ...x, errorAlert: errorAlert };
                value[i] = x;
            };

            this.setState({
                importData: value,
                importShowData: valueShow,
                rowError: rowError,
                checkFileImport: checkFileImport,
            })
        } else {
            this.setState({
                checkFileImport: checkFileImport,
            })
        }
    }

    render() {
        const { configData, importData, rowError, checkFileImport, limit, page } = this.state;

        let importDataTemplate = this.convertDataExport(importAssetTypeTemplate);
        return (
            <React.Fragment>
                <DialogModal 
                    modalID={`import_asset_type`} isLoading={false}
                    formID={`form_import_asset_type`}
                    title="Thêm loại tài sản bằng import file excel"
                    func={this.save}
                    disableSubmit={false}
                    size={75}
                >
                    <form className="form-group" id={`form_import_asset_type`}>
                        <ConFigImportFile
                            id="import_asset_type_config"
                            configData={configData}
                            scrollTable={false}
                            handleChangeConfig={this.handleChangeConfig}
                        />
                        <div className="row">
                            <div className="form-group col-md-6 col-xs-6">
                                <ImportFileExcel
                                    configData={configData}
                                    handleImportExcel={this.handleImportExcel}
                                />
                            </div>
                            <div className="form-group col-md-6 col-xs-6">
                                <label></label>
                                <ExportExcel id="download_asset_type_file" type='link' exportData={importDataTemplate}
                                    buttonName='Download file import mẫu' />
                            </div>
                            <div className="form-group col-md-12 col-xs-12">
                                <ShowImportData
                                    id="import_asset_type_show_data"
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
    const {  } = state;
    return {  };
};
const actions = {
    createAssetTypes: AssetTypeActions.createAssetTypes,
};

const connectedImportAssetTypeModal = connect(mapState, actions)(withTranslate(ImportAssetTypeModal));
export { connectedImportAssetTypeModal as ImportAssetTypeModal };


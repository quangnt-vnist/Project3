import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ShowImportData, ImportFileExcel, ConFigImportFile, ExportExcel } from '../../../../../common-components';

class AssetImportTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checkFileImport: true,
            limit: 100,
            page: 0
        };
    }

    // Function Thay đổi cấu hình file import
    handleChangeConfig = (value) => {
        this.setState(state => {
            return {
                ...state,
                configData: value,
            }
        })
    }

    // Function thay đổi file import
    handleImportExcel = (value, checkFileImport) => {
        if (checkFileImport) {
            let result = this.props.handleCheckImportData(value, checkFileImport);
            this.setState(state => {
                return {
                    ...state,
                    importData: result.importData,
                    rowError: result.rowError,
                    checkFileImport: checkFileImport
                }
            })
        } else {
            this.setState({
                checkFileImport: checkFileImport
            })
        }
    }

    isFormValidated = async () => {
        const { rowErrorOfReducer, dataOfReducer } = this.props;
        const { rowError, importData } = this.state;

        if (rowErrorOfReducer) {
            await this.setState(state => {
                return {
                    ...state,
                    rowError: rowErrorOfReducer,
                    importData: dataOfReducer
                }
            })
        }

        if (rowError && importData && rowError.length === 0 && importData.length !== 0) {
            return true
        } return false
    }

    render() {
        const { id, className = "tab-pane", configuration, importDataTemplate, scrollTable = false } = this.props;
        const { limit, page, importData, rowError, configData, checkFileImport } = this.state;

        return (
            <React.Fragment>
                <div id={id} className={className}>
                    <div className="box-body row">
                        <div className="form-group col-md-12" style={{ marginBottom: 0 }}>
                            <ConFigImportFile
                                id={`import_asset_config${id}`}
                                scrollTable={scrollTable}
                                configData={configData ? configData : configuration}
                                handleChangeConfig={this.handleChangeConfig}
                            />
                        </div>
                        <div className="form-group row col-md-12" style={{ marginBottom: 0 }}>
                            <div className="form-group col-md-6 col-xs-12">
                                <ImportFileExcel
                                    configData={configData ? configData : configuration}
                                    handleImportExcel={this.handleImportExcel}
                                />
                            </div>
                            <div className="form-group col-md-6 col-xs-12">
                                <ExportExcel id={`download_asset_file${id}`} type='link' exportData={importDataTemplate}
                                    buttonName='Download file import mẫu' />
                            </div>
                        </div>

                        <div className="col-md-12">
                            <ShowImportData
                                id={`import_asset_show_data${id}`}
                                configData={configData ? configData : configuration}
                                importData={importData}
                                rowError={rowError}
                                checkFileImport={checkFileImport}
                                scrollTable={scrollTable}
                                limit={limit}
                                page={page}
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const actions = {
};

const connectedAssetImportTab = connect(null, actions)(withTranslate(AssetImportTab));
export { connectedAssetImportTab as AssetImportTab };
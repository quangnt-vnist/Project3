import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ShowImportData, ImportFileExcel, ConFigImportFile, ExportExcel } from '../../../../../common-components';

class EmployeeImportTab extends Component {
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
        this.setState({
            configData: value,
        })
    }

    // Function thay đổi file import
    handleImportExcel = (value, checkFileImport) => {
        if (checkFileImport) {
            let result = this.props.handleCheckImportData(value);
            this.setState({
                importData: result.importData,
                rowError: result.rowError,
                checkFileImport: checkFileImport
            })
        } else {
            this.setState({
                checkFileImport: checkFileImport
            })
        }
    }

    isFormValidated = () => {
        const { rowErrorOfReducer, dataOfReducer } = this.props;
        let { rowError = [], importData = [] } = this.state;
        if (rowErrorOfReducer !== undefined) {
            rowError = rowErrorOfReducer;
            importData = dataOfReducer
        }
        if (rowError.length === 0 && importData.length !== 0) {
            return true
        } return false
    }

    render() {
        const { translate } = this.props;

        const { id, className = "tab-pane", teamplateImport, configuration, rowErrorOfReducer, dataOfReducer, configTableWidth, showTableWidth, handleImport, textareaRow } = this.props;

        let { limit, page, importData, rowError, configData, checkFileImport } = this.state;

        if (rowErrorOfReducer !== undefined) {
            rowError = rowErrorOfReducer;
            importData = dataOfReducer;
            importData = importData.map(x => {
                return {
                    ...x,
                    errorAlert: x.errorAlert.map(y => translate(`human_resource.profile.employee_management.${y}`))
                }
            })
        };
        if (importData && id === "import_employee_general_infor") {
            importData = importData.map(x => {
                let gender = translate(`human_resource.profile.${x.gender}`);
                let maritalStatus = translate(`human_resource.profile.${x.maritalStatus}`);
                let status = translate(`human_resource.profile.${x.status}`);
                let professionalSkill = translate(`human_resource.profile.${x.professionalSkill}`);
                return { ...x, gender: gender, maritalStatus: maritalStatus, status: status, professionalSkill: professionalSkill }
            });
        };
        if (importData && id === "import_employee_degree") {
            importData = importData.map(x => {
                let degreeType = x.degreeType ? translate(`human_resource.profile.${x.degreeType}`) : x.degreeType;
                return { ...x, degreeType: degreeType }
            });
        };
        if (importData && id === "import_employee_file") {
            importData = importData.map(x => {
                let status = x.status ? translate(`human_resource.profile.${x.status}`) : x.status;
                return { ...x, status: status }
            });
        }

        configData = configData ? configData : configuration;

        return (
            <React.Fragment>
                <div id={id} className={className}>
                    <div className="box-body row">
                        {/* Cấu hình file import */}
                        <div className="form-group col-md-12 col-xs-12" style={{ marginBottom: 0 }}>
                            <ConFigImportFile
                                id={`import_employees_config${id}`}
                                configData={configData}
                                scrollTableWidth={configTableWidth}
                                textareaRow={textareaRow}
                                handleChangeConfig={this.handleChangeConfig}
                            />
                        </div>

                        {/* File import */}
                        <div className="form-group col-md-4 col-xs-12" style={{ paddingTop: 5 }}>
                            <ImportFileExcel
                                configData={configData}
                                handleImportExcel={this.handleImportExcel}
                            />
                        </div>


                        <div className="form-group pull-right col-md-4 col-xs-12" style={{ marginBottom: 10 }}>
                            {/* Dowload file import mẫu */}
                            <ExportExcel id="download_template_salary" type='link' exportData={teamplateImport}
                                buttonName={` ${translate('human_resource.download_file')}`} />
                        </div>

                        <div className="form-group col-md-8 col-xs-12">
                            <button type="button" className="pull-right btn btn-success" onClick={handleImport} disabled={!this.isFormValidated()}>Import excel</button>
                        </div>

                        {/* Hiện thị data import */}
                        <div className="col-md-12 col-xs-12">
                            <ShowImportData
                                id={`import_employee_infor_show_data${id}`}
                                configData={configData}
                                importData={importData}
                                rowError={rowError}
                                scrollTableWidth={showTableWidth}
                                checkFileImport={checkFileImport}
                                limit={limit}
                                page={page}
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}

const importExcel = connect(null, null)(withTranslate(EmployeeImportTab));
export { importExcel as EmployeeImportTab };
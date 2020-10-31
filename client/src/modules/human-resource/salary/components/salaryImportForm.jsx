import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ImportFileExcel, ConFigImportFile, SelectBox, ShowImportData, DatePicker, ExportExcel } from '../../../../common-components';

import { configurationSalary } from './fileConfigurationImportSalary';

import { SalaryActions } from '../redux/actions';
import { AuthActions } from '../../../auth/redux/actions';

class SalaryImportForm extends Component {
    constructor(props) {
        super(props);
        let organizationalUnit = this.props.department.list[0];
        this.state = {
            organizationalUnit: organizationalUnit._id,
            configData: configurationSalary.configurationImport(this.props.translate),
            checkFileImport: true,
            rowError: [],
            importData: [],
            month: null,
            limit: 100,
            page: 0
        };
    }

    componentDidUpdate() {
        const { salary } = this.props;
        salary.importStatus && window.$(`#modal_import_file`).modal("hide");
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
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
        }
        return date;
    }

    /**
     * Bắt sự kiện thay đổi giá trị đơn vị
     * @param {*} value : Giá trị đơn vị
     */
    handleOrganizationalUnitChange = (value) => {
        const { salary } = this.props;
        this.setState({
            organizationalUnit: value[0],
            importData: [],
            changeMonth: true,
        });
        window.$('#file-import-salary').val('');
    }

    /**
     * Bắt sự kiện thay đổi tháng lương
     * @param {*} value : Giá trị tháng lương
     */
    handleMonthChange = (value) => {
        if (value) {
            const { salary, translate } = this.props;
            const { configData } = this.state;

            let partMonth = value.split('-'), rowError = [], importData = [];
            value = [partMonth[1], partMonth[0]].join('-');
            if (salary.error.rowError) {
                rowError = salary.error.rowError;
                importData = salary.error.data;
                importData = importData.map(x => {
                    let bonusName = configData.bonus.value;
                    let bonus = bonusName.map(b => null);
                    bonusName.forEach((y, key) => {
                        if (x.nameBonus === y) {
                            bonus[key] = x.number;
                        }
                    })
                    return { ...x, bonus: bonus }
                })

                importData = importData.map((x, index) => {
                    if (x.errorAlert.find(y => y === translate('human_resource.salary.month_salary_have_exist'))) {
                        x.errorAlert = x.errorAlert.filter(y => y !== translate('human_resource.salary.month_salary_have_exist'));
                        x.error = false;
                        rowError = rowError.filter(y => y !== index + 1);
                    }
                    return x;
                })

                this.setState({
                    ...this.state,
                    importData: importData,
                    rowError: rowError,
                    changeMonth: true,
                })
            }
            this.setState({
                ...this.state,
                month: value,
                changeMonth: true,
            });
        } else {
            this.setState({
                ...this.state,
                importData: [],
                rowError: [],
                month: value,
                changeMonth: true,
            });
        }
    }

    /** Function kiểm tra lỗi trước khi submit form*/
    isFormValidated = () => {
        const { salary } = this.props;
        let { rowError, month, importData, changeMonth } = this.state;

        if (salary.error.rowError && changeMonth === false) {
            rowError = salary.error.rowError;
            importData = salary.error.data
        }
        if (rowError.length === 0 && month !== null && importData.length !== 0) {
            return true
        } return false
    }

    /** Function import dữ liệu */
    save = () => {
        let { importData, month, configData, organizationalUnit } = this.state;

        let bonusName = configData.bonus.value;
        importData = importData.map(x => {
            let bonus = [];
            x.bonus.forEach((y, index) => {
                if (y) {
                    bonus = [...bonus, { nameBonus: bonusName[index], number: y }]
                }
            })
            return { ...x, month: month, organizationalUnit: organizationalUnit, bonus: bonus }
        });
        this.props.importSalary(importData);
        this.setState({
            changeMonth: false
        })
    }

    /**
     * Function Thay đổi cấu hình file import
     * @param {*} value : Dữ liệu cấu hình file import
     */
    handleChangeConfig = async (value) => {
        await this.setState({
            configData: value,
            importData: [],
        })
    }

    /**
     * Function thay đổi file import
     * @param {*} value : Dữ liệu file import
     * @param {*} checkFileImport : true - file import đúng định dạng, false - file import sai định dạng
     */
    handleImportExcel = (value, checkFileImport) => {
        console.log(value);
        const { translate } = this.props;
        if (checkFileImport) {
            let rowError = [];
            // Check dữ liệu import có hợp lệ hay không
            let checkImportData = value;
            value = value.map((x, index) => {
                let errorAlert = [];
                if (x.employeeNumber === null || x.employeeName === null || checkImportData.filter(y => y.employeeNumber === x.employeeNumber).length > 1) {
                    rowError = [...rowError, index + 1]
                    x = { ...x, error: true }
                }
                if (x.employeeNumber === null) {
                    errorAlert = [...errorAlert, translate('human_resource.salary.employee_number_required')];
                } else {
                    if (checkImportData.filter(y => y.employeeNumber === x.employeeNumber).length > 1)
                        errorAlert = [...errorAlert, translate('human_resource.salary.employee_code_duplicated')];
                };
                if (x.employeeName === null)
                    errorAlert = [...errorAlert, translate('human_resource.salary.employee_name_required')];

                x = { ...x, errorAlert: errorAlert }
                return x;
            });
            this.setState({
                importData: value,
                rowError: rowError,
                checkFileImport: checkFileImport,
            })
        } else {
            this.setState({
                checkFileImport: checkFileImport,
            })
        }
    }

    /**
     * Function tải file import mẫu
     * @param {*} e 
     * @param {*} path : Đường dẫn file
     * @param {*} fileName : Tên file muốn tải về
     */
    requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        this.props.downloadFile(path, fileName)
    }

    render() {

        const { translate, salary, department } = this.props;

        let { limit, page, importData, rowError, configData, changeMonth, month, checkFileImport, organizationalUnit } = this.state;
        if (salary.error.rowError && changeMonth === false) {
            rowError = salary.error.rowError;
            importData = salary.error.data
            importData = importData.map(x => {
                let bonusName = configData.bonus.value;
                let bonus = bonusName.map(b => null);
                bonusName.forEach((y, key) => {
                    if (x.nameBonus === y) {
                        bonus[key] = x.number;
                    }
                })
                if (x.errorAlert && x.errorAlert.length !== 0) {
                    let errorAlert = x.errorAlert.map(err => translate(`human_resource.salary.${err}`));
                    return { ...x, bonus: bonus, errorAlert: errorAlert }
                }
                return { ...x, bonus: bonus }
            })
        }

        let exportData = configurationSalary.templateImport(translate);
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal_import_file`} isLoading={false}
                    formID={`form_import_file`}
                    title={translate('human_resource.add_data_by_excel')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    closeOnSave={false}
                    size={75}
                >
                    <form className="form-group" id={`form_import_file`}>
                        {/* Form cấu file import */}
                        <ConFigImportFile
                            id="import_salary_config"
                            configData={configData}
                            textareaRow={8}
                            scrollTable={false}
                            handleChangeConfig={this.handleChangeConfig}
                        />
                        <div className="row">
                            {/* Đơn vị */}
                            <div className="form-group col-md-4 col-sm-12 col-xs-12">
                                <label>{translate('human_resource.unit')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`import-salary-unit`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={organizationalUnit}
                                    items={department.list.map(y => { return { value: y._id, text: y.name } })}
                                    onChange={this.handleOrganizationalUnitChange}
                                />
                            </div>
                            {/* Tháng */}
                            <div className="form-group col-md-4 col-sm-12 col-xs-12">
                                <label>{translate('human_resource.month')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="import-salary-month"
                                    dateFormat="month-year"
                                    deleteValue={false}
                                    value=""
                                    onChange={this.handleMonthChange}
                                />
                            </div>
                        </div>
                        <div className="row">
                            {/* File import */}
                            <div className="form-group col-md-4 col-sm-12 col-xs-12">
                                <ImportFileExcel
                                    id={'file-import-salary'}
                                    configData={configData}
                                    handleImportExcel={this.handleImportExcel}
                                    disabled={!month ? true : false}
                                />
                            </div>

                            <div className="form-group pull-right col-md-4 col-sm-12 col-xs-12">
                                {/* Dowload file import mẫu */}
                                <ExportExcel id="download_template_salary" type='link' exportData={exportData}
                                    buttonName={` ${translate('human_resource.download_file')}`} />

                            </div>
                        </div>


                        <div className="col-md-12 col-xs-12" style={{ padding: 0 }}>
                            {/* Form hiện thì dữ liệu sẽ import */}
                            <ShowImportData
                                id="import_salary_show_data"
                                configData={configData}
                                importData={importData}
                                rowError={rowError}
                                scrollTableWidth={1000}
                                checkFileImport={checkFileImport}
                                limit={limit}
                                page={page}
                            />
                        </div>
                        {/* </div> */}
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { salary, department } = state;
    return { salary, department };
};

const actionCreators = {
    importSalary: SalaryActions.importSalary,
    downloadFile: AuthActions.downloadFile,
};

const importExcel = connect(mapState, actionCreators)(withTranslate(SalaryImportForm));
export { importExcel as SalaryImportForm };
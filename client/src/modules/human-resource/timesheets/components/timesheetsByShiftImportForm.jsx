import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getStorage } from '../../../../config';

import { DialogModal, DataTableSetting, ImportFileExcel, ConFigImportFile, SlimScroll, PaginateBar, DatePicker, ExportExcel } from '../../../../common-components';

import { configurationTimesheets } from './fileConfigurationImportTimesheets';

import { TimesheetsActions } from '../redux/actions';
import { AuthActions } from '../../../auth/redux/actions';

class TimesheetsByShiftImportForm extends Component {
    constructor(props) {
        super(props);
        let configData = this.props.timekeepingType === 'shift' ? configurationTimesheets.configurationImport(this.props.translate) :
            configurationTimesheets.configurationImportByHours(this.props.translate)
        this.state = {
            configData: configData,
            checkFileImport: true,
            rowError: [],
            importData: [],
            month: "",
            limit: 100,
            page: 0
        };
    }

    componentDidUpdate() {
        const { timesheets } = this.props;
        timesheets.importStatus && window.$(`#modal_import_file`).modal("hide");
    }

    /**
     * Function thay đổi cấu hình file import
     * @param {*} value : Dữ liệu cấu hình file import
     */
    handleChangeConfig = (value) => {
        this.setState({
            configData: value,
            importData: [],
        })
    }

    /**
     * Function lấy danh sách các ngày trong tháng
     * @param {*} month : Tháng
     */
    getAllDayOfMonth = (month) => {
        const lang = getStorage("lang");
        let arrayDay = [], days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        if (lang === 'vn') {
            days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
        };
        let partMonth = month.split('-');
        let lastDayOfmonth = new Date(partMonth[1], partMonth[0], 0);
        for (let i = 1; i <= lastDayOfmonth.getDate(); i++) {
            let day = i;
            if (i.toString().length < 2)
                day = '0' + i;
            let date = new Date([partMonth[1], partMonth[0], day]);
            arrayDay = [...arrayDay, { day: days[date.getDay()], date: date.getDate() }]
        }
        return arrayDay
    }

    /**
     * Bắt sự kiện thay đổi tháng
     * @param {*} value : Tháng
     */
    handleMonthChange = (value) => {
        const { timesheets } = this.props;
        let rowError = [], importData = [];
        if (timesheets.error.rowError) {
            rowError = timesheets.error.rowError;
            importData = timesheets.error.data;
            importData = importData.map((x, index) => {
                if (x.errorAlert.find(y => y === "month_timesheets_have_exist")) {
                    x.errorAlert = x.errorAlert.filter(y => y !== "month_timesheets_have_exist");
                    x.error = false;
                    rowError = rowError.filter(y => y !== index + 1);
                }
                return x;
            })
            this.setState({
                ...this.state,
                importData: importData,
                rowError: rowError,
            })
        }

        let allDayOfMonth = this.getAllDayOfMonth(value);
        this.setState({
            ...this.state,
            allDayOfMonth: allDayOfMonth,
            month: value,
            changeMonth: true,
        });
    }

    /**
     * Function thay đổi file import
     * @param {*} value : Dữ liệu import
     * @param {*} checkFileImport : true file import hợp lệ, false file import không hợp lệ
     */
    handleImportExcel = (value, checkFileImport) => {
        const { timekeepingType } = this.props;
        const { allDayOfMonth } = this.state;

        if (checkFileImport) {
            let importData = [], rowError = [];
            if (timekeepingType === 'shift') {
                for (let i = 0; i < value.length; i = i + 3) {
                    let row1 = value[i];
                    let row2 = value[i + 1];
                    let row3 = value[i + 2];
                    if (!row1 || !row2 || !row3) {
                        checkFileImport = false;
                        break;
                    };
                    let shift1s = row1.dateOfMonth.map(x => x ? true : false);
                    let shift2s = row2.dateOfMonth.map(x => x ? true : false);
                    let shift3s = row3.dateOfMonth.map(x => x ? true : false);
                    importData = [...importData, { employeeNumber: row1.employeeNumber, employeeName: row1.employeeName, shift1s: shift1s, shift2s: shift2s, shift3s: shift3s }]
                }
            } else if (timekeepingType === 'hours') {
                let array = [];
                allDayOfMonth.forEach((x, index) => {
                    if (x.day !== 'CN' && x.day !== 'Sun') {
                        array = [...array, index];
                    }
                });
                importData = value.map(x => {
                    let timekeepingByHours = x.dateOfMonth.map(y => y ? parseInt(y) : 0);
                    let totalHours = 0;
                    let totalHoursOff = 0;
                    if (x.totalHours) {
                        totalHours = parseInt(x.totalHours);
                    } else {
                        timekeepingByHours.forEach(y => {
                            totalHours = totalHours + y;
                        })
                    };
                    if (x.totalHoursOff) {
                        totalHoursOff = (x.totalHoursOff);
                    } else {
                        timekeepingByHours.forEach((y, indexs) => {
                            if (array.find(arr => arr === indexs)) {
                                totalHoursOff = totalHoursOff + (8 - y);
                            } else {
                                totalHoursOff = totalHoursOff - y
                            }
                        })
                    }

                    return { ...x, totalHours: totalHours, totalHoursOff: totalHoursOff, timekeepingByHours: timekeepingByHours }
                })
            }
            if (checkFileImport) {
                // Check dữ liệu import có hợp lệ hay không
                let checkImportData = importData;
                importData = importData.map((x, index) => {
                    let errorAlert = [];
                    if (x.employeeNumber === null || x.employeeName === null || checkImportData.filter(y => y.employeeNumber === x.employeeNumber).length > 1) {
                        rowError = [...rowError, index + 1]
                        x = { ...x, error: true }
                    }
                    if (x.employeeNumber === null) {
                        errorAlert = [...errorAlert, 'employee_number_required'];
                    } else {
                        if (checkImportData.filter(y => y.employeeNumber === x.employeeNumber).length > 1)
                            errorAlert = [...errorAlert, 'employee_code_duplicated'];
                    };
                    if (x.employeeName === null)
                        errorAlert = [...errorAlert, 'employee_name_required'];

                    x = { ...x, errorAlert: errorAlert }
                    return x;
                });
                this.setState({
                    importData: importData,
                    rowError: rowError,
                    checkFileImport: checkFileImport,
                })
            } else {
                this.setState({
                    checkFileImport: checkFileImport,
                })
            }
        } else {
            this.setState({
                checkFileImport: checkFileImport,
            })
        }
    }

    /**
     * Bắt sự kiện setting số dòng hiện thị trên một trang
     * @param {*} number : Số dòng hiện thị 
     */
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber : Số trang muốn xem
     */
    setPage = async (pageNumber) => {
        const { limit } = this.state;
        let page = (pageNumber - 1) * (limit);
        await this.setState({
            page: parseInt(page),
        });
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form  */
    isFormValidated = () => {
        let { rowError, month, importData, changeMonth } = this.state;
        const { salary } = this.props;
        if (salary.error.rowError && changeMonth === false) {
            rowError = salary.error.rowError;
            importData = salary.error.data
        }
        if (rowError.length === 0 && month && importData.length !== 0) {
            return true
        } return false
    }

    /** Function import dữ liệu */
    save = () => {
        let { importData, month } = this.state;
        let partMonth = month.split('-');
        let timesheetsMonth = [partMonth[1], partMonth[0]].join('-');
        importData = importData.map(x => ({ ...x, month: timesheetsMonth, timekeepingByShift: { shift1s: x.shift1s, shift2s: x.shift2s, shift3s: x.shift3s, } }));
        this.props.importTimesheets(importData);
        this.setState({
            changeMonth: false
        })
    }

    /**
     * Function downloadFile import mẫu
     * @param {*} e 
     * @param {*} path : Đường dẫn file
     * @param {*} fileName : Tên file dùng để lưu
     */
    requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        this.props.downloadFile(path, fileName)
    }

    render() {
        const { translate, timesheets } = this.props;

        const { timekeepingType } = this.props;

        let { limit, page, importData, rowError, configData, changeMonth, month, allDayOfMonth, checkFileImport } = this.state;

        if (timesheets.error.rowError && changeMonth === false) {
            rowError = timesheets.error.rowError;
            importData = timesheets.error.data
        }

        importData = importData.map(x => {
            return {
                ...x,
                errorAlert: x.errorAlert.map(y => translate(`human_resource.timesheets.${y}`))
            }
        });

        let exportData = configurationTimesheets.templateImportByShift(translate);

        if (timekeepingType === 'hours') {
            exportData = configurationTimesheets.templateImportByhours(translate);
        }

        let pageTotal = (importData.length % limit === 0) ?
            parseInt(importData.length / limit) :
            parseInt((importData.length / limit) + 1);
        let currentPage = parseInt((page / limit) + 1);
        let importDataCurrentPage = importData.slice(page, page + limit);

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
                        {/* Cấu hình file import */}
                        <ConFigImportFile
                            id="import_timesheets_config"
                            configData={configData}
                            textareaRow={8}
                            scrollTableWidth={850}
                            handleChangeConfig={this.handleChangeConfig}
                        />
                        {/* Chọn tháng */}
                        <div className="row">
                            <div className="form-group col-md-4 col-xs-12">
                                <label>{translate('human_resource.month')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="import_timesheets"
                                    dateFormat="month-year"
                                    deleteValue={false}
                                    value={month}
                                    onChange={this.handleMonthChange}
                                />
                            </div>
                        </div>
                        <div className="row">
                            {/* Chọn file import */}
                            <div className="form-group col-md-4 col-xs-12">
                                <ImportFileExcel
                                    configData={configData}
                                    handleImportExcel={this.handleImportExcel}
                                    disabled={!month ? true : false}
                                />
                            </div>

                            <div className="form-group pull-right col-md-4 col-xs-12">
                                {/* Dowload file import mẫu */}
                                <ExportExcel id="download_template_salary" type='link' exportData={exportData}
                                    buttonName={` ${translate('human_resource.download_file')}`} />
                            </div>

                            <div className="form-group col-md-12 col-xs-12">
                                {
                                    !checkFileImport && <span style={{ fontWeight: "bold", color: "red" }}>{translate('human_resource.note_file_import')}</span>
                                }
                                {
                                    importDataCurrentPage.length !== 0 && (
                                        <React.Fragment>
                                            <DataTableSetting
                                                tableId="importData"
                                                limit={limit}
                                                setLimit={this.setLimit}
                                                hideColumnOption={false}
                                            />
                                            {rowError.length !== 0 && (
                                                <React.Fragment>
                                                    <span style={{ fontWeight: "bold", color: "red" }}>{translate('human_resource.error_row')}:{rowError.join(', ')}</span>
                                                </React.Fragment>
                                            )}
                                            <div id="croll-table-import">
                                                {timekeepingType === 'shift' &&
                                                    <table id="importData" className="table table-striped table-bordered table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th>{translate('human_resource.stt')}</th>
                                                                <th className="col-fixed" style={{ width: 120 }}>{translate('human_resource.staff_number')}</th>
                                                                <th className="col-fixed" style={{ width: 120 }}>{translate('human_resource.staff_name')}</th>
                                                                {allDayOfMonth.map((x, index) => (
                                                                    <th key={index}>{x.day}&nbsp; {x.date}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                importDataCurrentPage.map((x, index) => {
                                                                    let shift1s = x.shift1s, shift2s = x.shift2s, shift3s = x.shift3s;
                                                                    return (
                                                                        <React.Fragment key={index}>
                                                                            <tr style={x.error ? { color: "#dd4b39" } : { color: '' }} title={x.errorAlert.join(', ')}>
                                                                                <td rowSpan="3">{page + index + 1}</td>
                                                                                <td rowSpan="3">{x.employeeNumber}</td>
                                                                                <td rowSpan="3">{x.employeeName}</td>
                                                                                {
                                                                                    allDayOfMonth.map((y, indexs) => (
                                                                                        <td key={indexs}>
                                                                                            {shift1s[indexs] ? <i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i> :
                                                                                                <i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i>}
                                                                                        </td>
                                                                                    ))
                                                                                }
                                                                            </tr>
                                                                            <tr>{
                                                                                allDayOfMonth.map((y, indexs) => (
                                                                                    <td key={indexs}>
                                                                                        {shift2s[indexs] ? <i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i> :
                                                                                            <i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i>}
                                                                                    </td>
                                                                                ))
                                                                            }
                                                                            </tr>
                                                                            <tr>{
                                                                                allDayOfMonth.map((y, indexs) => (
                                                                                    <td key={indexs}>
                                                                                        {shift3s[indexs] ? <i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i> :
                                                                                            <i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i>}
                                                                                    </td>
                                                                                ))
                                                                            }
                                                                            </tr>
                                                                        </React.Fragment>
                                                                    )
                                                                })
                                                            }

                                                        </tbody>
                                                    </table>
                                                }
                                                {timekeepingType === 'hours' &&
                                                    <table id="importData" className="table table-striped table-bordered table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th rowSpan="2" className="col-fixed" style={{ width: 120 }}>{translate('human_resource.staff_number')}</th>
                                                                <th rowSpan="2" className="col-fixed" style={{ width: 150 }}>{translate('human_resource.staff_name')}</th>

                                                                <th colSpan={allDayOfMonth.length} className="col-fixed" style={{ width: 70 * allDayOfMonth.length, textAlign: 'left' }} >{translate('human_resource.timesheets.date_of_month')}</th>
                                                                <th rowSpan="2" className="col-fixed" style={{ width: 100 }}>{translate('human_resource.timesheets.total_timesheets')}</th>
                                                                <th rowSpan="2" className="col-fixed" style={{ width: 100 }}>{translate('human_resource.timesheets.total_hours_off')}</th>
                                                            </tr>
                                                            <tr>
                                                                {allDayOfMonth.map((x, index) => (
                                                                    <th className="col-fixed" style={{ width: 70 }} key={index}>{`${x.date} - ${x.day}`}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                importDataCurrentPage.map((x, index) => {
                                                                    let timekeepingByHours = x.timekeepingByHours;
                                                                    return (
                                                                        <tr key={index} style={x.error ? { color: "#dd4b39" } : { color: '' }} title={x.errorAlert.join(', ')}>
                                                                            <td>{x.employeeNumber}</td>
                                                                            <td>{x.employeeName}</td>

                                                                            {
                                                                                allDayOfMonth.map((y, indexs) => (
                                                                                    <td key={indexs}>
                                                                                        {timekeepingByHours[indexs] !== 0 ? timekeepingByHours[indexs] : null}
                                                                                    </td>
                                                                                ))
                                                                            }
                                                                            <td>{x.totalHours}</td>
                                                                            <td>{x.totalHoursOff}</td>
                                                                        </tr>
                                                                    )
                                                                })}

                                                        </tbody>
                                                    </table>
                                                }
                                            </div>

                                        </React.Fragment>
                                    )}
                            </div>
                            <SlimScroll outerComponentId="croll-table-import" innerComponentId="importData" innerComponentWidth={1500} activate={true} />
                            <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
};

function mapState(state) {
    const { timesheets, salary } = state;
    return { timesheets, salary };
};

const actionCreators = {
    importTimesheets: TimesheetsActions.importTimesheets,
    downloadFile: AuthActions.downloadFile,
};

const importExcel = connect(mapState, actionCreators)(withTranslate(TimesheetsByShiftImportForm));
export { importExcel as TimesheetsByShiftImportForm };
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getStorage } from '../../../../config';

import { DataTableSetting, DeleteNotification, PaginateBar, DatePicker, SelectMulti, SlimScroll, ExportExcel } from '../../../../common-components';

import { TimesheetsByShiftImportForm, TimesheetsCreateForm, TimesheetsEditForm, TrendWorkOfEmployeeChart } from './combinedContent';
import { EmployeeViewForm } from '../../profile/employee-management/components/combinedContent';

import { TimesheetsActions } from '../redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { ConfigurationActions } from '../../../super-admin//module-configuration/redux/actions';

import './timesheet.css';

class TimesheetsManagement extends Component {
    constructor(props) {
        super(props);
        let allDayOfMonth = this.getAllDayOfMonth(this.formatDate(Date.now(), true));
        let dateNow = new Date();
        let dayNow = dateNow.getDate();
        this.state = {
            allDayOfMonth: allDayOfMonth,
            dayNow: dayNow,
            month: this.formatDate(Date.now(), true),
            employeeNumber: "",
            organizationalUnits: null,
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        const { month } = this.state;

        let monthSearch = month;
        if (month) {
            let partMonth = this.state.month.split('-');
            monthSearch = [partMonth[1], partMonth[0]].join('-');
        }
        this.props.getConfiguration();
        this.props.getDepartment();
        this.props.searchTimesheets({ ...this.state, month: monthSearch });
    }

    /** Function bắt sự kiện thêm thông tin chấm công */
    createTimesheets = () => {
        window.$('#modal-create-timesheets').modal('show');
    }

    /**
     *  Bắt sự kiện click xem thông tin nhân viên
     * @param {*} value : Thông tin nhân viên muốn xem
     */
    handleView = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRowView: value
            }
        });
        window.$(`#modal-view-employee${value._id}`).modal('show');
    }

    /**
     *  Bắt sự kiện click xem xu hướng làm việc của nhân viên
     * @param {*} id : id nhân viên
     */
    handleViewChart = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRowViewChart: value
            }
        });
        window.$(`#modal-view-chart${value._id}`).modal('show');
    }


    /** Function bắt sự kiện import thông tin chấm công */
    handleImport = async () => {
        await this.setState({
            ...this.state,
            importExcel: true
        })
        window.$('#modal_import_file').modal('show');
    }

    /** Function bắt sự kiện chỉnh sửa thông tin chấm công */
    handleEdit = async (value) => {
        await this.setState({
            ...this.state,
            currentRow: value
        })
        window.$('#modal-edit-timesheets').modal('show');
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


    /** Function lưu giá trị mã nhân viên vào state khi thay đổi */
    handleMSNVChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });

    }

    /**
     * Function lưu giá trị unit vào state khi thay đổi
     * @param {*} value : Array id đơn vị
     */
    handleUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            organizationalUnits: value
        })
    }

    /**
     * Function lưu giá trị tháng vào state khi thay đổi
     * @param {*} value : Tháng
     */
    handleMonthChange = (value) => {
        this.setState({
            ...this.state,
            month: value
        });
    }

    /** Function bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        const { month } = this.state;
        let allDayOfMonth = this.getAllDayOfMonth(month);
        let dateNow = new Date(), dayNow = dateNow.getDate();
        let partMonth = month.split('-');
        if (this.formatDate(new Date(partMonth[1], partMonth[0], 0), true) !== this.formatDate(dateNow, true)) {
            dayNow = 31;
        }
        this.setState({
            allDayOfMonth: allDayOfMonth,
            dayNow: dayNow
        })

        let monthNew = [partMonth[1], partMonth[0]].join('-');
        this.props.searchTimesheets({ ...this.state, month: monthNew });
    }

    /**
     * Bắt sự kiện setting số dòng hiện thị trên một trang
     * @param {*} number : Số dòng 
     */
    setLimit = async (number) => {
        const { month } = this.state;
        await this.setState({
            limit: parseInt(number),
        });

        let monthSearch = month;
        if (month) {
            let partMonth = this.state.month.split('-');
            monthSearch = [partMonth[1], partMonth[0]].join('-');
        }

        this.props.searchTimesheets({ ...this.state, month: monthSearch });
    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber :  Số trang muốn xem
     */
    setPage = async (pageNumber) => {
        const { month, limit } = this.state;
        let page = (pageNumber - 1) * (limit);
        await this.setState({
            page: parseInt(page),
        });
        let monthSearch = month;
        if (month) {
            let partMonth = month.split('-');
            monthSearch = [partMonth[1], partMonth[0]].join('-');
        }
        this.props.searchTimesheets({ ...this.state, month: monthSearch });
    }

    /**
     * Function chyển đổi dữ liệu chấm công thành dạng dữ liệu dùng export
     * @param {*} data : Dữ liệu chấm công
     */
    convertDataToExportData = (data, timekeepingType) => {
        const { translate } = this.props;
        let dataExport = [], styleColumn, space = [];
        if (timekeepingType === 'shift') {
            space = [{ key: "space", value: "", width: '10' }];
            styleColumn = {
                STT: {
                    vertical: 'middle',
                    horizontal: 'center'
                },
                fullName: {
                    vertical: 'middle',
                    horizontal: 'center'
                },
                employeeNumber: {
                    vertical: 'middle',
                    horizontal: 'center'
                },
                totalHours: {
                    vertical: 'middle',
                    horizontal: 'center'
                },

            };
            data.map((x, index) => {
                let totalHours = x.totalHours;
                let shifts1s = x.timekeepingByShift.shift1s;
                let shifts2s = x.timekeepingByShift.shift2s;
                let shifts3s = x.timekeepingByShift.shift3s;
                let colShifts1 = {}, colShifts2 = {}, colShifts3 = {};
                shifts1s.forEach((y, key) => {
                    if (y === true) {
                        colShifts1 = { ...colShifts1, [`date${key + 1}`]: 'X' };
                    } else {
                        colShifts1 = { ...colShifts1, [`date${key + 1}`]: '' }
                    }
                });
                shifts2s.forEach((y, key) => {
                    if (y === true) {
                        colShifts2 = { ...colShifts2, [`date${key + 1}`]: 'X' };
                    } else {
                        colShifts2 = { ...colShifts2, [`date${key + 1}`]: '' }
                    }
                });
                shifts3s.forEach((y, key) => {
                    if (y === true) {
                        colShifts3 = { ...colShifts3, [`date${key + 1}`]: 'X' };
                    } else {
                        colShifts3 = { ...colShifts3, [`date${key + 1}`]: '' }
                    }
                });

                let row = [
                    {
                        merges: { STT: 3, employeeNumber: 3, fullName: 3, totalHours: 3 },
                        STT: index + 1,
                        fullName: x.employee ? x.employee.fullName : "",
                        employeeNumber: x.employee ? x.employee.employeeNumber : "",
                        space: translate('human_resource.timesheets.shifts1'),
                        ...colShifts1,
                        totalHours: totalHours,
                    }, {
                        STT: "",
                        fullName: "",
                        employeeNumber: "",
                        space: translate('human_resource.timesheets.shifts2'),
                        ...colShifts2,
                        totalHours: "",
                    }, {
                        STT: "",
                        fullName: "",
                        employeeNumber: "",
                        space: translate('human_resource.timesheets.shifts3'),
                        ...colShifts3,
                        totalHours: "",
                    },
                ]
                dataExport = dataExport.concat(row);
            });
        };

        if (timekeepingType === 'hours') {
            dataExport = data.map((x, index) => {
                let totalHours = x.totalHours;
                let timekeepingByHours = x.timekeepingByHours;
                let colName = {};
                timekeepingByHours.forEach((y, key) => {
                    colName = { ...colName, [`date${key + 1}`]: y !== 0 ? y : '' };
                });

                return {
                    STT: index + 1,
                    fullName: x.employee ? x.employee.fullName : "",
                    employeeNumber: x.employee ? x.employee.employeeNumber : "",
                    ...colName,
                    totalHours: totalHours,
                }
            })
        }

        let addColumns = [];
        for (let n = 1; n <= 31; n++) {
            addColumns = [...addColumns, { key: `date${n}`, value: n, width: 4 }]
        };

        let exportData = {
            fileName: translate('human_resource.timesheets.file_name_export'),
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    sheetTitle: translate('human_resource.timesheets.file_name_export'),
                    sheetTitleWidth: 35,
                    tables: [
                        {
                            merges: [{
                                key: "other",
                                columnName: translate('human_resource.timesheets.date_of_month'),
                                keyMerge: 'date1',
                                colspan: 31
                            }],
                            rowHeader: 2,
                            styleColumn: styleColumn,
                            columns: [
                                { key: "STT", value: translate('human_resource.stt'), width: 7 },
                                { key: "employeeNumber", value: translate('human_resource.staff_number') },
                                { key: "fullName", value: translate('human_resource.staff_name'), width: 20 },
                                ...space,
                                ...addColumns,
                                { key: "totalHours", value: translate('human_resource.timesheets.total_timesheets') },
                            ],
                            data: dataExport
                        }
                    ]
                },
            ]
        }
        return exportData
    }

    render() {
        const { translate, timesheets, department, modelConfiguration } = this.props;

        const { month, limit, page, allDayOfMonth, dayNow, organizationalUnits, currentRowViewChart, currentRowView, currentRow, importExcel } = this.state;

        let timekeepingType, config, listTimesheets = [], exportData = [], humanResourceConfig = modelConfiguration.humanResourceConfig;

        if (humanResourceConfig) {
            timekeepingType = humanResourceConfig.timekeepingType;
            if (timekeepingType === 'shift') {
                config = humanResourceConfig.timekeepingByShift
            }
        }

        if (timesheets.isLoading === false && timekeepingType) {
            listTimesheets = timesheets.listTimesheets;
            exportData = this.convertDataToExportData(listTimesheets, timekeepingType);
        }

        let pageTotal = (timesheets.totalList % limit === 0) ?
            parseInt(timesheets.totalList / limit) :
            parseInt((timesheets.totalList / limit) + 1);
        let currentPage = parseInt((page / limit) + 1);

        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/* Button chấm công */}
                        <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                            <button type="button" className="btn btn-success pull-right dropdown-toggle" data-toggle="dropdown" aria-expanded="true" >{translate('human_resource.timesheets.add_timesheets')}</button>
                            <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }} >
                                <li><a style={{ cursor: 'pointer' }} title={translate('human_resource.add_data_by_excel')} onClick={this.handleImport}>{translate('human_resource.timesheets.add_import')}</a></li>
                                <li><a style={{ cursor: 'pointer' }} title={translate('human_resource.timesheets.add_timesheets_title')} onClick={this.createTimesheets}>{translate('human_resource.timesheets.add_by_hand')}</a></li>
                            </ul>
                        </div>
                        <ExportExcel id="export-timesheets" buttonName={translate('human_resource.name_button_export')} exportData={exportData} style={{ marginRight: 15, marginTop: 0 }} />
                    </div>

                    <div className="form-inline">
                        {/* Đơn vị */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.unit')}</label>
                            <SelectMulti id={`multiSelectUnit`} multiple="multiple"
                                options={{ nonSelectedText: translate('human_resource.non_unit'), allSelectedText: translate('human_resource.all_unit') }}
                                items={department.list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                        </div>
                        {/* Mã nhân viên */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.staff_number')}</label>
                            <input type="text" className="form-control" name="employeeNumber" onChange={this.handleMSNVChange} placeholder={translate('human_resource.staff_number')} autoComplete="off" />
                        </div>
                    </div>

                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        {/* Tháng */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.month')}</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                deleteValue={false}
                                value={month}
                                onChange={this.handleMonthChange}
                            />
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} >{translate('general.search')}</button>
                        </div>
                    </div>
                    {
                        timekeepingType === 'shift' &&
                        <div className="form-inline">
                            <label>{translate('human_resource.timesheets.symbol')}: &emsp; &emsp; </label><i style={{ color: "#08b30e", fontSize: 19 }} className="glyphicon glyphicon-ok"></i><span> -- {translate('human_resource.timesheets.do_work')} </span>
                                            &emsp;&emsp;&emsp;<i style={{ color: "red", fontSize: 19 }} className="glyphicon glyphicon-remove"></i><span> -- {translate('human_resource.timesheets.not_work')}</span>

                        </div>
                    }


                    <DataTableSetting
                        tableId="table-timesheets"
                        limit={this.state.limit}
                        setLimit={this.setLimit}
                        hideColumnOption={false}
                    />
                    {
                        timekeepingType === 'shift' &&
                        <div id="croll-table" className="form-inline">
                            <div className="sticky col-lg-6 col-md-6 col-sm-7 col-xs-8 " style={{ padding: 0 }}>
                                <table id="table-timesheets" className="keeping table table-bordered">
                                    <thead>
                                        <tr style={{ height: 58 }}>
                                            <th>{translate('human_resource.staff_number')}</th>
                                            <th>{translate('human_resource.staff_name')}</th>
                                            <th>{translate('human_resource.timesheets.total_timesheets')}</th>
                                            <th>{translate('general.action')}</th>
                                            <th>{translate('human_resource.timesheets.shift_work')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            listTimesheets.length !== 0 && listTimesheets.map((x, index) => (
                                                <React.Fragment key={index}>
                                                    <tr>
                                                        <td rowSpan="3" style={{ paddingTop: 22 }}><a style={{ cursor: 'pointer' }} onClick={() => this.handleView(x.employee)}>{x.employee ? x.employee.employeeNumber : null}</a></td>
                                                        <td rowSpan="3" style={{ paddingTop: 22 }}>{x.employee ? x.employee.fullName : null}</td>
                                                        <td rowSpan="3" style={{ paddingTop: 22 }}> {x.totalHours}</td>
                                                        <td rowSpan="3" style={{ paddingTop: 22, textAlign: "center" }}>
                                                            <a onClick={() => this.handleViewChart(x.employee)} style={{ width: '5px' }} title={`Xu hướng làm việc của ${x.employee ? x.employee.fullName : null}`}><i className="material-icons">insert_chart_outlined</i></a>
                                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.timesheets.edit_timesheets')}><i className="material-icons">edit</i></a>
                                                            <DeleteNotification
                                                                content={translate('human_resource.timesheets.delete_timesheets')}
                                                                data={{
                                                                    id: x._id,
                                                                    info: x.employee.employeeNumber + "- " + translate('human_resource.month') + ": " + month
                                                                }}
                                                                func={this.props.deleteTimesheets}
                                                            />

                                                        </td>
                                                        <td>{translate('human_resource.timesheets.shifts1')}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{translate('human_resource.timesheets.shifts2')}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{translate('human_resource.timesheets.shifts3')}</td>
                                                    </tr>

                                                </React.Fragment>

                                            ))
                                        }
                                    </tbody>

                                </table>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-5 col-xs-4" style={{ padding: 0 }}>
                                <table id="timesheets" className="timekeeping table table-striped table-bordered table-hover" style={{ marginLeft: -1 }}>
                                    <thead>
                                        <tr style={{ height: 58 }}>
                                            {allDayOfMonth.map((x, index) => (
                                                <th key={index}>{x.day}&nbsp; {x.date}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            listTimesheets.length !== 0 && listTimesheets.map((x, index) => {
                                                let shift1s = x.timekeepingByShift.shift1s, shift2s = x.timekeepingByShift.shift2s, shift3s = x.timekeepingByShift.shift3s;
                                                return (
                                                    <React.Fragment key={index}>
                                                        <tr>{
                                                            allDayOfMonth.map((y, indexs) => (
                                                                <td key={indexs}>
                                                                    {shift1s[indexs] && indexs < dayNow ? <i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i> :
                                                                        (indexs < dayNow ? <i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i> : null)}
                                                                </td>
                                                            ))
                                                        }
                                                        </tr>
                                                        <tr>{
                                                            allDayOfMonth.map((y, indexs) => (
                                                                <td key={indexs}>
                                                                    {shift2s[indexs] === true && indexs < dayNow ? <i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i> :
                                                                        (indexs < dayNow ? <i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i> : null)}
                                                                </td>
                                                            ))
                                                        }
                                                        </tr>
                                                        <tr>{
                                                            allDayOfMonth.map((y, indexs) => (
                                                                <td key={indexs}>
                                                                    {shift3s[indexs] === true && indexs < dayNow ? <i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i> :
                                                                        (indexs < dayNow ? <i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i> : null)}
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
                            </div>
                        </div>
                    }
                    {
                        timekeepingType === 'hours' &&
                        <div id="croll-table" className="row-equal-height form-inline">
                            {/* <div className="sticky" style={{ padding: 0 }}> */}
                            <table id="timesheets" className="table table-striped table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th rowSpan="2" className="col-fixed" style={{ width: 120 }}>{translate('human_resource.staff_number')}</th>
                                        <th rowSpan="2" className="col-fixed" style={{ width: 150 }}>{translate('human_resource.staff_name')}</th>
                                        <th rowSpan="2" className="col-fixed" style={{ width: 100 }}>{translate('human_resource.timesheets.total_timesheets')}</th>
                                        <th rowSpan="2" className="col-fixed" style={{ width: 120, textAlign: "center" }}>{translate('general.action')}</th>
                                        <th colSpan={allDayOfMonth.length} className="col-fixed" style={{ width: 70 * allDayOfMonth.length, textAlign: 'left' }} >{translate('human_resource.timesheets.date_of_month')}</th>
                                    </tr>
                                    <tr>
                                        {allDayOfMonth.map((x, index) => (
                                            <th className="col-fixed" style={{ width: 70 }} key={index}>{`${x.date} - ${x.day}`}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listTimesheets.length !== 0 && listTimesheets.map((x, index) => {
                                            let timekeepingByHours = x.timekeepingByHours;
                                            return (
                                                <tr key={index}>
                                                    <td><a style={{ cursor: 'pointer' }} onClick={() => this.handleView(x.employee)}>{x.employee ? x.employee.employeeNumber : null}</a></td>
                                                    <td>{x.employee ? x.employee.fullName : null}</td>
                                                    <td>{x.totalHours}</td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <a onClick={() => this.handleViewChart(x.employee)} style={{ width: '5px' }} title={`Xu hướng làm việc của ${x.employee ? x.employee.fullName : null}`}><i className="material-icons">insert_chart_outlined</i></a>
                                                        <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.timesheets.edit_timesheets')}><i className="material-icons">edit</i></a>
                                                        <DeleteNotification
                                                            content={translate('human_resource.timesheets.delete_timesheets')}
                                                            data={{
                                                                id: x._id,
                                                                info: x.employee.employeeNumber + "- " + translate('human_resource.month') + ": " + month
                                                            }}
                                                            func={this.props.deleteTimesheets}
                                                        />

                                                    </td>
                                                    {
                                                        allDayOfMonth.map((y, indexs) => (
                                                            <td key={indexs}>
                                                                {timekeepingByHours[indexs] !== 0 ? timekeepingByHours[indexs] : null}
                                                            </td>
                                                        ))
                                                    }
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    }

                    <SlimScroll outerComponentId='croll-table' innerComponentId='timesheets' innerComponentWidth={1000} activate={true} />
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                </div>
                {/* Form thêm mới thông tin chấm công */}
                <TimesheetsCreateForm
                    timekeepingType={timekeepingType}
                />

                {importExcel &&
                    <TimesheetsByShiftImportForm
                        timekeepingType={timekeepingType} />
                }

                {   /* Form chinh sửa thông tin chấm công */
                    currentRow &&
                    <TimesheetsEditForm
                        _id={currentRow._id}
                        timekeepingType={timekeepingType}
                        employeeNumber={currentRow.employee ? `${currentRow.employee.employeeNumber} - ${currentRow.employee.fullName}` : null}
                        month={this.formatDate(currentRow.month, true)}
                        shift1s={currentRow.timekeepingByShift.shift1s}
                        shift2s={currentRow.timekeepingByShift.shift2s}
                        shift3s={currentRow.timekeepingByShift.shift3s}
                        timekeepingByHours={currentRow.timekeepingByHours}
                        allDayOfMonth={this.getAllDayOfMonth(this.formatDate(currentRow.month, true))}
                    />
                }
                {/* From xem thông tin nhân viên */
                    <EmployeeViewForm
                        _id={currentRowView ? currentRowView._id : ""}
                    />
                }
                {
                    currentRowViewChart &&
                    <TrendWorkOfEmployeeChart employeeId={currentRowViewChart ? currentRowViewChart._id : 'null'} nameChart={`Xu hướng làm việc của ${currentRowViewChart.fullName}`} nameData1='Tổng giờ làm' nameData2='Số giờ tăng ca' />
                }
            </div>
        );
    }
}

function mapState(state) {
    const { department, timesheets, modelConfiguration } = state;
    return { department, timesheets, modelConfiguration };
};

const actionCreators = {
    getDepartment: DepartmentActions.get,
    searchTimesheets: TimesheetsActions.searchTimesheets,
    deleteTimesheets: TimesheetsActions.deleteTimesheets,
    getConfiguration: ConfigurationActions.getConfiguration,

};

const connectedTimesheets = connect(mapState, actionCreators)(withTranslate(TimesheetsManagement));
export { connectedTimesheets as TimesheetsManagement };
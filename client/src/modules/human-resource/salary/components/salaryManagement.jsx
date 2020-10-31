import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DeleteNotification, PaginateBar, DatePicker, SelectMulti, ExportExcel } from '../../../../common-components';

import { SalaryCreateForm, SalaryEditForm, SalaryImportForm } from './combinedContent';
import { EmployeeViewForm } from '../../profile/employee-management/components/combinedContent';

import { SalaryActions } from '../redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';

class SalaryManagement extends Component {
    constructor(props) {
        super(props);
        let partMonth = this.formatDate(Date.now(), true).split('-');
        let month = [partMonth[1], partMonth[0]].join('-');
        this.state = {
            month: month,
            employeeNumber: "",
            organizationalUnits: null,
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        this.props.searchSalary(this.state);
        this.props.getDepartment();
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

    /** Function bắt sự kiện thêm lương nhân viên bằng tay */
    createSalary = () => {
        window.$('#modal-create-salary').modal('show');
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

    /** Function bắt sự kiện thêm lương nhân viên bằng import file */
    importSalary = async () => {
        await this.setState({
            importSalary: true
        })
        window.$('#modal_import_file').modal('show');
    }

    /**
     * Function bắt sự kiện chỉnh sửa thông tin lương nhân viên
     * @param {*} value : Thông tin lương nhân viên cần chỉnh sửa
     */
    handleEdit = async (value) => {
        await this.setState({
            ...this.state,
            currentRow: value
        })
        window.$('#modal-edit-salary').modal('show');
    }

    /** Function lưu giá trị mã nhân viên vào state khi thay đổi */
    handleMSNVChange = (event) => {
        const { name, value } = event.target;
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
     *Function lưu giá trị tháng vào state khi thay đổi
     * @param {*} value : Giá trị tháng
     */
    handleMonthChange = (value) => {
        if (value) {
            let partMonth = value.split('-');
            value = [partMonth[1], partMonth[0]].join('-');
        }
        this.setState({
            ...this.state,
            month: value
        });
    }

    /** Function bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        this.props.searchSalary(this.state);
    }

    /**
     * Bắt sự kiện setting số dòng hiện thị trên một trang
     * @param {*} number : Số dòng hiện thị
     */
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.searchSalary(this.state);
    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber : Số trang cần xem
     */
    setPage = async (pageNumber) => {
        let { limit } = this.state;
        let page = (pageNumber - 1) * (limit);
        await this.setState({
            page: parseInt(page),
        });
        this.props.searchSalary(this.state);
    }

    /**
     * Function chyển đổi dữ liệu bảng lương thành dạng dữ liệu dùng export
     * @param {*} data : dữ liệu bảng lương
     */
    convertDataToExportData = (data) => {
        const { translate, department } = this.props;
        let otherSalary = [];
        if (data) {
            data.forEach(x => {
                if (x.bonus.length !== 0) {
                    for (let count in x.bonus) {
                        if (!otherSalary.includes(x.bonus[count].nameBonus)) {
                            otherSalary = [...otherSalary, x.bonus[count].nameBonus]
                        }
                    };
                }
            })

            data = data.map((x, index) => {
                let organizationalUnit = department.list.find(y => y._id === x.organizationalUnit);
                let total = 0, bonus = {};
                let d = new Date(x.month),
                    month = '' + (d.getMonth() + 1),
                    year = d.getFullYear();
                if (x.bonus.length !== 0) {
                    for (let count in x.bonus) {
                        total = total + parseInt(x.bonus[count].number);
                        otherSalary.forEach((y, key) => {
                            if (y === x.bonus[count].nameBonus) {
                                bonus = { ...bonus, [`bonus${key}`]: parseInt(x.bonus[count].number) }
                            }
                        })
                    };
                }

                return {
                    STT: index + 1,
                    employeeNumber: x.employee.employeeNumber,
                    fullName: x.employee.fullName,
                    mainSalary: parseInt(x.mainSalary),
                    birthdate: new Date(x.employee.birthdate),
                    status: x.employee.status === 'active' ? translate('human_resource.profile.active') : translate('human_resource.profile.leave'),
                    gender: x.employee.gender === 'male' ? translate('human_resource.profile.male') : translate('human_resource.profile.female'),
                    organizationalUnit: organizationalUnit ? organizationalUnit.name : 'Deleted',
                    total: total + parseInt(x.mainSalary),
                    month: month,
                    year: year,
                    ...bonus
                };
            })
        }
        let columns = [{ key: 'bonus0', value: 0 }];
        if (otherSalary.length !== 0) {
            columns = otherSalary.map((x, index) => {
                return { key: `bonus${index}`, value: x, }
            })
        }
        let merges = [{
            key: "other",
            columnName: translate('human_resource.salary.other_salary'),
            keyMerge: 'bonus0',
            colspan: columns.length
        }]

        let exportData = {
            fileName: translate('human_resource.salary.file_name_export'),
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    sheetTitle: translate('human_resource.salary.file_name_export'),
                    tables: [
                        {
                            rowHeader: 2,
                            merges: merges,
                            columns: [
                                { key: "STT", value: translate('human_resource.stt'), width: 7, },
                                { key: "month", value: translate('human_resource.month'), width: 10 },
                                { key: "year", value: translate('human_resource.work_plan.year'), width: 10 },
                                { key: "employeeNumber", value: translate('human_resource.staff_number') },
                                { key: "fullName", value: translate('human_resource.staff_name'), width: 20 },
                                { key: "organizationalUnit", value: translate('human_resource.unit'), width: 25 },
                                { key: "gender", value: translate('human_resource.profile.gender') },
                                { key: "birthdate", value: translate('human_resource.profile.date_birth') },
                                { key: "status", value: translate('human_resource.profile.status_work') },
                                { key: "mainSalary", value: translate('human_resource.salary.table.main_salary'), },
                                ...columns,
                                { key: "total", value: translate('human_resource.salary.table.total_salary'), },
                            ],
                            data: data
                        },
                    ]
                },
            ]
        }
        return exportData
    }

    render() {
        const { translate, salary, department } = this.props;

        const { limit, page, importSalary, currentRow, currentRowView } = this.state;

        let formater = new Intl.NumberFormat();
        let { list } = department;
        let listSalarys = [], exportData = [];

        if (salary.isLoading === false) {
            listSalarys = salary.listSalarys;
            exportData = this.convertDataToExportData(listSalarys);
        }

        let pageTotal = (salary.totalList % limit === 0) ?
            parseInt(salary.totalList / limit) :
            parseInt((salary.totalList / limit) + 1);
        let currentPage = parseInt((page / limit) + 1);

        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/* Nút xuất thêm bảng lương*/}
                        <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                            <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('human_resource.salary.add_salary_title')} >{translate('human_resource.salary.add_salary')}</button>
                            <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                                <li><a style={{ cursor: 'pointer' }} title={translate('human_resource.salary.add_import_title')} onClick={this.importSalary}>
                                    {translate('human_resource.salary.add_import')}</a></li>
                                <li><a style={{ cursor: 'pointer' }} title={translate('human_resource.salary.add_by_hand_title')} onClick={this.createSalary}>
                                    {translate('human_resource.salary.add_by_hand')}</a></li>
                            </ul>
                        </div>
                        {/* Nút xuất báo cáo */}
                        <ExportExcel id="export-salary" buttonName={translate('human_resource.name_button_export')} exportData={exportData} style={{ marginRight: 15, marginTop: 0 }} />
                    </div>

                    <div className="form-inline">
                        {/* Đơn vị */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.unit')}</label>
                            <SelectMulti id={`multiSelectUnit`} multiple="multiple"
                                options={{ nonSelectedText: translate('human_resource.non_unit'), allSelectedText: translate('human_resource.all_unit') }}
                                items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                        </div>

                        {/* Mã số nhân viên */}
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
                                value={this.formatDate(Date.now(), true)}
                                onChange={this.handleMonthChange}
                            />

                        </div>
                        {/* Nút tìm kiếm */}
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} >{translate('general.search')}</button>
                        </div>
                    </div>

                    <table id="salary-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('human_resource.staff_number')}</th>
                                <th>{translate('human_resource.staff_name')}</th>
                                <th>{translate('human_resource.month')}</th>
                                <th>{translate('human_resource.salary.table.total_salary')}</th>
                                <th>{translate('human_resource.unit')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('human_resource.salary.table.action')}
                                    <DataTableSetting
                                        tableId="salary-table"
                                        columnArr={[
                                            translate('human_resource.staff_number'),
                                            translate('human_resource.staff_name'),
                                            translate('human_resource.month'),
                                            translate('human_resource.salary.table.total_salary'),
                                            translate('human_resource.unit'),
                                        ]}
                                        limit={limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(listSalarys && listSalarys.length !== 0) &&
                                listSalarys.map((x, index) => {
                                    let total = parseInt(x.mainSalary);
                                    if (x.bonus && x.bonus.length !== 0) {
                                        for (let count in x.bonus) {
                                            total = total + parseInt(x.bonus[count].number)
                                        }
                                    }
                                    let organizationalUnit = list.find(y => y._id === x.organizationalUnit);
                                    return (
                                        <tr key={index}>
                                            <td><a style={{ cursor: 'pointer' }} onClick={() => this.handleView(x.employee)}>{x.employee ? x.employee.employeeNumber : null}</a></td>
                                            <td>{x.employee ? x.employee.fullName : null}</td>
                                            <td>{this.formatDate(x.month, true)}</td>
                                            <td>{formater.format(total)} {x.unit}</td>
                                            <td>{organizationalUnit ? organizationalUnit.name : 'Deleted'}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.salary.edit_salary')}><i className="material-icons">edit</i></a>
                                                <DeleteNotification
                                                    content={translate('human_resource.salary.delete_salary')}
                                                    data={{
                                                        id: x._id,
                                                        info: x.employee.employeeNumber + "- " + translate('human_resource.month') + ": " + this.formatDate(x.month, true)
                                                    }}
                                                    func={this.props.deleteSalary}
                                                />
                                            </td>
                                        </tr>)
                                })
                            }
                        </tbody>
                    </table>

                    {salary.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!listSalarys || listSalarys.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal} currentPage={currentPage} func={this.setPage} />
                </div>

                {/* Form thêm thông tin bảng lương bằng tay */}
                <SalaryCreateForm />

                {/* Form Thêm thông tin bảng lương bằng import file */}
                {importSalary && <SalaryImportForm />}

                {/* Form chỉnh sửa thông tin bảng lương */
                    currentRow &&
                    <SalaryEditForm
                        _id={currentRow._id}
                        unit={currentRow.unit}
                        employeeNumber={currentRow.employee ? currentRow.employee.employeeNumber : null}
                        month={this.formatDate(currentRow.month, true)}
                        mainSalary={currentRow.mainSalary}
                        bonus={currentRow.bonus}
                    />
                }
                {/* From xem thông tin nhân viên */
                    <EmployeeViewForm
                        _id={currentRowView ? currentRowView._id : ""}
                    />
                }
            </div>
        );
    }
}

function mapState(state) {
    const { salary, department } = state;
    return { salary, department };
};

const actionCreators = {
    searchSalary: SalaryActions.searchSalary,
    deleteSalary: SalaryActions.deleteSalary,
    getDepartment: DepartmentActions.get,
};

const connectedListSalary = connect(mapState, actionCreators)(withTranslate(SalaryManagement));
export { connectedListSalary as SalaryManagement };
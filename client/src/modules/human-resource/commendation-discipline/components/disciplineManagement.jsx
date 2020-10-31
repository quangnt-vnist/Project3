import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DeleteNotification, PaginateBar, SelectMulti, ExportExcel } from '../../../../common-components';

import { DisciplineCreateForm, DisciplineEditForm } from './combinedContent';
import { EmployeeViewForm } from '../../profile/employee-management/components/combinedContent';

import { DisciplineActions } from '../redux/actions';

class DisciplineManager extends Component {
    constructor(props) {
        super(props);
        let search = window.location.search.split('?')
        let keySearch = 'organizationalUnits';
        let organizationalUnits = null;

        for (let n in search) {
            let index = search[n].lastIndexOf(keySearch);
            if (index !== -1) {
                organizationalUnits = search[n].slice(keySearch.length + 1, search[n].length);
                if (organizationalUnits !== 'null' && organizationalUnits.trim() !== '') {
                    organizationalUnits = organizationalUnits.split(',')
                } else organizationalUnits = null
                break;
            }
        }

        this.state = {
            decisionNumber: "",
            employeeNumber: "",
            organizationalUnits: organizationalUnits,
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        this.props.getListDiscipline(this.state);
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
        window.$(`#modal-view-employee-displine${value._id}`).modal('show');
    }

    /**
     * Bắt sự kiện click chỉnh sửa thông tin kỷ luật
     * @param {*} value : Thông tin kỷ luật
     */
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-discipline').modal('show');
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

    /** Function bắt sự kiện thay đổi mã nhân viên và số quyết định */
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    /** Function bắt sự kiện tìm kiếm */
    handleSubmitSearch = () => {
        this.props.getListDiscipline(this.state);
    }

    /**
     * Bắt sự kiện setting số dòng hiện thị trên một trang
     * @param {*} number : Số dòng hiện thị trên 1 trang
     */
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.getListDiscipline(this.state);
    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber : Số trang muốn xem
     */
    setPage = async (pageNumber) => {
        const { limit } = this.state;
        var page = (pageNumber - 1) * limit;
        await this.setState({
            page: parseInt(page),
        });
        this.props.getListDiscipline(this.state);
    }

    /**
     * Function chyển đổi dữ liệu kỷ luật thành dạng dữ liệu dùng export
     * @param {*} data : Dữ liệu kỷ luật
     */
    convertDataToExportData = (data) => {
        const { department, translate } = this.props;
        if (data) {
            data = data.map((x, index) => {
                let decisionUnit = department.list.find(y => y._id === x.organizationalUnit);
                return {
                    STT: index + 1,
                    employeeNumber: x.employee ? x.employee.employeeNumber : null,
                    fullName: x.employee ? x.employee.fullName : null,
                    decisionNumber: x.decisionNumber,
                    decisionUnit: decisionUnit ? decisionUnit.name : "",
                    startDate: new Date(x.startDate),
                    endDate: new Date(x.endDate),
                    type: x.type,
                    reason: x.reason,
                };
            })
        }
        let exportData = {
            fileName: translate('human_resource.commendation_discipline.discipline.file_name_export'),
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle: translate('human_resource.commendation_discipline.discipline.file_name_export'),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate('human_resource.stt'), width: 7 },
                                { key: "employeeNumber", value: translate('human_resource.staff_number') },
                                { key: "fullName", value: translate('human_resource.staff_name'), width: 20 },
                                { key: "decisionNumber", value: translate('human_resource.commendation_discipline.commendation.table.decision_number') },
                                { key: "decisionUnit", value: translate('human_resource.commendation_discipline.commendation.table.decision_unit'), width: 25 },
                                { key: "startDate", value: translate('human_resource.commendation_discipline.discipline.table.start_date') },
                                { key: "endDate", value: translate('human_resource.commendation_discipline.discipline.table.end_date') },
                                { key: "type", value: translate('human_resource.commendation_discipline.discipline.table.discipline_forms') },
                                { key: "reason", value: translate('human_resource.commendation_discipline.discipline.table.reason_discipline') },
                            ],
                            data: data
                        }
                    ]
                },
            ]
        }
        return exportData
    }

    render() {
        const { translate, discipline, department } = this.props;

        const { pageActive } = this.props;

        const { limit, page, organizationalUnits, currentRow, currentRowView } = this.state;

        let { list } = department;

        let listDisciplines = [], exportData = [];
        if (discipline.isLoading === false) {
            listDisciplines = discipline.listDisciplines;
            exportData = this.convertDataToExportData(listDisciplines);
        }

        let pageTotal = (discipline.totalListDiscipline % limit === 0) ?
            parseInt(discipline.totalListDiscipline / limit) :
            parseInt((discipline.totalListDiscipline / limit) + 1);
        let currentPage = parseInt((page / limit) + 1);

        return (
            <div id="kyluat" className={`tab-pane ${pageActive === 'discipline' ? 'active' : null}`}>
                <div className="box-body qlcv">
                    {/* Form thêm kỷ luật */}
                    <DisciplineCreateForm />
                    <ExportExcel id="export-discipline" buttonName={translate('human_resource.name_button_export')} exportData={exportData} style={{ marginRight: 15, marginTop: 2 }} />

                    <div className="form-inline">
                        {/* Cấp ra quyết định */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.commendation_discipline.commendation.table.decision_unit')}</label>
                            <SelectMulti id={`multiSelectUnitDiscipline`} multiple="multiple"
                                value={organizationalUnits ? organizationalUnits : []}
                                options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                                items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                        </div>
                        {/* Mã nhân viên*/}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.staff_number')}</label>
                            <input type="text" className="form-control" name="employeeNumber" onChange={this.handleChange} placeholder={translate('page.staff_number')} autoComplete="off" />
                        </div>
                    </div>

                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        {/* Số quyết định */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.commendation_discipline.commendation.table.decision_number')}</label>
                            <input type="text" className="form-control" name="decisionNumber" onChange={this.handleChange} placeholder={translate('human_resource.commendation_discipline.commendation.table.decision_number')} autoComplete="off" />

                        </div>
                        {/* Hình thức kỷ luật*/}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.commendation_discipline.discipline.table.discipline_forms_short')}</label>
                            <input type="text" className="form-control" name="type" onChange={this.handleChange} placeholder={translate('human_resource.commendation_discipline.discipline.table.discipline_forms')} autoComplete="off" />
                            <button type="button" className="btn btn-success" onClick={this.handleSubmitSearch} title={translate('page.add_search')} >{translate('page.add_search')}</button>
                        </div>
                    </div>

                    <table id="discipline-table" className="table table-striped table-bordered table-hover" >
                        <thead>
                            <tr>
                                <th>{translate('human_resource.staff_number')}</th>
                                <th>{translate('table.employee_name')}</th>
                                <th>{translate('human_resource.commendation_discipline.discipline.table.start_date')}</th>
                                <th>{translate('human_resource.commendation_discipline.discipline.table.end_date')}</th>
                                <th>{translate('human_resource.commendation_discipline.commendation.table.decision_number')}</th>
                                <th>{translate('human_resource.commendation_discipline.commendation.table.decision_unit')}</th>
                                <th>{translate('human_resource.commendation_discipline.discipline.table.discipline_forms')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}
                                    <DataTableSetting
                                        tableId="discipline-table"
                                        columnArr={[
                                            translate('human_resource.staff_number'),
                                            translate('table.employee_name'),
                                            translate('human_resource.commendation_discipline.discipline.table.start_date'),
                                            translate('human_resource.commendation_discipline.discipline.table.end_date'),
                                            translate('human_resource.commendation_discipline.commendation.table.decision_number'),
                                            translate('human_resource.commendation_discipline.commendation.table.decision_unit'),
                                            translate('human_resource.commendation_discipline.discipline.table.discipline_forms')
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listDisciplines && listDisciplines.length !== 0 &&
                                listDisciplines.map((x, index) => {
                                    let decisionUnit = department.list.find(y => y._id === x.organizationalUnit);
                                    return (
                                        <tr key={index}>
                                            <td><a style={{ cursor: 'pointer' }} onClick={() => this.handleView(x.employee)}>{x.employee ? x.employee.employeeNumber : "Deleted"}</a></td>
                                            <td>{x.employee ? x.employee.fullName : "Deleted"}</td>
                                            <td>{this.formatDate(x.startDate)}</td>
                                            <td>{this.formatDate(x.endDate)}</td>
                                            <td>{x.decisionNumber}</td>
                                            <td>{decisionUnit ? decisionUnit.name : 'Deleted'}</td>
                                            <td>{x.type}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.commendation_discipline.discipline.edit_discipline')}><i className="material-icons">edit</i></a>
                                                <DeleteNotification
                                                    content={translate('human_resource.commendation_discipline.discipline.delete_discipline')}
                                                    data={{
                                                        id: x._id,
                                                        info: x.employee.employeeNumber + " - " + translate('page.number_decisions') + ": " + x.decisionNumber
                                                    }}
                                                    func={this.props.deleteDiscipline}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    {discipline.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!listDisciplines || listDisciplines.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar id="discipline" pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                    {   /* Form chỉnh sửa thông tin kỷ luật */
                        currentRow !== undefined &&
                        <DisciplineEditForm
                            _id={currentRow._id}
                            employeeNumber={currentRow.employee ? `${currentRow.employee.employeeNumber} - ${currentRow.employee.fullName}` : null}
                            decisionNumber={currentRow.decisionNumber}
                            organizationalUnit={currentRow.organizationalUnit}
                            startDate={this.formatDate(currentRow.startDate)}
                            endDate={this.formatDate(currentRow.endDate)}
                            type={currentRow.type}
                            reason={currentRow.reason}
                        />
                    }
                    {/* From xem thông tin nhân viên */
                        <EmployeeViewForm
                            _id={currentRowView ? currentRowView._id : ""}
                            duplicate={'displine'}
                        />
                    }
                </div>
            </div>
        )
    };
}

function mapState(state) {
    const { discipline, department } = state;
    return { discipline, department };
};

const actionCreators = {
    getListDiscipline: DisciplineActions.getListDiscipline,
    deleteDiscipline: DisciplineActions.deleteDiscipline,
};

const disciplineManager = connect(mapState, actionCreators)(withTranslate(DisciplineManager));
export { disciplineManager as DisciplineManager };
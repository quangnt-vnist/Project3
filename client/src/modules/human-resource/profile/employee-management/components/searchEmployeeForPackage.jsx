import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DeleteNotification, PaginateBar, SelectMulti, ExportExcel, DatePicker, SelectBox, TreeSelect } from '../../../../../common-components';

import { EmployeeCreateForm, EmployeeDetailForm, EmployeeEditFrom, EmployeeImportForm } from './combinedContent';

import { EmployeeManagerActions } from '../redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { CareerPositionAction } from '../../../career-position/redux/actions';
import { MajorActions } from '../../../major/redux/actions';


class SearchEmployeeForPackage extends Component {
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
            position: null,
            gender: null,
            employeeNumber: null,
            organizationalUnits: organizationalUnits,
            status: 'active',
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        this.props.getAllEmployee(this.state);
        this.props.getDepartment();
        this.props.getListMajor({ name: '', page: 1, limit: 1000 });
        this.props.getListCareerPosition({ name: '', page: 1, limit: 1000 });
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
        } else {
            return date
        }
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
        window.$(`#modal-detail-employee${value._id}`).modal('show');
    }

    /**
     * Bắt sự kiện click chỉnh sửa thông tin nhân viên
     * @param {*} value : Thông tin nhân viên muốn chỉnh sửa
     */
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$(`#modal-edit-employee${value._id}`).modal('show');
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
     * Function lưu giá trị unit vào state khi thay đổi
     * @param {*} value : Array id trình độ
     */
    handleChangeProfessionalSkill = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            professionalSkill: value
        })
    }

    /**
     * Function lưu giá trị unit vào state khi thay đổi
     * @param {*} value : Array id Chuyên ngành
     */

    handleMajor = (value) => {
        this.setState({ majorInfo: value[0] });
    }

    /**
     * Function lưu giá trị unit vào state khi thay đổi
     * @param {*} value : Array id Vị trí công việc
     */

    handleCareer = (value) => {
        this.setState({ careerInfo: value[0] });
    }

    /**
     * Function lưu giá trị chức vụ vào state khi thay đổi
     * @param {*} value : Array id chức vụ
     */
    // 
    handlePositionChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            position: value
        })
    }

    /**
     * Function lưu giá trị giới tính vào state khi thay đổi
     * @param {*} value : Giá trị giới tính
     */
    handleGenderChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            gender: value
        })
    }

    /**
     * Function lưu giá trị trạng thái vào state khi thay đổi
     * @param {*} value : Giá trị trạng thái
     */
    handleStatusChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            status: value
        })
    }

    /**
     * Function lưu giá trị tháng sinh vào state khi thay đổi
     * @param {*} value : Giá trị tháng sinh
     */
    // 
    handleBirthdateChange = (value) => {
        if (value) {
            let partMonth = value.split('-');
            value = [partMonth[1], partMonth[0]].join('-');
        }
        this.setState({
            ...this.state,
            birthdate: value
        });
    }

    /**
     * Function lưu giá trị ngày hết hạn hợp đồng vào state khi thay đổi
     * @param {*} value : Tháng hết hạn hợp đồng
     */
    handleEndDateOfCertificateChange = (value) => {
        if (value) {
            let partMonth = value.split('-');
            value = [partMonth[1], partMonth[0]].join('-');
        }
        this.setState({
            ...this.state,
            endDateOfCertificate: value
        });
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    /** Function bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        this.props.getAllEmployee(this.state);
    }

    /**
     * Bắt sự kiện setting số dòng hiện thị trên một trang
     * @param {*} number : Số dòng trên 1 trang
     */
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.getAllEmployee(this.state);
    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber : Số trang muốn xem
     */
    setPage = async (pageNumber) => {
        let page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });
        this.props.getAllEmployee(this.state);
    }

    render() {
        const { employeesManager, translate, department, career, major } = this.props;

        let { importEmployee, limit, page, organizationalUnits, professionalSkill, majorInfo, careerInfo, currentRow, currentRowView } = this.state;

        let listEmployees = [];
        if (employeesManager.listEmployees) {
            listEmployees = employeesManager.listEmployees;
        }

        let pageTotal = ((employeesManager.totalList % limit) === 0) ?
            parseInt(employeesManager.totalList / limit) :
            parseInt((employeesManager.totalList / limit) + 1);
        let currentPage = parseInt((page / limit) + 1);

        let listPosition = career.listPosition;
        let dataTreeCareer = []
        for (let i in listPosition) {
            let posMap = listPosition[i].position;
            let position = listPosition[i].position.map(elm => {
                return {
                    ...elm,
                    id: elm._id,
                    text: elm.name,
                    state: { "opened": true },
                    // parent: listPosition[i]._id.toString(),
                    parent: "#",
                }
            });
            dataTreeCareer = [...dataTreeCareer, ...position];
            for (let x in posMap) {
                let descMap = posMap[x].description;
                let description = posMap[x].description.map(elm => {
                    return {
                        ...elm,
                        id: elm._id,
                        text: elm.name,
                        state: { "opened": true },
                        parent: posMap[x]._id.toString(),
                    }
                });
                dataTreeCareer = [...dataTreeCareer, ...description];
            }
        }

        const listMajor = major.listMajor;
        let dataTreeMajor = []
        for (let i in listMajor) {
            let groupMap = listMajor[i].group;
            let group = listMajor[i].group.map(elm => {
                return {
                    ...elm,
                    id: elm._id,
                    text: elm.name,
                    state: { "opened": true },
                    // parent: listMajor[i]._id.toString(),
                    parent: "#",
                }
            });
            dataTreeMajor = [...dataTreeMajor, ...group];
            for (let x in groupMap) {
                let specializedMap = groupMap[x].specialized;
                let specialized = groupMap[x].specialized.map(elm => {
                    return {
                        ...elm,
                        id: elm._id,
                        text: elm.name,
                        state: { "opened": true },
                        parent: groupMap[x]._id.toString(),
                    }
                });
                dataTreeMajor = [...dataTreeMajor, ...specialized];
            }
        }

        let professionalSkillArr = [
            { value: "", text: "Chọn trình độ" },
            { value: "intermediate_degree", text: "Trung cấp" },
            { value: "colleges", text: "Cao đẳng" },
            { value: "university", text: "Đại học" },
            { value: "bachelor", text: "Cử nhân" },
            { value: "engineer", text: "Kỹ sư" },
            { value: "master_degree", text: "Thạc sĩ" },
            { value: "phd", text: "Tiến sĩ" },
            { value: "unavailable", text: "Không có" },
        ];

        console.log('ppppppppppppppp', dataTreeCareer, dataTreeMajor);
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/* Button thêm mới nhân viên */}
                        {/* <div className="dropdown pull-right">
                            <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('human_resource.profile.employee_management.add_employee_title')} >{translate('human_resource.profile.employee_management.add_employee')}</button>
                            <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                                <li><a style={{ cursor: 'pointer' }} onClick={this.importEmployee}>{translate('human_resource.profile.employee_management.add_import')}</a></li>
                                <li><a style={{ cursor: 'pointer' }} onClick={this.createEmployee}>{translate('human_resource.profile.employee_management.add_by_hand')}</a></li>
                            </ul>
                        </div> */}
                        {/* <button type="button" style={{ marginRight: 15, marginTop: 0 }} className="btn btn-primary pull-right" onClick={this.handleExportExcel} >{translate('human_resource.name_button_export')}<i className="fa fa-fw fa-file-excel-o"> </i></button> */}
                    </div>

                    <div className="form-inline">
                        {/* Đơn vị */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.unit')}</label>
                            <SelectMulti id={`multiSelectUnit`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                                value={organizationalUnits ? organizationalUnits : []}
                                items={department.list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                        </div>
                        {/* Trình độ chuyên môn  */}
                        <div className="form-group">
                            <label className="form-control-static">Trình độ chuyên môn</label>
                            <SelectBox id={`professionalSkillArr-selectbox`}
                                multiple={false}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={professionalSkill}
                                items={professionalSkillArr} onChange={this.handleChangeProfessionalSkill}>
                            </SelectBox>
                        </div>
                        {/* Chuyên ngành  */}
                        <div className="form-group">
                            <label className="form-control-static">Chuyên ngành</label>
                            <TreeSelect data={dataTreeMajor} value={majorInfo} handleChange={this.handleMajor} mode="radioSelect" />
                        </div>
                    </div>

                    <div className="form-inline">
                        {/* Vị trí công việc  */}
                        <div className="form-group">
                            <label className="form-control-static">Vị trí công việc</label>
                            <TreeSelect data={dataTreeCareer} value={careerInfo} handleChange={this.handleCareer} mode="radioSelect" />
                        </div>
                        {/* Số năm kinh nghiệm */}
                        <div className="form-group">
                            <label className="form-control-static">Số năm KN</label>
                            <input type="number" className="form-control" name="numOfExp" onChange={this.handleChange} placeholder={"Số năm kinh nghiệm"} />
                        </div>
                        {/* Số năm kinh nghiệm công việc tương đương */}
                        <div className="form-group">
                            <label className="form-control-static">Số năm KN công việc tương đương</label>
                            <input type="number" className="form-control" name="numOfSameCareer" onChange={this.handleChange} placeholder={"Kinh nghiệm công việc tương tự"} />
                        </div>
                    </div>

                    <div className="form-inline">
                        {/* Loại chứng chỉ */}
                        <div className="form-group">
                            <label className="form-control-static">Loại chứng chỉ</label>
                            <input type="text" className="form-control" name="typeOfCertificate" onChange={this.handleChange} placeholder={"Oracal Database"} />
                        </div>
                        {/* Loại hợp đồng lao động */}
                        <div className="form-group">
                            <label className="form-control-static">Tên chứng chỉ</label>
                            <input type="text" className="form-control" name="certificateName" onChange={this.handleChange} />
                        </div>
                        {/* Tháng hết hạn chứng chỉ */}
                        <div className="form-group">
                            <label className="form-control-static">Hiệu lực chứng chỉ</label>
                            <DatePicker
                                id="month-endDate-certificate"
                                dateFormat="month-year"
                                value=""
                                onChange={this.handleEndDateOfCertificateChange}
                            />
                        </div>
                    </div>

                    <div className="form-inline" style={{ marginBottom: 15 }}>
                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={this.handleSunmitSearch} >{translate('general.search')}</button>
                        </div>
                    </div>

                    <table id="employee-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('human_resource.staff_number')}</th>
                                <th>{translate('human_resource.staff_name')}</th>
                                <th>{translate('human_resource.profile.gender')}</th>
                                <th>{translate('human_resource.profile.date_birth')}</th>
                                <th>{translate('human_resource.profile.contract_end_date')}</th>
                                <th>{translate('human_resource.profile.type_contract')}</th>
                                <th>{translate('human_resource.status')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}
                                    <DataTableSetting
                                        tableId="employee-table"
                                        columnArr={[
                                            translate('human_resource.staff_number'),
                                            translate('human_resource.staff_name'),
                                            translate('human_resource.profile.gender'),
                                            translate('human_resource.profile.date_birth'),
                                            translate('human_resource.profile.contract_end_date'),
                                            translate('human_resource.profile.type_contract'),
                                            translate('human_resource.status'),
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listEmployees && listEmployees.length !== 0 &&
                                listEmployees.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.employeeNumber}</td>
                                        <td>{x.fullName}</td>
                                        <td>{translate(`human_resource.profile.${x.gender}`)}</td>
                                        <td>{this.formatDate(x.birthdate)}</td>
                                        <td>{this.formatDate(x.contractEndDate)}</td>
                                        <td>{x.contractType}</td>
                                        <td style={{ color: x.status === "active" ? "#00a65a" : '#dd4b39' }}>{translate(`human_resource.profile.${x.status}`)}</td>
                                        <td>
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title={translate('human_resource.profile.employee_management.view_employee')}><i className="material-icons">view_list</i></a>
                                            {/* <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.profile.employee_management.edit_employee')}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('human_resource.profile.employee_management.delete_employee')}
                                                data={{
                                                    id: x._id,
                                                    info: x.fullName + " - " + x.employeeNumber
                                                }}
                                                func={this.props.deleteEmployee}
                                            /> */}
                                        </td>
                                    </tr>
                                )
                                )}
                        </tbody>

                    </table>
                    {employeesManager.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!listEmployees || listEmployees.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                </div>
                {/* From thêm mới thông tin nhân viên */}
                <EmployeeCreateForm />

                {/* From import thông tin nhân viên*/
                    importEmployee && <EmployeeImportForm />
                }

                {/* From xem thông tin nhân viên */
                    <EmployeeDetailForm
                        _id={currentRowView ? currentRowView._id : ""}
                    />
                }
                {/* From chinh sửa thông tin nhân viên */
                    <EmployeeEditFrom
                        _id={currentRow ? currentRow._id : ""}
                    />
                }
            </div>
        );
    };
}

function mapState(state) {
    const { employeesManager, department, career, major } = state;
    return { employeesManager, department, career, major };
}

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getListCareerPosition: CareerPositionAction.getListCareerPosition,
    getListMajor: MajorActions.getListMajor,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    deleteEmployee: EmployeeManagerActions.deleteEmployee,
};

const searchEmployeeForPackage = connect(mapState, actionCreators)(withTranslate(SearchEmployeeForPackage));
export { searchEmployeeForPackage as SearchEmployeeForPackage };
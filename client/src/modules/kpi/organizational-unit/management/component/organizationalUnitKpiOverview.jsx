import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { managerActions } from '../redux/actions';
import { ModalDetailKPI } from './organizationalUnitKpiDetailModal';
import { ModalCopyKPIUnit } from './organizationalUnitKpiCopyModal';
import { withTranslate } from 'react-redux-multilingual';
import { DataTableSetting, ErrorLabel, DatePicker, SelectBox, ExportExcel } from '../../../../../common-components';
import Swal from 'sweetalert2';

class KPIUnitManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModalCopy: "",
            currentRole: localStorage.getItem("currentRole"),
            status: -1,
            infosearch: {
                role: localStorage.getItem("currentRole"),
                status: -1,
                startDate: null,
                endDate: null
            },
        };
    }

    componentDidMount() {
        this.props.getDepartment();
        this.props.getAllKPIUnit(this.state.infosearch);
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
    }

    componentDidUpdate() {
        if (this.state.currentRole !== localStorage.getItem('currentRole')) {
            this.props.getAllKPIUnit(localStorage.getItem("currentRole"));
            this.setState(state => {
                return {
                    ...state,
                    currentRole: localStorage.getItem('currentRole')
                }
            })
        }
    }

    handleStartDateChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                startDate: value,
            }
        });

    }

    checkStatusKPI = (status) => {
        const { translate } = this.props
        if (status === 0) {
            return translate('kpi.organizational_unit.management.over_view.setting_up');
        } else if (status === 1) {
            return translate('kpi.organizational_unit.management.over_view.activated');
        }
    }

    handleEndDateChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                endDate: value,
            }
        });
    }

    handleUser = (value) => {
        this.setState(state => {
            return {
                ...state,
                userkpi: value,
            }
        })
    }

    handleStatus = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                status: value
            }
        })
    }

    formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    handleShowEdit = async (id, idkpiunit, date) => {
        await this.setState(state => {
            return {
                ...state,
                id: id,
                idkpiunit: idkpiunit,
                date: date
            }
        });
        window.$(`#dataResultTask`).modal('show');
    }

    handleSearchData = async () => {
        if (this.state.startDate === "") this.state.startDate = null;
        if (this.state.endDate === "") this.state.endDate = null;
        await this.setState(state => {
            return {
                ...state,
                infosearch: {
                    ...state.infosearch,
                    status: this.state.status,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate
                }
            }
        })
        const { infosearch } = this.state;
        const { translate } = this.props;
        let startDate, endDate;
        let startdate = null, enddate = null;
        if (infosearch.startDate) {
            startDate = infosearch.startDate.split("-");
            startdate = new Date(startDate[1], startDate[0]);
        }

        if (infosearch.endDate) {
            endDate = infosearch.endDate.split("-");
            enddate = new Date(endDate[1], endDate[0]);
        }

        if (startdate && enddate && Date.parse(startdate) > Date.parse(enddate)) {
            Swal.fire({
                title: translate('kpi.organizational_unit.management.over_view.alert_search.search'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.organizational_unit.management.over_view.alert_search.confirm')
            })
        } else {
            this.props.getAllKPIUnit(infosearch);
        }
    };

    showModalCopy = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                showModalCopy: id
            }
        })
        window.$(`#copy-old-kpi-to-new-time-${id}`).modal("show")
    }

    checkPermisson = (deanCurrentUnit) => {
        let currentRole = localStorage.getItem("currentRole");
        return (deanCurrentUnit && deanCurrentUnit.includes(currentRole));
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (data, unitName) => {
        let fileName = "Bảng quản lý KPI đơn vị " + (unitName ? unitName : "");
        if (data) {
            data = data.map((x, index) => {

                let fullName = x.creator.name;
                let email = x.creator.email;
                let automaticPoint = (x.automaticPoint === null) ? "Chưa đánh giá" : parseInt(x.automaticPoint);
                let employeePoint = (x.employeePoint === null) ? "Chưa đánh giá" : parseInt(x.employeePoint);
                let approverPoint = (x.approvedPoint === null) ? "Chưa đánh giá" : parseInt(x.approvedPoint);
                let date = new Date(x.date);
                let status = this.checkStatusKPI(x.status);
                let numberTarget = parseInt(x.kpis.length);

                return {
                    STT: index + 1,
                    fullName: fullName,
                    email: email,
                    automaticPoint: automaticPoint,
                    status: status,
                    employeePoint: employeePoint,
                    approverPoint: approverPoint,
                    time: date,
                    numberTarget: numberTarget
                };
            })
        }

        let exportData = {
            fileName: fileName,
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle: fileName,
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "fullName", value: "Người tạo" },
                                { key: "email", value: "Email người tạo" },
                                { key: "time", value: "Thời gian" },
                                { key: "status", value: "Trạng thái" },
                                { key: "numberTarget", value: "Số lượng mục tiêu" },
                                { key: "automaticPoint", value: "Điểm KPI tự động" },
                                { key: "employeePoint", value: "Điểm KPI tự đánh giá" },
                                { key: "approverPoint", value: "Điểm KPI được phê duyệt" }
                            ],
                            data: data
                        }
                    ]
                },
            ]
        }
        return exportData;

    }

    render() {
        const { startDate, endDate, status, errorOnDate, infosearch } = this.state;
        const { user, managerKpiUnit, translate } = this.props;

        let listkpi, currentKPI, currentTargets, kpiApproved, datachat1, targetA, targetC, targetOther, misspoint, organizationalUnitsOfUserLoading;
        let unitList, currentUnit, userdepartments, exportData;

        if (user) userdepartments = user.userdepartments;
        if (user) {
            unitList = user.organizationalUnitsOfUser;
            organizationalUnitsOfUserLoading = user.organizationalUnitsOfUserLoading;

            currentUnit = unitList && unitList.filter(item =>
                item.deans.includes(this.state.currentRole)
                || item.viceDeans.includes(this.state.currentRole)
                || item.employees.includes(this.state.currentRole));
        }

        if (managerKpiUnit) {
            listkpi = managerKpiUnit.kpis;
            if (listkpi && listkpi.length !== 0) {
                console.log('aaaaaaaaaaaa', managerKpiUnit)
                kpiApproved = listkpi.filter(item => item.status === 2);
                currentKPI = listkpi.filter(item => item.status !== 2);
                datachat1 = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: item.result }
                }).reverse();
                targetA = kpiApproved.map(item => {

                    return { label: this.formatDate(item.date), y: item.kpis[0].result }
                }).reverse();
                targetC = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: item.kpis[1].result }
                }).reverse();
                targetOther = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: (item.result - item.kpis[0].result - item.kpis[1].result) }
                }).reverse();
                misspoint = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: (100 - item.result) }
                }).reverse();
            };
        }

        if (userdepartments && listkpi) {
            exportData = this.convertDataToExportData(listkpi, userdepartments.department);
        }
        console.log('eeeeeeeeeeee', managerKpiUnit)
        return (
            <React.Fragment>
                <div className="box">
                    {unitList && unitList.length !== 0
                        ? <div className="box-body qlcv">
                            <ModalDetailKPI
                                date={this.state.date}
                                id={this.state.id}
                                idkpiunit={this.state.idkpiunit}
                            />
                            <div className="form-inline">
                                <div className={`form-group ${!errorOnDate ? "" : "has-error"}`}>
                                    <label>{translate('kpi.organizational_unit.management.over_view.start_date')}</label>
                                    <DatePicker
                                        id="start_date"
                                        value={startDate}
                                        onChange={this.handleStartDateChange}
                                        dateFormat="month-year"
                                    />
                                    <ErrorLabel content={errorOnDate} />
                                </div>
                                <div className="form-group">
                                    <label>{translate('kpi.organizational_unit.management.over_view.end_date')}</label>
                                    <DatePicker
                                        id="end_date"
                                        value={endDate}
                                        onChange={this.handleEndDateChange}
                                        dateFormat="month-year"
                                    />
                                    <ErrorLabel content={errorOnDate} />
                                </div>

                                {exportData && <ExportExcel id="export-unit-kpi-management-overview" exportData={exportData} style={{ marginRight: 15, marginTop: 5 }} />}

                            </div>

                            <div className="form-inline">
                                <div className="form-group">

                                    <label>{translate('kpi.organizational_unit.management.over_view.status')}</label>
                                    {
                                        <SelectBox
                                            id={`select-status-kpi`}
                                            className="form-control select2"
                                            items={[{ value: -1, text: translate('kpi.organizational_unit.management.over_view.all_status') }, { value: 0, text: translate('kpi.organizational_unit.management.over_view.setting_up') }, { value: 1, text: translate('kpi.organizational_unit.management.over_view.activated') },]}
                                            onChange={this.handleStatus}
                                            style={{ width: "100%" }}
                                            value={status}
                                        />
                                    }
                                </div>
                                <div className="form-group">
                                    <label></label>
                                    <button type="button" className="btn btn-success" onClick={() => this.handleSearchData()}>{translate('kpi.organizational_unit.management.over_view.search')}</button>
                                </div>
                            </div>

                            <DataTableSetting className="pull-right" tableId="kpiTable" tableContainerId="kpiTableContainer" tableWidth="1300px"
                                columnArr={['Người tạo', 'Thời gian', 'Trạng thái', 'Số lượng mục tiêu', 'Kết quả đánh giá', 'Xem chi tiết', 'Tạo KPI tháng mới', 'Cập nhật']}
                                limit={this.state.perPage}
                                setLimit={this.setLimit} hideColumnOption={true} />
                            {/* Danh sách các KPI của đơn vị */}
                            <table id="kpiTable" className="table table-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th title="Người tạo">{translate('kpi.organizational_unit.management.over_view.creator')}</th>
                                        <th title="Thời gian">{translate('kpi.organizational_unit.management.over_view.time')}</th>
                                        <th title="Trạng thái">{translate('kpi.organizational_unit.management.over_view.status')}</th>
                                        <th title="Số lượng mục tiêu">{translate('kpi.organizational_unit.management.over_view.number_target')}</th>
                                        <th title={translate('kpi.evaluation.employee_evaluation.system_evaluate')}>{translate('kpi.evaluation.employee_evaluation.system_evaluate')}</th>
                                        <th title={translate('kpi.evaluation.employee_evaluation.result_self_evaluate')}>{translate('kpi.evaluation.employee_evaluation.result_self_evaluate')}</th>
                                        <th title={translate('kpi.evaluation.employee_evaluation.evaluation_management')}>{translate('kpi.evaluation.employee_evaluation.evaluation_management')}</th>
                                        <th title="Hành động">{translate('kpi.organizational_unit.management.over_view.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        (listkpi && listkpi.length !== 0)
                                            ? listkpi.map((item, index) =>
                                                <tr key={index + 1}>
                                                    <td>{item.creator.name}</td>
                                                    <td>{this.formatDate(item.date)}</td>
                                                    <td>{this.checkStatusKPI(item.status)}</td>
                                                    <td>{item.kpis.length}</td>
                                                    <td>{item.automaticPoint === null ? translate('kpi.evaluation.employee_evaluation.not_evaluated_yet') : item.automaticPoint}</td>
                                                    <td>{item.employeePoint === null ? translate('kpi.evaluation.employee_evaluation.not_evaluated_yet') : item.employeePoint}</td>
                                                    <td>{item.approvedPoint === null ? translate('kpi.evaluation.employee_evaluation.not_evaluated_yet') : item.approvedPoint}</td>
                                                    <td>
                                                        <a href={`#dataResultTask`}
                                                            data-toggle="modal"
                                                            data-backdrop="static"
                                                            data-keyboard="false"
                                                            title="Xem chi tiết KPI tháng này">
                                                            <i className="material-icons" onClick={() => this.handleShowEdit(item._id, item.organizationalUnit._id, item.date)}>view_list</i>
                                                        </a>

                                                        {this.checkPermisson(currentUnit && currentUnit[0] && currentUnit[0].deans)
                                                            && <a href="#abc" onClick={() => this.showModalCopy(item._id)} className="copy" data-toggle="modal" data-backdrop="static" data-keyboard="false" title="Thiết lập kpi tháng mới từ kpi tháng này">
                                                                <i className="material-icons">content_copy</i>
                                                            </a>
                                                        }
                                                        {this.state.showModalCopy === item._id
                                                            ? <ModalCopyKPIUnit kpiId={item._id} idunit={item.organizationalUnit._id} listkpi={listkpi} kpiunit={item} />
                                                            : null
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                            : <tr>
                                                <td colSpan={8}>
                                                    <center>{translate('kpi.organizational_unit.management.over_view.no_data')}</center>
                                                </td>
                                            </tr>
                                    }
                                </tbody>
                            </table></div>
                        : organizationalUnitsOfUserLoading
                        && <div className="box-body">
                            <h4>Bạn chưa có đơn vị</h4>
                        </div>
                    }
                </div>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { user, managerKpiUnit } = state;
    return { user, managerKpiUnit };
}

const actionCreators = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getDepartment: UserActions.getDepartmentOfUser,
    getAllKPIUnit: managerActions.getAllKPIUnit,
    refreshData: managerActions.evaluateKPIUnit,
};
const connectedKPIUnitManager = connect(mapState, actionCreators)(withTranslate(KPIUnitManager));
export { connectedKPIUnitManager as KPIUnitManager };
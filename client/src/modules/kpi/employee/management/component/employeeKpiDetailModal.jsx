import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../../common-components/index';
import { DataTableSetting, ExportExcel } from '../../../../../common-components';

import { TaskDialog } from '../../../evaluation/employee-evaluation/component/taskImpotanceDialog';
import { ModalDetailTask } from '../../../../task/task-dashboard/task-personal-dashboard/modalDetailTask';
import { kpiMemberActions } from '../../../evaluation/employee-evaluation/redux/actions';

class ModalDetailKPIPersonal extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            organizationalUnit: "",
            content: "",
            name: "",
            description: "",
            point: 0,
            status: 0,
            value: 0,
            valueNow: 0,
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.employeeKpiSet && nextProps.employeeKpiSet._id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.employeeKpiSet._id,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.employeeKpiSet && nextProps.employeeKpiSet._id !== this.state.id) {
            if (nextProps.employeeKpiSet._id) {
                this.props.getKpisByKpiSetId(nextProps.employeeKpiSet._id);
            }
            return false;
        }

        if (this.state.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!nextProps.kpimembers.tasks) {
                return false;
            } else { // Dữ liệu đã về
                let tasks = nextProps.kpimembers.tasks;
                this.setState(state => {
                    return {
                        ...state,
                        tasks: tasks,
                        dataStatus: this.DATA_STATUS.FINISHED,
                    }
                });
                return false;
            }
        }
        return true;
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    formatMonth(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    /**Hiển thị nội dung 1 mục tiêu KPI mới khi click vào tên mục tiêu đó */
    handleChangeContent = (id, employeeId, kpiType) => {
        let date = this.props.employeeKpiSet.date;
        this.props.getTaskById(id, employeeId, date, kpiType);
        this.setState(state => {
            return {
                ...state,
                content: id,
                dataStatus: this.DATA_STATUS.QUERYING,
            }
        });
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (dataKpi, dataDetailKpi) => {

        let fileName = "Thông tin chi tiết KPI cá nhân ";
        let kpiData = [], detailData;

        if (dataKpi) {
            fileName += " " + dataKpi.name;
            let dataObject = {
                kpiName: dataKpi.name,
                kpiCriteria: dataKpi.criteria,
                kpiWeight: parseInt(dataKpi.weight),
                automaticPoint: (dataKpi.automaticPoint === null) ? "Chưa đánh giá" : parseInt(dataKpi.automaticPoint),
                employeePoint: (dataKpi.employeePoint === null) ? "Chưa đánh giá" : parseInt(dataKpi.employeePoint),
                approverPoint: (dataKpi.approvedPoint === null) ? "Chưa đánh giá" : parseInt(dataKpi.approvedPoint),
                sheetTitle: "Thông tin chi tiết KPI " + dataKpi.name
            }
            kpiData.push(dataObject);
        }

        if (dataDetailKpi) {
            detailData = dataDetailKpi.map((x, index) => {
                let name = x.name;
                let startTaskD = new Date(x.startDate);
                let endTaskD = new Date(x.endDate);
                let startApproveD = new Date(x.preEvaDate);
                let endApproveD = new Date(x.date);
                let automaticPoint = (x.results.automaticPoint === null) ? "Chưa đánh giá" : parseInt(x.results.automaticPoint);
                let employeePoint = (x.results.employeePoint === null) ? "Chưa đánh giá" : parseInt(x.results.employeePoint);
                let approverPoint = (x.results.approvedPoint === null) ? "Chưa đánh giá" : parseInt(x.results.approvedPoint);
                let status = x.status;
                let contributionPoint = parseInt(x.results.contribution);
                let importantLevel = parseInt(x.results.taskImportanceLevel);

                return {
                    STT: index + 1,
                    name: name,
                    automaticPoint: automaticPoint,
                    status: status,
                    employeePoint: employeePoint,
                    approverPoint: approverPoint,
                    startTaskDate: startTaskD,
                    endTaskDate: endTaskD,
                    startApproveDate: startApproveD,
                    endApproveDate: endApproveD,
                    contributionPoint: contributionPoint,
                    importantLevel: importantLevel,

                };
            })
        }

        let exportData = {
            fileName: fileName,
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle: kpiData[0] && kpiData[0].sheetTitle,
                    tables: [
                        {
                            tableName: 'Thông tin chung KPI ' + (kpiData[0] && kpiData[0].kpiName),
                            columns: [
                                { key: "kpiName", value: "Tên KPI cá nhân" },
                                { key: "kpiCriteria", value: "Tiêu chí đánh giá" },
                                { key: "kpiWeight", value: "Trọng số (/100)" },
                                { key: "automaticPoint", value: "Điểm tự động" },
                                { key: "employeePoint", value: "Điểm tự đánh giá" },
                                { key: "approverPoint", value: "Điểm người phê duyệt đánh giá" },
                            ],
                            data: kpiData
                        },
                        {
                            tableName: 'Danh sách công việc ứng với KPI: ',
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "name", value: "Tên hoạt động" },
                                { key: "startTaskDate", value: "Ngày bắt đầu công việc" },
                                { key: "endTaskDate", value: "Ngày kết thúc công việc" },
                                { key: "startApproveDate", value: "Ngày bắt đầu đánh giá" },
                                { key: "endApproveDate", value: "Ngày kết thúc đánh giá" },
                                { key: "status", value: "Trạng thái" },
                                { key: "contributionPoint", value: "Đóng góp (%)" },
                                { key: "automaticPoint", value: "Điểm tự động" },
                                { key: "employeePoint", value: "Điểm tự đánh giá" },
                                { key: "approverPoint", value: "Điểm được phê duyệt" },
                                { key: "importantLevel", value: "Độ quan trọng" }

                            ],
                            data: detailData
                        }
                    ]
                },
            ]
        }
        return exportData;

    }
    handleClickTaskName = async (id) => {
        this.setState(state => {
            return {
                ...state,
                taskId: id,
            }
        });
        window.$(`#modal-detail-task-kpi-detail`).modal('show');
    }
    showDetailTaskImportanceCal = async (item) => {
        await this.setState(state => {
            return {
                ...state,
                taskImportanceDetail: item
            }
        })

        window.$(`#modal-taskimportance-auto`).modal('show')
    }
    render() {
        var kpimember;
        var list, myTask = [];
        let exportData, content = this.state.content;
        const { kpimembers, translate } = this.props;
        let { employeeKpiSet } = this.props;
        const { taskId, taskImportanceDetail } = this.state;
        if (kpimembers.tasks !== 'undefined' && kpimembers.tasks !== null) myTask = kpimembers.tasks;
        kpimember = kpimembers && kpimembers.kpimembers;

        if (kpimembers.currentKPI) {
            list = kpimembers.currentKPI.kpis;
        }

        if (myTask) {
            let dataKpi;
            if (list) {
                for (let i = 0; i < list.length; i++) {
                    if (list[i]._id === content) {
                        dataKpi = list[i];
                    }
                }
            }
            exportData = this.convertDataToExportData(dataKpi, myTask);
        }

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-KPI-personal`}
                    title={employeeKpiSet && employeeKpiSet.creator && `KPI ${employeeKpiSet.creator.name}, ${translate('general.month')} ${this.formatMonth(employeeKpiSet.date)}`}
                    hasSaveButton={false}
                    size={100}>
                    <div className="col-xs-12 col-sm-4">
                        <div className="box box-solid" style={{ border: "1px solid #ecf0f6", borderBottom: "none" }}>
                            {/**Danh sách các mục tiêu của tập KPI đang xem */}
                            <div className="box-header with-border">
                                <h3 className="box-title" style={{ fontWeight: 800 }}>{translate('kpi.evaluation.employee_evaluation.KPI_list')}</h3>
                            </div>

                            {/**Xử lí khi người dùng muốn xem chi tiết mục tiêu */}
                            <div className="box-body no-padding">
                                <ul className="nav nav-pills nav-stacked">
                                    {list && list.map((item, index) =>
                                        <li key={index} className={this.state.content === item._id ? "active" : ""}>
                                            <a style={{ cursor: "pointer" }} onClick={() => this.handleChangeContent(item._id, employeeKpiSet.creator._id, item.type)}>
                                                {item.name}&nbsp;
                                        </a>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/**Nội dung chi tiết của 1 mục tiêu */}
                    <div className="col-xs-12 col-sm-8 qlcv">
                        {list && list.map(item => {
                            if (item._id === this.state.content) return (
                                <React.Fragment key={item._id}>
                                    <h4>{translate('kpi.evaluation.employee_evaluation.KPI_info') + " " + item.name}</h4>
                                    {exportData && <ExportExcel id="export-employee-kpi-management-detail-kpi" exportData={exportData} style={{ marginTop: 5 }} />}
                                    <div style={{ lineHeight: 2 }}>
                                        <div>
                                            <label>{translate('kpi.evaluation.employee_evaluation.criteria')}:</label>
                                            <span> {item.criteria}</span>
                                        </div>

                                        <div>
                                            <label>{translate('kpi.evaluation.employee_evaluation.weight')}:</label>
                                            <span> {item.weight}/100</span>
                                        </div>

                                        <div>
                                            <label>{translate('kpi.evaluation.employee_evaluation.point_field')}:</label>
                                            <span> {item.automaticPoint ? item.automaticPoint : translate('kpi.evaluation.employee_evaluation.no_point')}</span>
                                            <span> - {item.employeePoint ? item.employeePoint : translate('kpi.evaluation.employee_evaluation.no_point')}</span>
                                            <span> - {item.approvedPoint ? item.approvedPoint : translate('kpi.evaluation.employee_evaluation.no_point')}</span>
                                        </div>

                                        {item.updatedAt &&
                                            <div>
                                                <label>{translate('kpi.evaluation.employee_evaluation.lastest_evaluation')}: </label>
                                                <span> {this.formatDate(item.updatedAt)}</span>
                                            </div>
                                        }
                                    </div>
                                    <br />
                                    <br />


                                    <h4>{translate('kpi.evaluation.employee_evaluation.task_list')}</h4>
                                    <DataTableSetting className="pull-right" tableId="employeeKpiEvaluate" tableContainerId="tree-table-container" tableWidth="1300px"
                                        columnArr={[
                                            translate('kpi.evaluation.employee_evaluation.index'),
                                            translate('task.task_management.name'),
                                            translate('kpi.evaluation.employee_evaluation.work_duration_time'),
                                            translate('kpi.evaluation.employee_evaluation.evaluate_time'),
                                            translate('kpi.evaluation.employee_evaluation.status'),
                                            translate('kpi.evaluation.employee_evaluation.contribution'),
                                            translate('kpi.evaluation.employee_evaluation.point'),
                                            translate('kpi.evaluation.employee_evaluation.importance_level')]}
                                        limit={this.state.perPage}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true} />

                                    {/**Table danh sách công việc của mục tiêu */}
                                    <table id="employeeKpiEvaluate" className="table table-hover table-bordered">
                                        <thead>
                                            <tr>
                                                <th title={translate('kpi.evaluation.employee_evaluation.index')} style={{ width: "40px" }} className="col-fixed"></th>
                                                <th title={translate('task.task_management.name')}>{translate('task.task_management.name')}</th>
                                                <th title={translate('kpi.evaluation.employee_evaluation.work_duration_time')}>{translate('kpi.evaluation.employee_evaluation.work_duration_time')}</th>
                                                <th title={translate('kpi.evaluation.employee_evaluation.evaluate_time')}>{translate('kpi.evaluation.employee_evaluation.evaluate_time')}</th>
                                                <th title={translate('kpi.evaluation.employee_evaluation.status')}>{translate('kpi.evaluation.employee_evaluation.status')}</th>
                                                <th title={translate('kpi.evaluation.employee_evaluation.contribution')}>{translate('kpi.evaluation.employee_evaluation.contribution')} (%)</th>
                                                <th title={translate('kpi.evaluation.employee_evaluation.point')}>{translate('kpi.evaluation.employee_evaluation.point')}</th>
                                                <th title={translate('kpi.evaluation.employee_evaluation.importance_level')}>{translate('kpi.evaluation.employee_evaluation.importance_level')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                (kpimembers.tasks !== undefined && Array.isArray(kpimembers.tasks)) ?
                                                    (kpimembers.tasks.map((itemTask, index) =>

                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td><a style={{ cursor: 'pointer' }} onClick={() => this.handleClickTaskName(itemTask.taskId)}>{itemTask.name}</a></td>
                                                            <td>{this.formatDate(itemTask.startDate)}<br /> <i className="fa fa-angle-double-down"></i><br /> {this.formatDate(itemTask.endDate)}</td>
                                                            <td>{this.formatDate(itemTask.preEvaDate)}<br /> <i className="fa fa-angle-double-down"></i><br /> {this.formatDate(itemTask.date)}</td>
                                                            <td>{itemTask.status}</td>
                                                            <td>{itemTask.results.contribution}%</td>
                                                            <td>{itemTask.results.automaticPoint + '-' + itemTask.results.employeePoint + '-' + itemTask.results.approvedPoint}</td>
                                                            <td>
                                                                <div>
                                                                    {translate('kpi.evaluation.employee_evaluation.evaluated_value')}: {itemTask.results.taskImportanceLevel}
                                                                </div>
                                                                <div>
                                                                    <a href="#modal-taskimportance-auto" onClick={() => this.showDetailTaskImportanceCal(itemTask)}>
                                                                        {translate('kpi.evaluation.employee_evaluation.auto_value')}: {itemTask.taskImportanceLevelCal}
                                                                    </a>
                                                                </div>
                                                            </td>
                                                        </tr>)) : <tr><td colSpan={8}>{translate('general.no_data')}</td></tr>
                                            }
                                        </tbody>
                                    </table>
                                    {
                                        taskImportanceDetail &&
                                        <TaskDialog
                                            task={taskImportanceDetail}
                                        />

                                    }
                                </React.Fragment>);
                            return true;
                        })}
                    </div>
                </DialogModal>
                {<ModalDetailTask action={'kpi-detail'} id={taskId} />}
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { kpimembers } = state;
    return { kpimembers };
}

const actionCreators = {
    getKpisByKpiSetId: kpiMemberActions.getKpisByKpiSetId,
    getTaskById: kpiMemberActions.getTaskById,
};
const connectedModalDetailKPIPersonal = connect(mapState, actionCreators)(withTranslate(ModalDetailKPIPersonal));
export { connectedModalDetailKPIPersonal as ModalDetailKPIPersonal };
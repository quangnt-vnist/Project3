import { TaskDialog } from './taskImpotanceDialog';
import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { kpiMemberActions } from '../redux/actions';
import { DataTableSetting, ExportExcel } from '../../../../../common-components';
import { DialogModal } from '../../../../../common-components/index';
import { ModalDetailTask } from '../../../../task/task-dashboard/task-personal-dashboard/modalDetailTask';
import { withTranslate } from 'react-redux-multilingual';

class EmployeeKpiEvaluateModal extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            organizationalUnit: "",
            content: "",
            contentName: "",
            name: "",
            description: "",
            point: 0,
            status: 0,
            value: 0,
            valueNow: 0,
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
            type: 0
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
        const { id, dataStatus } = this.state;
        if (nextProps.employeeKpiSet && nextProps.employeeKpiSet._id !== id) {
            if (nextProps.employeeKpiSet._id) {
                this.props.getKpisByKpiSetId(nextProps.employeeKpiSet._id);
            }
            return false;
        }

        if (dataStatus === this.DATA_STATUS.QUERYING) {
            if (!nextProps.kpimembers.tasks) {
                return false;
            } else {
                let tasks = nextProps.kpimembers.tasks;
                let importanceLevels = {};
                tasks.forEach(element => {
                    importanceLevels[element.taskId] = element.results.taskImportanceLevel;
                });
                this.setState(state => {
                    return {
                        ...state,
                        tasks: tasks,
                        points: importanceLevels,
                        dataStatus: this.DATA_STATUS.FINISHED,
                    }
                });
                return false;
            }
        }
        return true;
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

        return [day, month, year].join('-');
    }
    formatMonth(date) {
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
    handleChangeContent = (id, employeeId, kpiType, name) => {
        let date = this.props.employeeKpiSet.date;
        this.props.getTaskById(id, employeeId, date, kpiType);
        this.setState(state => {
            return {
                ...state,
                content: id,
                contentName: name,
                type: kpiType,
                dataStatus: this.DATA_STATUS.QUERYING,
            }
        });
    }

    handleSetPointKPI = () => {
        let date = this.props.employeeKpiSet.date;
        let employeeId = this.props.employeeKpiSet.creator._id;
        let { tasks, points, type, content } = this.state;
        if (tasks && tasks.length > 0) {
            let data = [];
            tasks.forEach(element => {
                data.push({
                    taskId: element.taskId,
                    date: date,
                    point: points[element.taskId],
                    type: type,
                    role: element && element.results && element.results.role,
                    employeeId: employeeId
                })
            });

            this.props.setPointKPI(content, type, data);
        }
    }

    setValueSlider = (e, id) => {
        let value = e.target.value;
        let points = this.state.points;
        points[id] = value;

        this.setState(state => {
            return {
                ...state,
                points: points,
            }
        })
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

    handleClickTaskName = async (id) => {
        this.setState(state => {
            return {
                ...state,
                taskId: id,
            }
        });
        window.$(`#modal-detail-task-kpi-evaluation`).modal('show');
    }

    /**Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (dataTask, currentKpiName, employeeName) => {

        let fileName = "Thông tin KPI " + (currentKpiName ? currentKpiName : "") + " của " + (employeeName ? employeeName : "");
        let tableName = 'Danh sách công việc ứng với KPI ' + (currentKpiName ? currentKpiName : "") + " của " + (employeeName ? employeeName : "");
        if (dataTask) {

            dataTask = dataTask.map((x, index) => {

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
                    importantLevel: importantLevel
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
                            tableName: tableName,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "name", value: "Tên hoạt động" },
                                { key: "startTaskDate", value: "Ngày bắt đầu công việc" },
                                { key: "endTaskDate", value: "Ngày kết thúc công việc" },
                                { key: "startApproveDate", value: "Ngày bắt đầu đánh giá" },
                                { key: "endApproveDate", value: "Ngày kết thúc đánh giá" },
                                { key: "status", value: "Trạng thái" },
                                { key: "contributionPoint", value: "Đóng góp (%)" },
                                { key: "automaticPoint", value: "Điểm KPI tự động" },
                                { key: "employeePoint", value: "Điểm KPI tự đánh giá" },
                                { key: "approverPoint", value: "Điểm KPI được phê duyệt" },
                                { key: "importantLevel", value: "Độ quan trọng" }
                            ],
                            data: dataTask
                        }
                    ]
                },
            ]
        }
        return exportData;

    }

    formatTaskStatus = (translate, status) => {
        switch (status) {
            case "inprocess":
                return translate('task.task_management.inprocess');
            case "wait_for_approval":
                return translate('task.task_management.wait_for_approval');
            case "finished":
                return translate('task.task_management.finished');
            case "delayed":
                return translate('task.task_management.delayed');
            case "canceled":
                return translate('task.task_management.canceled');
        }
    }

    render() {
        const { kpimembers } = this.props;
        const { translate, employeeKpiSet } = this.props;
        const { taskId, content, contentName, perPage, points, tasks, taskImportanceDetail } = this.state;
        let list, myTask, exportData;

        if (kpimembers.tasks) {
            myTask = kpimembers.tasks;

        }
        if (kpimembers.currentKPI) {
            list = kpimembers.currentKPI.kpis;
        }
        if (employeeKpiSet && employeeKpiSet.creator && employeeKpiSet.creator.name && myTask) {
            exportData = this.convertDataToExportData(myTask, contentName, employeeKpiSet.creator.name);
        }
        return (
            <DialogModal
                modalID={"employee-kpi-evaluation-modal"}
                title={employeeKpiSet && employeeKpiSet.creator && `KPI ${employeeKpiSet.creator.name}, ${translate('kpi.evaluation.employee_evaluation.month')} ${this.formatMonth(employeeKpiSet.date)}`}
                hasSaveButton={false}
                size={100}>
                <div className="col-xs-12 col-sm-4">
                    <div className="box box-solid" style={{ border: "1px solid #ecf0f6", borderBottom: "none" }}>
                        <div className="box-header with-border">
                            <h3 className="box-title" style={{ fontWeight: 800 }}>{translate('kpi.evaluation.employee_evaluation.KPI_list')}</h3>
                        </div>
                        <div className="box-body no-padding">
                            <ul className="nav nav-pills nav-stacked">
                                {list && list.map((item, index) =>
                                    <li key={index} className={content === item._id ? "active" : undefined}>
                                        <a style={{ cursor: 'pointer' }} onClick={() => this.handleChangeContent(item._id, employeeKpiSet.creator._id, item.type, item.name)}>
                                            {item.name}
                                        &nbsp;
                                    </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-8 qlcv">
                    <div className="form-inline pull-right">
                        <button className="btn btn-success" onClick={() => this.handleSetPointKPI()}>
                            {translate('kpi.evaluation.employee_evaluation.calc_kpi_point')}
                        </button>
                        {exportData && <ExportExcel id="export-employee-kpi-evaluate-detail-kpi" exportData={exportData} style={{ marginTop: 5 }} />}
                    </div>
                    {list && list.map(item => {
                        if (item._id === content) return <React.Fragment key={item._id}>
                            <h4>{`${translate('kpi.evaluation.employee_evaluation.KPI_info')} "${item.name}"`}</h4>
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
                                    <span> {item.automaticPoint ? item.automaticPoint : translate('kpi.evaluation.employee_evaluation.not_avaiable')}</span>
                                    <span> - {item.employeePoint ? item.employeePoint : translate('kpi.evaluation.employee_evaluation.not_avaiable')}</span>
                                    <span> - {item.approvedPoint ? item.approvedPoint : translate('kpi.evaluation.employee_evaluation.not_avaiable')}</span>
                                </div>
                                {item.updatedAt &&
                                    <div>
                                        <label>{translate('kpi.evaluation.employee_evaluation.lastest_evaluation')}: </label>
                                        <span> {this.formatDate(item.updatedAt)}</span>
                                    </div>
                                }
                            </div>
                            <br /><br />
                            <h4>{translate('kpi.evaluation.employee_evaluation.task_list')}</h4>
                            <DataTableSetting className="pull-right" tableId="employeeKpiEvaluate" tableContainerId="tree-table-container" tableWidth="1300px"
                                columnArr={[
                                    'STT',
                                    'Tên công việc',
                                    'Thời gian thực hiện',
                                    'Thời gian đánh giá',
                                    'Trạng thái',
                                    'Đóng góp (%)',
                                    'Điểm',
                                    'Độ quan trọng']}
                                limit={perPage}
                                setLimit={this.setLimit}
                                hideColumnOption={true} />
                            <table id="employeeKpiEvaluate" className="table table-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th title="STT" style={{ width: "50px" }} className="col-fixed">Stt</th>
                                        <th title="Tên công việc">{translate('kpi.evaluation.employee_evaluation.name')}</th>
                                        <th title="Thời gian thực hiện">{translate('kpi.evaluation.employee_evaluation.work_duration_time')}</th>
                                        <th title="Thời gian đánh giá">{translate('kpi.evaluation.employee_evaluation.evaluate_time')}</th>
                                        <th title="Trạng thái">{translate('kpi.evaluation.employee_evaluation.status')}</th>
                                        <th title="Đóng góp (%)">{translate('kpi.evaluation.employee_evaluation.contribution')} (%)</th>
                                        <th title="Điểm">{translate('kpi.evaluation.employee_evaluation.point')}</th>
                                        <th title="Độ quan trọng">{translate('kpi.evaluation.employee_evaluation.importance_level')}</th>
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
                                                    <td>{this.formatTaskStatus(translate, itemTask.status)}</td>
                                                    <td>{itemTask.results.contribution}%</td>
                                                    <td>{itemTask.results.automaticPoint + '-' + itemTask.results.employeePoint + '-' + itemTask.results.approvedPoint}</td>
                                                    <td>
                                                        {points && tasks &&
                                                            <React.Fragment>
                                                                {console.log("task", itemTask)}
                                                                <input type="range"
                                                                    min='0'
                                                                    max='10'
                                                                    name={`taskImportanceLevel${itemTask.taskId}`}
                                                                    value={points[itemTask.taskId]}
                                                                    onChange={(e) => this.setValueSlider(e, itemTask.taskId)}
                                                                />
                                                                <div>
                                                                    {translate('kpi.evaluation.employee_evaluation.new_value')}: {points[itemTask.taskId]}
                                                                </div>
                                                                <div>
                                                                    {translate('kpi.evaluation.employee_evaluation.old_value')}: {itemTask.results.taskImportanceLevel}
                                                                </div>
                                                                <div>
                                                                    <a href="#modal-taskimportance-auto" onClick={() => this.showDetailTaskImportanceCal(itemTask)}>
                                                                        {translate('kpi.evaluation.employee_evaluation.auto_value')}: {itemTask.taskImportanceLevelCal}
                                                                    </a>
                                                                </div>
                                                            </React.Fragment>
                                                        }
                                                    </td>
                                                </tr>)) : <tr><td colSpan={7}>{translate('kpi.evaluation.employee_evaluation.data_not_found')}</td></tr>
                                    }
                                </tbody>
                            </table>
                            {
                                taskImportanceDetail &&
                                <TaskDialog
                                    task={taskImportanceDetail}
                                />

                            }
                            {<ModalDetailTask action={'kpi-evaluation'} id={taskId} />}
                        </React.Fragment>;
                        return true;
                    })}
                </div>
            </DialogModal>
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
    setPointKPI: kpiMemberActions.setPointKPI,
};
const connectedEmployeeKpiEvaluateModal = connect(mapState, actionCreators)(withTranslate(EmployeeKpiEvaluateModal));
export { connectedEmployeeKpiEvaluateModal as EmployeeKpiEvaluateModal };
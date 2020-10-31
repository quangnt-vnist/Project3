import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { TaskReportActions } from '../redux/actions';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { chartFunction } from './chart';
import { LineBarChartDetailForm } from './lineBarChartDetailForm';
import { PieChartDetailForm } from './pieChartDetailForm';

class TaskReportDetailForm extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.taskReportId !== state.taskReportId) {
            props.getTaskReportById(props.taskReportId);
            return {
                ...state,
                dataStatus: 1, // 1 : QUERING
                taskReportId: props.taskReportId,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (this.state.dataStatus === this.DATA_STATUS.QUERYING && !nextProps.reports.isLoading) {
            this.setState({
                dataStatus: this.DATA_STATUS.AVAILABLE,
            })
            return false;
        }

        if (this.state.dataStatus === this.DATA_STATUS.AVAILABLE) {
            let listTaskReport = nextProps.reports.listTaskReportById;
            this.setState({
                listTaskReport: listTaskReport,
                dataStatus: this.DATA_STATUS.FINISHED,
            });
            return false;
        }
        return true;
    }


    handleViewChart = async () => {
        let { listTaskReport } = this.state;
        let { taskReportId } = this.props;
        if (listTaskReport) {
            let newData = {
                organizationalUnit: listTaskReport.organizationalUnit._id,
                nameTaskReport: listTaskReport.nameTaskReport,
                descriptionTaskReport: listTaskReport.descriptionTaskReport,
                startDate: (listTaskReport.startDate) ? listTaskReport.startDate.slice(0, 10) : '',
                endDate: (listTaskReport.endDate) ? listTaskReport.endDate.slice(0, 10) : '',
                frequency: listTaskReport.frequency,
                accountableEmployees: listTaskReport.accountableEmployees.map(x => x._id),
                responsibleEmployees: listTaskReport.responsibleEmployees.map(x => x._id),
                status: listTaskReport.status,
                taskTemplate: listTaskReport.taskTemplate._id,
                taskInformations: listTaskReport.configurations,
                itemListBoxRight: listTaskReport.dataForAxisXInChart,
            }

            await this.props.getTaskEvaluations(newData);
            this.setState({
                idLineBarChart: `detail-lineBarChart-${taskReportId}`,
                idPieChart: `detail-pieChart-${taskReportId}`,
            })
        }
    }

    handleClose = () => {
        this.setState({
        })
    }

    formatTypeInfo = (type) => {
        let { translate } = this.props;
        if (type === "text") return translate('task_template.text');
        else if (type === "number") return translate('task_template.number');
        else if (type === "date") return translate('task_template.date');
        else if (type === "boolean") return "Boolean";
        else if (type === "set_of_values") return translate('task_template.value_set');
    }

    render() {
        const { reports, tasks } = this.props;
        const { idLineBarChart, idPieChart, taskReportId } = this.state;
        let listTaskReportById = reports.listTaskReportById;
        let listTaskEvaluations = tasks.listTaskEvaluations;
        let newlistTaskEvaluations, dataForAxisXInChart = [], results, output, pieChartDataConvert, barAndLineDataChartConvert;

        if (listTaskEvaluations && listTaskEvaluations.length > 0) {
            // Lọc lấy các trường cần thiết cho việc config dữ liệu biểu đồ.
            results = chartFunction.filterFieldInListTask(listTaskEvaluations);

            // Dữ liệu sau khi lọc
            newlistTaskEvaluations = results.newlistTaskEvaluations;

            // Chiều dữ liệu
            dataForAxisXInChart = results.dataForAxisXInChart;

            // Hàm này cho ra dạng data vẽ chart: bar, line, pie
            output = chartFunction.exportDataChart(newlistTaskEvaluations, dataForAxisXInChart);

            // data vẽ pie chart 
            pieChartDataConvert = output.pieChartDataConvert;

            //  data vẽ bar và line chart
            barAndLineDataChartConvert = output.barAndLineDataChartConvert;
        }

        return (
            <DialogModal
                size='75' modalID="modal-detail-taskreport" isLoading={false}
                formID="modal-detail-taskreport"
                title="Xem chi tiết báo cáo"
                hasSaveButton={false}
                hasNote={false}
            >
                {
                    idLineBarChart && idLineBarChart === `detail-lineBarChart-${taskReportId}` && barAndLineDataChartConvert && <LineBarChartDetailForm id={idLineBarChart} barLineChartData={barAndLineDataChartConvert} dataForAxisXInChart={dataForAxisXInChart} />
                }

                {/* Biểu đồ tròn  */}
                <div className="row">
                    {
                        idPieChart && idPieChart === `detail-pieChart-${taskReportId}` && pieChartDataConvert && pieChartDataConvert.map((item, index) => (
                            Object.entries(item).map(([code, data]) => {
                                if (data.length > 9) {
                                    return (
                                        <div key={index} className="col-xs-12 col-sm-12 col-md-12 col-ld-12">
                                            <div className="pieChart">
                                                <PieChartDetailForm id={`${idPieChart}-${index}`} pieChartData={data} namePieChart={code} dataForAxisXInChart={dataForAxisXInChart} />
                                            </div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div key={index} className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                            <div className="pieChart">
                                                <PieChartDetailForm id={`${idPieChart}-${index}`} pieChartData={data} namePieChart={code} dataForAxisXInChart={dataForAxisXInChart} />
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        ))
                    }
                </div>

                {/* Nút xem biểu đồ */}
                <div className="row">
                    <div className="col-md-12 col-lg-12" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div className="form-inline d-flex justify-content-end">
                            <button id="exportButton" className="btn btn-sm btn-success " title="Xem biểu đồ" style={{ marginBottom: '6px' }} onClick={() => this.handleViewChart()} ><span className="fa fa-fw fa-line-chart" style={{ color: 'rgb(66 65 64)', fontSize: '15px', marginRight: '5px' }}></span></button>
                        </div>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="row row-equal-height" >
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="description-box" style={{ height: "100%" }}>
                            <h4>
                                Thông tin chung
                            </h4>

                            {/* <div className="box-body"> */}
                            <div>
                                <strong>Đơn vị:</strong>
                                <span>{(listTaskReportById && listTaskReportById.organizationalUnit) ? listTaskReportById.organizationalUnit.name : ''}</span>
                            </div>

                            <div>
                                <strong>Mẫu công việc:</strong>
                                <span>{listTaskReportById && listTaskReportById.taskTemplate.name}</span>
                            </div>

                            <div>
                                <strong>Tên báo cáo:</strong>
                                <span>{listTaskReportById && listTaskReportById.name}</span>
                            </div>


                            <div>
                                <strong>Mô tả:</strong>
                                <span>{listTaskReportById && listTaskReportById.description}</span>
                            </div>

                            <div>
                                <strong>Đặc thù công việc: </strong>
                                <span>{listTaskReportById && (listTaskReportById.status === 0 ? 'Tất cả' : (listTaskReportById.status === 1 ? 'Đã hoàn thành' : 'Đang thực hiện'))}</span>
                            </div>

                            <div>
                                <strong>Tần suất:</strong>
                                <span>{listTaskReportById && (listTaskReportById.frequency === 'month' ? 'Tháng' : (listTaskReportById.frequency === 'quarter' ? 'Quý' : 'Năm'))}</span>
                            </div>

                            {listTaskReportById && listTaskReportById.responsibleEmployees &&
                                <React.Fragment>
                                    <strong>Người thực hiện:</strong>
                                    <ul>
                                        {listTaskReportById && listTaskReportById.responsibleEmployees.map((item, index) => {
                                            return <li key={index}>{item.name}</li>
                                        })}
                                    </ul>
                                </React.Fragment>
                            }
                            {listTaskReportById && listTaskReportById.accountableEmployees &&
                                <React.Fragment>
                                    <strong>Người phê duyệt:</strong>
                                    <ul>
                                        {listTaskReportById && listTaskReportById.accountableEmployees.map((item, index) => {
                                            return <li key={index}>{item.name}</li>
                                        })}
                                    </ul>
                                </React.Fragment>
                            }

                            {/* Người được xem */}
                            {listTaskReportById && listTaskReportById.readByEmployees &&
                                <React.Fragment>
                                    <strong>Người được xem:</strong>
                                    <ul>
                                        {listTaskReportById && listTaskReportById.readByEmployees.map((item, index) => {
                                            return <li key={index}>{item.name}</li>
                                        })}
                                    </ul>
                                </React.Fragment>
                            }

                            {/* Thống kê từ ngày */}
                            <div>
                                <strong>Thời gian đánh giá công việc từ ngày:</strong>
                                <span>{listTaskReportById && listTaskReportById.startDate && listTaskReportById.startDate.slice(0, 10)}</span>
                            </div>

                            {/* Thống kê đến ngày */}
                            <div>
                                <strong>Thời gian đánh giá công việc đến ngày:</strong>
                                <span>{listTaskReportById && listTaskReportById.endDate && listTaskReportById.endDate.slice(0, 10)}</span>
                            </div>

                            <React.Fragment>
                                <strong>Chiều dữ liệu cho biểu đồ:</strong>
                                <ul>
                                    {listTaskReportById && listTaskReportById.dataForAxisXInChart.map((x, index) => <li key={index}>{x.name}</li>)}
                                </ul>
                            </React.Fragment>
                            {/* </div> */}
                        </div>
                    </div>

                    {/* form thông tin công việc theo mẫu */}
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6"  >
                        <div className="description-box " style={{ height: "100%" }}>
                            <h4>
                                Điều kiện lọc theo các trường thông tin
                                </h4>
                            {
                                listTaskReportById && (!listTaskReportById.configurations || listTaskReportById.configurations.length === 0) ?
                                    <strong>Không có dữ liệu</strong> :
                                    listTaskReportById && listTaskReportById.configurations.map((item, index) =>
                                        <React.Fragment key={index}>
                                            <strong>{item.code} - {item.name} - {`Kiểu ${this.formatTypeInfo(item.type)}`}</strong>
                                            {
                                                <React.Fragment>
                                                    <div>
                                                        <strong> Điều kiện lọc:  </strong>
                                                        <span>{item.filter}</span>
                                                    </div>
                                                </React.Fragment>
                                            }

                                            <React.Fragment>
                                                <div>
                                                    <strong> Hiển thị trong báo cáo: </strong>
                                                    <span>{(item.showInReport) === true ? "Có" : "Không"}</span>
                                                </div>
                                            </React.Fragment>

                                            {
                                                <React.Fragment>
                                                    <div>
                                                        <strong> Tên mới: </strong>
                                                        <span>{item.newName}</span>
                                                    </div>
                                                </React.Fragment>
                                            }

                                            {
                                                <React.Fragment>
                                                    <div>
                                                        <strong> Cách tính: </strong>
                                                        <span>{(item.aggregationType === 0) ? "Trung bình cộng" : "Tổng"}</span>
                                                    </div>
                                                </React.Fragment>
                                            }

                                            {
                                                <React.Fragment>
                                                    <div>
                                                        <strong> Dạng biểu đồ: </strong>
                                                        <span>{(item.chartType === 0) ? "Cột" : (item.chartType === 1 ? "Đường" : "Tròn")}</span>
                                                    </div>
                                                </React.Fragment>
                                            }
                                            <div style={{ marginBottom: '12px' }}></div>
                                        </React.Fragment>
                                    )
                            }
                        </div>
                    </div>
                </div>

            </DialogModal>
        );
    }
}

function mapState(state) {
    const { tasks, reports } = state;
    return { tasks, reports };
}
const actionCreators = {
    getTaskReportById: TaskReportActions.getTaskReportById,
    getTaskEvaluations: taskManagementActions.getTaskEvaluations,
};
const detailReport = connect(mapState, actionCreators)(withTranslate(TaskReportDetailForm));

export { detailReport as TaskReportDetailForm };
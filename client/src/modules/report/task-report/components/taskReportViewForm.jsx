import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TaskReportActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../common-components';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { LineBarChartViewForm } from './lineBarChartViewForm';
import { PieChartViewForm } from './pieChartViewForm';
import { chartFunction } from './chart';

class TaskReportViewForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartType: '',
            aggregationType: '',
            collapseChart: false,
        }
    }

    formatPriority = (data) => {
        if (data === 1) return "Thấp";
        if (data === 2) return "Trung bình";
        if (data === 3) return "Cao";
    }


    render() {
        const { tasks, reports, translate } = this.props;
        let { modal } = this.props;
        let formater = new Intl.NumberFormat();
        let listTaskEvaluations = tasks.listTaskEvaluations;
        let taskInfoName, headTable = [], results, newlistTaskEvaluations, output, pieChartDataConvert, barAndLineDataChartConvert;

        /**
         * dataForAxisXInChart là mảng chứa chiều dữ liệu cho biểu đồ
         * 
         * id = 1 là chiều thời gian
         * 
         * id = 2 là chiều người thực hiện
         * 
         * id = 3 là chiều người phê duyệt
         */
        let dataForAxisXInChart = []
        // hiển thị trường thông tin hiện trong bảng báo cáo form preview view
        if (listTaskEvaluations && listTaskEvaluations.length > 0) {
            taskInfoName = listTaskEvaluations[0];
            taskInfoName.taskInformations.forEach(x => {
                if (x.type === "number") {
                    headTable = [...headTable, x.name];
                }
            })
        }


        if (listTaskEvaluations && listTaskEvaluations.length > 0 && modal === 'view') {
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
            <React.Fragment>
                <DialogModal
                    modalID="modal-view-taskreport" isLoading={false}
                    formID="form-view-tasktemplate"
                    title="Xem chi tiết báo cáo"
                    hasSaveButton={true}
                    func={this.save}
                    size={100}
                    hasNote={false}
                >
                    {/* Modal Body */}

                    {/* Biểu đồ đường và cột */}
                    {
                        modal && modal === 'view' && barAndLineDataChartConvert && <LineBarChartViewForm id="viewLineBarChart" barLineChartData={barAndLineDataChartConvert} dataForAxisXInChart={dataForAxisXInChart} />
                    }

                    {/* Biểu đồ tròn  */}
                    <div className="row">
                        {
                            modal && modal === 'view' && pieChartDataConvert && pieChartDataConvert.map((item, index) => (
                                Object.entries(item).map(([code, data]) => {
                                    if (data.length > 9) {
                                        return (
                                            <div key={index} className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                <div className="pieChart">
                                                    <PieChartViewForm id={`viewPieChart-${index}`} pieChartData={data} namePieChart={code} dataForAxisXInChart={dataForAxisXInChart} />
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={index} className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                                <div className="pieChart">
                                                    <PieChartViewForm id={`viewPieChart-${index}`} pieChartData={data} namePieChart={code} dataForAxisXInChart={dataForAxisXInChart} />
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                            ))
                        }
                    </div>

                    {/* Button xuất excell */}
                    <div className="form-inline">
                        <button id="exportButton" className="btn btn-sm btn-success " style={{ marginBottom: '10px' }}><span className="fa fa-file-excel-o"></span> Export to Excel</button>
                    </div>

                    {/* form hiển thị thông tin danh sách công việc được đưa vào biểu đồ */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="box">
                                <div className="box-header">
                                    <div className="box-tools pull-right">
                                        <button className="btn btn-box-tool" onClick={this.collapseChart} data-toggle="collapse" data-target="#showInfoTask"><i className="fa fa-minus"></i></button>
                                    </div>
                                </div>

                                <div className=" box-body in" data-toggle="collapse" aria-expanded="true" id="showInfoTask">
                                    <table className="table table-hover table-striped table-bordered" id="report_manager" style={{ marginBottom: '0px !important' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: 'center' }}>Công việc</th>
                                                <th style={{ textAlign: 'center' }}>Người thực hiện</th>
                                                <th style={{ textAlign: 'center' }}>Người phê duyệt</th>
                                                <th style={{ textAlign: 'center' }}>
                                                    Điểm hệ thống tự tính
                                                </th>
                                                <th style={{ textAlign: 'center' }}>
                                                    Ngày bắt đầu
                                                </th>
                                                <th style={{ textAlign: 'center' }}>
                                                    Ngày kết thúc
                                                </th>
                                                <th style={{ textAlign: 'center' }}>
                                                    Ngày đánh giá
                                                </th>
                                                <th style={{ textAlign: 'center' }}>
                                                    Mức độ ưu tiên
                                                </th>
                                                <th style={{ textAlign: 'center' }}>
                                                    Trạng thái công việc
                                                </th>
                                                {
                                                    headTable && headTable.map((x, key) => (<th key={key}>{x}</th>))
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                listTaskEvaluations && listTaskEvaluations.map((item, key) => {
                                                    //Lấy tên người thực hiện 
                                                    let getNameResponsibleEmployees = item.responsibleEmployees.map(x1 => x1.name);

                                                    //Lấy tên người phê duyệt
                                                    let getNameAccountableEmployees = item.accountableEmployees.map(x2 => x2.name);

                                                    // lấy điểm tự động của các công việc
                                                    let result = item.results, point = [];
                                                    if (result) {
                                                        result = result[0];
                                                        point = result.automaticPoint;
                                                    }

                                                    let contentTable = [];
                                                    if (headTable) {
                                                        item.taskInformations.forEach(element => {
                                                            if (element.type === 'number') {
                                                                contentTable = [...contentTable, element.value]
                                                            }
                                                        })
                                                    }
                                                    return (
                                                        <tr key={key}>
                                                            <td className="text-center" className="text-center">{item.name}</td>
                                                            <td className="text-center">
                                                                {
                                                                    getNameResponsibleEmployees.join(', ')
                                                                }
                                                            </td>
                                                            <td className="text-center">
                                                                {
                                                                    getNameAccountableEmployees.join(', ')
                                                                }
                                                            </td>
                                                            <td className="text-center">
                                                                {
                                                                    point
                                                                }
                                                            </td>
                                                            <td className="text-center">{item.startDate.slice(0, 10)}</td>
                                                            <td className="text-center">{item.endDate.slice(0, 10)}</td>
                                                            <td className="text-center">{item.date.slice(0, 10)}</td>
                                                            <td className="text-center">
                                                                {
                                                                    item.priority === 1 ? 'Thấp' : (item.priority === 2 ? 'Trung bình' : 'Cao')
                                                                }
                                                            </td>
                                                            <td className="text-center">{item.status}</td>
                                                            {
                                                                contentTable && contentTable.map((x, index) => (<td key={index}>{formater.format(parseInt(x))} VNĐ</td>))
                                                            }
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                {reports.isLoading ?
                                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                                    listTaskEvaluations && listTaskEvaluations.length === 0 && <div className="table-info-panel" style={{ width: '100%' }}>{translate('confirm.no_data')}</div>}
                            </div>
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks, reports } = state;
    return { tasks, reports };
}

const actionCreators = {
    createTaskReport: TaskReportActions.createTaskReport,
    getTaskEvaluations: taskManagementActions.getTaskEvaluations,
}

const viewForm = connect(mapState, actionCreators)(withTranslate(TaskReportViewForm));

export { viewForm as TaskReportViewForm };
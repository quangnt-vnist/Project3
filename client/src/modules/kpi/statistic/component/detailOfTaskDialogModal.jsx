import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../common-components';

class DetailOfTaskDialogModal extends Component {

    constructor(props) {
        super(props);
        
        this.state = {

        }
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

    formatPriority = (data) => {
        const { translate } = this.props;
        if (data === 1) return translate('task.task_management.low');
        if (data === 2) return translate('task.task_management.normal');
        if (data === 3) return translate('task.task_management.high');
    }

    formatStatus = (data) => {
        const { translate } = this.props;
        if (data === "inprocess") return translate('task.task_management.inprocess');
        else if (data === "wait_for_approval") return translate('task.task_management.wait_for_approval');
        else if (data === "finished") return translate('task.task_management.finished');
        else if (data === "delayed") return translate('task.task_management.delayed');
        else if (data === "canceled") return translate('task.task_management.canceled');
    }

    render() {
        const { translate } = this.props;
        const { listTask } = this.props;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-task-detail" 
                    title="Chi tiết công việc"
                    size="75"
                    hasNote={false}
                    hasSaveButton={false}
                >
                    <table className="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th title="Số thứ tự" style={{ width: "40px" }}>Stt</th>
                                <th title="Tên công việc" >Tên công việc</th>
                                <th title="Đơn vị">Đơn vị</th>
                                <th title="Độ ưu tiên" >Độ ưu tiên</th>
                                <th title="Ngày bắt đầu" >Ngày bắt đầu</th>
                                <th title="Ngày kết thúc">Ngày kết thúc</th>
                                <th title="Trạng thái" style={{ textAlign: "left" }}>Trạng thái</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                listTask && listTask.length !== 0 ?
                                    listTask.map((task, index) => 
                                        <tr key={task._id}>
                                            <td>{index + 1}</td>
                                            <td title={task.name}>
                                                <a href={`/task?taskId=${task._id}`} target="_blank">{task.name}</a>
                                            </td>
                                            <td title={task.detailOrganizationalUnit && task.detailOrganizationalUnit.length !== 0 ? task.detailOrganizationalUnit[0].name : null}>{task.detailOrganizationalUnit && task.detailOrganizationalUnit.length !== 0 ? task.detailOrganizationalUnit[0].name : null}</td>
                                            <td title={task.priority}>{this.formatPriority(task.priority)}</td>
                                            <td title={task.startDate}>{this.formatDate(task.startDate)}</td>
                                            <td title={task.endDate}>{this.formatDate(task.endDate)}</td>
                                            <td title={task.status} style={{ textAlign: "left" }}>{this.formatStatus(task.status)}</td>
                                        </tr>
                                    )
                                    : <tr>
                                        <td colspan="7">Không có dữ liệu</td>
                                    </tr>
                            }
                        </tbody>
                    </table> 
                </DialogModal>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { } = state;
    return { };
}

const actions = {

}

const connectDetailOfTaskDialogModal = connect(mapState, actions)(withTranslate(DetailOfTaskDialogModal));
export { connectDetailOfTaskDialogModal as DetailOfTaskDialogModal }
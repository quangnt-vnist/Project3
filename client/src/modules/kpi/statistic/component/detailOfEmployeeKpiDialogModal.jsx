import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../common-components';

class DetailOfEmployeeKpiDialogModal extends Component {

    constructor(props) {
        super(props);
        
        this.state = {

        }
    }

    formatStatus = (status) => {
        const { translate } = this.props;

        if (status === 0) {
            return "Yêu cầu làm lại";
        } else if (status === 1) {
            return "Đã kích hoạt";
        } else if (status === 2) {
            return "Đã kết thúc";
        } else {
            return "Chưa phê duyệt";
        } 
    }

    render() {
        const { translate } = this.props;
        const { listEmployeeKpi } = this.props;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-employee-kpi-detail" 
                    title="Chi tiết KPI nhân viên"
                    size="75"
                    hasNote={false}
                    hasSaveButton={false}
                >
                    <table className="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th title="Số thứ tự" style={{ width: "40px" }}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}</th>
                                <th title="Tên mục tiêu">{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.target_name')}</th>
                                <th title="Người khởi tạo">Người khởi tạo</th>
                                <th title="Email">Email</th>
                                <th title="Tiêu chí đánh giá">{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.evaluation_criteria')}</th>
                                <th title="Trạng thái">Trạng thái</th>
                                <th title="Trọng số" style={{ textAlign: "left" }}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.weight')}</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                listEmployeeKpi && listEmployeeKpi.length !== 0 ?
                                    listEmployeeKpi.map((item, index) =>
                                        <tr key={item._id}>
                                            <td>{index + 1}</td>
                                            <td title={item.name}>{item.name}</td>
                                            <td title={item.creatorInfo.name && item.creatorInfo.name.length !== 0 && item.creatorInfo.name[0]}>
                                                {item.creatorInfo.name && item.creatorInfo.name.length !== 0 && item.creatorInfo.name[0]}
                                            </td>
                                            <td title={item.creatorInfo.email && item.creatorInfo.email.length !== 0 && item.creatorInfo.email[0]}>
                                                {item.creatorInfo.email && item.creatorInfo.email.length !== 0 && item.creatorInfo.email[0]}
                                            </td>
                                            <td title={item.criteria}>{item.criteria}</td>
                                            <td title={item.status}>{this.formatStatus(item.status)}</td>
                                            <td title={item.weight} style={{ textAlign: "left" }}>{item.weight}</td>
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

const connectDetailOfEmployeeKpiDialogModal = connect(mapState, actions)(withTranslate(DetailOfEmployeeKpiDialogModal));
export { connectDetailOfEmployeeKpiDialogModal as DetailOfEmployeeKpiDialogModal }
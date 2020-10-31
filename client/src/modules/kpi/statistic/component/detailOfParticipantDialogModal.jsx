import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, DataTableSetting, PaginateBar, TreeTable } from '../../../../common-components';

class DetailOfParticipantDialogModal extends Component {

    constructor(props) {
        super(props);
        
        this.state = {

        }
    }

    render() {
        const { translate } = this.props;
        const { listParticipant } = this.props;
       
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-participant-detail" 
                    title="Chi tiết người tham gia"
                    hasNote={false}
                    hasSaveButton={false}
                >
                    <table className="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th title="Số thứ tự" style={{ width: "40px" }}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}</th>
                                <th title="Tên nhân viên">Tên nhân viên</th>
                                <th title="Email" style={{ textAlign: "left" }}>Email</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                listParticipant && listParticipant.length !== 0 ?
                                    listParticipant.map((item, index) => 
                                        <tr>
                                            <td>{index + 1}</td>  
                                            <td title={item.name}>{item.name}</td>
                                            <td title={item.email}>{item.email}</td>
                                        </tr>
                                    )
                                    : <tr>
                                        <td colspan="3">Không có dữ liệu</td>
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

const connectDetailOfParticipantDialogModal = connect(mapState, actions)(withTranslate(DetailOfParticipantDialogModal));
export { connectDetailOfParticipantDialogModal as DetailOfParticipantDialogModal }
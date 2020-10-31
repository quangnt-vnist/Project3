import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DetailOfTaskDialogModal } from './detailOfTaskDialogModal';
import { DetailOfEmployeeKpiDialogModal } from './detailOfEmployeeKpiDialogModal';
import { DetailOfParticipantDialogModal } from './detailOfParticipantDialogModal';

import { withTranslate } from 'react-redux-multilingual';

class DetailsOfOrganizationalUnitKpiForm extends Component {

    constructor(props) {
        super(props);
        
        this.state = {

        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.details !== prevState.details) {
            return {
                ...prevState,
                details: nextProps.details
            } 
        } else {
            return null;
        }
    }

    render() {
        const { translate } = this.props;
        const { details } = this.props;

        return (
            <div id="details-of-organizational-unit-kpi-form" className="description-box" style={{ height: "100%" }}>
                <h4 className="box-title">Thông tin chi tiết</h4>

                <div className="row">
                    <div className="col-xs-6">
                        <div className="form-group">
                            <strong>{translate('document.administration.domains.name')}:  </strong>
                            {details.name}
                        </div>

                        <div className="form-group">
                            <strong>Đơn vị:  </strong>
                            {details.organizationalUnit}
                        </div>

                        <div className="form-group">
                            <strong>Trọng số:  </strong>
                            {details.weight}
                        </div>
                    </div>

                    <div className="col-xs-6">
                        {/** Chi tiết số lượng kpi nhân viên */}
                        <div className="form-group">
                            <a title="Chi tiết KPI nhân viên" data-toggle="modal" data-target="#modal-employee-kpi-detail" data-backdrop="static" data-keyboard="false" style={{ cursor: "pointer" }}>
                                <strong>Số lượng Kpi nhân viên:  </strong>
                                {details.listEmployeeKpi.length}
                            </a>
                            <DetailOfEmployeeKpiDialogModal listEmployeeKpi={details.listEmployeeKpi}/>
                        </div>

                        {/** Chi tiết số lượng công việc */}
                        <div className="form-group">
                            <a title="Chi tiết công việc" data-toggle="modal" data-target="#modal-task-detail" data-backdrop="static" data-keyboard="false" style={{ cursor: "pointer" }}>
                                <strong>Số lượng công việc:  </strong>
                                {details.listTask.length}
                            </a>
                            <DetailOfTaskDialogModal listTask={details.listTask}/>
                        </div>

                        {/** Chi tiết người tham gia */}
                        <div className="form-group">
                            <a title="Chi tiết người tham gia" data-toggle="modal" data-target="#modal-participant-detail" data-backdrop="static" data-keyboard="false" style={{ cursor: "pointer" }}>
                                <strong>Số người tham gia:  </strong>
                                {details.listParticipant.length}
                            </a>
                            <DetailOfParticipantDialogModal listParticipant={details.listParticipant}/>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <button className="btn btn-danger" onClick={() => {
                        window.$(`#details-of-organizational-unit-kpi-form`).slideUp()
                    }}>{ translate('form.close') }</button>
                </div>
            </div>
        )
    }

}

function mapState(state) {
    const { } = state;
    return { };
}

const actions = {

}

const connectDetailsOfOrganizationalUnitKpiForm = connect(mapState, actions)(withTranslate(DetailsOfOrganizationalUnitKpiForm));
export { connectDetailsOfOrganizationalUnitKpiForm as DetailsOfOrganizationalUnitKpiForm }
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import Swal from 'sweetalert2';

import {
    getStorage
} from '../../../../../config';


var translate ='';
class ModalCopyEmployeeKpiSet extends Component {
    constructor(props) {
        super(props);
        translate =this.props.translate;
        this.state = {
            employeeKpiSet: {
                organizationalUnit: "",
                time: this.formatDate(Date.now()),
                creator: "" 
                
            },
        };
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = '../lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
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

        return [month, year].join('-');
    }

    /**Gửi req khởi tạo KPI tháng mới từ KPI tháng này */
    handleSubmit = async (event, oldemployeeKpiSet) => {
        event.preventDefault();
        var id = getStorage("userId");
        employeeKpiSet.creator = id;
        await this.setState(state => {
            return {
                ...state,
                employeeKpiSet: {
                    ...state.employeeKpiSet,
                    organizationalUnit: oldemployeeKpiSet.organizationalUnit._id,
                    kpis: oldemployeeKpiSet.kpis
                }
            }
        })
        
        var { employeeKpiSet } = this.state;
        if (employeeKpiSet.organizationalUnit && employeeKpiSet.time ) {//&& employeeKpiSet.creator
            Swal.fire({
                title: translate('kpi.evaluation.organizational_unit.management.copy_modal.alert.change_link'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            }).then((res) => {
                if (res.value) {
                    this.handleCloseModal(oldemployeeKpiSet._id);
                }
            });
        }
    }


    handleCloseModal = (id) => {
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.remove("modal-open");
        var modal = document.getElementById(`copyOldKPIToNewTime${id}`);
        modal.classList.remove("in");
        modal.style = "display: none;";
    }


    render() {
        var {employeeKpiSet} = this.props;

        return (
            /**Khởi tạo KPI tháng mới từ KPI tháng này */
            <div className="modal fade" id={`copyOldKPIToNewTime${employeeKpiSet._id}`}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">

                            {/**Button close modal */}
                            <button type="button" className="close" data-dismiss="modal" onClick={() => this.handleCloseModal(employeeKpiSet._id)} aria-hidden="true">×</button>
                            <h3 className="modal-title">{translate('kpi.evaluation.organizational_unit.management.copy_modal.create')}+' '+ {this.formatDate(employeeKpiSet.time)}</h3>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">

                                {/**Đơn vị của tập KPI tháng mới */}
                                <label className="col-sm-5">{translate('kpi.evaluation.organizational_unit.management.copy_modal.organizational_unit')}:</label>
                                <label className="col-sm-8" style={{ fontWeight: "400", marginLeft: "-14.5%" }}>{employeeKpiSet && employeeKpiSet.organizationalUnit.name}</label>
                            </div>
                            <div className="form-group">

                                {/**Chọn tháng mới để khởi tạo */}
                                <label className="col-sm-2">{translate('kpi.evaluation.organizational_unit.management.copy_modal.month')}:</label>
                                <div className='input-group col-sm-9 date has-feedback' style={{ marginLeft: "11px" }}>
                                    <div className="input-group-addon">
                                        <i className="fa fa-calendar" />
                                    </div>
                                    <input type="text" className="form-control pull-right" ref={input => this.time = input} defaultValue={this.formatDate(Date.now())} name="time" id="datepicker2" data-date-format="mm-yyyy" />
                                </div>
                            </div>
                            <div className="form-group" >

                                {/**Danh sách mục tiêu */}
                                <label className="col-sm-12">{translate('kpi.evaluation.organizational_unit.management.copy_modal.list_target')}:</label>
                                <ul>
                                    {typeof employeeKpiSet !== "undefined" && employeeKpiSet.kpis.length !== 0 &&
                                        employeeKpiSet.kpis.map(item => {
                                            return <li key={item._id}>{item.name + " (" + item.weight + ")"}</li>
                                        })
                                    }
                                </ul>
                            </div>
                        </div>

                        {/**Các button lưu và đóng */}
                        <div className="modal-footer">
                                <button className="btn btn-success" onClick={(event) => this.handleSubmit(event, employeeKpiSet)}>{translate('kpi.evaluation.organizational_unit.management.copy_modal.setting')}</button>
                            <button type="cancel" className="btn btn-primary" onClick={() => this.handleCloseModal(employeeKpiSet._id)}>{translate('kpi.evaluation.organizational_unit.management.copy_modal.cancel')}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


function mapState(state) {
    const { overviewEmployeeKpiSet } = state;
    return { overviewEmployeeKpiSet };
}

const actionCreators = {
};
const connectedModalCopyEmployeeKpiSet = connect(mapState, actionCreators)(withTranslate(ModalCopyEmployeeKpiSet));
export { connectedModalCopyEmployeeKpiSet as ModalCopyEmployeeKpiSet };
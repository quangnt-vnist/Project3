import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import {
    getStorage
} from '../../../../../config';
import Swal from 'sweetalert2';

import { DatePicker, DialogModal } from '../../../../../common-components';

import { managerKpiActions } from '../redux/actions';


var translate ='';
class ModalCopyKPIPersonal extends Component {
    constructor(props) {
        super(props);
        translate=this.props.translate;
        this.state = {
            kpipersonal: {
                organizationalUnit: "",
                time: this.formatDate(Date.now()),
                creator: "" 

            },
        };
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
    handleNewDateChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                NewDate: value,
            }
        });

    }

    /**Gửi req khởi tạo KPI tháng mới từ KPi tháng này */
    handleSubmit = async (id, oldkpipersonal, listkpipersonal, idunit) => {
        const { kpipersonal } = this.state;
        let idcreator = getStorage("userId");
        
        await this.setState(state => {
            return {
                ...state,
                kpipersonal: {
                    ...state.kpipersonal,
                    organizationalUnit: oldkpipersonal && oldkpipersonal.organizationalUnit._id,
                    kpis: oldkpipersonal && oldkpipersonal.kpis
                }
            }
        })
        
        if (this.state.NewDate == undefined) {
            Swal.fire({
                title: translate('kpi.organizational_unit.management.copy_modal.alert.check_new_date'),
                type: 'warning',
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            let date = this.state.NewDate.split("-");
            let check = 1;
            let nowDate = new Date();

            for (let i in listkpipersonal) {
                if (idunit == listkpipersonal[i].organizationalUnit._id) {
                    var checkDate = listkpipersonal[i].date.split("-");
                    if (checkDate[0] == date[1] && checkDate[1] == date[0]) {
                        check = 0;
                        break;
                    }
                }

            }
            if (check != 0) {
                if (date[1] < nowDate.getFullYear()) {
                    check = 2;
                } else if (date[1] == nowDate.getFullYear()) {
                    if (date[0] < nowDate.getMonth()) {
                        check = 2
                    }
                }
            }
            if (check == 0) {
                Swal.fire({
                    title: `${translate('kpi.organizational_unit.management.copy_modal.alert.coincide_month')} ${date[0]}-${date[1]} `,
                    type: 'warning',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
                })
            }
            if (check == 2) {
                Swal.fire({
                    title: translate('kpi.organizational_unit.management.copy_modal.alert.unable_kpi'),
                    type: 'warning',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
                })
            }

            if (check == 1) {
                this.props.copyEmployeeKPI(id, idcreator, idunit, this.state.NewDate);
                if (kpipersonal.unit && kpipersonal.time) {//&& kpiunit.creater
                    Swal.fire({
                        title: translate('kpi.organizational_unit.management.copy_modal.alert.change_link'),
                        type: 'warning',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
                    });
                }
            }
        }
    }

    save = () => {
        const { listkpipersonal, kpipersonal } = this.props;
        this.handleSubmit(kpipersonal._id, kpipersonal, listkpipersonal, kpipersonal.organizationalUnit._id);
    }
    
    render() {
        const { NewDate } = this.state;
        const { kpipersonal } = this.props;
        return (
            <DialogModal
                modalID={`copy-old-kpi-to-new-time-${kpipersonal._id}`}
                title={`${translate('kpi.organizational_unit.management.copy_modal.create')} ${this.formatDate(kpipersonal.date)}`}
                size={10}
                func={this.save}
            >
                {/**Đơn vị của KPI tháng mới */}
                <div className="form-group">
                    <label className="col-sm-5">{translate('kpi.organizational_unit.management.copy_modal.organizational_unit')}:</label>
                    <label className="col-sm-8" style={{ fontWeight: "400", marginLeft: "-14.5%" }}>{kpipersonal && kpipersonal.organizationalUnit.name}</label>
                </div>
                <div className="form-group">

                    {/**Tháng mới cần khởi tạo KPI */}
                    <label className="col-sm-2">{translate('kpi.organizational_unit.management.copy_modal.month')}:</label>
                    <DatePicker
                        id="new_date"
                        value={NewDate}
                        onChange={this.handleNewDateChange}
                        dateFormat="month-year"
                    />

                    {/**Danh sách các mục tiêu */}
                    <div className="form-group" >
                        <label className="col-sm-12">{translate('kpi.organizational_unit.management.copy_modal.list_target')}:</label>
                        <ul>
                            {typeof kpipersonal !== "undefined" && kpipersonal.kpis.length !== 0 &&
                                kpipersonal.kpis.map(item => {
                                    return <li key={item._id}>{item.name + " (" + item.weight + ")"}</li>
                                })
                            }
                        </ul>
                    </div>
                </div>                
            </DialogModal >
        );
    }
}


function mapState(state) {
    const { overviewKpiPersonal } = state;
    return { overviewKpiPersonal };
}

const actionCreators = {
    copyEmployeeKPI: managerKpiActions.copyEmployeeKPI,
};
const connectedModalCopyKPIPersonal = connect(mapState, actionCreators)(withTranslate(ModalCopyKPIPersonal));
export { connectedModalCopyKPIPersonal as ModalCopyKPIPersonal };
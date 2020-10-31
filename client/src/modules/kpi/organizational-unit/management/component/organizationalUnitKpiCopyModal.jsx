import React, { Component } from 'react';
import { connect } from 'react-redux';
import { managerActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import { ErrorLabel, DatePicker, DialogModal } from '../../../../../common-components';
import {
    getStorage
} from '../../../../../config';


class ModalCopyKPIUnit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kpiunit: {
                unit: "",
                date: this.formatDate(Date.now()),
                creator: "",
            }
        };
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

    handleSubmit = async (oldkpiunit, listkpi, idunit, kpiId) => {
        const { kpiunit } = this.state;
        const { translate } = this.props;
        let id = getStorage("userId");

        await this.setState(state => {
            return {
                ...state,
                kpiunit: {
                    ...state.kpiunit,
                    creator: id,
                    unit: oldkpiunit.organizationalUnit._id,
                    kpis: oldkpiunit.kpis
                }
            }
        })
        
        let checkNewDate = this.state.NewDate;
        if (checkNewDate) {
            let date = this.state.NewDate.split("-");
            let check = 1;
            let nowDate = new Date();

            for (let i in listkpi) {
                if (listkpi[i].organizationalUnit._id == idunit) {
                    let checkDate = listkpi[i].date.split("-");
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
                    title: translate('kpi.organizational_unit.management.copy_modal.alert.coincide_month')+`${date[0]}-${date[1]} `,
                    type: 'warning',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('kpi.organizational_unit.management.copy_modal.alert.confirm'),
                })
            }

            if (check == 2) {
                Swal.fire({
                    title: translate('kpi.organizational_unit.management.copy_modal.alert.unable_kpi'),
                    type: 'warning',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('kpi.organizational_unit.management.copy_modal.alert.confirm'),
                })
            }

            if (check == 1) {
                let data = {  
                    creator: id,
                    idunit: idunit,
                    datenew: this.state.NewDate
                }
                this.props.copyKPIUnit(kpiId, data);
                if (kpiunit.unit && kpiunit.date) {
                    Swal.fire({
                        title: translate('kpi.organizational_unit.management.copy_modal.alert.change_link'),
                        type: 'warning',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: translate('kpi.organizational_unit.management.copy_modal.alert.confirm'),
                    });
                }
            }
        } else {
            Swal.fire({
                title: translate('kpi.organizational_unit.management.copy_modal.alert.check_new_date'),
                type: 'warning',
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.organizational_unit.management.copy_modal.alert.confirm'),
            })
        }
    }

    save = () => {
        const { kpiId, listkpi, kpiunit, idunit } = this.props;
        this.handleSubmit(kpiunit, listkpi, idunit, kpiId)
    }

    render() {
        const { kpiunit, listkpi, idunit, translate, kpiId } = this.props;
        const { NewDate, errorOnDate } = this.state;
        
        return (
            <DialogModal
                modalID={`copy-old-kpi-to-new-time-${kpiunit._id}`}
                title={translate('kpi.organizational_unit.management.copy_modal.create')+ `${this.formatDate(kpiunit.date)}`}
                size={10}
                func={this.save}
            >
                <div className="form-group">
                    <label className="col-sm-4">{translate('kpi.organizational_unit.management.copy_modal.organizational_unit')}</label>
                    <label className="col-sm-9" style={{ fontWeight: "400", marginLeft: "-14.5%" }}>{kpiunit && kpiunit.organizationalUnit.name}</label>
                </div>
                <br/>
                <div className="form-group">
                    <label className="col-sm-2">{translate('kpi.organizational_unit.management.copy_modal.month')}</label>
                    <DatePicker
                        id="new_date"
                        value={NewDate}
                        onChange={this.handleNewDateChange}
                        dateFormat="month-year"
                    />
                    <ErrorLabel content={errorOnDate} />
                </div>
                <div className="form-group" >
                    <label className="col-sm-12">{translate('kpi.organizational_unit.management.copy_modal.list_target')}</label>
                    <ul>
                        {typeof kpiunit && kpiunit.kpis.length &&
                            kpiunit.kpis.map(item => {
                                return <li key={item._id}>{item.name + " (" + item.weight + ")"}</li>
                            })
                        }
                    </ul>
                </div>
            </DialogModal >
        );
    }
}

function mapState(state) {
    const { managerKpiUnit } = state;
    return { managerKpiUnit };
}

const actionCreators = {
    copyKPIUnit: managerActions.copyKPIUnit
};
const connectedModalCopyKPIUnit = connect(mapState, actionCreators)(withTranslate(ModalCopyKPIUnit));
export { connectedModalCopyKPIUnit as ModalCopyKPIUnit };
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, DatePicker } from '../../../../../common-components';

import { createUnitKpiActions } from '../redux/actions';

class OrganizationalUnitKpiCreateModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organizationalUnitKpi: {
                organizationalUnit: "",
                date: "",
            }
        };
    }
    
    formatDate = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                organizationalUnitKpi: {
                    ...state.organizationalUnitKpi,
                    date: value
                }
            }
        })
    }
    
    handleSubmit = async () => {
        const { translate } = this.props;

        let d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
            
        if (day.length < 2) {
            day = '0' + day;
        }
            
        let defaultTime =  [month, year].join('-');

        if(this.state.organizationalUnitKpi.date === ""){
            await this.setState(state => {
                return {
                    ...state,
                    organizationalUnitKpi: {
                        ...state.organizationalUnitKpi,
                        date: defaultTime,
                    }
                }
            })
        }

        await this.setState(state => {
            return {
                ...state,
                organizationalUnitKpi: {
                    ...state.organizationalUnitKpi,
                    organizationalUnit: this.props.organizationalUnit,
                }
            }
        })
        let { organizationalUnitKpi } = this.state;
        
        if (organizationalUnitKpi.organizationalUnit && organizationalUnitKpi.date) {            
            this.props.addKPIUnit(organizationalUnitKpi);

            window.$("#startKPIUnit").modal("hide");
        }

    }
    
    render() {
        const { organizationalUnit } = this.props;
        const { translate } = this.props; 

        let d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
            
        if (day.length < 2) {
            day = '0' + day;
        }

        let defaultTime =  [month, year].join('-');

        return (
            <React.Fragment>
                <DialogModal
                    modalID="startKPIUnit" isLoading={false}
                    formID="formStartKPIUnit"
                    title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.initialize_kpi_set')}
                    msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
                    msg_faile={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
                    func={this.handleSubmit}
                >
                    {/* Form khởi tạo KPI đơn vị */}
                    <form id="formStartKPIUnit" onSubmit={() => this.handleSubmit(translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success'))}>
                        
                        {/* Đơn vị */}
                        <div className="form-group">
                            <label className="col-sm-2">{translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.organizational_unit')}</label>
                            <label className="col-sm-10" style={{ fontWeight: "400", marginLeft: "-2.5%" }}>{organizationalUnit && organizationalUnit.name}</label>
                        </div>
                        
                        {/* Tháng */}
                        <div className="form-group">
                            <label className="col-sm-2">{translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.month')}</label>
                            <DatePicker
                                id="month"      
                                dateFormat="month-year"            
                                value={defaultTime}                            
                                onChange={this.formatDate}
                                disabled={false}                     
                            />
                        </div>

                        {/* Mục tiêu mặc định */}
                        <div className="form-group">
                            <label className="col-sm-12">{translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.default_target')}</label>
                            <ul>
                                <li>Hỗ trợ thực hiện công việc</li>
                                <li>Phê duyệt công việc</li>
                            </ul>
                        </div>

                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}


function mapState(state) {
    const { createKpiUnit } = state;
    return { createKpiUnit };
}

const actionCreators = {
    addKPIUnit: createUnitKpiActions.addKPIUnit,
    getKPIParent: createUnitKpiActions.getKPIParent
};
const connectedOrganizationalUnitKpiCreateModal = connect(mapState, actionCreators)(withTranslate(OrganizationalUnitKpiCreateModal));
export { connectedOrganizationalUnitKpiCreateModal as OrganizationalUnitKpiCreateModal };

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, ExportExcel } from '../../../../../common-components';
import { DatePicker, SelectBox } from '../../../../../common-components/index';

import { UserActions } from "../../../../super-admin/user/redux/actions";
import { kpiMemberActions } from '../../../evaluation/employee-evaluation/redux/actions'

import { ModalCopyKPIPersonal } from './employeeKpiCopyModal';
import { ModalDetailKPIPersonal } from './employeeKpiDetailModal';


import Swal from 'sweetalert2';


var translate ='';
class KPIPersonalManager extends Component {
    constructor(props) {
        super(props);
        translate=this.props.translate
        this.state = {
            commenting: false,
            user:null,
            status:-1,
            startDate: null,
            endDate: null,
            infosearch: {
                role: localStorage.getItem("currentRole"),
                user: localStorage.getItem("userId"),
                status: null,
                startDate: null,
                endDate: null
            },
            showApproveModal: null,
            showDetailKpiPersonal: null
        };
    }
    componentDidMount() {
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        this.props.getEmployeeKPISets(this.state.infosearch);
    }
    
    formatDateBack(date) {
        var d = new Date(date), month, day, year;
        if(d.getMonth()===0){
            month = '' + 12;
            day = '' + d.getDate();
            year = d.getFullYear()-1;
        } else{
            month = '' + (d.getMonth()+1);
            day = '' + d.getDate();
            year = d.getFullYear();
        }
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
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

    /**Hiển thị modal khởi tạo KPI tháng mới từ Kpi tháng đang chọn */
    showModalCopy = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                showModalCopy: id
            }
        })
        window.$(`#copy-old-kpi-to-new-time-${id}`).modal("show")
    }

    /**Dịch trạng thái của tập KPI */
    checkStatusKPI = (status) => {
        if (status === 0) {
            return translate('kpi.evaluation.employee_evaluation.establishing');
        } else if (status === 1) {
            return translate('kpi.evaluation.employee_evaluation.expecting');
        } else if (status === 2) {
            return translate('kpi.evaluation.employee_evaluation.activated');
        }
    }

    handleStartDateChange = (value) => {
        this.setState(state => {
                return {
                    ...state,
                    startDate: value,
                }
            });
        
    }

    handleEndDateChange = (value) => {
        this.setState(state => {
                return {
                    ...state,
                    endDate: value,
                }
            });   
        }

    handleStatusChange =(value) => {
        this.setState(state => {
            return {
                ...state,
                status: value
            }
        });
    }

    /**Gửi req seach data */
    handleSearchData = async () => {
        if(this.state.startDate === "") this.state.startDate = null;
        if(this.state.endDate === "") this.state.endDate = null;
        if(this.state.status === -1) this.state.status =null;
        await this.setState(state => {
            return {
                ...state,
                infosearch: {
                    ...state.infosearch,
                    status: this.state.status,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate
                },
                employeeKpiSet: {_id: null},
            }
        })
        
        const { infosearch } = this.state;
            var startDate;
            var startdate=null;
            var endDate;
            var enddate=null;

            if(infosearch.startDate !== null) {startDate = infosearch.startDate.split("-");
            startdate = new Date(startDate[1], startDate[0], 0);}
            if (infosearch.endDate !== null){endDate= infosearch.endDate.split("-");
            enddate = new Date(endDate[1], endDate[0], 28);}

            if (startdate && enddate && Date.parse(startdate) > Date.parse(enddate)) {
                Swal.fire({
                    title: translate('kpi.evaluation.employee_evaluation.wrong_time')+"!",
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('general.accept')
                })
            } 
            else {
                this.props.getEmployeeKPISets(infosearch);
            }
    }

    /**Mở modal xem chi tiết 1 mẫu công việc */
    showDetailKpiPersonal = async (item) => {
        await this.setState(state => {
            return {
                ...state,
                employeeKpiSet: item
            }
        })
        window.$(`modal-detail-KPI-personal`).modal('show')
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (data) => {
        let fileName = "Bảng theo dõi KPI cá nhân";

        if(data.length !== 0){
            fileName+= " "+ (data[0].creator.name?data[0].creator.name:"");
        }

        if (data) {           
            data = data.map((x, index) => {
                let automaticPoint = (x.automaticPoint === null)?"Chưa đánh giá":parseInt(x.automaticPoint);
                let employeePoint = (x.employeePoint === null)?"Chưa đánh giá":parseInt(x.employeePoint);
                let approverPoint =(x.approvedPoint===null)?"Chưa đánh giá":parseInt(x.approvedPoint);
                let date = new Date(x.date);                   
                let status = this.checkStatusKPI(x.status);
                let numberTarget =parseInt(x.kpis.length);               

                return {
                    STT: index + 1,                 
                    automaticPoint: automaticPoint,
                    status: status,
                    employeePoint: employeePoint,
                    approverPoint: approverPoint,
                    date :date,
                    numberTarget:numberTarget                   
                };
            })
        }

        let exportData = {
            fileName: fileName,
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle : fileName,
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "date", value: "Thời gian" },    
                                { key: "status", value: "Trạng thái mục tiêu" },                     
                                { key: "numberTarget", value: "Số lượng mục tiêu" },
                                { key: "automaticPoint", value: "Điểm KPI tự động" },
                                { key: "employeePoint", value: "Điểm KPI tự đánh giá" },
                                { key: "approverPoint", value: "Điểm KPI được phê duyệt" }
                            ],
                            data: data
                        }
                    ]
                },
            ]
        }
        return exportData;        
       
    }

    render() {
        var kpipersonal;
        var userdepartments;
        let exportData;

        const { translate, kpimembers, user } =this.props;
        const { status,startDate, endDate} = this.state;

        if (user) userdepartments = user.userdepartments;
        if (kpimembers) kpipersonal =  kpimembers.kpimembers;
        
        if(kpipersonal){
            exportData=this.convertDataToExportData(kpipersonal)
        }
        return (
            <div className="box">
                <div className="box-body qlcv">

                    {/**Modal xem chi tiết của 1 tập KPI */}
                    <ModalDetailKPIPersonal employeeKpiSet={this.state.employeeKpiSet}/>

                    {/**Select box chọn trạng thái để tìm kiếm */}
                    <div className="form-inline">
                        <div className="form-group">
                            <label>{translate('general.status')}:</label>
                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                id={`status-kpi`}
                                style={{width: "100%"}}
                                items = {[
                                    {value:-1, text : "--"+translate('kpi.evaluation.employee_evaluation.choose_status')+"--"},
                                    {value:0, text : translate('kpi.evaluation.employee_evaluation.establishing')},
                                    {value:1, text : translate('kpi.evaluation.employee_evaluation.expecting')},
                                    {value:2, text : translate('kpi.evaluation.employee_evaluation.activated')},]}
                                onChange={this.handleStatusChange}
                                value={status}
                            />
                        </div>

                    </div>

                    <div className="form-inline">

                        {/**Chọn ngày bắt đầu */}
                        <div className="form-group">
                            <label>{translate('kpi.evaluation.employee_evaluation.from')}:</label>
                            <DatePicker id='start_date'
                            value = {startDate}
                            onChange={this.handleStartDateChange}
                            dateFormat="month-year"
                            />
                        </div>
                        
                        {/**Chọn ngày kết thúc */}
                        <div className="form-group">
                            <label>{translate('kpi.evaluation.employee_evaluation.to')}</label>
                            <DatePicker
                            id='end_date'
                            
                            value = {endDate}
                            onChange={this.handleEndDateChange}
                            dateFormat="month-year"
                            />
                        </div>

                        <div className="form-group">
                        <button type="button" className="btn btn-success" onClick={()=> this.handleSearchData()}>{
                        translate('kpi.organizational_unit.management.over_view.search')}</button>
                        </div>
                        {exportData&&<ExportExcel id="export-employee-kpi-management" exportData={exportData} style={{ marginRight: 15, marginTop:5 }} />}

                    </div>
                    
                    {/**Table chứa danh sách các tập KPI */}
                    <DataTableSetting className="pull-right" tableId="kpiEmployeeManagement" tableContainerId="tree-table-container" tableWidth="1300px"
                    columnArr={[ 
                        translate('kpi.evaluation.employee_evaluation.index'),
                        translate('kpi.evaluation.employee_evaluation.time') , 
                        translate('kpi.evaluation.employee_evaluation.status'),
                        translate('kpi.evaluation.employee_evaluation.number_of_targets') , 
                        translate('kpi.evaluation.employee_evaluation.system_evaluate') ,
                        translate('kpi.evaluation.employee_evaluation.result_self_evaluate') ,
                        translate('kpi.evaluation.employee_evaluation.evaluation_management'),
                        translate('kpi.evaluation.employee_evaluation.action')]} 
                    limit={this.state.perPage} 
                    setLimit={this.setLimit} 
                    hideColumnOption={true} />

                    <table id="kpiEmployeeManagement" className="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th title={translate('kpi.evaluation.employee_evaluation.index')} style={{ width: "40px" }} className="col-fixed">{translate('kpi.evaluation.employee_evaluation.index')}</th>
                                <th title={ translate('kpi.evaluation.employee_evaluation.time')}>{ translate('kpi.evaluation.employee_evaluation.time')}</th>
                                <th title={translate('kpi.evaluation.employee_evaluation.status')}>{translate('kpi.evaluation.employee_evaluation.status')}</th>
                                <th title={translate('kpi.evaluation.employee_evaluation.number_of_targets')}>{translate('kpi.evaluation.employee_evaluation.number_of_targets')}</th>
                                <th title={translate('kpi.evaluation.employee_evaluation.system_evaluate')}>{translate('kpi.evaluation.employee_evaluation.system_evaluate')}</th>
                                <th title={translate('kpi.evaluation.employee_evaluation.result_self_evaluate')}>{translate('kpi.evaluation.employee_evaluation.result_self_evaluate')}</th>
                                <th title={translate('kpi.evaluation.employee_evaluation.evaluation_management')}>{translate('kpi.evaluation.employee_evaluation.evaluation_management')}</th>
                                <th title={translate('kpi.evaluation.employee_evaluation.action')}>{translate('kpi.evaluation.employee_evaluation.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kpipersonal && kpipersonal.length!==0 && kpipersonal.map((item, index) =>
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{this.formatDate(item.date)}</td>
                                    <td>{this.checkStatusKPI(item.status)}</td>
                                    <td>{item.kpis.length}</td>
                                    <td>{item.automaticPoint === null ? translate('kpi.evaluation.employee_evaluation.not_evaluated_yet') : item.automaticPoint}</td>
                                    <td>{item.employeePoint === null ? translate('kpi.evaluation.employee_evaluation.not_evaluated_yet') : item.employeePoint}</td>
                                    <td>{item.approvedPoint === null ? translate('kpi.evaluation.employee_evaluation.not_evaluated_yet') : item.approvedPoint}</td>
                                    <td>

                                        {/**Các Button để xem chi tiết, khởi tạo KPI tháng mới */}
                                        <a href="#modal-detail-KPI-personal" onClick={()=> this.showDetailKpiPersonal(item)} data-toggle="modal"
                                        title={translate('kpi.evaluation.employee_evaluation.view_detail')}><i className="material-icons">view_list</i></a>
                                        <a href="#abc" onClick={() => this.showModalCopy(item._id)} data-toggle="modal" 
                                        className="copy" title={translate('kpi.evaluation.employee_evaluation.clone_to_new_kpi')}><i className="material-icons">content_copy</i></a>
                                        {this.state.showModalCopy === item._id  && <ModalCopyKPIPersonal id={item._id} idunit={item.organizationalUnit._id} listkpipersonal={kpipersonal} kpipersonal={item} />}
                                    </td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

function mapState(state) {
    const { user, kpimembers } = state;
    return { user, kpimembers };
}

const actionCreators = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getEmployeeKPISets: kpiMemberActions.getEmployeeKPISets,
};

const connectedKPIPersonalManager = connect(mapState, actionCreators)(withTranslate(KPIPersonalManager));
export { connectedKPIPersonalManager as KPIPersonalManager };
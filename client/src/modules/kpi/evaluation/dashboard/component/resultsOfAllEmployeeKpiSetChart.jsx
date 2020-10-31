import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createKpiSetActions } from '../../../employee/creation/redux/actions';

import { DatePicker } from '../../../../../common-components';

import { withTranslate } from 'react-redux-multilingual'

import Swal from 'sweetalert2';
import c3 from 'c3';
import 'c3/c3.css';
class ResultsOfAllEmployeeKpiSetChart extends Component {

    constructor(props) {
        super(props);

        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        this.INFO_SEARCH = {
            startMonth: currentYear + '-' + 1,
            endMonth: (currentMonth > 10) ? ((currentYear + 1) + '-' + (currentMonth - 10)) : (currentYear + '-' + (currentMonth + 2))
        }

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.KIND_OF_POINT = { AUTOMATIC: 1, EMPLOYEE: 2, APPROVED: 3 };

        this.state = {
            userRoleId: localStorage.getItem("currentRole"),

            startMonth: this.INFO_SEARCH.startMonth,
            endMonth: this.INFO_SEARCH.endMonth,

            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
            kindOfPoint: this.KIND_OF_POINT.AUTOMATIC,
        }
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (nextState.kindOfPoint !== this.state.kindOfPoint) {
            await this.setState(state =>{
                return {
                    ...state,
                    kindOfPoint: nextState.kindOfPoint,
                };
            });
            
            this.multiLineChart();
        }

        if (nextProps.organizationalUnitIds !== this.state.organizationalUnitIds || nextState.startMonth !== this.state.startMonth || nextState.endMonth !== this.state.endMonth) {
            await this.props.getAllEmployeeKpiSetInOrganizationalUnitsByMonth(nextProps.organizationalUnitIds, nextState.startMonth, nextState.endMonth);
            
            await this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING
                }
            });

            return false;
        }

        if (nextState.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {
            this.props.getAllEmployeeKpiSetInOrganizationalUnitsByMonth(this.state.organizationalUnitIds, this.state.startMonth, this.state.endMonth);

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                };
            });

            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!nextProps.createEmployeeKpiSet.employeeKpiSetsInOrganizationalUnitByMonth)
                return false;

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                };
            });

            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE) {

            this.multiLineChart();
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                };
            });
        }

        return false;
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        
        if (nextProps.organizationalUnitIds !== prevState.organizationalUnitIds) {
            return {
                ...prevState,
                organizationalUnitIds: nextProps.organizationalUnitIds
            }
        } else {
            return null;
        }
    }
    
    componentDidMount(){
        this.props.getAllEmployeeKpiSetInOrganizationalUnitsByMonth(this.state.organizationalUnitIds, this.state.startMonth, this.state.endMonth);
    }

    /** Select kind of point */
    handleSelectKindOfPoint = (value) => {
        if (Number(value) !== this.state.kindOfPoint) {
            this.setState(state => {
                return {
                    ...state,
                    kindOfPoint: Number(value)
                }
            })
        }
    }

    /** Select month start in box */
    handleSelectMonthStart = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        this.INFO_SEARCH.startMonth = month;
    }

    /** Select month end in box */
    handleSelectMonthEnd = async (value) => {
        if (value.slice(0, 2) < 12) {
            var month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)) + 1);
        } else {
            var month = (new Number(value.slice(3, 7)) + 1) + '-' + '1';
        }
        this.INFO_SEARCH.endMonth = month;
    }

    /** Search data */
    handleSearchData = async () => {
        let startMonth = new Date(this.INFO_SEARCH.startMonth);
        let endMonth = new Date(this.INFO_SEARCH.endMonth);

        if (startMonth.getTime() >= endMonth.getTime()) {
            const { translate } = this.props;
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            await this.setState(state => {
                return {
                    ...state,
                    startMonth: this.INFO_SEARCH.startMonth,
                    endMonth: this.INFO_SEARCH.endMonth
                }
            })
        }
    }

    filterAndSetDataPoint = (name, arrayPoint) => {
        let dateAxisX = [], point = [];

        dateAxisX.push('date-' + name);
        point.push(name);

        for(let i=0; i<arrayPoint.length; i++) {
            let newDate = new Date(arrayPoint[i].date);
            newDate = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + (newDate.getDate() - 1);

            dateAxisX.push(newDate);

            if(this.state.kindOfPoint === this.KIND_OF_POINT.AUTOMATIC) {
                point.push(arrayPoint[i].automaticPoint);
            } else if(this.state.kindOfPoint === this.KIND_OF_POINT.EMPLOYEE) {
                point.push(arrayPoint[i].employeePoint);
            } else if(this.state.kindOfPoint === this.KIND_OF_POINT.APPROVED) {
                point.push(arrayPoint[i].approvedPoint);
            }
        }

        return [
            dateAxisX,
            point
        ]
    }

    setDataMultiLineChart = () => {
        const { createEmployeeKpiSet } = this.props;
        let employeeKpiSetsInOrganizationalUnitByMonth, point = [], exportData;

        if (createEmployeeKpiSet.employeeKpiSetsInOrganizationalUnitByMonth) {
            employeeKpiSetsInOrganizationalUnitByMonth = createEmployeeKpiSet.employeeKpiSetsInOrganizationalUnitByMonth
            exportData = this.convertDataToExportData(employeeKpiSetsInOrganizationalUnitByMonth)
            this.handleExportData(exportData);
        }
        
        if(employeeKpiSetsInOrganizationalUnitByMonth) {
            for(let i=0; i<employeeKpiSetsInOrganizationalUnitByMonth.length; i++) {
                point = point.concat(this.filterAndSetDataPoint(employeeKpiSetsInOrganizationalUnitByMonth[i]._id, employeeKpiSetsInOrganizationalUnitByMonth[i].employeeKpi));
            }
        }

        return point;
    }

    removePreviousChart = () => {
        const chart = this.refs.chart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    multiLineChart = () => {
        this.removePreviousChart();

        let dataChart, xs = {};
        const {translate}= this.props;
        dataChart = this.setDataMultiLineChart();
        
        for(let i=0; i<dataChart.length; i=i+2) {
            let temporary = {};
            temporary[dataChart[i+1][0]] = dataChart[i][0]; 
            xs = Object.assign(xs, temporary);
        }

        this.chart = c3.generate({
            bindto: this.refs.chart,

            padding: {                              
                top: 20,
                bottom: 20,
                right: 20
            },

            data: {                                 
                xs: xs,
                columns: dataChart,
                type: 'spline'
            },

            axis: {                                
                x: {
                    type : 'timeseries',
                    tick: {
                        format: function (x) { return (x.getMonth() + 1) + "-" + x.getFullYear(); }
                    }
                },
                y: {
                    max: 100,
                    min: 0,
                    label: {
                        text: translate('kpi.organizational_unit.dashboard.point'),
                        position: 'outer-right'
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                }
            },
        })
    }

    handleExportData =(exportData)=>
    {
        const { onDataAvailable } = this.props;
        if (onDataAvailable) {
            onDataAvailable(exportData);
        }
        this.setState(state => {
            return {
                ...state,
                exportData : exportData            }
        })
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (data) => {
        let fileName = "Kết quả KPI nhân viên toàn đơn vị theo từng tháng";
        let convertToObjectData={}, finalData=[],employeeKpiArray=[];
        if (data) {    
            
            if (data) {           
                for(let i=0; i< data.length;i++){
                    if(data[i].employeeKpi.length >1){
                        for(let j = 0 ; j< data[i].employeeKpi.length ; j++){

                            data[i].employeeKpi[j]["name"]=data[i]._id;                            

                            let d = new Date(data[i].employeeKpi[j].date),
                            month = (d.getMonth() + 1)+"-"+d.getFullYear();
                            data[i].employeeKpi[j]["month"]=month;
                            data[i].employeeKpi[j]["date"]=d;

                            employeeKpiArray.push(data[i].employeeKpi[j]);
                        }
                    }
                }
             }

            for(let i=0;i<employeeKpiArray.length;i++){
                let objectName = employeeKpiArray[i].month;
                let checkDuplicate = (Object.keys(convertToObjectData)).find(element => element === objectName);
                if(!checkDuplicate)
                {
                    convertToObjectData[objectName]=[];
                    convertToObjectData[objectName].push(employeeKpiArray[i]);
                }
                else {
                    convertToObjectData[objectName].push(employeeKpiArray[i]);
                }
    
            }
            finalData =Object.values(convertToObjectData);
            
        }

        let exportData = {
            fileName: fileName,
            dataSheets: finalData.map((x,index)=>{
                return {
                    sheetName: x[0].month?x[0].month:"",
                    sheetTitle : "Thống kê kết quả KPI " + (x[0].month?x[0].month:"") ,
                    tables: [
                        {
                            columns: [                            
                                { key: "date", value: "Thời gian" },
                                { key: "name", value: "Tên nhân viên"},
                                { key: "automaticPoint", value: "Điểm KPI tự động" },
                                { key: "employeePoint", value: "Điểm KPI tự đánh giá" },
                                { key: "approvedPoint", value: "Điểm KPI được phê duyệt" }
                            ],
                            data: x
                        }
                    ]
                }
            })
        }
        return exportData;        
       
    }

    render() {
        const { createEmployeeKpiSet,translate } = this.props;

        let employeeKpiSetsInOrganizationalUnitByMonth;

        if (createEmployeeKpiSet.employeeKpiSetsInOrganizationalUnitByMonth) {
            employeeKpiSetsInOrganizationalUnitByMonth = createEmployeeKpiSet.employeeKpiSetsInOrganizationalUnitByMonth;
        }
        let d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        let defaultEndMonth = [month, year].join('-');
        let defaultStartMonth = ['01', year].join('-');

        return (
            <React.Fragment>
                <section className="form-inline">
                    <div className="form-group">
                        <label>{translate('kpi.evaluation.employee_evaluation.from')}</label>
                        <DatePicker
                            id="monthStartInResultsOfAllEmployeeKpiSetChart"
                            dateFormat="month-year"          
                            value={defaultStartMonth}  
                            onChange={this.handleSelectMonthStart}
                            disabled={false}            
                        />
                    </div>
                </section>
                <section className="form-inline">
                    <div>
                    </div>
                    <div className="form-group">
                        <label>{translate('kpi.evaluation.employee_evaluation.to')}</label>
                        <DatePicker
                            id="monthEndInResultsOfAllEmployeeKpiSetChart"
                            dateFormat="month-year"      
                            value={defaultEndMonth}     
                            onChange={this.handleSelectMonthEnd}
                            disabled={false}            
                        />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" onClick={this.handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                    </div>
                </section>

                <section className="box-body" style={{ textAlign: "right" }}>
                    
                    <div className="btn-group">
                        <button type="button" className={`btn btn-xs ${this.state.kindOfPoint === this.KIND_OF_POINT.AUTOMATIC ? 'btn-danger' : null}`} onClick={() => this.handleSelectKindOfPoint(this.KIND_OF_POINT.AUTOMATIC)}>{translate('kpi.evaluation.dashboard.auto_point')}</button>
                        <button type="button" className={`btn btn-xs ${this.state.kindOfPoint === this.KIND_OF_POINT.EMPLOYEE ? 'btn-danger' : null}`} onClick={() => this.handleSelectKindOfPoint(this.KIND_OF_POINT.EMPLOYEE)}>{translate('kpi.evaluation.dashboard.employee_point')}</button>
                        <button type="button" className={`btn btn-xs ${this.state.kindOfPoint === this.KIND_OF_POINT.APPROVED ? 'btn-danger' : null}`} onClick={() => this.handleSelectKindOfPoint(this.KIND_OF_POINT.APPROVED)}>{translate('kpi.evaluation.dashboard.approve_point')}</button>
                    </div>
                    

                    <div ref="chart"></div>
                </section>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { createEmployeeKpiSet } = state;
    return { createEmployeeKpiSet };
}
const actions = {
    getAllEmployeeKpiSetInOrganizationalUnitsByMonth: createKpiSetActions.getAllEmployeeKpiSetInOrganizationalUnitsByMonth
}

const connectedResultsOfAllEmployeeKpiSetChart = connect(mapState, actions)(withTranslate(ResultsOfAllEmployeeKpiSetChart));

export { connectedResultsOfAllEmployeeKpiSetChart as ResultsOfAllEmployeeKpiSetChart };
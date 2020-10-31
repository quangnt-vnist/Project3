import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createUnitKpiActions } from '../../creation/redux/actions';

import { DatePicker } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';

import c3 from 'c3';
import 'c3/c3.css';

class ResultsOfOrganizationalUnitKpiChart extends Component {
    
    constructor(props) {
        super(props);

        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        this.INFO_SEARCH = {
            startDate: currentYear + '-' + 1,
            endDate: (currentMonth > 10) ? ((currentYear + 1) + '-' + (currentMonth - 10)) : (currentYear + '-' + (currentMonth + 2))
        }

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            organizationalUnitId: null,
            startDate: this.INFO_SEARCH.startDate,
            endDate: this.INFO_SEARCH.endDate,
            dataStatus: this.DATA_STATUS.QUERYING
        };
    }

    componentDidMount = () => {
        console.log("\n\n\n\n\n\n",localStorage.getItem("currentRole"))
        this.props.getAllOrganizationalUnitKpiSetByTime(localStorage.getItem("currentRole"), this.props.organizationalUnitId, this.state.startDate, this.state.endDate);

        this.setState(state => {
            return {
                ...state,
                dataStatus: this.DATA_STATUS.QUERYING,
            }
        });
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if(nextProps.organizationalUnitId !== this.state.organizationalUnitId) {
            await this.props.getAllOrganizationalUnitKpiSetByTime(this.state.currentRole, nextProps.organizationalUnitId, this.state.startDate, this.state.endDate);
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                }
            });

            return false;
        }

        if(nextState.startDate !== this.state.startDate || nextState.endDate !== this.state.endDate) {
            await this.props.getAllOrganizationalUnitKpiSetByTime(this.state.currentRole, this.state.organizationalUnitId, nextState.startDate, nextState.endDate);
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                }
            });

            return false;
        }
        
        if(nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if(!nextProps.createKpiUnit.organizationalUnitKpiSets) {
                return false
            }

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                }
            })
            return false;
        } else if(nextState.dataStatus === this.DATA_STATUS.AVAILABLE) {
            this.multiLineChart();
            
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED
                }
            })
        }

        return false;
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.organizationalUnitId !== prevState.organizationalUnitId) {
            return {
                ...prevState,
                organizationalUnitId: nextProps.organizationalUnitId
            }
        } else{
            return null;
        }
    }

    setDataMultiLineChart = () => {
        const { createKpiUnit, translate,organizationalUnit,organizationalUnitId } = this.props;
        const { startDate, endDate, } =this.state;
        let listOrganizationalUnitKpiSetEachYear, automaticPoint, employeePoint, approvedPoint, date, dataMultiLineChart,exportData;

        if(createKpiUnit.organizationalUnitKpiSets) {
            listOrganizationalUnitKpiSetEachYear = createKpiUnit.organizationalUnitKpiSets
        }
        if(listOrganizationalUnitKpiSetEachYear&&organizationalUnit ){
            exportData = this.convertDataToExportData(listOrganizationalUnitKpiSetEachYear,organizationalUnit,startDate,endDate);
            this.handleExportData(exportData);
        }

        if(listOrganizationalUnitKpiSetEachYear) {
            automaticPoint = [ translate('kpi.organizational_unit.dashboard.result_kpi_unit_chart.automatic_point')];
            employeePoint = [ translate('kpi.organizational_unit.dashboard.result_kpi_unit_chart.employee_point')];
            approvedPoint = [ translate('kpi.organizational_unit.dashboard.result_kpi_unit_chart.approved_point')];
            date = ['x'];

            listOrganizationalUnitKpiSetEachYear.map(x => {
                automaticPoint.push(x.automaticPoint);
                employeePoint.push(x.employeePoint);
                approvedPoint.push(x.approvedPoint);

                let newDate = new Date(x.date);
                newDate = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + (newDate.getDate() - 1);
                date.push(newDate);
            });
        }
        
        dataMultiLineChart = [date, automaticPoint, employeePoint, approvedPoint];

        return dataMultiLineChart;
    };

    handleSelectMonthStart = (value) => {
        let month = value.slice(3,7) + '-' + value.slice(0,2);

        this.INFO_SEARCH.startDate = month;
    }

    handleSelectMonthEnd = async (value) => {
        let month;

        if(value.slice(0,2) < 12) {
            month = value.slice(3,7) + '-' + (new Number(value.slice(0,2)) + 1);
        } else {
            month = (new Number(value.slice(3, 7)) + 1) + '-' + '1';
        }

        this.INFO_SEARCH.endDate = month;
    }

    handleSearchData = async () => {
        let startDate = new Date(this.INFO_SEARCH.startDate);
        let endDate = new Date(this.INFO_SEARCH.endDate);
        const {translate} = this.props;
        if (startDate.getTime() >= endDate.getTime()) {
            Swal.fire({
                title: translate('kpi.organizational_unit.dashboard.alert_search.search'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.organizational_unit.dashboard.alert_search.confirm')
            })
        } else {
            await this.setState(state => {
                return {
                    ...state,
                    startDate: this.INFO_SEARCH.startDate,
                    endDate: this.INFO_SEARCH.endDate
                }
            })
        }
    }

    removePreviosMultiLineChart = () => {
        const chart =  this.refs.chart;

        if (chart) {
            while(chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild)
            }
        }
    }

    multiLineChart = () => {
        this.removePreviosMultiLineChart();
        const {translate} = this.props;

        let dataMultiLineChart = this.setDataMultiLineChart();
        
        this.chart = c3.generate({
            bindto: this.refs.chart,       

            padding: {                              
                top: 20,
                bottom: 20,
                right: 20
            },

            data: {                                 
                x: 'x',
                columns: dataMultiLineChart,
                type: 'spline'
            },

            axis : {                               
                x : {
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

            zoom: {                                 
                enabled: false
            }
        });
    }

    handleExportData =(exportData)=>
    {
        const { onDataAvailable } = this.props;
        if (onDataAvailable) {
            onDataAvailable(exportData);
        }
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (data,organizationalUnit, startDate, endDate) => {
        const { organizationalUnitId } =this.state;
        let name;
        if(organizationalUnitId){
            let currentOrganizationalUnit = organizationalUnit.find(item => item.id===organizationalUnitId); 
            name = currentOrganizationalUnit.name; 
        }
        else{
            name = organizationalUnit[0].name;
        }

        let fileName = "Kết quả KPI "+(name?name:name)+ " từ " + (startDate?startDate:"")+" đến "+(endDate?endDate:"");
        if (data) {           
            data = data.map((x, index) => {
               
                let automaticPoint = (x.automaticPoint === null)?"Chưa đánh giá":parseInt(x.automaticPoint);
                let employeePoint = (x.employeePoint === null)?"Chưa đánh giá":parseInt(x.employeePoint);
                let approverPoint =(x.approvedPoint===null)?"Chưa đánh giá":parseInt(x.approvedPoint);           
                let d = new Date(x.date);
                   
                return {
                    automaticPoint: automaticPoint,
                    employeePoint: employeePoint,
                    approverPoint: approverPoint,
                    date : d               
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
                                { key: "date", value: "Thời gian" },
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
        const { translate,createKpiUnit, } = this.props;
        let { startDate, endDate } =this.state;
        let exportData;

        if(createKpiUnit.organizationalUnitKpiSets) {
            let listOrganizationalUnitKpiSetEachYear = createKpiUnit.organizationalUnitKpiSets;            
        }


        let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        let defaultEndDate = [month, year].join('-');
        let defaultStartDate = ['01', year].join('-');

        return(
            <React.Fragment>
                {/* Search data trong một khoảng thời gian */}
                <section className="form-inline">
                    <div className="form-group">
                        <label>{translate('kpi.organizational_unit.dashboard.start_date')}</label>
                        <DatePicker 
                            id="monthStartInResultsOfOrganizationalUnitKpiChart"      
                            dateFormat="month-year"             
                            value={defaultStartDate}                   
                            onChange={this.handleSelectMonthStart}
                            disabled={false}                    
                        />
                    </div>
                </section>
                <section className="form-inline">
                    <div className="form-group">
                        <label>{translate('kpi.organizational_unit.dashboard.end_date')}</label>
                        <DatePicker 
                            id="monthEndInResultsOfOrganizationalUnitKpiChart"      
                            dateFormat="month-year"             
                            value={defaultEndDate}                    
                            onChange={this.handleSelectMonthEnd}
                            disabled={false}                   
                        />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" onClick={this.handleSearchData}>{translate('kpi.organizational_unit.dashboard.search')}</button>
                    </div>
                </section>
                
                <section ref="chart"></section>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { createKpiUnit } = state;
    return { createKpiUnit };
}

const actions = {
    getAllOrganizationalUnitKpiSetByTime: createUnitKpiActions.getAllOrganizationalUnitKpiSetByTime
}

const connectedResultsOfOrganizationalUnitKpiChart = connect(mapState, actions)(withTranslate(ResultsOfOrganizationalUnitKpiChart));
export { connectedResultsOfOrganizationalUnitKpiChart as ResultsOfOrganizationalUnitKpiChart }
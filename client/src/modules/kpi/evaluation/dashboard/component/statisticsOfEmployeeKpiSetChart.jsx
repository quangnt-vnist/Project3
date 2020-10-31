import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { createKpiSetActions } from '../../../employee/creation/redux/actions';
import { UserActions } from "../../../../super-admin/user/redux/actions";

import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';

class StatisticsOfEmployeeKpiSetChart extends Component {

    constructor(props) {
        super(props);

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.state = {
            dataStatus: this.DATA_STATUS.QUERYING,
            exportData : null
        };
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        const { userId, startMonth, endMonth, organizationalUnitIds } = this.state;

        if (nextProps.organizationalUnitIds !== organizationalUnitIds || nextProps.userId !== userId || nextProps.startMonth !== startMonth || nextProps.endMonth !== endMonth) {
            await this.props.getAllEmployeeKpiSetByMonth(nextProps.organizationalUnitIds, nextProps.userId, nextProps.startMonth, nextProps.endMonth);
            
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING
                }
            });
            return false;
        }

        if (nextState.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {
            await this.props.getAllEmployeeKpiSetByMonth(nextProps.organizationalUnitIds, nextProps.userId, nextProps.startMonth, nextProps.endMonth);

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING
                }
            });
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!nextProps.createEmployeeKpiSet.employeeKpiSetByMonth)
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
                    dataStatus: this.DATA_STATUS.FINISHED
                };
            });
        }
        return false;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.userId !== prevState.userId
            || nextProps.startMonth !== prevState.startMonth
            || nextProps.endMonth !== prevState.endMonth
            || nextProps.userName !== prevState.userName
            || nextProps.organizationalUnitIds !== prevState.organizationalUnitIds
        ) {
            return {
                ...prevState,
                userId: nextProps.userId,
                startMonth: nextProps.startMonth,
                endMonth: nextProps.endMonth,
                userName: nextProps.userName,
                organizationalUnitIds: nextProps.organizationalUnitIds
            }
        } else {
            return null;
        }
    }

    filterEmloyeeKpiSetSameOrganizationaUnit = () => {
        const { createEmployeeKpiSet, translate } = this.props;
        const { userName } = this.state;

        let listEmployeeKpiSet, listOrganizationalUnit, listEmployeeKpiSetSameOrganizationalUnit = [], dataChart,exportData;
        
        if (createEmployeeKpiSet) {
            listEmployeeKpiSet = createEmployeeKpiSet.employeeKpiSetByMonth
        }

        if (listEmployeeKpiSet && listEmployeeKpiSet.length !== 0) {
            listOrganizationalUnit = listEmployeeKpiSet.map(kpi => {
                if (kpi.organizationalUnit) {
                    return kpi.organizationalUnit.name;
                }
            })
        }
        listOrganizationalUnit = Array.from(new Set(listOrganizationalUnit));

        if (listOrganizationalUnit && listOrganizationalUnit.length !== 0) {
            listOrganizationalUnit.map((unit, index) => {
                listEmployeeKpiSetSameOrganizationalUnit[index] = listEmployeeKpiSet.filter(kpi => kpi.organizationalUnit && kpi.organizationalUnit.name === unit);

            })
        }
        if (listEmployeeKpiSetSameOrganizationalUnit && userName ) {
            exportData=this.convertDataToExportData(listEmployeeKpiSetSameOrganizationalUnit,userName)
            this.handleExportData(exportData);
        }

        if (listEmployeeKpiSetSameOrganizationalUnit.length !== 0) {
            dataChart = listEmployeeKpiSetSameOrganizationalUnit.map(kpi => {
                return this.setDataMultiLineChart(kpi);
            })
        }
        return dataChart;
    }

    setDataMultiLineChart = (listEmployeeKpiSet) => {
        const { createEmployeeKpiSet, translate } = this.props;
        const { userName } = this.state;

        let employeeName, title;
        let dataMultiLineChart, automaticPoint, employeePoint, approvedPoint, date;

        if (userName) {
            employeeName = userName.split('(');
            employeeName = employeeName[0];
        }
        if (listEmployeeKpiSet[0] && listEmployeeKpiSet[0].organizationalUnit) {
            title = employeeName + ' - ' + listEmployeeKpiSet[0].organizationalUnit.name;
        }

        if (listEmployeeKpiSet) {
            automaticPoint = [translate('kpi.evaluation.dashboard.auto_eva')].concat(listEmployeeKpiSet.map(x => x.automaticPoint));
            employeePoint = [translate('kpi.evaluation.dashboard.employee_eva')].concat(listEmployeeKpiSet.map(x => x.employeePoint));
            approvedPoint = [translate('kpi.evaluation.dashboard.approver_eva')].concat(listEmployeeKpiSet.map(x => x.approvedPoint));
            date = listEmployeeKpiSet.map(x => {
                date = new Date(x.date);
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() - 1);
            })
        }

        dataMultiLineChart = {
            "title": title,
            "data": [['x'].concat(date), automaticPoint, employeePoint, approvedPoint]
        };
        return dataMultiLineChart;
    }

    removePreviousChart() {
        const chart = document.getElementById("chart");

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    multiLineChart = () => {
        this.removePreviousChart();

        const { translate } = this.props;
        let dataMultiLineChart = this.filterEmloyeeKpiSetSameOrganizationaUnit();
        
        if (dataMultiLineChart && dataMultiLineChart.length !== 0) {
            dataMultiLineChart.map(data => {
                let div = document.createElement('div');
                div.id = data.title;
                let section = document.getElementById("chart");
                section.appendChild(div);

                this.chart = c3.generate({
                    bindto: document.getElementById(data.title),
                    title: {
                        show: false,
                        text: data.title,
                        position: 'top-left',   // top-left, top-center and top-right
                        padding: {
                            top: 20,
                            bottom: 5,
                        }
                    },
                    padding: {
                        top: 20,
                        right: 20,
                        left: 20
                    },
                    data: {                                
                        x: 'x',
                        columns: data.data,
                        type: 'spline'
                    },
                    axis: {                               
                        x: {
                            type: 'timeseries',
                            tick: {
                                format: function (x) { return (x.getMonth() + 1) + "-" + x.getFullYear(); }
                            }
                        },
                        y: {
                            max: 100,
                            min: 0,
                            label: {
                                text: translate('kpi.evaluation.employee_evaluation.point'),
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
                    
                })
            })
        } else {
            let div = document.createElement('div');
            div.innerHTML = "Không có dữ liệu";
            let section = document.getElementById("chart");
            section.appendChild(div);
        }
    }

    handleExportData =(exportData)=>
    {
        const { onDataAvailable } = this.props;
        if (onDataAvailable) {
            onDataAvailable(exportData);
        }
        
    }
    
    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (data,name) => {
        let convertedData=[],names = name.split("("),temp;
        let fileName = "Kết quả KPI "+ (names?names[0]:"") +" theo từng tháng ";               
        if (data) {      
            for(let i=0; i< data.length;i++){
                for(let j=0; j< data[i].length;j++)
                {
                   convertedData.push(data[i][j])
                }    
            }
            let d1, d2;
            //Sap xep tap kpi theo thu tu thoi gian
            for(let i=0; i< convertedData.length-1;i++)
            {
                for(let j=i+1;j<convertedData.length;j++)
                {
                    d1= new Date(convertedData[i].date);
                    d2= new Date(convertedData[j].date)
                    if(d1>d2)
                    {
                        temp=convertedData[i];
                        convertedData[i]=convertedData[j];
                        convertedData[j]=temp;
                    }
                }
            }
                         

            for(let i=0; i< convertedData.length;i++){
                let d =new Date(convertedData[i].date);
                convertedData[i]["time"]=d;
                convertedData[i]["STT"]=i+1;
                convertedData[i]["unit"] =convertedData[i].organizationalUnit.name
            }
        }     
            

        let exportData = {
            fileName: fileName,
            dataSheets:[
                {
                    sheetName: "sheet1" ,
                    sheetTitle : fileName,
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "time", value: "Thời gian" },  
                                { key: "unit", value: "Đơn vị " },  
                                { key: "automaticPoint", value: "Điểm KPI tự động" },
                                { key: "employeePoint", value: "Điểm KPI tự đánh giá" },
                                { key: "approvedPoint", value: "Điểm KPI được phê duyệt" }
                            ],
                            data: convertedData
                        }
                    ]
                },
            ]    
                
            
        }
        return exportData;        
       
    }

    render() {
        let { exportData } = this.state;
        
        return (
            <React.Fragment>
                <section id="chart"></section>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { createEmployeeKpiSet } = state;
    return { createEmployeeKpiSet };
}
const actions = {
    getAllEmployeeKpiSetByMonth: createKpiSetActions.getAllEmployeeKpiSetByMonth
}

const connectedStatisticsOfEmployeeKpiSetChart = connect(mapState, actions)(withTranslate(StatisticsOfEmployeeKpiSetChart));
export { connectedStatisticsOfEmployeeKpiSetChart as StatisticsOfEmployeeKpiSetChart };
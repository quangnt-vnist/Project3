import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';

import { forceCheckOrVisible } from '../../../../../common-components/index';

import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class StatisticsOfOrganizationalUnitKpiResultsChart extends Component {

    constructor(props) {
        super(props);

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.KIND_OF_POINT = { AUTOMATIC: 1, EMPLOYEE: 2, APPROVED: 3 };

        this.today = new Date();

        this.state = {
            month: this.today.getFullYear() + '-' + (this.today.getMonth() + 1),
            dataStatus: this.DATA_STATUS.QUERYING,
            kindOfPoint: this.KIND_OF_POINT.AUTOMATIC,
            exportData:null
        };
    }

    componentDidMount = () => {
        this.props.getAllEmployeeKpiSetInOrganizationalUnit(localStorage.getItem("currentRole"), this.props.organizationalUnitId, this.state.month);
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        // Chỉ thực hiện LazyLoading trong lần đầu tiên
        forceCheckOrVisible(true, true);

        if (nextState.kindOfPoint !== this.state.kindOfPoint) {
            await this.setState(state => {
                return {
                    ...state,
                    kindOfPoint: nextState.kindOfPoint,
                };
            });

            this.columnChart();
        }

        if (nextProps.organizationalUnitId !== this.state.organizationalUnitId || nextProps.month !== this.state.month) {
            await this.props.getAllEmployeeKpiSetInOrganizationalUnit(localStorage.getItem("currentRole"), nextProps.organizationalUnitId, nextProps.month);

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                }
            });

            return false;
        }

        if (nextState.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {
            this.props.getAllEmployeeKpiSetInOrganizationalUnit(localStorage.getItem("currentRole"), this.props.organizationalUnitId, this.state.month);

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                };
            });
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!nextProps.dashboardOrganizationalUnitKpi.employeeKpiSets) {
                return false
            }

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE,
                };
            });
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE) {
            this.columnChart();

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                };
            });
        }

        return false;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.organizationalUnitId !== prevState.organizationalUnitId || nextProps.month !== prevState.month) {
            return {
                ...prevState,
                organizationalUnitId: nextProps.organizationalUnitId,
                month: nextProps.month
            }
        } else {
            return null;
        }
    }

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

    filterAndCountEmployeeWithTheSamePoint = (arrayPoint) => {
        let point = Array.from(new Set(arrayPoint));
        let employeeWithTheSamePoints, countEmployeeWithTheSamePoint = [];
        const { translate } = this.props;
        point.sort(function (a, b) {
            return a - b;
        });

        point.map(x => {
            let index = arrayPoint.indexOf(x);
            let theSamePoints = [];

            while (index !== -1) {
                theSamePoints.push(index);
                index = arrayPoint.indexOf(x, index + 1);
            }

            countEmployeeWithTheSamePoint.push(theSamePoints.length);
        })

        point.unshift('x');
        countEmployeeWithTheSamePoint.unshift(translate('kpi.organizational_unit.dashboard.statistic_kpi_unit.count_employee_same_point'));

        employeeWithTheSamePoints = [
            point,
            countEmployeeWithTheSamePoint
        ]

        return employeeWithTheSamePoints;
    }

    countEmployeeWithTheSamePoint =(arrayPoint)=>
    {
        let pointAndEmployeesWithSamePoint={};
        for (let i=0;i<arrayPoint.length;i++){
            let check = Object.keys(pointAndEmployeesWithSamePoint).find(x=>x===arrayPoint[i])
            if(!check){
                pointAndEmployeesWithSamePoint[arrayPoint[i]]=1;
                continue;
            }
            pointAndEmployeesWithSamePoint[arrayPoint[i]]++ ;
        }
        return pointAndEmployeesWithSamePoint;
    }

    setDataColumnChart = () => {
        const { dashboardOrganizationalUnitKpi, translate,month, organizationalUnit,organizationalUnitId } = this.props;
        let listEmployeeKpiSet, automaticPoint = [], employeePoint = [], approvedPoint = [] ;
        let employeeWithTheSamePoints, textLabel;
        if (dashboardOrganizationalUnitKpi.employeeKpiSets) {
            listEmployeeKpiSet = dashboardOrganizationalUnitKpi.employeeKpiSets
        }

        if (listEmployeeKpiSet) {
            listEmployeeKpiSet.map(kpi => {
                automaticPoint.push(kpi.automaticPoint);
                employeePoint.push(kpi.employeePoint);
                approvedPoint.push(kpi.approvedPoint);
            })
        }

        if (this.state.kindOfPoint === this.KIND_OF_POINT.AUTOMATIC) {
            employeeWithTheSamePoints = this.filterAndCountEmployeeWithTheSamePoint(automaticPoint);
            textLabel = translate('kpi.organizational_unit.dashboard.statistic_kpi_unit.automatic_point');
        } else if (this.state.kindOfPoint === this.KIND_OF_POINT.EMPLOYEE) {
            employeeWithTheSamePoints = this.filterAndCountEmployeeWithTheSamePoint(employeePoint);
            textLabel = translate('kpi.organizational_unit.dashboard.statistic_kpi_unit.employee_point');
        } else if (this.state.kindOfPoint === this.KIND_OF_POINT.APPROVED) {
            employeeWithTheSamePoints = this.filterAndCountEmployeeWithTheSamePoint(approvedPoint);
            textLabel = translate('kpi.organizational_unit.dashboard.statistic_kpi_unit.approved_point');
        }
        
        //phan xu ly cua exportData
        let countAutomaticPoint =this.countEmployeeWithTheSamePoint(automaticPoint);
        let countEmployeePoint =this.countEmployeeWithTheSamePoint(employeePoint);
        let countApprovedPoint =this.countEmployeeWithTheSamePoint(approvedPoint);

        if(listEmployeeKpiSet&&month&&organizationalUnit){
            let exportData =this.convertDataToExportData(listEmployeeKpiSet,organizationalUnit,organizationalUnitId,month,countAutomaticPoint,countEmployeePoint,countApprovedPoint)
            this.handleExportData(exportData);
        }
        //

        return {
            'employeeWithTheSamePoints': employeeWithTheSamePoints,
            'textLabel': textLabel
        };
    }

    removePreviosChart = () => {
        const chart = this.refs.chart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    columnChart = () => {
        this.removePreviosChart();

        let dataPoints, dataChart, textLabel;

        dataPoints = this.setDataColumnChart();
        dataChart = dataPoints.employeeWithTheSamePoints;
        textLabel = dataPoints.textLabel;

        this.chart = c3.generate({
            bindto: this.refs.chart,

            data: {
                x: 'x',
                columns: dataChart,
                type: 'bar'
            },

            bar: {
                width: {
                    ratio: 0.1
                }
            },

            axis: {
                x: {
                    label: {
                        text: 'Điểm',
                        position: 'outer-center',
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                },
                y: {
                    label: {
                        text: 'Số người cùng điểm',
                        position: 'outer-middle',
                    },
                    padding: {
                        right: 10,
                        left: 10
                    },
                    tick: {
                        format: function(d) {
                            if (d - parseInt(d) === 0) {
                                return d;
                            } else {
                                return "";
                            }
                        }
                    }
                }
            },

            legend: {
                show: false
            }
        })
    }

    handleExportData =(exportData)=>
    {
        const { onDataAvailable } = this.props;
        if (onDataAvailable) {
            onDataAvailable(exportData);
        }
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (data,organizationalUnit,organizationalUnitId, month,countAutomaticPoint,countEmployeePoint,countApprovedPoint) => {
        let name;
        if(organizationalUnitId){
            let currentOrganizationalUnit = organizationalUnit.find(item => item.id===organizationalUnitId); 
            name = currentOrganizationalUnit.name; 
        }
        else{
            name = organizationalUnit[0].name;
        }

        let fileName = "Thống kê kết quả KPI " +(name?name:"")+" "+ ( month?("tháng "+month):"" );
        if (data) {           
            data = data.map((x, index) => {
               
                let automaticPoint = (x.automaticPoint === null)?"Chưa đánh giá":parseInt(x.automaticPoint);
                let numberEmployeesWithSameAutomaticPoint = countAutomaticPoint[automaticPoint];
                let employeePoint = (x.employeePoint === null)?"Chưa đánh giá":parseInt(x.employeePoint);
                let numberEmployeesWithSameEmployeePoint = countEmployeePoint[employeePoint];
                let approverPoint =(x.approvedPoint===null)?"Chưa đánh giá":parseInt(x.approvedPoint);
                let numberEmployeesWithSameApprovedPoint = countApprovedPoint[approverPoint];           

                return {
                    automaticPoint: automaticPoint,
                    numberEmployeesWithSameAutomaticPoint:numberEmployeesWithSameAutomaticPoint,
                    employeePoint: employeePoint,
                    numberEmployeesWithSameEmployeePoint:numberEmployeesWithSameEmployeePoint,
                    approverPoint: approverPoint,        
                    numberEmployeesWithSameApprovedPoint:numberEmployeesWithSameApprovedPoint         
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
                                { key: "automaticPoint", value: "Điểm KPI tự động" },                                
                                { key: "employeePoint", value: "Điểm KPI tự đánh giá" },
                                { key: "approverPoint", value: "Điểm KPI được phê duyệt" },
                                { key: "numberEmployeesWithSameAutomaticPoint", value: "Số nhân viên có cùng điểm KPI tự động " },
                                { key: "numberEmployeesWithSameEmployeePoint", value: "Số nhân viên có cùng điểm KPI tự đánh giá " },
                                { key: "numberEmployeesWithSameApprovedPoint", value: "Số nhân viên có cùng điểm KPI được phê duyệt " },
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
        const { dashboardOrganizationalUnitKpi, translate, month } = this.props;
        let { exportData } =this.state;
        let listEmployeeKpiSet, employeeKpiSetsLoading;

        if (dashboardOrganizationalUnitKpi.employeeKpiSets) {
            listEmployeeKpiSet = dashboardOrganizationalUnitKpi.employeeKpiSets;
            employeeKpiSetsLoading = dashboardOrganizationalUnitKpi.employeeKpiSetsLoading
        }

        return (            
            <React.Fragment>           
                {listEmployeeKpiSet && (listEmployeeKpiSet.length !== 0) ?
                    <section className="box-body" style={{ textAlign: "right" }}> 
                        <section className="btn-group">
                            <button type="button" className={`btn btn-xs ${this.state.kindOfPoint === this.KIND_OF_POINT.AUTOMATIC ? 'btn-danger' : null}`} onClick={() => this.handleSelectKindOfPoint(this.KIND_OF_POINT.AUTOMATIC)}>Automatic Point</button>
                            <button type="button" className={`btn btn-xs ${this.state.kindOfPoint === this.KIND_OF_POINT.EMPLOYEE ? 'btn-danger' : null}`} onClick={() => this.handleSelectKindOfPoint(this.KIND_OF_POINT.EMPLOYEE)}>Employee Point</button>
                            <button type="button" className={`btn btn-xs ${this.state.kindOfPoint === this.KIND_OF_POINT.APPROVED ? 'btn-danger' : null}`} onClick={() => this.handleSelectKindOfPoint(this.KIND_OF_POINT.APPROVED)}>Approved Point</button>
                        </section>
                                        
                        <section ref="chart"></section>
                    </section>
                    : employeeKpiSetsLoading && <section>{translate('kpi.organizational_unit.dashboard.no_data')}</section>
                 
                }
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { dashboardOrganizationalUnitKpi } = state;
    return { dashboardOrganizationalUnitKpi }
}
const actions = {
    getAllEmployeeKpiSetInOrganizationalUnit: dashboardOrganizationalUnitKpiActions.getAllEmployeeKpiSetInOrganizationalUnit
}

const connectedStatisticsOfOrganizationalUnitKpiResultsChart = connect(mapState, actions)(withTranslate(StatisticsOfOrganizationalUnitKpiResultsChart));
export { connectedStatisticsOfOrganizationalUnitKpiResultsChart as StatisticsOfOrganizationalUnitKpiResultsChart }
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';
import { createUnitKpiActions } from '../../creation/redux/actions';

import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";


class TrendsInOrganizationalUnitKpiChart extends Component {

    constructor(props) {
        super(props);

        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};
        
        this.state = {
            currentRole: null,
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE
        };
    }

    componentDidMount = () => {
        this.props.getCurrentKPIUnit(localStorage.getItem("currentRole"), this.props.organizationalUnitId, this.props.month);
        this.props.getAllEmployeeKpiInOrganizationalUnit(localStorage.getItem("currentRole"), this.props.organizationalUnitId, this.props.month);
        this.props.getAllTaskOfOrganizationalUnit(localStorage.getItem("currentRole"), this.props.organizationalUnitId, this.props.month);

        this.setState(state => {
            return {
                ...state,
                currentRole: localStorage.getItem("currentRole"),
                dataStatus: this.DATA_STATUS.QUERYING
            }
        })
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (this.state.currentRole !== localStorage.getItem("currentRole")) {
            await this.props.getCurrentKPIUnit(localStorage.getItem("currentRole"), this.props.organizationalUnitId, this.props.month);
            await this.props.getAllEmployeeKpiInOrganizationalUnit(localStorage.getItem("currentRole"), this.props.organizationalUnitId, this.props.month);
            await this.props.getAllTaskOfOrganizationalUnit(localStorage.getItem("currentRole"), this.props.organizationalUnitId, this.props.month);
            
            this.setState(state => {
                return {
                    ...state,
                    currentRole: localStorage.getItem("currentRole"),
                    dataStatus: this.DATA_STATUS.QUERYING
                }
            });

            return false;
        }

        if (nextProps.organizationalUnitId !== this.state.organizationalUnitId || nextProps.month !== this.state.month) {
            await this.props.getCurrentKPIUnit(this.state.currentRole, nextProps.organizationalUnitId, nextProps.month);
            await this.props.getAllEmployeeKpiInOrganizationalUnit(this.state.currentRole, nextProps.organizationalUnitId, nextProps.month);
            await this.props.getAllTaskOfOrganizationalUnit(this.state.currentRole, nextProps.organizationalUnitId, nextProps.month)

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                }
            });

            return false;
        }

        if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!nextProps.createKpiUnit.currentKPI) {
                return false            
            }

            if(!nextProps.dashboardOrganizationalUnitKpi.employeeKpis) {
                return false           
            }

            if (!nextProps.dashboardOrganizationalUnitKpi.tasksOfOrganizationalUnit) {
                return false           
            }
            
            this.setState(state =>{
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE,
                };
            });
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE){
            this.barChart();

            this.setState(state =>{
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                };
            });
        } 
        
        if (!nextProps.createKpiUnit.currentKPI && this.state.dataStatus === this.DATA_STATUS.FINISHED) {
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                    willUpdate: true
                }
            });

            return false;
        }

        return false;
    }

    static getDerivedStateFromProps(nextProps, prevState){
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

    getArrayListTaskSameOrganizationUnitKpi = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi } = this.props;
        let listOrganizationalUnitKpi, listChildTarget, listTask, arrayListTaskSameOrganizationUnitKpi;

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis;
        }
        if (dashboardOrganizationalUnitKpi.employeeKpis !== []) {
            listChildTarget = dashboardOrganizationalUnitKpi.employeeKpis;
        }
        if (dashboardOrganizationalUnitKpi.tasksOfOrganizationalUnit !== []) {
            listTask = dashboardOrganizationalUnitKpi.tasksOfOrganizationalUnit;
        }

        if(listOrganizationalUnitKpi && listTask && listTask.length !== 0) {
            arrayListTaskSameOrganizationUnitKpi = listOrganizationalUnitKpi.map(parent => {
                let temporaryArrayListTaskSameOrganizationUnitKpi = [];
                if (listChildTarget !== [] && listChildTarget) {
                    let temporary;

                    temporary = listChildTarget.filter(childTarget => childTarget._id === parent.name);
                    if (temporary.length !== 0) {
                        temporary[0].employeeKpi.map(employeeKpi => {
                            if(listTask.length !== 0){
                                let list = listTask.filter(item => {
                                    let kpi, length = 0;

                                    item.evaluations.results.map(item => {
                                        kpi = item.kpis.filter(kpi => kpi === employeeKpi._id);
                                        length = length + kpi.length;
                                    });
                                    return length !== 0 && length !== undefined;
                                })
                                temporaryArrayListTaskSameOrganizationUnitKpi = temporaryArrayListTaskSameOrganizationUnitKpi.concat(list);
                            }
                        })
                    }
                }
                temporaryArrayListTaskSameOrganizationUnitKpi = Array.from(new Set(temporaryArrayListTaskSameOrganizationUnitKpi));
                
                return temporaryArrayListTaskSameOrganizationUnitKpi;
            })
        }

        return arrayListTaskSameOrganizationUnitKpi;
    }

    setExecutionTimeData = () => {
        const { createKpiUnit, translate } = this.props;

        let listOrganizationalUnitKpi, arrayListTaskSameOrganizationUnitKpi;
        let executionTimes = {};
        let now = new Date();
        let currentYear = now.getFullYear();
        let currentMonth = now.getMonth();
        let currentDate = now.getDate();
        let currentTime = new Date(currentYear, currentMonth, currentDate);

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis;
        }

        arrayListTaskSameOrganizationUnitKpi = this.getArrayListTaskSameOrganizationUnitKpi();

        if (listOrganizationalUnitKpi && arrayListTaskSameOrganizationUnitKpi) {
            listOrganizationalUnitKpi.map(parent => {
                let key = listOrganizationalUnitKpi.indexOf(parent);
                let temporary = {};
                let executionTime = 0;

                arrayListTaskSameOrganizationUnitKpi[key].map(x => {
                    let date1 = new Date(x.evaluations.date);
                    let date2 = new Date(x.startDate);
                    if(x.evaluations.date) {
                        executionTime = executionTime + (date1.getTime() - date2.getTime())/(3600*24*1000)
                    } else {
                        executionTime = executionTime + (currentTime.getTime() - date2.getTime())/(3600*24*1000)
                    }
                })

                if (arrayListTaskSameOrganizationUnitKpi.length !== 0 && listOrganizationalUnitKpi) {
                    executionTime = executionTime/arrayListTaskSameOrganizationUnitKpi.length;
                }
                temporary[parent.name] = executionTime;

                executionTimes = Object.assign(executionTimes, temporary);
            })
        }

        executionTimes = Object.assign(
            { name: translate('kpi.organizational_unit.dashboard.trend_chart.execution_time') },
            executionTimes
        )

        return executionTimes;
    }

    setNumberOfTaskData = () => {
        const { createKpiUnit, translate } = this.props;

        let listOrganizationalUnitKpi, arrayListTaskSameOrganizationUnitKpi;
        let numberOfTasks = {};

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }

        arrayListTaskSameOrganizationUnitKpi = this.getArrayListTaskSameOrganizationUnitKpi();

        if (listOrganizationalUnitKpi && arrayListTaskSameOrganizationUnitKpi) {
            listOrganizationalUnitKpi.map(parent => {
                let key = listOrganizationalUnitKpi.indexOf(parent);
                let temporary = {};
                let numberOfTask;

                numberOfTask = arrayListTaskSameOrganizationUnitKpi[key].length;
                temporary[parent.name] = numberOfTask;
                numberOfTasks = Object.assign(numberOfTasks, temporary);
            })
        }

        numberOfTasks = Object.assign(
            { name: translate('kpi.organizational_unit.dashboard.trend_chart.amount_tasks') },
            numberOfTasks
        )

        return numberOfTasks; 
    }

    setNumberOfParticipantData = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi, translate } = this.props;

        let listOrganizationalUnitKpi, listChildTarget;
        let numberOfParticipants = {}; 
        let arrayListTaskSameOrganizationUnitKpi = this.getArrayListTaskSameOrganizationUnitKpi();

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        if (dashboardOrganizationalUnitKpi.employeeKpis !== []) {
            listChildTarget = dashboardOrganizationalUnitKpi.employeeKpis
        }

        if (!listOrganizationalUnitKpi && listChildTarget){
            numberOfParticipants = {}
        } else {
            listOrganizationalUnitKpi.map(parent => {
                let key = listOrganizationalUnitKpi.indexOf(parent);
                let creators1, creators2, numberOfParticipant=0;
                let temporary = {};

                if (listChildTarget) {
                    creators1 = listChildTarget.filter(item => item._id === parent.name);

                    if (creators1.length !== 0) {
                        creators1 = creators1[0].employeeKpi.map(x => {
                            if (x.creator[0]) {
                                return x.creator[0];
                            }
                        })
                    }
                }
                
               
                if (arrayListTaskSameOrganizationUnitKpi) {
                    creators2 = arrayListTaskSameOrganizationUnitKpi[key].map(x => {
                        return x.accountableEmployees.concat(x.consultedEmployees).concat(x.informedEmployees).concat(x.responsibleEmployees);
                    })
                    creators2.forEach(x => creators1 = creators1.concat(x));
                }

                creators1 = Array.from(new Set(creators1));
                creators1.map(x => {
                    if (x) {
                        numberOfParticipant++;
                    }
                });
                temporary[parent.name] = numberOfParticipant;
                numberOfParticipants = Object.assign(numberOfParticipants, temporary);
            })
        }

        numberOfParticipants = Object.assign(
            { name: translate('kpi.organizational_unit.dashboard.trend_chart.participants') },
            numberOfParticipants
        )

        return numberOfParticipants;
    }

    setNumberOfEmployeeKpiData = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi, translate } = this.props;

        let listOrganizationalUnitKpi, listChildTarget;
        let numberOfEmployeeKpis = {};

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        if (dashboardOrganizationalUnitKpi.employeeKpis !== []) {
            listChildTarget = dashboardOrganizationalUnitKpi.employeeKpis
        }
        if(!listOrganizationalUnitKpi && listChildTarget){
            numberOfEmployeeKpis = {}
        } else {
            listOrganizationalUnitKpi.map(parent => {
                let numberOfEmployeeKpi = 0;
                let temporary = {};
                if(listChildTarget){
                    numberOfEmployeeKpi = listChildTarget.filter(item => item._id === parent.name).map(item => {
                        if (item.employeeKpi[0].creator.length !== 0) {
                            return item.employeeKpi.length;
                        }
                    })
                }

                temporary[parent.name] = numberOfEmployeeKpi;
                numberOfEmployeeKpis = Object.assign(numberOfEmployeeKpis, temporary);
            })
        }

        numberOfEmployeeKpis = Object.assign(
            { name: translate('kpi.organizational_unit.dashboard.trend_chart.amount_employee_kpi') },
            numberOfEmployeeKpis
        )

        return numberOfEmployeeKpis;
    }
    
    // Thiết lập data trọng số của từng Kpi đơn vị
    setWeightData = () => {
        const { createKpiUnit, translate } = this.props;

        let listOrganizationalUnitKpi;
        let weight = {};

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }

        if(listOrganizationalUnitKpi) {
            listOrganizationalUnitKpi.map(parent => {
                let temporary = {};

                temporary[parent.name] = parent.weight;
                weight = Object.assign(weight, temporary)
            })
        }

        weight = Object.assign(
            { name: translate('kpi.organizational_unit.dashboard.trend_chart.weight') },
            weight
        )

        return weight;
    }

    removePreviousBarChart = () => {
        const chart = this.refs.chart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        } 
    } 

    barChart = () => {
        this.removePreviousBarChart();

        const { createKpiUnit } = this.props;
        let numberOfParticipants, numberOfEmployeeKpis, executionTimes, numberOfTasks, weight, data, dataChart, listOrganizationalUnitKpi, titleX;
           
        if(createKpiUnit.currentKPI) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis;
        }

        executionTimes = this.setExecutionTimeData();
        numberOfEmployeeKpis = this.setNumberOfEmployeeKpiData();
        numberOfParticipants = this.setNumberOfParticipantData();
        numberOfTasks = this.setNumberOfTaskData();
        weight = this.setWeightData();
        
        data = [               
            executionTimes,
            numberOfParticipants,
            numberOfTasks,
            numberOfEmployeeKpis,
            weight
        ]
        
        if(data) {
            titleX = data.map(x => x.name);
            titleX = ['x'].concat(titleX);
        }

        if(listOrganizationalUnitKpi) {
            dataChart = listOrganizationalUnitKpi.map(kpis => {
                let temporary;
                temporary = data.map(x => {
                    return x[kpis.name] ? x[kpis.name] : 0;
                })
                
                temporary = [kpis.name].concat(temporary);

                return temporary;
            })
        }

        dataChart.unshift(titleX);
        this.chart = c3.generate({
            bindto: this.refs.chart,                

            size: {                                 
                height: 350                     
            },

            padding: {                          
                top: 20,
                left: 100,
                right: 20,
                bottom: 20
            },

            data: {                             
                x: 'x',
                columns: dataChart,
                type: 'bar',
                groups: [
                    listOrganizationalUnitKpi.map(x => x.name)
                ],
                stack: {
                    normalize: true
                }
            },

            bar: {                              
                width: {
                    ratio: 0.8
                }
            },

            axis: {                            
                rotated: true,
                x: {
                    type: 'category',
                    tick: {
                        outer: true
                    }
                }
            }
        });
    }
    
    render() {
        const { createKpiUnit, translate } = this.props;
        let currentKpi, organizationalUnitKpiLoading;

        if(createKpiUnit) {
            currentKpi = createKpiUnit.currentKPI;
            organizationalUnitKpiLoading = createKpiUnit.organizationalUnitKpiLoading
        }

        return (
            <React.Fragment>
                {currentKpi ?
                    <section ref="chart"></section>
                    : organizationalUnitKpiLoading && <section>{translate('kpi.organizational_unit.dashboard.no_data')}</section>
                }
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { createKpiUnit, dashboardOrganizationalUnitKpi } = state;
    return { createKpiUnit, dashboardOrganizationalUnitKpi };
}
const actions = {
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    getAllEmployeeKpiInOrganizationalUnit: dashboardOrganizationalUnitKpiActions.getAllEmployeeKpiInOrganizationalUnit,
    getAllTaskOfOrganizationalUnit: dashboardOrganizationalUnitKpiActions.getAllTaskOfOrganizationalUnit
}

const connectedTrendsInOrganizationalUnitKpiChart = connect(mapState, actions)(withTranslate(TrendsInOrganizationalUnitKpiChart));
export { connectedTrendsInOrganizationalUnitKpiChart as TrendsInOrganizationalUnitKpiChart };
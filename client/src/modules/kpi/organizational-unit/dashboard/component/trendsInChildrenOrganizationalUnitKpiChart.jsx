import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';
import { createUnitKpiActions } from '../../creation/redux/actions';

import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class TrendsInChildrenOrganizationalUnitKpiChart extends Component {

    constructor(props) {
        super(props);
        
        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};
        
        this.state = {
            currentRole: null,
            dataStatus: this.DATA_STATUS.QUERYING,
        };
    }

    componentDidMount = async () => {
        this.props.getCurrentKPIUnit(localStorage.getItem("currentRole"), this.props.organizationalUnitId, this.props.month);
        this.props.getAllEmployeeKpiInChildrenOrganizationalUnit(localStorage.getItem("currentRole"), this.props.month, this.props.organizationalUnitId);
        this.props.getAllTaskOfChildrenOrganizationalUnit(localStorage.getItem("currentRole"), this.props.month, this.props.organizationalUnitId);

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
            await this.props.getAllEmployeeKpiInChildrenOrganizationalUnit(localStorage.getItem("currentRole"), this.props.month, this.props.organizationalUnitId);
            await this.props.getAllTaskOfChildrenOrganizationalUnit(localStorage.getItem("currentRole"), this.props.month, this.props.organizationalUnitId);

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                }
            });

            return false;
        }

        if (nextProps.organizationalUnitId !== this.state.organizationalUnitId || nextProps.month !== this.state.month) {
            await this.props.getCurrentKPIUnit(this.state.currentRole, nextProps.organizationalUnitId, nextProps.month);
            await this.props.getAllEmployeeKpiInChildrenOrganizationalUnit(this.state.currentRole, nextState.month, nextProps.organizationalUnitId);
            await this.props.getAllTaskOfChildrenOrganizationalUnit(this.state.currentRole, nextProps.month, nextProps.organizationalUnitId)

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                }
            });

            return false;
        }

        if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if(!nextProps.createKpiUnit.currentKPI) {
                return false            
            }

            if(!nextProps.dashboardOrganizationalUnitKpi.employeeKpisOfChildUnit) {
                return false           
            }

            if (!nextProps.dashboardOrganizationalUnitKpi.tasksOfChildrenOrganizationalUnit) {
                return false           
            }
            
            this.setState(state =>{
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE,
                };
            });

            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE) {
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

    /** Hàm tiện ích lấy các KPI con có cùng parent */
    getArrayListChildTargetSameParent = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi, translate } = this.props;

        let listOrganizationalUnitKpi, listChildTarget, arrayListChildTargetSameParent;

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        if (dashboardOrganizationalUnitKpi.employeeKpisOfChildUnit !== []) {
            listChildTarget = dashboardOrganizationalUnitKpi.employeeKpisOfChildUnit
        }

        if (listOrganizationalUnitKpi && listChildTarget) {
            arrayListChildTargetSameParent = listOrganizationalUnitKpi.map(parent => {

                let index = 0;
                let maxDeg = listChildTarget[listChildTarget.length - 1][0].deg;

                let listChildTargetSameParent = [];

                while (index <= maxDeg) {
                    
                    let listChildTargetSameDeg = listChildTarget.filter(item => item[0].deg === index);

                    if (listChildTargetSameDeg) {
                        if (index === 0) {
                            listChildTargetSameParent[index] = listChildTargetSameDeg.map(item => { return item.filter(kpi => kpi._id === parent.name) });
                        } else {
                            let parentNameOfUnitKpi = listChildTargetSameParent[index - 1].map(kpi => {
                                if (kpi[0]) {
                                    return kpi[0]._id;
                                }
                            })
                            
                            listChildTargetSameParent[index] = listChildTargetSameDeg.map(item => {
                                return item.filter(kpi => {
                                    if (kpi.employeeKpi && kpi.employeeKpi[0].parentNameOfUnitKpi[0]) {
                                        return parentNameOfUnitKpi.includes(kpi.employeeKpi[0].parentNameOfUnitKpi[0]);
                                    }
                                })
                            });
                        }
                    }

                    index++;
                };

                return listChildTargetSameParent;
            })
        }

        return arrayListChildTargetSameParent;
    }

    /** Hàm tiện ích lấy các công việc cùng KPI */
    getArrayListTaskSameOrganizationUnitKpi = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi } = this.props;

        let listOrganizationalUnitKpi, listTask, arrayListTaskSameOrganizationUnitKpi;
        let arrayListChildTargetSameParent = this.getArrayListChildTargetSameParent();

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis;
        }
        if (dashboardOrganizationalUnitKpi.tasksOfChildrenOrganizationalUnit !== []) {
            listTask = dashboardOrganizationalUnitKpi.tasksOfChildrenOrganizationalUnit;
        }

        if(listOrganizationalUnitKpi && listTask) {
            arrayListTaskSameOrganizationUnitKpi = listOrganizationalUnitKpi.map(parent => {
                let temporaryArrayListTaskSameOrganizationUnitKpi = [];

                if (arrayListChildTargetSameParent !== [] && arrayListChildTargetSameParent && listTask) {
                    let listChildTargetSameParent;

                    if (arrayListChildTargetSameParent) {
                        listChildTargetSameParent = arrayListChildTargetSameParent.filter(item => {
                            if (item[0][0][0]) {
                                return item[0][0][0]._id === parent.name;
                            }
                        });
                    }

                    if (listChildTargetSameParent.length !== 0) {
                        listChildTargetSameParent = [...listChildTargetSameParent[0]];

                        listChildTargetSameParent.map(deg => {
                            if (deg.length !== 0) {
                                deg.map(unit => {
                                    if (unit.length !== 0) {
                                        unit.map(kpi => {
                                            if (kpi.employeeKpi[0].creator.length !== 0) {
                                                kpi.employeeKpi.map(employeeKpi => {
                                                    if (listTask) {
                                                        listTask.map(task => {
                                                            let list = task.filter(item1 => {
                                                                let kpi, length = 0;

                                                                if (item1.evaluations) {
                                                                    item1.evaluations.results.map(item2 => {
                                                                        kpi = item2.kpis.filter(kpis => kpis === employeeKpi._id);
                                                                        length = length + kpi.length;
                                                                    });
                                                                    return length !== 0 && length !== undefined;
                                                                } else {
                                                                    return false
                                                                }
                                                            })

                                                            temporaryArrayListTaskSameOrganizationUnitKpi = temporaryArrayListTaskSameOrganizationUnitKpi.concat(list);
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
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

        let listOrganizationalUnitKpi;
        let numberOfTasks = {};
        let arrayListTaskSameOrganizationUnitKpi = this.getArrayListTaskSameOrganizationUnitKpi();

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }

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
        const { createKpiUnit, translate } = this.props;

        let listOrganizationalUnitKpi;
        let numberOfParticipants = {}; 
        let arrayListTaskSameOrganizationUnitKpi = this.getArrayListTaskSameOrganizationUnitKpi();
        let arrayListChildTargetSameParent = this.getArrayListChildTargetSameParent();

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }

        if (!listOrganizationalUnitKpi && arrayListChildTargetSameParent){
            numberOfParticipants = {}
        } else {
            if (listOrganizationalUnitKpi) {
                listOrganizationalUnitKpi.map(parent => {
                    let key = listOrganizationalUnitKpi.indexOf(parent);
                    let creators1, creators2, numberOfParticipant;
                    let temporary = {};

                    if (arrayListChildTargetSameParent.length !== 0) {

                        arrayListChildTargetSameParent[key].map(deg => {
                            if (deg.length !== 0) {
                                deg.map(unit => {
                                    if (unit.length !== 0) {
                                        unit.forEach(kpi => {
                                            if (kpi.employeeKpi[0].creator.length !== 0) {
                                                creators1 = kpi.employeeKpi.map(employeeKpi => {
                                                    if (employeeKpi.creator[0]) {
                                                        return employeeKpi.creator[0];
                                                    }
                                                });
                                            }
                                        });
                                    }
                                })
                                    
                            }
                        })
                    }
                    
                    if (arrayListTaskSameOrganizationUnitKpi) {
                        creators2 = arrayListTaskSameOrganizationUnitKpi[key].map(x => {
                            return x.accountableEmployees.concat(x.consultedEmployees).concat(x.informedEmployees).concat(x.responsibleEmployees);
                        })
                        creators2.forEach(x => creators1 = creators1.concat(x));
                    }

                    creators1 = Array.from(new Set(creators1));
                    numberOfParticipant = creators1.length;
                    temporary[parent.name] = numberOfParticipant;
                    numberOfParticipants = Object.assign(numberOfParticipants, temporary);
                })
            }
        }

        numberOfParticipants = Object.assign(
            { name: translate('kpi.organizational_unit.dashboard.trend_chart.participants') },
            numberOfParticipants
        )

        return numberOfParticipants;
    }

    setNumberOfEmployeeKpiData = () => {
        const { createKpiUnit, translate } = this.props;

        let listOrganizationalUnitKpi;
        let numberOfEmployeeKpis = {};
        let arrayListChildTargetSameParent = this.getArrayListChildTargetSameParent();
        
        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }

        if (!listOrganizationalUnitKpi) {
            numberOfEmployeeKpis = {}
        } else {
            listOrganizationalUnitKpi.map(parent => {

                let numberOfEmployeeKpi = 0, temporary = {};
                let listChildTargetSameParent;

                if (arrayListChildTargetSameParent) {
                    listChildTargetSameParent = arrayListChildTargetSameParent.filter(item => {
                        if (item[0][0][0]) {
                            return item[0][0][0]._id === parent.name;
                        }
                    })
                }
                
                if (listChildTargetSameParent.length !== 0) {
                    listChildTargetSameParent = [...listChildTargetSameParent[0]];

                    listChildTargetSameParent.map(deg => {
                        if (deg.length !== 0) {
                            deg.map(unit => {
                                if (unit.length !== 0) {
                                        unit.forEach(kpi => {
                                        if (kpi.employeeKpi[0].creator.length !== 0) {
                                            numberOfEmployeeKpi = numberOfEmployeeKpi + kpi.employeeKpi.length;
                                        }
                                    });
                                }
                            })
                                
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

        let numberOfParticipants, numberOfEmployeeKpis, executionTimes, numberOfTasks, weight, listOrganizationalUnitKpi;
        let data, dataChart, titleX;
           
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

        if (dataChart) {
            dataChart.unshift(titleX);
        }

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
    getAllEmployeeKpiInChildrenOrganizationalUnit: dashboardOrganizationalUnitKpiActions.getAllEmployeeKpiInChildrenOrganizationalUnit,
    getAllTaskOfChildrenOrganizationalUnit: dashboardOrganizationalUnitKpiActions.getAllTaskOfChildrenOrganizationalUnit
}

const connectedTrendsInChildrenOrganizationalUnitKpiChart = connect(mapState, actions)(withTranslate(TrendsInChildrenOrganizationalUnitKpiChart));
export { connectedTrendsInChildrenOrganizationalUnitKpiChart as TrendsInChildrenOrganizationalUnitKpiChart };
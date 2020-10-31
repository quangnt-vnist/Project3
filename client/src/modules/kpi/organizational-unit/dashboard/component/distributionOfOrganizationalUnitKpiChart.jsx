import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createUnitKpiActions } from '../../creation/redux/actions';

import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";
import { ToolTip } from '../../../../../common-components';

class DistributionOfOrganizationalUnitKpiChart extends Component {
    constructor(props) {
        super(props);

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.state = {
            currentRole: null,
            dataStatus: this.DATA_STATUS.QUERYING,

            willUpdate: false
        };
    }

    componentDidMount = () => {
        this.props.getCurrentKPIUnit(localStorage.getItem("currentRole"), this.props.organizationalUnitId, this.props.month);

        this.setState(state => {
            return {
                ...state,
                currentRole: localStorage.getItem("currentRole"),
                dataStatus: this.DATA_STATUS.QUERYING,
                willUpdate: true
            }
        })
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (this.state.currentRole !== localStorage.getItem("currentRole")) {
            await this.props.getCurrentKPIUnit(localStorage.getItem("currentRole"), this.props.organizationalUnitId, this.props.month);

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                    willUpdate: true
                }
            });

            return false;
        }

        if (nextProps.organizationalUnitId !== this.state.organizationalUnitId || nextProps.month !== this.state.month) {
            await this.props.getCurrentKPIUnit(this.state.currentRole, nextProps.organizationalUnitId, nextProps.month);
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                    willUpdate: true
                }
            });

            return false;
        }

        if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!nextProps.createKpiUnit.currentKPI) {
                return false;
            }
                
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE,
                };
            });
            
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE && nextState.willUpdate) {
            this.pieChart();

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                    willUpdate: false
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

    setDataPieChart = () => {
        const { createKpiUnit } = this.props;
        let listOrganizationalUnitKpi, dataPieChart;

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        if (listOrganizationalUnitKpi) {
            dataPieChart = listOrganizationalUnitKpi.map(x => {
                return [x.name, x.weight]
            })
        }
        return dataPieChart;
    }

    removePreviousChart() {
        const chart = this.refs.chart;

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        } 
    }

    pieChart = () => {
        this.removePreviousChart();

        let dataPieChart;
        dataPieChart = this.setDataPieChart();

        this.chart = c3.generate({
            bindto: this.refs.chart,

            data: {
                columns: dataPieChart,
                type: 'pie',
            },

            tooltip: {
                format: {
                    value: function (value) {
                        return value;
                    }
                }
            }
        });
    }

    render() {
        const { createKpiUnit, translate } = this.props;
        let currentKpi, organizationalUnitKpiLoading;

        if (createKpiUnit) {
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
    const { createKpiUnit } = state;
    return { createKpiUnit };
}

const actions = {
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit
}

const connectedDistributionOfOrganizationalUnitKpiChart = connect(mapState, actions)(withTranslate(DistributionOfOrganizationalUnitKpiChart));
export { connectedDistributionOfOrganizationalUnitKpiChart as DistributionOfOrganizationalUnitKpiChart }

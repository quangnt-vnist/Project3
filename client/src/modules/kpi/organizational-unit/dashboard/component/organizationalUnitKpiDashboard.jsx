import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DashboardEvaluationEmployeeKpiSetAction } from '../../../evaluation/dashboard/redux/actions';

import { TrendsInOrganizationalUnitKpiChart } from './trendsInOrganizationalUnitKpiChart';
import { TrendsInChildrenOrganizationalUnitKpiChart } from './trendsInChildrenOrganizationalUnitKpiChart';
import { DistributionOfOrganizationalUnitKpiChart } from './distributionOfOrganizationalUnitKpiChart';
import { ResultsOfOrganizationalUnitKpiChart } from './resultsOfOrganizationalUnitKpiChart';
import { ResultsOfAllOrganizationalUnitKpiChart } from './resultsOfAllOrganizationalUnitKpiChart';
import { StatisticsOfOrganizationalUnitKpiResultsChart } from './statisticsOfOrganizationalUnitKpiResultsChart';

import { SelectBox, DatePicker, LazyLoadComponent, ExportExcel } from '../../../../../common-components/index';
import { withTranslate } from 'react-redux-multilingual';


class OrganizationalUnitKpiDashboard extends Component {

    constructor(props) {
        super(props);

        this.today = new Date();

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.DATA_SEARCH = {
            organizationalUnitId: null,
            month: this.today.getFullYear() + '-' + (this.today.getMonth() + 1),
            date: (this.today.getMonth() + 1) + '-' + this.today.getFullYear(),
        }

        this.state = {
            currentRole: null,
            organizationalUnitId: this.DATA_SEARCH.organizationalUnitId,

            currentYear: new Date().getFullYear(),
            month: this.DATA_SEARCH.month,
            date: this.DATA_SEARCH.date,

            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,

            childUnitChart: 1
        };
    }

    componentDidMount() {
        this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));

        this.setState(state => {
            return {
                ...state,
                currentRole: localStorage.getItem('currentRole'),
                dataStatus: this.DATA_STATUS.QUERYING
            }
        })
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (this.state.currentRole !== localStorage.getItem('currentRole')) {
            await this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                    organizationalUnitId: null,
                    childUnitChart: 1
                }
            });

            return false;
        }

        if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!nextProps.dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
                return false
            }

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                }
            })
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE) {
            return true;
        }

        return false;
    }
    
    handleSelectTypeChildUnit = (value) => {
        this.setState(state => {
            return {
                ...state,
                childUnitChart: Number(value)
            }
        })
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

    checkPermisson = (deanCurrentUnit) => {
        let currentRole = localStorage.getItem("currentRole");
        return (currentRole === deanCurrentUnit);

    }

    handleSelectOrganizationalUnitId = (value) => {
        this.DATA_SEARCH.organizationalUnitId = value[0];
    }

    handleSelectMonth = async (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        this.DATA_SEARCH.month = month;
        this.DATA_SEARCH.date = value;
    }

    handleSearchData = () => {
        this.setState(state => {
            return {
                ...state,
                organizationalUnitId: this.DATA_SEARCH.organizationalUnitId,
                month: this.DATA_SEARCH.month,
                date: this.DATA_SEARCH.date
            }
        })
    }

    handleResultsOfOrganizationalUnitKpiChartDataAvailable = (data)=>{
        this.setState( state => {
            return {
                ...state,
                resultsOfOrganizationalUnitKpiChartData: data
            }
        })
    }

    handleResultsOfAllOrganizationalUnitsKpiChartDataAvailable = (data)=>{
        this.setState( state => {
            return {
                ...state,
                resultsOfAllOrganizationalUnitsKpiChartData: data
            }
        })
    }

    handleStatisticsOfOrganizationalUnitKpiResultChartDataAvailable = (data)=>{
        this.setState( state => {
            return {
                ...state,
                statisticsOfOrganizationalUnitKpiResultChartData: data
            }
        })
    }

    render() {
        const { dashboardEvaluationEmployeeKpiSet, translate } = this.props;
        const { childUnitChart, organizationalUnitId, month, resultsOfOrganizationalUnitKpiChartData,resultsOfAllOrganizationalUnitsKpiChartData,statisticsOfOrganizationalUnitKpiResultChartData } = this.state;

        let childOrganizationalUnit, childrenOrganizationalUnit, childrenOrganizationalUnitLoading;
        let organizationalUnitSelectBox, typeChartSelectBox;
        
        if (dashboardEvaluationEmployeeKpiSet) {
            childrenOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
            childrenOrganizationalUnitLoading = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnitLoading
        }

        if (childrenOrganizationalUnit) {
            let temporaryChild;

            childOrganizationalUnit = [{
                'name': childrenOrganizationalUnit.name,
                'id': childrenOrganizationalUnit.id,
                'viceDean': childrenOrganizationalUnit.viceDean
            }]

            temporaryChild = childrenOrganizationalUnit.children;

            while (temporaryChild) {
                temporaryChild.map(x => {
                    childOrganizationalUnit = childOrganizationalUnit.concat({
                        'name': x.name,
                        'id': x.id,
                        'viceDean': x.viceDean
                    });
                })

                let hasNodeChild = [];
                temporaryChild.filter(x => x.hasOwnProperty("children")).map(x => {
                    x.children.map(x => {
                        hasNodeChild = hasNodeChild.concat(x)
                    })
                });

                if (hasNodeChild.length === 0) {
                    temporaryChild = undefined;
                } else {
                    temporaryChild = hasNodeChild
                }
            }
        }

        // Tạo các select box
        if (childOrganizationalUnit) {
            
            organizationalUnitSelectBox = childOrganizationalUnit.map(x => { return { 'text': x.name, 'value': x.id } });
        }
        typeChartSelectBox = [
            { 'text': 'Đơn vị hiện tại', 'value': 1 },
            { 'text': 'Đơn vị hiện tại và đơn vị con', 'value': 2 }
        ]


        let d = new Date(),
            monthDate = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (monthDate.length < 2)
            monthDate = '0' + monthDate;
        if (day.length < 2)
            day = '0' + day;
        let defaultDate = [monthDate, year].join('-');

        return (
            <React.Fragment>
                { childrenOrganizationalUnit
                    ? <section>
                        <div className="qlcv">
                            <div className="form-inline">
                                {childOrganizationalUnit &&
                                    <div className="form-group">
                                        <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                                        <SelectBox
                                            id={`organizationalUnitSelectBoxInOrganizationalUnitKpiDashboard`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={organizationalUnitSelectBox}
                                            multiple={false}
                                            onChange={this.handleSelectOrganizationalUnitId}
                                            value={this.DATA_SEARCH.organizationalUnitId}
                                        />
                                    </div>
                                }
                                <div className="form-group">
                                    <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.month')}</label>
                                    <DatePicker
                                        id="monthInOrganizationalUnitKpiDashboard"
                                        dateFormat="month-year"
                                        value={defaultDate}
                                        onChange={this.handleSelectMonth}
                                        disabled={false}
                                    />
                                </div>

                                <button type="button" className="btn btn-success" onClick={this.handleSearchData}>{translate('kpi.evaluation.dashboard.analyze')}</button>
                            </div>
                        </div>

                        {/* Xu hướng thực hiện mục tiêu */}
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">{translate('kpi.organizational_unit.dashboard.trend')} {this.state.date}</div>
                                    </div>

                                    <div className="box-body qlcv" style={{ minHeight: "420px" }}>
                                        <div className="form-inline" style={{ textAlign: 'right' }}>
                                            <div className="form-group">
                                                <label style={{ width: "auto" }}>Thống kê</label>
                                                <SelectBox
                                                    id={`typeChartSelectBoxInOrganizationalUnitKpiDashboard`}
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={typeChartSelectBox}
                                                    multiple={false}
                                                    onChange={this.handleSelectTypeChildUnit}
                                                    value={childUnitChart}
                                                />
                                            </div></div>
                                        {childUnitChart === 1 ?
                                            <TrendsInOrganizationalUnitKpiChart
                                                organizationalUnitId={organizationalUnitId}
                                                month={month}
                                            />
                                            : <TrendsInChildrenOrganizationalUnitKpiChart
                                                organizationalUnitId={organizationalUnitId}
                                                month={month}
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>


                        <LazyLoadComponent
                            key="distributionOfOrganizationalUnitKpiChart"
                        >
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="box box-primary">
                                        {/* Phân bố KPI đơn vị */}
                                        <div className="box-body">
                                            <div className="col-xs-6">
                                                <div className="box-header with-border">
                                                    <div className="box-title">{translate('kpi.organizational_unit.dashboard.distributive')}{this.state.date}</div>
                                                </div>
                                                { childOrganizationalUnit && (this.state.dataStatus === this.DATA_STATUS.AVAILABLE)
                                                    && 
                                                        <DistributionOfOrganizationalUnitKpiChart
                                                            organizationalUnitId={organizationalUnitId}
                                                            month={month}
                                                        />
                                                }
                                            </div>  
                                            
                                            {/* Thống kê kết quả KPI */}
                                            <div className="col-xs-6">
                                                <div className="box-header with-border">
                                                    <div className="box-title">{translate('kpi.organizational_unit.dashboard.statiscial')} {this.state.date}</div>
                                                    {statisticsOfOrganizationalUnitKpiResultChartData && <ExportExcel type="link" id="export-statistic-organizational-unit-kpi-results-chart" exportData={statisticsOfOrganizationalUnitKpiResultChartData} style={{ marginLeft: 10 }} />}
                                                </div>
                                                <StatisticsOfOrganizationalUnitKpiResultsChart
                                                    organizationalUnitId={organizationalUnitId}
                                                    month={month}
                                                    organizationalUnit={childOrganizationalUnit}
                                                    onDataAvailable={this.handleStatisticsOfOrganizationalUnitKpiResultChartDataAvailable}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </LazyLoadComponent>

                        
                        {/* Kết quả KPI đơn vị */}
                        <LazyLoadComponent
                            key="resultsOfOrganizationalUnitKpiChart"
                        >
                            {childOrganizationalUnit
                                && <div className="row">
                                    <div className="col-xs-12">
                                        <div className="box box-primary">
                                            <div className="box-header with-border">
                                                <div className="box-title">{translate('kpi.organizational_unit.dashboard.result_kpi_unit')}</div>
                                                {resultsOfOrganizationalUnitKpiChartData && <ExportExcel type="link" id="export-organizational-unit-kpi-results-chart" exportData={resultsOfOrganizationalUnitKpiChartData} style={{ marginLeft: 10 }} />}
                                            </div>
                                            <div className="box-body qlcv">
                                                {(this.state.dataStatus === this.DATA_STATUS.AVAILABLE) &&
                                                    <ResultsOfOrganizationalUnitKpiChart
                                                        organizationalUnitId={organizationalUnitId}
                                                        organizationalUnit={childOrganizationalUnit}
                                                        onDataAvailable={this.handleResultsOfOrganizationalUnitKpiChartDataAvailable}
                                                    />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </LazyLoadComponent>

                        
                        {/* Kết quả KPI các đơn vị */}
                        <LazyLoadComponent
                            key="resultsOfAllOrganizationalUnitKpiChart"
                        >
                            {childOrganizationalUnit &&
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className="box box-primary">
                                            <div className="box-header with-border">
                                                <div className="box-title">{translate('kpi.organizational_unit.dashboard.result_kpi_units')}</div>
                                                {resultsOfAllOrganizationalUnitsKpiChartData && <ExportExcel type="link" id="export-all-organizational-unit-kpi-results-chart" exportData={resultsOfAllOrganizationalUnitsKpiChartData} style={{ marginLeft: 10 }} />}
                                            </div>
                                            <div className="box-body qlcv">
                                                <ResultsOfAllOrganizationalUnitKpiChart
                                                    onDataAvailable={this.handleResultsOfAllOrganizationalUnitsKpiChartDataAvailable} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </LazyLoadComponent>
                    </section>
                    : childrenOrganizationalUnitLoading
                    && <div className="box box-body">
                        <h4>Bạn chưa có đơn vị</h4>
                    </div>
                }
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { dashboardEvaluationEmployeeKpiSet } = state;
    return { dashboardEvaluationEmployeeKpiSet };
}

const actionCreators = {
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree
};
const connectedOrganizationalUnitKpiDashboard = connect(mapState, actionCreators)(withTranslate(OrganizationalUnitKpiDashboard));
export { connectedOrganizationalUnitKpiDashboard as OrganizationalUnitKpiDashboard };
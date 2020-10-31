import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { LazyLoadComponent, ExportExcel } from '../../../../common-components';
import { ResultsOfAllOrganizationalUnitKpiChart } from '../../../kpi/organizational-unit/dashboard/component/resultsOfAllOrganizationalUnitKpiChart';
import { ResultsOfAllEmployeeKpiSetChart } from '../../../kpi/evaluation/dashboard/component/resultsOfAllEmployeeKpiSetChart';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../kpi/evaluation/dashboard/redux/actions';

class EmployeeCapacityStatistic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberOfExcellentEmployees: 5,
            numberOfExcellent: 5
        }
    };

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

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.organizationalUnits !== prevState.organizationalUnits || nextProps.month !== prevState.month) {
            let monthNew;
            if (nextProps.month) {
                let partMonth = nextProps.month.split('-');
                monthNew = [partMonth[1], partMonth[0]].join('-');
            };
            console.log(nextProps.month);
            console.log(nextProps.organizationalUnits);
            console.log(nextProps.allOrganizationalUnits);
            nextProps.getAllEmployeeKpiSetOfUnitByIds((nextProps.organizationalUnits && nextProps.organizationalUnits.length !== 0) ? nextProps.organizationalUnits : nextProps.allOrganizationalUnits)
            return {
                ...prevState,
                organizationalUnits: nextProps.organizationalUnits,
                month: nextProps.month,
                allOrganizationalUnits: nextProps.allOrganizationalUnits,
            }
        };

        return null;
    };

    /**
     * Function lấy lại thông tin kpi các đơn vị để export báo cáo
     * @param {*} data 
     */
    handleResultsOfAllOrganizationalUnitsKpiChartDataAvailable = (data) => {
        this.setState(state => {
            return {
                ...state,
                resultsOfAllOrganizationalUnitsKpiChartData: data
            }
        })
    };

    /**
     * Function lấy lại kết quả KPI tất cả các nhân viên để export báo cáo
     * @param {*} data 
     */
    handleResultsOfAllEmployeeKpiSetChartDataAvailable = (data) => {
        this.setState(state => {
            return {
                ...state,
                resultsOfAllEmployeeKpiSetChartData: data
            }
        })
    }

    /** Function thay đổi số lượng nhân viên xuất sắc nhất muốn xem */
    handleNumberOfEmployeesChange = (event) => {
        const value = event.target.value;
        this.setState(state => {
            return {
                ...state,
                numberOfExcellent: value
            }
        });
    };

    /** Lưu thay đổi số lượng nhân viên xuất sắc muốn xem */
    setLimit = () => {
        const { numberOfExcellent } = this.state;
        this.setState(state => {
            return {
                ...state,
                numberOfExcellentEmployees: numberOfExcellent
            }
        });
        window.$(`#setting-excellent`).collapse("hide");
    }



    render() {
        const { translate, department, dashboardEvaluationEmployeeKpiSet } = this.props;

        const { month, organizationalUnits, allOrganizationalUnits, numberOfExcellentEmployees, numberOfExcellent,
            resultsOfAllOrganizationalUnitsKpiChartData, resultsOfAllEmployeeKpiSetChartData } = this.state;

        let employeeKpiSets, lastMonthEmployeeKpiSets, organizationalUnitsName;
        if (organizationalUnits) {
            organizationalUnitsName = department.list.filter(x => organizationalUnits.includes(x._id));
            organizationalUnitsName = organizationalUnitsName.map(x => x.name);
        }

        if (dashboardEvaluationEmployeeKpiSet) {
            employeeKpiSets = dashboardEvaluationEmployeeKpiSet.employeeKpiSets;
            lastMonthEmployeeKpiSets = employeeKpiSets && employeeKpiSets.filter(item => this.formatDate(item.date) == this.formatDate(month));
            lastMonthEmployeeKpiSets && lastMonthEmployeeKpiSets.sort((a, b) => b.approvedPoint - a.approvedPoint);
            lastMonthEmployeeKpiSets = lastMonthEmployeeKpiSets && lastMonthEmployeeKpiSets.slice(0, numberOfExcellentEmployees);
        }
        // let organizationalUnitIds;

        return (
            <div className="row qlcv">
                {/* Kết quả KPI các đơn vị */}
                <LazyLoadComponent>
                    <div className="col-md-12">
                        <div className="box box-solid">
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
                </LazyLoadComponent>
                <div className="col-md-12">
                    <div className="box box-solid">
                        <div className="box-header with-border">
                            <h3 className="box-title">{`Top ${numberOfExcellentEmployees} ${translate('kpi.evaluation.dashboard.best_employee')} của ${(!organizationalUnits || organizationalUnits.length === department.list.length) ? "công ty" : organizationalUnitsName.join(', ')} ${this.formatDate(month)}`}</h3>
                            <div className="box-tools pull-right">
                                <button type="button" data-toggle="collapse" data-target="#setting-excellent" className="pull-right" style={{ border: "none", background: "none", padding: "0px" }}>
                                    <i className="fa fa-gear" style={{ fontSize: "19px" }}></i>
                                </button>
                                <div className="box box-primary box-solid collapse setting-table" id={"setting-excellent"}>
                                    <div className="box-header with-border">
                                        <h3 className="box-title">{translate('kpi.evaluation.dashboard.option')}</h3>
                                        <div className="box-tools pull-right">
                                            <button type="button" className="btn btn-box-tool" data-toggle="collapse" data-target="#setting-excellent" ><i className="fa fa-times"></i></button>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-control-static">{translate('kpi.evaluation.dashboard.number_of_employee')}</label>
                                        <input className="form-control" value={numberOfExcellent} type="Number" onChange={this.handleNumberOfEmployeesChange} />
                                    </div>

                                    <button type="button" className="btn btn-primary pull-right" onClick={this.setLimit}>{translate('table.update')}</button>
                                </div>

                            </div>
                        </div>
                        <div className="box-body no-parding">
                            <ul className="users-list clearfix">
                                {
                                    (lastMonthEmployeeKpiSets && lastMonthEmployeeKpiSets.length !== 0) ?
                                        lastMonthEmployeeKpiSets.map((item, index) =>
                                            <li key={index} style={{ maxWidth: 200 }}>
                                                <img src={(process.env.REACT_APP_SERVER + item.creator.avatar)} />
                                                <a className="users-list-name" href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2">{item.creator.name}</a>
                                                <span className="users-list-date">{item.approvedPoint}</span>
                                            </li>
                                        )
                                        : <li>{translate('kpi.evaluation.employee_evaluation.data_not_found')}</li>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Kết quả Kpi tất cả nhân viên */}
                <div className="col-md-12">
                    <div className="box box-solid">
                        <div className="box-header with-border">
                            <h3 className="box-title">{`${translate('kpi.evaluation.dashboard.result_kpi_titile')} của ${(!organizationalUnits || organizationalUnits.length === department.list.length) ? "công ty" : organizationalUnitsName.join(', ')}`}</h3>
                            {resultsOfAllEmployeeKpiSetChartData && <ExportExcel type="link" id="export-all-employee-kpi-evaluate-result-dashboard" exportData={resultsOfAllEmployeeKpiSetChartData} style={{ marginTop: 5 }} />}
                        </div>
                        {/* /.box-header */}
                        <div className="box-body qlcv">
                            <ResultsOfAllEmployeeKpiSetChart
                                organizationalUnitIds={(organizationalUnits && organizationalUnits.length !== 0) ? organizationalUnits : allOrganizationalUnits}
                                onDataAvailable={this.handleResultsOfAllEmployeeKpiSetChartDataAvailable}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

function mapState(state) {
    const { dashboardEvaluationEmployeeKpiSet, department } = state;
    return { dashboardEvaluationEmployeeKpiSet, department };
}

const actionCreators = {
    getAllEmployeeKpiSetOfUnitByIds: DashboardEvaluationEmployeeKpiSetAction.getAllEmployeeKpiSetOfUnitByIds,
};

const employeeCapacityStatistic = connect(mapState, actionCreators)(withTranslate(EmployeeCapacityStatistic));
export { employeeCapacityStatistic as EmployeeCapacityStatistic };
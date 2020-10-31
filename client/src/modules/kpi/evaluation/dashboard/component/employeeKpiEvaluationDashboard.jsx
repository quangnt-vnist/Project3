import React, { Component } from 'react';
import { connect } from 'react-redux';

import { UserActions } from "../../../../super-admin/user/redux/actions";
import { kpiMemberActions } from '../../employee-evaluation/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../redux/actions';

import { StatisticsOfEmployeeKpiSetChart } from './statisticsOfEmployeeKpiSetChart';
import { ResultsOfAllEmployeeKpiSetChart } from './resultsOfAllEmployeeKpiSetChart';

import { SelectBox, SelectMulti, ExportExcel } from '../../../../../common-components';
import Swal from 'sweetalert2';
import { DatePicker } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';


import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper';

class EmployeeKpiEvaluationDashboard extends Component {
    constructor(props) {
        super(props);

        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        this.INFO_SEARCH = {
            userId: null,
            startMonth: currentYear + '-' + 1,
            endMonth: (currentMonth > 10) ? ((currentYear + 1) + '-' + (currentMonth - 10)) : (currentYear + '-' + (currentMonth + 2))
        }
        this.IDS = null;

        this.state = {
            commenting: false,
            infosearch: {
                role: localStorage.getItem("currentRole"),
                userId: this.INFO_SEARCH.userId,
                status: 4,
                startMonth: this.INFO_SEARCH.startMonth,
                endMonth: this.INFO_SEARCH.endMonth
            },
            showApproveModal: "",
            showEvaluateModal: "",

            dateOfExcellentEmployees: this.formatDate(new Date(currentYear, currentMonth - 1, 1)),
            numberOfExcellentEmployees: 5,
            ids: this.IDS,
            editing: false,

            organizationalUnitIds: null
        };
    }

    componentDidMount() {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        let infosearch = {
            role: localStorage.getItem("currentRole"),
            user: null,
            status: 5,
            startDate: currentMonth === 0 ? (currentYear - 1) + '-' + 12 : currentYear + '-' + ( currentMonth + 1 ),
            endDate: (currentMonth > 10) ? ((currentYear + 1) + '-' + (currentMonth - 10)) : (currentYear + '-' + (currentMonth + 2))
        }

        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        this.props.getEmployeeKPISets(infosearch);
        this.props.getAllEmployeeKpiSetOfUnitByRole(localStorage.getItem("currentRole"));
        this.props.getAllEmployeeOfUnitByRole(localStorage.getItem("currentRole"));
        this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (!this.state.ids && this.props.dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {

            await this.setState((state) => {
                return {
                    ...state,
                    ids: [this.props.dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit.id],
                    infosearch: {
                        ...state.infosearch
                    },
                    organizationalUnitIds: [this.props.dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit.id]
                }
            });

            this.props.getAllEmployeeOfUnitByIds(this.state.ids);
            return false;
        }

        if (nextProps.user.userdepartments !== this.props.user.userdepartments) {
            let userdepartments;
            userdepartments = nextProps.user.userdepartments;

            if (userdepartments) {
                if (!Array.isArray(userdepartments)) {
                    userdepartments = [userdepartments]
                }

                let unitMembers;
                unitMembers = getEmployeeSelectBoxItems(userdepartments);
                unitMembers = [...unitMembers];

                this.setState((state) => {
                    return {
                        ...state,
                        infosearch: {
                            ...state.infosearch,
                            userId: unitMembers[0].value[2] ? unitMembers[0].value[2].value : (unitMembers[0].value[0] ? unitMembers[0].value[0].value : null)
                        },
                        organizationalUnitIds: this.IDS,
                        unitMembers: unitMembers
                    }
                });
                this.INFO_SEARCH.userId = unitMembers[0].value[2] ? unitMembers[0].value[2].value : (unitMembers[0].value[0] ? unitMembers[0].value[0].value : null);
            }

            return true
        }

        return true;
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

    handleShowApproveModal = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                showApproveModal: id
            }
        })
        let element = document.getElementsByTagName("BODY")[0];
        element.classList.add("modal-open");
        let modal = document.getElementById(`memberKPIApprove${id}`);
        modal.classList.add("in");
        modal.style = "display: block; padding-right: 17px;";
    }

    showEvaluateModal = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                showEvaluateModal: id
            }
        })
        let element = document.getElementsByTagName("BODY")[0];
        element.classList.add("modal-open");
        let modal = document.getElementById(`memberEvaluate${id}`);
        modal.classList.add("in");
        modal.style = "display: block; padding-right: 17px;";
    }

    handleChangeDate = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                dateOfExcellentEmployees: value
            }
        })
    }

    handleNumberOfEmployeesChange = (event) => {
        const value = event.target.value;
        this.setState(state => {
            return {
                ...state,
                numberOfExcellentEmployees: value
            }
        });
    }

    handleSelectOrganizationalUnit = (value) => {
        this.IDS = value;
    }

    handleUpdateData = () => {
        if (this.IDS && this.IDS !== this.state.ids) {
            this.setState((state) => {
                return {
                    ...state,
                    infosearch: {
                        ...state.infosearch,
                        userId: null
                    },
                    organizationalUnitIds: null,
                    ids: this.IDS
                }
            });

            if (this.IDS.length > 0) {
                this.props.getAllEmployeeKpiSetOfUnitByIds(this.IDS);
                this.props.getAllEmployeeOfUnitByIds(this.IDS);
                this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
                this.props.getAllUserOfDepartment(this.IDS);
            }
        }


    }

    handleSelectEmployee = (value) => {
        this.INFO_SEARCH.userId = value[0];
    }

    handleSelectMonthStart = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);

        this.INFO_SEARCH.startMonth = month;
    }

    handleSelectMonthEnd = (value) => {
        let month;
        if (value.slice(0, 2) < 12) {
            month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)) + 1);
        } else {
            month = (new Number(value.slice(3, 7)) + 1) + '-' + '1';
        }

        this.INFO_SEARCH.endMonth = month;
    }

    handleSearchData = async () => {
        let startMonth = new Date(this.INFO_SEARCH.startMonth);
        let endMonth = new Date(this.INFO_SEARCH.endMonth);

        if (startMonth.getTime() >= endMonth.getTime()) {
            const { translate } = this.props;
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm'),
            })
        } else {
            await this.setState(state => {
                return {
                    ...state,
                    infosearch: {
                        ...state.infosearch,
                        userId: this.INFO_SEARCH.userId,
                        startMonth: this.INFO_SEARCH.startMonth,
                        endMonth: this.INFO_SEARCH.endMonth
                    }
                }
            })
        }
    }


    handleStatisticsOfEmployeeKpiSetChartDataAvailable = (data) => {
        this.setState( state => {
            return {
                ...state,
                statisticsOfEmployeeKpiSetChartData: data
            }
        })
    }

    handleResultsOfAllEmployeeKpiSetChartDataAvailable =(data)=>{
        this.setState( state => {
            return {
                ...state,
                resultsOfAllEmployeeKpiSetChartData: data
            }
        })
    }

    render() {
        const { user, kpimembers, dashboardEvaluationEmployeeKpiSet } = this.props;
        const { translate } = this.props;

        const { unitMembers, dateOfExcellentEmployees, numberOfExcellentEmployees, infosearch, ids, organizationalUnitIds, statisticsOfEmployeeKpiSetChartData, resultsOfAllEmployeeKpiSetChartData } = this.state;

        let employeeKpiSets, lastMonthEmployeeKpiSets, currentMonthEmployeeKpiSets, settingUpKpi, awaitingApprovalKpi, activatedKpi, totalKpi, numberOfEmployee;
        let queue = [], childrenOrganizationalUnit = [],userName;
        let kpimember;
        let listkpi, kpiApproved;
        let currentUnit, currentUnitLoading;

        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        if (dashboardEvaluationEmployeeKpiSet) {
            currentUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
            currentUnitLoading = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnitLoading
        }
        
        if (unitMembers && infosearch) {
            for(let i=0;i<unitMembers[0].value.length;i++)
            {
                let arr = unitMembers[0].value
                if(arr[i].value === infosearch.userId){
                    userName = arr[i].text
                }
            }
        }

        if (dashboardEvaluationEmployeeKpiSet) {
            employeeKpiSets = dashboardEvaluationEmployeeKpiSet.employeeKpiSets;
            lastMonthEmployeeKpiSets = employeeKpiSets && employeeKpiSets.filter(item => this.formatDate(item.date) == dateOfExcellentEmployees);
            lastMonthEmployeeKpiSets && lastMonthEmployeeKpiSets.sort((a, b) => b.approvedPoint - a.approvedPoint);
            lastMonthEmployeeKpiSets = lastMonthEmployeeKpiSets && lastMonthEmployeeKpiSets.slice(0, numberOfExcellentEmployees);
        }

        if (employeeKpiSets) {
            currentMonthEmployeeKpiSets = employeeKpiSets.filter(item => this.formatDate(item.date) == this.formatDate(new Date(currentYear, currentMonth, 1)));
            totalKpi = currentMonthEmployeeKpiSets.length;
            settingUpKpi = currentMonthEmployeeKpiSets.filter(item => item.status == 0);
            settingUpKpi = settingUpKpi.length;
            awaitingApprovalKpi = currentMonthEmployeeKpiSets.filter(item => item.status == 1);
            awaitingApprovalKpi = awaitingApprovalKpi.length;
            activatedKpi = currentMonthEmployeeKpiSets.filter(item => item.status == 2);
            activatedKpi = activatedKpi.length;
        }

        if (user) {
            // organizationalUnitsOfUser = user.organizationalUnitsOfUser;
            // organizationalUnitsOfUserLoading = user.organizationalUnitsOfUserLoading;

            let allEmployeesUnit = [], idOfEmployees = [];
            let set;

            allEmployeesUnit = user.employees;
            allEmployeesUnit && allEmployeesUnit.map(employee => {
                idOfEmployees.push(employee.userId.id)
            })

            set = new Set(idOfEmployees);
            allEmployeesUnit = Array.from(set);
            numberOfEmployee = allEmployeesUnit.length;
        }

        if (currentUnit) {
            childrenOrganizationalUnit.push(currentUnit);
            queue.push(currentUnit);
            while (queue.length > 0) {
                let v = queue.shift();
                if (v && v.children) {
                    for (let i = 0; i < v.children.length; i++) {
                        let u = v.children[i];
                        queue.push(u);
                        childrenOrganizationalUnit.push(u);
                    }
                }
            }
        }

        if (kpimembers.kpimembers) {
            kpimember = kpimembers.kpimembers;
        }
        if (kpimembers.kpimembers) {
            listkpi = kpimembers.kpimembers;
            kpiApproved = listkpi && listkpi.filter(item => item.status === 3);

            let automaticPoint = kpiApproved && kpiApproved.map(item => {
                return { label: this.formatDate(item.date), y: item.automaticPoint }
            }).reverse();

            let employeePoint = kpiApproved.map(item => {
                return { label: this.formatDate(item.date), y: item.employeePoint }
            }).reverse();

            let approvedPoint = kpiApproved.map(item => {
                return { label: this.formatDate(item.date), y: item.approvedPoint }
            }).reverse();
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
                { currentUnit 
                    ? <React.Fragment>
                        <div className="qlcv" style={{ textAlign: "right", marginBottom: 15 }}>
                            <div className="form-inline">
                                <div className="form-group">
                                    <label className="form-control-static">{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                                    {ids &&
                                        <SelectMulti id="multiSelectOrganizationalUnit"
                                            items={childrenOrganizationalUnit.map(item => { return { value: item.id, text: item.name } })}
                                            options={{ nonSelectedText: translate('kpi.evaluation.dashboard.select_units'), allSelectedText: translate('kpi.evaluation.dashboard.all_unit') }}
                                            onChange={this.handleSelectOrganizationalUnit}
                                            value={ids}
                                        >
                                        </SelectMulti>
                                    }
                                    <button type="button" className="btn btn-success" onClick={this.handleUpdateData}>{translate('kpi.evaluation.dashboard.analyze')}</button>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3 col-sm-6 form-inline">
                                <div className="info-box">
                                    <span className="info-box-icon bg-aqua"><i className="fa fa-cogs" /></span>
                                    <div className="info-box-content">
                                        <span className="info-box-text">{`KPI ${translate('kpi.evaluation.dashboard.setting_up')}`}</span>
                                        <span className="info-box-number">{`${settingUpKpi}/${totalKpi}`}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-6 form-inline">
                                <div className="info-box">
                                    <span className="info-box-icon bg-green"><i className="fa fa-comments-o" /></span>
                                    <div className="info-box-content">
                                        <span className="info-box-text">{`KPI ${translate('kpi.evaluation.dashboard.awaiting_approval')}`}</span>
                                        <span className="info-box-number">{`${awaitingApprovalKpi}/${totalKpi}`}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="clearfix visible-sm-block" />
                            <div className="col-md-3 col-sm-6 form-inline">
                                <div className="info-box">
                                    <span className="info-box-icon bg-red"><i className="fa fa-thumbs-o-up" /></span>
                                    <div className="info-box-content">
                                        <span className="info-box-text">{`KPI ${translate('kpi.evaluation.dashboard.activated')}`}</span>
                                        <span className="info-box-number">{`${activatedKpi}/${totalKpi}`}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-6 form-inline">
                                <div className="info-box">
                                    <span className="info-box-icon bg-yellow"><i className="fa fa-users" /></span>
                                    <div className="info-box-content">
                                        <span className="info-box-text">{translate('kpi.evaluation.dashboard.number_of_employee')}</span>
                                        <span className="info-box-number">{numberOfEmployee}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="box">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">{`${numberOfExcellentEmployees} ${translate('kpi.evaluation.dashboard.best_employee')}`}</h3>
                                        <div className="box-tools pull-right">
                                            <button type="button" data-toggle="collapse" data-target="#setting-excellent-employee" className="pull-right" style={{ border: "none", background: "none", padding: "0px" }}>
                                                <i className="fa fa-gear" style={{ fontSize: "19px" }}></i>
                                            </button>
                                            <div className="box box-primary box-solid collapse setting-table" id={"setting-excellent-employee"}>
                                                <div className="box-header with-border">
                                                    <h3 className="box-title">{translate('kpi.evaluation.dashboard.option')}</h3>
                                                    <div className="box-tools pull-right">
                                                        <button type="button" className="btn btn-box-tool" data-toggle="collapse" data-target="#setting-excellent-employee" ><i className="fa fa-times"></i></button>
                                                    </div>
                                                </div>
                                                <div className="box-body">
                                                    <div className="form-group">
                                                        <label className="form-control-static">{translate('kpi.evaluation.dashboard.month')}</label>
                                                        <DatePicker
                                                            id="kpi_month"
                                                            dateFormat="month-year"
                                                            value={dateOfExcellentEmployees}
                                                            onChange={this.handleChangeDate}
                                                            disabled={false}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-control-static">{translate('kpi.evaluation.dashboard.number_of_employee')}</label>
                                                        <input name="numberOfExcellentEmployees" className="form-control" type="Number" onChange={(event) => this.handleNumberOfEmployeesChange(event)} defaultValue={numberOfExcellentEmployees} />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="box-body no-parding">
                                        <ul className="users-list clearfix">
                                            {
                                                (typeof lastMonthEmployeeKpiSets !== 'undefined' && lastMonthEmployeeKpiSets.length !== 0) ?
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
                        </div>


                        {/* Thống kê kết quả KPI của nhân viên */}
                        <div className="row">
                            <div className="col-md-12">
                                <div className="box">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">{translate('kpi.evaluation.dashboard.statistics_chart_title')}</h3>
                                        {statisticsOfEmployeeKpiSetChartData && <ExportExcel type="link" id="export-statistic-employee-kpi-set-chart" exportData={statisticsOfEmployeeKpiSetChartData} />}
                                    </div>
                                    {/* /.box-header */}

                                    <div className="box-body qlcv" id="statisticsOfEmployeeKpiSetChart">
                                        <div className="form-inline">
                                            <div className="col-sm-6 col-xs-12 form-group" >
                                                <label>{translate('kpi.evaluation.employee_evaluation.from')}</label>
                                                <DatePicker
                                                    id="monthStartInEmployeeKpiEvaluation"
                                                    dateFormat="month-year"
                                                    value={defaultStartMonth}
                                                    onChange={this.handleSelectMonthStart}
                                                    disabled={false}
                                                />
                                            </div>
                                            <div className="col-sm-6 col-xs-12 form-group" >
                                                <label>{translate('kpi.evaluation.employee_evaluation.to')}</label>
                                                <DatePicker
                                                    id="monthEndInEmployeeKpiEvaluation"
                                                    dateFormat="month-year"
                                                    value={defaultEndMonth}
                                                    onChange={this.handleSelectMonthEnd}
                                                    disabled={false}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-inline">
                                            {unitMembers &&
                                                <div className="col-sm-6 col-xs-12 form-group">
                                                    <label>{translate('kpi.evaluation.employee_evaluation.employee')}</label>
                                                    <SelectBox
                                                        id={`createEmployeeKpiSet`}
                                                        className="form-control select2"
                                                        style={{ width: "100%" }}
                                                        items={unitMembers}
                                                        multiple={false}
                                                        onChange={this.handleSelectEmployee}
                                                        value={this.INFO_SEARCH.userId}
                                                    />
                                                </div>
                                            }
                                            <div className="col-sm-6 col-xs-12 form-group">
                                                <label></label>
                                                <button type="button" className="btn btn-success" onClick={this.handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                                            </div>
                                        </div>

                                        <div className="col-sm-12 col-xs-12">
                                            {unitMembers &&
                                                <StatisticsOfEmployeeKpiSetChart
                                                    userId={infosearch.userId}
                                                    startMonth={infosearch.startMonth}
                                                    endMonth={infosearch.endMonth}
                                                    info={infosearch}
                                                    unitId={currentUnit}
                                                    userName={userName}
                                                    organizationalUnitIds={ids}
                                                    onDataAvailable = {this.handleStatisticsOfEmployeeKpiSetChartDataAvailable}
                                                />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        {/* Kết quả Kpi tất cả nhân viên */}
                        <div className="row">
                            <div className="col-md-12">
                                <div className="box">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">{translate('kpi.evaluation.dashboard.result_kpi_titile')}</h3>
                                        {resultsOfAllEmployeeKpiSetChartData&&<ExportExcel  type="link" id="export-all-employee-kpi-evaluate-result-dashboard" exportData={resultsOfAllEmployeeKpiSetChartData} style={{ marginTop:5 }} />}
                                    </div>
                                    {/* /.box-header */}

                                    <div className="box-body qlcv">
                                        <ResultsOfAllEmployeeKpiSetChart
                                            organizationalUnitIds={organizationalUnitIds}
                                            onDataAvailable={this.handleResultsOfAllEmployeeKpiSetChartDataAvailable}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                    : currentUnitLoading
                    && <div className="box">
                        <div className="box-body">
                            <h4>Bạn chưa có đơn vị</h4>
                        </div>
                    </div>   
                }
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { user, kpimembers, dashboardEvaluationEmployeeKpiSet, department } = state;
    return { user, kpimembers, dashboardEvaluationEmployeeKpiSet, department };
}

const actionCreators = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getEmployeeKPISets: kpiMemberActions.getEmployeeKPISets,
    getAllEmployeeKpiSetOfUnitByRole: DashboardEvaluationEmployeeKpiSetAction.getAllEmployeeKpiSetOfUnitByRole,
    getAllEmployeeOfUnitByRole: UserActions.getAllEmployeeOfUnitByRole,
    getAllEmployeeKpiSetOfUnitByIds: DashboardEvaluationEmployeeKpiSetAction.getAllEmployeeKpiSetOfUnitByIds,
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,
};

const connectedKPIMember = connect(mapState, actionCreators)(withTranslate(EmployeeKpiEvaluationDashboard));
export { connectedKPIMember as EmployeeKpiEvaluationDashboard };
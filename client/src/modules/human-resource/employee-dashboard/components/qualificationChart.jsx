/* Biểu đồ thể hiện trình độ học vấn của nhân viên trong công ty */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker } from '../../../../common-components';

import c3 from 'c3';
import 'c3/c3.css';

class QualificationChart extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    static isEqual = (items1, items2) => {
        if (!items1 || !items2) {
            return false;
        }
        if (items1.length !== items2.length) {
            return false;
        }
        for (let i = 0; i < items1.length; ++i) {
            if (items1[i]._id !== items2[i]._id) {
                return false;
            }
        }
        return true;
    }

    /** Xóa các chart đã render khi chưa đủ dữ liệu */
    removePreviousChart() {
        const chart = this.refs.donutChart;
        while (chart && chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    /**
     * Render chart
     * @param {*} data : Dữ liệu của chart
     */
    renderChart = (data) => {
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.donutChart,
            data: {
                columns: [
                    ...data
                ],
                type: 'donut',
            },
            donut: {
                title: "Trình độ học vấn"
            }
        });
    };

    /** Bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        const { month } = this.state;
        await this.props.handleMonthChange(this.formatDate(month, true));
        await this.props.searchSalary({ callApiDashboard: true, month: month });
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.organizationalUnits !== prevState.organizationalUnits || !QualificationChart.isEqual(nextProps.employeesManager.listAllEmployees, prevState.listAllEmployees) ||
            !QualificationChart.isEqual(nextProps.employeesManager.listEmployeesOfOrganizationalUnits, prevState.listEmployeesOfOrganizationalUnits)) {
            return {
                actionSearch: nextProps.actionSearch,
                organizationalUnits: nextProps.organizationalUnits,
                listAllEmployees: nextProps.employeesManager.listAllEmployees,
                listEmployeesOfOrganizationalUnits: nextProps.employeesManager.listEmployeesOfOrganizationalUnits
            }
        }
        return null;
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.organizationalUnits !== this.state.organizationalUnits || nextProps.actionSearch !== this.state.actionSearch ||
            !QualificationChart.isEqual(nextProps.employeesManager.listAllEmployees, this.state.listAllEmployees) ||
            !QualificationChart.isEqual(nextProps.employeesManager.listEmployeesOfOrganizationalUnits, this.state.listEmployeesOfOrganizationalUnits)) {
            return true;
        };
        return true;
    }

    /**
     * Function chyển dữ liệu thành dữ liệu chart
     * @param {*} data: Dữ liệu truyền vào 
     */
    //Trình độ chuyên môn: intermediate_degree - Trung cấp, colleges - Cao đẳng, university-Đại học, master_degree - Thạc sỹ, phd- Tiến sỹ, unavailable - Không có 
    convertData = (data) => {
        const { translate } = this.props;
        let intermediate_degree = 0, colleges = 0, university = 0, master_degree = 0, phd = 0, unavailable = 0;
        data.forEach(x => {
            switch (x.professionalSkill) {
                case 'intermediate_degree':
                    intermediate_degree = intermediate_degree + 1;
                case 'colleges':
                    colleges = colleges + 1;
                case 'university':
                    university = university + 1;
                case 'master_degree':
                    master_degree = master_degree + 1;
                case 'phd':
                    phd = phd + 1;
                default:
                    unavailable = unavailable + 1;
            }
        });
        return [
            [translate(`human_resource.profile.intermediate_degree`), intermediate_degree],
            [translate(`human_resource.profile.colleges`), colleges],
            [translate(`human_resource.profile.university`), university],
            [translate(`human_resource.profile.master_degree`), master_degree],
            [translate(`human_resource.profile.unavailable`), unavailable]
        ]

    };

    componentDidMount() {
        this.renderChart("");
    }

    render() {
        const { employeesManager, department, translate } = this.props;
        const { organizationalUnits } = this.state;

        let organizationalUnitsName;
        if (organizationalUnits) {
            organizationalUnitsName = department.list.filter(x => organizationalUnits.includes(x._id));
            organizationalUnitsName = organizationalUnitsName.map(x => x.name);
        }

        let listAllEmployees = (!organizationalUnits || organizationalUnits.length === department.list.length) ?
            employeesManager.listAllEmployees : employeesManager.listEmployeesOfOrganizationalUnits;

        if (listAllEmployees.length !== 0) {
            this.renderChart(this.convertData(listAllEmployees));
        } else {
            this.removePreviousChart();
        }

        return (
            <React.Fragment>
                <div className="box box-solid">
                    <div className="box-header with-border">
                        <h3 className="box-title">
                            {`Trình độ chuyên môn của nhân sự ${(!organizationalUnits || organizationalUnits.length === department.list.length) ? "trong công ty" : organizationalUnitsName.join(', ')}`}
                        </h3>
                    </div>
                    <div className="box-body">
                        <div className="dashboard_box_body">
                            <p className="pull-right" style={{ marginBottom: 0 }} > < b > ĐV tính: Người</b></p >
                            <div ref="donutChart"></div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { employeesManager, department } = state;
    return { employeesManager, department };
}

const qualificationChart = connect(mapState, null)(withTranslate(QualificationChart));
export { qualificationChart as QualificationChart };
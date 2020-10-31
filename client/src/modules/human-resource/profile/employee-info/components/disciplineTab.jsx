import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class DisciplineTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date;

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                commendations: nextProps.commendations,
                disciplines: nextProps.disciplines,
            }
        } else {
            return null;
        }
    }


    render() {
        const { translate, department } = this.props;

        const { id, commendations, disciplines } = this.state;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {/* Danh sách khen thưởng */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.reward')}</h4></legend>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('human_resource.commendation_discipline.commendation.table.decision_number')}</th>
                                    <th>{translate('human_resource.commendation_discipline.commendation.table.decision_date')}</th>
                                    <th>{translate('human_resource.commendation_discipline.commendation.table.decision_unit')}</th>
                                    <th>{translate('human_resource.commendation_discipline.commendation.table.reward_forms')}</th>
                                    <th>{translate('human_resource.commendation_discipline.commendation.table.reason_praise')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commendations && commendations.length !== 0 &&
                                    commendations.map((x, index) => {
                                        let nameUnit;
                                        department.list.forEach(u => {
                                            if (u._id === x.organizationalUnit) {
                                                nameUnit = u.name;
                                            }
                                        })
                                        return (
                                            <tr key={index}>
                                                <td>{x.decisionNumber}</td>
                                                <td>{this.formatDate(x.startDate)}</td>
                                                <td>{nameUnit}</td>
                                                <td>{x.type}</td>
                                                <td>{x.reason}</td>
                                            </tr>
                                        )
                                    })}

                            </tbody>
                        </table>
                        {
                            (!commendations || commendations.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                    {/* Danh sách kỷ luật */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.discipline')}</h4></legend>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('human_resource.commendation_discipline.commendation.table.decision_number')}</th>
                                    <th>{translate('human_resource.commendation_discipline.discipline.table.start_date')}</th>
                                    <th>{translate('human_resource.commendation_discipline.discipline.table.end_date')}</th>
                                    <th>{translate('human_resource.commendation_discipline.commendation.table.decision_unit')}</th>
                                    <th>{translate('human_resource.commendation_discipline.discipline.table.discipline_forms')}</th>
                                    <th>{translate('human_resource.commendation_discipline.discipline.table.reason_discipline')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {disciplines && disciplines.length !== 0 &&
                                    disciplines.map((x, index) => {
                                        let nameUnit;
                                        department.list.forEach(u => {
                                            if (u._id === x.organizationalUnit) {
                                                nameUnit = u.name;
                                            }
                                        })
                                        return (
                                            <tr key={index}>
                                                <td>{x.decisionNumber}</td>
                                                <td>{this.formatDate(x.startDate)}</td>
                                                <td>{this.formatDate(x.endDate)}</td>
                                                <td>{nameUnit}</td>
                                                <td>{x.type}</td>
                                                <td>{x.reason}</td>
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </table>
                        {
                            (!disciplines || disciplines.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
            </div>
        );
    }
};

function mapState(state) {
    const { department } = state;
    return { department };
};

const tabRearDiscipline = connect(mapState, null)(withTranslate(DisciplineTab));
export { tabRearDiscipline as DisciplineTab };
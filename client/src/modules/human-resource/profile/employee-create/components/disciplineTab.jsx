import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { CommendationAddModal, CommendationEditModal, DisciplineAddModal, DisciplineEditModal } from './combinedContent';

class DisciplineTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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

    /**
     * Bắt sự kiện click edit khen thưởng
     * @param {*} value : Dữ liệu khen thưởng muốn chỉnh sửa
     * @param {*} index : Số thứ tự khen thưởng
     */
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-praise-editPraise${index}`).modal('show');
    }

    /**
     * Bắt sự kiện click edit kỷ luật
     * @param {*} value : Dữ liệu kỷ luật
     * @param {*} index : Số thứ tự thông tin kỷ luật
     */
    handleViewDiscipline = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRowDiscipline: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-discipline-editDiscipline${index}`).modal('show');
    }

    /**
     * Function thêm thông tin khen thưởng
     * @param {*} data : Dữ liệu thông tin khen thưởng
     */
    handleAddConmmendation = async (data) => {
        const { commendations } = this.state;
        await this.setState({
            commendations: [...commendations, {
                ...data
            }]
        })
        this.props.handleAddConmmendation(this.state.commendations, data);
    }

    /**
     * Function chỉnh sửa thông tin khen thưởng
     * @param {*} data : Dữ liệu thông tin khen thưởng
     */
    handleEditConmmendation = async (data) => {
        let { commendations } = this.state;
        commendations[data.index] = data;
        await this.setState({
            commendations: commendations
        })
        this.props.handleEditConmmendation(commendations, data);
    }

    /**
     * Function bắt sự kiện xoá thông tin khen thưởng
     * @param {*} index : Số thứ tự thông tin khen thưởng cần xoá
     */
    handleDeleteConmmendation = async (index) => {
        let commendations = this.state.commendations;
        let data = commendations[index];
        commendations.splice(index, 1);
        await this.setState({
            ...this.state,
            commendations: [...commendations]
        })
        this.props.handleDeleteConmmendation(commendations, data);
    }

    /**
     * Function thêm thông tin kỷ luật
     * @param {*} data : Dữ liệu thông tin kỷ luật
     */
    handleAddDiscipline = async (data) => {
        const { disciplines } = this.state;
        await this.setState({
            disciplines: [...disciplines, {
                ...data
            }]
        })
        this.props.handleAddDiscipline(this.state.disciplines, data)
    }

    /**
     * Function chỉnh sửa thông tin kỷ luật
     * @param {*} data : Thông tin kỷ luật cần chỉnh sửa
     */
    handleEditDiscipline = async (data) => {
        let { disciplines } = this.state;
        disciplines[data.index] = data;
        await this.setState({
            disciplines: disciplines
        })
        this.props.handleEditDiscipline(disciplines, data)
    }

    /**
     * Function bắt sự kiện xoá thông tin kỷ luật
     * @param {*} index : Số thứ tự thông tin kỷ luật
     */
    handleDeleteDiscipline = async (index) => {
        let { disciplines } = this.state;
        let data = disciplines[index];
        disciplines.splice(index, 1);
        await this.setState({
            ...this.state,
            disciplines: [...disciplines]
        })
        this.props.handleDeleteDiscipline(disciplines, data)
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
        const { id, translate, department } = this.props;

        const { commendations, disciplines, currentRow, currentRowDiscipline } = this.state;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {/* Danh sách khen thưởng */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border" ><h4 className="box-title">{translate('human_resource.profile.reward')}</h4></legend>
                        <CommendationAddModal handleChange={this.handleAddConmmendation} id={`addPraise${id}`} />
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('human_resource.commendation_discipline.commendation.table.decision_number')}</th>
                                    <th>{translate('human_resource.commendation_discipline.commendation.table.decision_date')}</th>
                                    <th>{translate('human_resource.commendation_discipline.commendation.table.decision_unit')}</th>
                                    <th>{translate('human_resource.commendation_discipline.commendation.table.reward_forms')}</th>
                                    <th>{translate('human_resource.commendation_discipline.commendation.table.reason_praise')}</th>
                                    <th style={{ width: '120px' }}>{translate('table.action')}</th>
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
                                                <td>
                                                    <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.commendation_discipline.commendation.delete_commendation')}><i className="material-icons">edit</i></a>
                                                    <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteConmmendation(index)}><i className="material-icons"></i></a>
                                                </td>
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
                        <DisciplineAddModal handleChange={this.handleAddDiscipline} id={`addDiscipline${id}`} />
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('human_resource.commendation_discipline.commendation.table.decision_number')}</th>
                                    <th>{translate('human_resource.commendation_discipline.discipline.table.start_date')}</th>
                                    <th>{translate('human_resource.commendation_discipline.discipline.table.end_date')}</th>
                                    <th>{translate('human_resource.commendation_discipline.commendation.table.decision_unit')}</th>
                                    <th>{translate('human_resource.commendation_discipline.discipline.table.discipline_forms')}</th>
                                    <th>{translate('human_resource.commendation_discipline.discipline.table.reason_discipline')}</th>
                                    <th style={{ width: '120px' }}>{translate('general.action')}</th>
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
                                                <td>
                                                    <a onClick={() => this.handleViewDiscipline(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.commendation_discipline.discipline.edit_discipline')}><i className="material-icons">edit</i></a>
                                                    <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteDiscipline(index)}><i className="material-icons"></i></a>
                                                </td>
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
                {   /** Form chỉnh sửa thông tin khen thưởng */
                    currentRow !== undefined &&
                    <CommendationEditModal
                        id={`editPraise${currentRow.index}`}
                        _id={currentRow._id}
                        index={currentRow.index}
                        decisionNumber={currentRow.decisionNumber}
                        organizationalUnit={currentRow.organizationalUnit}
                        startDate={this.formatDate(currentRow.startDate)}
                        type={currentRow.type}
                        reason={currentRow.reason}
                        handleChange={this.handleEditConmmendation}
                    />
                }
                {   /** Form chỉnh sửa thông tin kỷ luật */
                    currentRowDiscipline !== undefined &&
                    <DisciplineEditModal
                        id={`editDiscipline${currentRowDiscipline.index}`}
                        _id={currentRowDiscipline._id}
                        index={currentRowDiscipline.index}
                        decisionNumber={currentRowDiscipline.decisionNumber}
                        organizationalUnit={currentRowDiscipline.organizationalUnit}
                        startDate={this.formatDate(currentRowDiscipline.startDate)}
                        endDate={this.formatDate(currentRowDiscipline.endDate)}
                        type={currentRowDiscipline.type}
                        reason={currentRowDiscipline.reason}
                        handleChange={this.handleEditDiscipline}
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const { department } = state;
    return { department };
};

const disciplineTab = connect(mapState, null)(withTranslate(DisciplineTab));
export { disciplineTab as DisciplineTab };
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { toast } from 'react-toastify';
import ServerResponseAlert from '../../../../alert/components/serverResponseAlert';

import { SalaryAddModal, SalaryEditModal, AnnualLeaveAddModal, AnnualLeaveEditModal } from './combinedContent';

class SalaryTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày cần format
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
     * Bắt sự kiện click edit thông tin lương
     * @param {*} value : Thông tin lương cần chỉnh sửa
     * @param {*} index : Số thứ tự thông tin lương cần chỉnh sửa
     */
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-salary-editSalary${index}`).modal('show');
    }

    /**
     * Bắt sự kiện click edit thông tin nghỉ phép
     * @param {*} value : Thông tin nghỉ phép cần chỉnh sửa
     * @param {*} index : Số thứ tự thông tin nghỉ phép
     */
    handleViewEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRowSabbatical: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-sabbatical-editSabbatical${index}`).modal('show');
    }

    /**
     * Function thêm thông tin lương
     * @param {*} data : Dữ liệu thông tin lương cần thêm
     */
    handleAddSalary = async (data) => {
        const { translate } = this.props;
        let { salaries } = this.state;
        let check = [];
        check = salaries.filter(x => (x.month === data.month));
        if (check.length !== 0) {
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title={'general.error'}
                    content={[translate('human_resource.salary.month_salary_have_exist')]}
                />,
                { containerId: 'toast-notification' }
            );
        } else {
            await this.setState({
                salaries: [...salaries, {
                    ...data
                }]
            })
            this.props.handleAddSalary(this.state.salaries, data);
        }
    }

    /**
     * Function chỉnh sửa thông tin lịch sử lương
     * @param {*} data : Thông tin lương cần chỉnh sửa
     */
    handleEditSalary = async (data) => {
        let { salaries } = this.state;
        salaries[data.index] = data;
        await this.setState({
            salaries: salaries
        })
        this.props.handleEditSalary(salaries, data);
    }

    /**
     * Function xoá bảng lương
     * @param {*} index : Số thứ tự thông tin lương cần xoá
     */
    handleDeleteSalary = async (index) => {
        let { salaries } = this.state;
        let data = salaries[index];
        salaries.splice(index, 1);
        await this.setState({
            ...this.state,
            salaries: [...salaries]
        })
        this.props.handleDeleteSalary(salaries, data);
    }

    /**
     * Function thêm thông tin nghỉ phép
     * @param {*} data : Dữ liệu thông tin nghỉ phép cần thêm
     */
    handleAddAnnualLeave = async (data) => {
        const { annualLeaves } = this.state;
        await this.setState({
            annualLeaves: [...annualLeaves, {
                ...data
            }]
        })
        this.props.handleAddAnnualLeave(annualLeaves, data);
    }

    /**
     * Function chỉnh sửa thông tin nghỉ phép
     * @param {*} data : Dữ liệu thông tin nghỉ phép cần chỉnh sửa
     */
    handleEditAnnualLeave = async (data) => {
        const { annualLeaves } = this.state;
        annualLeaves[data.index] = data;
        await this.setState({
            annualLeaves: annualLeaves
        })
        this.props.handleEditAnnualLeave(annualLeaves, data);
    }

    /**
     * Function xoá thông tin nghỉ phép
     * @param {*} index : Số thứ tự thông tin nghỉ phép cần xoá
     */
    handleDeleteAnnualLeave = async (index) => {
        let { annualLeaves } = this.state;
        let data = annualLeaves[index];
        annualLeaves.splice(index, 1);
        await this.setState({
            ...this.state,
            annualLeaves: [...annualLeaves]
        })
        this.props.handleDeleteAnnualLeave(annualLeaves, data);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                pageCreate: nextProps.pageCreate,
                salaries: nextProps.salaries,
                annualLeaves: nextProps.annualLeaves,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, department, employeesInfo } = this.props;

        const { id } = this.props;

        let { annualLeaves, salaries, pageCreate, currentRow, currentRowSabbatical } = this.state;

        let formater = new Intl.NumberFormat();

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <div className=" row col-md-12">
                        {/* Table lịch sử lương */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border" ><h4 className="box-title">{translate('human_resource.profile.historySalary')}</h4></legend>
                            {(pageCreate || employeesInfo.organizationalUnits.length === 0) && <a style={{ marginBottom: '10px', marginTop: '2px' }} className="btn btn-success pull-right" title={translate('human_resource.profile.employee_management.staff_no_unit_title')} disabled >{translate('modal.create')}</a>}
                            {!pageCreate && employeesInfo.organizationalUnits.length !== 0 && <SalaryAddModal handleChange={this.handleAddSalary} id={`addSalary${id}`} />}
                            <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                                <thead>
                                    <tr>
                                        <th>{translate('human_resource.month')}</th>
                                        <th>{translate('human_resource.salary.table.main_salary')}</th>
                                        <th>{translate('human_resource.salary.table.total_salary')}</th>
                                        <th>{translate('human_resource.unit')}</th>
                                        <th style={{ width: '120px' }}>{translate('table.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salaries && salaries.length !== 0 &&
                                        salaries.map((x, index) => {
                                            let total = parseInt(x.mainSalary);
                                            if (x.bonus && x.bonus.length !== 0) {
                                                for (let count in x.bonus) {
                                                    total = total + parseInt(x.bonus[count].number)
                                                }
                                            }
                                            let organizationalUnit = department.list.find(y => y._id === x.organizationalUnit);
                                            return (
                                                <tr key={index}>
                                                    <td>{this.formatDate(x.month, true)}</td>
                                                    <td>{formater.format(parseInt(x.mainSalary))} {x.unit}</td>
                                                    <td>{formater.format(total)} {x.unit}</td>
                                                    <td>{organizationalUnit.name}</td>
                                                    <td>
                                                        <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.salary.edit_salary')}><i className="material-icons">edit</i></a>
                                                        <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteSalary(index)}><i className="material-icons"></i></a>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            {
                                (typeof salaries === 'undefined' || salaries.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                            }
                        </fieldset>

                        {/* Table thông tin nghỉ phép */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border" ><h4 className="box-title">{translate('human_resource.profile.sabbatical')}</h4></legend>
                            {(pageCreate || employeesInfo.organizationalUnits.length === 0) && <a style={{ marginBottom: '10px', marginTop: '2px' }} className="btn btn-success pull-right" title={translate('human_resource.profile.employee_management.staff_no_unit_title')} disabled >{translate('modal.create')}</a>}
                            {!pageCreate && employeesInfo.organizationalUnits.length !== 0 && <AnnualLeaveAddModal handleChange={this.handleAddAnnualLeave} id={`addSabbatical${id}`} />}
                            <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                                <thead>
                                    <tr>
                                        <th>{translate('human_resource.annual_leave.table.start_date')}</th>
                                        <th>{translate('human_resource.annual_leave.table.end_date')}</th>
                                        <th>{translate('human_resource.annual_leave.table.reason')}</th>
                                        <th>{translate('human_resource.status')}</th>
                                        <th>{translate('human_resource.unit')}</th>
                                        <th style={{ width: '120px' }}>{translate('general.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(typeof annualLeaves !== 'undefined' && annualLeaves.length !== 0) &&
                                        annualLeaves.map((x, index) => {
                                            let organizationalUnit = department.list.find(y => y._id === x.organizationalUnit);
                                            return (
                                                <tr key={index}>
                                                    <td>{this.formatDate(x.startDate)}</td>
                                                    <td>{this.formatDate(x.endDate)}</td>
                                                    <td>{x.reason}</td>
                                                    <td>{translate(`human_resource.annual_leave.status.${x.status}`)}</td>
                                                    <td>{organizationalUnit.name}</td>
                                                    <td >
                                                        <a onClick={() => this.handleViewEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.annual_leave.edit_annual_leave')}><i className="material-icons">edit</i></a>
                                                        <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteAnnualLeave(index)}><i className="material-icons"></i></a>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                </tbody>
                            </table>
                            {
                                (typeof annualLeaves === 'undefined' || annualLeaves.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                            }
                        </fieldset>
                    </div>
                </div>
                {
                    currentRow !== undefined &&
                    <SalaryEditModal
                        id={`editSalary${currentRow.index}`}
                        _id={currentRow._id}
                        index={currentRow.index}
                        unit={currentRow.unit}
                        organizationalUnit={currentRow.organizationalUnit}
                        month={this.formatDate(currentRow.month, true)}
                        mainSalary={currentRow.mainSalary}
                        bonus={currentRow.bonus}
                        handleChange={this.handleEditSalary}
                    />
                }
                {
                    currentRowSabbatical !== undefined &&
                    <AnnualLeaveEditModal
                        id={`editSabbatical${currentRowSabbatical.index}`}
                        _id={currentRowSabbatical._id}
                        index={currentRowSabbatical.index}
                        organizationalUnit={currentRowSabbatical.organizationalUnit}
                        startDate={this.formatDate(currentRowSabbatical.startDate)}
                        endDate={this.formatDate(currentRowSabbatical.endDate)}
                        reason={currentRowSabbatical.reason}
                        status={currentRowSabbatical.status}
                        handleChange={this.handleEditAnnualLeave}
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const { department, employeesInfo } = state;
    return { department, employeesInfo };
};

const salaryTab = connect(mapState, null)(withTranslate(SalaryTab));
export { salaryTab as SalaryTab };
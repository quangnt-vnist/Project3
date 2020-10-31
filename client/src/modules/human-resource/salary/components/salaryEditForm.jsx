import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components';

import { SalaryFormValidator } from './salaryFormValidator';

import { SalaryActions } from '../redux/actions';

class SalaryEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /** Function bắt sự kiện thay đổi tiền lương chính */
    handleMainSalaryChange = (e) => {
        let value = e.target.value;
        this.validateMainSalary(value, true);
    }
    validateMainSalary = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = SalaryFormValidator.validateMainSalary(value, translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnMainSalary: msg,
                    mainSalary: value,
                }
            });
        }
        return msg === undefined;
    }


    /** Function bắt sự kiện thay đổi đơn vị tiền lương */
    handleChange = (e) => {
        let value = e.target.value;
        this.setState({
            unit: value
        });
    }

    /** Bắt sự kiện click thêm lương thưởng khác */
    handleAddBonus = () => {
        let { bonus } = this.state;
        if (bonus.length !== 0) {
            let result;
            for (let n in bonus) {
                result = this.validateNameSalary(bonus[n].nameBonus, n) &&
                    this.validateMoreMoneySalary(bonus[n].number, n);
                if (result === false) {
                    this.validateNameSalary(bonus[n].nameBonus, n);
                    this.validateMoreMoneySalary(bonus[n].number, n)
                    break;
                }
            }
            if (result === true) {
                this.setState({
                    bonus: [...bonus, { nameBonus: "", number: "" }]
                })
            }
        } else {
            this.setState({
                bonus: [...bonus, { nameBonus: "", number: "" }]
            })
        }

    }

    /** Bắt sự kiện chỉnh sửa tên lương thưởng khác */
    handleChangeNameBonus = (e) => {
        let { value, className } = e.target;
        this.validateNameSalary(value, className);
    }
    validateNameSalary = (value, className, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = SalaryFormValidator.validateNameSalary(value, translate);
        if (willUpdateState) {
            let { bonus } = this.state;
            bonus[className] = { ...bonus[className], nameBonus: value }
            this.setState(state => {
                return {
                    ...state,
                    errorOnNameSalary: msg,
                    bonus: bonus
                }
            });
        }
        return msg === undefined;
    }

    /** Bắt sự kiện chỉnh sửa tiền lương thưởng khác  */
    handleChangeMoneyBonus = (e) => {
        let { value, className } = e.target;
        this.validateMoreMoneySalary(value, className);
    }
    validateMoreMoneySalary = (value, className, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = SalaryFormValidator.validateMoreMoneySalary(value, translate);
        if (willUpdateState) {
            let { bonus } = this.state;
            bonus[className] = { ...bonus[className], number: value }
            this.setState(state => {
                return {
                    ...state,
                    errorOnMoreMoneySalary: msg,
                    bonus: bonus
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Function xoá lương thưởng khác
     * @param {*} index : Số thứ tự lương thưởng khác cần xoá
     */
    delete = (index) => {
        let { bonus } = this.state;
        bonus.splice(index, 1);
        this.setState({
            bonus: bonus
        })
        if (bonus.length !== 0) {
            for (let n in bonus) {
                this.validateNameSalary(bonus[n].nameBonus, n);
                this.validateMoreMoneySalary(bonus[n].number, n)
            }
        } else {
            this.setState({
                errorOnMoreMoneySalary: undefined,
                errorOnNameSalary: undefined
            })
        }
    };

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    isFormValidated = () => {
        let { mainSalary, bonus } = this.state;
        let result = this.validateMainSalary(mainSalary, false);
        if (result === true) {
            if (bonus !== []) {
                let test = bonus;
                for (let n in test) {
                    result = this.validateNameSalary(test[n].nameBonus, n, false) &&
                        this.validateMoreMoneySalary(test[n].number, n, false);
                    if (result === false) break;
                }
            }
        }
        return result;
    }

    /** Function bắt sự kiện lưu bảng lương */
    save = () => {
        let id = this.state._id;
        if (this.isFormValidated()) {
            return this.props.updateSalary(id, this.state);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                unit: nextProps.unit,
                organizationalUnit: nextProps.organizationalUnit,
                employeeNumber: nextProps.employeeNumber,
                month: nextProps.month,
                mainSalary: nextProps.mainSalary,
                bonus: nextProps.bonus,
                errorOnMainSalary: undefined,
                errorOnNameSalary: undefined,
                errorOnMoreMoneySalary: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, salary, department } = this.props;

        const { employeeNumber, organizationalUnit, unit, mainSalary, bonus, month, _id,
            errorOnMainSalary, errorOnNameSalary, errorOnMoreMoneySalary } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-edit-salary" isLoading={salary.isLoading}
                    formID="form-edit-salary"
                    title={translate('human_resource.salary.edit_salary')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-salary">
                        {/* Mã số nhân viên */}
                        <div className="form-group">
                            <label>{translate('human_resource.staff_number')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="employeeNumber" value={employeeNumber} disabled />
                        </div>
                        {/* Đơn vị */}
                        <div className="form-group">
                            <label>{translate('human_resource.unit')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`edit-salary-unit`}
                                className="form-control select2"
                                disabled={true}
                                style={{ width: "100%" }}
                                value={organizationalUnit}
                                items={department.list.map(y => { return { value: y._id, text: y.name } })}
                                onChange={this.handleOrganizationalUnitChange}
                            />
                        </div>
                        {/* Tháng lương */}
                        <div className="form-group">
                            <label>{translate('human_resource.month')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`edit_month${_id}`}
                                dateFormat="month-year"
                                value={month}
                                onChange={this.handleMonthChange}
                                disabled={true}
                            />
                        </div>
                        {/* Tiền lương chính */}
                        <div className={`form-group ${errorOnMainSalary && "has-error"}`}>
                            <label >{translate('human_resource.salary.table.main_salary')}<span className="text-red">*</span></label>
                            <div>
                                <input type="number" className="form-control" name="mainSalary" value={mainSalary} onChange={this.handleMainSalaryChange} style={{ display: "inline", width: "85%" }} autoComplete="off" />
                                <select className="form-control" name="unit" value={unit} onChange={this.handleChange} style={{ display: "inline", width: "15%" }}>
                                    <option value="VND">VND</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                            <ErrorLabel content={errorOnMainSalary} />
                        </div>
                        {/* Các loại lương thưởng khác*/}
                        <div className={`form-group ${(errorOnNameSalary || errorOnMoreMoneySalary) && "has-error"}`}>
                            <label>{translate('human_resource.salary.table.other_salary')}<a title={translate('human_resource.salary.table.add_more_salary')}><i className="fa fa-plus-square" style={{ color: "#008d4c", marginLeft: 5 }} onClick={this.handleAddBonus} /></a></label>
                            <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                                <thead>
                                    <tr>
                                        <th>{translate('human_resource.salary.table.name_salary')}</th>
                                        <th>{translate('human_resource.salary.table.money_salary')}</th>
                                        <th style={{ width: '120px', textAlign: 'center' }}>{translate('human_resource.salary.table.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bonus && bonus.length !== 0 &&
                                        bonus.map((x, index) => (
                                            <tr key={index}>
                                                <td><input className={index} type="text" value={x.nameBonus} name="nameBonus" style={{ width: "100%" }} onChange={this.handleChangeNameBonus} autoComplete="off" /></td>
                                                <td><input className={index} type="number" value={x.number} name="number" style={{ width: "100%" }} onChange={this.handleChangeMoneyBonus} autoComplete="off" /></td>
                                                <td style={{ textAlign: "center" }}>
                                                    <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            {
                                (!bonus || bonus.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                            }
                            <ErrorLabel content={errorOnNameSalary} />
                            <ErrorLabel content={errorOnMoreMoneySalary} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};
function mapState(state) {
    const { salary, department } = state;
    return { salary, department };
};

const actionCreators = {
    updateSalary: SalaryActions.updateSalary,
};

const editSalary = connect(mapState, actionCreators)(withTranslate(SalaryEditForm));
export { editSalary as SalaryEditForm };
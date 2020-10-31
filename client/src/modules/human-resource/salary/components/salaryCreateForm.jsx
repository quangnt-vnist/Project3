import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components';

import { SalaryFormValidator } from './combinedContent';

import { SalaryActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { EmployeeManagerActions } from '../../profile/employee-management/redux/actions';

class SalaryCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: "VND",
            employee: "",
            organizationalUnit: "",
            month: this.formatDate(Date.now()),
            mainSalary: "",
            bonus: [],
        };
    };

    componentDidMount() {
        this.props.getAllEmployee();
    }

    /**
     * Function format ngày hiện tại thành dạnh mm-yyyy
     * @param {*} date : Ngày muốn format
     */
    formatDate = (date) => {
        if (date) {
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
        return date;
    }

    /** Function bắt sự kiện thay đổi mã nhân viên */
    handleMSNVChange = async (value) => {
        await this.props.getDepartmentOfUser({ email: value[0] });
        this.validateEmployeeNumber(value[0], true);
    }
    validateEmployeeNumber = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = SalaryFormValidator.validateEmployeeNumber(value, translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEmployee: msg,
                    employee: value,
                    organizationalUnit: "",
                }
            });

        }
        return msg === undefined;
    }

    /** Function bắt sự kiện thay đổi đơn vị */
    handleOrganizationalUnitChange = (value) => {
        this.validateOrganizationalUnit(value[0], true);
    }
    validateOrganizationalUnit = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = SalaryFormValidator.validateEmployeeNumber(value, translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnOrganizationalUnit: msg,
                    organizationalUnit: value,
                }
            });
        }
        return msg === undefined;
    }


    /**
     * Function bắt sự kiện thay đổi tháng lương để lưu vào state
     * @param {*} value : Giá trị tháng lương
     */
    handleMonthChange = (value) => {
        this.validateMonthSalary(value, true);
    }
    validateMonthSalary = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = SalaryFormValidator.validateMonthSalary(value, translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnMonthSalary: msg,
                    month: value,
                }
            });
        }
        return msg === undefined;
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

    /** Bắt sự kiện chỉnh sửa tiền lương thưởng khác */
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

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form  */
    isFormValidated = () => {
        const { user } = this.props;
        let { employee, organizationalUnit, mainSalary, month, bonus } = this.state;

        if (user.organizationalUnitsOfUserByEmail) {
            if (!organizationalUnit) {
                let department = user.organizationalUnitsOfUserByEmail[0];
                organizationalUnit = department._id;
            }
        }

        let result = this.validateEmployeeNumber(employee, false) &&
            this.validateMainSalary(mainSalary, false) && this.validateOrganizationalUnit(organizationalUnit, false) &&
            this.validateMonthSalary(month, false);

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
        const { user, employeesManager } = this.props;
        let { organizationalUnit, month, employee } = this.state;

        if (user.organizationalUnitsOfUserByEmail) {
            if (!organizationalUnit) {
                let department = user.organizationalUnitsOfUserByEmail[0];
                organizationalUnit = department._id;
            }
        }
        let employeeID = employeesManager.listAllEmployees.find(x => x.emailInCompany === employee);
        employeeID = employeeID._id;

        let partMonth = month.split('-');
        let monthNew = [partMonth[1], partMonth[0]].join('-');
        if (this.isFormValidated()) {
            this.props.createSalary({ ...this.state, employee: employeeID, organizationalUnit: organizationalUnit, month: monthNew });
        }
    }

    render() {
        const { translate, salary, employeesManager, user } = this.props;

        let { employee, organizationalUnit, unit, mainSalary, bonus, month, errorOnEmployee, errorOnOrganizationalUnit,
            errorOnMainSalary, errorOnNameSalary, errorOnMoreMoneySalary, errorOnMonthSalary } = this.state;

        let listAllEmployees = employeesManager.listAllEmployees;
        let listDepartments = [{ _id: "", name: translate('human_resource.non_unit') }];

        if (user.organizationalUnitsOfUserByEmail) {
            listDepartments = user.organizationalUnitsOfUserByEmail;
            if (!organizationalUnit) {
                let department = user.organizationalUnitsOfUserByEmail[0];
                organizationalUnit = department._id;
            }
        }

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-create-salary" isLoading={salary.isLoading}
                    formID="form-create-salary"
                    title={translate('human_resource.salary.add_salary_title')}
                    resetOnSave={true}
                    resetOnClose={true}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-create-salary">
                        {/* Mã số nhân viên */}
                        <div className={`form-group ${errorOnEmployee && "has-error"}`}>
                            <label>{translate('human_resource.staff_number')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`create-salary-employee`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={employee}
                                items={listAllEmployees.map(y => { return { value: y.emailInCompany, text: `${y.employeeNumber} - ${y.fullName}` } }).concat([{ value: "", text: translate('human_resource.non_staff') }])}
                                onChange={this.handleMSNVChange}
                            />
                            <ErrorLabel content={errorOnEmployee} />
                        </div>
                        {/* Đơn vị */}
                        <div className={`form-group ${errorOnOrganizationalUnit && "has-error"}`}>
                            <label>{translate('human_resource.unit')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`create-salary-unit`}
                                className="form-control select2"
                                disabled={listDepartments.length > 1 ? false : true}
                                style={{ width: "100%" }}
                                value={organizationalUnit}
                                items={listDepartments.map(y => { return { value: y._id, text: y.name } })}
                                onChange={this.handleOrganizationalUnitChange}
                            />
                            <ErrorLabel content={errorOnOrganizationalUnit} />
                        </div>
                        {/* Tháng lương */}
                        <div className={`form-group ${errorOnMonthSalary && "has-error"}`}>
                            <label>{translate('human_resource.month')}<span className="text-red">*</span></label>
                            <DatePicker
                                id="create_month"
                                dateFormat="month-year"
                                value={month}
                                onChange={this.handleMonthChange}
                            />
                            <ErrorLabel content={errorOnMonthSalary} />
                        </div>
                        {/* Tiền lương chính */}
                        <div className={`form-group ${errorOnMainSalary && "has-error"}`}>
                            <label >{translate('human_resource.salary.table.main_salary')}<span className="text-red">*</span></label>
                            <div>
                                <input type="number" className="form-control" name="mainSalary" value={mainSalary} onChange={this.handleMainSalaryChange}
                                    style={{ display: "inline", width: "85%" }} autoComplete="off" placeholder={translate('human_resource.salary.table.main_salary')} autoComplete="off" />
                                <select className="form-control" name="unit" value={unit} onChange={this.handleChange} style={{ display: "inline", width: "15%" }}>
                                    <option value="VND">VND</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                            <ErrorLabel content={errorOnMainSalary} />
                        </div>
                        {/* Các loại lương thưởng khác */}
                        <div className={`form-group ${(errorOnNameSalary || errorOnMoreMoneySalary) && "has-error"}`}>
                            <label>{translate('human_resource.salary.table.other_salary')}<a title={translate('human_resource.salary.table.add_more_salary')}>
                                <i className="fa fa-plus-square" style={{ color: "#008d4c", marginLeft: 5 }} onClick={this.handleAddBonus} /></a></label>
                            <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                                <thead>
                                    <tr>
                                        <th>{translate('human_resource.salary.table.name_salary')}</th>
                                        <th>{translate('human_resource.salary.table.money_salary')}</th>
                                        <th style={{ width: '120px', textAlign: 'center' }}>{translate('human_resource.salary.table.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(bonus && bonus.length !== 0) &&
                                        bonus.map((x, index) => (
                                            <tr key={index}>
                                                <td><input className={index} type="text" value={x.nameBonus} name="nameBonus" style={{ width: "100%" }} onChange={this.handleChangeNameBonus} /></td>
                                                <td><input className={index} type="number" value={x.number} name="number" style={{ width: "100%" }} onChange={this.handleChangeMoneyBonus} /></td>
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
    const { salary, employeesManager, user } = state;
    return { salary, employeesManager, user };
};

const actionCreators = {
    createSalary: SalaryActions.createSalary,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    getDepartmentOfUser: UserActions.getDepartmentOfUser,
};

const createForm = connect(mapState, actionCreators)(withTranslate(SalaryCreateForm));
export { createForm as SalaryCreateForm };
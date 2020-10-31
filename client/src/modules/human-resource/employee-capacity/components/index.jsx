import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti, DatePicker } from '../../../../common-components';

import { EmployeeCapacityStatistic } from './employeeCapacityStatistic';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';

class EmployeeCapacity extends Component {
    constructor(props) {
        super(props);
        let partMonth = this.formatDate(Date.now(), true).split('-');
        let month = [partMonth[1], partMonth[0]].join('-');
        this.state = {
            organizationalUnits: null,
            month: month,
            newOrganizationalUnits: null,
            newMonth: month
        }
    };

    componentDidMount() {
        this.props.getDepartment();
    };

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
     * Function bắt sự kiện thay đổi unit
     * @param {*} value : Array id đơn vị
     */
    handleSelectOrganizationalUnit = async (value) => {
        if (value.length === 0) {
            value = null
        };
        await this.setState({
            organizationalUnits: value
        })
    };

    /**
     * Function lưu giá trị tháng vào state khi thay đổi
     * @param {*} value : Giá trị tháng
     */
    handleMonthChange = (value) => {
        if (value) {
            let partMonth = value.split('-');
            value = [partMonth[1], partMonth[0]].join('-');
        }
        this.setState({
            ...this.state,
            month: value
        });
    };

    /** Bắt sự kiện tìm kiếm */
    handleSunmitSearch = () => {
        const { month, organizationalUnits } = this.state;
        this.setState({
            newMonth: month,
            newOrganizationalUnits: organizationalUnits
        })
    }

    render() {
        const { translate, department } = this.props;
        const { month, organizationalUnits, newMonth, newOrganizationalUnits } = this.state;
        let allOrganizationalUnits = department.list.map(x => x._id);

        return (
            <div className="qlcv">
                <div className="form-inline">
                    <div className="form-group">
                        <label style={{ width: 'auto' }}>{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                        <SelectMulti id="multiSelectOrganizationalUnits"
                            items={department.list.map((p, i) => { return { value: p._id, text: p.name } })}
                            options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                            onChange={this.handleSelectOrganizationalUnit}
                        >
                        </SelectMulti>
                    </div>
                    <div className="form-group">
                        <label style={{ width: 'auto' }} >{translate('human_resource.month')}</label>
                        <DatePicker
                            id="month"
                            dateFormat="month-year"
                            deleteValue={false}
                            value={this.formatDate(Date.now(), true)}
                            onChange={this.handleMonthChange}
                        />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('general.search')} onClick={this.handleSunmitSearch} >{translate('general.search')}</button>
                    </div>
                </div>
                {
                    allOrganizationalUnits.length !== 0 &&
                    <EmployeeCapacityStatistic organizationalUnits={newOrganizationalUnits} month={newMonth} allOrganizationalUnits={allOrganizationalUnits} />
                }

            </div>
        );
    }
}
function mapState(state) {
    const { department } = state;
    return { department };
}

const actionCreators = {
    getDepartment: DepartmentActions.get,
};

const employeeCapacity = connect(mapState, actionCreators)(withTranslate(EmployeeCapacity));
export { employeeCapacity as EmployeeCapacity };

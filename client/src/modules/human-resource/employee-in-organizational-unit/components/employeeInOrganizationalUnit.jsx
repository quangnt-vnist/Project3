import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { TreeTable } from '../../../../common-components';

import { EmployeeInOrganizationalUnitEditForm } from './employeeInOrganizationalUnitEditForm';

import { RoleActions } from '../../../super-admin/role/redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';

class DepartmentManage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.props.getDepartment();
        this.props.getRole();
    }

    /**
     * Function bắt sự kiện chỉnh sửa nhân sự các đơn vị
     * @param {*} id : Id đơn vị cần sửa
     */
    handleShowEdit = async (id) => {
        await this.setState({
            ...this.state,
            currentRow: id
        })
        window.$(`#modal-edit-unit${id}`).modal('show');
    }

    componentDidUpdate() {
        window.$('#employee-tree-table').css({ "border": "1px solid #9E9E9E", 'backgroundColor': 'whitesmoke' });
        window.$('#employee-tree-table th').css({ "border": "1px solid #9E9E9E" });
        window.$('#employee-tree-table td').css({ "border": "1px solid #9E9E9E" });
    }

    render() {
        const { translate, department } = this.props;

        let data = [];
        if (department.list.length !== 0) {
            data = department.list;
            for (let n in data) {
                data[n] = { ...data[n], action: ["edit"] }
            }
        }
        let column = [{ name: translate('manage_department.name'), key: "name" }, { name: translate('manage_department.description'), key: "description" }];

        return (
            <div>
                <div className="qlcv">
                    <TreeTable
                        behaviour="show-children"
                        tableId='employee-tree-table'
                        column={column}
                        data={data}
                        titleAction={{
                            edit: translate('human_resource.manage_department.edit_unit'),
                        }}
                        funcEdit={this.handleShowEdit}
                    />
                </div>

                { /** Form chỉnh sửa nhân sự các đơn vị */
                    this.state.currentRow !== undefined &&
                    <EmployeeInOrganizationalUnitEditForm
                        _id={this.state.currentRow}
                        department={department.list.filter(x => x._id === this.state.currentRow)}
                        role={this.props.role.list} />
                }
            </div >
        );
    };
}

function mapState(state) {
    const { role, department } = state;
    return { role, department };
}

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getRole: RoleActions.get,
}

const departmentManage = connect(mapState, actionCreators)(withTranslate(DepartmentManage));
export { departmentManage as DepartmentManage };
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DeleteNotification, PaginateBar, DataTableSetting, SelectMulti } from '../../../../common-components';
import { EducationProgramCreateForm, EducationProgramEditForm, EducationProgramDetailForm } from './combinedContent';

import { EducationActions } from '../redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';


class ListEducation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: null,
            organizationalUnit: null,
            page: 0,
            limit: 5,
        };
    }

    componentDidMount() {
        this.props.getListEducation(this.state);
        this.props.getDepartment();
    }

    /**
     * Function bắt sự kiện chỉnh sửa chương trình đào tạo
     * @param {*} value : Thông tin chương trình đào tạo
     */
    handleEdit = async (value) => {
        await this.setState({
            ...this.state,
            currentEditRow: value
        })
        window.$(`#modal-edit-education${value._id}`).modal('show');
    }

    /**
     * Function bắt sự kiện xem thông tin chương trình đào tạo
     * @param {*} value : Thông tin chương trình đào tạo
     */
    handleView = async (value) => {
        await this.setState({
            ...this.state,
            currentViewRow: value
        })
        window.$(`#modal-view-education${value._id}`).modal('show');
    }


    /**
     * Function lưu giá trị đơn vị vào state khi thay đổi
     * @param {*} value : Array id đơn vị
     */
    handleUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            organizationalUnit: value
        })
    }

    /**
     * Function lưu giá trị chức vụ vào state khi thay đổi
     * @param {*} value : Array id chức vụ
     */
    handlePositionChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            position: value
        })
    }

    /**
     * Bắt sự kiện tìm kiếm chương trình đào tạo
     */
    handleSunmitSearch = () => {
        this.props.getListEducation(this.state);
    }

    /**
     * Function thay đổi số dòng hiện thị trên 1 trang
     * @param {*} number : Số dòng hiện thị trên 1 trang
     */
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.getListEducation(this.state);
    }

    /**
     * Function thay đổi số trang muốn xem
     * @param {*} pageNumber : Số trang muốn xem
     */
    setPage = async (pageNumber) => {
        let page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });
        this.props.getListEducation(this.state);
    }

    render() {
        const { translate, education, department } = this.props;

        const { limit, page, organizationalUnit, currentEditRow, currentViewRow } = this.state;

        const { list } = department;
        let listEducations = [], listPosition = [{ value: "", text: translate('human_resource.not_unit'), disabled: true }];

        if (organizationalUnit !== null) {
            listPosition = [];
            organizationalUnit.forEach(u => {
                list.forEach(x => {
                    if (x._id === u) {
                        let roleDeans = x.deans.map(y => { return { _id: y._id, name: y.name } });
                        let roleViceDeans = x.viceDeans.map(y => { return { _id: y._id, name: y.name } });
                        let roleEmployees = x.employees.map(y => { return { _id: y._id, name: y.name } });
                        listPosition = listPosition.concat(roleDeans).concat(roleViceDeans).concat(roleEmployees);
                    }
                })
            })
        }

        if (education.isLoading === false) {
            listEducations = education.listEducations;
        }

        let pageTotal = (education.totalList % limit === 0) ?
            parseInt(education.totalList / limit) :
            parseInt((education.totalList / limit) + 1);
        let crurrentPage = parseInt((page / limit) + 1);

        return (
            <div className="box">
                <div className="box-body qlcv">
                    <EducationProgramCreateForm />
                    <div className="form-inline">
                        {/* Đơn vị */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.unit')}</label>
                            <SelectMulti id={`multiSelectUnit`} multiple="multiple"
                                options={{ nonSelectedText: translate('human_resource.non_unit'), allSelectedText: translate('human_resource.all_unit') }}
                                items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        {/* Chức vụ */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.position')}</label>
                            <SelectMulti id={`multiSelectPosition`} multiple="multiple"
                                options={{ nonSelectedText: translate('human_resource.non_position'), allSelectedText: translate('human_resource.all_position') }}
                                items={organizationalUnit === null ? listPosition : listPosition.map((p, i) => { return { value: p._id, text: p.name } })} onChange={this.handlePositionChange}>
                            </SelectMulti>
                        </div>
                        {/* button tìm kiếm */}
                        <button type="button" className="btn btn-success" onClick={this.handleSunmitSearch} >{translate('general.search')}</button>
                    </div>

                    <table id="education-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th title={translate('training.education_program.education_program_code')}>{translate('training.education_program.table.program_code')}</th>
                                <th title={translate('training.education_program.education_program_name')}>{translate('training.education_program.table.program_name')}</th>
                                <th>{translate('training.education_program.table.apply_for_organizational_units')}</th>
                                <th>{translate('training.education_program.table.apply_for_positions')}</th>
                                <th>{translate('training.education_program.table.total_courses')}</th>
                                <th style={{ width: '120px' }}>{translate('general.action')}
                                    <DataTableSetting
                                        tableId="education-table"
                                        columnArr={[
                                            translate('training.education_program.table.program_code'),
                                            translate('training.education_program.table.program_name'),
                                            translate('training.education_program.table.apply_for_organizational_units'),
                                            translate('training.education_program.table.apply_for_positions'),
                                            translate('training.education_program.table.total_courses')
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listEducations && listEducations.length !== 0 &&
                                listEducations.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.programId}</td>
                                        <td>{x.name}</td>
                                        <td>{(typeof x.applyForOrganizationalUnits === 'undefined' || x.applyForOrganizationalUnits.length === 0) ? "" :
                                            x.applyForOrganizationalUnits.map((y, indexs) => {
                                                if (indexs === 0) {
                                                    return y.name
                                                }
                                                return ", " + y.name
                                            })}
                                        </td>
                                        <td>{(typeof x.applyForPositions === 'undefined' || x.applyForPositions.length === 0) ? "" :
                                            x.applyForPositions.map((y, indexs) => {
                                                if (indexs === 0) {
                                                    return y.name
                                                }
                                                return ", " + y.name
                                            })}
                                        </td>
                                        <td>{x.totalList}</td>
                                        <td>
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title={translate('training.education_program.view_education_program')}><i className="material-icons">view_list</i></a>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('training.education_program.edit_education_program')}><i className="material-icons">edit</i></a>
                                            {Number(x.totalList) === 0 && <DeleteNotification
                                                content={translate('training.education_program.delete_education_program')}
                                                data={{
                                                    id: x._id,
                                                    info: x.name + " - " + x.programId
                                                }}
                                                func={this.props.deleteEducation}
                                            />}
                                        </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                    {education.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!listEducations || listEducations.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={crurrentPage} func={this.setPage} />
                </div>

                {   /* Form chỉnh sửa chương trình đào tạo */
                    currentEditRow &&
                    <EducationProgramEditForm
                        _id={currentEditRow._id}
                        name={currentEditRow.name}
                        programId={currentEditRow.programId}
                        organizationalUnit={currentEditRow.applyForOrganizationalUnits.map(x => x._id)}
                        position={currentEditRow.applyForPositions.map(x => x._id)}
                        totalList={currentEditRow.totalList}
                    />
                }
                {   /* Form xem thông tin chương trình đào tạo */
                    currentViewRow &&
                    <EducationProgramDetailForm
                        _id={currentViewRow._id}
                        name={currentViewRow.name}
                        programId={currentViewRow.programId}
                        listCourses={currentViewRow.listCourses}
                        totalList={currentViewRow.totalList}
                        data={currentViewRow}
                    />
                }
            </div>
        );
    };
};

function mapState(state) {
    const { education, department } = state;
    return { education, department };
};

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getListEducation: EducationActions.getListEducation,
    deleteEducation: EducationActions.deleteEducation,
};

const connectedListEducation = connect(mapState, actionCreators)(withTranslate(ListEducation));
export { connectedListEducation as ListEducation };
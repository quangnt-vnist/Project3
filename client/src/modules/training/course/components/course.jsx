import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { CourseCreateForm, CourseDetailForm, CourseEditForm } from './combinedContent';

import { DeleteNotification, PaginateBar, DataTableSetting, SelectMulti } from '../../../../common-components';

import { CourseActions } from '../redux/actions';
import { EducationActions } from '../../education-program/redux/actions';
class TrainingPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseId: "",
            type: null,
            page: 0,
            limit: 5,
        };
    }

    componentDidMount() {
        this.props.getListCourse(this.state);
        this.props.getListEducation();
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về ngày tháng năm, false trả về tháng năm
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
     * Function bắt sự kiện chỉnh sửa chương trình đào tạo
     * @param {*} value : Giá trị chương trình đào tạo
     */
    handleEdit = async (value) => {
        await this.setState({
            ...this.state,
            currentEditRow: value
        })
        window.$(`#modal-edit-course${value._id}`).modal('show');
    }

    /**
     * Function bắt sự kiện xem thông tin chương trình đào tạo
     * @param {*} value : Giá trị chương trình đào tạo
     */
    handleView = async (value) => {
        await this.setState({
            ...this.state,
            currentViewRow: value
        })
        window.$(`#modal-view-course${value._id}`).modal('show');
    }

    /**
     * Bắt sự kiện thay đổi loại đào tạo để tìm kiếm
     * @param {*} value : Giá trị loại đào tạo
     */
    handleTypeChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            type: value
        })
    }

    /** Bắt sự kiện thay đổi mã khoá đào tạo */
    handleChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    /** Bắt sự kiện tìm kiếm */
    handleSunmitSearch = () => {
        this.props.getListCourse(this.state);
    }

    /**
     * Function bắt sự kiện thay đổi số dòng hiện thị trên 1 trang
     * @param {*} number 
     */
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number)
        });
        this.props.getListCourse(this.state);
    }

    /**
     * Function bắt sự kiện thay đổi trang muốn xem
     * @param {*} pageNumber 
     */
    setPage = async (pageNumber) => {
        let page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });
        this.props.getListCourse(this.state);
    }

    render() {
        const { translate, course } = this.props;

        const { page, limit, currentEditRow, currentViewRow } = this.state;

        let { listCourses } = course;
        let pageTotal = (course.totalList % limit === 0) ?
            parseInt(course.totalList / limit) :
            parseInt((course.totalList / limit) + 1);
        let currentPage = parseInt((page / limit) + 1);

        return (
            <div className="box">
                <div className="box-body qlcv">
                    <CourseCreateForm />
                    {/* Mã khoá đào tạo*/}
                    <div className="form-inline">
                        <div className="form-group">
                            <label style={{ width: 110 }} className="form-control-static">{translate('training.course.table.course_code')}</label>
                            <input type="text" className="form-control" name="courseId" onChange={this.handleChange} autoComplete="off" />
                        </div>
                    </div>
                    {/* Loại đào tạo */}
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label style={{ width: 110 }} className="form-control-static">{translate('training.course.table.course_type')}</label>
                            <SelectMulti id={`multiSelectTypeCourse`} multiple="multiple"
                                options={{ nonSelectedText: translate('training.course.no_course_type'), allSelectedText: translate('training.course.all_course_type') }}
                                onChange={this.handleTypeChange}
                                items={[
                                    { value: "internal", text: translate('training.course.type.internal') },
                                    { value: "external", text: translate('training.course.type.external') },
                                ]}
                            >
                            </SelectMulti>
                            <button type="submit" className="btn btn-success" onClick={() => this.handleSunmitSearch()}>{translate('general.search')}</button>
                        </div>
                    </div>

                    <table id="course-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('training.course.table.course_code')}</th>
                                <th>{translate('training.course.table.course_name')}</th>
                                <th title={translate('training.course.start_date')}>{translate('training.course.table.start_date')}</th>
                                <th title={translate('training.course.end_date')}>{translate('training.course.table.end_date')}</th>
                                <th title="Địa điểm đào tạo">{translate('training.course.table.course_place')}</th>
                                <th>{translate('training.course.table.offered_by')}</th>
                                <th>{translate('training.course.table.course_type')}</th>
                                <th style={{ width: "120px" }}>{translate('general.action')}
                                    <DataTableSetting
                                        tableId="course-table"
                                        columnArr={[
                                            translate('training.course.table.course_code'),
                                            translate('training.course.table.course_name'),
                                            translate('training.course.table.start_date'),
                                            translate('training.course.table.end_date'),
                                            translate('training.course.table.course_place'),
                                            translate('training.course.table.offered_by'),
                                            translate('training.course.table.course_type')
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (listCourses.length !== 0 && listCourses) &&
                                listCourses.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.courseId}</td>
                                        <td>{x.name}</td>
                                        <td>{this.formatDate(x.startDate)}</td>
                                        <td>{this.formatDate(x.endDate)}</td>
                                        <td>{x.coursePlace}</td>
                                        <td>{x.offeredBy}</td>
                                        <td>{translate(`training.course.type.${x.type}`)}</td>
                                        <td>
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title={translate('training.course.view_course')}><i className="material-icons">view_list</i></a>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('training.course.edit_course')}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('training.course.delete_course')}
                                                data={{
                                                    id: x._id,
                                                    info: x.name + " - " + x.courseId
                                                }}
                                                func={this.props.deleteCourse}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {course.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!listCourses || listCourses.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                </div>
                {
                    currentEditRow &&
                    <CourseEditForm
                        _id={currentEditRow._id}
                        name={currentEditRow.name}
                        courseId={currentEditRow.courseId}
                        offeredBy={currentEditRow.offeredBy}
                        coursePlace={currentEditRow.coursePlace}
                        startDate={this.formatDate(currentEditRow.startDate)}
                        endDate={this.formatDate(currentEditRow.endDate)}
                        cost={currentEditRow.cost.number}
                        lecturer={currentEditRow.lecturer}
                        applyForOrganizationalUnits={currentEditRow.educationProgram.applyForOrganizationalUnits}
                        applyForPositions={currentEditRow.educationProgram.applyForPositions}
                        educationProgram={currentEditRow.educationProgram._id}
                        employeeCommitmentTime={currentEditRow.employeeCommitmentTime}
                        type={currentEditRow.type}
                        listEmployees={currentEditRow.listEmployees.map(x => { return { _id: x.employee._id, result: x.result } })}
                        unit={currentEditRow.cost.unit}
                    />
                }
                {
                    currentViewRow &&
                    <CourseDetailForm
                        _id={currentViewRow._id}
                        name={currentViewRow.name}
                        courseId={currentViewRow.courseId}
                        offeredBy={currentViewRow.offeredBy}
                        coursePlace={currentViewRow.coursePlace}
                        startDate={this.formatDate(currentViewRow.startDate)}
                        endDate={this.formatDate(currentViewRow.endDate)}
                        cost={currentViewRow.cost.number}
                        lecturer={currentViewRow.lecturer}
                        educationProgram={currentViewRow.educationProgram}
                        employeeCommitmentTime={currentViewRow.employeeCommitmentTime}
                        type={currentViewRow.type}
                        listEmployees={currentViewRow.listEmployees}
                        unit={currentViewRow.cost.unit}
                    />
                }

            </div>
        );
    };
};

function mapState(state) {
    const { course, education, } = state;
    return { course, education, };
};

const actionCreators = {
    getListCourse: CourseActions.getListCourse,
    deleteCourse: CourseActions.deleteCourse,
    getListEducation: EducationActions.getListEducation,
};

const connectedListCourse = connect(mapState, actionCreators)(withTranslate(TrainingPlan));
export { connectedListCourse as TrainingPlan };
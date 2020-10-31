import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { CourseFormValidator } from './combinedContent';

import { DialogModal, DatePicker, ErrorLabel, SelectBox } from '../../../../common-components';

import { EmployeeManagerActions } from '../../../human-resource/profile/employee-management/redux/actions';
import { CourseActions } from '../redux/actions';

class CourseEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { applyForOrganizationalUnits, applyForPositions } = this.state;
        this.props.getAllEmployee({ organizationalUnits: applyForOrganizationalUnits, position: applyForPositions });
    }

    /** Bắt sự kiện thay đổi tên kháo đào tạo */
    handleCourseNameChange = (e) => {
        const { value } = e.target;
        this.validateCourseName(value, true);
    }
    validateCourseName = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = CourseFormValidator.validateCourseName(value, translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCourseName: msg,
                    name: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi địa điểm đào tạo */
    handleCoursePlaceChange = (e) => {
        const { value } = e.target;
        this.validateCoursePlace(value, true);
    }
    validateCoursePlace = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = CourseFormValidator.validateCoursePlace(value, translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCoursePlace: msg,
                    coursePlace: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi đơn vị đào tạo */
    handleOfferedByChange = (e) => {
        const { value } = e.target;
        this.validateOfferedBy(value, true);
    }
    validateOfferedBy = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = CourseFormValidator.validateOfferedBy(value, translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnOfferedBy: msg,
                    offeredBy: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi loại đào tạo và giảng viên */
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    /** Bắt sự kiện thay chi phí đào tạo */
    handleCostChange = (e) => {
        const { value } = e.target;
        this.validateCost(value, true);
    }
    validateCost = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = CourseFormValidator.validateCost(value, translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCost: msg,
                    cost: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi thời gian cam kết */
    handleEmployeeCommitmentTimeChange = (e) => {
        const { value } = e.target;
        this.validateEmployeeCommitmentTime(value, true);
    }
    validateEmployeeCommitmentTime = (value, willUpdateState = true) => {
        const { translate } = this.props;

        let msg = CourseFormValidator.validateEmployeeCommitmentTime(value, translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEmployeeCommitmentTime: msg,
                    employeeCommitmentTime: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi thuộc chương trình đào tạo */
    handleEducationProgramChange = (value) => {
        const { education } = this.props;
        if (value[0] !== '') {
            let educationInfo = education.listAll.filter(x => x._id === value[0]);

            this.props.getAllEmployee({ organizationalUnits: educationInfo[0].applyForOrganizationalUnits, position: educationInfo[0].applyForPositions });
        }
        this.validateEducationProgram(value[0], true);
    }
    validateEducationProgram = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = CourseFormValidator.validateEducationProgram(value, translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEducationProgram: msg,
                    educationProgram: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi thời gian bắt đầu
     * @param {*} value : Thời gian bắt đầu
     */
    handleStartDateChange = (value) => {
        const { translate } = this.props;
        let { errorOnEndDate, endDate } = this.state;

        let errorOnStartDate;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partEndDate = endDate.split('-');
        let d = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'));

        if (date.getTime() > d.getTime()) {
            errorOnStartDate = translate('training.course.start_date_before_end_date');
        } else {
            errorOnEndDate = undefined
        }

        this.setState({
            startDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })
    }

    /**
     * Bắt sự kiện thay đổi thời gian kết thúc
     * @param {*} value : Thời gian kết thúc
     */
    handleEndDateChange = (value) => {
        const { translate } = this.props;
        let { startDate, errorOnStartDate } = this.state;

        let errorOnEndDate;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partStartDate = startDate.split('-');
        let d = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'));

        if (d.getTime() > date.getTime()) {
            errorOnEndDate = translate('training.course.end_date_after_start_date');
        } else {
            errorOnStartDate = undefined;
        }

        this.setState({
            endDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })
    }

    /**
     * Bắt sự kiện thêm nhân viên tham gia
     * @param {*} value : Array id nhân viên tham gia
     */
    handleEmployeeChange = (value) => {
        this.setState({
            addEmployees: value.map(x => { return { _id: x, result: 'failed' } })
        })
    }

    /**
     * Bắt sự kiện xoá nhân viên tham gia
     * @param {*} id : Id nhân viên muốn xoá
     */
    handleDelete = (id) => {
        console.log(id);
        console.log(this.state.listEmployees)
        this.setState({
            listEmployees: this.state.listEmployees.filter(x => x._id !== id)
        })
    }

    /** Bắt sự kiện click buttom thêm nhân viên tham gia */
    handleAdd = (e) => {
        e.preventDefault();
        this.setState({
            listEmployees: this.state.listEmployees.concat(this.state.addEmployees),
            addEmployees: [],
        })
    }

    /**
     * Bắt sự kiện thay đổi kết quả khoá học của nhân viên
     * @param {*} id : Id nhân viên
     * @param {*} value : Kết quả khoá học
     */
    handleResultChange = async (id, value) => {
        let listEmployees = this.state.listEmployees;
        for (let n in listEmployees) {
            if (listEmployees[n]._id === id) {
                if (value === 'pass') {
                    listEmployees[n].result = 'failed'
                } else if (value === 'failed') {
                    listEmployees[n].result = 'pass'
                }
            }
        }
        await this.setState({
            listEmployees: listEmployees
        })
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    isFormValidated = () => {
        const { startDate, endDate, name, coursePlace, educationProgram, cost, employeeCommitmentTime } = this.state;

        let result =
            this.validateCourseName(name, false) &&
            this.validateCoursePlace(coursePlace, false) && this.validateCost(cost, false) &&
            this.validateEducationProgram(educationProgram, false) && this.validateEmployeeCommitmentTime(employeeCommitmentTime, false);

        let partStart = startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        let partEnd = endDate.split('-');
        let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-');

        if (new Date(startDateNew).getTime() <= new Date(endDateNew).getTime()) {
            return result;
        } else return false;
    }

    save = () => {
        let { startDate, endDate, listEmployees } = this.state;

        let partStart = startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        let partEnd = endDate.split('-');
        let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-');

        listEmployees = listEmployees.concat(this.state.addEmployees);

        if (this.isFormValidated()) {
            this.props.updateCourse(this.state._id, { ...this.state, listEmployees: listEmployees, startDate: startDateNew, endDate: endDateNew });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                unit: nextProps.unit,
                name: nextProps.name,
                courseId: nextProps.courseId,
                offeredBy: nextProps.offeredBy,
                coursePlace: nextProps.coursePlace,
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
                cost: nextProps.cost,
                lecturer: nextProps.lecturer,
                applyForOrganizationalUnits: nextProps.applyForOrganizationalUnits,
                applyForPositions: nextProps.applyForPositions,
                educationProgram: nextProps.educationProgram,
                employeeCommitmentTime: nextProps.employeeCommitmentTime,
                type: nextProps.type,
                listEmployees: nextProps.listEmployees,
                addEmployees: [],

                errorOnCourseName: undefined,
                errorOnCoursePlace: undefined,
                errorOnOfferedBy: undefined,
                errorOnCost: undefined,
                errorOnEmployeeCommitmentTime: undefined,
                errorOnEducationProgram: undefined,
                errorOnStartDate: undefined,
                errorOnEndDate: undefined,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps._id !== this.state._id) {
            this.props.getAllEmployee({ organizationalUnits: nextProps.applyForOrganizationalUnits, position: nextProps.applyForPositions });
        }
        return true;
    }

    render() {
        const { education, translate, course, employeesManager } = this.props;

        const { _id, name, courseId, type, offeredBy, coursePlace, startDate, unit, listEmployees, endDate, cost, lecturer,
            employeeCommitmentTime, educationProgram, errorOnCourseName, errorOnCoursePlace, errorOnOfferedBy,
            errorOnCost, errorOnEmployeeCommitmentTime, errorOnEducationProgram, errorOnStartDate, errorOnEndDate } = this.state;

        let listEducations = education.listAll, employeeInfors = [], userlist = [];

        if (employeesManager.listEmployeesOfOrganizationalUnits.length !== 0) {
            userlist = employeesManager.listEmployeesOfOrganizationalUnits;
        }

        if (listEmployees.length !== 0) {
            for (let n in listEmployees) {
                userlist = userlist.filter(x => x._id !== listEmployees[n]._id);
                let employeeInfor = employeesManager.listEmployeesOfOrganizationalUnits.filter(x => x._id === listEmployees[n]._id);
                employeeInfor[0] = { ...employeeInfor[0], result: listEmployees[n].result }
                employeeInfors = employeeInfor.concat(employeeInfors);
            }
        }

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-edit-course${_id}`} isLoading={course.isLoading}
                    formID={`form-edit-course${_id}`}
                    title={translate('training.course.edit_course')}
                    func={this.save}
                    size={75}
                    maxWidth={850}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-edit-course${_id}`} >
                        <div className="row">
                            {/* Mã khoá đào tạo*/}
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>{translate('training.course.table.course_code')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="courseId" value={courseId} autoComplete="off" disabled />
                            </div>
                            {/* Tên khoá đào tạo*/}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnCourseName && "has-error"}`}>
                                <label>{translate('training.course.table.course_name')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="name" value={name} onChange={this.handleCourseNameChange} autoComplete="off" />
                                <ErrorLabel content={errorOnCourseName} />
                            </div>
                        </div>
                        <div className="row">
                            {/* Thời gian bắt đầu */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && "has-error"}`}>
                                <label>{translate('training.course.start_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit_start_date${_id}`}
                                    deleteValue={false}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            {/* Thời gian kết thúc */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate && "has-error"}`}>
                                <label>{translate('training.course.end_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit_end_date${_id}`}
                                    deleteValue={false}
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                                <ErrorLabel content={errorOnEndDate} />
                            </div>
                        </div>
                        <div className="row">
                            {/* Địa điểm đào tạo */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnCoursePlace && "has-error"}`}>
                                <label>{translate('training.course.table.course_place')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="coursePlace" value={coursePlace} onChange={this.handleCoursePlaceChange} autoComplete="off" />
                                <ErrorLabel content={errorOnCoursePlace} />
                            </div>
                            {/* Đơn vị đào tạo */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnOfferedBy && "has-error"}`}>
                                <label>{translate('training.course.table.offered_by')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="offeredBy" value={offeredBy} onChange={this.handleOfferedByChange} autoComplete="off" />
                                <ErrorLabel content={errorOnOfferedBy} />
                            </div>
                        </div>
                        <div className="row">
                            {/* Giảng viên */}
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>{translate('training.course.table.lecturer')}</label>
                                <input type="text" className="form-control" name="lecturer" value={lecturer} onChange={this.handleChange} autoComplete="off" />
                            </div>
                            {/* Loại đào tạo */}
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>{translate('training.course.table.course_type')}<span className="text-red">*</span></label>
                                <select className="form-control" value={type} name="type" onChange={this.handleChange}>
                                    <option value="internal">{translate('training.course.type.internal')}</option>
                                    <option value="external">{translate('training.course.type.external')}</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            {/* Thuộc chương trình đào tạo*/}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEducationProgram && "has-error"}`}>
                                <label>{translate('training.course.table.education_program')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`edit-educationProgram${_id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={educationProgram}
                                    items={[...listEducations.map(x => { return { value: x._id, text: x.name } }), { value: "", text: 'Chọn chương trình đào tạo' }]}
                                    onChange={this.handleEducationProgramChange}
                                    disabled={listEmployees.length !== 0 ? true : false}
                                />
                                <ErrorLabel content={errorOnEducationProgram} />
                            </div>
                            {/* Chi phi đào tạo */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnCost && "has-error"}`}>
                                <label>{translate('training.course.table.cost')}<span className="text-red">*</span></label>
                                <div>
                                    <input type="number" className="form-control" name="cost" value={cost} onChange={this.handleCostChange} style={{ display: "inline", width: "80%" }} autoComplete="off" placeholder="Chi phí đào tạo" />
                                    <select className="form-control" name="unit" value={unit} onChange={this.handleChange} style={{ display: "inline", width: "20%" }}>
                                        <option value="VND">VND</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </div>
                                <ErrorLabel content={errorOnCost} />
                            </div>
                        </div>
                        <div className="row">
                            {/* Thời gian cam kêt */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEmployeeCommitmentTime && "has-error"}`}>
                                <label>{translate('training.course.table.employee_commitment_time')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="employeeCommitmentTime" value={employeeCommitmentTime} onChange={this.handleEmployeeCommitmentTimeChange} autoComplete="off" />
                                <ErrorLabel content={errorOnEmployeeCommitmentTime} />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0, marginTop: 20 }}>
                            <label>{translate('training.course.employee_attend')}</label>
                            <div>
                                <div className="employeeBox2">
                                    <SelectBox
                                        id={`edit-employee${_id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={userlist.map(x => { return { value: x._id, text: `${x.fullName} - ${x.employeeNumber}` } })}
                                        onChange={this.handleEmployeeChange}
                                        multiple={true}
                                    />
                                </div>
                                <button type="button" className="btn btn-success pull-right" style={{ marginBottom: 5 }} onClick={this.handleAdd}>{translate('human_resource.profile.add_staff')}</button>
                            </div>
                        </div>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>{translate('human_resource.staff_number')}</th>
                                    <th>{translate('human_resource.staff_name')}</th>
                                    <th>{translate('training.course.table.result')}</th>
                                    <th style={{ width: "120px" }}>{translate('general.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (employeeInfors.length !== 0 && employeeInfors) &&
                                    employeeInfors.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.employeeNumber}</td>
                                            <td>{x.fullName}</td>
                                            <td>
                                                <div>
                                                    <div className="radio-inline">
                                                        <input type="radio" name={`result${x._id}`} value="pass" checked={x.result === 'pass'}
                                                            onChange={() => this.handleResultChange(x._id, x.result)} />
                                                        <label>{translate('training.course.result.pass')}</label>
                                                    </div>
                                                    <div className="radio-inline">
                                                        <input type="radio" name={`result${x._id}`} value="failed" checked={x.result === "failed"}
                                                            onChange={() => this.handleResultChange(x._id, x.result)} />
                                                        <label>{translate('training.course.result.falied')}</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <a className="delete" title="Delete" onClick={() => this.handleDelete(x._id)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {employeesManager.isLoading ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            (!employeeInfors || employeeInfors.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
};

function mapState(state) {
    const { course, education, employeesManager } = state;
    return { course, education, employeesManager };
};

const actionCreators = {
    updateCourse: CourseActions.updateCourse,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
};

const editForm = connect(mapState, actionCreators)(withTranslate(CourseEditForm));
export { editForm as CourseEditForm };
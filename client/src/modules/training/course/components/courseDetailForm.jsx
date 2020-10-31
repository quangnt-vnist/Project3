import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../common-components';

class CourseDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
                educationProgram: nextProps.educationProgram,
                employeeCommitmentTime: nextProps.employeeCommitmentTime,
                type: nextProps.type,
                listEmployees: nextProps.listEmployees,
                addEmployees: [],
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps._id !== this.state._id) {
            return true;
        }
        return false;
    }

    render() {
        const { course, translate } = this.props

        const { _id, name, courseId, type, offeredBy, coursePlace, startDate, unit, listEmployees,
            endDate, cost, lecturer, employeeCommitmentTime, educationProgram } = this.state;

        let formater = new Intl.NumberFormat();
        let faliedNumber = 0, passNumber = 0, total = 0;

        if (listEmployees && listEmployees.length !== 0) {
            listEmployees.forEach(x => {
                if (x.result === "failed") {
                    faliedNumber += 1;
                } else {
                    passNumber += 1;
                }
            })
        }

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-view-course${_id}`} isLoading={course.isLoading}
                    formID={`form-view-course${_id}`}
                    title={`${translate('training.course.view_course')}: ${name} - ${courseId}`}
                    hasSaveButton={false}
                    size={75}
                    maxWidth={850}
                    hasNote={false}
                >
                    <form className="form-group" id={`form-view-course${_id}`} >
                        <div className="form-group">
                            <span>{translate('training.course.study_at')}</span>
                            <span className="text-success" style={{ fontWeight: "bold" }}>&nbsp;{coursePlace}</span>
                            <span>,&nbsp;{translate('training.course.from')}</span>
                            <span className="text-success" style={{ fontWeight: "bold" }}>&nbsp;{startDate}&nbsp;</span>
                            <span>{translate('training.course.to')}</span>
                            <span className="text-success" style={{ fontWeight: "bold" }}>&nbsp;{endDate}&nbsp;</span>
                            {
                                lecturer && <span>{translate('training.course.with_lecturer')} "{lecturer}"</span>
                            }
                        </div>
                        <div className="form-group">
                            <span>{translate('training.course.offered_by')} "{offeredBy}" - {translate('training.course.table.education_program')} "{educationProgram.name}"</span>
                        </div>
                        <div className="form-group">
                            <span>{translate('training.course.belong_type')} "{translate(`training.course.type.${type}`)}" {translate('training.course.with_cost')} "{formater.format(cost)} {unit}" {translate('training.course.commitment_time')} "{employeeCommitmentTime} {translate('training.course.month')}" </span>
                        </div>
                        <div className="form-group">
                            <span>{total} {translate('training.course.staff')} {translate('training.course.attend')}</span>
                            <span className="text-success" style={{ fontWeight: "bold" }}>&nbsp;- {passNumber}  {translate('training.course.result.pass')}&nbsp;</span>
                            <span className="text-danger" style={{ fontWeight: "bold" }}>&nbsp;- {faliedNumber} {translate('training.course.result.falied')}&nbsp;</span>
                        </div>
                        <div className="form-group">
                            <label className="pull-left">{translate('training.course.employee_attend')}:</label>
                        </div>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>{translate('human_resource.staff_number')}</th>
                                    <th>{translate('human_resource.staff_name')}</th>
                                    <th>{translate('training.course.table.result')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listEmployees && listEmployees.length !== 0 &&
                                    listEmployees.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.employee.employeeNumber}</td>
                                            <td>{x.employee.fullName}</td>
                                            <td>{x.result}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {course.isLoading ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            (!listEmployees || listEmployees.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
}

function mapState(state) {
    const { course } = state;
    return { course };
};

const detailForm = connect(mapState, null)(withTranslate(CourseDetailForm));
export { detailForm as CourseDetailForm };
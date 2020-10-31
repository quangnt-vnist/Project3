import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, ButtonModal, SelectBox } from '../../../../../common-components';

import { CourseFormValidator } from '../../../../training/course/components/courseFormValidator';

class CourseAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: 'failed',
            course: '',
            nameCourse: ''
        }
    }

    // Bắt sự kiện thay đổi kết quả đào tạo
    handleResultChange = (value) => {
        this.setState({
            result: value[0]
        });
    }

    // Bắt sự kiện thay đổi mã khoá đào tạo
    handleCourseIdChange = (value) => {
        this.validateCourseId(value[0], true);
        let nameCourse = '';
        this.props.course.listCourses.forEach(x => {
            if (x._id === value[0]) {
                nameCourse = x.name
            }
        });
        this.setState({
            nameCourse: nameCourse
        })
    }
    validateCourseId = (value, willUpdateState = true) => {
        let msg = CourseFormValidator.validateCourseId(value, this.props.translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCourseId: msg,
                    course: value,
                }
            });
        }
        return msg === undefined;
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        return this.validateCourseId(this.state.course, false);
    }

    // Bắt sự kiện submit form
    save = async () => {
        if (this.isFormValidated()) {
            this.props.handleChange(this.state);
        }
    }
    render() {
        const { listCourses } = this.props.course;
        const { translate, id, roles } = this.props;
        const { errorOnCourseId, course, result, nameCourse } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-create-course-${id}`} button_name={translate('modal.create')} title='Thêm mới khoá đào tạo' />
                <DialogModal
                    size='50' modalID={`modal-create-course-${id}`} isLoading={false}
                    formID={`form-create-course-${id}`}
                    title='Thêm mới khoá đào tạo'
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    maxWidth={500}
                >
                    <form className="form-group" id={`form-create-course-${id}`}>
                        {(!roles || roles.length == 0) &&
                            <div className="col-sm-12 col-xs-12 form-group">
                                <span className="text-red">Nhân viên chưa thuộc phòng ban nào</span>
                            </div>
                        }
                        <div className={`col-sm-12 col-xs-12 form-group ${errorOnCourseId && "has-error"}`}>
                            <label>Mã khoá đào tạo<span className="text-red">*</span></label>
                            <SelectBox
                                id={`create_courseID_course${id}`}
                                disabled={!roles || roles.length == 0}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={course}
                                items={[...listCourses.map((u, i) => { return { value: u._id, text: u.courseId } }), { value: '', text: 'Chọn khoá đào tạo' }]}
                                onChange={this.handleCourseIdChange}
                            />
                            <ErrorLabel content={errorOnCourseId} />
                        </div>
                        <div className={`form-group col-sm-12 col-xs-12`}>
                            <label>Tên khoá đào tạo<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={nameCourse} placeholder='Tên khoá đào tạo' disabled />
                        </div>
                        <div className={`form-group col-sm-12 col-xs-12`}>
                            <label>Kết quả<span className="text-red">*</span></label>
                            <SelectBox
                                id={`create_result_course${id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={result}
                                items={[{ value: 'pass', text: 'Đạt' }, { value: 'failed', text: 'Không đạt' },]}
                                onChange={this.handleResultChange}
                            />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { course } = state;
    return { course };
};

const addModal = connect(mapState, null)(withTranslate(CourseAddModal));
export { addModal as CourseAddModal };

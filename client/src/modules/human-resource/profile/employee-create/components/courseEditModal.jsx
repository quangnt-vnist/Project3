import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, ButtonModal, SelectBox } from '../../../../../common-components';
class CourseEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    // Bắt sự kiện thay đổi kết quả đào tạo
    handleResultChange = (value) => {
        this.setState({
            result: value[0]
        });
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                _id: nextProps._id,
                index: nextProps.index,
                course: nextProps.courseId,
                result: nextProps.result,
                nameCourse: nextProps.nameCourse,
            }
        } else {
            return null;
        }
    }

    // Bắt sự kiện submit form
    save = async () => {
        this.props.handleChange(this.state);
    }
    render() {
        const { listCourses } = this.props.course;
        const { translate, id, } = this.props;
        const { course, result, nameCourse } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-course-${id}`} isLoading={false}
                    formID={`form-edit-course-${id}`}
                    title='Chỉnh sửa khoá đào tạo'
                    func={this.save}
                    disableSubmit={false}
                    maxWidth={500}
                >
                    <form className="form-group" id={`form-edit-course-${id}`}>
                        <div className={`col-sm-12 col-xs-12 form-group`}>
                            <label>Mã khoá đào tạo<span className="text-red">*</span></label>
                            <SelectBox
                                id={`edit_courseID_course${id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={course}
                                items={[...listCourses.map((u, i) => { return { value: u._id, text: u.courseId } }), { value: '', text: 'Chọn khoá đào tạo' }]}
                                onChange={this.handleCourseIdChange}
                                disabled={true}
                            />
                        </div>
                        <div className={`form-group col-sm-12 col-xs-12`}>
                            <label>Tên khoá đào tạo<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={nameCourse} placeholder='Tên khoá đào tạo' disabled />
                        </div>
                        <div className={`form-group col-sm-12 col-xs-12`}>
                            <label>Kết quả<span className="text-red">*</span></label>
                            <SelectBox
                                id={`edit_result_course${id}`}
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
const editModal = connect(mapState, null)(withTranslate(CourseEditModal));
export { editModal as CourseEditModal };

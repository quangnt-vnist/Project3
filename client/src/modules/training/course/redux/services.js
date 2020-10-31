import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const CourseService = {
    getListCourse,
    createNewCourse,
    deleteCourse,
    updateCourse,
}
/**
 * Lấy danh sách các khoá đào tạo 
 * @data : dữ liệu key tìm kiếm
 */
function getListCourse(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/course/courses`,
        method: 'GET',
        params: {
            courseId: data !== undefined ? data.courseId : data,
            type: data !== undefined ? data.type : data,
            page: data !== undefined ? data.page : data,
            limit: data !== undefined ? data.limit : data,
            educationProgram: data !== undefined ? data.educationProgram : data,
            organizationalUnits: data !== undefined ? data.organizationalUnits : data,
            positions: data !== undefined ? data.positions : data,
        }
    }, false, true, 'training.course');
}

/**
 * Tạo mới một khoá đào tạo
 * @data : Dữ liệu khoá đào tạo
 */
function createNewCourse(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/course/courses`,
        method: 'POST',
        data: data,
    }, true, true, 'training.course');
}

/**
 * Xoá khoá đào tạo
 * @id : Id khoá đào tạo cần xoá
 */
function deleteCourse(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/course/courses/${id}`,
        method: 'DELETE',
    }, true, true, 'training.course');
}

/**
 * Cập nhật thông tin khoá đào tạo
 * @id : id khoá đào tạo cần chỉnh sửa
 * @data : dữ liệu chỉnh sửa khoá đào tạo
 */
function updateCourse(id, data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/course/courses/${id}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'training.course');
}
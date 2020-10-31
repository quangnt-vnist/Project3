import {
    CourseConstants
} from "./constants";

import {
    CourseService
} from "./services";

export const CourseActions = {
    getListCourse,
    createNewCourse,
    deleteCourse,
    updateCourse,
};

/**
 * Lấy danh sách các khoá đào tạo
 * @param {*} data : Key tìm kiếm
 */
function getListCourse(data) {
    return dispatch => {
        dispatch({
            type: CourseConstants.GET_LIST_COURSE_REQUEST
        });

        CourseService.getListCourse(data)
            .then(res => {
                dispatch({
                    type: CourseConstants.GET_LIST_COURSE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CourseConstants.GET_LIST_COURSE_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Tạo mới khoá đào tạo
 * @param {*} data : Thông tin khoá đào tạo
 */
function createNewCourse(data) {
    return dispatch => {
        dispatch({
            type: CourseConstants.CREATE_COURSE_REQUEST,
        });

        CourseService.createNewCourse(data)
            .then(res => {
                dispatch({
                    type: CourseConstants.CREATE_COURSE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CourseConstants.CREATE_COURSE_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Xoá một khoá đào tạo
 * @param {*} id : Id nhân viên cần xoá
 */
function deleteCourse(id) {
    return dispatch => {
        dispatch({
            type: CourseConstants.DELETE_COURSE_REQUEST,
        });
        CourseService.deleteCourse(id)
            .then(res => {
                dispatch({
                    type: CourseConstants.DELETE_COURSE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CourseConstants.DELETE_COURSE_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Cập nhật thông tin của khoá đào tạo
 * @param {*} id : Id khoá đào tạo cần cập nhật
 * @param {*} infoCourse : Thông tin khoá đào tạo
 */
function updateCourse(id, infoCourse) {
    return dispatch => {
        dispatch({
            type: CourseConstants.UPDATE_COURSE_REQUEST,
        });

        CourseService.updateCourse(id, infoCourse)
            .then(res => {
                dispatch({
                    type: CourseConstants.UPDATE_COURSE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CourseConstants.UPDATE_COURSE_FAILURE,
                    error: err
                });
            })
    }
}
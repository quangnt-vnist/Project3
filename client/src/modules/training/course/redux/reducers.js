import {
    CourseConstants
} from './constants';

const initState = {
    isLoading: false,
    listCourses: [],
    courseByEducations: [],
    totalList: "",
    error: "",
}

export function course(state = initState, action) {
    switch (action.type) {
        case CourseConstants.GET_LIST_COURSE_REQUEST:
        case CourseConstants.CREATE_COURSE_REQUEST:
        case CourseConstants.DELETE_COURSE_REQUEST:
        case CourseConstants.UPDATE_COURSE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case CourseConstants.GET_LIST_COURSE_SUCCESS:
            return {
                ...state,
                listCourses: action.payload.listCourses,
                    totalList: action.payload.totalList !== undefined ? action.payload.totalList : [],
                    isLoading: false,
            };
        case CourseConstants.CREATE_COURSE_SUCCESS:
            console.log(action.payload._id);
            console.log(state.listCourse);
            return {
                ...state,
                listCourses: [
                        ...state.listCourses,
                        action.payload
                    ],
                    isLoading: false,
            };
        case CourseConstants.DELETE_COURSE_SUCCESS:
            console.log(action.payload);
            console.log(state.listCourses);
            return {
                ...state,
                listCourses: state.listCourses.filter(course => course._id !== action.payload._id),
                    isLoading: false,
            };
        case CourseConstants.UPDATE_COURSE_SUCCESS:
            return {
                ...state,
                listCourses: state.listCourses.map(course =>
                        course._id === action.payload._id ?
                        action.payload : course
                    ),
                    isLoading: false,
            };
        case CourseConstants.GET_LIST_COURSE_FAILURE:
        case CourseConstants.CREATE_COURSE_FAILURE:
        case CourseConstants.DELETE_COURSE_FAILURE:
        case CourseConstants.UPDATE_COURSE_FAILURE:
            return {
                ...state,
                isLoading: false,
                    error: action.error
            };
        default:
            return state
    }
}
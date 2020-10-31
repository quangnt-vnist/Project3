import {
    EducationConstants
} from './constants';

const initState = {
    isLoading: false,
    listAll: [],
    listEducations: [],
    totalList: "",
    error: "",
}

export function education(state = initState, action) {
    switch (action.type) {
        case EducationConstants.GET_LISTEDUCATION_REQUEST:
        case EducationConstants.CREATE_EDUCATION_REQUEST:
        case EducationConstants.DELETE_EDUCATION_REQUEST:
        case EducationConstants.UPDATE_EDUCATION_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case EducationConstants.GET_LISTEDUCATION_SUCCESS:
            if (action.payload.totalList !== undefined) {
                return {
                    ...state,
                    listEducations: action.payload.listEducations,
                    totalList: action.payload.totalList,
                    isLoading: false,
                };
            } else {
                return {
                    ...state,
                    listAll: action.payload,
                    isLoading: false,
                };
            };
        case EducationConstants.CREATE_EDUCATION_SUCCESS:
            return {
                ...state,
                listEducations: [
                        ...state.listEducations,
                        action.payload
                    ],
                    isLoading: false,
            };
        case EducationConstants.DELETE_EDUCATION_SUCCESS:
            console.log(action.payload);
            return {
                ...state,
                listEducations: state.listEducations.filter(education => education._id !== action.payload._id),
                    isLoading: false,
            };
        case EducationConstants.UPDATE_EDUCATION_SUCCESS:
            return {
                ...state,
                listEducations: state.listEducations.map(education =>
                        education._id === action.payload._id ?
                        action.payload : education
                    ),
                    isLoading: false,
            };
        case EducationConstants.GET_LISTEDUCATION_FAILURE:
        case EducationConstants.CREATE_EDUCATION_FAILURE:
        case EducationConstants.DELETE_EDUCATION_FAILURE:
        case EducationConstants.UPDATE_EDUCATION_FAILURE:
            return {
                ...state,
                isLoading: false,
                    error: action.error
            };
        default:
            return state
    }
}
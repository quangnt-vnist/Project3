import {
    DisciplineConstants
} from './constants';

const initState = {
    isLoading: false,
    totalListDiscipline: 0,
    listDisciplines: [],

    totalListDisciplineOfYear: 0,
    totalListCommendationOfYear: 0,

    totalListCommendation: 0,
    listCommendations: [],
    error: ""
}

export function discipline(state = initState, action) {
    switch (action.type) {
        /**************************
         * Start
         * Reducer quản lý kỷ luật
         **************************/
        case DisciplineConstants.GET_DISCIPLINE_REQUEST:
        case DisciplineConstants.CREATE_DISCIPLINE_REQUEST:
        case DisciplineConstants.DELETE_DISCIPLINE_REQUEST:
        case DisciplineConstants.UPDATE_DISCIPLINE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case DisciplineConstants.GET_DISCIPLINE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listDisciplines: action.payload.listDisciplines !== undefined ? action.payload.listDisciplines : [],
                    totalListDiscipline: action.payload.totalList,
                    totalListDisciplineOfYear: action.payload.totalListOfYear ? action.payload.totalListOfYear : 0
            };
        case DisciplineConstants.CREATE_DISCIPLINE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listDisciplines: [...state.listDisciplines, action.payload]
            };
        case DisciplineConstants.DELETE_DISCIPLINE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listDisciplines: state.listDisciplines.filter(discipline => (discipline._id !== action.payload._id))
            };
        case DisciplineConstants.UPDATE_DISCIPLINE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listDisciplines: state.listDisciplines.map(discipline => (discipline._id === action.payload._id) ? action.payload : discipline)
            };
        case DisciplineConstants.GET_DISCIPLINE_FAILURE:
        case DisciplineConstants.CREATE_DISCIPLINE_FAILURE:
        case DisciplineConstants.DELETE_DISCIPLINE_FAILURE:
        case DisciplineConstants.UPDATE_DISCIPLINE_FAILURE:
            return {
                ...state,
                isLoading: false,
                    error: action.error
            };
        /**************************
         * End
         * Reducer quản lý kỷ luật
         **************************/

        /**************************
         * Start
         * Reducer quản lý khen thưởng
         **************************/
        case DisciplineConstants.GET_PRAISE_REQUEST:
        case DisciplineConstants.CREATE_PRAISE_REQUEST:
        case DisciplineConstants.DELETE_PRAISE_REQUEST:
        case DisciplineConstants.UPDATE_PRAISE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case DisciplineConstants.GET_PRAISE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listCommendations: action.payload.listCommendations !== undefined ? action.payload.listCommendations : [],
                    totalListCommendation: action.payload.totalList,
                    totalListCommendationOfYear: action.payload.totalListOfYear ? action.payload.totalListOfYear : 0
            };
        case DisciplineConstants.CREATE_PRAISE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listCommendations: [...state.listCommendations, action.payload],
            };
        case DisciplineConstants.DELETE_PRAISE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listCommendations: state.listCommendations.filter(commendation => (commendation._id !== action.payload._id))
            };
        case DisciplineConstants.UPDATE_PRAISE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listCommendations: state.listCommendations.map(commendation => (commendation._id === action.payload._id) ? action.payload : commendation),
            };
        case DisciplineConstants.GET_PRAISE_FAILURE:
        case DisciplineConstants.CREATE_PRAISE_FAILURE:
        case DisciplineConstants.DELETE_PRAISE_FAILURE:
        case DisciplineConstants.UPDATE_PRAISE_FAILURE:
            return {
                ...state,
                isLoading: false,
                    error: action.error
            };
        default:
            return state;
        /**************************
         * Start
         * Reducer quản lý khen thưởng
         **************************/
    }
}
import { RecommendProcureConstants } from './constants';

const initState = {
    isLoading: false,
    listRecommendProcures: [],
    totalList: "",
    error: "",
}

export function recommendProcure(state = initState, action) {
    switch (action.type) {
        case RecommendProcureConstants.GET_RECOMMEND_PROCURE_REQUEST:
        case RecommendProcureConstants.CREATE_RECOMMEND_PROCURE_REQUEST:
        case RecommendProcureConstants.UPDATE_RECOMMEND_PROCURE_REQUEST:
        case RecommendProcureConstants.DELETE_RECOMMEND_PROCURE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        
        case RecommendProcureConstants.GET_RECOMMEND_PROCURE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRecommendProcures: action.payload.listRecommendProcures,
                totalList: action.payload.totalList,
            };
        case RecommendProcureConstants.CREATE_RECOMMEND_PROCURE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRecommendProcures: [...state.listRecommendProcures, action.payload],
            };
        
        case RecommendProcureConstants.UPDATE_RECOMMEND_PROCURE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRecommendProcures: state.listRecommendProcures.map(recommendProcure => recommendProcure._id === action.payload._id ? action.payload : recommendProcure),
            };
        
        case RecommendProcureConstants.DELETE_RECOMMEND_PROCURE_SUCCESS:

            return {
                ...state,
                isLoading: false,
                listRecommendProcures: state.listRecommendProcures.filter(recommendProcure => (recommendProcure._id !== action.payload._id)),
            };
        
        case RecommendProcureConstants.GET_RECOMMEND_PROCURE_FAILURE:
        case RecommendProcureConstants.CREATE_RECOMMEND_PROCURE_FAILURE:
        case RecommendProcureConstants.UPDATE_RECOMMEND_PROCURE_FAILURE:
        case RecommendProcureConstants.DELETE_RECOMMEND_PROCURE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        
        default:
            return state
    }
}

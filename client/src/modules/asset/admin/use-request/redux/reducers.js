import { RecommendDistributeConstants } from './constants';

const initState = {
    isLoading: false,
    listRecommendDistributes: [],
    totalList: "",
    error:"",
}

export function recommendDistribute(state =initState, action) {
    switch (action.type) {
        case RecommendDistributeConstants.GET_RECOMMEND_DISTRIBUTE_REQUEST:
        case RecommendDistributeConstants.UPDATE_RECOMMEND_DISTRIBUTE_REQUEST:
        case RecommendDistributeConstants.DELETE_RECOMMEND_DISTRIBUTE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        
        case RecommendDistributeConstants.GET_RECOMMEND_DISTRIBUTE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRecommendDistributes: action.payload.listRecommendDistributes,
                totalList: action.payload.totalList,
            };
      
        case RecommendDistributeConstants.UPDATE_RECOMMEND_DISTRIBUTE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRecommendDistributes: state.listRecommendDistributes.map(recommendDistribute => recommendDistribute._id === action.payload._id ? action.payload : recommendDistribute),
            };
        
        case RecommendDistributeConstants.DELETE_RECOMMEND_DISTRIBUTE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRecommendDistributes: state.listRecommendDistributes.filter(recommendDistribute => (recommendDistribute._id !== action.payload._id)),
            };
        
        case RecommendDistributeConstants.GET_RECOMMEND_DISTRIBUTE_FAILURE:
        case RecommendDistributeConstants.UPDATE_RECOMMEND_DISTRIBUTE_FAILURE:
        case RecommendDistributeConstants.DELETE_RECOMMEND_DISTRIBUTE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        
        default:
            return state
    }
}

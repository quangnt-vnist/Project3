import { GoodConstants } from './constants';

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}

const initState = {
    isLoading: false,
    listGoods: [],
    listALLGoods: [],
    listGoodsByType: [],
    listGoodsByCategory: [],
    listPaginate: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
    type: ''
}

export function goods(state = initState, action) {

    var index = -1;
    var indexPaginate = -1;

    switch (action.type) {
        case GoodConstants.GET_GOOD_BY_TYPE_REQUEST:
        case GoodConstants.GETALL_GOOD_BY_TYPE_REQUEST:
        case GoodConstants.GETALL_GOODS_REQUEST:
        case GoodConstants.GETALL_GOOD_BY_CATEGORY_REQUEST:
        case GoodConstants.PAGINATE_GOOD_BY_TYPE_REQUEST:
        case GoodConstants.CREATE_GOOD_REQUEST:
        case GoodConstants.UPDATE_GOOD_REQUEST:
        case GoodConstants.GET_GOOD_DETAIL_REQUEST:
        case GoodConstants.DELETE_GOOD_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        
        case GoodConstants.GET_GOOD_BY_TYPE_FAILURE:
        case GoodConstants.GETALL_GOOD_BY_TYPE_FAILURE:
        case GoodConstants.GETALL_GOODS_FAILURE:
        case GoodConstants.GETALL_GOOD_BY_CATEGORY_FAILURE:
        case GoodConstants.PAGINATE_GOOD_BY_TYPE_FAILURE:
        case GoodConstants.CREATE_GOOD_FAILURE:
        case GoodConstants.UPDATE_GOOD_FAILURE:
        case GoodConstants.GET_GOOD_DETAIL_FAILURE:
        case GoodConstants.DELETE_GOOD_FAILURE:
            return {
                ...state,
                isLoading: false
            };
        
        case GoodConstants.GETALL_GOOD_BY_TYPE_SUCCESS:
            return {
                ...state,
                listGoodsByType: action.payload,
                isLoading: false
            };

        case GoodConstants.GETALL_GOOD_BY_CATEGORY_SUCCESS:
            return {
                ...state,
                listGoodsByCategory: action.payload,
                isLoading: false
            };

        case GoodConstants.GET_GOOD_BY_TYPE_SUCCESS:
            console.log("GOOD", action.payload);
            return {
                ...state,
                listGoods: action.payload,
                isLoading: false
            };
        
        case GoodConstants.GETALL_GOODS_SUCCESS:
            return {
                ...state,
                listALLGoods: action.payload,
                isLoading: false
            };

        case GoodConstants.PAGINATE_GOOD_BY_TYPE_SUCCESS:
            return {
                ...state,
                listPaginate: action.payload.docs,
                totalDocs: action.payload.totalDocs,
                limit: action.payload.limit,
                totalPages: action.payload.totalPages,
                page: action.payload.page,
                pagingCounter: action.payload.pagingCounter,
                hasPrevPage: action.payload.hasPrevPage,
                hasNextPage: action.payload.hasNextPage,
                prevPage: action.payload.prevPage,
                nextPage: action.payload.nextPage,
                isLoading: false
            };

        case GoodConstants.CREATE_GOOD_SUCCESS:
            return {
                ...state,
                listGoods: [
                    ...state.listGoods,
                    action.payload
                ],
                listPaginate: [
                    ...state.listPaginate,
                    action.payload
                ],
                isLoading: false
            };

        case GoodConstants.GET_GOOD_DETAIL_SUCCESS:
        case GoodConstants.UPDATE_GOOD_SUCCESS:
            index = findIndex(state.listGoods, action.payload._id);
            indexPaginate = findIndex(state.listPaginate, action.payload._id);

            if(index !== -1){
                state.listGoods[index] = action.payload;
            }

            if(indexPaginate !== -1){
                state.listPaginate[indexPaginate] = action.payload;
            }
            return {
                ...state,
                isLoading: false
            };

        case GoodConstants.DELETE_GOOD_SUCCESS:
            index = findIndex(state.listGoods, action.payload);
            indexPaginate = findIndex(state.listPaginate, action.payload);

            if(index !== -1){
                state.listGoods.splice(index, 1);
            }

            if(indexPaginate !== -1){
                state.listPaginate.splice(indexPaginate, 1);
            }
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}
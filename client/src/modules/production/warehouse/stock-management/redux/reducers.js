import { StockConstants } from './constants';

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
    listStocks: [],
    listPaginate: [],
    stock:'',
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

export function stocks(state = initState, action){
    
    var index = -1;
    var indexPaginate = -1;

    switch(action.type){

        case StockConstants.GET_STOCK_REQUEST:
        case StockConstants.GET_DETAIL_STOCK_REQUEST:
        case StockConstants.PAGINATE_STOCK_REQUEST:
        case StockConstants.CREATE_STOCK_REQUEST:
        case StockConstants.UPDATE_STOCK_REQUEST:
        case StockConstants.DELETE_STOCK_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case StockConstants.GET_STOCK_SUCCESS:
            return {
                ...state,
                listStocks: action.payload,
                isLoading: false
            };
        
        case StockConstants.GET_DETAIL_STOCK_SUCCESS:
            return {
                ...state,
                stock: action.payload,
                isLoading: false
            };

        case StockConstants.PAGINATE_STOCK_SUCCESS:
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

        case StockConstants.CREATE_STOCK_SUCCESS:
            return {
                ...state,
                listStocks: [ ...state.listStocks, action.payload ],
                listPaginate: [ ...state.listPaginate, action.payload],
                isLoading: false
            };

        case StockConstants.UPDATE_STOCK_SUCCESS:
            index = findIndex(state.listStocks, action.payload._id);
            indexPaginate = findIndex(state.listPaginate, action.payload._id);

            if(index !== -1){
                state.listStocks[index] = action.payload
            }

            if(indexPaginate !== -1){
                state.listPaginate[indexPaginate] = action.payload
            }
            return {
                ...state,
                isLoading: false
            };

        case StockConstants.DELETE_STOCK_SUCCESS:
            index = findIndex(state.listStocks, action.payload);
            indexPaginate = findIndex(state.listPaginate, action.payload);

            if(index !== -1){
                state.listStocks.splice(index, 1);
            }

            if(indexPaginate !== -1){
                state.listPaginate.splice(indexPaginate, 1);
            }
            return {
                ...state,
                isLoading: false
            };

        case StockConstants.GET_STOCK_FAILURE:
        case StockConstants.GET_DETAIL_STOCK_FAILURE:
        case StockConstants.PAGINATE_STOCK_FAILURE:
        case StockConstants.CREATE_STOCK_FAILURE:
        case StockConstants.UPDATE_STOCK_FAILURE:
        case StockConstants.DELETE_STOCK_FAILURE:
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}
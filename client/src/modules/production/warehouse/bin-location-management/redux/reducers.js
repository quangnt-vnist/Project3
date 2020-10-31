import { BinLocationConstants } from "./constants";

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
    binLocation: {
        list: [],
        tree: [],
    },
    binLocationByStock: {
        list: [],
        tree: []
    },
    binLocationDetail: '',
    listBinLocation: [],
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
    
}

export function binLocations(state = initState, action){

    var index = -1;

    switch(action.type) {
        case BinLocationConstants.GET_ALL_BIN_LOCATION_REQUEST:
        case BinLocationConstants.GET_BIN_LOCATION_STOCK_REQUEST:
        case BinLocationConstants.GET_PAGINATE_REQUEST:
        case BinLocationConstants.GET_DETAIL_BIN_REQUEST:
        case BinLocationConstants.GET_BIN_LOCATION_CHILD_REQUEST:
        case BinLocationConstants.CREATE_BIN_LOCATION_REQUEST:
        case BinLocationConstants.UPDATE_BIN_LOCATION_REQUEST:
        case BinLocationConstants.DELETE_BIN_LOCATION_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case BinLocationConstants.GET_ALL_BIN_LOCATION_SUCCESS:
            return {
                ...state,
                binLocation: action.payload,
                isLoading: false
            };

        case BinLocationConstants.GET_BIN_LOCATION_STOCK_SUCCESS:
            return {
                ...state,
                binLocationByStock: action.payload,
                isLoading: false
            }

        case BinLocationConstants.GET_BIN_LOCATION_CHILD_SUCCESS:
            return {
                ...state,
                listBinLocation: action.payload,
                isLoading: false
            }

        case BinLocationConstants.GET_PAGINATE_SUCCESS:
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

        case BinLocationConstants.GET_DETAIL_BIN_SUCCESS:
            return {
                ...state,
                binLocationDetail: action.payload,
                isLoading: false
            }
        
        case BinLocationConstants.CREATE_BIN_LOCATION_SUCCESS:
            return {
                ...state,
                binLocation: action.payload,
                isLoading: false
            };

        case BinLocationConstants.UPDATE_BIN_LOCATION_SUCCESS:
            index = findIndex(state.binLocation.list, action.payload._id);

            if(index !== -1){
                state.binLocation.list[index] = action.payload;
            }
            return {
                ...state,
                isLoading: false
            }

        case BinLocationConstants.DELETE_BIN_LOCATION_SUCCESS:
            return {
                ...state,
                binLocation: action.payload,
                isLoading: false
            }

        case BinLocationConstants.GET_ALL_BIN_LOCATION_FAILURE:
        case BinLocationConstants.GET_BIN_LOCATION_STOCK_FAILURE:
        case BinLocationConstants.GET_PAGINATE_FAILURE:
        case BinLocationConstants.GET_DETAIL_BIN_FAILURE:
        case BinLocationConstants.GET_BIN_LOCATION_CHILD_FAILURE:
        case BinLocationConstants.CREATE_BIN_LOCATION_FAILURE:
        case BinLocationConstants.UPDATE_BIN_LOCATION_FAILURE:
        case BinLocationConstants.DELETE_BIN_LOCATION_FAILURE:
            return {
                ...state,
                isLoading: false
            };
        default:
            return state;
    }
}
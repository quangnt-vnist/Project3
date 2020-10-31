import { AssetTypeConstants } from './constants';

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
    listAssetTypes: [],
    totalList: "",
    error: "",

    value: {},
    isLoading: false,
    administration: {
        types: {
            list: [],
            tree: []
        },

        data: {
            list: [],
            paginate: [],
            totalDocs: 0,
            limit: 0,
            totalPages: 0,
            page: 0,
            pagingCounter: 0,
            hasPrevPage: false,
            hasNextPage: false,
            prevPage: 0,
            nextPage: 0,
        },
    },
}

export function assetType(state = initState, action) {
    var index = -1;
    var indexPaginate = -1;
    switch (action.type) {
        case AssetTypeConstants.GET_ASSET_TYPE_REQUEST:
        case AssetTypeConstants.GET_ALL_ASSET_TYPE_REQUEST:
        case AssetTypeConstants.CREATE_ASSET_TYPE_REQUEST:
        case AssetTypeConstants.DELETE_ASSET_TYPE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        
        
        case AssetTypeConstants.GET_ASSET_TYPE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAssetTypes: action.payload.listAssetTypes,
                totalList: action.payload.totalList,
            };
            
        case AssetTypeConstants.GET_ALL_ASSET_TYPE_SUCCESS:
        case AssetTypeConstants.CREATE_ASSET_TYPE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    types: action.payload
                }
            };
        
        case AssetTypeConstants.EDIT_ASSET_TYPE_SUCCESS:
            index = findIndex(state.administration.types.list, action.payload._id);
            if (index !== -1) state.administration.types.list[index] = action.payload;
            indexPaginate = findIndex(state.administration.types.paginate, action.payload._id);
            if (indexPaginate !== -1) state.administration.types.paginate[indexPaginate] = action.payload;
            return {
                ...state,
                isLoading: false
            };
        
        case AssetTypeConstants.DELETE_ASSET_TYPE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    types: action.payload
                }
            };
        
        case AssetTypeConstants.GET_ASSET_TYPE_FAILURE:
        case AssetTypeConstants.CREATE_ASSET_TYPE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };

        case AssetTypeConstants.GET_ALL_ASSET_TYPE_FAILE:
        case AssetTypeConstants.DELETE_ASSET_TYPE_FAILE:
            return {
                ...state,
                isLoading: false,
            };

        default:
            return state
    }
}

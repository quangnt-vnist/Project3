import { CategoryConstants } from "./constants";

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
    categoryToTree: {
        list: [],
        tree: [],
    },
    listCategoriesByType: [],
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

export function categories(state = initState, action){

    var index = -1;

    switch(action.type) {
        case CategoryConstants.GETALL_CATEGORY_TREE_REQUEST:
        case CategoryConstants.GETALL_CATEGORY_BY_TYPE_REQUEST:
        case CategoryConstants.CREATE_CATEGORY_REQUEST:
        case CategoryConstants.UPDATE_CATEGORY_REQUEST:
        case CategoryConstants.DELETE_CATEGORY_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case CategoryConstants.GETALL_CATEGORY_TREE_SUCCESS:
            return {
                ...state,
                categoryToTree: action.payload,
                isLoading: false
            }

        case CategoryConstants.GETALL_CATEGORY_BY_TYPE_SUCCESS:
            return {
                ...state,
                listCategoriesByType: action.payload ? action.payload : [],
                isLoading: false
            };
        
        case CategoryConstants.CREATE_CATEGORY_SUCCESS:
            return {
                ...state,
                categoryToTree: action.payload,
                isLoading: false
            };

        case CategoryConstants.UPDATE_CATEGORY_SUCCESS:
            index = findIndex(state.categoryToTree.list, action.payload._id);

            if(index !== -1){
                state.categoryToTree.list[index] = action.payload;
            }
            return {
                ...state,
                isLoading: false
            }

        case CategoryConstants.DELETE_CATEGORY_SUCCESS:
            return {
                ...state,
                categoryToTree: action.payload,
                isLoading: false
            }

        case CategoryConstants.GETALL_CATEGORY_TREE_FAILURE:
        case CategoryConstants.GETALL_CATEGORY_BY_TYPE_FAILURE:
        case CategoryConstants.CREATE_CATEGORY_FAILURE:
        case CategoryConstants.UPDATE_CATEGORY_FAILURE:
        case CategoryConstants.DELETE_CATEGORY_FAILURE:
            return {
                ...state,
                isLoading: false
            };
        default:
            return state;
    }
}
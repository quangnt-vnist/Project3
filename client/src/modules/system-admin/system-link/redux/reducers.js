import { SystemLinkConstants } from "./constants";

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if(value._id === id){
            result = index;
        }
    });
    return result;
}

const initState = {
    categories: [],
    list: [],
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
    error: null,
    isLoading: true,
    item: null
}

export function systemLinks (state = initState, action) {
    var index = -1;
    var indexPaginate = -1;
    switch (action.type) {

        case SystemLinkConstants.GET_LINKS_DEFAULT_REQUEST:
        case SystemLinkConstants.GET_LINKS_DEFAULT_CATEGORIES_REQUEST:
        case SystemLinkConstants.GET_LINKS_DEFAULT_PAGINATE_REQUEST:
        case SystemLinkConstants.SHOW_LINK_DEFAULT_REQUEST:
        case SystemLinkConstants.CREATE_LINK_DEFAULT_REQUEST:
        case SystemLinkConstants.EDIT_LINK_DEFAULT_REQUEST:
        case SystemLinkConstants.DELETE_LINK_DEFAULT_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case SystemLinkConstants.GET_LINKS_DEFAULT_FAILE:
            case SystemLinkConstants.GET_LINKS_DEFAULT_PAGINATE_FAILE:
            case SystemLinkConstants.SHOW_LINK_DEFAULT_FAILE:
            case SystemLinkConstants.CREATE_LINK_DEFAULT_FAILE:
            case SystemLinkConstants.EDIT_LINK_DEFAULT_FAILE:
            case SystemLinkConstants.DELETE_LINK_DEFAULT_FAILE:
            case SystemLinkConstants.GET_LINKS_DEFAULT_CATEGORIES_FAILE:
                return {
                    ...state,
                    isLoading: false
                };

        case SystemLinkConstants.GET_LINKS_DEFAULT_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            };

        case SystemLinkConstants.GET_LINKS_DEFAULT_CATEGORIES_SUCCESS:
            return {
                ...state,
                categories: action.payload,
                isLoading: false
            };

        case SystemLinkConstants.GET_LINKS_DEFAULT_PAGINATE_SUCCESS:
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

        case SystemLinkConstants.SHOW_LINK_DEFAULT_SUCCESS:
            return {
                ...state,
                item: action.payload,
                isLoading: false
            };

        case SystemLinkConstants.CREATE_LINK_DEFAULT_SUCCESS:
            return {
                ...state,
                list: [
                    action.payload,
                    ...state.list
                ],
                listPaginate: [
                    action.payload,
                    ...state.listPaginate
                ],
                isLoading: false
            };

        case SystemLinkConstants.EDIT_LINK_DEFAULT_SUCCESS:
            index = findIndex(state.list, action.payload._id);
            indexPaginate = findIndex(state.listPaginate, action.payload._id);
            if(index !== -1){
                state.list[index]= action.payload;
            }
            if(indexPaginate !== -1){
                state.listPaginate[indexPaginate] = action.payload;
            }
            return {
                ...state,
                isLoading: false
            };

        case SystemLinkConstants.DELETE_LINK_DEFAULT_SUCCESS:
            index = findIndex(state.list, action.payload);
            indexPaginate = findIndex(state.listPaginate, action.payload);
            if(index !== -1){
                state.list.splice(index,1);
            }
            if(indexPaginate !== -1){
                state.listPaginate.splice(indexPaginate,1);
            }
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}
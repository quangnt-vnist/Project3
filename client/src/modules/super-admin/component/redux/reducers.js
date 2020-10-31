import { ComponentConstants } from "./constants";

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

export function component (state = initState, action) {
    var index = -1;
    var indexPaginate = -1;
    switch (action.type) {

        case ComponentConstants.GET_COMPONENTS_REQUEST:
        case ComponentConstants.GET_COMPONENTS_PAGINATE_REQUEST:
        case ComponentConstants.SHOW_COMPONENT_REQUEST:
        case ComponentConstants.CREATE_COMPONENT_REQUEST:
        case ComponentConstants.EDIT_COMPONENT_REQUEST:
        case ComponentConstants.DELETE_COMPONENT_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case ComponentConstants.GET_COMPONENTS_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            };

        case ComponentConstants.GET_COMPONENTS_PAGINATE_SUCCESS:
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

        case ComponentConstants.SHOW_COMPONENT_SUCCESS:
            return {
                ...state,
                item: action.payload,
                isLoading: false
            };

        case ComponentConstants.CREATE_COMPONENT_SUCCESS:
            return {
                ...state,
                list: [
                    ...state.list,
                    action.payload
                ],
                listPaginate: [
                    ...state.listPaginate,
                    action.payload
                ],
                isLoading: false
            };

        case ComponentConstants.EDIT_COMPONENT_SUCCESS:
            index = findIndex(state.list, action.payload._id);
            indexPaginate = findIndex(state.listPaginate, action.payload._id);

            if (index !== -1) {
                state.list[index] = action.payload;
            }

            if (indexPaginate !== -1) {
                state.listPaginate[indexPaginate] = action.payload;
            }

            return {
                ...state,
                isLoading: false
            };

        case ComponentConstants.DELETE_COMPONENT_SUCCESS:
            index = findIndex(state.list, action.payload);
            indexPaginate = findIndex(state.listPaginate, action.payload);

            if (index !== -1) {
                state.list.splice(index,1);
            }
            
            if (indexPaginate !== -1) {
                state.listPaginate.splice(indexPaginate, 1);
            }

            return {
                ...state,
                isLoading: false
            };

        case 'LOGOUT':
            return initState;

        default:
            return state;
    }
}
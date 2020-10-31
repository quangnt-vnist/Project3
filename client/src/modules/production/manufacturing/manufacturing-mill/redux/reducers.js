import { millConstants } from "./constants";

function findIndex(array, item) {
    let result = -1;
    array.forEach((element, index) => {
        if (element._id === item._id) {
            result = index;
        }
    });
    return result;
}

const initState = {
    isLoading: false,
    listMills: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
    currentMill: {}
}

export function manufacturingMill(state = initState, action) {
    let index = -1;
    switch (action.type) {
        case millConstants.GET_ALL_MANUFACTURING_MILLS_REQUEST:
        case millConstants.CREATE_MANUFACTURING_MILL_REQUEST:
        case millConstants.EDIT_MANUFACTURING_MILL_REQUEST:
        case millConstants.GET_DETAIL_MANUFACTURING_MILL_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case millConstants.GET_ALL_MANUFACTURING_MILLS_FAILURE:
        case millConstants.CREATE_MANUFACTURING_MILL_FAILURE:
        case millConstants.EDIT_MANUFACTURING_MILL_FAILURE:
        case millConstants.GET_ALL_MANUFACTURING_MILLS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case millConstants.GET_ALL_MANUFACTURING_MILLS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listMills: action.payload.manufacturingMills.docs,
                totalDocs: action.payload.manufacturingMills.totalDocs,
                limit: action.payload.manufacturingMills.limit,
                totalPages: action.payload.manufacturingMills.totalPages,
                page: action.payload.manufacturingMills.page,
                pagingCounter: action.payload.manufacturingMills.pagingCounter,
                hasPrevPage: action.payload.manufacturingMills.hasPrevPage,
                hasNextPage: action.payload.manufacturingMills.hasNextPage
            }
        case millConstants.CREATE_MANUFACTURING_MILL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listMills: [
                    ...state.listMills,
                    action.payload.manufacturingMill
                ]
            }
        case millConstants.EDIT_MANUFACTURING_MILL_SUCCESS:
            index = findIndex(state.listMills, action.payload.manufacturingMill);
            if (index != -1) {
                state.listMills[index] = action.payload.manufacturingMill
            }
            return {
                ...state,
                isLoading: false
            }
        case millConstants.GET_DETAIL_MANUFACTURING_MILL_SUCCESS:
            return {
                ...state,
                currentMill: action.payload.manufacturingMill,
                isLoading: false
            }
        default:
            return state
    }
}
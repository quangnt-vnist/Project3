import { purchasingRequestConstants } from "./constants"

const initialState = {
    isLoading: false,
    listPurchasingRequests: [],
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

export const purchasingRequest = (state = initialState, action) => {
    switch (action.type) {
        case purchasingRequestConstants.GET_ALL_PURCHASING_REQUEST_REQUEST:
        case purchasingRequestConstants.CREATE_PURCHASING_REQUEST_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case purchasingRequestConstants.GET_ALL_PURCHASING_REQUEST_FAILURE:
        case purchasingRequestConstants.CREATE_PURCHASING_REQUEST_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case purchasingRequestConstants.GET_ALL_PURCHASING_REQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPurchasingRequests: action.payload.purchasingRequests.docs,
                totalDocs: action.payload.purchasingRequests.totalDocs,
                limit: action.payload.purchasingRequests.limit,
                totalPages: action.payload.purchasingRequests.totalPages,
                page: action.payload.purchasingRequests.page,
                pagingCounter: action.payload.purchasingRequests.pagingCounter,
                hasPrevPage: action.payload.purchasingRequests.hasPrevPage,
                hasNextPage: action.payload.purchasingRequests.hasNextPage,
                prevPage: action.payload.purchasingRequests.prevPage,
                nextPage: action.payload.purchasingRequests.nextPage

            }
        case purchasingRequestConstants.CREATE_PURCHASING_REQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPurchasingRequests: [...state.listPurchasingRequests, action.payload.purchasingRequest]
            }
        default:
            return state
    }
}
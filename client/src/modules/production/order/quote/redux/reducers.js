import { QuoteConstants } from './constants';

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
    listQuotes: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
    detailQuote: {},
}

export function quotes(state = initState, action) {
    let index = -1;
    switch (action.type) {
        case QuoteConstants.GET_ALL_QUOTES_REQUEST:
            case QuoteConstants.CREATE_QUOTE_REQUEST:
            case QuoteConstants.GET_DETAIL_QUOTE_REQUEST:
            case QuoteConstants.UPDATE_QUOTE_REQUEST:
                return {
                    ...state,
                    isLoading: false
                }
            case QuoteConstants.GET_ALL_QUOTES_FAILURE:
            case QuoteConstants.CREATE_QUOTE_FAILURE:
            case QuoteConstants.GET_DETAIL_QUOTE_FAILURE:
            case QuoteConstants.UPDATE_QUOTE_FAILURE:
                return {
                    ...state,
                    isLoading: false,
                    error: action.error
                }
            case QuoteConstants.GET_ALL_QUOTES_SUCCESS:
                console.log("PAYLOAD:", action.payload);
                return {
                    ...state,
                    isLoading: false,
                    listQuotes: action.payload.allQuotes.docs,
                    totalDocs: action.payload.allQuotes.totalDocs,
                    limit: action.payload.allQuotes.limit,
                    totalPages: action.payload.allQuotes.totalPages,
                    page: action.payload.allQuotes.page,
                    pagingCounter: action.payload.allQuotes.pagingCounter,
                    hasPrevPage: action.payload.allQuotes.hasPrevPage,
                    hasNextPage: action.payload.allQuotes.hasNextPage,
                    prevPage: action.payload.allQuotes.prevPage,
                    nextPage: action.payload.allQuotes.nextPage
                }
            case QuoteConstants.CREATE_QUOTE_SUCCESS:
                console.log("PAYLOAD: ", action.payload.quote);
                return {
                    ...state,
                    listQuotes: [
                        ...state.listQuotes,
                        action.payload.quote
                    ],
                    isLoading: false
                }
            case QuoteConstants.GET_DETAIL_QUOTE_SUCCESS:
                return {
                    ...state,
                    isLoading: false
                }
            case QuoteConstants.UPDATE_QUOTE_SUCCESS:
                return {
                    ...state,
                    isLoading: false
                }
            default:
                return state
    }
}
import { QuoteConstants } from './constants';
import { QuoteServices } from  './services';

export const quoteActions = {
    createNewQuote,
    getAllQuotes
}

function createNewQuote (data) {
    return (dispatch) => {
        dispatch({
            type: QuoteConstants.CREATE_QUOTE_REQUEST
        });
        QuoteServices.createNewQuote(data)
            .then((res) => {
                dispatch({
                    type: QuoteConstants.CREATE_QUOTE_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: QuoteConstants.CREATE_QUOTE_FAILURE,
                    error
                });
            });
    }
}

function getAllQuotes (queryData) {
    return (dispatch) => {
        dispatch({
            type: QuoteConstants.GET_ALL_QUOTES_REQUEST
        })
        QuoteServices.getAllQuotes(queryData)
        .then((res)=> {
            dispatch({
                type: QuoteConstants.GET_ALL_QUOTES_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: QuoteConstants.GET_ALL_QUOTES_FAILURE,
                error
            })
        })
    }
}
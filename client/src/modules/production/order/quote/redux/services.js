import { sendRequest } from '../../../../../helpers/requestHelper';

export const QuoteServices = {
    createQuote,
    getAllQuotes
}

function createQuote(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/quote`,
            method: "POST",
            data
        },
        true,
        true,
        "manage_order.quote_add_success")
}

function getAllQuotes (queryData){
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/quote`,
            method: "GET",
            params: queryData
        },
        false,
        true,
        "manage_order.quote_get_all_success")
}
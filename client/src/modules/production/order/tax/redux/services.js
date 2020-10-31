import { sendRequest } from '../../../../../helpers/requestHelper';

export const TaxServices = {
    createNewTax,
    getAllTaxs,
    getTaxById,
    updateTax,
    disableTax,
    checkTaxCode,
    getTaxByCode
}

function createNewTax(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/tax`,
        method: 'POST',
        data
    }, true, true, 'manage_order.tax');
}

function getAllTaxs(queryData){
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/tax`,
            method: "GET",
            params: queryData
        },
        false,
        true,
        "manage_order.tax")
}

function getTaxById(id){
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/tax/${id}`,
            method: "GET"
        },
        false,
        true,
        "manage_order.tax"
    )
}

function updateTax (id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/tax/${id}`,
            method: "PATCH",
            data
        },
        true,
        true,
        "manage_order.tax"
    )
}

function disableTax (id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/tax/disable/${id}`,
            method: "PATCH"
        },
        true,
        true,
        "manage_order.tax"
    )
}

function checkTaxCode (code) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/tax/check-code`,
            method: "GET",
            params: code
        },
        false,
        true,
        "manage_order.tax"
    )
}

function getTaxByCode (code) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/tax/get-by-code`,
            method: "GET",
            params: code
        },
        false,
        true,
        "manage_order.tax"
    )
}
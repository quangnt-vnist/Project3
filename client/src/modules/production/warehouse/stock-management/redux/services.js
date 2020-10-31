import { sendRequest } from '../../../../../helpers/requestHelper';
export const StockServices = {
    getAllStocks,
    getStock,
    createStock,
    editStock,
    deleteStock
}

function getAllStocks(params){
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/stocks`,
        method: 'GET',
        params
    }, false, true, 'manage_warehouse.stock_management')
}

function getStock(id){
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/stocks/stock-detail/${id}`,
        method: 'GET',
    })
}

function createStock(data){
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/stocks`,
        method: 'POST',
        data
    }, true, true, 'manage_warehouse.stock_management')
}

function editStock(id, data){
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/stocks/${id}`,
        method: 'PATCH',
        data
    }, true, true, 'manage_warehouse.stock_management')
}

function deleteStock(id){
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/stocks/${id}`,
        method: 'DELETE',
    }, true, true, 'manage_warehouse.stock_management')
}

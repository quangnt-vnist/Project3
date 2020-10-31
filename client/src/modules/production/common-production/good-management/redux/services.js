import { sendRequest } from '../../../../../helpers/requestHelper';

export const GoodServices = {
    getGoodsByType,
    getAllGoods,
    getAllGoodsByType,
    getAllGoodsByCategory,
    createGoodByType,
    editGood,
    getGoodDetail,
    deleteGood
}

function getGoodsByType(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/goods`,
        method: 'GET',
        params
    }, false, true, 'manage_warehouse.good_management');
}

function getAllGoods(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/goods/all-goods`,
        method: 'GET',
        params
    }, false, true, 'manage_warehouse.good_management');
}

function getAllGoodsByType(query) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/goods/by-type`,
        method: 'GET',
        params: query
    }, false, true, 'manage_warehouse.good_management');
}

function getAllGoodsByCategory(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/goods/by-category/${id}`,
        method: 'GET',
    }, false, true, 'manage_warehouse.good_management');
}

function createGoodByType(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/goods`,
        method: 'POST',
        data
    }, true, true, 'manage_warehouse.good_management');
}

function getGoodDetail(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/goods/${id}`,
        method: 'GET',
    }, false, true, 'manage_warehouse.good_management');
}

function editGood(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/goods/${id}`,
        method: 'PATCH',
        data
    }, true, true, 'manage_warehouse.good_management');
}

function deleteGood(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/goods/${id}`,
        method: 'DELETE',
    }, true, true, 'manage_warehouse.good_management');
}
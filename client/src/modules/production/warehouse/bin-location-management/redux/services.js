import { sendRequest } from '../../../../../helpers/requestHelper';

export const BinLocationServices = {
    getBinLocations,
    getChildBinLocations,
    getDetailBinLocation,
    createBinLocation,
    editBinLocation,
    deleteBinLocation,
    deleteManyBinLocation
}

function getBinLocations(params) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/bin-locations`,
        method: 'GET',
        params
    }, false, true, 'manage_warehouse.bin_location_management');
}

function getChildBinLocations(params) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/bin-locations/get-child`,
        method: 'GET',
        params
    }, false, true, 'manage_warehouse.bin_location_management');
}

function getDetailBinLocation(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER}/bin-locations/get-detail/${id}`,
        method: 'GET'
    }, false, true, 'manage_warehouse.bin_location_management')
}

function createBinLocation(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/bin-locations`,
        method: 'POST',
        data,
    }, true, true, 'manage_warehouse.bin_location_management');
}

function editBinLocation(id, data){
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/bin-locations/${id}`,
        method: 'PATCH',
        data
    }, true, true, 'manage_warehouse.bin_location_management');
}

function deleteBinLocation(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/bin-locations/${id}`,
        method: 'DELETE',
    }, true, true, 'manage_warehouse.bin_location_management');
}

function deleteManyBinLocation(array) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/bin-locations/delete-many`,
        method: 'POST',
        data: { array }
    }, false, true, 'manage_warehouse.bin_location_management');
}
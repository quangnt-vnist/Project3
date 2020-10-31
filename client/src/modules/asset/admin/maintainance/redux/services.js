import {sendRequest} from '../../../../../helpers/requestHelper';

export const MaintainanceService = {
    getMaintainances,
    createMaintainance,
    updateMaintainance,
    deleteMaintainance,
}

// Lấy thông tin bảo trì tài sản
function getMaintainances(data) {
    console.log('\n\n\n\n\\n\n***', data);
    let params = {
        code: data ? data.code : data,
        maintainanceCode: data ? data.maintainanceCode : data,
        maintainCreateDate: data ? data.maintainCreateDate : data,
        type: data ? data.type : data,
        status: data ? data.status : data,
        page: data ? data.page : data,
        limit: data ? data.limit : data,
    };

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/maintainance-logs`,
        method: 'GET',
        params,
    }, false, true, 'asset.maintainance');
}

// tạo mới thông tin bảo trì tài sản
function createMaintainance(id, data, incident_id) {
    return sendRequest({
        url: incident_id ? `${process.env.REACT_APP_SERVER}/asset/assets/${id}/maintainance-logs?incident_id=${incident_id}` : `${process.env.REACT_APP_SERVER}/asset/assets/${id}/maintainance-logs`,
        method: 'POST',
        data: data
    }, true, true, 'asset.maintainance');
}

// chỉnh sửa thông tin bảo trì tài sản
function updateMaintainance(assetId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/${assetId}/maintainance-logs`,
        method: 'PATCH',
        data
    }, true, true, 'asset.maintainance');
}

// xóa thông tin bảo trì tài sản
function deleteMaintainance(assetId, maintainanceId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/${assetId}/maintainance-logs`,
        method: 'DELETE',
        data: {maintainanceId}
    }, true, true, 'asset.maintainance');
}

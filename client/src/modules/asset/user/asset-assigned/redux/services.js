import {sendRequest} from '../../../../../helpers/requestHelper';

export const IncidentService = {
    createIncident,
    updateIncident,
    deleteIncident,
}

// Tạo mới thông tin sự cố tài sản
function createIncident(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/${id}/incident-logs`,
        method: 'POST',
        data: data
    }, true, true, 'asset.incident');
}

// Chỉnh sửa thông tin sự cố tài sản
function updateIncident(assetId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/${assetId}/incident-logs`,
        method: 'PATCH',
        data
    }, true, true, 'asset.incident');
}

// Xóa thông tin sự cố tài sản
function deleteIncident(assetId, incidentId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/${assetId}/incident-logs`,
        method: 'DELETE',
        data: {incidentId}
    }, true, true, 'asset.incident');
}

import { sendRequest } from '../../../../../helpers/requestHelper';
export const RecommendDistributeService = {
    searchRecommendDistributes,
    updateRecommendDistribute,
    createUsage,
    updateUsage,
    deleteUsage,
    recallAsset,
}

// Lấy danh sách phiếu đề nghị mua sắm thiết bị
function searchRecommendDistributes(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/use-request/use-requests`,
        method: 'GET',
        params: {
            recommendNumber: data.recommendNumber,
            month: data.month,
            status: data.status,
            page: data.page,
            limit: data.limit,
        },
    }, false, true, 'asset.manage_use_request');
}

// Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
function updateRecommendDistribute(id, data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/use-request/use-requests/${id}`,
        method: 'PUT',
        data: data
    }, true, true, 'asset.manage_use_request');
}

// Tạo mới thông tin phiếu đề nghị mua sắm thiết bị
function createUsage(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/${id}/usage-logs`,
        method: 'POST',
        data: data
    }, true, true, 'asset.usage');
}

// Chỉnh sửa thông tin sử dụng tài sản
function updateUsage(assetId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/${assetId}/usage-logs`,
        method: 'PATCH',
        data: data,
    }, true, true, 'asset.usage');
}

// Xóa thông tin sử dụng tài sản
function deleteUsage(assetId, usageId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/${assetId}/usage-logs`,
        method: 'DELETE',
        data: { usageId }
    }, true, true, 'asset.usage');
}

// Thu hồi tài sản
function recallAsset(assetId, data){
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/${assetId}/usage-logs`,
        method: 'PATCH',
        data: data,
        params: {
            recallAsset: true,
        }
    }, true, true, 'asset.usage');
}
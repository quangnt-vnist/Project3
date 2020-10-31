import { sendRequest } from '../../../../../helpers/requestHelper';
export const RecommendDistributeService = {
    searchRecommendDistributes,
    createRecommendDistribute,
    updateRecommendDistribute,
    deleteRecommendDistribute,
    getRecommendDistributeByAsset,
}

// Lấy danh sách phiếu đề nghị mua sắm thiết bị
function searchRecommendDistributes(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/use-request/use-requests`,
        method: 'GET',
        params: {
            receiptsCode: data.receiptsCode,
            createReceiptsDate: data.createReceiptsDate,
            reqUseEmployee: data.reqUseEmployee,
            reqUseStatus: data.reqUseStatus,
            approver: data.approver,
            page: data.page,
            limit: data.limit,
            managedBy: data.managedBy
        },
    }, false, true, 'asset.use_request');
}

// Tạo mới thông tin phiếu đề nghị mua sắm thiết bị
function createRecommendDistribute(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/use-request/use-requests`,
        method: 'POST',
        data: data
    }, true, true, 'asset.use_request');
}

// Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
function updateRecommendDistribute(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/use-request/use-requests/${id}`,
        method: 'PUT',
        data: data
    }, true, true, 'asset.use_request');
}

// Xoá thông tin phiếu đề nghị mua sắm thiết bị
function deleteRecommendDistribute(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/use-request/use-requests/${id}`,
        method: 'DELETE',
    }, true, true, 'asset.use_request');
}

// Lấy danh sách phiếu đề nghị cấp phát thiết bị theo tài sản
function getRecommendDistributeByAsset(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/use-request/use-requests`,
        method: 'GET',
        params: {
            assetId: data,
            getUseRequestByAssetId: true,
        },
    }, false, true, 'asset.use_request');
}
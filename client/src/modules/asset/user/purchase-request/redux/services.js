import { sendRequest } from '../../../../../helpers/requestHelper';

export const RecommendProcureService = {
    searchRecommendProcures,
    createRecommendProcure,
    updateRecommendProcure,
    deleteRecommendProcure,
}

// Lấy danh sách phiếu đề nghị mua sắm thiết bị
function searchRecommendProcures(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/purchase-request/purchase-request`,
        method: 'GET',
        params: {
            recommendNumber: data.recommendNumber,
            proposalDate: data.proposalDate,
            proponent: data.proponent,
            approver: data.approver,
            status: data.status,
            page: data.page,
            limit: data.limit,
        },
    }, false, true, 'asset.purchase-request');
}

// Tạo mới thông tin phiếu đề nghị mua sắm thiết bị
function createRecommendProcure(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/purchase-request/purchase-request`,
        method: 'POST',
        data: data
    }, true, true, 'asset.purchase-request');
}

// Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
function updateRecommendProcure(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/purchase-request/purchase-request/${id}`,
        method: 'PUT',
        data: data
    }, true, true, 'asset.purchase-request');
}

// Xoá thông tin phiếu đề nghị mua sắm thiết bị
function deleteRecommendProcure(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/purchase-request/purchase-request/${id}`,
        method: 'DELETE',
    }, true, true, 'asset.purchase-request');
}
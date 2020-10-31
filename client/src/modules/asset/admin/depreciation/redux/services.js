import {sendRequest} from '../../../../../helpers/requestHelper';

export const DepreciationService = {
    updateDepreciation,
}

// Chỉnh sửa thông tin khấu hao tài sản
function updateDepreciation(assetId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/${assetId}/depreciations`,
        method: 'PATCH',
        data
    }, true, true, 'asset.depreciation');
}


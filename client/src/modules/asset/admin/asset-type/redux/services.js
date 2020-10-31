import { sendRequest } from '../../../../../helpers/requestHelper';
export const AssetTypeService = {
    searchAssetTypes,
    getAssetTypes,
    createAssetTypes,
    editAssetType,
    deleteAssetTypes,
    deleteManyAssetType,
}


/**
 * Lấy danh sách loại tài sản
 * @param {*} data Dữ liệu tìm kiếm
 */
function searchAssetTypes(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/assettype/asset-types`,
        method: 'GET',
        params: {
            typeNumber: data.typeNumber,
            typeName: data.typeName,
            page: data.page,
            limit: data.limit,
        }
    }, false, true, 'asset.asset_type');
}

/**
 * Lấy danh sách loại tài sản
 */
function getAssetTypes() {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/assettype/asset-types`,
        method: 'GET',
    }, false, true, 'asset.asset_type');
}


/**
 * Tạo loại tài sản mới
 */
function createAssetTypes(data) {  
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/assettype/asset-types`,
        method: 'POST',
        data,
    }, true, true, 'asset.asset_type');
}

/**
 * Chỉnh sửa thông tin loại tài sản
 */
function editAssetType(id, data) {  
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/assettype/asset-types/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'asset.asset_type');
}

/**
 * Xóa 1 loại tài sản
 */
function deleteAssetTypes(id) {  
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/assettype/asset-types/${id}`,
        method: 'DELETE',
    }, true, true, 'asset.asset_type');
}

/**
 * Xóa nhiều loại tài sản
 */
function deleteManyAssetType(array) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/assettype/asset-types`,
        method: 'DELETE',
        data: {array}
    }, true, true, 'asset.asset_type');
}
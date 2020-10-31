import {
    sendRequest
} from '../../../../../helpers/requestHelper';

export const AssetService = {
    getAll,
    addNewAsset,
    updateInformationAsset,
    deleteAsset,
    getListBuildingAsTree,
}

/**
 * Lấy danh sách tài sản
 * @param {*} data : dữ liệu key tìm kiếm
 */
function getAll(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets`,
        method: 'GET',
        params: {
            code: data !== undefined ? data.code : data,
            assetName: data !== undefined ? data.assetName : data,
            status: data !== undefined ? data.status : data,
            group: data !== undefined ? data.group : data,
            assetType: data !== undefined ? data.assetType : data,
            purchaseDate: data !== undefined ? data.purchaseDate : data,
            disposalDate: data !== undefined ? data.disposalDate : data,
            handoverUnit: data !== undefined ? data.handoverUnit : data,
            handoverUser: data !== undefined ? data.handoverUser : data,
            typeRegisterForUse: data !== undefined ? data.typeRegisterForUse : data,
            page: data !== undefined ? data.page : data,
            limit: data !== undefined ? data.limit : data,
            managedBy: data !== undefined ? data.managedBy : data,
            currentRole: data !== undefined ? data.currentRole : data,

            startDepreciation: data !== undefined ? data.startDepreciation : data,
            depreciationType: data !== undefined ? data.depreciationType : data,

            maintainanceCode: data !== undefined ? data.maintainanceCode : data,
            maintainCreateDate: data !== undefined ? data.maintainCreateDate : data,
            maintainStatus: data !== undefined ? data.maintainStatus : data,
            maintainType: data !== undefined ? data.maintainType : data,

            incidentCode: data !== undefined ? data.incidentCode : data,
            incidentStatus: data !== undefined ? data.incidentStatus : data,
            incidentType: data !== undefined ? data.incidentType : data,
        }
    }, false, true, 'asset.asset_info');
}

/**
 * Lấy danh sách mặt bằng dạng cây
 */
function getListBuildingAsTree() {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets`,
        method: 'GET',
        params: {
            type: "get-building-as-tree"
        }
    }, false, true, 'asset.asset_info');
}

/**
 * Thêm mới thông tin tài sản
 * @param {*} data : dữ liệu thông tin tài sản cần tạo
 */
function addNewAsset(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets`,
        method: 'POST',
        data: data,
    }, true, true, 'asset.asset_info');
}

/**
 * Cập nhật thông tin tài sản theo id
 * @param {*} id : id thông tin tài sản cần chỉnh sửa
 * @param {*} data :dữ liệu chỉnh sửa thông tin tài sản
 */
function updateInformationAsset(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/${id}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'asset.asset_info');
}

/**
 * Xoá thông tin tài sản
 * @id : id thông tin tài sản cần xoá
 */
function deleteAsset(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/${id}`,
        method: 'DELETE',
    }, true, true, 'asset.asset_info');
}
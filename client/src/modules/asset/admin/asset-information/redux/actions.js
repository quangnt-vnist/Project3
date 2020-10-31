import { AssetConstants } from "./constants";
import { AssetService } from "./services";

export const AssetManagerActions = {
    getAllAsset,
    addNewAsset,
    updateInformationAsset,
    deleteAsset,
    getListBuildingAsTree,
};

/**
 * Lấy danh sách tài sản
 * @param {*} data : dữ liệu key tìm kiếm
 */
function getAllAsset(data) {
    return dispatch => {
        dispatch({
            type: AssetConstants.GETALL_REQUEST
        });
        AssetService.getAll(data)
            .then(res => {
                dispatch({
                    type: AssetConstants.GETALL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: AssetConstants.GETALL_FAILURE,
                    error: err
                });
            })
    };
}

/**
 * Lấy danh sách mặt bằng dạng cây
 */
function getListBuildingAsTree() {
    return dispatch => {
        dispatch({
            type: AssetConstants.GET_LIST_BUILDING_AS_TREE_REQUEST
        });
        AssetService.getListBuildingAsTree()
            .then(res => {
                dispatch({
                    type: AssetConstants.GET_LIST_BUILDING_AS_TREE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: AssetConstants.GET_LIST_BUILDING_AS_TREE_FAILURE,
                    error: err
                });
            })
    };
}

/**
 * Thêm mới thông tin tài sản
 * @param {*} data : dữ liệu thông tin tài sản cần tạo
 */
function addNewAsset(asset) {
    return dispatch => {
        dispatch({
            type: AssetConstants.ADDASSET_REQUEST
        });

        AssetService.addNewAsset(asset)
            .then(res => {
                dispatch(getAllAsset({
                    code: "",
                    assetName: "",
                    assetType: null,
                    month: null,
                    status: "",
                    page: 0,
                    limit: 5,
                }));
                dispatch({
                    type: AssetConstants.ADDASSET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: AssetConstants.ADDASSET_FAILURE,
                    error: err
                });
            })
    };
}

/**
 * Cập nhật thông tin tài sản theo id
 * @param {*} id 
 * @param {*} data 
 * @param {*} managedBy khi manageBy !="", role gọi service này không phải là admin
 */
function updateInformationAsset(id, data, managedBy = "") {
    return dispatch => {
        dispatch({
            type: AssetConstants.UPDATE_INFOR_ASSET_REQUEST
        });

        AssetService.updateInformationAsset(id, data)
            .then(res => {
                if (managedBy === "") {
                    dispatch(getAllAsset({
                        code: "",
                        assetName: "",
                        assetType: null,
                        month: null,
                        status: "",
                        page: 0,
                        limit: 5,
                    }));
                }
                else {
                    dispatch(getAllAsset({
                        code: "",
                        assetName: "",
                        assetType: null,
                        month: null,
                        status: "",
                        page: 0,
                        limit: 5,
                        managedBy: managedBy
                    }));
                }

                dispatch({
                    type: AssetConstants.UPDATE_INFOR_ASSET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: AssetConstants.UPDATE_INFOR_ASSET_FAILURE,
                    error: err
                });
            })
    };
}

/**
 * Xóa tài sản
 * @param {*} id 
 * @param {*} managedBy khi manageBy !="", role gọi service này không phải là admin
 */
function deleteAsset(id, managedBy = "") {
    return dispatch => {
        dispatch({
            type: AssetConstants.DELETE_ASSET_REQUEST
        });

        AssetService.deleteAsset(id)
            .then(res => {
                if (managedBy === "") {
                    dispatch(getAllAsset({
                        code: "",
                        assetName: "",
                        assetType: null,
                        month: null,
                        status: "",
                        page: 0,
                        limit: 5,
                    }));
                }
                else {
                    dispatch(getAllAsset({
                        code: "",
                        assetName: "",
                        assetType: null,
                        month: null,
                        status: "",
                        page: 0,
                        limit: 5,
                        managedBy: managedBy
                    }));
                }

                dispatch({
                    type: AssetConstants.DELETE_ASSET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: AssetConstants.DELETE_ASSET_FAILURE,
                    error: err
                });
            })
    }
}

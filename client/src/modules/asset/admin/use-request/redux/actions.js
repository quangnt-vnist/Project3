import { RecommendDistributeConstants } from "./constants";
import { RecommendDistributeService } from "./services";
import { AssetManagerActions } from "../../asset-information/redux/actions";

export const UseRequestActions = {
    searchRecommendDistributes,
    updateRecommendDistribute,
    createUsage,
    updateUsage,
    deleteUsage,
    recallAsset,
};

// Lấy danh sách phiếu đề nghị mua sắm thiết bị
function searchRecommendDistributes(data) {
    return async (dispatch) => {
        try {
            const result = await RecommendDistributeService.searchRecommendDistributes(data);
            dispatch({
                type: RecommendDistributeConstants.GET_RECOMMEND_DISTRIBUTE_SUCCESS,
                payload: result.data.content
            })

        } catch (error) {
            dispatch({
                type: RecommendDistributeConstants.GET_RECOMMEND_DISTRIBUTE_FAILURE,
                error: error.response.data
            });
        }
    };
}

// Cập nhật thông tin phiếu đăng ký sử dụng
function updateRecommendDistribute(id, infoRecommendDistribute) {
    return async dispatch => {
        try {
            dispatch({
                type: RecommendDistributeConstants.UPDATE_RECOMMEND_DISTRIBUTE_REQUEST
            });
            const response = await RecommendDistributeService.updateRecommendDistribute(id, infoRecommendDistribute)
            dispatch(searchRecommendDistributes({
                recommendNumber: "",
                month: "",
                status: "",
                page: 0,
                limit: 5,
            }));
            dispatch(AssetManagerActions.getAllAsset({
                code: "",
                assetName: "",
                month: "",
                type: null,
                page: 0,
                limit: 5,
            }));
            dispatch({
                type: RecommendDistributeConstants.UPDATE_RECOMMEND_DISTRIBUTE_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: RecommendDistributeConstants.UPDATE_RECOMMEND_DISTRIBUTE_FAILURE,
                error: err.response.data
            });
        }
    }
}

function createUsage(id, data) {
    return async dispatch => {
        try {
            dispatch({
                type: RecommendDistributeConstants.CREATE_USAGE_REQUEST
            });
            const response = await RecommendDistributeService.createUsage(id, data);
            dispatch({
                type: RecommendDistributeConstants.CREATE_USAGE_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: RecommendDistributeConstants.CREATE_USAGE_FAILURE,
                error: err
            });
        }

    };
}

function updateUsage(id, data) {
    return dispatch => {
        dispatch({
            type: RecommendDistributeConstants.UPDATE_USAGE_REQUEST
        });

        RecommendDistributeService.updateUsage(id, data)
            .then(res => {
                dispatch(AssetManagerActions.getAllAsset({
                    code: "",
                    assetName: "",
                    assetType: null,
                    month: null,
                    status: "",
                    page: 0,
                    limit: 5,
                }))
                dispatch({
                    type: RecommendDistributeConstants.UPDATE_USAGE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: RecommendDistributeConstants.UPDATE_USAGE_FAILURE,
                    error: err
                });
            })
    };
}

function deleteUsage(assetId, usageId) {
    return async dispatch => {
        try {
            dispatch({
                type: RecommendDistributeConstants.DELETE_USAGE_REQUEST
            });
            const response = await RecommendDistributeService.deleteUsage(assetId, usageId);
            dispatch({
                type: RecommendDistributeConstants.DELETE_USAGE_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: RecommendDistributeConstants.DELETE_USAGE_FAILURE,
                error: err
            });
        }

    }
}

function recallAsset(id, data) {
    return dispatch => {
        dispatch({ type: RecommendDistributeConstants.RECALL_ASSET_REQUEST })
        RecommendDistributeService.recallAsset(id, data)
            .then(res => {
                dispatch({
                    type: RecommendDistributeConstants.RECALL_ASSET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: RecommendDistributeConstants.RECALL_ASSET_FAILURE,
                    payload: error
                })
            })
    };
}
import { RecommendDistributeConstants } from "./constants";
import { RecommendDistributeService } from "./services";
import {
    AssetManagerActions
} from "../../../admin/asset-information/redux/actions";

export const RecommendDistributeActions = {
    searchRecommendDistributes,
    createRecommendDistribute,
    updateRecommendDistribute,
    deleteRecommendDistribute,
    getRecommendDistributeByAsset,
};

// lấy danh sách phiếu đề nghị mua sắm thiết bị
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
                error: error.response && error.response.data
            });
        }
    };
}

// Tạo mới thông tin phiếu đề nghị mua sắm thiết bị
function createRecommendDistribute(data) {
    return async dispatch => {
        try {
            dispatch({
                type: RecommendDistributeConstants.CREATE_RECOMMEND_DISTRIBUTE_REQUEST
            });
            const response = await RecommendDistributeService.createRecommendDistribute(data).then(res => res);
            
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
                type: RecommendDistributeConstants.CREATE_RECOMMEND_DISTRIBUTE_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: RecommendDistributeConstants.CREATE_RECOMMEND_DISTRIBUTE_FAILURE,
                error: err.response.data
            });
        }

    }
}

// cập nhật thông tin phiếu đăng ký sử dụng
function updateRecommendDistribute(id, infoRecommendDistribute ,managedBy="") {
    return async dispatch => {
        try {
            dispatch({
                type: RecommendDistributeConstants.UPDATE_RECOMMEND_DISTRIBUTE_REQUEST
            });
            const response = await RecommendDistributeService.updateRecommendDistribute(id, infoRecommendDistribute)
            
            if(managedBy==="")
            {
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
            }
            else
            {
                dispatch(searchRecommendDistributes({
                    recommendNumber: "",
                    month: "",
                    status: "",
                    page: 0,
                    limit: 5,
                    managedBy:managedBy
                }));
                dispatch(AssetManagerActions.getAllAsset({
                    code: "",
                    assetName: "",
                    month: "",
                    type: null,
                    page: 0,
                    limit: 5,
                    managedBy:managedBy
                }));
            }
            
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

// Xoá thông tin thông tin phiếu đăng ký sử dụng tài sản
function deleteRecommendDistribute(id) {
    return dispatch => {
        dispatch({
            type: RecommendDistributeConstants.DELETE_RECOMMEND_DISTRIBUTE_REQUEST,
        });
        RecommendDistributeService.deleteRecommendDistribute(id)
            .then(res => {
                dispatch({
                    type: RecommendDistributeConstants.DELETE_RECOMMEND_DISTRIBUTE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: RecommendDistributeConstants.DELETE_RECOMMEND_DISTRIBUTE_SUCCESS,
                    error: err.response.data
                });
            })
    }
}

function getRecommendDistributeByAsset(data) {

    return async (dispatch) => {
        try {
            const result = await RecommendDistributeService.getRecommendDistributeByAsset(data);

            dispatch({
                type: RecommendDistributeConstants.GET_RECOMMEND_DISTRIBUTE_BY_ASSET_SUCCESS,
                payload: result.data.content
            })

        } catch (error) {
            dispatch({
                type: RecommendDistributeConstants.GET_RECOMMEND_DISTRIBUTE_BY_ASSET_FAILURE,
                error: error.response && error.response.data
            });
        }
    };
}
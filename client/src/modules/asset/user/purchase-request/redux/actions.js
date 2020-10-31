import { RecommendProcureConstants } from "./constants";
import { RecommendProcureService } from "./services";

export const RecommendProcureActions = {
    searchRecommendProcures,
    createRecommendProcure,
    updateRecommendProcure,
    deleteRecommendProcure,
};

// Lấy danh sách phiếu đề nghị mua sắm thiết bị
function searchRecommendProcures(data) {

    return async dispatch => {
        try {
            const result = await RecommendProcureService.searchRecommendProcures(data);

            dispatch({
                type: RecommendProcureConstants.GET_RECOMMEND_PROCURE_SUCCESS,
                payload: result.data.content
            })

        } catch (error) {
            dispatch({
                type: RecommendProcureConstants.GET_RECOMMEND_PROCURE_FAILURE,
                error: error.response.data
            });
        }
    }
}

// Tạo mới thông tin phiếu đề nghị mua sắm thiết bị
function createRecommendProcure(data) {
    return async dispatch => {
        try {
            dispatch({
                type: RecommendProcureConstants.CREATE_RECOMMEND_PROCURE_REQUEST
            });
            const response = await RecommendProcureService.createRecommendProcure(data).then(res => res);
            dispatch(searchRecommendProcures({
                recommendNumber: "",
                month: "",
                status: "",
                page: 0,
                limit: 5,
            }));
            dispatch({
                type: RecommendProcureConstants.CREATE_RECOMMEND_PROCURE_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: RecommendProcureConstants.CREATE_RECOMMEND_PROCURE_FAILURE,
                error: err.response.data
            });
        }
    }
}

// Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
function updateRecommendProcure(id, infoRecommendProcure) {
    return async dispatch => {
        try {
            dispatch({
                type: RecommendProcureConstants.UPDATE_RECOMMEND_PROCURE_REQUEST
            });
            const response = await RecommendProcureService.updateRecommendProcure(id, infoRecommendProcure)
            dispatch(searchRecommendProcures({
                recommendNumber: "",
                month: "",
                status: "",
                page: 0,
                limit: 5,
            }));
            dispatch({
                type: RecommendProcureConstants.UPDATE_RECOMMEND_PROCURE_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: RecommendProcureConstants.UPDATE_RECOMMEND_PROCURE_FAILURE,
                error: err.response.data
            });
        }
    }
}

// Xoá thông tin thông tin phiếu đề nghị mua sắm thiết bị
function deleteRecommendProcure(id) {
    return dispatch => {
        dispatch({
            type: RecommendProcureConstants.DELETE_RECOMMEND_PROCURE_REQUEST,
        });
        RecommendProcureService.deleteRecommendProcure(id)
            .then(res => {
                dispatch({
                    type: RecommendProcureConstants.DELETE_RECOMMEND_PROCURE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: RecommendProcureConstants.DELETE_RECOMMEND_PROCURE_SUCCESS,
                    error: err.response.data
                });
            })
    }
}
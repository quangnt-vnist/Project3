import {
    CareerPositionConstant
} from "./constants";

import {
    CareerPositionService
} from "./services";

export const CareerPositionAction = {
    getListCareerPosition,
};

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListCareerPosition(data) {
    return dispatch => {
        dispatch({
            type: CareerPositionConstant.GET_CAREER_POSITION_REQUEST
        });
        CareerPositionService.getListCareerPosition(data)
            .then(res => {
                dispatch({
                    type: CareerPositionConstant.GET_CAREER_POSITION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CareerPositionConstant.GET_CAREER_POSITION_FAILURE,
                    error: err
                });
            })
    }
}

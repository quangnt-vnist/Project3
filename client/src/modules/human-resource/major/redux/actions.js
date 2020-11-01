import {
    MajorConstant
} from "./constants";

import {
    MajorService
} from "./services";

export const MajorActions = {
    getListMajor,
};

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListMajor(data) {
    return dispatch => {
        dispatch({
            type: MajorConstant.GET_MAJOR_REQUEST
        });
        MajorService.getListMajor(data)
            .then(res => {
                dispatch({
                    type: MajorConstant.GET_MAJOR_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: MajorConstant.GET_MAJOR_FAILURE,
                    error: err
                });
            })
    }
}

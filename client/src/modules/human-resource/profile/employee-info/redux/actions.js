import {
    Constants
} from "./constants";
import {
    EmployeeService
} from "./services";
export const EmployeeInfoActions = {
    getEmployeeProfile,
    updatePersonalInformation,
};

/**
 * Lấy thông tin nhân viên theo mã nhân viên
 */
function getEmployeeProfile(data) {
    return dispatch => {
        dispatch({
            type: Constants.GET_PERSONAL_INFOR_REQUEST
        });
        EmployeeService.getEmployeeProfile(data)
            .then(res => {
                dispatch({
                    type: Constants.GET_PERSONAL_INFOR_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: Constants.GET_PERSONAL_INFOR_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Cập nhật thông tin cá nhân
 */
function updatePersonalInformation(data) {
    return dispatch => {
        dispatch({
            type: Constants.UPDATE_PERSONAL_INFOR_REQUEST
        });
        EmployeeService.updatePersonalInformation(data)
            .then(res => {
                dispatch({
                    type: Constants.UPDATE_PERSONAL_INFOR_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: Constants.UPDATE_PERSONAL_INFOR_FAILURE,
                    error: err
                });
            })
    };
}
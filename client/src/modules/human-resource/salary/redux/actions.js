import {
    SalaryConstants
} from "./constants";

import {
    SalaryService
} from "./services";

export const SalaryActions = {
    searchSalary,
    createSalary,
    deleteSalary,
    updateSalary,
    importSalary
};

/**
 * Lấy danh sách bảng lương
 * @data : dữ liệu key tìm kiếm
 */
function searchSalary(data) {
    return dispatch => {
        dispatch({
            type: SalaryConstants.GET_SALARY_REQUEST
        });
        SalaryService.searchSalary(data)
            .then(res => {
                dispatch({
                    type: SalaryConstants.GET_SALARY_SUCCESS,
                    payload: res.data.content,
                    callApiDashboard: data.callApiDashboard,
                    organizationalUnits: data.organizationalUnits,
                })
            })
            .catch(err => {
                dispatch({
                    type: SalaryConstants.GET_SALARY_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Tạo mới một bảng lương
 * @data : dữ liệu bảng lương mới
 */
function createSalary(data) {
    return dispatch => {
        dispatch({
            type: SalaryConstants.CREATE_SALARY_REQUEST
        });
        SalaryService.createSalary(data)
            .then(res => {
                dispatch({
                    type: SalaryConstants.CREATE_SALARY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: SalaryConstants.CREATE_SALARY_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Xoá bảng lương  theo id
 * @id : Id bảng lương cần xoá
 */
function deleteSalary(id) {
    return dispatch => {
        dispatch({
            type: SalaryConstants.DELETE_SALARY_REQUEST
        });
        SalaryService.deleteSalary(id)
            .then(res => {
                dispatch({
                    type: SalaryConstants.DELETE_SALARY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: SalaryConstants.DELETE_SALARY_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Cập nhật thông tin bảng lương
 * @id : Id bảng lương cần cập nhật
 * @data : Dữ liệu cập nhật bảng lương 
 */
function updateSalary(id, data) {
    return dispatch => {
        dispatch({
            type: SalaryConstants.UPDATE_SALARY_REQUEST
        });
        SalaryService.updateSalary(id, data)
            .then(res => {
                dispatch({
                    type: SalaryConstants.UPDATE_SALARY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: SalaryConstants.UPDATE_SALARY_FAILURE,
                    error: err
                });
            })
    }
}

// Import lương nhân viên
function importSalary(data) {
    return dispatch => {
        dispatch({
            type: SalaryConstants.IMPORT_SALARY_REQUEST
        });
        SalaryService.importSalary(data)
            .then(res => {
                dispatch({
                    type: SalaryConstants.IMPORT_SALARY_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                dispatch({
                    type: SalaryConstants.IMPORT_SALARY_FAILURE,
                    error: err.response.data.content
                });
            })
    };
}
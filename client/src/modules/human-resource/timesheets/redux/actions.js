import {
    TimesheetsConstants
} from "./constants";

import {
    TimesheetsService
} from "./services";

export const TimesheetsActions = {
    searchTimesheets,
    createTimesheets,
    deleteTimesheets,
    updateTimesheets,
    importTimesheets,
};

/**
 * Lấy danh sách chấm công
 * @data : Dữ liệu key tìm kiếm
 */
function searchTimesheets(data) {
    return dispatch => {
        dispatch({
            type: TimesheetsConstants.GET_TIMESHEETS_REQUEST
        });
        TimesheetsService.searchTimesheets(data)
            .then(res => {
                dispatch({
                    type: TimesheetsConstants.GET_TIMESHEETS_SUCCESS,
                    payload: res.data.content,
                    callApiByEmployeeId: data.callApiByEmployeeId,
                })
            })
            .catch(err => {
                dispatch({
                    type: TimesheetsConstants.GET_TIMESHEETS_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Tạo mới thông tin chấm công
 * @data : Dữ liệu chấm công mới
 */
function createTimesheets(data) {
    return dispatch => {
        dispatch({
            type: TimesheetsConstants.CREATE_TIMESHEETS_REQUEST
        });
        TimesheetsService.createTimesheets(data)
            .then(res => {
                dispatch({
                    type: TimesheetsConstants.CREATE_TIMESHEETS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: TimesheetsConstants.CREATE_TIMESHEETS_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Xoá thông tin chấm công
 * @id : Id thông tin chấm công cần xoá
 */
function deleteTimesheets(id) {
    return dispatch => {
        dispatch({
            type: TimesheetsConstants.DELETE_TIMESHEETS_REQUEST
        });
        TimesheetsService.deleteTimesheets(id)
            .then(res => {
                dispatch({
                    type: TimesheetsConstants.DELETE_TIMESHEETS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: TimesheetsConstants.DELETE_TIMESHEETS_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Cập nhật thông tin chấm công
 * @id : Id thông tin chấm công cần cập nhật
 * @data : Dữ liệu cập nhập chấm công
 */
function updateTimesheets(id, data) {
    return dispatch => {
        dispatch({
            type: TimesheetsConstants.UPDATE_TIMESHEETS_REQUEST
        });
        TimesheetsService.updateTimesheets(id, data)
            .then(res => {
                dispatch({
                    type: TimesheetsConstants.UPDATE_TIMESHEETS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: TimesheetsConstants.UPDATE_TIMESHEETS_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Import thông tin chấm công
 * @param {*} data : Dữ liệu import
 */
function importTimesheets(data) {
    return dispatch => {
        dispatch({
            type: TimesheetsConstants.IMPORT_TIMESHEETS_REQUEST
        });
        TimesheetsService.importTimesheets(data)
            .then(res => {
                dispatch({
                    type: TimesheetsConstants.IMPORT_TIMESHEETS_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                dispatch({
                    type: TimesheetsConstants.IMPORT_TIMESHEETS_FAILURE,
                    error: err.response.data.content
                });
            })
    };
}
import {
    DisciplineConstants
} from "./constants";

import {
    DisciplineService
} from "./services";

export const DisciplineActions = {
    getListDiscipline,
    createNewDiscipline,
    deleteDiscipline,
    updateDiscipline,

    getListPraise,
    createNewPraise,
    deletePraise,
    updatePraise,
};

/**************************
 * Start
 * Quản lý kỷ luật
 **************************/

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListDiscipline(data) {
    return dispatch => {
        dispatch({
            type: DisciplineConstants.GET_DISCIPLINE_REQUEST
        });
        DisciplineService.getListDiscipline(data)
            .then(res => {
                dispatch({
                    type: DisciplineConstants.GET_DISCIPLINE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: DisciplineConstants.GET_DISCIPLINE_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Thêm mới kỷ luật của nhân viên
 * @data : Dữ liệu kỷ luật cần thêm 
 */
function createNewDiscipline(data) {
    return dispatch => {
        dispatch({
            type: DisciplineConstants.CREATE_DISCIPLINE_REQUEST
        });
        DisciplineService.createNewDiscipline(data)
            .then(res => {
                dispatch({
                    type: DisciplineConstants.CREATE_DISCIPLINE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: DisciplineConstants.CREATE_DISCIPLINE_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Xoá thông tin kỷ luật của nhân viên
 * @id : Id kỷ luật cần xoá 
 */
function deleteDiscipline(id) {
    return dispatch => {
        dispatch({
            type: DisciplineConstants.DELETE_DISCIPLINE_REQUEST
        });
        DisciplineService.deleteDiscipline(id)
            .then(res => {
                dispatch({
                    type: DisciplineConstants.DELETE_DISCIPLINE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: DisciplineConstants.DELETE_DISCIPLINE_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Cập nhật thông tin kỷ luật của nhân viên
 * @id : Id kỷ luật cần cập nhật 
 * @data  : Dữ liệu cập nhật
 */
function updateDiscipline(id, data) {
    return dispatch => {
        dispatch({
            type: DisciplineConstants.UPDATE_DISCIPLINE_REQUEST
        });
        DisciplineService.updateDiscipline(id, data)
            .then(res => {
                dispatch({
                    type: DisciplineConstants.UPDATE_DISCIPLINE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: DisciplineConstants.UPDATE_DISCIPLINE_FAILURE,
                    error: err
                });
            })
    }
}
/*************************
 * End
 * Quản lý kỷ luật
 *************************/




/*************************
 * Start
 * Quản lý khen thưởng
 *************************/

/**
 * Lấy danh sách khen thưởng
 * @data : dữ liệu key tìm kiếm 
 */
function getListPraise(data) {
    return dispatch => {
        dispatch({
            type: DisciplineConstants.GET_PRAISE_REQUEST
        });
        DisciplineService.getListPraise(data)
            .then(res => {
                dispatch({
                    type: DisciplineConstants.GET_PRAISE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: DisciplineConstants.GET_PRAISE_FAILURE,
                    error: err.response.data
                });
            })
    }
}

/**
 * Thêm mới thông tin khen thưởng
 * @data : dữ liệu khen thưởng thêm mới
 */
function createNewPraise(data) {
    return dispatch => {
        dispatch({
            type: DisciplineConstants.CREATE_PRAISE_REQUEST
        });
        DisciplineService.createNewPraise(data)
            .then(res => {
                dispatch({
                    type: DisciplineConstants.CREATE_PRAISE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: DisciplineConstants.CREATE_PRAISE_FAILURE,
                    error: err.response.data
                });
            })
    }
}

/**
 * Xoá thông tin khen thưởng
 * @id : Id khen thương cần xoá 
 */
function deletePraise(id) {
    return dispatch => {
        dispatch({
            type: DisciplineConstants.DELETE_PRAISE_REQUEST
        });
        DisciplineService.deletePraise(id)
            .then(res => {
                dispatch({
                    type: DisciplineConstants.DELETE_PRAISE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: DisciplineConstants.DELETE_PRAISE_FAILURE,
                    error: err.response.data
                });
            })
    }
}

/**
 * Cập nhật thông tin khen thưởng
 * @id : id khen thưởng cần cập nhật
 * @data  : Dữ liệu cập nhật khen thưởng
 */
function updatePraise(id, data) {
    return dispatch => {
        dispatch({
            type: DisciplineConstants.UPDATE_PRAISE_REQUEST
        });
        DisciplineService.updatePraise(id, data)
            .then(res => {
                dispatch({
                    type: DisciplineConstants.UPDATE_PRAISE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: DisciplineConstants.UPDATE_PRAISE_FAILURE,
                    error: err.response.data
                });
            })
    }
}
/**************************
 * End
 * Quản lý khen thưởng
 **************************/
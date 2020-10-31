import {
    RoleServices
} from "./services";
import {
    RoleConstants
} from "./constants";

export const RoleActions = {
    get,
    show,
    edit,
    create,
    destroy,
}

/**
 * Lấy danh sách tất cả các role của 1 công ty
 */
function get(data) {
    if (data) {
        return dispatch => {
            dispatch({
                type: RoleConstants.GET_ROLES_PAGINATE_REQUEST
            });
            RoleServices.get(data)
                .then(res => {
                    dispatch({
                        type: RoleConstants.GET_ROLES_PAGINATE_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(err => {
                    dispatch({
                        type: RoleConstants.GET_ROLES_PAGINATE_FAILE
                    });
                })
        }
    }

    return dispatch => {
        dispatch({
            type: RoleConstants.GET_ROLES_REQUEST
        });
        RoleServices.get()
            .then(res => {
                dispatch({
                    type: RoleConstants.GET_ROLES_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {

                dispatch({
                    type: RoleConstants.GET_ROLES_FAILE
                });
            })
    }
}

/**
 * Lấy thông tin của 1 role
 * @id id role
 */
function show(id) {
    return dispatch => {
        dispatch({
            type: RoleConstants.SHOW_ROLE_REQUEST
        });
        RoleServices.show(id)
            .then(res => {
                dispatch({
                    type: RoleConstants.SHOW_ROLE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: RoleConstants.SHOW_ROLE_FAILE
                });

            })
    }
}

/**
 * Tạo role do công ty tự định nghĩa
 * @role dữ liệu tạo
 */
function create(role) {
    return dispatch => {
        dispatch({
            type: RoleConstants.CREATE_ROLE_REQUEST
        });
        RoleServices
            .create(role)
            .then(res => {
                dispatch({
                    type: RoleConstants.CREATE_ROLE_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: RoleConstants.CREATE_ROLE_FAILE
                });
            })
    }
}

/**
 * Chỉnh sửa thông tin role
 * @role dữ liệu chỉnh sửa
 */
function edit(role) {
    return dispatch => {
        dispatch({
            type: RoleConstants.EDIT_ROLE_REQUEST
        });
        RoleServices.edit(role)
            .then(res => {
                dispatch({
                    type: RoleConstants.EDIT_ROLE_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: RoleConstants.EDIT_ROLE_FAILE
                });
            })
    }
}

/**
 * Xóa role theo id
 * @roleId id role
 */
function destroy(roleId) {
    return dispatch => {
        dispatch({
            type: RoleConstants.DELETE_ROLE_REQUEST
        });
        RoleServices.destroy(roleId)
            .then(res => {
                dispatch({
                    type: RoleConstants.DELETE_ROLE_SUCCESS,
                    payload: roleId
                })
            })
            .catch(err => {
                dispatch({
                    type: RoleConstants.DELETE_ROLE_FAILE
                });
            })
    }
}
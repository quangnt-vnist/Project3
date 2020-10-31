import {
    LinkServices
} from "./services";
import {
    LinkConstants
} from "./constants";

export const LinkActions = {
    get,
    show,
    edit,
    destroy,
};

/**
 * Lấy danh sách tất cả các link của 1 công ty
 */
function get(params) {
    if (params.page !== undefined && params.limit !== undefined) {
        return dispatch => {
            dispatch({
                type: LinkConstants.GET_LINKS_PAGINATE_REQUEST
            });
            LinkServices.get(params)
                .then(res => {
                    dispatch({
                        type: LinkConstants.GET_LINKS_PAGINATE_SUCCESS,
                        payload: res.data.content
                    })
                }).catch(err => {
                    dispatch({
                        type: LinkConstants.GET_LINKS_PAGINATE_FAILE,
                    })
                })
        }
    } else {
        return dispatch => {
            dispatch({
                type: LinkConstants.GET_LINKS_REQUEST
            });
            LinkServices.get(params)
                .then(res => {
                    dispatch({
                        type: LinkConstants.GET_LINKS_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(err => {
                    dispatch({
                        type: LinkConstants.GET_LINKS_FAILE
                    })
                })
        }
    }
}

/**
 * Lấy thông tin link theo id
 * @id id link
 */
function show(id) {
    return dispatch => {
        dispatch({
            type: LinkConstants.SHOW_LINK_REQUEST
        });
        LinkServices.show(id)
            .then(res => {
                dispatch({
                    type: LinkConstants.SHOW_LINK_SUCCESS,
                    payload: res.data.content
                })
            }).catch(err => {
                dispatch({
                    type: LinkConstants.SHOW_LINK_FAILE
                })
            })
    }
}

/**
 * Chỉnh sửa link
 * @id id link
 * @link dữ liệu về link
 */
function edit(id, link) {
    return dispatch => {
        dispatch({
            type: LinkConstants.EDIT_LINK_REQUEST
        });
        LinkServices.edit(id, link)
            .then(res => {
                dispatch({
                    type: LinkConstants.EDIT_LINK_SUCCESS,
                    payload: res.data.content
                })
            }).catch(err => {
                dispatch({
                    type: LinkConstants.EDIT_LINK_FAILE
                })
            })
    }
}

/**
 * Xóa link
 * @id id link
 */
function destroy(id, link) {
    return dispatch => {
        dispatch({
            type: LinkConstants.DELETE_LINK_REQUEST
        });
        LinkServices.destroy(id, link)
            .then(res => {
                dispatch({
                    type: LinkConstants.DELETE_LINK_SUCCESS,
                    payload: id
                })
            }).catch(err => {
                dispatch({
                    type: LinkConstants.DELETE_LINK_FAILE
                })
            })
    }
}
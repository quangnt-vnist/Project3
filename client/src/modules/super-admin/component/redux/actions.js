import {
    ComponentServices
} from "./services";
import {
    ComponentConstants
} from "./constants";

export const ComponentActions = {
    get,
    show,
    edit,
    create,
    destroy,
}

/**
 * Lấy danh sách các component của công ty
 */
function get(params) {
    if(params.page !== undefined && params.limit !== undefined) {
        return dispatch => {
            dispatch({
                type: ComponentConstants.GET_COMPONENTS_PAGINATE_REQUEST
            });
            ComponentServices.get(params)
                .then(res => {
                    dispatch({
                        type: ComponentConstants.GET_COMPONENTS_PAGINATE_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(err => {
                    dispatch({
                        type: ComponentConstants.GET_COMPONENTS_PAGINATE_FAILE
                    })
                })
        }
    } else {
        return dispatch => {
            dispatch({
                type: ComponentConstants.GET_COMPONENTS_REQUEST
            });
            ComponentServices.get(params)
                .then(res => {
                    dispatch({
                        type: ComponentConstants.GET_COMPONENTS_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(err => {
                    dispatch({
                        type: ComponentConstants.GET_COMPONENTS_FAILE
                    })
                })
        }
    }
}

/**
 * Lấy component theo id
 * @id id component
 */
function show(id) {
    return dispatch => {
        dispatch({
            type: ComponentConstants.SHOW_COMPONENT_REQUEST
        });
        ComponentServices.show(id)
            .then(res => {
                dispatch({
                    type: ComponentConstants.SHOW_COMPONENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {

            })
    }
}

/**
 * Tạo component
 * @component dữ liệu component
 */
function create(component) {
    return dispatch => {
        dispatch({
            type: ComponentConstants.CREATE_COMPONENT_REQUEST
        });
        ComponentServices.create(component)
            .then(res => {
                dispatch({
                    type: ComponentConstants.CREATE_COMPONENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {})

    }
}

/**
 * Sửa component
 * @id id component
 * @component dữ liệu
 */
function edit(id, component) {
    return dispatch => {
        dispatch({
            type: ComponentConstants.EDIT_COMPONENT_REQUEST
        });
        ComponentServices.edit(id, component)
            .then(res => {
                dispatch({
                    type: ComponentConstants.EDIT_COMPONENT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {})
    }
}

/**
 * Xóa component
 * @id id component
 */
function destroy(id, component) {
    return dispatch => {
        dispatch({
            type: ComponentConstants.DELETE_COMPONENT_REQUEST
        });
        ComponentServices.destroy(id, component)
            .then(res => {
                dispatch({
                    type: ComponentConstants.DELETE_COMPONENT_SUCCESS,
                    payload: id
                })
            })
            .catch(err => {})
    }
}
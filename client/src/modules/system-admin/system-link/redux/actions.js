import { SystemLinkServices } from "./services";
import { SystemLinkConstants } from "./constants";

export const SystemLinkActions = {
    getAllSystemLinks,
    getAllSystemLinkCategories,
    getSystemLink,
    createSystemLink,
    editSystemLink,
    deleteSystemLink
};

function getAllSystemLinks(data) {
    if (!data) {
        return dispatch => {
            dispatch({ type: SystemLinkConstants.GET_LINKS_DEFAULT_REQUEST });

            SystemLinkServices.getAllSystemLinks()
                .then(res => {
                    dispatch({
                        type: SystemLinkConstants.GET_LINKS_DEFAULT_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({ type: SystemLinkConstants.GET_LINKS_DEFAULT_FAILE });
                })
        }
    } else {
        return dispatch => {
            dispatch({ type: SystemLinkConstants.GET_LINKS_DEFAULT_PAGINATE_REQUEST });

            SystemLinkServices.getAllSystemLinks(data)
                .then(res => {
                    dispatch({
                        type: SystemLinkConstants.GET_LINKS_DEFAULT_PAGINATE_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({ type: SystemLinkConstants.GET_LINKS_DEFAULT_PAGINATE_FAILE });
                })
        }
    }
}

function getAllSystemLinkCategories() {
    return dispatch => {
        dispatch({ type: SystemLinkConstants.GET_LINKS_DEFAULT_CATEGORIES_REQUEST });

        SystemLinkServices.getAllSystemLinkCategories()
            .then(res => {
                dispatch({
                    type: SystemLinkConstants.GET_LINKS_DEFAULT_CATEGORIES_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ type: SystemLinkConstants.GET_LINKS_DEFAULT_CATEGORIES_FAILE });
            })
    }
}

function getSystemLink(id) {
    return dispatch => {
        dispatch({ type: SystemLinkConstants.SHOW_LINK_DEFAULT_REQUEST });

        SystemLinkServices.getSystemLink(id)
            .then(res => {
                dispatch({
                    type: SystemLinkConstants.SHOW_LINK_DEFAULT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ type: SystemLinkConstants.SHOW_LINK_DEFAULT_FAILE });
            })
    }
}

function createSystemLink(link) {
    return dispatch => {
        dispatch({ type: SystemLinkConstants.CREATE_LINK_DEFAULT_REQUEST });

        SystemLinkServices.createSystemLink(link)
            .then(res => {
                dispatch({
                    type: SystemLinkConstants.CREATE_LINK_DEFAULT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: SystemLinkConstants.CREATE_LINK_DEFAULT_FAILE });
            })
    }
}

function editSystemLink(id, data) {
    return dispatch => {
        dispatch({ type: SystemLinkConstants.EDIT_LINK_DEFAULT_REQUEST });

        SystemLinkServices.editSystemLink(id, data)
            .then(res => {
                dispatch({
                    type: SystemLinkConstants.EDIT_LINK_DEFAULT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ type: SystemLinkConstants.EDIT_LINK_DEFAULT_FAILE });
            })
    }
}

function deleteSystemLink(id, link) {
    return dispatch => {
        dispatch({ type: SystemLinkConstants.DELETE_LINK_DEFAULT_REQUEST });

        SystemLinkServices.deleteSystemLink(id, link)
            .then(res => {
                dispatch({
                    type: SystemLinkConstants.DELETE_LINK_DEFAULT_SUCCESS,
                    payload: id
                })
            })
            .catch(error => {
                dispatch({ type: SystemLinkConstants.DELETE_LINK_DEFAULT_FAILE });
            })
    }
}

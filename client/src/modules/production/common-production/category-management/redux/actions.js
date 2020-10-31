import { CategoryServices } from './services';
import { CategoryConstants } from './constants';

export const CategoryActions = {
    getCategoryToTree,
    getCategoriesByType,
    createCategory,
    editCategory,
    deleteCategory,
}

function getCategoryToTree() {
    return dispatch => {
        dispatch({
            type: CategoryConstants.GETALL_CATEGORY_TREE_REQUEST
        });
        CategoryServices.getCategoryToTree()
        .then(res => {
            dispatch({
                type: CategoryConstants.GETALL_CATEGORY_TREE_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: CategoryConstants.GETALL_CATEGORY_TREE_FAILURE,
                error: err
            })
        })
    }
}

function getCategoriesByType(data) {
    return dispatch => {
        dispatch({ type: CategoryConstants.GETALL_CATEGORY_BY_TYPE_REQUEST });
        CategoryServices.getCategoriesByType(data)
        .then(res => {
            dispatch({
                type: CategoryConstants.GETALL_CATEGORY_BY_TYPE_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: CategoryConstants.GETALL_CATEGORY_BY_TYPE_FAILURE,
                error: err
            })
        })
    }
}

function createCategory(data){
    return dispatch => {
        dispatch({
            type: CategoryConstants.CREATE_CATEGORY_REQUEST
        });
        CategoryServices.createCategory(data)
        .then(res => {
            dispatch({
                type: CategoryConstants.CREATE_CATEGORY_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: CategoryConstants.CREATE_CATEGORY_FAILURE,
                error: err
            })
        })
    }
}

function editCategory(id, data){
    return dispatch => {
        dispatch({
            type: CategoryConstants.UPDATE_CATEGORY_REQUEST
        });
        CategoryServices.editCategory(id, data)
        .then(res => {
            dispatch({
                type: CategoryConstants.UPDATE_CATEGORY_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: CategoryConstants.UPDATE_CATEGORY_FAILURE,
                error: err
            })
        })
    }
}

function deleteCategory(data, type = "single") {
    return dispatch => {
        dispatch({
            type: CategoryConstants.DELETE_CATEGORY_REQUEST
        });
        if(type !== "single"){
            CategoryServices.deleteManyCategories(data)
            .then(res => {
                dispatch({
                    type: CategoryConstants.DELETE_CATEGORY_SUCCESS,
                    payload: {
                        list: res.data.content.list,
                        tree: res.data.content.tree
                    }
                })
            })
            .catch(err => {
                dispatch({
                    type: CategoryConstants.DELETE_CATEGORY_FAILURE,
                    error: err
                })
            })
        }
        else {
           CategoryServices.deleteCategory(data)
            .then(res => {
                dispatch({
                    type: CategoryConstants.DELETE_CATEGORY_SUCCESS,
                    payload: {
                        list: res.data.content.list,
                        tree: res.data.content.tree
                    }
                })
            })
            .catch(err => {
                dispatch({
                    type: CategoryConstants.DELETE_CATEGORY_FAILURE,
                    error: err
                })
            }) 
        }
        
    }
}
import { exampleConstants } from './constants';
import { exampleServices } from './services';

export const exampleActions = {
    getOnlyExampleName,
    deleteExample,
    createExample,
    editExample,
    getExampleDetail
}

function getOnlyExampleName(queryData) {
    return (dispatch) => {
        dispatch({
            type: exampleConstants.GET_ALL_ONLY_EXAMPLE_NAME_REQUEST
        });

        exampleServices
            .getOnlyExampleName(queryData)
            .then((res) => {
                dispatch({
                    type: exampleConstants.GET_ALL_ONLY_EXAMPLE_NAME_SUCCESS,
                    payload: res.data
                });
            })
            .catch((error) => {
                dispatch({
                    type: exampleConstants.GET_ALL_ONLY_EXAMPLE_NAME_FAILURE,
                    error
                });
            });
    }
}

function deleteExample(id) {
    return (dispatch) => {
        dispatch({
            type: exampleConstants.DELETE_EXAMPLE_REQUEST
        });

        exampleServices
            .deleteExample(id)
            .then((res) => {
                dispatch({
                    type: exampleConstants.DELETE_EXAMPLE_SUCCESS,
                    payload: res.data
                });
            })
            .catch((error) => {
                dispatch({
                    type: exampleConstants.DELETE_EXAMPLE_FAILURE,
                    error
                });
            });
    }
}

function createExample(data) {
    return (dispatch) => {
        dispatch({
            type: exampleConstants.CREATE_EXAMPLE_REQUEST
        });
        exampleServices
            .createExample(data)
            .then((res) => {
                dispatch({
                    type: exampleConstants.CREATE_EXAMPLE_SUCCESS,
                    payload: res.data
                });
            })
            .catch((error) => {
                dispatch({
                    type: exampleConstants.CREATE_EXAMPLE_FAILURE,
                    error
                });
            });
    }
}

function editExample(id, data) {
    return (dispatch) => {
        dispatch({
            type: exampleConstants.EDIT_EXAMPLE_REQUEST
        });
        exampleServices
            .editExample(id, data)
            .then((res) => {
                dispatch({
                    type: exampleConstants.EDIT_EXAMPLE_SUCCESS,
                    payload: res.data
                });
            })
            .catch((error) => {
                dispatch({
                    type: exampleConstants.EDIT_EXAMPLE_FAILURE,
                    error
                });
            });
    }
}

function getExampleDetail(id) {
    return (dispatch) => {
        dispatch({
            type: exampleConstants.GET_EXAMPLE_DETAIL_REQUEST
        });
        exampleServices
            .getExampleDetail(id)
            .then((res) => {
                dispatch({
                    type: exampleConstants.GET_EXAMPLE_DETAIL_SUCCESS,
                    payload: res.data
                });
            })
            .catch((error) => {
                dispatch({
                    type: exampleConstants.GET_EXAMPLE_DETAIL_FAILURE,
                    error
                });
            });
    }
}
import { exampleConstants } from './constants';
import { exampleServices } from './services';

export const exampleActions = {
    getExamples,
    deleteExample,
    createExample,
    editExample
}

function getExamples(queryData) {
    return (dispatch) => {
        dispatch({
            type: exampleConstants.GET_ALL_EXAMPLES_REQUEST
        });

        exampleServices
            .getExamples(queryData)
            .then((res) => {
                dispatch({
                    type: exampleConstants.GET_ALL_EXAMPLES_SUCCESS,
                    payload: res.data
                });
            })
            .catch((error) => {
                dispatch({
                    type: exampleConstants.GET_ALL_EXAMPLES_FAILURE,
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
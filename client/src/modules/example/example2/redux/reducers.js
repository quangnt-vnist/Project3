import { exampleConstants } from './constants';

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}

const initialState = {
    lists: [],
    isLoading: true,
    error: null,
    totalList: 0,
}

export function example2(state = initialState, action) {
    let index = -1;
    switch (action.type) {
        case exampleConstants.GET_ALL_ONLY_EXAMPLE_NAME_REQUEST:
        case exampleConstants.DELETE_EXAMPLE_REQUEST:
        case exampleConstants.CREATE_EXAMPLE_REQUEST:
        case exampleConstants.EDIT_EXAMPLE_REQUEST:
        case exampleConstants.GET_EXAMPLE_DETAIL_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case exampleConstants.GET_ALL_ONLY_EXAMPLE_NAME_FAILURE:
        case exampleConstants.DELETE_EXAMPLE_FAILURE:
        case exampleConstants.CREATE_EXAMPLE_FAILURE:
        case exampleConstants.EDIT_EXAMPLE_FAILURE:
        case exampleConstants.GET_ALL_ONLY_EXAMPLE_NAME_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case exampleConstants.GET_ALL_ONLY_EXAMPLE_NAME_SUCCESS:
            return {
                ...state,
                lists: action.payload.content.data,
                totalList: action.payload.content.totalList,
                isLoading: false
            }
        case exampleConstants.DELETE_EXAMPLE_SUCCESS:
            return {
                ...state,
                lists: state.lists.filter(example => (example._id !== action.payload.content._id)),
                isLoading: false
            }
        case exampleConstants.CREATE_EXAMPLE_SUCCESS:
            return {
                ...state,
                lists: [
                    ...state.lists,
                    action.payload.content.example
                ],
                isLoading: false
            }
        case exampleConstants.EDIT_EXAMPLE_SUCCESS:
            index = findIndex(state.lists, action.payload.content.example._id);
            if (index !== -1) {
                state.lists[index] = action.payload.content.example
            }
            return {
                ...state,
                isLoading: false
            }
        case exampleConstants.GET_EXAMPLE_DETAIL_SUCCESS:
            return {
                ...state,
                currentDetailExample: action.payload.content.example,
                isLoading: false
            }
        default:
            return state
    }
}
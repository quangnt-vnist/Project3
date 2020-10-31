import { RootRoleConstants } from "./constants";

const initState = {
    list: [],
    error: null,
    isLoading: true
}

export function rootRoles(state = initState, action) {
    switch (action.type) {
        case RootRoleConstants.GET_ALL_ROOT_ROLE_REQUEST:
            return {
                ...state,
                isLoading: true,
            }

        case RootRoleConstants.GET_ALL_ROOT_ROLE_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            };

        case RootRoleConstants.GET_ALL_ROOT_ROLE_FAILURE:
            return {
                ...state,
                isLoading: false,
            }

        default:
            return state;
    }
}

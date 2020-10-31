import {
    AuthConstants
} from "./constants";

export const CallApiStatus = {
    INITIALIZED: 0,
    CALLING: 1,
    FINISHED: 2,
}
var initState = {
    calledAPI: CallApiStatus.INITIALIZED,
    user: {},
    links: [],
    components: [],
    error: null,
    forgotPassword: false,
    reset_password: false,
    showFiles: [],
    isLoading: false
}

export function auth(state = initState, action) {

    switch (action.type) {
        case AuthConstants.GET_LINKS_OF_ROLE_REQUEST:
            return {
                ...state,
                isLoading: true,
                    error: null,
                    calledAPI: CallApiStatus.CALLING,
            };
        case AuthConstants.LOGIN_REQUEST:
        case AuthConstants.FORGOT_PASSWORD_REQUEST:
        case AuthConstants.RESET_PASSWORD_REQUEST:
        case AuthConstants.EDIT_PROFILE_REQUEST:
        case AuthConstants.CHANGE_USER_INFORMATION_REQUEST:
        case AuthConstants.CHANGE_USER_PASSWORD_REQUEST:
        case AuthConstants.GET_COMPONENTS_OF_USER_IN_LINK_REQUEST:
            return {
                ...state,
                isLoading: true,
                    error: null
            };

        case AuthConstants.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
                    isLoading: false,
                    error: null
            };

        case AuthConstants.LOGIN_FAILE:
            return {
                ...state,
                isLoading: false,
                    user: {
                        _id: null,
                        name: null,
                        email: null,
                        roles: null,
                        company: null
                    },
                    error: action.payload
            };

        case AuthConstants.EDIT_PROFILE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    user: action.payload
            };

        case AuthConstants.CHANGE_USER_INFORMATION_SUCCESS:
        case AuthConstants.CHANGE_USER_PASSWORD_SUCCESS:
            return {
                ...state,
                user: action.payload,
                    isLoading: false,
                    error: null
            };

        case AuthConstants.REFRESH_DATA_USER_SUCCESS:
            if (localStorage.getItem('currentRole') === null) {
                localStorage.setItem('currentRole', action.payload.roles[0].roleId._id);
            }
            return {
                ...state,
                isLoading: false,
                    user: action.payload
            };

        case AuthConstants.GET_LINKS_OF_ROLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    links: action.payload,
                    calledAPI: CallApiStatus.FINISHED,
            };

        case AuthConstants.GET_COMPONENTS_OF_USER_IN_LINK_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    components: action.payload
            };

        case AuthConstants.FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    forgotPassword: action.payload
            };

        case AuthConstants.RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                reset_password: true,
                    isLoading: false
            };

        case AuthConstants.GET_LINKS_OF_ROLE_FAILE:
            return {
                ...state,
                isLoading: false,
                    calledAPI: CallApiStatus.FINISHED,
            };

        case AuthConstants.REFRESH_DATA_USER_FAILE:
        case AuthConstants.GET_COMPONENTS_OF_USER_IN_LINK_FAILE:
        case AuthConstants.CHANGE_USER_INFORMATION_FAILE:
        case AuthConstants.CHANGE_USER_PASSWORD_FAILE:
            return {
                ...state,
                isLoading: false,
            };

        case AuthConstants.DOWNLOAD_FILE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };

        case AuthConstants.DOWNLOAD_FILE_SUCCESS:
            if (action.payload && action.payload.fileName) { // Hiển thị image download về qua chuyển đổi base64
                return {
                    ...state,
                    showFiles: [...state.showFiles.filter(x => x.fileName !== action.payload.fileName), action.payload],
                    isLoading: false,
                };
            } else { // Save image về máy
                return {
                    ...state
                };
            }

            case AuthConstants.DOWNLOAD_FILE_FAILURE:
                return {
                    ...state,
                    isLoading: false,
                };

            default:
                return {
                    ...state
                };
    }
}
import { AuthService } from "./services";
import { AuthConstants } from "./constants";
import { setStorage } from '../../../config';
import { SocketConstants } from "../../socket/redux/constants";
const FileDownload = require('js-file-download');
export const AuthActions = {
    login,
    logout,
    logoutAllAccount,
    editProfile,
    getLinksOfRole,
    refresh,
    resetPassword,
    forgotPassword,
    getComponentOfUserInLink,
    changeInformation,
    changePassword,
    downloadFile
}

function login(user){
    return dispatch => {
        dispatch({type: AuthConstants.LOGIN_REQUEST});
        AuthService.login(user)
            .then(res => {
                setStorage('jwt', res.data.content.token);
                setStorage('userId', res.data.content.user._id);
                setStorage('portal', res.data.content.user.portal);
                if(res.data.content.user.company!== undefined){
                    setStorage('companyId', res.data.content.user.company._id);
                }
                if(res.data.content.user.roles.length > 0) 
                    setStorage('currentRole', res.data.content.user.roles[0].roleId._id);
                dispatch({
                    type: AuthConstants.LOGIN_SUCCESS,
                    payload: res.data.content.user
                })
                dispatch({ type: SocketConstants.CONNECT_SOCKET_IO })
            })
            .catch(err => {
                dispatch({type: AuthConstants.LOGIN_FAILE, payload: err.response.data.messages[0]});
                dispatch({ type: SocketConstants.DISCONNECT_SOCKET_IO })
            })
    }
}

function logout(){
    return dispatch => {
        dispatch({type: AuthConstants.LOGOUT_REQUEST});
        AuthService.logout()
            .then(res => {
                // Do sẽ reset localStorage và redux, không cần gọi dispatch({type: AuthConstants.LOGOUT_SUCCESS});
                dispatch({type: SocketConstants.DISCONNECT_SOCKET_IO})
                dispatch({type: 'RESET'})
            })
            .catch(err => {
                dispatch({type: AuthConstants.LOGOUT_FAILE});
            })
    }
}

function logoutAllAccount(){
    return dispatch => {
        dispatch({type: AuthConstants.LOGOUT_ALL_REQUEST});
        AuthService.logoutAllAccount()
            .then(res => {
                // Do sẽ reset localStorage và redux, Không cần gọi dispatch({type: AuthConstants.LOGOUT_ALL_SUCCESS});
                dispatch({type: SocketConstants.DISCONNECT_SOCKET_IO})
                dispatch({type: 'RESET'});
            })
            .catch(err => {
                dispatch({type: AuthConstants.LOGOUT_ALL_FAILE});
            })
    }
}

function editProfile(data){
    return dispatch => {
        dispatch({type: AuthConstants.EDIT_PROFILE_REQUEST});
        AuthService.editProfile(data)
            .then(res => {
                dispatch({
                    type: AuthConstants.EDIT_PROFILE_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({type: AuthConstants.EDIT_PROFILE_FAILE});
            })
    }
}

function changeInformation(data){
    return dispatch => {
        dispatch({ type: AuthConstants.CHANGE_USER_INFORMATION_REQUEST});
        AuthService.changeInformation(data)
            .then(res => {
                dispatch({
                    type: AuthConstants.CHANGE_USER_INFORMATION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: AuthConstants.CHANGE_USER_INFORMATION_FAILE});
            })
    }
}

function changePassword(data){
    return dispatch => {
        dispatch({ type: AuthConstants.CHANGE_USER_PASSWORD_REQUEST });
        AuthService.changePassword(data)
        .then(res => {
            dispatch({
                type: AuthConstants.CHANGE_USER_PASSWORD_SUCCESS,
                payload: res.data.content
            });
        })
        .catch(err => {
            dispatch({ type: AuthConstants.CHANGE_USER_PASSWORD_FAILE });
        })
    }
}

function getLinksOfRole(idRole){
    return dispatch => {
        dispatch({ type: AuthConstants.GET_LINKS_OF_ROLE_REQUEST });
        return new Promise((resolve, reject)=>{
            AuthService.getLinksOfRole(idRole)
            .then(res => {
                dispatch({
                    type: AuthConstants.GET_LINKS_OF_ROLE_SUCCESS,
                    payload: res.data.content
                });
                resolve(res);
            })
            .catch(err => {
                dispatch({type: AuthConstants.GET_LINKS_OF_ROLE_FAILE});
                reject(err);
            })
        })
        
    }
}

function refresh(){
    return dispatch => {
        dispatch({ type: AuthConstants.REFRESH_DATA_USER_REQUEST});
        AuthService.refresh()
            .then(res => {
                dispatch({
                    type: AuthConstants.REFRESH_DATA_USER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({type: AuthConstants.REFRESH_DATA_USER_FAILE});
            })
    }
}

function forgotPassword(data){
    return dispatch => {
        dispatch({type: AuthConstants.FORGOT_PASSWORD_REQUEST});
        AuthService.forgotPassword(data)
            .then(res => {
                dispatch({
                    type: AuthConstants.FORGOT_PASSWORD_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({type: AuthConstants.FORGOT_PASSWORD_FAILE});
            })
    }
}

function resetPassword(data){
    return dispatch => {
        dispatch({type: AuthConstants.RESET_PASSWORD_REQUEST});
        AuthService.resetPassword(data)
            .then(res => {
                dispatch({
                    type: AuthConstants.RESET_PASSWORD_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({type: AuthConstants.RESET_PASSWORD_FAILE});
            })
        
    }
}

function getComponentOfUserInLink(curentRole, linkId){
    return dispatch => {
        dispatch({ type: AuthConstants.GET_COMPONENTS_OF_USER_IN_LINK_REQUEST});
        AuthService.getComponentOfUserInLink(curentRole, linkId)
            .then(res => {
                dispatch({
                    type: AuthConstants.GET_COMPONENTS_OF_USER_IN_LINK_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({type: AuthConstants.GET_COMPONENTS_OF_USER_IN_LINK_FAILE});
            })
    }
}
function downloadFile(path, fileName, save=true) {
    return dispatch => {
        dispatch({ type: AuthConstants.DOWNLOAD_FILE_REQUEST });
        AuthService.downloadFile(path)
            .then(res => {
                if (!save) {
                    let fileLoad = new FileReader();
                    fileLoad.readAsDataURL(res.data);
                    fileLoad.onload = () => {
                        dispatch({
                            type: AuthConstants.DOWNLOAD_FILE_SUCCESS,
                            payload: {
                                fileName: fileName,
                                file: fileLoad.result
                            }
                        });
                    }
                } else {
                    dispatch({
                        type: AuthConstants.DOWNLOAD_FILE_SUCCESS
                    });
                    const content = res.headers['content-type'];
                    FileDownload(res.data, fileName, content);
                }
            })
            .catch(err => { dispatch({ type: AuthConstants.DOWNLOAD_FILE_FAILURE }) })
    }
}
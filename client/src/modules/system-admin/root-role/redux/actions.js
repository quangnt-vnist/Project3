import { RootRoleServices } from "./services";
import { RootRoleConstants } from "./constants";

export const RootRoleActions = {
    getAllRootRoles
}

function getAllRootRoles() {
    return dispatch => {
        dispatch({ type: RootRoleConstants.GET_ALL_ROOT_ROLE_REQUEST });

        RootRoleServices.getAllRootRoles()
            .then(res => {
                dispatch({
                    type: RootRoleConstants.GET_ALL_ROOT_ROLE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ 
                    type: RootRoleConstants.GET_ALL_ROOT_ROLE_FAILURE,
                    payload: error
                });
            })
    }
}
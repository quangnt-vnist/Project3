import { SystemComponentServices } from "./services";
import { SystemComponentConstants } from "./constants";

export const SystemComponentActions = {
    getAllSystemComponents,
    getSystemComponent,
    createSystemComponent,
    editSystemComponent,
    deleteSystemComponent
}

function getAllSystemComponents(data) {
    if (!data) {
        return dispatch => {
            dispatch({ type: SystemComponentConstants.GET_ALL_COMPONENTS_DEFAULT_REQUEST });

            SystemComponentServices.getAllSystemComponents()
                .then(res => {
                    dispatch({
                        type: SystemComponentConstants.GET_ALL_COMPONENTS_DEFAULT_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(error => {
                    dispatch({ 
                        type: SystemComponentConstants.GET_ALL_COMPONENTS_DEFAULT_FAILURE,
                        payload: error
                    });
                    
                })
        }
    } else {
        return dispatch => {
            dispatch({ type: SystemComponentConstants.GET_ALL_COMPONENTS_DEFAULT_PAGINATE_REQUEST });

            SystemComponentServices.getAllSystemComponents(data)
                .then(res => {
                    dispatch({
                        type: SystemComponentConstants.GET_ALL_COMPONENTS_DEFAULT_PAGINATE_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(err => {
                    dispatch({ type: SystemComponentConstants.GET_ALL_COMPONENTS_DEFAULT_PAGINATE_FAILURE });
                })
        }
    }
}

function getSystemComponent(id) {
    return dispatch => {
        dispatch({ type: SystemComponentConstants.GET_COMPONENT_DEFAULT_REQUEST });

        SystemComponentServices.getSystemComponent(id)
            .then(res => {
                dispatch({
                    type: SystemComponentConstants.GET_COMPONENT_DEFAULT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: SystemComponentConstants.GET_COMPONENT_DEFAULT_FAILURE });
                
            })
    }
}

function createSystemComponent(component) {
    return dispatch => {
        dispatch({ type: SystemComponentConstants.CREATE_COMPONENT_DEFAULT_REQUEST });

        SystemComponentServices.createSystemComponent(component)
            .then(res => {
                dispatch({
                    type: SystemComponentConstants.CREATE_COMPONENT_DEFAULT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: SystemComponentConstants.CREATE_COMPONENT_DEFAULT_FAILURE });
            })
        
    }
}

function editSystemComponent(id, component){
    return dispatch => {
        dispatch({ type: SystemComponentConstants.EDIT_COMPONENT_DEFAULT_REQUEST });

        SystemComponentServices.editSystemComponent(id, component)
            .then(res => {
                dispatch({
                    type: SystemComponentConstants.EDIT_COMPONENT_DEFAULT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: SystemComponentConstants.EDIT_COMPONENT_DEFAULT_FAILURE });
            })
    }
}

function deleteSystemComponent(id, component){
    return dispatch => {
        dispatch({ type: SystemComponentConstants.DELETE_COMPONENT_DEFAULT_REQUEST });

        SystemComponentServices.deleteSystemComponent(id, component)
            .then(res => {
                dispatch({
                    type: SystemComponentConstants.DELETE_COMPONENT_DEFAULT_SUCCESS,
                    payload: id
                })
            })
            .catch(err => {
                dispatch({ type: SystemComponentConstants.DELETE_COMPONENT_DEFAULT_FAILURE });
            })
    }
}



import { NotificationServices } from "./services";
import { NotificationConstants } from "./constants";

export const NotificationActions = {
    getAllManualNotifications,
    paginateManualNotifications,
    getAllNotifications,
    paginateNotifications,
    create,
    readedNotification,
    deleteManualNotification,
    deleteNotification,
    setLevelNotificationReceivered,
    setLevelNotificationSent,
    receiveNotification
}

function getAllManualNotifications(){
    return dispatch => {
        dispatch({ type: NotificationConstants.GET_MANUAL_NOTIFICATIONS_REQUEST});
        NotificationServices
            .getAllManualNotifications()
            .then(res => {
                dispatch({
                    type: NotificationConstants.GET_MANUAL_NOTIFICATIONS_SUCCESS,
                    payload: res.data.content //danh sách các notification
                });
            })
            .catch(err => {
                dispatch({ type: NotificationConstants.GET_MANUAL_NOTIFICATIONS_FAILE});
            })
    }
}

function paginateManualNotifications(data){
    return dispatch => {
        dispatch({ type: NotificationConstants.PAGINATE_MANUAL_NOTIFICATIONS_REQUEST});
        NotificationServices
            .paginateManualNotifications(data)
            .then(res => {
                dispatch({
                    type: NotificationConstants.PAGINATE_MANUAL_NOTIFICATIONS_SUCCESS,
                    payload: res.data.content //danh sách các notification
                });
            })
            .catch(err => {
                dispatch({ type: NotificationConstants.PAGINATE_MANUAL_NOTIFICATIONS_FAILE});
            })
    }
}

function getAllNotifications(){
    return dispatch => {
        dispatch({ type: NotificationConstants.GET_NOTIFICATIONS_REQUEST});
        NotificationServices
            .getAllNotifications()
            .then(res => {
                dispatch({
                    type: NotificationConstants.GET_NOTIFICATIONS_SUCCESS,
                    payload: res.data.content //danh sách các notification
                });
            })
            .catch(err => {
                dispatch({ type: NotificationConstants.GET_NOTIFICATIONS_FAILE});
            })
    }
}

function paginateNotifications(data){
    return dispatch => {
        dispatch({ type: NotificationConstants.PAGINATE_NOTIFICATIONS_REQUEST});
        NotificationServices
            .paginateNotifications(data)
            .then(res => {
                dispatch({
                    type: NotificationConstants.PAGINATE_NOTIFICATIONS_SUCCESS,
                    payload: res.data.content //danh sách các notification
                });
            })
            .catch(err => {
                dispatch({ type: NotificationConstants.PAGINATE_NOTIFICATIONS_FAILE});
            })
    }
}

function create(data){
    return dispatch => {
        dispatch({ type: NotificationConstants.CREATE_NOTIFICATION_REQUEST});
        NotificationServices
            .create(data)
            .then(res => {
                dispatch({
                    type: NotificationConstants.CREATE_NOTIFICATION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: NotificationConstants.CREATE_NOTIFICATION_FAILE});
            })
    }
}

function readedNotification(data){
    return dispatch => {
        dispatch({ type: NotificationConstants.READED_NOTIFICATION_REQUEST});
        NotificationServices
            .readedNotification(data)
            .then(res => {
                dispatch({
                    type: NotificationConstants.READED_NOTIFICATION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: NotificationConstants.READED_NOTIFICATION_FAILE});
            })
    }
}

function deleteManualNotification(id){
    return dispatch => {
        dispatch({ type: NotificationConstants.DELETE_MANUAL_NOTIFICATION_REQUEST});
        NotificationServices
            .deleteManualNotification(id)
            .then(res => {
                dispatch({
                    type: NotificationConstants.DELETE_MANUAL_NOTIFICATION_SUCCESS,
                    payload: id
                });
            })
            .catch(err => {
                dispatch({ type: NotificationConstants.DELETE_MANUAL_NOTIFICATION_FAILE});
            })
    }
}

function deleteNotification(id){
    return dispatch => {
        dispatch({ type: NotificationConstants.DELETE_NOTIFICATION_REQUEST});
        NotificationServices
            .deleteNotification(id)
            .then(res => {
                dispatch({
                    type: NotificationConstants.DELETE_NOTIFICATION_SUCCESS,
                    payload: id
                });
            })
            .catch(err => {
                dispatch({ type: NotificationConstants.DELETE_NOTIFICATION_FAILE});
            })
    }
}

function setLevelNotificationReceivered(level=undefined){
    return dispatch => dispatch({ type: NotificationConstants.SET_LEVEL_TO_QUERY_NOTIFICATION_RECEIVERED, level});
}

function setLevelNotificationSent(level=undefined){
    return dispatch => dispatch({ type: NotificationConstants.SET_LEVEL_TO_QUERY_NOTIFICATION_SENT, level});
}

function receiveNotification(notification){
    return dispatch => dispatch({
        type: NotificationConstants.RECEIVE_NOTIFICATION_SUCCESS,
        payload: notification
    })
}


import { sendRequest } from '../../../helpers/requestHelper';

export const NotificationServices = {
    getAllManualNotifications,
    paginateManualNotifications,
    getAllNotifications,
    paginateNotifications,
    create,
    readedNotification,
    deleteManualNotification,
    deleteNotification
};

function getAllManualNotifications() {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/notifications/get`,
        method: 'GET',
    }, false, false, 'notification');
}

function paginateManualNotifications(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/notifications/paginate`,
        method: 'POST',
        data
    }, false, false, 'notification');
}

function getAllNotifications() {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/notifications/get-notifications`,
        method: 'GET',
    }, false, false, 'notification');
}

function paginateNotifications(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/notifications/paginate-notifications`,
        method: 'POST',
        data
    }, false, false, 'notification');
}

function create(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/notifications/create`,
        method: 'POST',
        data,
    }, true, true, 'notification');
}

function readedNotification(data) {
    console.log(data);
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/notifications/readed`,
        method: 'PATCH',
        data
    }, false, false, 'notification');
}

function deleteManualNotification(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/notifications/delete-manual-notification/${id}`,
        method: 'DELETE',
    }, true, true, 'notification');
}

function deleteNotification(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/notifications/delete-notification/${id}`,
        method: 'DELETE',
    }, true, true, 'notification');
}
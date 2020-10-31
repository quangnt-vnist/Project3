import { NotificationConstants } from "./constants";

const initState = {
    sent: {
        level: undefined,
        list: [],
        paginate: [],
        totalDocs: 0,
        limit: 0,
        totalPages: 0,
        page: 0,
        pagingCounter: 0,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: 0,
        nextPage: 0,
    },
    receivered: {
        level: undefined,
        list: [],
        paginate: [],
        totalDocs: 0,
        limit: 0,
        totalPages: 0,
        page: 0,
        pagingCounter: 0,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: 0,
        nextPage: 0,
    },
    
    isLoading: true
}

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if(value._id === id){
            result = index;
        }
    });
    return result;
}

export function notifications(state = initState, action) {
    var index = -1, indexP = -1;
    switch (action.type) {
        case NotificationConstants.SET_LEVEL_TO_QUERY_NOTIFICATION_SENT:
            return {
                ...state,
                sent: {
                    ...state.sent,
                    level: action.level
                }
            }

        case NotificationConstants.SET_LEVEL_TO_QUERY_NOTIFICATION_RECEIVERED:
            return {
                ...state,
                receivered: {
                    ...state.receivered,
                    level: action.level
                }
            }

        case NotificationConstants.GET_MANUAL_NOTIFICATIONS_REQUEST:
        case NotificationConstants.PAGINATE_MANUAL_NOTIFICATIONS_REQUEST:
        case NotificationConstants.GET_NOTIFICATIONS_REQUEST:
        case NotificationConstants.PAGINATE_NOTIFICATIONS_REQUEST:
        case NotificationConstants.CREATE_NOTIFICATION_REQUEST:
        case NotificationConstants.READED_NOTIFICATION_REQUEST:
        case NotificationConstants.DELETE_NOTIFICATION_REQUEST:
        case NotificationConstants.DELETE_MANUAL_NOTIFICATION_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        
        case NotificationConstants.GET_MANUAL_NOTIFICATIONS_FAILE:
        case NotificationConstants.PAGINATE_MANUAL_NOTIFICATIONS_FAILE:
        case NotificationConstants.GET_NOTIFICATIONS_FAILE:
        case NotificationConstants.PAGINATE_NOTIFICATIONS_FAILE:
        case NotificationConstants.CREATE_NOTIFICATION_FAILE:
        case NotificationConstants.READED_NOTIFICATION_FAILE:
        case NotificationConstants.DELETE_NOTIFICATION_FAILE:
        case NotificationConstants.DELETE_MANUAL_NOTIFICATION_FAILE:
            return {
                ...state,
                isLoading: false
            }

        case NotificationConstants.GET_MANUAL_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                sent: {
                    ...state.sent,
                    list: action.payload
                },
                isLoading: false
            };

        case NotificationConstants.PAGINATE_MANUAL_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                sent: {
                    ...state.sent,
                    paginate: action.payload.docs,
                    totalDocs: action.payload.totalDocs,
                    limit: action.payload.limit,
                    totalPages: action.payload.totalPages,
                    page: action.payload.page,
                    pagingCounter: action.payload.pagingCounter,
                    hasPrevPage: action.payload.hasPrevPage,
                    hasNextPage: action.payload.hasNextPage,
                    prevPage: action.payload.prevPage,
                    nextPage: action.payload.nextPage
                },
                isLoading: false
            };

        case NotificationConstants.GET_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                receivered: {
                    ...state.receivered,
                    list: action.payload
                },
                isLoading: false
            };
        
        case NotificationConstants.PAGINATE_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                receivered: {
                    ...state.receivered,
                    paginate: action.payload.docs,
                    totalDocs: action.payload.totalDocs,
                    limit: action.payload.limit,
                    totalPages: action.payload.totalPages,
                    page: action.payload.page,
                    pagingCounter: action.payload.pagingCounter,
                    hasPrevPage: action.payload.hasPrevPage,
                    hasNextPage: action.payload.hasNextPage,
                    prevPage: action.payload.prevPage,
                    nextPage: action.payload.nextPage
                },
                isLoading: false
            };

        case NotificationConstants.CREATE_NOTIFICATION_SUCCESS:
            
            return {
                ...state,
                sent: {
                    ...state.sent,
                    list: [action.payload, ...state.sent.list],
                    paginate: [action.payload, ...state.sent.paginate]
                },
                isLoading: false
            };

        case NotificationConstants.READED_NOTIFICATION_SUCCESS:
            if (!action.payload.readAll) {
                index = findIndex(state.receivered.list, action.payload.notification._id);
                if(index !== -1) state.receivered.list[index] = action.payload.notification;
                indexP = findIndex(state.receivered.paginate, action.payload.notification._id);
                if(indexP !== -1) state.receivered.paginate[indexP] = action.payload.notification;
                return {
                    ...state,
                    isLoading: false
                };
            } else {
                state.receivered.list = action.payload.notification;
                state.receivered.paginate = [];
                return {
                    ...state,
                    isLoading: false
                };
            }
            
        case NotificationConstants.DELETE_MANUAL_NOTIFICATION_SUCCESS:
            index = findIndex(state.sent.list, action.payload);
            if(index !== -1) state.sent.list.splice(index, 1);
            indexP = findIndex(state.sent.paginate, action.payload);
            if(indexP !== -1) state.sent.paginate.splice(indexP, 1);
            return {
                ...state,
                isLoading: false
            };

        case NotificationConstants.DELETE_NOTIFICATION_SUCCESS:
            index = findIndex(state.receivered.list, action.payload);
            if(index !== -1) state.receivered.list.splice(index, 1);
            indexP = findIndex(state.receivered.paginate, action.payload);
            if(indexP !== -1) state.receivered.paginate.splice(indexP, 1);
            return {
                ...state,
                isLoading: false
            };
        
        case NotificationConstants.RECEIVE_NOTIFICATION_SUCCESS:
            console.log("New notification: ", action.payload)
            return {
                ...state,
                receivered: {
                    ...state.receivered,
                    list: [action.payload, ...state.receivered.list],
                    paginate: [action.payload, ...state.receivered.paginate]
                },
                isLoading: false
            }

        default:
            return state;
    }
}
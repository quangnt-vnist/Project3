import { SocketConstants } from "./constants";

export const SocketActions = {
    connectSocket,
    disconnectSocket
};

function connectSocket(){
    return (dispatch) => {
        dispatch({ type: SocketConstants.CONNECT_SOCKET_IO})
    }
} 

function disconnectSocket(){
    return (dispatch) => {
        dispatch({ type: SocketConstants.DISCONNECT_SOCKET_IO})
    }
} 
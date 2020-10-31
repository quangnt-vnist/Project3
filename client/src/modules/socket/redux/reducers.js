import SocketIO from 'socket.io-client';
import { getStorage } from "../../../config";
import { SocketConstants } from "./constants";

const initSocket = {
    connected: false,
    io: undefined
}

export function socket(state=initSocket, action) {
    switch (action.type) {
        case SocketConstants.CONNECT_SOCKET_IO: 
            const userId = getStorage('userId');
            if(userId){
                state.io = SocketIO(process.env.REACT_APP_SERVER, {
                    query: { userId }
                });
                state.connected = true;

                return {...state};
            }
            else return initSocket;
        
        case SocketConstants.DISCONNECT_SOCKET_IO:
            if(state.io) state.io.disconnect();
            state.connected = false;

        default: 
            return {...state};
    }
}
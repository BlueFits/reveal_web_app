import { socketEmitters } from "../../constants/emitters";

export default class SocketInit {
    constructor(io: any) {
        io.on('connection', (socket) => {
            console.log('Connection established for: ', socket.id);
            socket.on(socketEmitters.JOIN_ROOM, (roomID, userID) => {
                if (io.sockets.adapter.rooms.get(roomID).size === 2) {
                    socket.emit(socketEmitters.ROOM_FULL);
                } else {
                    socket.join(roomID);
                    socket.broadcast.to(roomID).emit(socketEmitters.USER_CONNECTED, userID)
                    socket.on(socketEmitters.DISCONNECT, () => {
                        socket.broadcast.to(roomID).emit(socketEmitters.USER_DISCONNECTED, userID)
                    });
                }
            });
        });
    }
};
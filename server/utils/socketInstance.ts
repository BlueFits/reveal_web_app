import { socketEmitters } from "../../constants/emitters";

export default class SocketInit {
    constructor(io: any) {
        io.on('connection', (socket) => {
            console.log('Connection established for: ', socket.id);

            socket.on(socketEmitters.REQUEST_ID, () => {
                console.log("User requested ID");
                socket.emit(socketEmitters.ME, socket.id)
            })

            socket.on(socketEmitters.JOIN_ROOM, ({ roomID, userID }) => {
                console.log("User ", userID, "is joining", roomID);
                if (io.sockets.adapter.rooms.get(roomID) && io.sockets.adapter.rooms.get(roomID).size === 2) {
                    io.to(userID).emit(socketEmitters.ROOM_FULL);
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
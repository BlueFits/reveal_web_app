import { acceptCallData, callUserData } from "../../constants/callTypes";
import { socketEmitters } from "../../constants/emitters";
import socketRoomDao from "../socketRoom/dao/socketRoom.dao";

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
                    socket.on("roomleave", () => {
                        console.log("Socket leaving ", roomID);
                        socket.leave(roomID);
                    })
                    socket.on(socketEmitters.DISCONNECT, async () => {
                        console.log("User disconnected");
                        const room = await socketRoomDao.getRoomByID(roomID);
                        if (room) await socketRoomDao.removeRoomByID(roomID)
                        socket.broadcast.to(roomID).emit(socketEmitters.USER_DISCONNECTED, userID)
                    });
                }
            });

            socket.on(socketEmitters.CALLUSER, ({ toCallID, signal, user }: callUserData) => {
                console.log("Delivering signal to ", toCallID);
                io.to(toCallID).emit(socketEmitters.CALLUSER, { signal, user });
            })

            socket.on(socketEmitters.ANSWER_CALL, ({ signal, socketID, userAccepting }: acceptCallData) => {
                io.to(socketID).emit(socketEmitters.CALLACCEPTED, { signal, userAccepting });
            })
        });
    }
};
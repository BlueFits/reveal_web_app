import { acceptCallData, callUserData } from "../../src/constants/callTypes";
import { socketEmitters } from "../../src/constants/emitters";
import { IUserReducer } from "../../src/services/modules/User/userSlice";
import socketRoomDao from "../socketRoom/dao/socketRoom.dao";

export default class SocketInit {
    constructor(io: any) {
        io.on('connection', (socket) => {
            socket.on(socketEmitters.REQUEST_ID, () => {
                socket.emit(socketEmitters.ME, socket.id)
            })

            socket.on(socketEmitters.JOIN_ROOM, ({ roomID, userID }) => {

                const disconnect = async () => {
                    const room = await socketRoomDao.getRoomByID(roomID);
                    if (room) await socketRoomDao.removeRoomByID(roomID);
                    socket.broadcast.to(roomID).emit(socketEmitters.USER_DISCONNECTED, userID);
                };

                if (io.sockets.adapter.rooms.get(roomID) && io.sockets.adapter.rooms.get(roomID).size === 2) {
                    io.to(userID).emit(socketEmitters.ROOM_FULL);
                } else {
                    socket.join(roomID);
                    socket.broadcast.to(roomID).emit(socketEmitters.USER_CONNECTED, userID)
                    socket.on("roomleave", async () => {
                        socket.leave(roomID)
                        disconnect();
                    })
                    socket.on(socketEmitters.DISCONNECT, async () => {
                        disconnect();
                    });
                    socket.on("checkroom", () => {
                    })

                    socket.on(socketEmitters.REVEAL_INIT, ({ from, to }: { from: IUserReducer, to: IUserReducer }) => {
                        io.to(to.socketID).emit(socketEmitters.REVEAL_INIT, { from });
                    })

                    socket.on(socketEmitters.ACCEPT_REVEAL, ({ to }: { to: IUserReducer }) => {
                        io.to(to.socketID).emit(socketEmitters.REVEAL_ACCEPT);
                    })

                    socket.on(socketEmitters.MATCH_INIT, ({ from, to }: { from: IUserReducer, to: IUserReducer }) => {
                        io.to(to.socketID).emit(socketEmitters.MATCH_INIT, { from });
                    });

                    socket.on(socketEmitters.ACCEPT_MATCH, ({ to }: { to: IUserReducer }) => {
                        io.to(to.socketID).emit(socketEmitters.MATCH_ACCEPT);
                    })
                }
            });

            socket.on(socketEmitters.CALLUSER, ({ toCallID, signal, user }: callUserData) => {
                io.to(toCallID).emit(socketEmitters.CALLUSER, { signal, user });
            })

            socket.on(socketEmitters.ANSWER_CALL, ({ signal, socketID, userAccepting }: acceptCallData) => {
                io.to(socketID).emit(socketEmitters.CALLACCEPTED, { signal, userAccepting });
            })
        });
    }
};
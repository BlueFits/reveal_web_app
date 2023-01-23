import { acceptCallData, callUserData } from "../../src/constants/callTypes";
import { socketEmitters } from "../../src/constants/emitters";
import { IUserReducer } from "../../src/services/modules/userSlice";
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

                const disconnect = async () => {
                    const room = await socketRoomDao.getRoomByID(roomID);
                    if (room) await socketRoomDao.removeRoomByID(roomID);
                    socket.broadcast.to(roomID).emit(socketEmitters.USER_DISCONNECTED, userID);
                };

                console.log("User ", userID, "is joining", roomID);

                if (io.sockets.adapter.rooms.get(roomID) && io.sockets.adapter.rooms.get(roomID).size === 2) {
                    io.to(userID).emit(socketEmitters.ROOM_FULL);
                } else {
                    socket.join(roomID);
                    socket.broadcast.to(roomID).emit(socketEmitters.USER_CONNECTED, userID)
                    socket.on("roomleave", async () => {
                        console.log("Socket leaving ", roomID);
                        socket.leave(roomID)
                        disconnect();
                    })
                    socket.on(socketEmitters.DISCONNECT, async () => {
                        console.log("User disconnected");
                        disconnect();
                    });
                    socket.on("checkroom", () => {
                        console.log(socket.rooms);
                    })

                    socket.on(socketEmitters.REVEAL_INIT, ({ from, to }: { from: IUserReducer, to: IUserReducer }) => {
                        console.log(`user ${from.username} asks to reveal ${to.username}`);
                        io.to(to.socketID).emit(socketEmitters.REVEAL_INIT, { from });
                    })

                    socket.on(socketEmitters.ACCEPT_REVEAL, ({ to }: { to: IUserReducer }) => {
                        console.log("User accept reveal")
                        io.to(to.socketID).emit(socketEmitters.REVEAL_ACCEPT);
                    })
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
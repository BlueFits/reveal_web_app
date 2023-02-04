import { acceptCallData, callUserData } from "../../src/constants/callTypes";
import socketEmitters, { IJoinChatData, ISendIDChat, ISendMsgChat } from "../../src/constants/emitters";
import { IUserReducer } from "../../src/services/modules/User/userSlice";
import socketRoomDao from "../socketRoom/dao/socketRoom.dao";

export default class SocketInit {
    constructor(io: any) {
        io.on('connection', (socket) => {

            socket.on(socketEmitters.REQUEST_ID, () => {
                socket.emit(socketEmitters.ME, socket.id)
            })

            socket.on(socketEmitters.JOIN_CHAT, (data: IJoinChatData) => {

                // Turn off all emitters to avoid initiating multiple listeners
                socket.removeAllListeners(socketEmitters.SEND_ID_CHAT);
                socket.removeAllListeners(socketEmitters.SEND_MSG_CHAT);
                socket.removeAllListeners(socketEmitters.CHAT_LEAVE);


                let isRoomFull = io.sockets.adapter.rooms.get(data.messageRoomID) && io.sockets.adapter.rooms.get(data.messageRoomID).size === 2
                if (isRoomFull) throw new Error("More than 2 people in room")

                socket.join(data.messageRoomID);
                // console.log(io.sockets.adapter.rooms);

                socket.broadcast.to(data.messageRoomID).emit(socketEmitters.USER_CONNECTED_ROOM, data.userSocketID)

                const sendIDHandler = (data: ISendIDChat) => {
                    io.to(data.otherUserSocket).emit(socketEmitters.RECEIVE_ID_CHAT, data.userSocket);
                };

                const sendMsgHandler = ({ message, otherSocketID }: ISendMsgChat) => {
                    console.log("listened to", socketEmitters.SEND_MSG_CHAT);
                    io.to(otherSocketID).emit(socketEmitters.RECEIVE_MSG_CHAT, message);
                };

                const chatLeaveHandler = (otherSocketID: string) => {
                    socket.leave(data.messageRoomID)
                    console.log("sending to ", otherSocketID);
                    io.to(otherSocketID).emit(socketEmitters.CHAT_DISCONNECT);
                };

                socket.on(socketEmitters.SEND_ID_CHAT, sendIDHandler)

                socket.on(socketEmitters.SEND_MSG_CHAT, sendMsgHandler);

                socket.on(socketEmitters.CHAT_LEAVE, chatLeaveHandler)

            });

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
                    socket.on(socketEmitters.ROOM_LEAVE, async () => {
                        socket.leave(roomID)
                        disconnect();
                    })
                    socket.on(socketEmitters.DISCONNECT, async () => {
                        disconnect();
                    });
                    // socket.on("checkroom", () => {
                    // })

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
import socketEmitters, { IJoinChatData, ISendIDChat, ISendMsgChat } from "../../../src/constants/types/emitters";
import {
    acceptMatchHandler,
    disconnectHandler,
    matchInitHandler,
    acceptRevealHandler,
    revealInitHandler,
    roomLeaveHandler,
    answerCallHandler,
    callUserHandler,
} from "./helpers/eventListeners";

import socketRoomDao from "../../socketRoom/dao/socketRoom.dao";

export default class SocketInit {
    constructor(io: any) {
        io.on('connection', (socket) => {

            socket.on(socketEmitters.SOCKET_ROOM_GET, () => this.getSocketRoomCount(socket));

            socketRoomDao.SocketRoomModel.watch().on("change", (change) => {
                this.getSocketRoomCount(socket);
            });

            socket.on(socketEmitters.REQUEST_ID, () => {
                socket.emit(socketEmitters.ME, socket.id)
            })

            socket.on(socketEmitters.JOIN_CHAT, (data: IJoinChatData) => {

                // Turn off all emitters to avoid initiating multiple listeners
                socket.removeAllListeners(socketEmitters.SEND_ID_CHAT);
                socket.removeAllListeners(socketEmitters.SEND_MSG_CHAT);
                socket.removeAllListeners(socketEmitters.CHAT_LEAVE);
                socket.removeAllListeners(socketEmitters.RECEIVE_MSG_RESPONSE);

                let isRoomFull = io.sockets.adapter.rooms.get(data.messageRoomID) && io.sockets.adapter.rooms.get(data.messageRoomID).size === 2
                if (isRoomFull) throw new Error("More than 2 people in room")

                socket.join(data.messageRoomID);
                // console.log(io.sockets.adapter.rooms);

                socket.broadcast.to(data.messageRoomID).emit(socketEmitters.USER_CONNECTED_ROOM, data.userSocketID)

                const sendIDHandler = (data: ISendIDChat) => {
                    io.to(data.otherUserSocket).emit(socketEmitters.RECEIVE_ID_CHAT, data.userSocket);
                };

                const sendMsgHandler = ({ message, otherSocketID }: ISendMsgChat) => {
                    // console.log("listened to", socketEmitters.SEND_MSG_CHAT);
                    io.to(otherSocketID).emit(socketEmitters.RECEIVE_MSG_CHAT, { message, other: socket.id });
                };

                const chatLeaveHandler = (otherSocketID: string) => {
                    socket.leave(data.messageRoomID)
                    // console.log("sending to ", otherSocketID);
                    io.to(otherSocketID).emit(socketEmitters.CHAT_DISCONNECT);
                };

                const receiveMsgResponseHandler = (otherSocketID: string) => {
                    console.log("my log", otherSocketID);
                    io.to(otherSocketID).emit(socketEmitters.RECEIVE_MSG_RESPONSE);
                }

                socket.on(socketEmitters.SEND_ID_CHAT, sendIDHandler)

                socket.on(socketEmitters.SEND_MSG_CHAT, sendMsgHandler);

                socket.on(socketEmitters.RECEIVE_MSG_RESPONSE, receiveMsgResponseHandler);

                socket.on(socketEmitters.CHAT_LEAVE, chatLeaveHandler)

            });

            socket.on(socketEmitters.JOIN_ROOM, ({ roomID, userID }) => {

                socket.off(socketEmitters.ROOM_LEAVE, () => roomLeaveHandler(socket, roomID, userID))

                socket.off(socketEmitters.DISCONNECT, () => disconnectHandler(socket, roomID, userID));

                socket.off(socketEmitters.REVEAL_INIT, (data) => revealInitHandler(io, data))

                socket.off(socketEmitters.ACCEPT_REVEAL, (data) => acceptRevealHandler(io, data))

                socket.off(socketEmitters.MATCH_INIT, (data) => matchInitHandler(io, data));

                socket.off(socketEmitters.ACCEPT_MATCH, (data) => acceptMatchHandler(io, data))

                if (io.sockets.adapter.rooms.get(roomID) && io.sockets.adapter.rooms.get(roomID).size === 2) {
                    io.to(userID).emit(socketEmitters.ROOM_FULL);
                } else {

                    socket.join(roomID);

                    socket.on(socketEmitters.ROOM_LEAVE, () => roomLeaveHandler(socket, roomID, userID))

                    socket.on(socketEmitters.DISCONNECT, () => disconnectHandler(socket, roomID, userID));

                    socket.on(socketEmitters.REVEAL_INIT, (data) => revealInitHandler(io, data))

                    socket.on(socketEmitters.ACCEPT_REVEAL, (data) => acceptRevealHandler(io, data))

                    socket.on(socketEmitters.MATCH_INIT, (data) => matchInitHandler(io, data));

                    socket.on(socketEmitters.ACCEPT_MATCH, (data) => acceptMatchHandler(io, data))

                    socket.broadcast.to(roomID).emit(socketEmitters.USER_CONNECTED, userID);
                }
            });

            socket.on(socketEmitters.CALLUSER, (data) => callUserHandler(io, data))

            socket.on(socketEmitters.ANSWER_CALL, (data) => answerCallHandler(io, data))
        });
    }

    private getSocketRoomCount(socket) {
        socketRoomDao.SocketRoomModel.count({}, (err, count) => {
            socket.emit(socketEmitters.SOCKET_ROOM_WATCH, count);
        });
    }
};
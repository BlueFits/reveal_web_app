import { socketEmitters } from "../../constants/emitters";
import tempUsersDao from "../tempUser/daos/tempUsers.dao";
import { tempUserStatus } from "../tempUser/dto/create.tempUser.dto";

export default class SocketInit {
    constructor(io: any) {
        io.on('connection', (socket) => {
            console.log('Connection established for: ', socket.id);

            /* Client emits send_id and we respond with sending them socket ID */
            socket.on("send_id", () => {
                socket.emit(socketEmitters.ME, socket.id)
            })
            /* when use tempUser closes browser we remove them from databse */
            socket.on(socketEmitters.DISCONNECT, async () => {
                console.log("User disconnected:", socket.id);
                const removedTempUser = await tempUsersDao.removeTempUserBySocketID(socket.id);
                console.log("removed user by socketID:", removedTempUser);
                socket.broadcast.emit(socketEmitters.CALLENDED);
            })
            /* when user calls we emit calluser to the client receiving the call */
            socket.on(socketEmitters.CALLUSER, ({ userToCall, signalData, from, name }) => {
                console.log(`User ${name} is calling ${userToCall}`);
                io.to(userToCall).emit(socketEmitters.CALLUSER, { signal: signalData, from, name });
            });

            socket.on(socketEmitters.ANSWER_CALL, (data) => {
                console.log("User answer call");
                io.to(data.to).emit(socketEmitters.CALLACCEPTED, data.signal);
            });

            socket.on(socketEmitters.REVEAL_INIT, (data) => {
                console.log(`user ${data.fromUsername} asks to reveal ${data.userToReveal}`);
                io.to(data.userToReveal).emit(socketEmitters.REVEAL_INIT, { fromSocket: data.fromSocket, fromUsername: data.fromUsername });
            })

            socket.on(socketEmitters.ACCEPT_REVEAL, (data) => {
                console.log("User accept reveal")
                io.to(data.to).emit(socketEmitters.REAVEAL_ACCEPT);
            })
        });
    }
};
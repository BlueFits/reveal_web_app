import { socketEmitters } from "../../constants/emitters";
import { IUserReducer } from "../../services/modules/userSlice";
import tempUsersDao from "../tempUser/daos/tempUsers.dao";
import { CreateTempUserDTO, tempUserStatus } from "../tempUser/dto/create.tempUser.dto";

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
            socket.on(socketEmitters.CALLUSER, async ({ userToCallSocket, signalData, from }: { userToCallSocket: string; signalData: any; from: IUserReducer }) => {
                console.log(`User ${from.username} is calling ${userToCallSocket}`);
                /* set caller to incall */
                await tempUsersDao.updateTempUserByID(from._id, { status: tempUserStatus.IN_CALL });
                io.to(userToCallSocket).emit(socketEmitters.CALLUSER, { signal: signalData, from });
            });

            socket.on(socketEmitters.ANSWER_CALL, async (data: { signal: any, to: IUserReducer }) => {
                console.log("User answer call");
                /* Check if data.to is already incall */
                /* 
                    if in call -> 
                    return data.from and terminate call socket.emit(reject_call)
                */
                console.log("answering call from " + data.to.username);
                const user = await tempUsersDao.getTempUserBySocketID(data.to.socketID);
                console.log("status " + user.status);
                if (user.status === tempUserStatus.IN_CALL) {
                    await tempUsersDao.updateTempUserByID(data.to._id, { status: tempUserStatus.WAITING });
                    io.to(data.to).emit(socketEmitters.REJECT_CALL)
                } else {
                    io.to(data.to).emit(socketEmitters.CALLACCEPTED, { signal: data.signal });
                }
                /* 
                    if user is waiting -> 
                    socket.emit(callAccepted)
                */
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
import { socketEmitters } from "../../constants/emitters";
import tempUsersDao from "../tempUser/daos/tempUsers.dao";

export default class SocketInit {
    constructor(io: any) {
        io.on('connection', (socket) => {
            console.log('Connection established for: ', socket.id);

            // socket.emit(socketEmitters.ME, socket.id);

            socket.on("send_id", () => {
                socket.emit(socketEmitters.ME, socket.id)
            })

            socket.on(socketEmitters.DISCONNECT, async () => {
                console.log("User disconnected:", socket.id);
                const removedTempUser = await tempUsersDao.removeTempUserBySocketID(socket.id);
                console.log("removed user by socketID:", removedTempUser);
                socket.broadcast.emit(socketEmitters.CALLENDED);
            })

            socket.on(socketEmitters.CALLUSER, ({ userToCall, signalData, from, name }) => {
                console.log("User calling");
                io.to(userToCall).emit(socketEmitters.CALLUSER, { signal: signalData, from, name });
            });

            socket.on(socketEmitters.ANSWER_CALL, (data) => {
                console.log("User answer call");
                io.to(data.to).emit(socketEmitters.CALLACCEPTED, data.signal);
            });
        });
    }
};
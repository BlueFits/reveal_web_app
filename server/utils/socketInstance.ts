import { socketEmitters } from "../../constants/emitters";
import { IUserReducer } from "../../services/modules/userSlice";
import tempUsersDao from "../tempUser/daos/tempUsers.dao";
import { CreateTempUserDTO, tempUserStatus } from "../tempUser/dto/create.tempUser.dto";

export default class SocketInit {
    constructor(io: any) {
        io.on('connection', (socket) => {
            console.log('Connection established for: ', socket.id);
            socket.on(socketEmitters.JOIN_ROOM, (roomID, userID) => {
                socket.join(roomID);
                socket.broadcast.to(roomID).emit(socketEmitters.USER_CONNECTED, userID)
                socket.on(socketEmitters.DISCONNECT, () => {
                    socket.broadcast.to(roomID).emit(socketEmitters.USER_DISCONNECTED, userID)
                });
            });
        });
    }
};
import { socketEmitters } from "../../constants/emitters";
import tempUsersDao from "../tempUser/daos/tempUsers.dao";
import { tempUserStatus } from "../tempUser/dto/create.tempUser.dto";

export default class SocketInit {
    constructor(io: any) {
        io.on('connection', (socket) => {
            socket.on("join-room", (roomID, userID) => {
                console.log(roomID, userID);
                socket.join(roomID);
                /* Send to everyone else but do not send it back to me */
                socket.broadcast.to(roomID).emit("user-connected", userID);
            });
        });
    }
};
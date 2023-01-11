"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emitters_1 = require("../../constants/emitters");
const tempUsers_dao_1 = __importDefault(require("../tempUser/daos/tempUsers.dao"));
class SocketInit {
    constructor(io) {
        io.on('connection', (socket) => {
            console.log('Connection established for: ', socket.id);
            // socket.emit(socketEmitters.ME, socket.id);
            socket.on("send_id", () => {
                socket.emit(emitters_1.socketEmitters.ME, socket.id);
            });
            socket.on(emitters_1.socketEmitters.DISCONNECT, async () => {
                console.log("User disconnected:", socket.id);
                const removedTempUser = await tempUsers_dao_1.default.removeTempUserBySocketID(socket.id);
                console.log("removed user by socketID:", removedTempUser);
                socket.broadcast.emit(emitters_1.socketEmitters.CALLENDED);
            });
            socket.on(emitters_1.socketEmitters.CALLUSER, ({ userToCall, signalData, from, name }) => {
                io.to(userToCall).emit(emitters_1.socketEmitters.CALLUSER, { signal: signalData, from, name });
            });
            socket.on(emitters_1.socketEmitters.ANSWER_CALL, (data) => {
                io.to(data.to).emit(emitters_1.socketEmitters.CALLACCEPTED, data.signal);
            });
        });
    }
}
exports.default = SocketInit;
;

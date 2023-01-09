import { socketEmitters } from "../../constants/emitters";

export default class SocketInit {
    constructor(io: any) {
        io.on('connection', (socket) => {
            console.log('Connection established for: ', socket.id);

            // socket.emit(socketEmitters.ME, socket.id);

            socket.on("send_id", () => {
                socket.emit(socketEmitters.ME, socket.id)
            })

            socket.on(socketEmitters.DISCONNECT, () => {
                socket.broadcast.emit(socketEmitters.CALLENDED);
            })

            socket.on(socketEmitters.CALLUSER, ({ userToCall, signalData, from, name }) => {
                io.to(userToCall).emit(socketEmitters.CALLUSER, { signal: signalData, from, name });
            });

            socket.on(socketEmitters.ANSWER_CALL, (data) => {
                io.to(data.to).emit(socketEmitters.CALLACCEPTED, data.signal);
            });
        });
    }
}
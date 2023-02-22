import socketEmitters from "../../../../src/constants/types/emitters";
import socketRoomDao from "../../../socketRoom/dao/socketRoom.dao";
import { IUserReducer } from "../../../../src/services/modules/User/userSlice";
import { callUserData, acceptCallData } from "../../../../src/constants/types/callTypes";

export const revealInitHandler = (io, { from, to }: { from: IUserReducer, to: IUserReducer }) => {
    io.to(to.socketID).emit(socketEmitters.REVEAL_INIT, { from });
};

export const acceptRevealHandler = (io, { to }: { to: IUserReducer }) => {
    io.to(to.socketID).emit(socketEmitters.REVEAL_ACCEPT);
};

export const matchInitHandler = (io, { from, to }: { from: IUserReducer, to: IUserReducer }) => {
    io.to(to.socketID).emit(socketEmitters.MATCH_INIT, { from });
};

export const acceptMatchHandler = (io, { to }: { to: IUserReducer }) => {
    io.to(to.socketID).emit(socketEmitters.MATCH_ACCEPT);
};

const disconnect = async (socket, roomID, userID) => {
    const room = await socketRoomDao.getRoomByID(roomID);
    if (room) await socketRoomDao.removeRoomByID(roomID);
    socket.broadcast.to(roomID).emit(socketEmitters.USER_DISCONNECTED, userID);
};

export const roomLeaveHandler = async (socket, roomID, userID) => {
    socket.leave(roomID)
    disconnect(socket, roomID, userID);
};

export const disconnectHandler = async (socket, roomID, userID) => {
    disconnect(socket, roomID, userID);
};


export const callUserHandler = (io, { toCallID, signal, user }: callUserData) => {
    io.to(toCallID).emit(socketEmitters.CALLUSER, { signal, user });
};

export const answerCallHandler = (io, { signal, socketID, userAccepting }: acceptCallData) => {
    io.to(socketID).emit(socketEmitters.CALLACCEPTED, { signal, userAccepting });
};
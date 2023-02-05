import socket from "../../config/Socket";
import socketEmitters from "../constants/emitters";

export const setupMediaStream = async (setStream) => {
    try {
        const ms = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
        });
        setStream(ms);
    } catch (e) {
        alert("Camera is disabled");
    }
};


export const joinRoom = (roomID: string, userID: string, setUserJoinedRoom) => {
    socket.emit(socketEmitters.JOIN_ROOM, { roomID, userID });
    setUserJoinedRoom(true);
}
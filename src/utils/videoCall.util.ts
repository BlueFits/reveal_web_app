import { MutableRefObject } from "react";
import Peer from "simple-peer";
import socket from "../../config/Socket";
import socketEmitters from "../constants/emitters";
import { IUserReducer } from "../services/modules/User/userSlice";

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


export const joinRoom = (roomID: string, userID: string) => {
    socket.emit(socketEmitters.JOIN_ROOM, { roomID, userID });
}
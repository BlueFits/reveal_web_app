import { MutableRefObject } from "react";
import Peer from "simple-peer";
import socket from "../config/Socket";
import { socketEmitters } from "../constants/emitters";
import { IUserReducer } from "../services/modules/userSlice";

export const setupMediaStream = async (setStream) => {
    try {
        const ms = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        setStream(ms);
    } catch (e) {
        alert("Camera is disabled");
    }
};

//Define methods for calling 
export const callUser = (
    idToCall: string,
    stream: MediaProvider,
    user: IUserReducer,
    userVideo: MutableRefObject<HTMLVideoElement>,
    setCallAccepted: Function,
    connectionRef: Peer,
) => {
    const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
    });

    connectionRef.current = peer;

    peer.on("signal", (data) => {
        console.log("Emitting call user");
        socket.emit(socketEmitters.CALLUSER, { userToCall: idToCall, signalData: data, from: user });
    });
    peer.on("stream", (currStream) => {
        userVideo.current.srcObject = currStream;
    });
    peer.on("close", () => {
        peer.destroy();
        console.log("User 2 Disconnected ");
    });
    socket.on(socketEmitters.CALLACCEPTED, ({ signal }) => {
        setCallAccepted(true);
        peer.signal(signal);
        connectionRef.current = peer;
        socket.off(socketEmitters.CALLACCEPTED);
    });
};

export const answerCall = (
    stream: MediaProvider,
    call: Partial<any>,
    userVideo: MutableRefObject<HTMLVideoElement>,
    connectionRef: Peer,
    setCallAccepted: Function
) => {
    setCallAccepted(true);
    const peer = new Peer({
        initiator: false,
        trickle: false,
        stream
    });
    peer.on("signal", (data) => {
        socket.emit(socketEmitters.ANSWER_CALL, { signal: data, to: call.from });
    });
    peer.on("stream", (currStream) => {
        userVideo.current.srcObject = currStream;
    });
    peer.on("close", (err) => {
        peer.destroy();
        console.log("User 1 Disconnected");
    });
    peer.on("error", (err) => {
        console.log("Connection error", err);
        setCallAccepted(false);
        connectionRef.current = null;
        userVideo.current = null;
    })
    peer.signal(call.signal);
    connectionRef.current = peer;
};


export const joinRoom = (roomID: string, userID: string) => {
    socket.emit(socketEmitters.JOIN_ROOM, { roomID, userID });
}
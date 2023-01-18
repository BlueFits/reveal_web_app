import { MutableRefObject } from "react";
import Peer from "simple-peer";
import socket from "../config/Socket";
import { socketEmitters } from "../constants/emitters";
import { ICallObject } from "../pages/chat";

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
    userSocketID: string,
    userName: string,
    userVideo: MutableRefObject<HTMLVideoElement>,
    setCallAccepted: Function,
    connectionRef: Peer
) => {
    const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
    });
    peer.on("signal", (data) => {
        socket.emit(socketEmitters.CALLUSER, { userToCall: idToCall, signalData: data, from: userSocketID, name: userName });
    });
    peer.on("stream", (currStream) => {
        userVideo.current.srcObject = currStream;
    });
    socket.on(socketEmitters.CALLACCEPTED, (signal) => {
        setCallAccepted(true);
        peer.signal(signal);
        connectionRef.current = peer;
        socket.off(socketEmitters.CALLACCEPTED);
    });
};

export const answerCall = (
    stream: MediaProvider,
    call: Partial<ICallObject>,
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
    peer.signal(call.signal);
    connectionRef.current = peer;
};
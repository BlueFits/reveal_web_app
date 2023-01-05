import React, { createContext, useState, useRef, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { socketEmitters } from "../../constants/emitters";

const SocketContext = createContext(null);

const socket = io("http://localhost:3000");

interface IContextProvider {
    children: any;
}

const ContextProvider: React.FC<IContextProvider> = ({ children }) => {

    const [stream, setStream] = useState(null);
    const [me, setMe] = useState("");
    const [call, setCall]: any = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName]: any = useState("");

    const myVid: any = useRef();
    const userVideo: any = useRef();
    const connectionRef: any = useRef();

    const setupMediaStream = async () => {
        try {
            const ms = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setStream(ms);
        } catch (e) {
            alert("Camera is disabled");
            throw e;
        }
    }

    useEffect(() => {

        const setupWebCam = async () => {
            if (!stream) {
                await setupMediaStream();
            } else {
                const videoCurr = myVid.current;
                if (!videoCurr) return;
                const video = videoCurr;
                if (!video.srcObject) {
                    video.srcObject = stream;
                }
            }
        }
        setupWebCam();

        socket.on(socketEmitters.ME, (id) => {
            console.log("emitted ID", id);
            setMe(id)
        });

        socket.on(socketEmitters.CALLUSER, ({ from, name: callerName, signal }) => {
            setCall({ isReceivedCall: true, from, name: callerName, signal });
        });

    }, [stream]);

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream
        });

        peer.on("signal", (data) => {
            socket.emit("answercall", { signal: data, to: call.from });
        });

        peer.on("stream", (currStream) => {
            userVideo.current.srcObject = currStream;
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    };

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream
        });

        peer.on("signal", (data) => {
            socket.emit(socketEmitters.CALLUSER, { userToCall: id, signalData: data, from: me, name });
        });

        peer.on("stream", (currStream) => {
            userVideo.current.srcObject = currStream;
        });

        socket.on(socketEmitters.CALLACCEPTED, (signal) => {
            setCallAccepted(true);
            peer.signal(signal)
        });

        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
        window.location.reload();
    };

    return (
        <SocketContext.Provider value={{
            call,
            callAccepted,
            myVid,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            answerCall
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext }
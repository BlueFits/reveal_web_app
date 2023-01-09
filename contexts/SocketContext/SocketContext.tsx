import React, { createContext, useState, useRef, useEffect, MutableRefObject, MouseEventHandler } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { socketEmitters } from "../../constants/emitters";

const SocketContext = createContext(null);

const socket = io();

export interface ISocketContextValues {
    me: string;
    stream: any;
    call: {
        isReceivedCall: boolean,
        from: string,
        name: string,
        signal: any
    };
    callAccepted: boolean;
    myVid: MutableRefObject<HTMLVideoElement>;
    userVideo: MutableRefObject<HTMLVideoElement>;
    name: string;
    setName: Function;
    callEnded: boolean;
    callUser: (string) => void;
    leaveCall: MouseEventHandler<HTMLButtonElement>;
    answerCall: MouseEventHandler<HTMLButtonElement>;
}

const ContextProvider: React.FC<{
    children: JSX.Element | JSX.Element[] | string | string[];
}> = ({ children }) => {
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState("");
    const [call, setCall]: any = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName]: any = useState("");

    const myVid: MutableRefObject<HTMLVideoElement> = useRef();
    const userVideo: MutableRefObject<HTMLVideoElement> = useRef();
    const connectionRef: Peer = useRef();

    const setupMediaStream = async () => {
        try {
            const ms = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setStream(ms);
        } catch (e) {
            alert("Camera is disabled");
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
        socket.emit("send_id");
        socket.on(socketEmitters.ME, (id) => {
            setMe(id)
        });
        socket.on(socketEmitters.CALLUSER, ({ from, name, signal }) => {
            setCall({ isReceivedCall: true, from, name, signal });
        });
    }, [stream]);

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

    const answerCall = () => {
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

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
        window.location.reload();
    };

    const returnValue: ISocketContextValues = {
        me,
        stream,
        call,
        callAccepted,
        myVid,
        userVideo,
        name,
        setName,
        callEnded,
        callUser,
        leaveCall,
        answerCall
    };

    return (
        <SocketContext.Provider value={returnValue}>
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext }
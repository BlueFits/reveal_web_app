import { useEffect, useState, MutableRefObject, useRef } from "react";
import { Container, Button, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { IReducer } from "../../services/store";
import { IUserReducer, createTempUser } from "../../services/modules/userSlice";
import { gen25TempUserPool, ITempUserPool } from "../../services/modules/tempUserPoolSlice";
import VideoPreview from "../../components/VideoPreview/VideoPreview";
import { useRouter } from "next/router";
import Peer from "simple-peer";
import { socketEmitters } from "../../constants/emitters";
import { io } from "socket.io-client";
import { setupMediaStream, genTempUserFromPool } from "../../utils/videoCall.util";

interface ICallObject {
    isReceivedCall: boolean,
    from: string,
    name: string,
    signal: any
}

/* Initialize Socket */
const socket = io();

const Index = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const tempUserPoolReducer: ITempUserPool = useSelector((state: IReducer) => state.tempUserPool);

    //Video Call Shtuff
    const [stream, setStream] = useState();
    const [call, setCall] = useState<Partial<ICallObject>>();
    const [callAccepted, setCallAccepted] = useState<boolean>(false);

    const myVid: MutableRefObject<HTMLVideoElement> = useRef();
    const userVideo: MutableRefObject<HTMLVideoElement> = useRef();
    const connectionRef: Peer = useRef();

    //Camera Setup
    useEffect(() => {
        const setupWebCam = async () => {
            if (!stream) {
                await setupMediaStream(setStream);
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
    }, [stream]);

    /* Initialize socket listeners */
    useEffect(() => {
        socket.emit("send_id");
        socket.on(socketEmitters.ME, (id) => {
            dispatch(createTempUser({
                username: userReducer.username,
                socketID: id,
                preference: userReducer.preference,
            }));
        });
        socket.on(socketEmitters.CALLUSER, ({ from, name, signal }) => {
            console.log("Receving a call", from, name);
            setCall({ isReceivedCall: true, from, name, signal });
        });
    }, []);

    //Define methods for calling 
    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", (data) => {
            socket.emit(socketEmitters.CALLUSER, { userToCall: id, signalData: data, from: userReducer.socketID, name: userReducer.username });
        });

        peer.on("stream", (currStream) => {
            console.log("setting userVideoStrream after sending");
            userVideo.current.srcObject = currStream;
        });

        socket.on(socketEmitters.CALLACCEPTED, (signal) => {
            setCallAccepted(true);
            peer.signal(signal)
            socket.off(socketEmitters.CALLACCEPTED,)
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
            console.log("sending connection after answering");
            socket.emit(socketEmitters.ANSWER_CALL, { signal: data, to: call.from });
        });

        peer.on("stream", (currStream) => {
            console.log("setting userVideoStrream after receiving");
            userVideo.current.srcObject = currStream;
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    };


    /* Initial Sanity Check for for proper redux setup, and if preference exist generate the temp user pool */
    useEffect(() => {
        if (!userReducer.username || !userReducer.preference) {
            console.log("Going back", userReducer);
            router.push("/");
            return;
        }

        if (userReducer.preference.length > 0) {
            dispatch(gen25TempUserPool(userReducer.preference));
        }
    }, [userReducer]);

    /* Find someone to call in the user pool at random */
    useEffect(() => {
        console.log("User Pool", tempUserPoolReducer);
        const userToCall = genTempUserFromPool(tempUserPoolReducer.tempUsers);
        //Make sure the stream exists first before attempting to call USER
        if (userToCall && stream) {
            callUser(userToCall.socketID)
        }
    }, [tempUserPoolReducer, stream]);

    useEffect(() => {
        /* Call has been done to user and automatically answer call */
        if (call && call.isReceivedCall && !callAccepted) {
            answerCall();
        }
    }, [call]);

    const ButtonContainer = ({ children }) => (
        <div className="mb-8 flex justify-end">
            {children}
        </div>
    );

    const skipHandler = () => {
        setCall({});
        setCallAccepted(false);
        connectionRef.current.destroy();
        setTimeout(() => {
            const userToCall = genTempUserFromPool(tempUserPoolReducer.tempUsers);
            callUser(userToCall.socketID);
        }, 1000);
    };

    return !userReducer.username ? (
        <Typography>Invalid Page Redirecting...</Typography>
    ) : (
        <Container sx={{ display: "flex" }} className="justify-center items-center h-screen flex-col" maxWidth="lg" disableGutters>
            {
                callAccepted &&
                <VideoPreview
                    isMuted={false}
                    videoRef={userVideo}
                    username={"test"}
                />
            }
            <VideoPreview
                videoRef={myVid}
                username={userReducer.username}
            />
            <Container className="absolute flex flex-col bottom-5">
                <ButtonContainer>
                    <Button style={{ backgroundColor: "green", color: "#fff", width: 100, borderRadius: 9999 }} size="large" variant="contained">Match</Button>
                </ButtonContainer>
                <ButtonContainer>
                    <Button style={{ backgroundColor: "#0971f1", color: "#fff", width: 100, borderRadius: 9999 }} size="large" variant="contained">Reveal</Button>
                </ButtonContainer>
                <div className="flex justify-between">
                    <Button sx={{ borderRadius: 9999 }} size="large" variant="outlined">Leave</Button>
                    <Button onClick={skipHandler} sx={{ width: 100, borderRadius: 9999 }} size="large" variant="outlined">Skip</Button>
                </div>
            </Container>
        </Container>
    );
};

export default Index;
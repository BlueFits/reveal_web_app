import { useEffect, useState, MutableRefObject, useRef } from "react";
import { Container, Button, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { IReducer } from "../../services/store";
import { IUserReducer, createTempUser, updateStatus } from "../../services/modules/userSlice";
import { genTempUser, apiTempUser, clearState } from "../../services/modules/otherUserSlice";
import VideoPreview from "../../components/VideoPreview/VideoPreview";
import { useRouter } from "next/router";
import Peer from "simple-peer";
import { socketEmitters } from "../../constants/emitters";
import { setupMediaStream, callUser, answerCall } from "../../utils/videoCall.util";
import socket from "../../config/Socket";
import { tempUserStatus } from "../../server/tempUser/dto/create.tempUser.dto";
import LoadingVideo from "../../components/LoadingVideo/LoadingVideo";

export interface ICallObject {
    isReceivedCall: boolean,
    from: string,
    name: string,
    signal: any
}

const Index = () => {
    const dispatch = useDispatch();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const otherUserReducer: apiTempUser = useSelector((state: IReducer) => state.otherUser);

    //Video Call Shtuff
    const [stream, setStream] = useState<MediaProvider>();
    const [call, setCall] = useState<Partial<ICallObject>>();
    const [callAccepted, setCallAccepted] = useState<boolean>(false);

    const myVid: MutableRefObject<HTMLVideoElement> = useRef();
    const userVideo: MutableRefObject<HTMLVideoElement> = useRef();
    const connectionRef: Peer = useRef();
    const connectUserRef: { current: NodeJS.Timer | undefined } = useRef();

    //Functionality
    const [revealTimer, setRevealTimer] = useState(5);
    const [showAvatar, setShowAvatar] = useState(true);

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

    const connectUser: () => NodeJS.Timer = () => {
        const interval = setInterval(async () => {
            await dispatch(genTempUser(userReducer.preference));
            if (otherUserReducer.socketID && stream && !callAccepted) {
                callUser(
                    otherUserReducer.socketID,
                    stream,
                    userReducer.socketID,
                    userReducer.username,
                    userVideo,
                    setCallAccepted,
                    connectionRef
                );
                clearInterval(interval);
            } else {
                console.log("User not found retrying...");
                /* update other user */
                await dispatch(genTempUser(userReducer.preference));
            }
        }, 3000);
        return interval;
    };

    useEffect(() => {
        /* Call has been done to user and automatically answer call */
        if (call && call.isReceivedCall && !callAccepted) {
            console.log("call has been answered");
            answerCall(
                stream,
                call,
                userVideo,
                connectionRef,
                setCallAccepted
            );
            clearInterval(connectUserRef.current);
        }
    }, [call]);

    /* Initial Sanity Check for for proper redux setup, and if preference exist generate the temp user pool */
    useEffect(() => {
        if (!userReducer.username || !userReducer.preference) {
            console.log("Going back", userReducer);
            window.location.href = "/";
            return;
        }
    }, [userReducer]);

    /* Find someone to call in the user pool at random */
    useEffect(() => {
        connectUserRef.current = connectUser();
        return () => clearInterval(connectUserRef.current);
    }, [otherUserReducer, stream]);

    useEffect(() => {
        if (callAccepted) {
            console.log("updating call status to incall for ", userReducer.username);
            dispatch(updateStatus(tempUserStatus.IN_CALL));
        }
    }, [callAccepted])

    const ButtonContainer = ({ children }) => (
        <div className="mb-8 flex justify-end">
            {children}
        </div>
    );

    /* No interval is working after skipping */
    const skipHandler = async () => {
        connectionRef.current.destroy();
        setCall({});
        setCallAccepted(false);
        await dispatch(updateStatus(tempUserStatus.WAITING));
        setTimeout(() => {
            dispatch(clearState());
        }, 3000)
    };

    const revealHandler = () => {
        myVid.current.play();
        userVideo.current.play();
        setShowAvatar(false);
    };

    return !userReducer.username ? (
        <Typography>Invalid Page Redirecting...</Typography>
    ) : (
        <Container sx={{ display: "flex" }} className="justify-center items-center h-screen flex-col" maxWidth="lg" disableGutters>
            {
                callAccepted ?
                    <VideoPreview
                        isMuted={false}
                        videoRef={userVideo}
                        user={otherUserReducer}
                        showAvatar={showAvatar}
                    /> :
                    <LoadingVideo />
            }
            <VideoPreview
                videoRef={myVid}
                user={userReducer}
                showAvatar={showAvatar}
            />
            <Container className="absolute flex flex-col bottom-5">
                {/* <ButtonContainer>
                    <Button
                        style={{
                            backgroundColor: "green",
                            color: "#fff",
                            width: 100,
                            borderRadius: 9999
                        }}
                        size="large"
                        variant="contained"
                    >
                        Match
                    </Button>
                </ButtonContainer> */}
                <ButtonContainer>
                    <Button
                        onClick={revealHandler}
                        disabled={revealTimer !== 0}
                        style={{
                            backgroundColor: revealTimer !== 0 ? "inherit" : "#0971f1",
                            color: "#fff",
                            width: 100,
                            borderRadius: 9999
                        }}
                        size="large"
                        variant="contained"
                    >
                        {revealTimer !== 0 ? revealTimer : "Reveal"}
                    </Button>
                </ButtonContainer>
                <div className="flex justify-between">
                    <Button sx={{ borderRadius: 9999 }} size="large" variant="outlined">Leave</Button>
                    <Button disabled={!callAccepted ? true : false} onClick={skipHandler} sx={{ width: 100, borderRadius: 9999 }} size="large" variant="outlined">Skip</Button>
                </div>
            </Container>
        </Container>
    );
};

export default Index;
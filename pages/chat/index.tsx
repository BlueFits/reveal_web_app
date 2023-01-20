import { useEffect, useState, MutableRefObject, useRef, useCallback } from "react";
import { Container, Button, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { IReducer } from "../../services/store";
import { IUserReducer, createTempUser, updateStatus } from "../../services/modules/userSlice";
import { genTempUser, apiTempUser, clearState } from "../../services/modules/otherUserSlice";
import VideoPreview from "../../components/VideoPreview/VideoPreview";
import Peer from "simple-peer";
import { socketEmitters } from "../../constants/emitters";
import { setupMediaStream, callUser, answerCall } from "../../utils/videoCall.util";
import socket from "../../config/Socket";
import { tempUserStatus } from "../../server/tempUser/dto/create.tempUser.dto";

export interface ICallObject {
    isReceivedCall: boolean,
    from: IUserReducer,
    signal: any
}

const Index = () => {
    const dispatch = useDispatch();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const otherUserReducer: apiTempUser = useSelector((state: IReducer) => state.otherUser);

    //Video Call Shtuff
    const [stream, setStream] = useState<MediaProvider>();
    const [call, setCall] = useState<Partial<ICallObject>>({});
    const [callAccepted, setCallAccepted] = useState<boolean>(false);

    const myVid: MutableRefObject<HTMLVideoElement> = useRef();
    const userVideo: MutableRefObject<HTMLVideoElement> = useRef();
    const connectionRef: Peer = useRef();
    const intervalRef: MutableRefObject<NodeJS.Timer | null> = useRef(null);

    //Functionality
    const [revealLabel, setRevealLabel] = useState<string>("Reveal");
    const [revealTimer, setRevealTimer] = useState(5);
    const [showMatch, setShowMatch] = useState(false);
    const [showAvatar, setShowAvatar] = useState(true);
    const [connectUserRan, setConnectUserRan] = useState(false);

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
        socket.on(socketEmitters.CALLUSER, ({ from, signal }: { from: IUserReducer, signal: any }) => {
            console.log("Receving a call", from.username);
            setCall({ isReceivedCall: true, from, signal });
        });
        socket.on(socketEmitters.REJECT_CALL, async () => {
            console.log("call rejected attempting connect...");
            dispatch(clearState());
            // connectUser();
        });
        socket.on(socketEmitters.REVEAL_INIT, ({ fromSocket, fromUsername }) => {
            setRevealLabel(`Accept Reveal`)
        });
        /* 
            if call is rejected ->
            retry another user

            will get rid of interval
        */
    }, []);

    // const connectUser: () => void = async () => {
    //     console.log("Finding User...");
    //     const data = await dispatch(genTempUser(userReducer.preference));
    //     console.log("my log", data.payload);
    //     console.log("condition Stream", stream);
    //     console.log("condition callAccepted", !callAccepted);
    //     if (data && data.payload && data.payload.socketID && stream && !callAccepted) {
    //         console.log("Calling user");
    //         callUser(
    //             otherUserReducer.socketID,
    //             stream,
    //             userReducer,
    //             userVideo,
    //             setCallAccepted,
    //             connectionRef,
    //         );
    //     }
    // };

    // const connectUserCallBack = useCallback(async () => {
    //     console.log("Finding User...");
    //     const data = await dispatch(genTempUser(userReducer.preference));
    //     console.log("my log", data.payload);
    //     console.log("condition Stream", stream);
    //     console.log("condition callAccepted", !callAccepted);
    //     if (data && data.payload && data.payload.socketID && stream && !callAccepted) {
    //         console.log("Calling user");
    //         callUser(
    //             otherUserReducer.socketID,
    //             stream,
    //             userReducer,
    //             userVideo,
    //             setCallAccepted,
    //             connectionRef,
    //         );
    //     }
    // }, [stream]);

    useEffect(() => {
        /* Call has been done to user and automatically answer call */
        /* have to set other user reducer here */
        if (call && call.isReceivedCall && !callAccepted) {
            if (connectionRef.current) {
                console.log("Has an ongoing connectionRef");
                connectionRef.current.destroy();
            }
            console.log("call has been answered");
            answerCall(
                stream,
                call,
                userVideo,
                connectionRef,
                setCallAccepted
            );
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
    /* Bug where it generates an arbitrary user's information through otherUserReducer genTempUser */
    useEffect(() => {
        // if (Object.keys(call).length === 0) {

        // }
        const connectUser: () => void = async () => {
            console.log("Finding User...");
            if (otherUserReducer.socketID && stream && !callAccepted) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                console.log("Calling user");
                // callUser(
                //     otherUserReducer.socketID,
                //     stream,
                //     userReducer,
                //     userVideo,
                //     setCallAccepted,
                //     connectionRef,
                // );
            } else {
                intervalRef.current = setInterval(async () => {
                    console.log("Finding User");
                    await dispatch(genTempUser(userReducer.preference));
                }, 3000);
            }
        };
        connectUser();
    }, [otherUserReducer]);

    // useEffect(() => {
    //     if (callAccepted) {
    //         console.log("updating call status to incall for ", userReducer.username);
    //         dispatch(updateStatus(tempUserStatus.IN_CALL));
    //     }
    // }, [callAccepted])


    useEffect(() => {
        if (callAccepted && revealTimer !== 0) {
            setTimeout(() => {
                setRevealTimer(revealTimer - 1);
            }, 1000);
        }
    }, [callAccepted, revealTimer]);

    const ButtonContainer = ({ children }) => (
        <div className="mb-8 flex justify-end">
            {children}
        </div>
    );

    /* No interval is working after skipping */
    const skipHandler = async () => {
        connectionRef.current.destroy();

        setShowAvatar(true);
        setRevealTimer(5);
        setRevealLabel("Reveal");
        setShowMatch(false);

        setCall({});
        setCallAccepted(false);
        // await dispatch(updateStatus(tempUserStatus.WAITING));
        dispatch(clearState());
    };

    /* Not a true hide change this to addStream instead  */
    const revealHandler = () => {
        /* When user press reveal -> await other user */
        /* both user press reveal -> allow reveal */

        const reveal = () => {
            setShowAvatar(false);
            setShowMatch(true);
        };

        if (revealLabel === "Accept Reveal") {
            socket.emit(socketEmitters.ACCEPT_REVEAL, { to: otherUserReducer.socketID });
            reveal();
        } else {
            /* initiate reveal; */
            setRevealLabel("Sent Reveal")
            socket.emit(socketEmitters.REVEAL_INIT, {
                userToReveal: otherUserReducer.socketID,
                fromSocket: userReducer.socketID,
                fromUsername: userReducer.username
            });
            socket.on(socketEmitters.REAVEAL_ACCEPT, () => {
                reveal();
                socket.off(socketEmitters.REAVEAL_ACCEPT);
            });
        }
    };

    return !userReducer.username ? (
        <Typography>Invalid Page Redirecting...</Typography>
    ) : (
        <Container sx={{ display: "flex" }} className="justify-center items-center h-screen flex-col" maxWidth="lg" disableGutters>
            <VideoPreview
                isMuted={false}
                videoRef={userVideo}
                user={otherUserReducer}
                showAvatar={false}
            />
            <VideoPreview
                videoRef={myVid}
                user={userReducer}
                showAvatar={false}
            />
            <Container className="absolute flex flex-col bottom-5">
                {
                    showMatch ?
                        <ButtonContainer>
                            <Button
                                onClick={() => alert("Will be implemented in a future release")}
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
                        </ButtonContainer> :
                        <ButtonContainer>
                            <Button
                                onClick={revealHandler}
                                disabled={revealTimer !== 0 || (revealLabel === "Sent Reveal")}
                                style={{
                                    backgroundColor: revealTimer !== 0 ? "inherit" : "#0971f1",
                                    color: "#fff",
                                    width: 100,
                                    borderRadius: 9999
                                }}
                                size="large"
                                variant="contained"
                            >
                                {revealTimer !== 0 ? revealTimer : revealLabel}
                            </Button>
                        </ButtonContainer>
                }
                <div className="flex justify-between">
                    <Button onClick={() => window.location.href = "/"} sx={{ borderRadius: 9999 }} size="large" variant="outlined">Leave</Button>
                    <Button disabled={!callAccepted ? true : false} onClick={skipHandler} sx={{ width: 100, borderRadius: 9999 }} size="large" variant="outlined">Skip</Button>
                </div>
            </Container>
        </Container>
    );
};

export default Index;
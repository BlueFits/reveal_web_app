import { useEffect, useState, MutableRefObject, useRef, Fragment, forwardRef } from "react";
import { Container, Button, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { IReducer } from "../../services/store";
import { IUserReducer, addUserToMatches } from "../../services/modules/User/userSlice";
import { apiTempUser, setOtherUser, clearState } from "../../services/modules/otherUserSlice";
import VideoPreview from "../../components/VideoPreview/VideoPreview";
import Peer from "simple-peer";
import socketEmitters from "../../constants/types/emitters";
import { joinRoom, setupMediaStream } from "../../utils/videoCall.util";
import socket from "../../utils/Socket/socket.utils";
import { useRouter } from "next/router";
import { currentENV, status } from "../../../config/Server";
import { fmtMSS } from "../../utils/time.utils";
import { findRoom, IRoomReducer, createRoom, removeRoom } from "../../services/modules/roomSlice";
import { acceptCallData, callUserData } from "../../constants/types/callTypes";
import { IAddUserToMatches } from "../../services/modules/User/api";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { TRACKING_ID } from "../../../config/GoogleAnalyticsConfig";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Head from 'next/head'
import Snackbar from '@mui/material/Snackbar';
import { revealStatus, matchStatus, peerMsgInfo } from "../../constants/types/chatPageTypes";
import ButtonContainer from "./components/ButtonContainer";
import analyticEvents from "../../constants/analytics/analyticEvents";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Index = () => {
    const revealTimerNum = currentENV === status.development ? 5 : 60;
    const router = useRouter();
    const dispatch = useDispatch();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const otherUserReducer: apiTempUser = useSelector((state: IReducer) => state.otherUser);
    const roomReducer: IRoomReducer = useSelector((state: IReducer) => state.room);

    const [stream, setStream] = useState<MediaProvider>();
    const [initSetupRan, setInitSetupRan] = useState(false);
    const [reveal, setReveal] = useState<revealStatus>(revealStatus.STANDBY);
    const [match, setMatch] = useState<matchStatus>(matchStatus.STANDBY);
    const [revealTimer, setRevealTimer] = useState(revealTimerNum);
    const [callAccepted, setCallAccepted] = useState(false);
    const [isSkipped, setSkipped] = useState(false);
    const [showMatched, setShowMatched] = useState(false);
    const [peerInfo, setPeerInfo] = useState<peerMsgInfo | "">("");

    const [openChatInfo, setOpenChatInfo] = useState<boolean>(router.query.chatType === "1" ? true : false);
    const [trialUserMsg, setTrialUserMsg] = useState<boolean>(userReducer.isTrial);

    const [userJoinedRoom, setUserJoinedRoom] = useState<boolean>(false);

    const myVid: MutableRefObject<HTMLVideoElement> = useRef();
    const userVideo: MutableRefObject<HTMLVideoElement> = useRef();
    const connectionRef: Peer = useRef();
    const streamRef = useRef<MediaStream>();

    /* if redux is not set properly */

    useEffect(() => {
        if (!userReducer.username || !userReducer.gender) {
            router.push("/dashboard");
        }
    }, [userReducer]);

    //Google Analytics
    useEffect(() => {
        gtag("event", analyticEvents.PAGE.CHAT, {
            page_path: window.location.pathname,
            send_to: TRACKING_ID,
        });
    }, []);

    //MediaStream Setup
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

    /* Call Methods */

    const findRoomThunk = async () => {
        const roomData: { payload: IRoomReducer } = await dispatch(findRoom({
            showMe: userReducer.showMe,
            gender: userReducer.gender,
            roomID: roomReducer._id || null,
            openRoom: router.query.chatType,
            interests: userReducer.interests && userReducer.interests.length > 0 ? userReducer.interests : [],
        }));
        console.log("Joining ", roomData);
        console.log("Joining Payload", roomData.payload);
        if (roomData.payload && roomData.payload._id) {
            setPeerInfo(peerMsgInfo.CONNECTING);
            joinRoom(roomData.payload._id, userReducer.socketID, setUserJoinedRoom);
        } else {
            /* no available rooms for database */
            createRoomExec();
        }
    };

    const createRoomExec = async () => {
        const roomData = await dispatch(createRoom({
            showMe: userReducer.showMe,
            gender: userReducer.gender,
            openRoom: router.query.chatType,
            interests: userReducer.interests && userReducer.interests.length > 0 ? userReducer.interests : [],
        }));
        setPeerInfo(peerMsgInfo.WAITING);
        console.log("Created room id ", roomData.payload._id);
        console.log("Created room payload ", roomData.payload);
        joinRoom(roomData.payload._id, userReducer.socketID, setUserJoinedRoom);
        socket.on(socketEmitters.USER_CONNECTED, async (userID) => {

            setPeerInfo(peerMsgInfo.CONNECTING);

            await dispatch(removeRoom(roomData.payload._id));
            const peer1 = new Peer({
                initiator: true,
                trickle: false,
                stream,
            });
            connectionRef.current = peer1;
            peer1.on("signal", (signal) => {
                const data: callUserData = { toCallID: userID, signal, user: userReducer };
                socket.emit(socketEmitters.CALLUSER, data)
            })
            peer1.on("stream", (currStream) => {
                userVideo.current.srcObject = currStream;
            });
            peer1.on("close", (err) => {
                peer1.destroy();
                socket.off(socketEmitters.CALLACCEPTED)
                connectionRef.current = null;
            });
            peer1.on("error", (err) => {
                console.log("Connection error", err);
            })
            socket.on(socketEmitters.CALLACCEPTED, ({ signal, userAccepting }: Partial<acceptCallData>) => {
                peer1.signal(signal);
                dispatch(setOtherUser(userAccepting));
                // socket.off(socketEmitters.CALLACCEPTED);
                setCallAccepted(true);
            });
            socket.off(socketEmitters.USER_CONNECTED)
        });
    }

    /* For call peer */

    useEffect(() => {
        if (!initSetupRan && stream) {
            socket.on(socketEmitters.USER_DISCONNECTED, () => {
                console.log("User has disconnected in socket");
                setPeerInfo(peerMsgInfo.DISCONNECT);
                setSkipped(true);
                dispatch(clearState());
                setCallAccepted(false);
                setRevealTimer(revealTimerNum);
                // Removed so that show avatar stays even after usker skips
                // setReveal(revealStatus.STANDBY);
            })
            socket.on(socketEmitters.REVEAL_INIT, () => {
                setReveal(revealStatus.CONFIRM);
            })
            socket.on(socketEmitters.MATCH_INIT, () => {
                setMatch(matchStatus.CONFIRM);
            })
            findRoomThunk();
            setInitSetupRan(true);
        }
    }, [initSetupRan, stream]);

    /* For answer peer */
    useEffect(() => {
        if (stream) {
            socket.on(socketEmitters.ROOM_FULL, () => {
                /* room trying to join has reached max capacity */
                console.log("Room is full creating a new room");
                createRoomExec();
            })
            socket.on(socketEmitters.CALLUSER, ({ signal, user }: Partial<callUserData>) => {
                dispatch(setOtherUser(user))
                let peer2 = null;
                if (!connectionRef.current) {
                    console.log("New connection Ref");
                    peer2 = new Peer({
                        trickle: false,
                        initiator: false,
                        stream,
                    });
                    connectionRef.current = peer2;
                    peer2.on("signal", async (signal) => {
                        socket.emit(socketEmitters.ANSWER_CALL, { signal, socketID: user.socketID, userAccepting: userReducer });
                        setCallAccepted(true);
                    })
                    peer2.on("stream", (currStream) => {
                        userVideo.current.srcObject = currStream;
                    })
                    peer2.on("close", (err) => {
                        peer2.destroy();
                        connectionRef.current = null;
                        console.log("User 1 Disconnected");
                    });
                    peer2.on("error", (err) => {
                        console.log("Connection error", err);
                    })
                } else {
                    console.log("Peer already set");
                    peer2 = connectionRef.current;
                }
                peer2.signal(signal);
            });
        }
    }, [stream]);

    /* Reveal timer countdown */
    useEffect(() => {
        if (callAccepted && revealTimer !== 0) {
            setTimeout(() => {
                setRevealTimer(revealTimer - 1);
            }, 1000);
        }
    }, [revealTimer, callAccepted]);

    /* Methods */

    const addVideo = async () => {
        const addMedia = (stream) => {
            myVid.current.srcObject = stream;
            connectionRef.current.addStream(stream);
        };
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        addMedia(stream)
        streamRef.current = stream;
    }

    const revealHandler = () => {
        gtag("event", analyticEvents.CLICK.CHAT_REVEAL_BTTN, {
            page_path: window.location.pathname,
            send_to: TRACKING_ID,
        });
        if (reveal === revealStatus.CONFIRM) {
            setReveal(revealStatus.ACCEPTED);
            socket.emit(socketEmitters.ACCEPT_REVEAL, { to: otherUserReducer });
            addVideo();
        } else {
            socket.emit(socketEmitters.REVEAL_INIT, { from: userReducer, to: otherUserReducer });
            socket.on(socketEmitters.REVEAL_ACCEPT, () => {
                addVideo();
                socket.off(socketEmitters.REVEAL_ACCEPT);
                setReveal(revealStatus.ACCEPTED);
            })
            setReveal(revealStatus.WAITING);
        }
        // socket.emit("checkroom")
    };

    const matchHandler = () => {
        gtag("event", analyticEvents.CLICK.CHAT_MATCH_BTTN, {
            page_path: window.location.pathname,
            send_to: TRACKING_ID,
        });
        const addToMatches = async () => {
            const data: IAddUserToMatches = { userIdToAdd: otherUserReducer._id, _id: userReducer._id };
            const result = await dispatch(addUserToMatches(data)).payload;
            return result;
        }
        if (match === matchStatus.CONFIRM) {
            setMatch(matchStatus.ACCEPTED);
            socket.emit(socketEmitters.ACCEPT_MATCH, { to: otherUserReducer });
            // alert("Congratulations users matched!");
            setShowMatched(true);
            /* Add match logic here */
            addToMatches();
        } else {
            socket.emit(socketEmitters.MATCH_INIT, { from: userReducer, to: otherUserReducer });
            socket.on(socketEmitters.MATCH_ACCEPT, () => {
                // alert("Congratulations users matched!");
                setShowMatched(true);
                socket.off(socketEmitters.MATCH_ACCEPT);
                setMatch(matchStatus.ACCEPTED);
                /* Add match logic here */
                addToMatches();
            })
            setMatch(matchStatus.WAITING);
        }
    };

    const skipHandler = () => {
        gtag("event", analyticEvents.CLICK.CHAT_SKIP_BTTN, {
            page_path: window.location.pathname,
            send_to: TRACKING_ID,
        });
        setPeerInfo(peerMsgInfo.FINDING);
        setSkipped(false);
        setUserJoinedRoom(false);
        setCallAccepted(false);
        setRevealTimer(revealTimerNum);
        setReveal(revealStatus.STANDBY);
        socket.emit(socketEmitters.ROOM_LEAVE)

        /* 
        source of RTC connection bug, essentially calls user twice because it initializes user connected twice so we turn it off 
        when user presses skip
        */
        socket.off(socketEmitters.USER_CONNECTED);

        dispatch(clearState())
        if (connectionRef.current) {
            connectionRef.current.destroy()
            connectionRef.current = null;
        };
        if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
        console.log("skipping...");
        setTimeout(() => {
            findRoomThunk();
        }, 1000);
    };

    const isRevealDisabled = () => !callAccepted || revealTimer !== 0 || (reveal === revealStatus.WAITING) || reveal === revealStatus.ACCEPTED || isSkipped;

    /* Open Chat info */

    const openChatInfoCloseHandler = () => {
        setOpenChatInfo(false);
    }

    const trialMsgCloseHandler = () => {
        setTrialUserMsg(false);
    }

    const action = (
        <Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={openChatInfoCloseHandler}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>
    );

    return !userReducer.username ? (
        <>
            <Head>
                <title>Reveal | Invalid Redirecting...</title>
            </Head>
            <Typography>Invalid Page Redirecting...</Typography>
        </>
    ) : (
        <>
            <Head>
                <title>Reveal | Chat</title>
            </Head>
            <Container sx={{ display: "flex" }} className="justify-center items-center h-screen flex-col" maxWidth="lg" disableGutters>
                {
                    !userReducer.isTrial &&
                    <Snackbar
                        open={openChatInfo}
                        autoHideDuration={5000}
                        onClose={openChatInfoCloseHandler}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        message="Matching is disabled in open chat"
                        action={action}
                    />
                }

                <Snackbar
                    sx={{ maxWidth: 500 }}
                    open={trialUserMsg}
                    autoHideDuration={8 * 1000}
                    onClose={trialMsgCloseHandler}
                    anchorOrigin={{ horizontal: "right", vertical: "top" }}
                >
                    <Alert onClose={trialMsgCloseHandler} severity="info" sx={{ width: '100%' }}>
                        Welcome to Open Chat. Open chat allows for any user to be connected regardless of orientation, however there is no matching, and you
                        will be unable to set your own profile info.
                        Additionally, trial users have a limited amount of functionality, such
                        as limited skips, disabled user info, etc.
                    </Alert>
                </Snackbar>

                {/* Other user preview */}
                <VideoPreview
                    isMuted={false}
                    videoRef={userVideo}
                    user={otherUserReducer}
                    showAvatar={reveal !== revealStatus.ACCEPTED}
                    matched={showMatched}
                    disableDisplay={isSkipped}
                    peerInfo={peerInfo}
                    otherUser={userReducer}
                />

                <VideoPreview
                    videoRef={myVid}
                    user={userReducer}
                    showAvatar={reveal !== revealStatus.ACCEPTED}
                    skipped={isSkipped}
                    matched={showMatched}
                    matchStatus={userReducer.matches.some(match => match._id === otherUserReducer._id) || match === matchStatus.ACCEPTED}
                    callAccepted={callAccepted}
                    otherUser={otherUserReducer}
                />
                <Container className="absolute flex flex-col bottom-5 z-20">
                    {
                        reveal === revealStatus.ACCEPTED && router.query.chatType === "0" ?
                            <ButtonContainer>
                                <Button
                                    onClick={matchHandler}
                                    disabled={userReducer.matches.some(match => match._id === otherUserReducer._id) || match === matchStatus.ACCEPTED || isSkipped}
                                    style={{
                                        backgroundColor: !(userReducer.matches.some(match => match._id === otherUserReducer._id)) && match !== matchStatus.ACCEPTED && !isSkipped ? "#2ecc71" : "inherit",
                                        color: "#fff",
                                        width: 100,
                                        borderRadius: 9999
                                    }}
                                    size="large"
                                    variant="contained"
                                >
                                    {match}
                                </Button>
                            </ButtonContainer> :
                            <ButtonContainer>
                                <Button
                                    onClick={revealHandler}
                                    disabled={isRevealDisabled()}
                                    style={{
                                        backgroundColor: isRevealDisabled() ? "inherit" : "#0971f1",
                                        color: "#fff",
                                        width: 100,
                                        borderRadius: 9999
                                    }}
                                    size="large"
                                    variant="contained"
                                >
                                    {revealTimer !== 0 ? fmtMSS(revealTimer) : reveal}
                                </Button>
                            </ButtonContainer>
                    }
                    <div className="flex justify-between">
                        <Button
                            color="light"
                            onClick={() => window.location.href = "/dashboard"}
                            sx={{ borderRadius: 9999 }}
                            size="large"
                            variant="outlined"
                        >
                            Leave
                        </Button>
                        <Button
                            color="light"
                            disabled={!userJoinedRoom}
                            onClick={skipHandler}
                            sx={{ width: 100, borderRadius: 9999 }}
                            size="large"
                            variant="outlined"
                        >
                            Skip
                        </Button>
                    </div>
                </Container>
            </Container>
        </>
    );
};

export default Index;
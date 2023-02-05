import { useEffect, useState, MutableRefObject, useRef } from "react";
import { Container, Button, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { IReducer } from "../../services/store";
import { IUserReducer, addUserToMatches } from "../../services/modules/User/userSlice";
import { apiTempUser, setOtherUser, clearState } from "../../services/modules/otherUserSlice";
import VideoPreview from "../../components/VideoPreview/VideoPreview";
import Peer from "simple-peer";
import socketEmitters from "../../constants/emitters";
import { joinRoom, setupMediaStream } from "../../utils/videoCall.util";
import socket from "../../../config/Socket";
import { useRouter } from "next/router";
import { currentENV, status } from "../../../config/Server";
import { fmtMSS } from "../../utils/timeUtils";
import { findRoom, IRoomReducer, createRoom, removeRoom } from "../../services/modules/roomSlice";
import { acceptCallData, callUserData } from "../../constants/callTypes";
import { IAddUserToMatches } from "../../services/modules/User/api";

enum revealStatus {
    WAITING = "WAITING",
    ACCEPTED = "ACCEPTED",
    STANDBY = "REVEAL",
    CONFIRM = "CONFIRM",
}

enum matchStatus {
    WAITING = "WAITING",
    ACCEPTED = "ACCEPTED",
    STANDBY = "MATCH",
    CONFIRM = "CONFIRM",
}

const Index = () => {
    const revealTimerNum = currentENV === status.development ? 5 : 120;
    const router = useRouter();
    const dispatch = useDispatch();
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const otherUserReducer: apiTempUser = useSelector((state: IReducer) => state.otherUser);
    const roomReducer: IRoomReducer = useSelector((state: IReducer) => state.room);

    const ButtonContainer = ({ children }) => (
        <div className="mb-8 flex justify-end">
            {children}
        </div>
    );

    //Video Call Shtuff
    const [stream, setStream] = useState<MediaProvider>();
    const [initSetupRan, setInitSetupRan] = useState(false);
    const [reveal, setReveal] = useState<revealStatus>(revealStatus.STANDBY);
    const [match, setMatch] = useState<matchStatus>(matchStatus.STANDBY);
    const [revealTimer, setRevealTimer] = useState(revealTimerNum);
    const [callAccepted, setCallAccepted] = useState(false);

    const [userJoinedRoom, setUserJoinedRoom] = useState<boolean>(false);

    const myVid: MutableRefObject<HTMLVideoElement> = useRef();
    const userVideo: MutableRefObject<HTMLVideoElement> = useRef();
    const connectionRef: Peer = useRef();
    const streamRef = useRef<MediaStream>();

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

    const findRoomThunk = async () => {
        const roomData: { payload: IRoomReducer } = await dispatch(findRoom({
            showMe: userReducer.showMe,
            gender: userReducer.gender,
            roomID: roomReducer._id || null
        }));
        console.log("Joining ", roomData);
        if (roomData.payload && roomData.payload._id) {
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
        }));
        console.log("Created room id ", roomData.payload._id);
        joinRoom(roomData.payload._id, userReducer.socketID, setUserJoinedRoom);
        socket.on(socketEmitters.USER_CONNECTED, async (userID) => {
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
                console.log("$$$ This ran");
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
                        console.log("Answering on client");
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

    /* if redux is not set properly */

    useEffect(() => {
        if (!userReducer.username || !userReducer.gender) {
            router.push("/dashboard");
        }
    }, [userReducer]);

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

        const addToMatches = async () => {
            const data: IAddUserToMatches = { userIdToAdd: otherUserReducer._id, _id: userReducer._id };
            const result = await dispatch(addUserToMatches(data)).payload;
            return result;
        }

        if (match === matchStatus.CONFIRM) {
            setMatch(matchStatus.ACCEPTED);
            socket.emit(socketEmitters.ACCEPT_MATCH, { to: otherUserReducer });
            alert("Congratulations users matched!");
            /* Add match logic here */
            addToMatches();
        } else {
            socket.emit(socketEmitters.MATCH_INIT, { from: userReducer, to: otherUserReducer });
            socket.on(socketEmitters.MATCH_ACCEPT, () => {
                alert("Congratulations users matched!");
                socket.off(socketEmitters.MATCH_ACCEPT);
                setMatch(matchStatus.ACCEPTED);
                /* Add match logic here */
                addToMatches();
            })
            setMatch(matchStatus.WAITING);
        }
    };

    const skipHandler = () => {
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

    return !userReducer.username ? (
        <Typography>Invalid Page Redirecting...</Typography>
    ) : (
        <Container sx={{ display: "flex" }} className="justify-center items-center h-screen flex-col" maxWidth="lg" disableGutters>
            <VideoPreview
                isMuted={false}
                videoRef={userVideo}
                user={otherUserReducer}
                showAvatar={reveal !== revealStatus.ACCEPTED}
            />
            <VideoPreview
                videoRef={myVid}
                user={userReducer}
                showAvatar={reveal !== revealStatus.ACCEPTED}
            />
            <Container className="absolute flex flex-col bottom-5">
                {
                    reveal === revealStatus.ACCEPTED ?
                        <ButtonContainer>
                            <Button
                                onClick={matchHandler}
                                disabled={userReducer.matches.some(match => match._id === otherUserReducer._id) || match === matchStatus.ACCEPTED}
                                style={{
                                    backgroundColor: !(userReducer.matches.some(match => match._id === otherUserReducer._id)) && match !== matchStatus.ACCEPTED ? "#2ecc71" : "inherit",
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
                                disabled={!callAccepted || revealTimer !== 0 || (reveal === revealStatus.WAITING)}
                                style={{
                                    backgroundColor: revealTimer !== 0 || reveal === revealStatus.WAITING ? "inherit" : "#0971f1",
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
                    <Button onClick={() => window.location.href = "/dashboard"} sx={{ borderRadius: 9999 }} size="large" variant="outlined">Leave</Button>
                    <Button disabled={!userJoinedRoom} onClick={skipHandler} sx={{ width: 100, borderRadius: 9999 }} size="large" variant="outlined">Skip</Button>
                </div>
            </Container>
        </Container>
    );
};

export default Index;
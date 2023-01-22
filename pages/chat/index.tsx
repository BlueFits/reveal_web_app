import { useEffect, useState, MutableRefObject, useRef } from "react";
import { Container, Button, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { IReducer } from "../../services/store";
import { IUserReducer } from "../../services/modules/userSlice";
import { apiTempUser, setOtherUser, clearState } from "../../services/modules/otherUserSlice";
import VideoPreview from "../../components/VideoPreview/VideoPreview";
import Peer from "simple-peer";
import { socketEmitters } from "../../constants/emitters";
import { joinRoom, setupMediaStream } from "../../utils/videoCall.util";
import socket from "../../config/Socket";

import { findRoom, IRoomReducer, createRoom, removeRoom } from "../../services/modules/roomSlice";
import { acceptCallData, callUserData } from "../../constants/callTypes";

const Index = () => {
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
        console.log("user pref: ", userReducer.preference);
        const roomData: { payload: IRoomReducer } = await dispatch(findRoom({ preference: userReducer.preference, roomID: roomReducer._id || null }));
        console.log("Joining ", roomData);
        if (roomData.payload && roomData.payload._id) {
            joinRoom(roomData.payload._id, userReducer.socketID);
        } else {
            /* no available rooms for database */
            createRoomExec();
        }
    };

    const createRoomExec = async () => {
        const roomData = await dispatch(createRoom(userReducer.preference));
        console.log("Created room id ", roomData.payload._id);
        joinRoom(roomData.payload._id, userReducer.socketID);
        socket.on(socketEmitters.USER_CONNECTED, async (userID) => {
            console.log("New user connected ", userID);
            await dispatch(removeRoom(roomData.payload._id));

            const peer1 = new Peer({
                initiator: true,
                trickle: false,
                stream,
            });

            connectionRef.current = peer1;

            peer1.on("signal", (signal) => {
                console.log("Sending signal");
                const data: callUserData = { toCallID: userID, signal, user: userReducer };
                socket.emit(socketEmitters.CALLUSER, data)
            })

            peer1.on("stream", (currStream) => {
                console.log("peer 1 picked up a stream");
                userVideo.current.srcObject = currStream;
            });
            peer1.on("close", (err) => {
                peer1.destroy();
                console.log("User 2 Disconnected");
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
            });
            socket.off(socketEmitters.USER_CONNECTED)
        });
    }

    useEffect(() => {
        if (!initSetupRan && stream) {
            socket.on(socketEmitters.USER_DISCONNECTED, () => {
                console.log("User has disconnected in socket");
            })
            findRoomThunk();
            setInitSetupRan(true);
        }
    }, [initSetupRan, stream]);

    useEffect(() => {
        if (stream) {
            socket.on(socketEmitters.ROOM_FULL, () => {
                /* room trying to join has reached max capacity */
                console.log("Room is full creating a new room");
                createRoomExec();
            })

            socket.on(socketEmitters.CALLUSER, ({ signal, user }: Partial<callUserData>) => {
                console.log("getting a connection from", user);
                dispatch(setOtherUser(user))
                let peer2 = null;
                console.log(connectionRef.current);
                if (!connectionRef.current) {
                    console.log("Creating a new peer");
                    peer2 = new Peer({
                        trickle: false,
                        initiator: false,
                        stream,
                    });
                    connectionRef.current = peer2;
                    peer2.on("signal", async (signal) => {
                        socket.emit(socketEmitters.ANSWER_CALL, { signal, socketID: user.socketID, userAccepting: userReducer })
                    })
                    peer2.on("stream", (currStream) => {
                        console.log("Picked up a stream");
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

    useEffect(() => {
        if (!userReducer.username || !userReducer.preference) {
            window.location.href = "/";
        }
    }, [userReducer]);

    const addVideo = async () => {
        const addMedia = (stream) => {
            console.log("My stream ", stream);
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
        addVideo();
        // socket.emit("checkroom")
    };

    const skipHandler = () => {
        socket.emit(socketEmitters.ROOM_LEAVE)
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
                showAvatar={false}
            />
            <VideoPreview
                videoRef={myVid}
                user={userReducer}
                showAvatar={false}
            />
            <Container className="absolute flex flex-col bottom-5">
                {
                    false ?
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
                                disabled={false}
                                style={{
                                    backgroundColor: true ? "inherit" : "#0971f1",
                                    color: "#fff",
                                    width: 100,
                                    borderRadius: 9999
                                }}
                                size="large"
                                variant="contained"
                            >
                                {"reveal"}
                            </Button>
                        </ButtonContainer>
                }
                <div className="flex justify-between">
                    <Button onClick={() => window.location.href = "/"} sx={{ borderRadius: 9999 }} size="large" variant="outlined">Leave</Button>
                    <Button disabled={false} onClick={skipHandler} sx={{ width: 100, borderRadius: 9999 }} size="large" variant="outlined">Skip</Button>
                </div>
            </Container>
        </Container>
    );
};

export default Index;